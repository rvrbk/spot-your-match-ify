<template>
    <div class="flex justify-center items-center h-screen">
        <a href="#" v-if="!loggedIn" @click.prevent="handleSpotifyConnectClick">Connect with Spotify</a>
        <div class="container w-4/5" v-if="loggedIn">
            <TopNavigation />
            <img :src="profileImageUrl">
            <div class="flex">
                <div>
                    <p v-if="!newUser">Welcome back {{ displayName }}!</p>
                    <p v-if="newUser">Welcome to SpotYourMatchIfy {{ displayName }}!</p>
                    <h1 v-if="bio">Your profile based on your musical taste</h1>
                    <div v-html="bio"></div>
                </div>
                <div>
                    <div class="flex justify-between">
                        <label>What is your sex?</label> 
                        <div>
                            <select>
                                <option>Female</option>
                                <option>Male</option>
                            </select>
                        </div>
                    </div>
                    <div class="flex justify-between">
                        <label>What is your preference?</label> 
                        <div>
                            <select>
                                <option>No preference</option>
                                <option>Female</option>
                                <option>Male</option>
                            </select>
                        </div>
                    </div>
                    <a href="#" @click.prevent="disconnect" class="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors">Disconnect</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { onMounted } from 'vue';
    import { useSpotify } from '~/composables/useSpotify';
    import { useLocalStorage } from '~/composables/useLocalStorage';
    import MarkdownIt from 'markdown-it';
    import TopNavigation from '~/components/TopNavigation.vue';

    const bio = ref('');
    const loggedIn = ref(false);
    const newUser = ref(true);

    const displayName = ref('');
    const profileImageUrl = ref('');

    let accessToken;

    onMounted(() => {
        const { setItem, getItem } = useLocalStorage();

        if (getItem('spotifyCode') !== '') {
            handleProfile();
        }

        window.addEventListener('message', async (e) => {
            const { source, code, state } = e.data;

            const config = useRuntimeConfig();
            
            if (source === 'spotify-auth') {
                if (code && state === config.public.spotifyState) {
                    setItem('spotifyCode', code);
                    
                    handleProfile();
                }
            }
        });
    });

    const handleProfile = async () => {
        const { getTopTracks } = useSpotify();
        const { getItem } = useLocalStorage();
        
        const md = new MarkdownIt();

        const { accessToken, user, isNewUser } = await $fetch(`/api/spotify/login?code=${getItem('spotifyCode')}`);

        if (accessToken) {
            loggedIn.value = true;
            newUser.value = isNewUser;

            displayName.value = user.displayName;
            profileImageUrl.value = user.profileImageUrl;

            const { data } = await getTopTracks(accessToken, 'long_term', 50);

            const songs = data.items.map((item) => {
                let artists = item.artists.map((artist) => {
                    return artist.name; 
                });

                return `${item.name} by ${artists.join(' and ')}`;
            });

//             const songs = `
//             11 - Beyoncé
// Flaws and All - Beyoncé
// TYRANT - Beyoncé, Dolly Parton
// Formation - Beyoncé
// II HANDS II HEAVEN - Beyoncé
// ALIEN SUPERSTAR - Beyoncé
// I'M THAT GIRL - Beyoncé
// ALL UP IN YOUR MIND - Beyoncé
// Goodies (feat. Petey Pablo) - Ciara, Petey Pablo
// Body Party - Ciara
// Say Yes To Heaven - Lana Del Rey
// Rise Up - Andra Day
// My Boo - USHER, Alicia Keys
// Girl on Fire - Alicia Keys
// Un-thinkable (I'm Ready) (feat. Drake) - Alicia Keys, Drake
// If I Ain't Got You - Alicia Keys
// Dream On - Aerosmith
// I Don't Want To Miss A Thing - Aerosmith
// Livin' On A Prayer - Bon Jovi
// It's My Life - Bon Jovi
// Always - Bon Jovi
// Zóio De Lula - Charlie Brown Jr.
// Dias De Luta, Dias De Gloria - Charlie Brown Jr.
// Lugar Ao Sol - Charlie Brown Jr.
// Pontes Indestrutíveis - Charlie Brown Jr.
// Primeiros Erros (Chove) (feat. Kiko Zambianchi) - Capital Inicial, Kiko Zambianchi
// À Sua Maneira (De Música Ligeira) - Capital Inicial
// Fogo - Ao Vivo - Capital Inicial
// Die For You - The Weeknd
// In The Night - The Weeknd
// Amen - Andra Day
// CAJU - Liniker
// TUDO - Liniker
// Baby 95 - Liniker
// In the End - Linkin Park
// Breaking the Habit - Linkin Park
// Stars - Simply Red
// Say You Love Me - Simply Red
// One Last Breath - Creed
// My Sacrifice - Creed
// With Arms Wide Open - Creed
// My Own Prison - Creed
// Ironic - 2015 Remaster - Alanis Morissette
// You Oughta Know - 2015 Remaster - Alanis Morissette
// You Learn - 2015 Remaster - Alanis Morissette
// Crazy - James Michael Mix - (Artist not visible in images)
// Thank U - Alanis Morissette
// All I Really Want - 2015 Remaster - Alanis Morissette
// Dangerous Woman - Ariana Grande
// Die For You (with Ariana Grande) - Remix - The Weeknd, Ariana Grande
// God is a woman - Ariana Grande
//             `;

            const bioResponse = await $fetch('/api/huggingface/analysis', {
                method: 'post',
                body: {
                    songs
                }
            });

            bio.value = md.render(bioResponse.generated_text);

            // const colorResponse = await $fetch('/api/huggingface/colors', {
            //     method: 'post',
            //     body: {
            //         profile: bio.value
            //     }
            // });

            // console.log(colorResponse);
        }
    }

    const disconnect = () => {
        const { removeItem } = useLocalStorage();
        
        removeItem('spotifyCode');

        loggedIn.value = false;   
    }
 
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