/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
    "./error.vue",
    "./node_modules/@foxyimg/vue-ui/src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/@foxyimg/vue-ui/components/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/@foxyimg/vue-ui/dist/components/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        xxs: "0.625rem",
        xxxs: "0.5rem",
      },
    },
  },
  plugins: [],
}

