import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_JSON = path.join(__dirname, '../src/data/content.json');
const data = JSON.parse(fs.readFileSync(CONTENT_JSON, 'utf-8'));

// Group by category and difficulty
const breakdown = {};
const categoryBreakdown = {};

data.forEach(article => {
  // By category:difficulty
  const key = `${article.category}:${article.difficulty}`;
  if (!breakdown[key]) {
    breakdown[key] = { free: 0, premium: 0, total: 0 };
  }
  breakdown[key][article.premium ? 'premium' : 'free']++;
  breakdown[key].total++;

  // By category
  if (!categoryBreakdown[article.category]) {
    categoryBreakdown[article.category] = { free: 0, premium: 0, total: 0 };
  }
  categoryBreakdown[article.category][article.premium ? 'premium' : 'free']++;
  categoryBreakdown[article.category].total++;
});

console.log('\n📊 PREMIUM DISTRIBUTION BREAKDOWN:\n');
console.log('Category:Difficulty | Free | Premium | Total | Free %');
console.log('─'.repeat(55));

// Sort by category then difficulty
Object.keys(breakdown).sort().forEach(key => {
  const stats = breakdown[key];
  const freePercent = ((stats.free / stats.total) * 100).toFixed(0);
  const padding = ' '.repeat(Math.max(0, 20 - key.length));
  console.log(`${key}${padding} | ${stats.free.toString().padStart(4)} | ${stats.premium.toString().padStart(7)} | ${stats.total.toString().padStart(5)} | ${freePercent}%`);
});

console.log('\n' + '─'.repeat(55));
console.log('\n📁 BY CATEGORY:\n');
console.log('Category | Free | Premium | Total | Free %');
console.log('─'.repeat(45));

Object.keys(categoryBreakdown).sort().forEach(category => {
  const stats = categoryBreakdown[category];
  const freePercent = ((stats.free / stats.total) * 100).toFixed(0);
  const padding = ' '.repeat(Math.max(0, 10 - category.length));
  console.log(`${category}${padding} | ${stats.free.toString().padStart(4)} | ${stats.premium.toString().padStart(7)} | ${stats.total.toString().padStart(5)} | ${freePercent}%`);
});

// Summary
const totalFree = data.filter(a => !a.premium).length;
const totalPremium = data.filter(a => a.premium).length;
const total = data.length;
const freePercent = ((totalFree / total) * 100).toFixed(1);

console.log('─'.repeat(45));
console.log(`TOTAL    | ${totalFree.toString().padStart(4)} | ${totalPremium.toString().padStart(7)} | ${total.toString().padStart(5)} | ${freePercent}%\n`);

// Check if each category has at least 1 free article
console.log('✅ VALIDATION: At least 1 free article per category?\n');
let allCategoriesHaveFree = true;
Object.keys(categoryBreakdown).sort().forEach(category => {
  const hasFree = categoryBreakdown[category].free > 0;
  const status = hasFree ? '✅' : '❌';
  console.log(`${status} ${category}: ${categoryBreakdown[category].free} free article(s)`);
  if (!hasFree) allCategoriesHaveFree = false;
});

console.log('\n' + (allCategoriesHaveFree ? '✅ All categories have at least 1 free article!' : '❌ Some categories missing free articles!'));
