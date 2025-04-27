<template>
    <div class="hidden sm:flex justify-between w-full mt-8">
        <div class="flex -ml-2">
            <NuxtLink v-for="menuItem in menuItems" :to="menuItem.to" :key="menuItem.to" class="mx-2 button" :class="$route.path === menuItem.to || ($route.path === '' && menuItem.to === '/') ? 'active' : ''">{{ menuItem.label }}</NuxtLink>
        </div>
        <a href="#" @click.prevent="disconnect" class="py-2 px-6 rounded-sm bg-red-800 hover:bg-red-900 text-brazilYellow transition-colors">Disconnect</a>
    </div>
    <div class="flex sm:hidden justify-center">
        <NuxtLink v-for="menuItem in menuItems" :to="menuItem.to" :key="menuItem.to" class="mx-2 button" :class="$route.path === menuItem.to || ($route.path === '' && menuItem.to === '/') ? 'active' : ''">{{ menuItem.label }}</NuxtLink>
    </div>
</template>

<script setup>
    import { defineProps } from 'vue';

    const props = defineProps({
        connected: {
            type: Boolean,
            required: true
        },
        disconnect: {
            type: Function,
            required: true
        }
    });

    const menuItems = [{
        to: '/',
        label: 'Profile'
    }, {
        to: '/matches',
        label: 'Matches'
    },
    {
        to: '/plans',
        label: 'Plans'
    }, {
        to: '/about',
        label: 'About'
    }];
</script>