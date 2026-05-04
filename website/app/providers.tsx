'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '../src/context/ThemeContext';
import { AuthProvider } from '../src/context/AuthContext';
import { ProgressProvider } from '../src/context/ProgressContext';
import { SubscriptionProvider } from '../src/context/SubscriptionContext';
import { MusicProvider } from '../src/context/MusicContext';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Wrap children in all required context providers
  // The individual providers handle their own SSR-safe initialization
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProgressProvider>
          <SubscriptionProvider>
            <MusicProvider>
              {children}
            </MusicProvider>
          </SubscriptionProvider>
        </ProgressProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
