<template>
    <div class="flex justify-center items-center h-screen">
        <a href="#" @click.prevent="handleSpotifyConnectClick">Connect to Spotify</a>
    </div>
</template>

<script setup>    
    const handleSpotifyConnectClick = async () => {
        const data = await $fetch('/api/spotify/artist/4Z8W4fKeB5YxbusRsdQVPb');

        console.log(data);
    }
</script>