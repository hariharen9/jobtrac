import React from 'react';
import { LogOut, User, UserX } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import EmailPasswordForm from './EmailPasswordForm';

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    <path d="M1 1h22v22H1z" fill="none" />
  </svg>
);

const AuthButton: React.FC = () => {
  const { user, loading, signInWithGoogle, signInAnonymous, logout } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
        <span className="text-sm text-slate-600 dark:text-slate-400">Loading...</span>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName || 'User'} 
              className="w-6 h-6 rounded-full"
            />
          ) : user.isAnonymous ? (
            <UserX className="w-4 h-4" />
          ) : (
            <User className="w-4 h-4" />
          )}
          <span className="hidden sm:inline truncate max-w-32">
            {user.isAnonymous ? 'Guest User' : (user.displayName || user.email)}
          </span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <button
        onClick={signInWithGoogle}
        className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
      >
        <GoogleIcon />
        Sign in with Google
      </button>
      <button
        onClick={signInAnonymous}
        className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
      >
        <UserX className="w-4 h-4" />
        Continue as Guest
      </button>
      <div className="flex items-center gap-3">
        <div className="flex-1 border-t border-slate-300 dark:border-slate-600"></div>
        <span className="text-xs text-slate-500 dark:text-slate-400">OR</span>
        <div className="flex-1 border-t border-slate-300 dark:border-slate-600"></div>
      </div>
      <EmailPasswordForm />
    </div>
  );
};

export default AuthButton;