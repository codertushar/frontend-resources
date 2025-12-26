import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '../../');
const CONTENT_DIRS = ['js', 'dsa', 'ai', 'general', 'machine-coding', 'system-design'];

// Premium content configuration (copied from generate-content.js)
const PREMIUM_CONFIG = {
    fullyPremiumCategories: ['system-design', 'machine-coding', 'ai'],
    mostlyPremiumCategories: ['dsa'],
    premiumTopics: [
        'debounce',
        'throttle',
        'deep_clone',
        'deep-clone',
        'map_limit',
        'maplimit',
        'fire_on_push',
        'observable_array',
        'sequential',
        'prototype',
    ],
    freeTopics: [
        '30-day',
        'guide',
        'introduction',
        'getting-started',
    ],
};

// Difficulty analysis (simplified from generate-content.js)
const DIFFICULTY_MAP = {
    'js': { default: 'medium', subcategories: { 'general-concepts': 'easy', 'polyfills': 'medium', 'utils': 'easy', 'arrays': 'easy' } },
    'dsa': { default: 'medium', subcategories: { 'arrays': 'easy', 'strings': 'easy', 'linked-list': 'medium', 'trees': 'medium', 'graphs': 'hard', 'dynamic-programming': 'hard', 'dp': 'hard' } },
    'ai': { default: 'hard', subcategories: {} },
    'machine-coding': { default: 'medium', subcategories: {} },
    'system-design': { default: 'hard', subcategories: {} },
    'general': { default: 'easy', subcategories: {} }
};

