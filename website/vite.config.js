import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    watch: {
      usePolling: false,
    },
  },
  optimizeDeps: {
    exclude: ['src/data/content.json'],
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
})
