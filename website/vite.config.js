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
    include: ['react', 'react-dom', '@codesandbox/sandpack-react'],
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('@codesandbox/sandpack-react')) {
              return 'sandpack';
            }
          }
        },
      },
    },
  },
})
