import type { Metadata } from 'next';
import { DonateContent } from './DonateContent';

export const metadata: Metadata = {
  title: 'Donate - Support CrackFrontend',
  description: 'All content on CrackFrontend is completely free. Support us with a voluntary donation to help maintain and improve the platform.',
  openGraph: {
    title: 'Donate - Support CrackFrontend',
    description: 'Support free education for developers with a voluntary donation',
  },
};

export default function DonatePage() {
  return <DonateContent />;
}
