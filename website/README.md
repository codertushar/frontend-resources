
# Frontend Resources Website

This is the web interface for the [Frontend Resources repository](https://github.com/codertushar/frontend-resources).

## Tech Stack
- **Vite + React**
- **Framer Motion** (Animations)
- **Fuse.js** (Client-side Fuzzy Search)
- **React Markdown** (Rendering content)

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

## Deployment

The site is configured to be deployed to GitHub Pages via the workflow in `.github/workflows/deploy-site.yml`.
Simply push changes to the content or the website code, and it will deploy to the `gh-pages` branch.
