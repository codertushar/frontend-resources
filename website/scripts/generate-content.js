
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '../../');
const WEBSITE_ROOT = path.resolve(__dirname, '../');
const PUBLIC_CONTENT_DIR = path.join(WEBSITE_ROOT, 'public', 'content');
const OUTPUT_JSON = path.join(WEBSITE_ROOT, 'src', 'data', 'content.json');

const CONTENT_DIRS = ['js', 'dsa', 'ai', 'general', 'machine-coding', 'system-design'];

// Ensure src/data exists
const DATA_DIR = path.dirname(OUTPUT_JSON);
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

let resources = [];

function getTitle(content, filename) {
    // Try to find H1 first
    const h1Match = content.match(/^#\s+(.*)$/m);
    if (h1Match) {
        return h1Match[1].replace(/\*\*/g, '').trim();
    }

    // Fallback to filename if no H1 found
    const name = filename.replace(/\.md$/, '');
    // Split camelCase and delimiters
    const humanized = name
        .replace(/([a-z])([A-Z])/g, '$1 $2') // CamelCase to spaced
        .replace(/[-_]/g, ' ') // Hyphens/Underscores to space
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Title Case
        .join(' ');

    return humanized;
}

function processDirectory(dirPath, relativePath) {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const item of items) {
        const itemPath = path.join(dirPath, item.name);
        const itemRelativePath = path.join(relativePath, item.name);

        if (item.isDirectory()) {
            if (item.name === 'node_modules' || item.name === '.git') continue;
            processDirectory(itemPath, itemRelativePath);
        } else if (item.isFile() && item.name.endsWith('.md')) {
            // Ignore README/AGENTS at root if strictly looking for resources, 
            // but maybe we want them? Let's stick to CONTENT_DIRS for now.
            const content = fs.readFileSync(itemPath, 'utf-8');
            const title = getTitle(content, item.name);

            const pathParts = itemRelativePath.split('/');
            const category = pathParts[0];
            const subcategory = pathParts.length > 2 ? pathParts[1] : '';

            resources.push({
                id: itemRelativePath.replace('.md', ''),
                title,
                category,
                subcategory,
                filePath: `/content/${itemRelativePath}`,
                content: content.slice(0, 300) + '...', // Preview for search/display
                fullContent: content // Actually for Client-side search it might be heavy to load ALL content in JSON. 
                // Better strategy: Use fuse.js on metadata + maybe keywords.
                // For now, I'll include fullContent but strip it restrictedly if file size grows. 
                // Given the repo size provided in list_dir, files are small.
            });
        }
    }
}

console.log('Generating content index...');

for (const dir of CONTENT_DIRS) {
    const fullPath = path.join(PROJECT_ROOT, dir);
    if (fs.existsSync(fullPath)) {
        processDirectory(fullPath, dir);
    } else {
        // console.warn(`Directory not found: ${dir}`);
    }
}

// Write JSON
fs.writeFileSync(OUTPUT_JSON, JSON.stringify(resources, null, 2));
console.log(`Generated ${resources.length} resources.`);
