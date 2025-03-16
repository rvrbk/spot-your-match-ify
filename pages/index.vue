<template>
    <div class="flex justify-center items-center h-screen">
        <a href="#" @click.prevent="handleSpotifyConnectClick">Connect to Spotify</a>
    </div>
</template>

<script setup>
    import { onMounted } from 'vue';
    import { useSpotify } from '~/composables/useSpotify';

    onMounted(() => {
        const { getTopTracks } = useSpotify();

        window.addEventListener('message', async (e) => {
            const { source, code, state } = e.data;

            const config = useRuntimeConfig();
            
            if (source === 'spotify-auth') {
                if (code && state === config.public.spotifyState) {
                    const accessToken = await $fetch(`/api/spotify/login?code=${code}`);

                    const { data } = await getTopTracks(accessToken, 'long_term', 50);

                    const songs = data.items.map((item) => {
                        let artists = item.artists.map((artist) => {
                            return artist.name; 
                        });

                        return `${item.name} by ${artists.join(' and ')}`;
                    });

                    const completion = await $fetch('/api/huggingface/analysis', {
                        method: 'post',
                        body: {
                            songs
                        }
                    });
                }
            }
        });
    });
 
    const handleSpotifyConnectClick = async () => {
        const config = useRuntimeConfig();

        window.open(`https://accounts.spotify.com/authorize?${new URLSearchParams({
            response_type: 'code',
            client_id: config.public.spotifyClientId,
            scope: 'user-read-private user-read-email user-library-read user-top-read user-follow-read playlist-read-private playlist-read-collaborative user-read-recently-played user-read-currently-playing',
            redirect_uri: config.public.spotifyRedirectUri,
            state: config.public.spotifyState
        }).toString()}`, 'Spotify Authentication', 'width=500,height=600,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes');
    }
</script>