import prisma from '../server/utils/prisma.js';
import { ChromaClient } from 'chromadb';

const chromaClient = new ChromaClient();

let bioCollection;

const collections = await chromaClient.listCollections();

if (collections.includes('bios')) {
    await chromaClient.deleteCollection({ name: 'bios' });

    bioCollection = await chromaClient.createCollection({ name: 'bios' });
}
else {
    bioCollection = await chromaClient.getCollection({ name: 'bios' });
}

const bios = [
    {
        "id": "A1B2C3D4",
        "name": "Alice Johnson",
        "sex": "Female",
        "preference": "Male",
        "relationship_type": "Romance",
        "bio": "Alice is an outgoing and adventurous person who loves hiking and reading. She is looking for someone who shares her passion for the outdoors and can keep up with her active lifestyle.",
        "ideal_partner": "Someone who is adventurous, enjoys outdoor activities, and has a good sense of humor."
    },
    {
        "id": "B2C3D4E5",
        "name": "Bob Smith",
        "sex": "Male",
        "preference": "Female",
        "relationship_type": "Romance",
        "bio": "Bob is a software engineer who enjoys coding and playing video games. He is looking for someone who understands his passion for technology and can share his love for gaming.",
        "ideal_partner": "Someone who is tech-savvy, enjoys gaming, and has a kind heart."
    },
    {
        "id": "C3D4E5F6",
        "name": "Carol White",
        "sex": "Female",
        "preference": "Male",
        "relationship_type": "Friends",
        "bio": "Carol is a teacher who loves reading and traveling. She is looking for friends who share her interests and can join her on her adventures.",
        "ideal_partner": "Someone who loves to read, travel, and has a positive outlook on life."
    },
    {
        "id": "D4E5F6G7",
        "name": "David Brown",
        "sex": "Male",
        "preference": "Female",
        "relationship_type": "Romance",
        "bio": "David is a fitness enthusiast who enjoys working out and cooking healthy meals. He is looking for someone who shares his passion for fitness and healthy living.",
        "ideal_partner": "Someone who is fit, enjoys cooking, and has a healthy lifestyle."
    },
    {
        "id": "E5F6G7H8",
        "name": "Eva Green",
        "sex": "Female",
        "preference": "Male",
        "relationship_type": "Romance",
        "bio": "Eva is an artist who loves painting and exploring new art forms. She is looking for someone who appreciates art and can inspire her creativity.",
        "ideal_partner": "Someone who is creative, appreciates art, and has a unique perspective on life."
    },
    {
        "id": "F6G7H8I9",
        "name": "Frank Miller",
        "sex": "Male",
        "preference": "Female",
        "relationship_type": "Friends",
        "bio": "Frank is a musician who enjoys playing the guitar and writing songs. He is looking for friends who share his love for music and can jam with him.",
        "ideal_partner": "Someone who loves music, plays an instrument, and has a creative mind."
    },
    {
        "id": "G7H8I9J0",
        "name": "Grace Lee",
        "sex": "Female",
        "preference": "Male",
        "relationship_type": "Romance",
        "bio": "Grace is a yoga instructor who loves practicing yoga and meditation. She is looking for someone who shares her passion for spiritual growth and well-being.",
        "ideal_partner": "Someone who practices yoga, meditates, and has a calm and peaceful demeanor."
    },
    {
        "id": "H8I9J0K1",
        "name": "Henry Clark",
        "sex": "Male",
        "preference": "Female",
        "relationship_type": "Romance",
        "bio": "Henry is a chef who loves cooking and experimenting with new recipes. He is looking for someone who appreciates good food and can join him in his culinary adventures.",
        "ideal_partner": "Someone who loves to cook, enjoys trying new foods, and has a passion for culinary arts."
    },
    {
        "id": "I9J0K1L2",
        "name": "Ivy Turner",
        "sex": "Female",
        "preference": "Male",
        "relationship_type": "Friends",
        "bio": "Ivy is a writer who loves reading and writing stories. She is looking for friends who share her love for literature and can inspire her writing.",
        "ideal_partner": "Someone who loves to read, write, and has a vivid imagination."
    },
    {
        "id": "J0K1L2M3",
        "name": "Jack Wilson",
        "sex": "Male",
        "preference": "Female",
        "relationship_type": "Romance",
        "bio": "Jack is a traveler who loves exploring new places and cultures. He is looking for someone who shares his passion for travel and adventure.",
        "ideal_partner": "Someone who loves to travel, explore new cultures, and has a sense of adventure."
    },
    {
        "id": "K1L2M3N4",
        "name": "Karen Davis",
        "sex": "Female",
        "preference": "Male",
        "relationship_type": "Romance",
        "bio": "Karen is a dancer who loves performing and teaching dance. She is looking for someone who appreciates dance and can join her in her performances.",
        "ideal_partner": "Someone who loves to dance, appreciates performing arts, and has a passion for movement."
    },
    {
        "id": "L2M3N4O5",
        "name": "Leo Martinez",
        "sex": "Male",
        "preference": "Female",
        "relationship_type": "Friends",
        "bio": "Leo is a photographer who loves capturing moments and exploring new places. He is looking for friends who share his love for photography and adventure.",
        "ideal_partner": "Someone who loves photography, exploring new places, and has a creative eye."
    },
    {
        "id": "M3N4O5P6",
        "name": "Mia Rodriguez",
        "sex": "Female",
        "preference": "Male",
        "relationship_type": "Romance",
        "bio": "Mia is a scientist who loves researching and discovering new things. She is looking for someone who shares her passion for science and discovery.",
        "ideal_partner": "Someone who loves science, research, and has a curious mind."
    },
    {
        "id": "N4O5P6Q7",
        "name": "Nathan Hall",
        "sex": "Male",
        "preference": "Female",
        "relationship_type": "Romance",
        "bio": "Nathan is an entrepreneur who loves starting new businesses and taking on challenges. He is looking for someone who shares his passion for innovation and success.",
        "ideal_partner": "Someone who is ambitious, loves challenges, and has a business mindset."
    },
    {
        "id": "O5P6Q7R8",
        "name": "Olivia Young",
        "sex": "Female",
        "preference": "Male",
        "relationship_type": "Friends",
        "bio": "Olivia is a designer who loves creating and designing new things. She is looking for friends who share her love for design and creativity.",
        "ideal_partner": "Someone who loves design, creating new things, and has a creative mind."
    },
    {
        "id": "P6Q7R8S9",
        "name": "Paul Adams",
        "sex": "Male",
        "preference": "Female",
        "relationship_type": "Romance",
        "bio": "Paul is a doctor who loves helping people and making a difference. He is looking for someone who shares his passion for helping others and making the world a better place.",
        "ideal_partner": "Someone who is compassionate, loves helping others, and has a kind heart."
    },
    {
        "id": "Q7R8S9T0",
        "name": "Quinn Baker",
        "sex": "Female",
        "preference": "Male",
        "relationship_type": "Romance",
        "bio": "Quinn is a musician who loves playing the piano and composing music. She is looking for someone who appreciates music and can join her in her musical journey.",
        "ideal_partner": "Someone who loves music, plays an instrument, and has a creative mind."
    },
    {
        "id": "R8S9T0U1",
        "name": "Ryan Carter",
        "sex": "Male",
        "preference": "Female",
        "relationship_type": "Friends",
        "bio": "Ryan is a teacher who loves educating and inspiring students. He is looking for friends who share his love for education and making a difference.",
        "ideal_partner": "Someone who loves teaching, inspiring others, and has a passion for education."
    },
    {
        "id": "S9T0U1V2",
        "name": "Sophia Turner",
        "sex": "Female",
        "preference": "Male",
        "relationship_type": "Romance",
        "bio": "Sophia is a writer who loves telling stories and creating new worlds. She is looking for someone who appreciates literature and can inspire her writing.",
        "ideal_partner": "Someone who loves to read, write, and has a vivid imagination."
    },
    {
        "id": "T0U1V2W3",
        "name": "Tom Harris",
        "sex": "Male",
        "preference": "Female",
        "relationship_type": "Romance",
        "bio": "Tom is a fitness coach who loves helping people achieve their fitness goals. He is looking for someone who shares his passion for fitness and healthy living.",
        "ideal_partner": "Someone who is fit, enjoys working out, and has a healthy lifestyle."
    },
    {
        "id": "U1V2W3X4",
        "name": "Uma Patel",
        "sex": "Female",
        "preference": "Male",
        "relationship_type": "Friends",
        "bio": "Uma is a yoga instructor who loves practicing yoga and meditation. She is looking for friends who share her passion for spiritual growth and well-being.",
        "ideal_partner": "Someone who practices yoga, meditates, and has a calm and peaceful demeanor."
    }
];

bios.forEach(async (bio) => {
    let user = await prisma.user.findUnique({
        where: {
            uuid: bio.id
        }
    });

    if (user) {
        await prisma.user.delete({
            where: {
                uuid: bio.id
            }
        });
    }

    user = await prisma.user.create({
        data: {
            spotifyId: bio.id,
            uuid: bio.id,
            sex: bio.sex,
            preference: bio.preference,
            goal: bio.relationship_type,
            email: 'rvrbk.dev@gmail.com',
            displayName: bio.name,
            country: 'NL',
            profileImageUrl: 'https://picsum.photos/400',
        }
    });
    
    await bioCollection.upsert({ 
        ids: [user.uuid],
        documents: [bio.bio],
        metadatas: [{ 
            uuid: user.uuid,
            sex: bio.sex,
            preference: bio.preference,
            goal: bio.relationship_type
        }] 
    });
});