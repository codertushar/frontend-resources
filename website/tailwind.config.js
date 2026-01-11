/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Use CSS variables for consistency with existing theme
        'bg': 'var(--bg-color)',
        'surface': 'var(--surface-color)',
        'surface-hover': 'var(--surface-hover)',
        'surface-card': 'var(--surface-card)',
        'border': 'var(--border-color)',
        'primary': 'var(--primary)',
        'primary-hover': 'var(--primary-hover)',
        'accent-pink': 'var(--accent-pink)',
        'accent-cyan': 'var(--accent-cyan)',
        'text-main': 'var(--text-main)',
        'text-muted': 'var(--text-muted)',
      },
      fontFamily: {
        'sans': 'var(--font-sans)',
        'mono': 'var(--font-mono)',
      },
      backgroundColor: {
        'glass': 'var(--glass-bg)',
        'code': 'var(--code-bg)',
      },
      backdropBlur: {
        'glass': 'var(--glass-blur)',
      },
    },
  },
  plugins: [],
  // Prevent Tailwind from resetting styles - we use custom CSS
  corePlugins: {
    preflight: true, // Keep basic normalization
  },
}
