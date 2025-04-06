/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./components/**/*.{js,vue,ts}",
      "./layouts/**/*.vue",
      "./pages/**/*.vue",
      "./plugins/**/*.{js,ts}",
      "./nuxt.config.{js,ts}",
      "./app.vue",
    ],
    theme: {
      extend: {
        fontFamily: {
            sans: ['Outfit', 'sans-serif'],
            titanOne: ['Titan One'],
            yesteryear: ['Yesteryear'],
            permanent: ['Permanent Marker']
        },
        colors: {
            brazilGreen: '#006400',
            brazilYellow: '#FFD700'
        }
      },
    },
    plugins: [],
  }