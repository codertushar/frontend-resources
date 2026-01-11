import type { Metadata } from 'next';
import contentData from '@/data/content.json';
import { LibraryClient } from './LibraryClient';
import type { Article } from '@/types/content';

export const metadata: Metadata = {
  title: 'Library - All Frontend Resources',
  description: 'Browse our complete collection of frontend development resources, tutorials, and interview prep materials. Search and filter by difficulty, category, and topic.',
  openGraph: {
    title: 'Library - All Frontend Resources',
    description: 'Browse our complete collection of frontend development resources, tutorials, and interview prep materials.',
    type: 'website',
    url: 'https://crackfrontend.dev/library',
  },
};

// Server Component - handles initial data setup
export default function LibraryPage() {
  const articles = contentData as Article[];

  return (
    <LibraryClient
      initialArticles={articles}
    />
  );
}
