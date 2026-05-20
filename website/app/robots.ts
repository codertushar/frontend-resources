import { MetadataRoute } from 'next';

/**
 * Dynamic robots.txt generation for Next.js
 * This ensures search engines can always find our sitemap
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
        // Allow Google to crawl JavaScript and CSS
        crawlDelay: 0,
      },
    ],
    sitemap: 'https://crackfrontend.in/sitemap.xml',
  };
}
