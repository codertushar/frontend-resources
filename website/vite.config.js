import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      babel: {
        plugins: [],
      },
    }),
    // Gzip compression - only for larger files to speed up build
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240, // Only compress files > 10KB (reduced processing)
      deleteOriginFile: false,
      filter: /\.(js|mjs|json|css|html)$/i, // Only compress text files
    }),
    // Brotli compression - best compression for modern browsers
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240, // Only compress files > 10KB
      deleteOriginFile: false,
      filter: /\.(js|mjs|json|css|html)$/i,
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
    include: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime', '@codesandbox/sandpack-react'],
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      'react': 'react',
      'react-dom': 'react-dom',
    },
  },
  build: {
    // Use esbuild for faster minification (much faster than terser)
    minify: 'esbuild',
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Generate sourcemaps for debugging (disable for smaller builds)
    sourcemap: false,
    // Optimize assets
    assetsInlineLimit: 4096, // Inline assets < 4KB as base64
    // Reduce target for better compatibility and smaller output
    target: 'es2015',
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        // Manual chunking - keep React completely together
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // Critical: Keep all React-related modules together
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler') || id.includes('react/jsx-runtime')) {
              return 'react-vendor';
            }
            // Large dependencies
            if (id.includes('@codesandbox/sandpack')) {
              return 'sandpack';
            }
            if (id.includes('@supabase')) {
              return 'supabase';
            }
            if (id.includes('react-syntax-highlighter') || id.includes('refractor') || id.includes('prismjs')) {
              return 'syntax-highlighter';
            }
            // Other vendors
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
      // Disable aggressive tree shaking to fix import issues
      treeshake: {
        moduleSideEffects: 'no-external',
      },
    },
  },
  // esbuild optimizations for production
  esbuild: {
    drop: ['console', 'debugger'],
    legalComments: 'none',
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
})