const DIFFICULTY_INDICATORS = {
    hard: {
        keywords: ['advanced', 'complex', 'optimization', 'performance tuning', 'memory management', 'garbage collection', 'concurrency', 'distributed', 'scalability', 'architecture', 'design pattern', 'microservices', 'event loop', 'internals', 'under the hood', 'low-level', 'bitwise', 'dynamic programming', 'graph', 'tree traversal', 'backtracking', 'memoization', 'recursion', 'time complexity', 'space complexity', 'big o', 'o(n', 'webpack', 'bundler', 'compiler', 'ast', 'parser', 'security', 'authentication', 'authorization', 'encryption', 'websocket', 'streaming', 'real-time', 'caching strategy', 'load balancing', 'database design', 'indexing', 'sharding', 'machine learning', 'neural', 'ai model', 'embeddings', 'system design', 'high availability', 'fault tolerance'],
        patterns: [/O\([n²2]|nlogn|log\s*n\)/i, /\bDP\b/, /implement.*from scratch/i, /build your own/i, /deep dive/i, /under the hood/i, /how.*works internally/i]
    },
    easy: {
        keywords: ['introduction', 'basics', 'beginner', 'getting started', 'what is', 'overview', 'fundamentals', 'simple', 'quick guide', 'cheat sheet', 'reference', 'syntax', 'hello world', 'first steps', 'tutorial', 'walkthrough', 'common', 'basic', 'essential', 'must know', 'everyday'],
        patterns: [/^#\s*(what is|introduction|basics|getting started)/im, /for beginners/i, /made simple/i, /easy guide/i, /in \d+ minutes/i]
    }
};

function analyzeContentDifficulty(content) {
    const contentLower = content.toLowerCase();
    let score = 0;

    for (const keyword of DIFFICULTY_INDICATORS.hard.keywords) {
        if (contentLower.includes(keyword)) score += 1;
    }
    for (const pattern of DIFFICULTY_INDICATORS.hard.patterns) {
        if (pattern.test(content)) score += 2;
    }
    for (const keyword of DIFFICULTY_INDICATORS.easy.keywords) {
        if (contentLower.includes(keyword)) score -= 1;
    }
    for (const pattern of DIFFICULTY_INDICATORS.easy.patterns) {
        if (pattern.test(content)) score -= 2;
    }

    const codeBlocks = content.match(/```[\s\S]*?```/g) || [];
    const totalCodeLines = codeBlocks.reduce((sum, block) => sum + block.split('\n').length, 0);
    if (totalCodeLines > 100) score += 2;
    else if (totalCodeLines > 50) score += 1;
    else if (totalCodeLines < 20) score -= 1;

    const headingCount = (content.match(/^#{2,3}\s+/gm) || []).length;
    if (headingCount > 10) score += 1;
    else if (headingCount < 4) score -= 1;

    const wordCount = content.split(/\s+/).length;
    if (wordCount > 3000) score += 1;
    else if (wordCount < 500) score -= 1;

    return score;
}

function getDifficulty(category, subcategory, content) {
    const difficultyMatch = content.match(/^---[\s\S]*?difficulty:\s*(easy|medium|hard)[\s\S]*?---/im);
    if (difficultyMatch) return difficultyMatch[1].toLowerCase();

    const contentScore = analyzeContentDifficulty(content);
    const categoryConfig = DIFFICULTY_MAP[category];
    let categoryDefault = 'medium';
    if (categoryConfig) {
        if (subcategory && categoryConfig.subcategories[subcategory]) {
            categoryDefault = categoryConfig.subcategories[subcategory];
        } else {
            categoryDefault = categoryConfig.default;
        }
    }

    const categoryModifier = categoryDefault === 'hard' ? 2 : categoryDefault === 'easy' ? -2 : 0;
    const finalScore = contentScore + categoryModifier;

    if (finalScore >= 3) return 'hard';
    if (finalScore <= -3) return 'easy';
    return 'medium';
}

function isPremiumContent(category, difficulty, subcategory, filePath = '') {
    const filePathLower = filePath.toLowerCase();
    const fileName = filePathLower.split('/').pop().replace('.md', '');

    for (const topic of PREMIUM_CONFIG.freeTopics) {
        if (filePathLower.includes(topic)) return false;
    }

    if (difficulty === 'hard') return true;

    if (PREMIUM_CONFIG.fullyPremiumCategories.includes(category)) return true;

    if (PREMIUM_CONFIG.mostlyPremiumCategories.includes(category)) {
        return difficulty !== 'easy';
    }

    for (const topic of PREMIUM_CONFIG.premiumTopics) {
        if (fileName.includes(topic) || filePathLower.includes(topic)) return true;
    }

    if (category === 'general') {
        if (filePathLower.includes('browser') || filePathLower.includes('rendering') || filePathLower.includes('interview')) {
            return true;
        }
    }

    return false;
}

function parseFrontmatter(content) {
    const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);

    if (!match) {
        return { metadata: {}, body: content, hasFrontmatter: false, frontmatterText: '' };
    }

    const frontmatterText = match[1];
    const body = match[2];

    const metadata = {};
    const lines = frontmatterText.split('\n');
    for (const line of lines) {
        const kvMatch = line.match(/^(\w+):\s*(.+)$/);
        if (kvMatch) {
            const key = kvMatch[1].trim();
            let value = kvMatch[2].trim();
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            metadata[key] = value;
        }
    }

    return { metadata, body, hasFrontmatter: true, frontmatterText };
}

function addPremiumToFrontmatter(content, isPremium) {
    const { metadata, body, hasFrontmatter, frontmatterText } = parseFrontmatter(content);

    // If already has premium field, skip
    if (metadata.premium !== undefined) {
        return { content, changed: false, reason: 'already has premium field' };
    }

    const premiumLine = `premium: ${isPremium}`;

    if (hasFrontmatter) {
        // Add premium line to existing frontmatter
        const newFrontmatter = frontmatterText + '\n' + premiumLine;
        const newContent = `---\n${newFrontmatter}\n---\n${body}`;
        return { content: newContent, changed: true };
    } else {
        // Create new frontmatter
        const newContent = `---\n${premiumLine}\n---\n\n${content}`;
        return { content: newContent, changed: true };
    }
}

function processFile(filePath, relativePath) {
    const content = fs.readFileSync(filePath, 'utf-8');

    const pathParts = relativePath.split('/');
    const category = pathParts[0];
    const subcategory = pathParts.length > 2 ? pathParts[1] : '';

    const difficulty = getDifficulty(category, subcategory, content);
    const premium = isPremiumContent(category, difficulty, subcategory, relativePath);

    const result = addPremiumToFrontmatter(content, premium);

    if (result.changed) {
        fs.writeFileSync(filePath, result.content);
        console.log(`✓ ${relativePath} → premium: ${premium}`);
        return { updated: true, premium };
    } else {
        console.log(`- ${relativePath} (${result.reason})`);
        return { updated: false, premium };
    }
}

function processDirectory(dirPath, relativePath, stats) {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const item of items) {
        const itemPath = path.join(dirPath, item.name);
        const itemRelativePath = path.join(relativePath, item.name);

        if (item.isDirectory()) {
            if (item.name === 'node_modules' || item.name === '.git') continue;
            processDirectory(itemPath, itemRelativePath, stats);
        } else if (item.isFile() && item.name.endsWith('.md') && !item.name.includes('README') && !item.name.includes('AGENTS')) {
            const result = processFile(itemPath, itemRelativePath);
            stats.total++;
            if (result.updated) stats.updated++;
            if (result.premium) stats.premium++;
            else stats.free++;
        }
    }
}

// Main execution
console.log('Adding premium frontmatter to all articles...\n');

const stats = { total: 0, updated: 0, premium: 0, free: 0 };

for (const dir of CONTENT_DIRS) {
    const fullPath = path.join(PROJECT_ROOT, dir);
    if (fs.existsSync(fullPath)) {
        processDirectory(fullPath, dir, stats);
    }
}

console.log('\n========================================');
console.log(`Total articles: ${stats.total}`);
console.log(`Updated: ${stats.updated}`);
console.log(`Premium: ${stats.premium}`);
console.log(`Free: ${stats.free}`);
console.log('========================================');
console.log('\nDone! Now run: node scripts/generate-content.js');
