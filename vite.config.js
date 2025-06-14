import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: './', 
  plugins: [vue()],
  server: {
    historyApiFallback: true,
  },
  define: {
    'process.env': {}
  }
})  