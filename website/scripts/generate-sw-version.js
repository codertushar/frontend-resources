/**
 * Generates a cache-busting version for the service worker
 * Run this script during build to inject a unique version into service-worker.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const swPath = path.join(__dirname, '../public/service-worker.js');

// Generate version based on current timestamp
const version = `v${Date.now()}`;

// Read the service worker file
let swContent = fs.readFileSync(swPath, 'utf8');

// Replace the CACHE_NAME version with the new timestamp-based version
swContent = swContent.replace(
  /const CACHE_NAME = 'frontend-resources-v\d+';/,
  `const CACHE_NAME = 'frontend-resources-${version}';`
);

// Write back
fs.writeFileSync(swPath, swContent);

console.log(`✓ Service worker cache version updated to: ${version}`);
