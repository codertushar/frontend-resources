import type { Metadata } from 'next';
import { AdminClient } from './AdminClient';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Manage coupons, settings, and notifications',
  robots: {
    index: false, // Don't index admin pages
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminClient />;
}
