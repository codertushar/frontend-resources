import type { Metadata } from 'next';
import ClientLayout from '../ClientLayout';
import ContactContent from './ContactContent';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with CrackFrontend. We\'d love to hear your questions, feedback, or just say hello.',
  openGraph: {
    title: 'Contact Us | CrackFrontend',
    description: 'Get in touch with CrackFrontend. We\'d love to hear from you.',
    type: 'website',
    url: 'https://crackfrontend.in/contact',
  },
  alternates: {
    canonical: 'https://crackfrontend.in/contact',
  },
};

export default function ContactPage() {
  return (
    <ClientLayout>
      <ContactContent />
    </ClientLayout>
  );
}
