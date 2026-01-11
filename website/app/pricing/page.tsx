import type { Metadata } from 'next';
import ClientLayout from '../ClientLayout';
import PricingContent from './PricingContent';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Get lifetime access to all premium CrackFrontend content. One-time payment, no subscriptions.',
  openGraph: {
    title: 'Pricing | CrackFrontend',
    description: 'Get lifetime access to all premium CrackFrontend content.',
    type: 'website',
  },
};

export default function PricingPage() {
  return (
    <ClientLayout>
      <PricingContent />
    </ClientLayout>
  );
}
