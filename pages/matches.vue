<template>
    
</template>

<script setup>
    import { onMounted } from 'vue';
    import { useLocalStorage } from '~/composables/useLocalStorage';
    import Navigation from '~/components/Navigation.vue';

    const loading = ref(false);

    onMounted(async () => {
        const { setItem, getItem } = useLocalStorage();

        const uuid = getItem('uuid');

        const matches = await $fetch(`/api/matches/find?userUuid=${uuid}`);

        console.log(matches);
    });

</script>