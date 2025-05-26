import { getQuery } from 'h3';
import prisma from '~/server/utils/prisma';
import { ChromaClient } from 'chromadb';

export default defineEventHandler(async (e) => {
    const { uuid } = await getQuery(e);
    const config = useRuntimeConfig();

    try {
        const chromaClient = new ChromaClient();

        const user = await prisma.user.findUnique({
            where: {
                uuid
            }
        });
        
        const { sex, preference, goal } = user;

        console.log(sex, preference, goal);


        const bioCollection = await chromaClient.getCollection({ name: 'bios' });

        const bios = await bioCollection.get({
            ids: [uuid]
        });

        if (bios.documents.length > 0 && sex && goal) {
            let where = {
                where: {
                    'uuid': {
                        '$ne': uuid
                    }
                },
                '$and': {
                    'goal': {
                        '$eq': goal
                    }
                }
            };

            if (preference) {
                where['$and'] = {
                    'sex': preference
                }
            }
            else {
                where['$or'] = [{
                    'sex': 'Male'
                }, {
                    'sex': 'Female'
                }];

                where['$or'] = [{
                    'preference': sex
                }, {
                    'preference': null
                }];
            }

            console.log(where);

            const matches = await bioCollection.query({
                queryTexts: [bios.documents[0]],
                where,
                nResults: 3
            });

            console.log(matches);
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




// import { getQuery } from 'h3';
// import prisma from '~/server/utils/prisma';
// import { ChromaClient } from 'chromadb';

// const chromaClient = new ChromaClient();

// export default defineEventHandler(async (e) => {
//     const { userUuid } = getQuery(e);

//     try {
//         const user = await prisma.user.findUnique({
//             where: {
//                 uuid: userUuid
//             }
//         });
        
//         const { sex, preference, goal } = user;

//         console.log(sex, preference, goal);

//         let collection = await chromaClient.getCollection({ name: 'bios' });

//         const bios = await collection.get({
//             ids: [userUuid]
//         });

//         if (bios.documents.length > 0 && sex && goal) {
//             let where = {
//                 where: {
//                     'uuid': {
//                         '$ne': userUuid
//                     }
//                 },
//                 '$and': {
//                     'goal': {
//                         '$eq': goal
//                     }
//                 }
//             };

//             if (preference) {
//                 where['$and'] = {
//                     'sex': preference
//                 }
//             }
//             else {
//                 where['$or'] = [{
//                     'sex': 'Male'
//                 }, {
//                     'sex': 'Female'
//                 }];

//                 where['$or'] = [{
//                     'preference': sex
//                 }, {
//                     'preference': null
//                 }];
//             }

//             console.log(where);

//             const matches = await collection.query({
//                 queryTexts: [bios.documents[0]],
//                 where,
//                 nResults: 3
//             });

//             console.log(matches);
//         }
//     } 
//     catch (error) {
//         console.error(error);
            
//         throw createError({
//             statusCode: 500,
//             message: error
//         });
//     }
//  });