<template>
    <div v-if="!loading" class="absolute bg-brazilGreen w-screen top-0 left-0 h-[600px] md:h-[1000px]"></div>
    <div v-if="localUser" class="flex flex-col justify-center items-center mt-20">
        <div class="mb-20 text-xl md:text-3xl font-titanOne text-brazilYellow text-center z-20 relative">
            <p v-if="!newUser">Welcome back {{ localUser.displayName }}!</p>
            <p v-if="newUser">Welcome to SpotYourMatchIfy {{ localUser.displayName }}!</p>
        </div>
        <img :src="localUser.profileImageUrl" class="w-64 h-64 rounded-full border-[10px] border-brazilYellow relative z-20">
        <div class="w-screen absolute mt-200">
            <div class="absolute w-screen aspect-square rounded-full bg-brazilYellow left-0 -ml-[50%] top-32"></div>
            <div class="absolute w-screen aspect-square rounded-full bg-brazilYellow left-0 -ml-1/2 top-10"></div>
            <div class="absolute w-screen aspect-square rounded-full bg-brazilYellow right-0 -mr-[50%]"></div>
        </div>
    </div>
</template>

<script setup>
    const props = defineProps({
        localUser: Object,
        loading: Boolean,
        newUser: Boolean
    });
</script>