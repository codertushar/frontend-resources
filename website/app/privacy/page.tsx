import type { Metadata } from 'next';
import ClientLayout from '../ClientLayout';
import PrivacyContent from './PrivacyContent';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how CrackFrontend collects, uses, and protects your personal information.',
  openGraph: {
    title: 'Privacy Policy | CrackFrontend',
    description: 'Learn how CrackFrontend collects, uses, and protects your personal information.',
    type: 'website',
  },
};

export default function PrivacyPage() {
  return (
    <ClientLayout>
      <PrivacyContent />
    </ClientLayout>
  );
}
