import { defineStore } from 'pinia';

export const useSpotifyAuthStore = defineStore('spotify-auth', {
    state: () => ({
        code: null,
        accessToken: null,
        refreshToken: null,
        expiresAt: null
    }),
    actions: {
        setCode(code) {
            this.code = code;
        },
        setTokens(accessToken, refreshToken, expiresIn) {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
            this.expiresAt = Date.now() + expiresIn * 1000;
        },
        logout() {
            this.code = null;
            this.accessToken = null;
            this.refreshToken = null;
            this.expiresAt = null;
        },
        persist: true
    }
});