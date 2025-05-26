export default defineNuxtRouteMiddleware((to, from) => {
    const { loggedIn } = useUserSession();
    
    if (!loggedIn.value && to.fullPath !== '/') {
        return navigateTo('/');
    }
});