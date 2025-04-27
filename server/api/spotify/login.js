import axios from 'axios';
import { getQuery } from 'h3';
import { getRedisClient } from '~/server/utils/redis';
import prisma from '~/server/utils/prisma';

export default defineEventHandler(async (e) => {
    const config = useRuntimeConfig();
    const query = getQuery(e);

    const redis = await getRedisClient();

    try {
        let accessToken;

        const refreshToken = await redis.get('spotify:refreshToken');

        if (refreshToken) {
            const expiresAt = await redis.get('spotify:expiresAt');

            if (Date.now() > expiresAt) {
                const response = await axios({
                    method: 'post',
                    url: 'https://accounts.spotify.com/api/token',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: new URLSearchParams({
                        grant_type: 'refresh_token',
                        refresh_token: refreshToken,
                        client_id: config.public.spotifyClientId,
                        client_secret: config.spotifyClientSecret
                    })
                });

                redis.set('spotify:accessToken', response.data.access_token);
                redis.set('spotify:refreshToken', response.data.refresh_token);
                redis.set('spotify:expiresAt', Date.now() + (response.data.expires_in * 1000));

                accessToken = response.data.access_token;
            }

            accessToken = await redis.get('spotify:accessToken');
        }
        else {
            const response = await axios({
                method: 'post',
                url: 'https://accounts.spotify.com/api/token',
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${config.public.spotifyClientId}:${config.spotifyClientSecret}`).toString('base64')}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: new URLSearchParams({
                    grant_type: 'authorization_code',
                    code: query.code,
                    redirect_uri: config.public.spotifyRedirectUri
                })
            });

            redis.set('spotify:accessToken', response.data.access_token);
            redis.set('spotify:refreshToken', response.data.refresh_token);
            redis.set('spotify:expiresAt', Date.now() + (response.data.expires_in * 1000));

            accessToken = response.data.access_token;
        }

        const userResponse = await axios({
            method: 'get',
            url: 'https://api.spotify.com/v1/me',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        const spotifyUser = userResponse.data;
        
        let user = await prisma.user.findUnique({
            where: {
                spotifyId: spotifyUser.id
            }
        });

        let isNewUser = true;
        
        if (user) {
            isNewUser = false;

            user = await prisma.user.update({
                where: {
                    spotifyId: spotifyUser.id
                },
                data: {
                    email: spotifyUser.email,
                    displayName: spotifyUser.display_name,
                    country: spotifyUser.country,
                    profileImageUrl: spotifyUser.images && spotifyUser.images.length > 0 ? spotifyUser.images[0].url : null
                }
            });
        }
        else {
            user = await prisma.user.create({
                data: {
                    spotifyId: spotifyUser.id,
                    email: spotifyUser.email,
                    displayName: spotifyUser.display_name,
                    country: spotifyUser.country,
                    profileImageUrl: spotifyUser.images && spotifyUser.images.length > 0 ? spotifyUser.images[0].url : null,
                }
            });
        }

        await redis.set('spotify:userId', user.id);

        return {
            accessToken,
            user,
            isNewUser
        };
    } 
    catch (error) {
        console.error(error);
        throw error;
    }
});