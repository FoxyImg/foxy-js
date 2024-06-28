/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/@foxyimg/vue-ui/src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/@foxyimg/vue-ui/components/**/*.{vue,js,ts,jsx,tsx}",
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

