import prisma from '../server/utils/prisma.js';
import { ChromaClient } from 'chromadb';
import { Mistral } from '@mistralai/mistralai';

const chromaClient = new ChromaClient();

const mistral = new Mistral({ apiKey: process.env.MISTRAL_AI_API_KEY });

let bioCollection;

// const collections = await chromaClient.listCollections();

// if (collections.includes('bios')) {
//     await chromaClient.deleteCollection({ name: 'bios' });
// }

// bioCollection = await chromaClient.createCollection({ name: 'bios' });

bioCollection = await chromaClient.getCollection({ name: 'bios' });

// const bios = [
//     {
//         "id": "A1B2C3D4",
//         "name": "Alice Johnson",
//         "sex": "Female",
//         "preference": "Male",
//         "relationship_type": "Romantic",
//         "bio": "Alice is an outgoing and adventurous person who loves hiking and reading. She is looking for someone who shares her passion for the outdoors and can keep up with her active lifestyle.",
//         "ideal_partner": "Someone who is adventurous, enjoys outdoor activities, and has a good sense of humor."
//     },
//     {
//         "id": "B2C3D4E5",
//         "name": "Bob Smith",
//         "sex": "Male",
//         "preference": "Female",
//         "relationship_type": "Romantic",
//         "bio": "Bob is a software engineer who enjoys coding and playing video games. He is looking for someone who understands his passion for technology and can share his love for gaming.",
//         "ideal_partner": "Someone who is tech-savvy, enjoys gaming, and has a kind heart."
//     },
//     {
//         "id": "C3D4E5F6",
//         "name": "Carol White",
//         "sex": "Female",
//         "preference": "Male",
//         "relationship_type": "Friendship",
//         "bio": "Carol is a teacher who loves reading and traveling. She is looking for friends who share her interests and can join her on her adventures.",
//         "ideal_partner": "Someone who loves to read, travel, and has a positive outlook on life."
//     },
//     {
//         "id": "D4E5F6G7",
//         "name": "David Brown",
//         "sex": "Male",
//         "preference": "Female",
//         "relationship_type": "Romantic",
//         "bio": "David is a fitness enthusiast who enjoys working out and cooking healthy meals. He is looking for someone who shares his passion for fitness and healthy living.",
//         "ideal_partner": "Someone who is fit, enjoys cooking, and has a healthy lifestyle."
//     },
//     {
//         "id": "E5F6G7H8",
//         "name": "Eva Green",
//         "sex": "Female",
//         "preference": "Male",
//         "relationship_type": "Romantic",
//         "bio": "Eva is an artist who loves painting and exploring new art forms. She is looking for someone who appreciates art and can inspire her creativity.",
//         "ideal_partner": "Someone who is creative, appreciates art, and has a unique perspective on life."
//     },
//     {
//         "id": "F6G7H8I9",
//         "name": "Frank Miller",
//         "sex": "Male",
//         "preference": "Female",
//         "relationship_type": "Friendship",
//         "bio": "Frank is a musician who enjoys playing the guitar and writing songs. He is looking for friends who share his love for music and can jam with him.",
//         "ideal_partner": "Someone who loves music, plays an instrument, and has a creative mind."
//     },
//     {
//         "id": "G7H8I9J0",
//         "name": "Grace Lee",
//         "sex": "Female",
//         "preference": "Male",
//         "relationship_type": "Romantic",
//         "bio": "Grace is a yoga instructor who loves practicing yoga and meditation. She is looking for someone who shares her passion for spiritual growth and well-being.",
//         "ideal_partner": "Someone who practices yoga, meditates, and has a calm and peaceful demeanor."
//     },
//     {
//         "id": "H8I9J0K1",
//         "name": "Henry Clark",
//         "sex": "Male",
//         "preference": "Female",
//         "relationship_type": "Romantic",
//         "bio": "Henry is a chef who loves cooking and experimenting with new recipes. He is looking for someone who appreciates good food and can join him in his culinary adventures.",
//         "ideal_partner": "Someone who loves to cook, enjoys trying new foods, and has a passion for culinary arts."
//     },
//     {
//         "id": "I9J0K1L2",
//         "name": "Ivy Turner",
//         "sex": "Female",
//         "preference": "Male",
//         "relationship_type": "Friendship",
//         "bio": "Ivy is a writer who loves reading and writing stories. She is looking for friends who share her love for literature and can inspire her writing.",
//         "ideal_partner": "Someone who loves to read, write, and has a vivid imagination."
//     },
//     {
//         "id": "J0K1L2M3",
//         "name": "Jack Wilson",
//         "sex": "Male",
//         "preference": "Female",
//         "relationship_type": "Romantic",
//         "bio": "Jack is a traveler who loves exploring new places and cultures. He is looking for someone who shares his passion for travel and adventure.",
//         "ideal_partner": "Someone who loves to travel, explore new cultures, and has a sense of adventure."
//     },
//     {
//         "id": "K1L2M3N4",
//         "name": "Karen Davis",
//         "sex": "Female",
//         "preference": "Male",
//         "relationship_type": "Romantic",
//         "bio": "Karen is a dancer who loves performing and teaching dance. She is looking for someone who appreciates dance and can join her in her performances.",
//         "ideal_partner": "Someone who loves to dance, appreciates performing arts, and has a passion for movement."
//     },
//     {
//         "id": "L2M3N4O5",
//         "name": "Leo Martinez",
//         "sex": "Male",
//         "preference": "Female",
//         "relationship_type": "Friendship",
//         "bio": "Leo is a photographer who loves capturing moments and exploring new places. He is looking for friends who share his love for photography and adventure.",
//         "ideal_partner": "Someone who loves photography, exploring new places, and has a creative eye."
//     },
//     {
//         "id": "M3N4O5P6",
//         "name": "Mia Rodriguez",
//         "sex": "Female",
//         "preference": "Male",
//         "relationship_type": "Romantic",
//         "bio": "Mia is a scientist who loves researching and discovering new things. She is looking for someone who shares her passion for science and discovery.",
//         "ideal_partner": "Someone who loves science, research, and has a curious mind."
//     },
//     {
//         "id": "N4O5P6Q7",
//         "name": "Nathan Hall",
//         "sex": "Male",
//         "preference": "Female",
//         "relationship_type": "Romantic",
//         "bio": "Nathan is an entrepreneur who loves starting new businesses and taking on challenges. He is looking for someone who shares his passion for innovation and success.",
//         "ideal_partner": "Someone who is ambitious, loves challenges, and has a business mindset."
//     },
//     {
//         "id": "O5P6Q7R8",
//         "name": "Olivia Young",
//         "sex": "Female",
//         "preference": "Male",
//         "relationship_type": "Friendship",
//         "bio": "Olivia is a designer who loves creating and designing new things. She is looking for friends who share her love for design and creativity.",
//         "ideal_partner": "Someone who loves design, creating new things, and has a creative mind."
//     },
//     {
//         "id": "P6Q7R8S9",
//         "name": "Paul Adams",
//         "sex": "Male",
//         "preference": "Female",
//         "relationship_type": "Romantic",
//         "bio": "Paul is a doctor who loves helping people and making a difference. He is looking for someone who shares his passion for helping others and making the world a better place.",
//         "ideal_partner": "Someone who is compassionate, loves helping others, and has a kind heart."
//     },
//     {
//         "id": "Q7R8S9T0",
//         "name": "Quinn Baker",
//         "sex": "Female",
//         "preference": "Male",
//         "relationship_type": "Romantic",
//         "bio": "Quinn is a musician who loves playing the piano and composing music. She is looking for someone who appreciates music and can join her in her musical journey.",
//         "ideal_partner": "Someone who loves music, plays an instrument, and has a creative mind."
//     },
//     {
//         "id": "R8S9T0U1",
//         "name": "Ryan Carter",
//         "sex": "Male",
//         "preference": "Female",
//         "relationship_type": "Friendship",
//         "bio": "Ryan is a teacher who loves educating and inspiring students. He is looking for friends who share his love for education and making a difference.",
//         "ideal_partner": "Someone who loves teaching, inspiring others, and has a passion for education."
//     },
//     {
//         "id": "S9T0U1V2",
//         "name": "Sophia Turner",
//         "sex": "Female",
//         "preference": "Male",
//         "relationship_type": "Romantic",
//         "bio": "Sophia is a writer who loves telling stories and creating new worlds. She is looking for someone who appreciates literature and can inspire her writing.",
//         "ideal_partner": "Someone who loves to read, write, and has a vivid imagination."
//     },
//     {
//         "id": "T0U1V2W3",
//         "name": "Tom Harris",
//         "sex": "Male",
//         "preference": "Female",
//         "relationship_type": "Romantic",
//         "bio": "Tom is a fitness coach who loves helping people achieve their fitness goals. He is looking for someone who shares his passion for fitness and healthy living.",
//         "ideal_partner": "Someone who is fit, enjoys working out, and has a healthy lifestyle."
//     },
//     {
//         "id": "U1V2W3X4",
//         "name": "Uma Patel",
//         "sex": "Female",
//         "preference": "Male",
//         "relationship_type": "Friendship",
//         "bio": "Uma is a yoga instructor who loves practicing yoga and meditation. She is looking for friends who share her passion for spiritual growth and well-being.",
//         "ideal_partner": "Someone who practices yoga, meditates, and has a calm and peaceful demeanor."
//     }
// ];

