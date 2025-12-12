# Frontend Resources Website

This is the web interface for the [Frontend Resources repository](https://github.com/codertushar/frontend-resources).

## Features

- 📚 **Content Library** - Searchable collection of frontend resources
- 🎨 **Modern UI** - Responsive design with glassmorphism effects
- 🌓 **Dark/Light Theme** - Toggle between themes
- 🔔 **Push Notifications** - Get notified when new articles are published (PWA)
- 🔍 **Fuzzy Search** - Fast client-side search with Fuse.js
- 📱 **Progressive Web App** - Install as an app on your device

## Tech Stack
- **Vite + React**
- **Framer Motion** (Animations)
- **Fuse.js** (Client-side Fuzzy Search)
- **React Markdown** (Rendering content)
- **PWA** (Service Worker + Web App Manifest)

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```
   *Note: This will automatically run `node scripts/generate-content.js` to index the markdown files from the parent directory.*

## PWA Notifications

The site includes a notification system that alerts users when new articles are published:

- Automatic content detection on page load
- Optional periodic background sync (every 6 hours on supported browsers)
- Non-intrusive permission prompt
- Works offline (when installed as PWA)

See [NOTIFICATIONS.md](./NOTIFICATIONS.md) for detailed documentation.

## Deployment

The site is configured to be deployed to GitHub Pages via the workflow in `.github/workflows/deploy-site.yml`.
Simply push changes to the content or the website code, and it will deploy to the `gh-pages` branch.
