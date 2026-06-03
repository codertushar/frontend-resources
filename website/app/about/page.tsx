import type { Metadata } from 'next';
import ClientLayout from '../ClientLayout';
import AboutContent from './AboutContent';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about CrackFrontend and our mission to help developers master frontend development and ace technical interviews.',
  openGraph: {
    title: 'About Us | CrackFrontend',
    description: 'Learn about CrackFrontend and our mission to help developers master frontend development.',
    type: 'website',
    url: 'https://crackfrontend.in/about',
  },
  alternates: {
    canonical: 'https://crackfrontend.in/about',
  },
};

export default function AboutPage() {
  return (
    <ClientLayout>
      <AboutContent />
    </ClientLayout>
  );
}
