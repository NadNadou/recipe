import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      moment: 'moment/moment.js',
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001', // le port de ton backend
        changeOrigin: true,
        secure:false
        // rewrite: path => path.replace(/^\/api/, '') // à activer si nécessaire
      }
    }
  }
})
