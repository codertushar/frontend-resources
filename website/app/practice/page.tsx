import type { Metadata } from 'next';
import { MachineCodingListClient } from './MachineCodingListClient';

export const metadata: Metadata = {
  title: 'Machine Coding Practice',
  description: 'Practice machine coding problems and real-world implementations',
};

export default function PracticePage() {
  return <MachineCodingListClient />;
}
