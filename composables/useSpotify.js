import { ref } from 'vue';
import { useState } from '#app';
import axios from 'axios';
import { useLocalStorage } from './useLocalStorage';
 
export function useSpotify() {
    const isLoading = ref(false);
    const error = ref(null);
    
    const connected = useState('connected', () => false);

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
            error.value = err.message;
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

    function disconnect() {
        const { removeItem } = useLocalStorage();

        removeItem('spotifyCode');

        connected.value = false;
    }

    function  setConnected(bool) {
        connected.value = bool;
    }

    function isConnected() {
        return connected.value;
    }

    return {
        isLoading,
        error,
        connected,
        spotifyFetch,
        getUserProfile,
        getRecentlyPlayed,
        getTopTracks,
        disconnect,
        isConnected,
        setConnected
    }
}