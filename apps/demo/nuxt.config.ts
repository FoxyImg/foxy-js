import { fileURLToPath, URL } from 'node:url'
import {dirname, join} from "path";

const currentDir = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  alias: process.env.FOXY_DEV_MODE === 'true' ? {
    "@foxyimg/vue-ui": require.resolve(join(currentDir, './node_modules/@foxyimg/vue-ui/src')),
    "@foxyimg/url-builder": require.resolve(join(currentDir, './node_modules/@foxyimg/url-builder/src')),
  } : {},
  modules: [
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
  ],
  sourcemap: {
    server: true,
    client: process.env.NODE_ENV !== "production",
  },
})
