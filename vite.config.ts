import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base configurable pour GitHub Pages (projet servi sous /cmdt/ par défaut).
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? '/cmdt/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
        },
      },
    },
  },
})
