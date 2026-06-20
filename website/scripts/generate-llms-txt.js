#!/usr/bin/env node

/**
 * Generates llms.txt and llms-full.txt for the CrackFrontend website.
 *
 * llms.txt      – concise overview with categorised links (served at /llms.txt)
 * llms-full.txt – same header + the full markdown body of every article
 *                 (served at /llms-full.txt)
 *
 * Run:  node website/scripts/generate-llms-txt.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const BASE_URL = 'https://crackfrontend.in';

const CONTENT_DIRS = [
  'ai',
  'dsa',
  'general',
  'js',
  'machine-coding',
  'system-design',
];

const CATEGORY_LABELS = {
  ai: 'AI & LLM Integration',
  dsa: 'Data Structures & Algorithms',
  general: 'General Frontend Concepts',
  js: 'JavaScript',
  'machine-coding': 'Machine Coding Challenges',
  'system-design': 'System Design',
};

const JS_SUBCATEGORY_LABELS = {
  'general-concepts': 'Core Concepts',
  polyfills: 'Polyfills',
  promises: 'Promise Utilities',
  utils: 'Utility Functions',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function extractTitle(content) {
  const match = content.match(/^#\s+(.+)$/m);
  if (!match) return null;
  return match[1]
    .replace(/^[\p{Emoji_Presentation}\p{Extended_Pictographic}\s]+/u, '')
    .trim();
}

function extractDescription(content) {
  const fmMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!fmMatch) return '';
  const descMatch = fmMatch[1].match(/^description:\s*(.+)$/m);
  return descMatch ? descMatch[1].trim() : '';
}

function stripFrontmatter(content) {
  return content.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '');
}

function collectMarkdownFiles(dir, base) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(base, fullPath);
    if (entry.isDirectory()) {
      results.push(...collectMarkdownFiles(fullPath, base));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push({ fullPath, relPath });
    }
  }
  return results;
}

function buildContentMap() {
  const map = {};

  for (const dir of CONTENT_DIRS) {
    const absDir = path.join(REPO_ROOT, dir);
    const files = collectMarkdownFiles(absDir, REPO_ROOT);

    for (const { fullPath, relPath } of files) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const title =
        extractTitle(content) ||
        path.basename(relPath, '.md').replace(/_/g, ' ');
      const description = extractDescription(content);
      const id = relPath.replace('.md', '');

      const parts = relPath.split(path.sep);
      const category = parts[0];
      let subcategory = null;

      if (parts.length > 2) {
        subcategory = parts.slice(1, parts.length - 1).join('/');
      }

      if (!map[category]) map[category] = {};

      const key = subcategory || '__root__';
      if (!map[category][key]) map[category][key] = [];

      map[category][key].push({ title, description, id, relPath, content });
    }
  }

  for (const cat of Object.keys(map)) {
    for (const sub of Object.keys(map[cat])) {
      map[cat][sub].sort((a, b) => a.title.localeCompare(b.title));
    }
  }

  return map;
}

function formatLink(article) {
  const webUrl = `${BASE_URL}/resource/${article.id}`;
  const desc = article.description ? `: ${article.description}` : '';
  return `- [${article.title}](${webUrl})${desc}`;
}

function getSubLabel(category, sub) {
  if (category === 'js' && JS_SUBCATEGORY_LABELS[sub]) {
    return JS_SUBCATEGORY_LABELS[sub];
  }
  return sub
    .split('/')
    .map((s) =>
      s
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase())
    )
    .join(' › ');
}

function getSortedSubs(contentMap, category) {
  return Object.keys(contentMap[category]).sort((a, b) => {
    if (a === '__root__') return -1;
    if (b === '__root__') return 1;
    return a.localeCompare(b);
  });
}

// ---------------------------------------------------------------------------
// Generate
// ---------------------------------------------------------------------------

function generate() {
  const contentMap = buildContentMap();

  const header = [
    '# CrackFrontend',
    '',
    '> Free, open educational resource for mastering frontend development — JavaScript, DSA, design patterns, system design, machine coding, and interview preparation.',
    '',
    '## About',
    '',
    '- Website: https://crackfrontend.in',
    '- GitHub: https://github.com/codertushar/frontend-resources',
    '- License: Open source',
    '',
    'CrackFrontend is a curated collection of 99+ in-depth articles covering everything a frontend developer needs — from JavaScript fundamentals and polyfills to system design and real-world machine coding challenges. Every article includes practical code examples, dry runs, interview questions, and quizzes.',
    '',
  ];

  // ---- llms.txt (concise index) -------------------------------------------
  const lines = [...header];

  for (const category of CONTENT_DIRS) {
    if (!contentMap[category]) continue;
    lines.push(`## ${CATEGORY_LABELS[category] || category}`, '');

    for (const sub of getSortedSubs(contentMap, category)) {
      if (sub !== '__root__') {
        lines.push(`### ${getSubLabel(category, sub)}`, '');
      }
      for (const article of contentMap[category][sub]) {
        lines.push(formatLink(article));
      }
      lines.push('');
    }
  }

  lines.push(
    '## Site Pages',
    '',
    `- [Home](${BASE_URL}): Landing page with featured articles and categories`,
    `- [Library](${BASE_URL}/library): Browse all articles with search and filters`,
    `- [Practice](${BASE_URL}/practice): Interactive coding practice`,
    `- [About](${BASE_URL}/about): About CrackFrontend`,
    `- [Contact](${BASE_URL}/contact): Get in touch`,
    `- [Privacy Policy](${BASE_URL}/privacy): Privacy policy`,
    `- [Terms of Use](${BASE_URL}/terms): Terms and conditions`,
    ''
  );

  const llmsTxt = lines.join('\n');
  fs.writeFileSync(path.join(PUBLIC_DIR, 'llms.txt'), llmsTxt, 'utf-8');
  console.log(`✅ Generated llms.txt (${llmsTxt.length} chars)`);

  // ---- llms-full.txt (with full article content) --------------------------
  const fullLines = [
    ...header,
    '> This is the full-content version. For a concise index see /llms.txt',
    '',
  ];

  for (const category of CONTENT_DIRS) {
    if (!contentMap[category]) continue;
    fullLines.push(`## ${CATEGORY_LABELS[category] || category}`, '');

    for (const sub of getSortedSubs(contentMap, category)) {
      if (sub !== '__root__') {
        fullLines.push(`### ${getSubLabel(category, sub)}`, '');
      }

      for (const article of contentMap[category][sub]) {
        const body = stripFrontmatter(article.content).trim();
        fullLines.push(
          '---',
          '',
          `**Source:** [${article.title}](${BASE_URL}/resource/${article.id})`,
          '',
          body,
          ''
        );
      }
    }
  }

  const llmsFullTxt = fullLines.join('\n');
  fs.writeFileSync(
    path.join(PUBLIC_DIR, 'llms-full.txt'),
    llmsFullTxt,
    'utf-8'
  );
  console.log(`✅ Generated llms-full.txt (${llmsFullTxt.length} chars)`);
}

generate();
