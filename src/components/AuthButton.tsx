import React from 'react';
import { LogIn, LogOut, User, UserX } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

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
        <LogIn className="w-4 h-4" />
        Sign in with Google
      </button>
      <div className="flex items-center gap-3">
        <div className="flex-1 border-t border-slate-300 dark:border-slate-600"></div>
        <span className="text-xs text-slate-500 dark:text-slate-400">OR</span>
        <div className="flex-1 border-t border-slate-300 dark:border-slate-600"></div>
      </div>
      <button
        onClick={signInAnonymous}
        className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
      >
        <UserX className="w-4 h-4" />
        Continue as Guest
      </button>
    </div>
  );
};

export default AuthButton;