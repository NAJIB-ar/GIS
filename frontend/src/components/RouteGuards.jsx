import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-dark-900">
        <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export function AdminRoute() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-dark-900">
        <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/report" replace />;

  return <Outlet />;
}

export function GuestRoute() {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-dark-900">
        <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
      </div>
    );
  }

  if (user) {
    return <Navigate to={isAdmin ? '/dashboard' : '/report'} replace />;
  }

  return <Outlet />;
}
