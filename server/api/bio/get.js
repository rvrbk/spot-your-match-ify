import { getQuery } from 'h3';
import { ChromaClient } from 'chromadb';

export default defineEventHandler(async (e) => {
    const { userUuId } = await getQuery(e);
    const config = useRuntimeConfig();

    try {
        const chromaClient = new ChromaClient();

        const bioCollection = await chromaClient.getCollection({ name: 'bios' });

        const bios = await bioCollection.get({
            ids: [userUuId]
        });

        if (bios.documents.length > 0) {
            return bios.documents;
        }

        return [];
    } 
    catch (error) {
        console.error(error);
            
        throw createError({
            statusCode: 500,
            message: error
        });
    }
});