
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Use '/' for dev and Vercel, '/frontend-resources/' for GitHub Pages
  base: command === 'serve' ? '/' : (process.env.VERCEL ? '/' : '/frontend-resources/'),
  server: {
    watch: {
      // Force watching of JSON files in src/data
      usePolling: false,
    },
  },
  optimizeDeps: {
    // Exclude content.json from pre-bundling so changes are picked up immediately
    exclude: ['src/data/content.json'],
  },
}))
