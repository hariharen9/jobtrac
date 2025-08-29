import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthButton from './AuthButton';
import { useTheme } from '../../../hooks/shared/useTheme';
import ThemeToggle from '../../../components/shared/ThemeToggle';
import { HelpCircle } from 'lucide-react';
import './SignInBackground.css';

const AuthPage: React.FC = () => {
  useTheme();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      // If user is logged in, redirect to the app
      navigate('/app', { replace: true });
    }
  }, [user, loading, navigate]);

  // While loading, show a spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-dark-bg amoled:bg-amoled-bg">
        <div className="w-16 h-16 border-4 border-indigo-600 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  // If user is not logged in, show the sign-in UI
  return (
    <div className="relative login-background min-h-screen bg-slate-50 dark:bg-dark-bg amoled:bg-amoled-bg">
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div className="w-full max-w-xs mx-auto" style={{ maxHeight: '85vh', maxWidth: '500px', minWidth: '280px' }}>
          <div className="p-6 text-center bg-white/80 backdrop-blur-sm rounded-xl shadow-xl dark:bg-dark-card/80 amoled:bg-amoled-card/80 border border-gray-200/50 dark:border-dark-border/50 amoled:border-amoled-border/50">
            <div className="mb-4">
              <div className="flex items-center justify-center mb-3">
                <img 
                  src="/assets/jtrac-black-cropped.png" 
                  alt="JobTrac Logo" 
                  className="h-12 w-auto object-contain dark:hidden amoled:hidden"
                />
                <img 
                  src="/assets/jtrac-white-cropped.png" 
                  alt="JobTrac Logo" 
                  className="h-12 w-auto object-contain hidden dark:block amoled:block"
                />
              </div>
              <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                Sign in to start tracking your job search journey
              </p>
            </div>
            <AuthButton />
            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-dark-border amoled:border-amoled-border">
              <div className="flex items-center justify-center gap-4">
                <ThemeToggle />
                <a href="/" className="flex items-center gap-2 text-xs transition-colors text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary hover:text-slate-900 dark:hover:text-dark-text amoled:hover:text-amoled-text">
                  <HelpCircle className="w-4 h-4" />
                  <span>Back to Home</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;