
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';

const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    // You can show a loading spinner here if you want
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-dark-bg amoled:bg-amoled-bg">
            <div className="w-16 h-16 border-4 border-indigo-600 border-dashed rounded-full animate-spin"></div>
        </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
