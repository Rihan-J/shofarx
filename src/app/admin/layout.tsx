import type { Metadata } from 'next';
import { AdminLayoutClient } from '../../admin/components/AdminLayoutClient';
import '../../admin/styles/admin.css';

export const metadata: Metadata = {
  title: 'Admin Portal | Shofar-X',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLayoutClient>
      {children}
    </AdminLayoutClient>
  );
}
