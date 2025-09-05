import React from 'react';
import { LogOut, User, UserX } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import EmailPasswordForm from './EmailPasswordForm';
import GuestLogoutModal from './GuestLogoutModal';

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="w-5 h-5">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC04"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const AuthButton: React.FC = () => {
  const { 
    user, 
    loading, 
    signInWithGoogle, 
    signInAnonymous, 
    logout,
    showGuestLogoutModal,
    confirmGuestLogout,
    cancelGuestLogout
  } = useAuth();

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
      <>
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
            className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-dark-text amoled:text-amoled-text bg-white dark:bg-dark-card amoled:bg-amoled-card border border-slate-200 dark:border-dark-border amoled:border-amoled-border rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:text-red-400 dark:hover:border-red-700/30 amoled:hover:bg-red-900/10 amoled:hover:text-red-300 amoled:hover:border-red-600/20 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
        
        {user.isAnonymous && (
          <GuestLogoutModal
            isOpen={showGuestLogoutModal}
            onClose={cancelGuestLogout}
            onConfirm={confirmGuestLogout}
          />
        )}
      </>
    );
  }

  return (
    <div className="space-y-4 w-full">
      {/* Primary Auth Options */}
      <div className="space-y-3">
        {/* Enhanced Google Sign-in Button with Glass-morphism */}
        <div className="relative">
          {/* Background gradient blur effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 via-red-500/30 to-green-500/30 rounded-xl blur-sm opacity-60 dark:opacity-40 amoled:opacity-30 animate-pulse"></div>
          
          <button
            onClick={signInWithGoogle}
            className="group relative w-full flex items-center justify-center gap-3 px-6 py-4 text-sm font-semibold text-gray-700 dark:text-dark-text amoled:text-amoled-text backdrop-blur-sm bg-white/90 dark:bg-dark-card/90 amoled:bg-amoled-card/90 border border-gray-200/60 dark:border-dark-border/60 amoled:border-amoled-border/60 rounded-xl hover:bg-white dark:hover:bg-dark-card amoled:hover:bg-amoled-card transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] hover:-translate-y-0.5"
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-red-500/10 to-green-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Enhanced glow effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 via-red-400/20 to-green-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            
            <GoogleIcon />
            <span className="relative z-10">Continue with Google</span>
          </button>
        </div>
        
        <button
          onClick={signInAnonymous}
          className="group relative w-full flex items-center justify-center gap-3 px-6 py-3 text-sm font-medium text-gray-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary bg-gray-50 dark:bg-dark-bg amoled:bg-black/30 border border-gray-200 dark:border-dark-border amoled:border-amoled-border rounded-xl hover:bg-gray-100 dark:hover:bg-dark-border amoled:hover:bg-gray-900/50 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.01]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-500/5 to-gray-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          <UserX className="w-5 h-5" />
          <span>Continue as Guest</span>
        </button>
      </div>
      
      {/* Divider */}
      <div className="relative flex items-center justify-center py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-dark-border amoled:border-amoled-border"></div>
        </div>
        <div className="relative px-4 bg-white dark:bg-dark-card amoled:bg-amoled-card">
          <span className="text-xs font-medium text-gray-500 dark:text-dark-text-secondary amoled:text-amoled-text-secondary uppercase tracking-wider">Or continue with email</span>
        </div>
      </div>
      
      {/* Email Form */}
      <EmailPasswordForm />
    </div>
  );
};

export default AuthButton;