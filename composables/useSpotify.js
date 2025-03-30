import { ref, reactive } from 'vue';
import axios from 'axios';
 
export function useSpotify() {
    const isLoading = ref(false);
    const error = ref(null);

    async function spotifyFetch(endpoint, accessToken, options = {}) {
        isLoading.value = true;
        error.value = true;

        try {
            const response = await axios({
                url: `https://api.spotify.com/v1${endpoint}`,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            return response;
        }
        catch (err) {
            error.value = err.message || 'Failed to fetch from Spotify API';
            throw err;
        }
        finally {
            isLoading.value = false;
        }
    }

    async function getUserProfile(accessToken) {
        return await spotifyFetch('/me', accessToken);
    }
    
    async function getRecentlyPlayed(accessToken, limit = 20) {
        return await spotifyFetch(`/me/player/recently-played?limit=${limit}`, accessToken);
    }
    
    async function getTopTracks(accessToken, timeRange = 'medium_term', limit = 20) {
        return await spotifyFetch(`/me/top/tracks?time_range=${timeRange}&limit=${limit}`, accessToken);
    }

    return {
        isLoading,
        error,
        spotifyFetch,
        getUserProfile,
        getRecentlyPlayed,
        getTopTracks
    }
}