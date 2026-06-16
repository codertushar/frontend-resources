import { MetadataRoute } from 'next';

/**
 * Dynamic robots.txt generation for Next.js
 * This ensures search engines can always find our sitemap and properly render pages
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/_next/static/'],
        disallow: ['/api/', '/admin/', '/_next/data/'],
      },
      {
        userAgent: 'Googlebot',
        allow: ['/', '/_next/static/'],
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: 'https://crackfrontend.in/sitemap.xml',
  };
}
