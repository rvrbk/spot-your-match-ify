<template>
    <div v-if="loading" class="flex items-center justify-center h-screen relative z-20">
        <div class="spinner w-16 h-16 border-4 border-dotted border-brazilGreen rounded-full animate-spin"></div>
    </div>
    <div v-if="connected" class="text-center mt-20 text-6xl font-yesteryear text-brazilYellow mb-10 z-20 relative">
        Spot Your MatchIfy
    </div>
    <div class="flex justify-center h-screen">
        <div v-if="!connected" class="flex items-center font-titanOne text-center text-xl md:text-3xl text-brazilGreen">
            <a href="#" @click.prevent="handleSpotifyConnectClick">Connect with Spotify</a>
        </div>
        <div class="container -mt-20 md:w-full w-4/5" v-if="connected">
            <div v-if="!loading" class="absolute bg-brazilGreen w-screen top-0 left-0 h-[600px] md:h-[1000px]"></div>
            <div class="flex flex-col justify-center items-center mt-20">
                <div class="mb-20 text-xl md:text-3xl font-titanOne text-brazilYellow text-center z-20 relative">
                    <p v-if="!newUser">Welcome back {{ displayName }}!</p>
                    <p v-if="newUser">Welcome to SpotYourMatchIfy {{ displayName }}!</p>
                </div>
                <img :src="profileImageUrl" class="w-64 h-64 rounded-full border-[10px] border-brazilYellow relative z-20">
                <div class="w-screen absolute mt-200">
                    <div class="absolute w-screen aspect-square rounded-full bg-brazilYellow left-0 -ml-[50%] top-32"></div>
                    <div class="absolute w-screen aspect-square rounded-full bg-brazilYellow left-0 -ml-1/2 top-10"></div>
                    <div class="absolute w-screen aspect-square rounded-full bg-brazilYellow right-0 -mr-[50%]"></div>
                </div>
            </div>
            <div class="flex justify-center mt-20">
                <div class="flex flex-col relative z-20 text-brazilGreen md:w-4/5 lg:w-1/2 container">
                    <Navigation :connected="connected" :disconnect="disconnect" />
                    <div class="flex flex-col justify-between mt-20">
                        <div class="mb-20">
                            <div class="flex justify-between items-center">
                                <label>What is your sex?</label>
                                <div class="flex w-2/5 md:w-1/2">
                                    <select class="select" :class="!sex ? 'animate-pulse' : ''" v-model="sex" @change="handleSexChange">
                                        <option value=""></option>
                                        <option value="Female">Female</option>
                                        <option value="Male">Male</option>
                                    </select>
                                </div>
                            </div>
                            <div class="flex justify-between items-center mt-2">
                                <label>What is your preference?</label> 
                                <div class="flex w-2/5 md:w-1/2">
                                    <select class="select" v-model="preference" @change="handlePreferenceChange">
                                        <option value="">No preference</option>
                                        <option value="Female">Female</option>
                                        <option value="Male">Male</option>
                                    </select>
                                </div>
                            </div>
                            <div class="flex justify-between items-center mt-2">
                                <label>What is your goal?</label> 
                                <div class="flex w-2/5 md:w-1/2">
                                    <select class="select" :class="!goal ? 'animate-pulse' : ''" v-model="goal" @change="handleGoalChange">
                                        <option value=""></option>
                                        <option value="Friends">Friends</option>
                                        <option value="Romance">A romantic relationship</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h1 v-if="bio" class="text-xl font-titanOne mb-10">Your profile based on your musical taste</h1>
                            <div v-html="bio" class="tracking-wide leading-relaxed"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex mt-20 sm:hidden">
                <a href="#" @click.prevent="disconnect" class="py-2 px-6 rounded-sm bg-red-800 hover:bg-red-900 text-brazilYellow transition-colors w-full text-center mb-5">Disconnect</a>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { onMounted } from 'vue';
    import { useSpotify } from '~/composables/useSpotify';
    import { useLocalStorage } from '~/composables/useLocalStorage';
    import MarkdownIt from 'markdown-it';
    import Navigation from '~/components/Navigation.vue';

    const bio = ref('');
    const connected = ref(false);
    const newUser = ref(true);
    const editMode = ref(false);
    const loading = ref(false);

    const spotifyId = ref(null);
    const displayName = ref('');
    const profileImageUrl = ref('');
    const preference = ref('');
    const sex = ref(null);
    const goal = ref(null);

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

    const handleSexChange = async (e) => {
        sex.value = e.target.value;

        try {
            await $fetch('/api/user/update', {
                method: 'post',
                body: {
                    spotifyId: spotifyId.value,
                    sex: sex.value === '' ? null : sex.value
                }
            });
        }
        catch (error) {
            console.error(error);
        }
    }

    const handlePreferenceChange = async (e) => {
        preference.value = e.target.value;

        try {
            await $fetch('/api/user/update', {
                method: 'post',
                body: {
                    spotifyId: spotifyId.value,
                    preference: preference.value === '' ? null : preference.value
                }
            });
        }
        catch (error) {
            console.error(error);
        }
    }

    const handleGoalChange = async (e) => {
        goal.value = e.target.value;

        try {
            await $fetch('/api/user/update', {
                method: 'post',
                body: {
                    spotifyId: spotifyId.value,
                    goal: goal.value === '' ? null : goal.value
                }
            });
        }
        catch (error) {
            console.error(error);
        }
    }

    const handleProfile = async () => {
        const { getTopTracks } = useSpotify();
        const { getItem } = useLocalStorage();
        
        const md = new MarkdownIt();

        setLoading(true);

        const { accessToken, user, isNewUser } = await $fetch(`/api/spotify/login?code=${getItem('spotifyCode')}`);

        if (user) {
            sex.value = user.sex;
            preference.value = !user.preference ? '' : user.preference;
            goal.value = user.goal;
        }

        if (accessToken) {
            connected.value = true;
            newUser.value = isNewUser;

            displayName.value = user.displayName;
            profileImageUrl.value = user.profileImageUrl;
            spotifyId.value = user.spotifyId;

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

            // const bioResponse = await $fetch('/api/huggingface/analysis', {
            //     method: 'post',
            //     body: {
            //         songs
            //     }
            // });

            // bio.value = md.render(bioResponse.generated_text);

            bio.value = `
Based on the songs you've shared, it seems that you have a complex and multifaceted personality. You appear to have a strong affinity for music that evokes emotions, particularly those related to love, longing, and nostalgia. Here are a few observations about the type of romantic partner you might prefer, based on the songs in your playlist:

Introspective and Emotional: Many of the songs you've listed are deeply emotional and introspective. This suggests that you might be drawn to partners who are also deeply emotional and introspective. You might appreciate someone who is able to connect with you on a deep emotional level and who is not afraid to express their feelings.

Creative and Artistic: Several of the songs on your playlist are by artists known for their creativity and artistic expression. This suggests that you might be attracted to partners who are also creative and artistic. You might enjoy someone who is able to express themselves through various forms of art, whether it be music, painting, writing, or another medium.

Loyal and Committed: Many of the songs you've shared are about long-term love and commitment. This suggests that you might be looking for a partner who is loyal and committed to the relationship. You might appreciate someone who is reliable and who is able to provide a sense of stability and security.

Passionate and Energetic: Several of the songs on your playlist are upbeat and energetic, suggesting that you might be attracted to partners who are passionate and energetic. You might enjoy someone who is able to bring excitement and adventure into your life.

Based on these observations, some potential romantic partners for you might include artists or creatives who are deeply emotional, introspective, and committed to their relationships. They might be passionate and energetic, and they might be able to connect with you on a deep emotional level through their art or music.

Some specific artists or songs that might resonate with you include:

Lana Del Rey: Her music is deeply emotional and introspective, and it often explores themes of love, longing, and nostalgia. Some of her songs that might particularly resonate with you include "hope is a dangerous thing for a woman like me to have - but I have it," "Margaret (feat. Bleachers)," "Mariners Apartment Complex," and "Say Yes To Heaven."
Eminem: While his music can be quite raw and explicit, it also often explores deep emotional themes. Some of his songs that might resonate with you include "Legacy," "The Ringer," and "Heaven Must Have Sent You - Mono Single."
Selena: Her music is passionate and energetic, and it often explores themes of love and commitment. Some of her songs that might particularly resonate with you include "Bidi Bidi Bom Bom" and "El Chico Del Apartamento 512."
Cigarettes After Sex: Their music is deeply emotional and introspective, and it often explores themes of longing and desire. Some of their songs that might particularly resonate with you include "Heavenly" and "Opera House."
I hope this analysis provides some insight into the type of romantic partner you might be drawn to, based on the songs in your playlist. Let me know if you have any questions or if there's anything else I can help you with!
            `;

            setLoading(false);
        }
    }

    const disconnect = () => {
        const { removeItem } = useLocalStorage();
        
        removeItem('spotifyCode');

        connected.value = false;
    }

    const setLoading = (isLoading) => {
        loading.value = isLoading;
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