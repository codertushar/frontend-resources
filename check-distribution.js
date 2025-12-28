import fs from 'fs';
import path from 'path';

const contentJson = fs.readFileSync('./website/src/data/content.json', 'utf-8');
const content = JSON.parse(contentJson);

// Count distribution
const stats = {
  total: content.length,
  free: content.filter(item => !item.premium).length,
  premium: content.filter(item => item.premium).length,
  byCategory: {},
  byDifficulty: {},
  byCategoryDifficulty: {}
};

// Group by category
content.forEach(item => {
  if (!stats.byCategory[item.category]) {
    stats.byCategory[item.category] = { free: 0, premium: 0 };
  }
  if (item.premium) {
    stats.byCategory[item.category].premium++;
  } else {
    stats.byCategory[item.category].free++;
  }

  // By difficulty
  if (!stats.byDifficulty[item.difficulty]) {
    stats.byDifficulty[item.difficulty] = { free: 0, premium: 0 };
  }
  if (item.premium) {
    stats.byDifficulty[item.difficulty].premium++;
  } else {
    stats.byDifficulty[item.difficulty].free++;
  }

  // By category + difficulty
  const key = `${item.category}:${item.difficulty}`;
  if (!stats.byCategoryDifficulty[key]) {
    stats.byCategoryDifficulty[key] = { free: 0, premium: 0, items: [] };
  }
  if (item.premium) {
    stats.byCategoryDifficulty[key].premium++;
  } else {
    stats.byCategoryDifficulty[key].free++;
  }
  stats.byCategoryDifficulty[key].items.push(item.title);
});

console.log('\n========================================');
console.log('📊 PREMIUM DISTRIBUTION ANALYSIS');
console.log('========================================\n');

console.log(`📈 OVERALL: ${stats.total} articles`);
console.log(`   ✅ Free:    ${stats.free} (${((stats.free / stats.total) * 100).toFixed(1)}%)`);
console.log(`   🔒 Premium: ${stats.premium} (${((stats.premium / stats.total) * 100).toFixed(1)}%)`);

console.log('\n\n📂 BY CATEGORY:');
console.log('─'.repeat(60));
Object.entries(stats.byCategory).forEach(([cat, counts]) => {
  const total = counts.free + counts.premium;
  const freePercent = ((counts.free / total) * 100).toFixed(0);
  console.log(`${cat.padEnd(20)} | Free: ${String(counts.free).padStart(2)} (${freePercent}%) | Premium: ${String(counts.premium).padStart(2)} | Total: ${total}`);
});

console.log('\n\n📊 BY DIFFICULTY:');
console.log('─'.repeat(60));
Object.entries(stats.byDifficulty).forEach(([diff, counts]) => {
  const total = counts.free + counts.premium;
  const freePercent = ((counts.free / total) * 100).toFixed(0);
  console.log(`${diff.padEnd(20)} | Free: ${String(counts.free).padStart(2)} (${freePercent}%) | Premium: ${String(counts.premium).padStart(2)} | Total: ${total}`);
});

console.log('\n\n📋 BY CATEGORY + DIFFICULTY (Each should have ≥1 free):');
console.log('─'.repeat(70));
Object.entries(stats.byCategoryDifficulty)
  .sort()
  .forEach(([key, counts]) => {
    const total = counts.free + counts.premium;
    const status = counts.free > 0 ? '✅' : '❌';
    console.log(`${status} ${key.padEnd(35)} | Free: ${counts.free} | Premium: ${counts.premium}`);
  });

console.log('\n========================================\n');
