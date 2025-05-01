import { readBody } from 'h3';
import prisma from '~/server/utils/prisma';
import { ChromaClient } from 'chromadb';

export default defineEventHandler(async (e) => {
    const { userUuId, sex, preference, goal } = await readBody(e);

    try {
        const user = await prisma.user.update({
            where: {
                uuid: userUuId
            },
            data: {
                sex: sex,
                preference: preference,
                goal: goal   
            }
        });

        const chromaClient = new ChromaClient();

        let collection = await chromaClient.getCollection({ name: 'bios' });

        await collection.update({ 
            ids: [userUuId],
            metadatas: [{
                sex: sex,
                preference: preference,
                goal: goal   
            }] 
        });

        return user;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
});