// bios.forEach(async (bio) => {
//     let user = await prisma.user.findUnique({
//         where: {
//             spotifyId: bio.id
//         }
//     });

//     if (user) {
//         await prisma.user.delete({
//             where: {
//                 spotifyId: bio.id
//             }
//         });
//     }

//     user = await prisma.user.create({
//         data: {
//             spotifyId: bio.id,
//             email: 'rvrbk.dev@gmail.com',
//             displayName: bio.name,
//             country: 'NL',
//             profileImageUrl: 'https://picsum.photos/400',
//         }
//     });
    
//     await bioCollection.upsert({ 
//         ids: [user.uuid],
//         documents: [bio.bio],
//         metadatas: [{ userUuid: user.uuid }] 
//     });
// });

// const vectorBios = await bioCollection.get();

// console.log(vectorBios);

const engineer = `Alex "Hoppy" Thompson is a passionate software developer by day and an avid gamer and beer connoisseur by night. Born and raised in a small town, Alex developed a love for video games at a young age, spending countless hours exploring virtual worlds and honing his skills in competitive online gaming. His favorite genres include RPGs, strategy games, and first-person shooters.

When he's not coding or gaming, Alex can be found exploring the world of craft beers. He enjoys visiting local breweries, attending beer festivals, and even brewing his own batches at home. His friends often joke that he has a "beer radar," always knowing where to find the best and most unique brews.

Alex believes that gaming and beer go hand in hand, often hosting game nights with friends where they enjoy a variety of beers while competing in multiplayer games. He has even started a blog where he reviews both video games and craft beers, combining his two passions into one creative outlet.

Despite his busy schedule, Alex makes time for his hobbies, believing that they help him unwind and stay creative. He is always on the lookout for the next big game release or the newest craft beer to try, and he loves sharing his discoveries with others.
    `;

