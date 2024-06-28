import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(), svgLoader()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      "@foxyimg/vue-ui": fileURLToPath(new URL('./node_modules/@foxyimg/vue-ui/src', import.meta.url)),
      "@foxyimg/url-builder": fileURLToPath(new URL('./node_modules/@foxyimg/url-builder/src', import.meta.url)),
    }
  }
})
