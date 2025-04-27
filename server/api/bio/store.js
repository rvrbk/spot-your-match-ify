import { ChromaClient } from 'chromadb';
 
 export default defineEventHandler(async (e) => {
    const { userUuId, bio } = await readBody(e);
    const config = useRuntimeConfig();
    
    try {
        const chromaClient = new ChromaClient();

        const collections = await chromaClient.listCollections();

        if (!collections.includes('bios')) {
            await chromaClient.createCollection({ name: 'bios' });
        }

        let collection = await chromaClient.getCollection({ name: 'bios' });

        await collection.upsert({ 
            ids: [userUuId],
            documents: [bio],
            metadatas: [{ 'uuid': userUuId }] 
        });
    } 
    catch (error) {
        console.error(error);
            
        throw createError({
            statusCode: 500,
            message: error
        });
    }
});