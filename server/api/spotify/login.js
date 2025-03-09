import axios from 'axios';
import { getQuery } from 'h3';
import { getRedisClient } from '~/server/utils/redis';

export default defineEventHandler(async (e) => {
    const config = useRuntimeConfig();
    const query = getQuery(e);

    const redis = await getRedisClient();

    try {
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

                return response.data.access_token;
            }

            return await redis.get('spotify:accessToken');
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

            return response.data.access_token;
        }
    } catch (error) {
        console.error('Error fetching Spotify access token:', error);
        throw error;
    }
});