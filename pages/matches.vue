<template>
    <div v-if="loading" class="flex items-center justify-center h-screen relative z-20">
        <div class="spinner w-16 h-16 border-4 border-dotted border-brazilGreen rounded-full animate-spin"></div>
    </div>
    <Logo v-if="isConnected()" />
    <div class="flex justify-center h-screen">
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
    import { onMounted } from 'vue';
    import { useSpotify } from '~/composables/useSpotify';
    import Navigation from '~/components/Navigation.vue';

    const { isConnected } = useSpotify();

    const loading = ref(false);

    onMounted(async () => {
        const { user } = useUserSession();

        const matches = await $fetch(`/api/matches/find?uuid=${user.value.uuid}`);

        console.log(matches);
    });

</script>