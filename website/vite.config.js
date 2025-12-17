
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const isVercel = !!process.env.VERCEL
  const base = command === 'serve' ? '/' : (isVercel ? '/' : '/frontend-resources/')

  return {
    plugins: [
      react(),
      // Plugin to handle dynamic base path in HTML
      {
        name: 'html-base-replace',
        transformIndexHtml(html) {
          // Inject the __VITE_BASE__ variable at the top of head
          let result = html.replace(
            '<head>',
            `<head>\n<script>window.__VITE_BASE__="${base}";</script>`
          )
          // Only replace __VITE_BASE__ in href and src attributes (not in JS code)
          result = result.replace(/href="__VITE_BASE__/g, `href="${base}`)
          result = result.replace(/src="__VITE_BASE__/g, `src="${base}`)
          return result
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
