<template>
    <div class="flex justify-center items-center h-screen">
        <a href="#" @click.prevent="handleSpotifyConnectClick">Connect to Spotify</a>
    </div>
</template>

<script setup>
    import { onMounted } from 'vue';
    import { useSpotifyAuthStore } from '~/stores/spotifyAuthStore';

    const spotifyAuthStore = useSpotifyAuthStore();

    onMounted(() => {
        window.addEventListener('message', (e) => {
            const { source, code, state } = e.data;

            const config = useRuntimeConfig();
            
            if (source === 'spotify-auth') {
                if (code && state === config.public.spotifyState) {
                    spotifyAuthStore.setCode(code);
                }
            }
        });
    });
 
    const handleSpotifyConnectClick = async () => {
        const config = useRuntimeConfig();

        window.open(`https://accounts.spotify.com/authorize?${new URLSearchParams({
            response_type: 'code',
            client_id: config.public.spotifyClientId,
            scope: 'user-read-private user-read-email',
            redirect_uri: config.public.spotifyRedirectUri,
            state: config.public.spotifyState
        }).toString()}`, 'Spotify Authentication', 'width=500,height=600,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes');
    }
</script>