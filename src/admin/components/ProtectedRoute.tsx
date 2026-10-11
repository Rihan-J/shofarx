import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { loggedIn } = useAuth();
  if (!loggedIn) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
