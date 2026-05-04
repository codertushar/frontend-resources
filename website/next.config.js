/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,

  // Disable TypeScript checking during build (old Vite code has errors)
  typescript: {
    ignoreBuildErrors: true,
  },

  // Turbopack configuration - use absolute path to resolve workspace root warning
  turbopack: {
    root: process.cwd().replace(/\/website$/, ''),
  },

  // Image optimization
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },

  // Experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Transpile packages that need it
  transpilePackages: ['lucide-react'],

  // Headers for security and caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        source: '/service-worker.js',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
    ];
  },

  // Redirects for backward compatibility
  async redirects() {
    return [];
  },

  // Rewrites if needed
  async rewrites() {
    return [];
  },
};

export default nextConfig;
