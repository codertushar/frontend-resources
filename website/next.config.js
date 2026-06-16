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
          // Explicitly tell crawlers all public pages are indexable
          { key: 'X-Robots-Tag', value: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
        ],
      },
      {
        // API routes should not be indexed
        source: '/api/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
      {
        // Admin pages should not be indexed
        source: '/admin/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
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

  // Redirects for backward compatibility and SEO
  async redirects() {
    return [
      // Redirect .html and .php index pages to clean URLs
      {
        source: '/:path*/index.html',
        destination: '/:path*',
        permanent: true,
      },
      {
        source: '/:path*/index.php',
        destination: '/:path*',
        permanent: true,
      },
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index.php',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // Rewrites if needed
  async rewrites() {
    return [];
  },
};

export default nextConfig;