const outdoor = `Meet Bert, an outdoor enthusiast with a deep passion for mountain biking. Whether it's conquering rugged trails or exploring new landscapes, Bert finds joy and exhilaration in the great outdoors.

With a spirit of adventure and a love for nature, Bert spends every free moment on two wheels, navigating challenging terrains and immersing in the beauty of the wilderness. The thrill of the ride, the fresh air, and the sense of freedom are what drive Bert to push boundaries and seek new experiences.

Beyond mountain biking, Bert enjoys hiking, camping, and any activity that brings him closer to nature. He values the simplicity and tranquility of the outdoors, using these moments to recharge and connect with the environment.

Bert is always eager to share his adventures and inspire others to embrace the outdoors. Whether it's a solo expedition or a group ride with friends, Bert believes that every journey is an opportunity for growth and discovery.

Join Bert on the next adventure and experience the world from a new perspective!`;

const fitness = `eet [Name], a dedicated fitness guru who embodies health, strength, and wellness. With a passion for helping others achieve their fitness goals, [Name] is committed to inspiring and motivating individuals to lead active and healthy lifestyles.

As a certified personal trainer and nutrition coach, [Name] combines expertise with a personalized approach to fitness. Whether it's through high-intensity workouts, yoga sessions, or customized meal plans, [Name] empowers clients to push their limits and transform their bodies and minds.

[Name] believes that fitness is not just about looking good but feeling great. With a holistic approach, [Name] focuses on building strength, improving flexibility, and enhancing overall well-being. Through dedication, discipline, and a positive mindset, [Name] helps clients overcome challenges and celebrate their achievements.

Beyond the gym, [Name] shares fitness tips, workout routines, and healthy recipes on social media, reaching a wider audience and creating a community of like-minded individuals. [Name]'s energy and enthusiasm are contagious, making every workout session an enjoyable and rewarding experience.

Join [Name] on the journey to a healthier, happier you, and discover the power of fitness to transform your life!`;

// const results = await bioCollection.query({
//     queryTexts: [fitness],
//     nResults: 1
// });

// console.log(results);

await bioCollection.delete({
    ids: ['107829c6-43a6-4b39-a5cb-ae592b623481']
})