#!/usr/bin/env node
/**
 * Generate VAPID keys for Web Push notifications
 * Run this once and save the keys to your environment variables
 *
 * Usage: node scripts/generate-vapid-keys.js
 */

import webPush from 'web-push';

const vapidKeys = webPush.generateVAPIDKeys();

console.log('\n=== VAPID Keys Generated ===\n');
console.log('Add these to your Vercel environment variables:\n');
console.log(`VAPID_PUBLIC_KEY=${vapidKeys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${vapidKeys.privateKey}`);
console.log(`VAPID_SUBJECT=mailto:admin@crackfrontend.dev`);
console.log('\nAlso add the public key to your .env file for the frontend:');
console.log(`VITE_VAPID_PUBLIC_KEY=${vapidKeys.publicKey}`);
console.log('\n=== End of Keys ===\n');
