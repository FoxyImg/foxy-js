// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath, URL } from 'node:url'
import {dirname, join} from "path";
import svgLoader from 'vite-svg-loader'

const currentDir = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  modules: [
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
  ],
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('media-')
    }
  },
  vite: {
    plugins: [
      svgLoader({
        defaultImport: 'raw',
      })
    ]
  },

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

  sourcemap: {
    server: true,
    client: process.env.NODE_ENV !== "production",
  },

  runtimeConfig: {
    foxyHost: "",
    foxySource: "",
    foxySecret: "",
    foxyImgixMode: true,
    foxyStaticHost: "",
    fileRoot: "",
  },
})