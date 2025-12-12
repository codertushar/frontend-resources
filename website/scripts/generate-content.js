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
    patterns: [
        { match: /Array\.prototype\./i, tag: 'array-methods' },
        { match: /Promise\./i, tag: 'promises' },
        { match: /polyfill/i, tag: 'polyfill' },
        { match: /\bcurry|\bcurried/i, tag: 'functional' },
        { match: /\bmemoiz/i, tag: 'memoization' },
        { match: /\bdebounce|\bthrottle/i, tag: 'performance' },
        { match: /\bevent\s*(emitter|listener|handler)/i, tag: 'events' },
        { match: /\bDOM\b|\bdocument\./i, tag: 'dom' },
        { match: /\bfetch\b|\bAPI\b|\bHTTP/i, tag: 'api' },
        { match: /\bReact\b/i, tag: 'react' },
        { match: /\bclosure/i, tag: 'closures' },
        { match: /\bthis\b.*binding|\bbind\b|\bcall\b|\bapply\b/i, tag: 'this-binding' },
        { match: /\basync|\bawait|\bPromise/i, tag: 'async' },
        { match: /\brecursion|\brecursive/i, tag: 'recursion' },
        { match: /\bObject\.(keys|values|entries|assign|freeze)/i, tag: 'object-methods' },
        { match: /\bString\.prototype\./i, tag: 'string-methods' },
        { match: /\bFunction\.prototype\./i, tag: 'function-methods' },
        { match: /\bLRU|\bcache|\bcaching/i, tag: 'caching' },
        { match: /\bpagination/i, tag: 'pagination' },
        { match: /\bsorting|sort\(/i, tag: 'sorting' },
        { match: /\bsearch|binary search/i, tag: 'searching' },
        { match: /\btwo pointer|\bsliding window/i, tag: 'two-pointers' },
        { match: /\blinked list/i, tag: 'linked-list' },
        { match: /\btree|\bBST|\bbinary tree/i, tag: 'trees' },
        { match: /\bgraph|\bBFS|\bDFS/i, tag: 'graphs' },
        { match: /\bdynamic programming|\bDP\b/i, tag: 'dp' },
        { match: /\binterval/i, tag: 'intervals' },
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

    // Add pattern-based tags from content and title
    const searchText = `${title}\n${content}`;
    for (const { match, tag } of SMART_TAGS.patterns) {
        if (match.test(searchText)) {
            tags.add(tag);
        }
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

            // Build resource object with frontmatter metadata
            const resource = {
                id: itemRelativePath.replace('.md', ''),
                title,
                category,
                subcategory,
                difficulty,
                difficultyScore, // Numeric score for granular sorting (lower = easier)
                createdAt: fileStats.birthtime.toISOString(), // File creation timestamp for sorting
                filePath: `/content/${itemRelativePath}`,
                content: stripMarkdown(processedContent).slice(0, 300), // Preview for search/display
                fullContent: processedContent // H1 title stripped - displayed in page header instead
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
            if (metadata.description) {
                resource.description = metadata.description;
            }

            resources.push(resource);
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
