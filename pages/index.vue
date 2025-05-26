<template>
    <div v-if="loading" class="flex items-center justify-center h-screen relative z-20">
        <div class="spinner w-16 h-16 border-4 border-dotted border-brazilGreen rounded-full animate-spin"></div>
    </div>
    <Logo v-if="isConnected()" />
    <div class="flex justify-center h-screen">
        <div v-if="!isConnected()" class="flex items-center font-titanOne text-center text-xl md:text-3xl text-brazilGreen">
            <a href="#" @click.prevent="handleSpotifyConnectClick">Connect with Spotify</a>
        </div>
        <div class="container -mt-20 md:w-full w-4/5" v-if="isConnected()">
            <Header v-if="isConnected()" :localUser="localUser" :newUser="newUser" :loading="loading" />            
            <div class="flex justify-center mt-20">
                <div class="flex flex-col relative z-20 text-brazilGreen md:w-4/5 lg:w-1/2 container">
                    <Navigation />
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
                                    <select class="select" :class="!preference ? 'animate-pulse' : ''" v-model="preference" @change="handlePreferenceChange">
                                        <option value=""></option>
                                        <option value="NoPreference">No preference</option>
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
    import { onMounted, watch } from 'vue';
    import { useSpotify } from '~/composables/useSpotify';
    import { useLocalStorage } from '~/composables/useLocalStorage';
    import MarkdownIt from 'markdown-it';
    import Navigation from '~/components/Navigation.vue';
    import Logo from '~/components/Logo.vue';
    import Header from '~/components/Header.vue';

    const { isConnected } = useSpotify();

    const bio = ref('');
    const newUser = ref(true);
    const editMode = ref(false);
    const loading = ref(false);

    const spotifyId = ref(null);
    const uuId = ref(null);
    const displayName = ref('');
    const profileImageUrl = ref('');
    const preference = ref(null);
    const sex = ref(null);
    const goal = ref(null);

    const localUser = ref(null);

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
                    userUuId: uuId.value,
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
                    userUuId: uuId.value,
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
                    userUuId: uuId.value,
                    goal: goal.value === '' ? null : goal.value
                }
            });
        }
        catch (error) {
            console.error(error);
        }
    }

    const handleProfile = async () => {
        const { getTopTracks, setConnected } = useSpotify();
        const { getItem, setItem } = useLocalStorage();
        
        const md = new MarkdownIt();

        setLoading(true);

        const { accessToken, user, isNewUser } = await $fetch(`/api/spotify/login?code=${getItem('spotifyCode')}`);

        if (user && accessToken) {
            localUser.value = user;

            setItem('uuid', user.uuid);

            setConnected(true);

            newUser.value = isNewUser;

            sex.value = user.sex;
            preference.value = user.preference;
            goal.value = user.goal;
            displayName.value = user.displayName;
            profileImageUrl.value = user.profileImageUrl;
            spotifyId.value = user.spotifyId;
            uuId.value = user.uuid;

            const response = await $fetch(`/api/bio/get?userUuId=${user.uuid}`);

            if (response.length > 0 && false) {
                bio.value = response[0];
            }
            else {
                const { data } = await getTopTracks(accessToken, 'long_term', 50);

                const songs = data.items.map((item) => {
                    let artists = item.artists.map((artist) => {
                        return artist.name; 
                    });

                    return `${item.name} by ${artists.join(' and ')}`;
                });

                const eventSource = new EventSource(`/api/mistral/analysis?songs=${songs}`);
                
                let originalBio = '';
                eventSource.onmessage = (event) => {
                    const chunk = JSON.parse(event.data);

                    originalBio += chunk.message

                    bio.value += chunk.message;
                };

                eventSource.onerror = async (error) => {
                    eventSource.close();

                    bio.value = md.render(bio.value);

                    await $fetch('/api/bio/store', {
                        method: 'post',
                        body: {
                            userUuId: user.uuid,
                            bio: originalBio
                        }
                    });

                    // if (eventSource.readyState === EventSource.CLOSED) {
                    //     console.log('Connection closed by the server.');
                    //     eventSource.close(); // Ensure the connection is closed
                    // }
                };
            }

            setLoading(false);
        }
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