/**
 * Post-build script to create pre-rendered index.html files for all routes
 * This enables SEO by injecting:
 * - Page-specific meta tags (title, description, og:tags)
 * - Pre-rendered content in <noscript> for search engines
 * - Structured data (JSON-LD) for rich search results
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');
const contentPath = path.resolve(__dirname, '../src/data/content.json');

// Base URL of the deployed site
const BASE_URL = 'https://crackfrontend.in';

// Read content.json to get all routes
const content = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));

// Read the main index.html template
const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

// Helper to escape HTML entities
function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Helper to strip markdown for plain text
function stripMarkdown(md) {
    if (!md) return '';
    return md
        .replace(/```[\s\S]*?```/g, '[code example]') // Replace code blocks with placeholder
        .replace(/`([^`]+)`/g, '$1') // Keep inline code content, just remove backticks
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links to text
        .replace(/#{1,6}\s*/g, '') // Remove heading markers
        .replace(/\*\*([^*]+)\*\*/g, '$1') // Bold to plain text
        .replace(/\*([^*]+)\*/g, '$1') // Italic to plain text
        .replace(/__([^_]+)__/g, '$1') // Bold underscore to plain text
        .replace(/_([^_]+)_/g, '$1') // Italic underscore to plain text
        .replace(/~~([^~]+)~~/g, '$1') // Strikethrough to plain text
        .replace(/^\s*[-*+]\s+/gm, '') // Remove list markers
        .replace(/^\s*\d+\.\s+/gm, '') // Remove numbered list markers
        .replace(/^\s*>\s+/gm, '') // Remove blockquote markers
        .replace(/\|[^|]*\|/g, ' ') // Remove table cells
        .replace(/[-]{3,}/g, '') // Remove horizontal rules
        .replace(/\n+/g, ' ') // Collapse newlines
        .replace(/\s+/g, ' ') // Collapse whitespace
        .trim();
}

// Helper to extract first paragraph or sentences as description
function extractDescription(fullContent, maxLength = 160) {
    const plain = stripMarkdown(fullContent);
    if (plain.length <= maxLength) return plain;

    // Try to cut at sentence boundary
    const truncated = plain.substring(0, maxLength);
    const lastPeriod = truncated.lastIndexOf('.');
    if (lastPeriod > 80) {
        return truncated.substring(0, lastPeriod + 1);
    }
    return truncated.substring(0, truncated.lastIndexOf(' ')) + '...';
}

// Generate JSON-LD structured data for an article
function generateArticleJsonLd(resource) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: resource.title,
        description: extractDescription(resource.fullContent),
        author: {
            '@type': 'Person',
            name: 'Tushar Khanna'
        },
        publisher: {
            '@type': 'Organization',
            name: 'CrackFrontend',
            url: BASE_URL
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${BASE_URL}/resource/${resource.id}`
        },
        articleSection: resource.category,
        keywords: [resource.category, resource.subcategory, 'frontend', 'javascript', 'web development'].filter(Boolean).join(', ')
    };
}

// Generate HTML with pre-rendered content for a resource page
function generateResourceHtml(resource) {
    const title = `${resource.title} | CrackFrontend`;
    const description = extractDescription(resource.fullContent);
    const url = `${BASE_URL}/resource/${resource.id}`;
    const jsonLd = JSON.stringify(generateArticleJsonLd(resource));

    // Pre-render article content (simplified HTML version for SEO)
    const prerenderedContent = `
    <article class="seo-content">
      <h1>${escapeHtml(resource.title)}</h1>
      <p><strong>Category:</strong> ${escapeHtml(resource.category)}${resource.subcategory ? ` / ${escapeHtml(resource.subcategory)}` : ''}</p>
      ${resource.difficulty ? `<p><strong>Difficulty:</strong> ${escapeHtml(resource.difficulty)}</p>` : ''}
      <div class="content">
        ${escapeHtml(stripMarkdown(resource.fullContent).substring(0, 2000))}${resource.fullContent.length > 2000 ? '...' : ''}
      </div>
    </article>`;

    let html = indexHtml;

    // Replace title
    html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`);

    // Replace/add meta description
    html = html.replace(
        /<meta name="description"[\s\S]*?>/,
        `<meta name="description" content="${escapeHtml(description)}">`
    );

    // Add Open Graph and Twitter meta tags before </head>
    const metaTags = `
  <!-- SEO Meta Tags -->
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="CrackFrontend">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${url}">

  <!-- Structured Data -->
  <script type="application/ld+json">${jsonLd}</script>
`;
    html = html.replace('</head>', metaTags + '</head>');

    // Add pre-rendered content in noscript tag after <div id="root">
    const noscriptContent = `
  <!-- Pre-rendered content for SEO -->
  <noscript>
    <style>.seo-content { max-width: 800px; margin: 0 auto; padding: 20px; font-family: system-ui, sans-serif; }</style>
    ${prerenderedContent}
  </noscript>`;
    html = html.replace('<div id="root"></div>', `<div id="root"></div>${noscriptContent}`);

    return html;
}

