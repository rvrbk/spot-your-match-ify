import axios from 'axios';

export default defineEventHandler(async (e) => {
    const config = useRuntimeConfig();

    try {
        const response = await axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                'Authorization': `Basic ${Buffer.from(`${config.public.spotifyClientId}:${config.spotifyClientSecret}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: new URLSearchParams({
                'grant_type': 'client_credentials'
            })
        });
        
        return response.data;
    } catch (error) {
        console.error('Error fetching Spotify token:', error);
        throw error;
    }
});