import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://crackfrontend.dev'),
  title: {
    default: 'CrackFrontend - Master Frontend Interviews',
    template: '%s | CrackFrontend',
  },
  description: 'A curated collection of in-depth resources, real-world patterns, and interview-focused guides to land your dream frontend role. Learn JavaScript, React, System Design, and more.',
  keywords: [
    'frontend interview',
    'javascript interview',
    'react interview',
    'system design',
    'coding interview prep',
    'javascript polyfills',
    'design patterns',
    'DSA for frontend',
  ],
  authors: [{ name: 'Tushar Khanna' }],
  creator: 'CrackFrontend',
  publisher: 'CrackFrontend',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://crackfrontend.dev',
    siteName: 'CrackFrontend',
    title: 'CrackFrontend - Master Frontend Interviews',
    description: 'A curated collection of in-depth resources, real-world patterns, and interview-focused guides to land your dream frontend role.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CrackFrontend - Master Frontend Interviews',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CrackFrontend - Master Frontend Interviews',
    description: 'A curated collection of in-depth resources, real-world patterns, and interview-focused guides.',
    creator: '@iamtusharkhanna',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.svg',
    apple: '/android-launchericon-192-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#8b5cf6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        {/* Theme detection script - runs before React hydration to prevent flash */}
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'light' || theme === 'dark') {
                    document.documentElement.classList.add(theme);
                  } else {
                    document.documentElement.classList.add('light');
                  }
                } catch (e) {
                  document.documentElement.classList.add('light');
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
        {/* Google AdSense - loads after page is interactive */}
        <Script
          id="google-adsense"
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6335516948550888"
          crossOrigin="anonymous"
        />
        {/* Razorpay SDK - loads after page is interactive */}
        <Script
          id="razorpay-sdk"
          strategy="afterInteractive"
          src="https://checkout.razorpay.com/v1/checkout.js"
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
