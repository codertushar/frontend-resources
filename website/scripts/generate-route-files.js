/**
 * Post-build script to create index.html files for all routes
 * This enables direct URL access on GitHub Pages for SEO
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');
const contentPath = path.resolve(__dirname, '../src/data/content.json');

// Read content.json to get all routes
const content = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));

// All routes that need index.html files
const routes = [
    '/library',
    '/learning-path',
    ...content.map(r => '/resource/' + r.id)
];

// Read the main index.html
const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

// Create index.html for each route
let created = 0;
for (const route of routes) {
    const routeDir = path.join(distDir, route);
    const routeIndex = path.join(routeDir, 'index.html');

    // Create directory if it doesn't exist
    fs.mkdirSync(routeDir, { recursive: true });

    // Copy index.html to route directory
    fs.writeFileSync(routeIndex, indexHtml);
    created++;
}

console.log(`✅ Created ${created} route index.html files for SEO`);
