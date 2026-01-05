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
const PUBLIC_JSON = path.join(WEBSITE_ROOT, 'public', 'content.json'); // For service worker access
const PREMIUM_CONTENT_JSON = path.join(WEBSITE_ROOT, 'src', 'data', 'premium-content.json'); // Full premium content (server-side only)

const CONTENT_DIRS = ['js', 'dsa', 'ai', 'general', 'machine-coding', 'system-design'];

// Premium content configuration
// Strategy: ~50% premium, ~50% free with balanced conditions
// - Each category has at least some free content
// - Hard difficulty: mostly premium, but first 1-2 articles free
// - Medium difficulty: 50% premium, 50% free (popular/useful ones stay free)
// - Easy difficulty: always free
// - System Design: 80% premium (1-2 free intro articles)
// - Machine Coding: 80% premium (1-2 free intro articles)
// - AI: 80% premium (1-2 free intro articles)
// - DSA: 60% premium (easy all free, some medium free)
// - JS/General: 40% premium (utilities/advanced concepts premium)
const PREMIUM_CONFIG = {
    // Categories that are mostly premium but not 100%
    mostlyPremiumCategories: ['system-design', 'machine-coding', 'ai'],
    // Categories that are balanced (some premium, some free)
    balancedCategories: ['dsa', 'js', 'general'],
    // Specific files/topics that should be premium (advanced utilities)
    // These are moved to premium to maintain value for paying users
    premiumTopics: [
        'debounce',
        'throttle',
        'deep_clone',
        'deep-clone',
        'map_limit',
        'maplimit',
        'fire_on_push',
        'sequential',
    ],
    // Specific files/topics that should ALWAYS be free (intro/guide content, popular utilities)
    // Popular utilities and fundamental concepts should remain free for SEO and user acquisition
    freeTopics: [
        '30-day',
        'guide',
        'introduction',
        'getting-started',
        'prototype',  // Prototype is fundamental, keep free
        'observable_array',  // Popular pattern, keep free
        'event_emitter',  // Common pattern, keep free
        'observer',  // Design pattern, keep free
        'factory',  // Design pattern, keep free
        'singleton',  // Design pattern, keep free
        'module',  // Design pattern, keep free
    ],
};

function isPremiumContent(category, difficulty, subcategory, filePath = '', contentIndex = 0) {
    const filePathLower = filePath.toLowerCase();
    const fileName = filePathLower.split('/').pop().replace('.md', '');

    // Rule 0: Check if explicitly marked as free (intro guides and popular free topics)
    for (const topic of PREMIUM_CONFIG.freeTopics) {
        if (filePathLower.includes(topic)) {
            return false;
        }
    }

    // Rule 1: Easy difficulty = always free
    if (difficulty === 'easy') {
        return false;
    }

    // Rule 2: Check specific premium topics (advanced utilities)
    for (const topic of PREMIUM_CONFIG.premiumTopics) {
        if (fileName.includes(topic) || filePathLower.includes(topic)) {
            return true;
        }
    }

    // Rule 3: Hard difficulty = mostly premium, but keep first 2-3 accessible for each category
    if (difficulty === 'hard') {
        // Keep first 1-2 hard articles free per category for accessibility
        // This is determined by contentIndex (position in list)
        return contentIndex > 1; // First 2 (indices 0,1) are free, rest are premium
    }

    // Rule 4: System Design, Machine Coding, AI - mostly premium (~80%)
    // Keep first 1-2 articles free per category
    if (PREMIUM_CONFIG.mostlyPremiumCategories.includes(category)) {
        return contentIndex > 1; // First 2 articles free, rest premium
    }

    // Rule 5: DSA - balanced (easy free, ~60% of medium premium, hard mostly premium)
    if (category === 'dsa') {
        if (difficulty === 'medium') {
            // 50% of medium articles should be free for SEO
            // Use contentIndex to alternate: even indices free, odd premium
            return contentIndex % 2 === 1;
        }
        if (difficulty === 'hard') {
            return contentIndex > 0; // First hard article per difficulty free
        }
    }

    // Rule 6: JS and General categories - balanced
    if (['js', 'general'].includes(category)) {
        if (difficulty === 'medium') {
            // 50% of medium articles free for SEO and popular utility retention
            return contentIndex % 2 === 1;
        }
        if (difficulty === 'hard') {
            return contentIndex > 0; // First hard article free
        }
    }

    // Rule 7: Browser/rendering advanced topics = premium
    if (filePathLower.includes('browser') && difficulty !== 'easy') {
        return true;
    }
    if (filePathLower.includes('rendering') && difficulty !== 'easy') {
        return true;
    }

    // Default: free (bias towards free for unknown cases)
    return false;
}

