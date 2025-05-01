import prisma from '../server/utils/prisma.js';
import { ChromaClient } from 'chromadb';
import { Mistral } from '@mistralai/mistralai';

const chromaClient = new ChromaClient();

const mistral = new Mistral({ apiKey: process.env.MISTRAL_AI_API_KEY });

const bioCollection = await chromaClient.getCollection({ name: 'bios' });

const users = await prisma.user.findMany();

users.forEach(async (user) => {
    const { sex, preference, goal, uuid } = user;
    
    const bios = await bioCollection.get({
        ids: [uuid]
    });

    if (sex && goal && preference && bios.documents.length > 0) {
        let conditions = {
            '$and': [
                { 'uuid': { '$ne': uuid } },
                { 'goal': { '$eq': goal } },
                { 'sex': { '$eq': preference } }
            ]
        };

        if (!preference) {
            conditions = {
                '$and': [
                    { 'uuid': { '$ne': uuid } },
                    { 'goal': { '$eq': goal } },
                    {
                        '$or': [
                            { 'sex': { '$eq': sex } },
                            { 'sex': { '$eq': 'NoPreference' } }
                        ]
                    }
                ]
            };
        }
        
        const matches = await bioCollection.query({
            queryTexts: [bios.documents[0]],
            where: conditions,
            nResults: 3
        });

        if (matches.ids.length > 0) {
            matches.ids[0].forEach(async (matchUuid, key) => {
                const match = await prisma.matches.findFirst({
                    where: {
                        uuid: uuid,
                        match_uuid: matchUuid
                    }
                });

                if (!match || true) {
                    await prisma.matches.create({
                        data: {
                            uuid: uuid,
                            match_uuid: matchUuid,
                            distance: matches.distances[0][key],
                            reason: ''
                        }
                    });
                }
            });
        }
    }
});