// Generate HTML for static pages (library, learning-path)
function generateStaticPageHtml(route, title, description) {
    const url = `${BASE_URL}${route}`;

    let html = indexHtml;

    // Replace title
    html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`);

    // Replace meta description
    html = html.replace(
        /<meta name="description"[\s\S]*?>/,
        `<meta name="description" content="${escapeHtml(description)}">`
    );

    // Add Open Graph meta tags
    const metaTags = `
  <!-- SEO Meta Tags -->
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="CrackFrontend">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${url}">
`;
    html = html.replace('</head>', metaTags + '</head>');

    return html;
}

// Static page definitions
const staticPages = {
    '/library': {
        title: 'Library | CrackFrontend',
        description: 'Browse our complete collection of frontend engineering resources – JavaScript fundamentals, React patterns, system design, and interview preparation materials.'
    },
    '/learning-path': {
        title: 'Learning Path | CrackFrontend',
        description: 'Follow a structured learning path from beginner to advanced frontend engineering. Track your progress through JavaScript, React, and system design topics.'
    }
};

// Create route files
let created = 0;

// Generate static pages
for (const [route, pageInfo] of Object.entries(staticPages)) {
    const routeDir = path.join(distDir, route);
    const routeIndex = path.join(routeDir, 'index.html');

    fs.mkdirSync(routeDir, { recursive: true });
    fs.writeFileSync(routeIndex, generateStaticPageHtml(route, pageInfo.title, pageInfo.description));
    created++;
}

// Generate resource pages with pre-rendered content
for (const resource of content) {
    const routeDir = path.join(distDir, 'resource', resource.id);
    const routeIndex = path.join(routeDir, 'index.html');

    fs.mkdirSync(routeDir, { recursive: true });
    fs.writeFileSync(routeIndex, generateResourceHtml(resource));
    created++;
}

// Generate category pages (intermediate paths for sitemap)
const categories = new Set();
for (const resource of content) {
    const parts = resource.id.split('/');
    let current = '';
    for (let i = 0; i < parts.length - 1; i++) {
        current = current ? `${current}/${parts[i]}` : parts[i];
        categories.add(current);
    }
}

for (const category of categories) {
    const routeDir = path.join(distDir, 'resource', category);
    const routeIndex = path.join(routeDir, 'index.html');

    // Only create if doesn't already exist (don't overwrite actual resource pages)
    if (!fs.existsSync(routeIndex)) {
        const categoryName = category.split('/').pop().replace(/[-_]/g, ' ');
        const title = `${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} | CrackFrontend`;
        const description = `Browse ${categoryName} resources – tutorials, guides, and interview preparation materials for frontend engineers.`;

        fs.mkdirSync(routeDir, { recursive: true });
        fs.writeFileSync(routeIndex, generateStaticPageHtml(`/resource/${category}`, title, description));
        created++;
    }
}

console.log(`✅ Created ${created} pre-rendered index.html files for SEO`);
