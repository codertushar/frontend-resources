import type { Metadata } from 'next';
import ClientLayout from '../ClientLayout';
import { MachineCodingListClient } from './MachineCodingListClient';

export const metadata: Metadata = {
  title: 'Machine Coding Practice',
  description: 'Practice machine coding problems and real-world implementations',
};

export default function PracticePage() {
  return (
    <ClientLayout>
      <MachineCodingListClient />
    </ClientLayout>
  );
}
