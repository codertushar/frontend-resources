import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Gzip compression
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024, // Only compress files > 1KB
      deleteOriginFile: false,
    }),
    // Brotli compression (better compression than gzip)
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
      deleteOriginFile: false,
    }),
  ],
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
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      format: {
        comments: false, // Remove all comments
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Generate sourcemaps for debugging (disable for smaller builds)
    sourcemap: false,
    // Optimize assets
    assetsInlineLimit: 4096, // Inline assets < 4KB as base64
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        // Improved manual chunking strategy
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            // React core
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
              return 'react-vendor';
            }
            // Router
            if (id.includes('react-router')) {
              return 'router';
            }
            // UI libraries
            if (id.includes('framer-motion')) {
              return 'animations';
            }
            // Markdown and syntax highlighting
            if (id.includes('react-markdown') || id.includes('react-syntax-highlighter') || id.includes('remark') || id.includes('rehype')) {
              return 'markdown';
            }
            // Code sandbox
            if (id.includes('@codesandbox/sandpack-react')) {
              return 'sandpack';
            }
            // Supabase
            if (id.includes('@supabase') || id.includes('supabase')) {
              return 'supabase';
            }
            // Search
            if (id.includes('fuse.js')) {
              return 'search';
            }
            // Icons
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            // Analytics
            if (id.includes('@vercel/analytics') || id.includes('@vercel/speed-insights')) {
              return 'analytics';
            }
            // Other vendor code
            return 'vendor';
          }
        },
        // Optimize asset file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[ext]/[name]-[hash][extname]`;
        },
      },
      // Tree shaking optimizations
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
      },
    },
  },
  // Experimental features for better performance
  esbuild: {
    // Remove console and debugger in production
    drop: ['console', 'debugger'],
    legalComments: 'none',
  },
})
