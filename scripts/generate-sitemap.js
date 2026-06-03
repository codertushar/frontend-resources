// scripts/generate-sitemap.js
// This script scans the repository for markdown files and generates a sitemap.xml
// placed in website/public/sitemap.xml. It is intended to be run before build
// (e.g., via "npm run sitemap").

const fs = require('fs');
const path = require('path');

// Root of the project (one level up from this script)
const projectRoot = path.resolve(__dirname, '..');
// Directory where the website is served from
const publicDir = path.join(projectRoot, 'website', 'public');
// Output file
const sitemapPath = path.join(publicDir, 'sitemap.xml');

// Base URL of the deployed site (use primary domain for SEO)
const BASE_URL = 'https://crackfrontend.in';

// Helper: recursively collect .md files (excluding hidden dirs)
function collectMarkdownFiles(dir) {
    let results = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.name.startsWith('.')) continue; // skip hidden
        if (entry.isDirectory() && (entry.name === 'node_modules' || entry.name === 'website')) {
            continue; // skip node_modules and website directories
        }
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results = results.concat(collectMarkdownFiles(fullPath));
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
            results.push(fullPath);
        }
    }
    return results;
}

// Convert a markdown file path to a URL path.
// Example: projectRoot/js/general-concepts/abort_controller.md -> /js/general-concepts/abort_controller
function markdownPathToUrl(mdPath) {
    const relative = path.relative(projectRoot, mdPath);
    const withoutExt = relative.replace(/\.md$/i, ''); // keep path without extension
    return '/resource/' + withoutExt.replace(/\\/g, '/');
}

// Extract all intermediate category paths from a URL
// e.g., /resource/js/polyfills/arrays/at -> [/resource/js, /resource/js/polyfills, /resource/js/polyfills/arrays]
function getIntermediatePaths(url) {
    const parts = url.split('/').filter(Boolean);
    const paths = [];
    // Start from index 1 to skip 'resource', and stop before the last part (the actual page)
    for (let i = 2; i < parts.length; i++) {
        paths.push('/' + parts.slice(0, i).join('/'));
    }
    return paths;
}

function generateSitemap() {
    const mdFiles = collectMarkdownFiles(projectRoot);
    const resourceUrls = mdFiles.map(markdownPathToUrl);

    // Collect all intermediate category paths for better crawlability
    const categoryPaths = new Set();
    for (const url of resourceUrls) {
        const intermediatePaths = getIntermediatePaths(url);
        for (const p of intermediatePaths) {
            categoryPaths.add(p);
        }
    }

    // Static app pages that should also be indexed
    const staticPages = [
        '/',              // Homepage
        '/library',       // Library page
        '/learning-path', // Learning path page
    ];

    // Combine all URLs: static pages, category paths, and resource pages
    const urls = [...staticPages, ...Array.from(categoryPaths).sort(), ...resourceUrls];

    const now = new Date().toISOString();
    const getPriority = (url) => {
        if (url === '/') return 1;
        if (url === '/library' || url === '/learning-path') return 0.9;
        // Category pages get slightly higher priority than leaf pages
        if (categoryPaths.has(url)) return 0.85;
        return 0.8;
    };
    const urlEntries = urls
        .map((url) => {
            return `  <url>\n    <loc>${BASE_URL}${url}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${getPriority(url)}</priority>\n  </url>`;
        })
        .join('\n');

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>`;

    fs.writeFileSync(sitemapPath, sitemapContent, 'utf-8');
    console.log('✅ sitemap.xml generated with', urls.length, 'entries');

    // Note: robots.txt is now handled by Next.js dynamic route (website/app/robots.ts)
    // We no longer generate a static robots.txt file to avoid shadowing the dynamic route

    // Generate manifest.json
    const manifestPath = path.join(publicDir, 'manifest.json');
    const manifest = {
        name: 'CrackFrontend',
        short_name: 'CrackFE',
        description: 'Curated frontend concepts, patterns & interview prep.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait-primary',
        background_color: '#ffffff',
        theme_color: '#8b5cf6',
        categories: ['education', 'productivity'],
        permissions: ['notifications'],
        icons: [
            {
                src: '/android-launchericon-192-192.png',
                type: 'image/png',
                sizes: '192x192',
                purpose: 'any'
            },
            {
                src: '/android-launchericon-512-512.png',
                type: 'image/png',
                sizes: '512x512',
                purpose: 'any'
            },
            {
                src: '/android-launchericon-192-192.png',
                type: 'image/png',
                sizes: '192x192',
                purpose: 'maskable'
            }
        ]
    };
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 4), 'utf-8');
    console.log('✅ manifest.json generated');
}

generateSitemap();
