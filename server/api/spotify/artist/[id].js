import axios from 'axios';
import useSpotifyAuth from '~/composables/useSpotifyAuth';

export default defineEventHandler(async (e) => {
    const accessToken = await useSpotifyAuth();
    
    try {
        const response = await axios({
            method: 'GET',
            url: `https://api.spotify.com/v1/artists/${e.context.params.id}`,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        return response.data;
      } catch (error) {
        console.error('Error fetching artist data:', error);
        throw error;
      }
});