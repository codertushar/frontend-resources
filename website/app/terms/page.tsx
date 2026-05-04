import type { Metadata } from 'next';
import ClientLayout from '../ClientLayout';
import TermsContent from './TermsContent';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read the terms of service for using CrackFrontend, including payment terms, intellectual property, and usage guidelines.',
  openGraph: {
    title: 'Terms of Service | CrackFrontend',
    description: 'Read the terms of service for using CrackFrontend.',
    type: 'website',
  },
};

export default function TermsPage() {
  return (
    <ClientLayout>
      <TermsContent />
    </ClientLayout>
  );
}
