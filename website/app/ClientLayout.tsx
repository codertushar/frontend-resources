'use client';

import { ReactNode } from 'react';
import LayoutNext from '../src/components/LayoutNext';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return <LayoutNext>{children}</LayoutNext>;
}
