import { getQuery } from 'h3';
import prisma from '~/server/utils/prisma';
import { ChromaClient } from 'chromadb';

export default defineEventHandler(async (e) => {
    const { userUuid } = getQuery(e);

    try {
        const chromaClient = new ChromaClient();

        const user = await prisma.user.findUnique({
            where: {
                uuid: userUuid
            }
        });

        let collection = await chromaClient.getCollection({ name: 'bios' });

        const bios = await collection.get({
            ids: [userUuid]
        });

        if (bios.documents.length > 0) {
            const matches = await collection.query({
                queryTexts: [bios.documents[0]],
                where: {
                    'uuid': {
                        '$ne': userUuid
                    }
                },
                nResults: 1
            });

            console.log(matches);
        }

        // const results = await bioCollection.query({
//     queryTexts: [fitness],
//     nResults: 1
// });

// console.log(results);


        // let bioCollection;

        // const collections = await chromaClient.listCollections();
        
        // if (!collections.includes('bios')) {
        //     bioCollection = await chromaClient.createCollection({ name: 'bios' });
        // }
        // else {
        //     bioCollection = await chromaClient.getCollection({ name: 'bios' });
        // }

        // const existingBio = await bioCollection.get({
        //     ids: [`${userId}`],
        //     where: { 'userId': userId }
        // });

        // if (existingBio) {
        //     await bioCollection.update({ 
        //         ids: [`${userId}`],
        //         documents: [bio],
        //         metadatas: [{ userId: userId }] 
        //     }); 
        // }
        // else {
        //     await bioCollection.add({ 
        //         ids: [`${userId}`],
        //         documents: [bio],
        //         metadatas: [{ userId: userId }] 
        //     });
        // }
    } 
    catch (error) {
        console.error(error);
            
        throw createError({
            statusCode: 500,
            message: error
        });
    }
 });