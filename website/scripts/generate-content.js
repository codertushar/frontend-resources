import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const isWatchMode = process.argv.includes('--watch');

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

function stripMarkdown(text) {
    return text
        .replace(/```[a-z]*\r?\n[\s\S]*?```/gi, '') // Code blocks with language identifier
        .replace(/^>\s*\*\*Interview Importance:\*\*.*$/gm, '') // Remove interview importance badges
        .replace(/^>.*$/gm, '')            // Remove entire blockquote lines
        .replace(/^#+\s+/gm, '')           // Headers
        .replace(/\*\*(.+?)\*\*/g, '$1')   // Bold (non-greedy)
        .replace(/\*(.+?)\*/g, '$1')       // Italic (non-greedy)
        .replace(/`([^`]+)`/g, '$1')       // Inline code
        .replace(/^\s*[-*+]\s+/gm, '')     // Unordered list items
        .replace(/^\s*\d+\.\s+/gm, '')     // Numbered list items
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
        .replace(/\|[^|]*\|/g, ' ')        // Table cells
        .replace(/^[-|:\s]+$/gm, '')       // Table separator rows
        .replace(/---+/g, '')              // Horizontal rules
        .replace(/\n{2,}/g, ' ')           // Multiple newlines to space
        .replace(/\n/g, ' ')               // Single newlines to space
        .replace(/\s{2,}/g, ' ')           // Multiple spaces to single space
        .trim();
}

function extractTitleAndContent(content, filename) {
    // Try to find H1 first (must be at start of file, allowing for leading whitespace/newlines)
    const h1Match = content.match(/^\s*#\s+(.*)$/m);

    let title;
    let processedContent = content;

    if (h1Match) {
        // Extract title from H1
        title = h1Match[1].replace(/\*\*/g, '').trim();
        // Remove the H1 line from content (it will be displayed in page header)
        processedContent = content.replace(/^\s*#\s+.*\r?\n?/, '').trimStart();
    } else {
        // Fallback to filename if no H1 found
        const name = filename.replace(/\.md$/, '');
        // Split camelCase and delimiters
        title = name
            .replace(/([a-z])([A-Z])/g, '$1 $2') // CamelCase to spaced
            .replace(/[-_]/g, ' ') // Hyphens/Underscores to space
            .split(/\s+/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Title Case
            .join(' ');
    }

    return { title, processedContent };
}

function processDirectory(dirPath, relativePath, resources) {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const item of items) {
        const itemPath = path.join(dirPath, item.name);
        const itemRelativePath = path.join(relativePath, item.name);

        if (item.isDirectory()) {
            if (item.name === 'node_modules' || item.name === '.git') continue;
            processDirectory(itemPath, itemRelativePath, resources);
        } else if (item.isFile() && item.name.endsWith('.md')) {
            // Ignore README/AGENTS at root if strictly looking for resources,
            // but maybe we want them? Let's stick to CONTENT_DIRS for now.
            const rawContent = fs.readFileSync(itemPath, 'utf-8');
            const { title, processedContent } = extractTitleAndContent(rawContent, item.name);

            const pathParts = itemRelativePath.split('/');
            const category = pathParts[0];
            const subcategory = pathParts.length > 2 ? pathParts[1] : '';

            resources.push({
                id: itemRelativePath.replace('.md', ''),
                title,
                category,
                subcategory,
                filePath: `/content/${itemRelativePath}`,
                content: stripMarkdown(processedContent).slice(0, 300), // Preview for search/display
                fullContent: processedContent // H1 title stripped - displayed in page header instead
            });
        }
    }
}

function generateContent() {
    const resources = [];

    for (const dir of CONTENT_DIRS) {
        const fullPath = path.join(PROJECT_ROOT, dir);
        if (fs.existsSync(fullPath)) {
            processDirectory(fullPath, dir, resources);
        }
    }

    // Write JSON
    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(resources, null, 2));
    console.log(`Generated ${resources.length} resources.`);
}

// Initial generation
console.log('Generating content index...');
generateContent();

// Watch mode
if (isWatchMode) {
    console.log('Watching for changes in content directories...');

    let debounceTimer = null;

    const handleChange = (eventType, filename) => {
        if (!filename?.endsWith('.md')) return;

        // Debounce to avoid multiple rapid regenerations
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            console.log(`\nFile changed: ${filename}`);
            generateContent();
        }, 100);
    };

    for (const dir of CONTENT_DIRS) {
        const fullPath = path.join(PROJECT_ROOT, dir);
        if (fs.existsSync(fullPath)) {
            fs.watch(fullPath, { recursive: true }, handleChange);
            console.log(`  Watching: ${dir}/`);
        }
    }
}
