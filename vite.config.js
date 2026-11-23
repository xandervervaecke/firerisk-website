import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import content from './plugins/content.js'

// BASE_PATH lets the site live in a sub-folder, e.g. GitHub Pages project sites:
//   BASE_PATH=/firerisk-website/ npm run build
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [content(), vue()],
  resolve: {
    alias: { '@': new URL('./src', import.meta.url).pathname },
  },
})
