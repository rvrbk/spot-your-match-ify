import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
	compatibilityDate: "2024-11-01",
  	devtools: { enabled: true },
  	runtimeConfig: {
		spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
		public: {
			spotifyClientId: process.env.SPOTIFY_CLIENT_ID
		}
  	},
  	css: ['~/assets/css/main.css'],
 	vite: {
    plugins: [
    	tailwindcss(),
    ]
}});