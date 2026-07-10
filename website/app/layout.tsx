import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://crackfrontend.in'),
  title: {
    default: 'CrackFrontend - Ace Frontend Interviews | JavaScript, React, DSA',
    template: '%s | CrackFrontend',
  },
  description: 'Master frontend interviews with 100+ free, in-depth guides on JavaScript, React, System Design, DSA, and coding patterns. Crack frontend interviews at top tech companies with real interview questions and expert solutions.',
  keywords: [
    'frontend interview',
    'crack frontend interview',
    'frontend interview questions',
    'javascript interview',
    'javascript interview questions',
    'react interview',
    'react interview questions',
    'frontend system design',
    'system design interview',
    'frontend coding interview',
    'coding interview prep',
    'javascript polyfills',
    'react hooks interview',
    'design patterns javascript',
    'DSA for frontend',
    'frontend developer interview',
    'crack frontend',
    'ace frontend interview',
    'frontend interview preparation',
    'web development interview',
    'frontend algorithms',
    'javascript concepts',
    'react patterns',
    'frontend best practices',
  ],
  authors: [{ name: 'Tushar Khanna' }],
  creator: 'CrackFrontend',
  publisher: 'CrackFrontend',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://crackfrontend.in',
    siteName: 'CrackFrontend',
    title: 'CrackFrontend - Master Frontend Interviews',
    description: 'Free, comprehensive resources to crack frontend interviews: JavaScript, React, System Design, DSA, and real interview questions from top tech companies.',
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
    title: 'CrackFrontend - Ace Frontend Interviews',
    description: 'Master frontend interviews with 100+ free guides. JavaScript, React, DSA, System Design, and real interview questions.',
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
  verification: {
    google: 'googlea0eeb32e8b967aa2',
  },
  alternates: {
    canonical: 'https://crackfrontend.in',
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
        {/* Google Analytics GA4 */}
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-MH99C334NK"
        />
        <Script
          id="google-analytics-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-MH99C334NK');
            `,
          }}
        />
        {/* Google Fonts - use display=swap for fast initial render */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        {/* Google AdSense - loaded after page is interactive to not block rendering */}
        <Script
          id="google-adsense"
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6335516948550888"
          crossOrigin="anonymous"
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
        {/* Razorpay SDK is loaded on-demand from the donation flow (see SubscriptionContext) */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
