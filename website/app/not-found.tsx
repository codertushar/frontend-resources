import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <h1 style={{ fontSize: '4rem', margin: '0 0 0.5rem', color: 'var(--text-primary, #1a1a2e)' }}>
        404
      </h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary, #555)', marginBottom: '2rem' }}>
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: 'var(--accent, #8b5cf6)',
          color: '#fff',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          fontWeight: 500,
        }}
      >
        Go Home
      </Link>
    </div>
  );
}
