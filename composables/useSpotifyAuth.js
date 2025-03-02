import { ref, readonly } from 'vue';

export default async function useSpotifyAuth() {
    const accessToken = ref(null);
    const tokenExpiration = ref(null); 
    
    const getSpotifyAccessToken = async () => {
        const currentTime = Date.now();

        if (!accessToken.value || !tokenExpiration.value || currentTime > tokenExpiration.value - 60000) {
            const { access_token, expires_in } = await $fetch('/api/spotify/login');

            accessToken.value = access_token;
            tokenExpiration.value = Date.now() + (expires_in * 1000);  
        }

        return accessToken.value;
    }

    return await getSpotifyAccessToken();
}