import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  runtimeConfig: {
    spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    huggingFaceApiKey: process.env.HUGGINGFACE_API_KEY,
    redisHost: process.env.REDIS_HOST || '127.0.0.1',
    redisPort: process.env.REDIS_PORT || '6379',
    redisPassword: process.env.REDIS_PASSWORD,
    redisTls: process.env.REDIS_TLS === 'true',
    public: {
      spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
      spotifyState: process.env.SPOTIFY_STATE,
      spotifyRedirectUri: process.env.SPOTIFY_REDIRECT_URI
    }
  },
  modules: [
    '@nuxtjs/tailwindcss'
  ]
});