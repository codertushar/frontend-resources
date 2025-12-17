
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const isVercel = !!process.env.VERCEL
  const base = command === 'serve' ? '/' : (isVercel ? '/' : '/frontend-resources/')

  return {
    plugins: [
      react(),
      // Plugin to replace __VITE_BASE__ placeholders in HTML
      {
        name: 'html-base-replace',
        transformIndexHtml(html) {
          return html
            .replace(/__VITE_BASE__/g, base)
            .replace(
              '</head>',
              `<script>window.__VITE_BASE__="${base}";</script>\n</head>`
            )
        },
      },
    ],
    base,
    define: {
      // Pass VERCEL env to client-side code
      'import.meta.env.VITE_VERCEL': JSON.stringify(process.env.VERCEL || ''),
    },
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
  }
})
