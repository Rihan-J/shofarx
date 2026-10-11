import { AdminLayoutClient } from '../../admin/components/AdminLayoutClient';
import '../../admin/styles/admin.css';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLayoutClient>
      {children}
    </AdminLayoutClient>
  );
}
