import { readBody } from 'h3';
import prisma from '~/server/utils/prisma';

export default defineEventHandler(async (e) => {
    const body = await readBody(e);

    try {
        const user = await prisma.user.update({
            where: {
                spotifyId: body.spotifyId
            },
            data: {
                sex: body.sex,
                preference: body.preference,
                goal: body.goal   
            }
        });

        return user;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
});