// Generate preview content for premium articles (first ~300 words)
function generatePreviewContent(fullContent) {
    const lines = fullContent.split('\n');
    let wordCount = 0;
    let previewLines = [];

    for (const line of lines) {
        previewLines.push(line);
        wordCount += line.split(/\s+/).filter(w => w.length > 0).length;

        // Stop after ~300 words but ensure we end at a paragraph break
        if (wordCount >= 300) {
            // Try to end at a paragraph break
            const nextLineIndex = lines.indexOf(line) + 1;
            if (nextLineIndex < lines.length && lines[nextLineIndex].trim() === '') {
                break;
            }
            // If next line is not empty, continue until paragraph break
            if (wordCount >= 400) {
                break;
            }
        }
    }

    return previewLines.join('\n');
}

// Smart tags based on subcategory, path, and content patterns
const SMART_TAGS = {
    // Subcategory-based tags
    subcategory: {
        'polyfills': ['polyfill', 'javascript'],
        'promises': ['async', 'promises', 'javascript'],
        'utils': ['utility', 'javascript'],
        'general-concepts': ['concepts', 'javascript'],
        'design-patterns': ['design-patterns', 'architecture'],
        'arrays': ['arrays', 'dsa'],
        'strings': ['strings', 'dsa'],
        'linked-list': ['linked-list', 'dsa'],
        'trees': ['trees', 'dsa'],
        'graphs': ['graphs', 'dsa'],
        'dynamic-programming': ['dp', 'dsa'],
        'dp': ['dp', 'dsa'],
        'sorting': ['sorting', 'dsa'],
        'searching': ['searching', 'dsa'],
        'stack': ['stack', 'dsa'],
        'queue': ['queue', 'dsa'],
        'heap': ['heap', 'dsa'],
        'trie': ['trie', 'dsa'],
        'recursion': ['recursion', 'dsa'],
    },
    // Category-based tags
    category: {
        'js': ['javascript'],
        'dsa': ['dsa', 'algorithms'],
        'ai': ['ai', 'machine-learning'],
        'machine-coding': ['machine-coding', 'frontend'],
        'system-design': ['system-design', 'architecture'],
        'general': ['concepts'],
    },
    // Content pattern-based tags (keyword -> tag)
    // These patterns are always applied (technical patterns that are specific enough)
    patterns: [
        { match: /Array\.prototype\./i, tag: 'array-methods' },
        { match: /polyfill/i, tag: 'polyfill' },
        { match: /\bcurry|\bcurried/i, tag: 'functional' },
        { match: /\bevent\s*(emitter|listener|handler)/i, tag: 'events' },
        { match: /\bObject\.(keys|values|entries|assign|freeze)/i, tag: 'object-methods' },
        { match: /\bString\.prototype\./i, tag: 'string-methods' },
        { match: /\bFunction\.prototype\./i, tag: 'function-methods' },
        { match: /\bpagination/i, tag: 'pagination' },
        { match: /\btwo pointer|\bsliding window/i, tag: 'two-pointers' },
        { match: /\blinked list/i, tag: 'linked-list' },
        { match: /\bdynamic programming/i, tag: 'dp' },
    ],
    // These patterns require either title match OR multiple occurrences in content
    // to avoid false positives from passing mentions
    strictPatterns: [
        { match: /\bPromise\b/i, tag: 'promises', minCount: 8 },
        { match: /\bmemoiz/i, tag: 'memoization', minCount: 5 },
        { match: /\bdebounce|\bthrottle/i, tag: 'performance', minCount: 8 },
        { match: /\bDOM\b/i, tag: 'dom', minCount: 10 },
        { match: /\bclosure/i, tag: 'closures', minCount: 10 },
        { match: /\basync\b|\bawait\b/i, tag: 'async', minCount: 10 },
        { match: /\brecursion|\brecursive/i, tag: 'recursion', minCount: 5 },
        { match: /\bLRU|\bcaching/i, tag: 'caching', minCount: 5 },
        { match: /\bsorting|\.sort\(/i, tag: 'sorting', minCount: 5 },
        { match: /\bbinary search/i, tag: 'searching', minCount: 3 },
        { match: /\btree\b|\bBST\b|\bbinary tree/i, tag: 'trees', minCount: 8 },
        { match: /\bgraph\b|\bBFS\b|\bDFS\b/i, tag: 'graphs', minCount: 5 },
        { match: /\binterval/i, tag: 'intervals', minCount: 5 },
    ],
    // Title-only patterns - only match if the keyword is in the title
    titlePatterns: [
        { match: /\bthis\b/i, tag: 'this-binding' },
        { match: /\bfetch\b|\bAPI\b|\bHTTP/i, tag: 'api' },
        { match: /\bcache\b/i, tag: 'caching' },
    ]
};

function generateSmartTags(category, subcategory, content, title) {
    const tags = new Set();

    // Add category-based tags
    if (SMART_TAGS.category[category]) {
        SMART_TAGS.category[category].forEach(tag => tags.add(tag));
    }

    // Add subcategory-based tags
    if (subcategory && SMART_TAGS.subcategory[subcategory]) {
        SMART_TAGS.subcategory[subcategory].forEach(tag => tags.add(tag));
    }

    const searchText = `${title}\n${content}`;

    // Add simple pattern-based tags (always applied)
    for (const { match, tag } of SMART_TAGS.patterns) {
        if (match.test(searchText)) {
            tags.add(tag);
        }
    }

    // Add strict pattern-based tags (require title match OR minimum count)
    for (const { match, tag, minCount } of SMART_TAGS.strictPatterns) {
        const inTitle = match.test(title);
        const matches = content.match(new RegExp(match.source, 'gi')) || [];
        if (inTitle || matches.length >= minCount) {
            tags.add(tag);
        }
    }

    // Add title-only pattern tags
    for (const { match, tag } of SMART_TAGS.titlePatterns) {
        if (match.test(title)) {
            tags.add(tag);
        }
    }

    // Special handling for React tag - only tag if article is primarily about React
    // Not just mentioning React as an example use case
    // Check for React as the framework (not "react to" as a verb)
    const titleHasReact = /\bReact\b(?!\s+to\b)/i.test(title);
    const reactImportCount = (content.match(/import.*from ['"]react/gi) || []).length;

    const isReactArticle = (
        // Title explicitly mentions React (as a framework, not "react to")
        titleHasReact ||
        // Is in ai category and mentions React for streaming (specific use case)
        (category === 'ai' && /streaming.*\bReact\b(?!\s+to)/i.test(title)) ||
        // Has multiple React imports (3+) suggesting it's React-focused, not just an example
        reactImportCount >= 3 ||
        // Machine-coding articles with significant React code (2+ imports)
        (category === 'machine-coding' && reactImportCount >= 2)
    );

    if (isReactArticle) {
        tags.add('react');
    }

    return [...tags].sort();
}

// Default difficulty mappings based on category and subcategory
const DIFFICULTY_MAP = {
    // JavaScript
    'js': {
        default: 'medium',
        subcategories: {
            'general-concepts': 'easy',
            'polyfills': 'medium',
            'utils': 'easy',
            'arrays': 'easy',
            'objects': 'easy',
            'strings': 'easy',
            'async': 'medium',
            'advanced': 'hard',
        }
    },
    // DSA
    'dsa': {
        default: 'medium',
        subcategories: {
            'arrays': 'easy',
            'strings': 'easy',
            'linked-list': 'medium',
            'trees': 'medium',
            'graphs': 'hard',
            'dynamic-programming': 'hard',
            'dp': 'hard',
            'recursion': 'medium',
            'sorting': 'easy',
            'searching': 'easy',
            'stack': 'easy',
            'queue': 'easy',
            'heap': 'medium',
            'trie': 'hard',
        }
    },
    // AI
    'ai': {
        default: 'hard',
        subcategories: {}
    },
    // Machine Coding
    'machine-coding': {
        default: 'medium',
        subcategories: {}
    },
    // System Design
    'system-design': {
        default: 'hard',
        subcategories: {}
    },
    // General
    'general': {
        default: 'easy',
        subcategories: {}
    }
};

// Keywords and patterns that indicate difficulty levels
const DIFFICULTY_INDICATORS = {
    hard: {
        keywords: [
            'advanced', 'complex', 'optimization', 'performance tuning',
            'memory management', 'garbage collection', 'concurrency',
            'distributed', 'scalability', 'architecture', 'design pattern',
            'microservices', 'event loop', 'internals', 'under the hood',
            'low-level', 'bitwise', 'dynamic programming', 'graph',
            'tree traversal', 'backtracking', 'memoization', 'recursion',
            'time complexity', 'space complexity', 'big o', 'o(n',
            'webpack', 'bundler', 'compiler', 'ast', 'parser',
            'security', 'authentication', 'authorization', 'encryption',
            'websocket', 'streaming', 'real-time', 'caching strategy',
            'load balancing', 'database design', 'indexing', 'sharding',
            'machine learning', 'neural', 'ai model', 'embeddings',
            'system design', 'high availability', 'fault tolerance'
        ],
        patterns: [
            /O\([n²2]|nlogn|log\s*n\)/i,  // Big O notation for complex algos
            /\bDP\b/,                       // Dynamic Programming abbreviation
            /implement.*from scratch/i,
            /build your own/i,
            /deep dive/i,
            /under the hood/i,
            /how.*works internally/i
        ]
    },
    easy: {
        keywords: [
            'introduction', 'basics', 'beginner', 'getting started',
            'what is', 'overview', 'fundamentals', 'simple',
            'quick guide', 'cheat sheet', 'reference', 'syntax',
            'hello world', 'first steps', 'tutorial', 'walkthrough',
            'common', 'basic', 'essential', 'must know', 'everyday'
        ],
        patterns: [
            /^#\s*(what is|introduction|basics|getting started)/im,
            /for beginners/i,
            /made simple/i,
            /easy guide/i,
            /in \d+ minutes/i
        ]
    }
};

function analyzeContentDifficulty(content) {
    const contentLower = content.toLowerCase();
    let score = 0; // negative = easy, positive = hard

    // Check for hard indicators
    for (const keyword of DIFFICULTY_INDICATORS.hard.keywords) {
        if (contentLower.includes(keyword)) {
            score += 1;
        }
    }
    for (const pattern of DIFFICULTY_INDICATORS.hard.patterns) {
        if (pattern.test(content)) {
            score += 2; // Patterns are stronger signals
        }
    }

    // Check for easy indicators
    for (const keyword of DIFFICULTY_INDICATORS.easy.keywords) {
        if (contentLower.includes(keyword)) {
            score -= 1;
        }
    }
    for (const pattern of DIFFICULTY_INDICATORS.easy.patterns) {
        if (pattern.test(content)) {
            score -= 2;
        }
    }

    // Analyze code complexity
    const codeBlocks = content.match(/```[\s\S]*?```/g) || [];
    const totalCodeLines = codeBlocks.reduce((sum, block) => {
        return sum + block.split('\n').length;
    }, 0);

    // Long code examples suggest more complex topics
    if (totalCodeLines > 100) score += 2;
    else if (totalCodeLines > 50) score += 1;
    else if (totalCodeLines < 20) score -= 1;

    // Count headings (more sections = potentially more complex)
    const headingCount = (content.match(/^#{2,3}\s+/gm) || []).length;
    if (headingCount > 10) score += 1;
    else if (headingCount < 4) score -= 1;

    // Article length (word count)
    const wordCount = content.split(/\s+/).length;
    if (wordCount > 3000) score += 1;
    else if (wordCount < 500) score -= 1;

    return score;
}

function getDifficulty(category, subcategory, content) {
    // 1. First check if difficulty is explicitly specified in frontmatter
    const difficultyMatch = content.match(/^---[\s\S]*?difficulty:\s*(easy|medium|hard)[\s\S]*?---/im);
    if (difficultyMatch) {
        return difficultyMatch[1].toLowerCase();
    }

    // 2. Analyze content to determine difficulty
    const contentScore = analyzeContentDifficulty(content);

    // 3. Get category-based default as a baseline
    const categoryConfig = DIFFICULTY_MAP[category];
    let categoryDefault = 'medium';
    if (categoryConfig) {
        if (subcategory && categoryConfig.subcategories[subcategory]) {
            categoryDefault = categoryConfig.subcategories[subcategory];
        } else {
            categoryDefault = categoryConfig.default;
        }
    }

    // 4. Combine content analysis with category default
    // Convert category default to a score modifier
    const categoryModifier = categoryDefault === 'hard' ? 2 : categoryDefault === 'easy' ? -2 : 0;
    const finalScore = contentScore + categoryModifier;

    // 5. Determine final difficulty based on combined score
    if (finalScore >= 3) return 'hard';
    if (finalScore <= -3) return 'easy';
    return 'medium';
}

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

/**
 * Generate a meaningful description from the content
 * Extracts the first meaningful paragraph or sentence that describes the topic
 */
function generateDescription(content, title, maxLength = 160) {
    // Clean the content first
    let text = content
        .replace(/```[a-z]*\r?\n[\s\S]*?```/gi, '') // Remove code blocks
        .replace(/^>\s*\*\*Interview Importance:\*\*.*$/gm, '') // Remove interview badges
        .replace(/^>\s*\*\*Target Level:\*\*.*$/gm, '') // Remove target level badges
        .replace(/^>.*$/gm, '')            // Remove blockquotes
        .replace(/^#{1,6}\s+.*$/gm, '')    // Remove headers
        .replace(/^\s*[-*+]\s+/gm, '')     // Remove list markers
        .replace(/^\s*\d+\.\s+/gm, '')     // Remove numbered list markers
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
        .replace(/\|[^|]*\|/g, '')         // Remove table cells
        .replace(/^[-|:\s]+$/gm, '')       // Remove table separators
        .replace(/---+/g, '')              // Remove horizontal rules
        .replace(/\*\*(.+?)\*\*/g, '$1')   // Remove bold markers
        .replace(/\*(.+?)\*/g, '$1')       // Remove italic markers
        .replace(/`([^`]+)`/g, '$1')       // Remove inline code markers
        .replace(/\n{2,}/g, '\n')          // Normalize newlines
        .trim();

    // Patterns that indicate non-descriptive content (meta text, incomplete sentences, etc.)
    const skipPatterns = [
        /^here'?s?\s+(a|an|the|how|my|our)/i,        // "Here's a...", "Here is how..."
        /^let'?s?\s+(break|look|see|start|dive)/i,   // "Let's break down...", "Let's look at..."
        /^below\s+(is|are)/i,                         // "Below is..."
        /^this\s+(is|shows|demonstrates)/i,           // "This is..." at start
        /^in\s+this\s+(article|guide|tutorial)/i,     // "In this article..."
        /^(base|edge)\s+case:?$/i,                    // Just "Base Case:" alone
        /^target\s+level:/i,                          // "Target Level:"
        /:\s*$/,                                       // Ends with just a colon
        /^[A-Z][a-z]+\s*:\s*$/,                       // Single word followed by colon like "Parameters :"
        /^(note|tip|warning|important):/i,            // Note:, Tip:, etc.
    ];

    // Check if a paragraph is a good description candidate
    function isGoodParagraph(p) {
        const trimmed = p.trim();
        // Too short
        if (trimmed.length < 40) return false;
        // Matches skip patterns
        for (const pattern of skipPatterns) {
            if (pattern.test(trimmed)) return false;
        }
        // Ends with incomplete markers
        if (/\s*[:=]\s*$/.test(trimmed)) return false;
        // Contains too many special formatting chars (likely a list or code)
        if ((trimmed.match(/[→←↑↓✅❌⚠️]/g) || []).length > 3) return false;
        return true;
    }

    // Split into sentences/paragraphs and find the first meaningful one
    const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 30);

    // Find the first good paragraph
    let description = '';
    for (const p of paragraphs) {
        if (isGoodParagraph(p)) {
            description = p.trim();
            break;
        }
    }

    // Fallback: if no good paragraph found, use title-based description or cleaned content
    if (!description) {
        // Try to create a description from the title
        const cleanTitle = title.replace(/^[^\w]*/, '').replace(/[—–-].*$/, '').trim();
        if (cleanTitle) {
            // Use the first good paragraph even if it's not perfect, or fallback to content
            description = paragraphs[0]?.trim() || stripMarkdown(content).slice(0, maxLength);
        } else {
            description = stripMarkdown(content).slice(0, maxLength);
        }
    }

    // Clean up any remaining markdown artifacts
    description = description
        .replace(/\s{2,}/g, ' ')
        .replace(/\s*:\s*$/, '')  // Remove trailing colons
        .trim();

    // Truncate intelligently at sentence boundary if too long
    if (description.length > maxLength) {
        // Try to cut at a sentence boundary
        const truncated = description.slice(0, maxLength);
        const lastPeriod = truncated.lastIndexOf('.');
        const lastQuestion = truncated.lastIndexOf('?');
        const lastExclaim = truncated.lastIndexOf('!');
        const lastSentenceEnd = Math.max(lastPeriod, lastQuestion, lastExclaim);

        if (lastSentenceEnd > maxLength * 0.5) {
            // Found a good sentence boundary
            description = truncated.slice(0, lastSentenceEnd + 1);
        } else {
            // Cut at word boundary
            const lastSpace = truncated.lastIndexOf(' ');
            description = truncated.slice(0, lastSpace) + '...';
        }
    }

    // Final check: if description is too short or ends poorly, add ellipsis
    if (description.length < 50 && !description.endsWith('.') && !description.endsWith('!') && !description.endsWith('?')) {
        description = description + '...';
    }

    return description;
}

function parseFrontmatter(content) {
    // Check for YAML frontmatter (starts with --- and ends with ---)
    const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);

    if (!match) {
        return { metadata: {}, body: content };
    }

    const frontmatterText = match[1];
    const body = match[2];

    // Parse simple YAML key: value pairs
    const metadata = {};
    const lines = frontmatterText.split('\n');
    for (const line of lines) {
        const kvMatch = line.match(/^(\w+):\s*(.+)$/);
        if (kvMatch) {
            const key = kvMatch[1].trim();
            let value = kvMatch[2].trim();
            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            metadata[key] = value;
        }
    }

    return { metadata, body };
}

function extractTitleAndContent(content, filename) {
    // First, parse frontmatter if present
    const { metadata, body } = parseFrontmatter(content);

    // Try to find H1 first (must be at start of file, allowing for leading whitespace/newlines)
    const h1Match = body.match(/^\s*#\s+(.*)$/m);

    let title;
    let processedContent = body;

    // Use title from frontmatter if available, otherwise from H1, otherwise from filename
    if (metadata.title) {
        title = metadata.title;
        // Still remove H1 if present to avoid duplication
        if (h1Match) {
            processedContent = body.replace(/^\s*#\s+.*\r?\n?/, '').trimStart();
        }
    } else if (h1Match) {
        // Extract title from H1
        title = h1Match[1].replace(/\*\*/g, '').trim();
        // Remove the H1 line from content (it will be displayed in page header)
        processedContent = body.replace(/^\s*#\s+.*\r?\n?/, '').trimStart();
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

    return { title, processedContent, metadata };
}

function processDirectory(dirPath, relativePath, resources, premiumFullContent = {}, categoryDifficultyIndex = {}) {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const item of items) {
        const itemPath = path.join(dirPath, item.name);
        const itemRelativePath = path.join(relativePath, item.name);

        if (item.isDirectory()) {
            if (item.name === 'node_modules' || item.name === '.git') continue;
            processDirectory(itemPath, itemRelativePath, resources, premiumFullContent, categoryDifficultyIndex);
        } else if (item.isFile() && item.name.endsWith('.md')) {
            // Ignore README/AGENTS at root if strictly looking for resources,
            // but maybe we want them? Let's stick to CONTENT_DIRS for now.
            const rawContent = fs.readFileSync(itemPath, 'utf-8');
            const fileStats = fs.statSync(itemPath);
            const { title, processedContent, metadata } = extractTitleAndContent(rawContent, item.name);

            const pathParts = itemRelativePath.split('/');
            const category = pathParts[0];
            const subcategory = pathParts.length > 2 ? pathParts[1] : '';

            // Determine difficulty level - frontmatter takes priority
            const difficulty = metadata.difficulty && ['easy', 'medium', 'hard'].includes(metadata.difficulty.toLowerCase())
                ? metadata.difficulty.toLowerCase()
                : getDifficulty(category, subcategory, rawContent);

            // Calculate numeric difficulty score for granular sorting within difficulty levels
            // Lower score = easier, higher score = harder
            const contentScore = analyzeContentDifficulty(rawContent);

            // Use frontmatter 'order' if specified (1-100), otherwise normalize contentScore
            // contentScore typically ranges from -10 to +10, normalize to 0-100
            const normalizedScore = Math.max(0, Math.min(100, Math.round((contentScore + 10) * 5)));
            const difficultyScore = metadata.order
                ? parseInt(metadata.order, 10)
                : normalizedScore;

            // Track index of articles within each category/difficulty combination
            const indexKey = `${category}:${difficulty}`;
            categoryDifficultyIndex[indexKey] = (categoryDifficultyIndex[indexKey] || 0) + 1;
            const contentIndex = categoryDifficultyIndex[indexKey] - 1; // 0-based index

            // Determine if content is premium
            const premium = metadata.premium !== undefined
                ? metadata.premium === 'true' || metadata.premium === true
                : isPremiumContent(category, difficulty, subcategory, itemRelativePath, contentIndex);

            // Calculate read time from full content (words / 200 wpm)
            const wordCount = rawContent.split(/\s+/).filter(w => w.length > 0).length;
            const readTime = Math.max(3, Math.min(30, Math.ceil(wordCount / 200)));

            // Build resource object with frontmatter metadata
            const resource = {
                id: itemRelativePath.replace('.md', ''),
                title,
                category,
                subcategory,
                difficulty,
                difficultyScore, // Numeric score for granular sorting (lower = easier)
                premium, // Whether this is premium content
                readTime, // Estimated read time in minutes
                createdAt: fileStats.birthtime.toISOString(), // File creation timestamp for sorting
                filePath: `/content/${itemRelativePath}`,
                content: stripMarkdown(processedContent).slice(0, 300), // Preview for search/display
                // For premium content, only include preview in the public JSON
                // Full content will be fetched via API for authorized users
                fullContent: premium ? generatePreviewContent(processedContent) : processedContent,
                // Store a flag indicating if full content is available in this JSON
                hasFullContent: !premium
            };

            // Generate smart tags, merge with frontmatter tags if present
            const smartTags = generateSmartTags(category, subcategory, rawContent, title);
            const frontmatterTags = metadata.tags
                ? metadata.tags.split(',').map(t => t.trim().toLowerCase())
                : [];
            // Merge and dedupe: frontmatter tags take priority, then smart tags
            resource.tags = [...new Set([...frontmatterTags, ...smartTags])];
            if (metadata.author) {
                resource.author = metadata.author;
            }
            if (metadata.date) {
                resource.date = metadata.date;
            }
            // Use frontmatter description or auto-generate one
            resource.description = metadata.description || generateDescription(processedContent, title);

            // Interview frequency: manual override via frontmatter or null (let frontend decide)
            // Values: 'critical' (most asked), 'common', 'rare', or undefined
            if (metadata.interviewFrequency) {
                resource.interviewFrequency = metadata.interviewFrequency.toLowerCase();
            }

            // If premium, store full content separately for API access
            if (premium) {
                premiumFullContent[resource.id] = processedContent;
            }

            resources.push(resource);
        }
    }
}

function generateContent() {
    const resources = [];
    const premiumFullContent = {}; // Map of id -> full content for premium articles
    const categoryDifficultyIndex = {}; // Track index within each category/difficulty combo

    for (const dir of CONTENT_DIRS) {
        const fullPath = path.join(PROJECT_ROOT, dir);
        if (fs.existsSync(fullPath)) {
            processDirectory(fullPath, dir, resources, premiumFullContent, categoryDifficultyIndex);
        }
    }

    const jsonContent = JSON.stringify(resources, null, 2);

    // Write JSON to src/data for React imports
    fs.writeFileSync(OUTPUT_JSON, jsonContent);

    // Also write to public directory for service worker access
    fs.writeFileSync(PUBLIC_JSON, jsonContent);

    // Write premium content separately (this should NOT be in public folder)
    // It will be used by API routes only
    fs.writeFileSync(PREMIUM_CONTENT_JSON, JSON.stringify(premiumFullContent, null, 2));

    const premiumCount = resources.filter(r => r.premium).length;
    const freeCount = resources.length - premiumCount;

    console.log(`Generated ${resources.length} resources (${freeCount} free, ${premiumCount} premium).`);
    console.log(`  → ${OUTPUT_JSON}`);
    console.log(`  → ${PUBLIC_JSON}`);
    console.log(`  → ${PREMIUM_CONTENT_JSON} (${Object.keys(premiumFullContent).length} premium articles)`);
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
