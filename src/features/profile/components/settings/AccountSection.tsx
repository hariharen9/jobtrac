import React from 'react';
import { useAuth } from '../../../auth/hooks/useAuth';
import { GoogleAuthProvider, linkWithPopup } from 'firebase/auth';
import { CheckCircle, Link as LinkIcon, RotateCcw, Target, HelpCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

interface AccountSectionProps {
  onRestartTour?: () => void;
  quickStartProgress?: number;
  onOpenHelp?: () => void;
}

const AccountSection: React.FC<AccountSectionProps> = ({
  onRestartTour,
  quickStartProgress,
  onOpenHelp
}) => {
  const { user } = useAuth();

  const handleConnectGoogle = async () => {
    if (!user) return;
    const provider = new GoogleAuthProvider();
    try {
      await linkWithPopup(user, provider);
      toast.success('Successfully connected Google account! 🎉');
    } catch (error) {
      console.error('Error connecting Google account:', error);
      toast.error('Failed to connect Google account. Please try again.');
    }
  };

  const isGoogleConnected = user?.providerData.some(
    (provider) => provider.providerId === GoogleAuthProvider.PROVIDER_ID
  );

  const isAnonymous = user?.isAnonymous;
  const userType = isGoogleConnected ? 'Google' : isAnonymous ? 'Guest' : 'Email';

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-1">
          Account Settings
        </h3>
        <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
          Manage your account and authentication
        </p>
      </div>

      {/* Google Connection Card */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border bg-slate-50 dark:bg-dark-card amoled:bg-amoled-card">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${
            isGoogleConnected 
              ? 'bg-green-100 dark:bg-green-900/30 amoled:bg-green-900/30' 
              : 'bg-blue-100 dark:bg-blue-900/30 amoled:bg-blue-900/30'
          }`}>
            {isGoogleConnected ? (
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 amoled:text-green-400" />
            ) : (
              <LinkIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 amoled:text-blue-400" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-1">
              Google Account
            </h4>
            <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-3">
              {isGoogleConnected 
                ? 'Connected - Enhanced sync & backup enabled' 
                : 'Connect for better sync and data backup'
              }
            </p>
            
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                userType === 'Google' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 amoled:bg-green-900/30 amoled:text-green-300'
                  : userType === 'Guest'
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 amoled:bg-yellow-900/30 amoled:text-yellow-300'
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 amoled:bg-blue-900/30 amoled:text-blue-300'
              }`}>
                {userType === 'Google' && '🔗'} {userType === 'Guest' && '👤'} {userType === 'Email' && '📧'} {userType} User
              </span>
              
              <button 
                onClick={handleConnectGoogle}
                disabled={isGoogleConnected}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  isGoogleConnected
                    ? 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400 amoled:bg-slate-700 amoled:text-slate-400 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md'
                }`}
              >
                <GoogleIcon />
                {isGoogleConnected ? 'Connected' : 'Connect'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start Tour Card */}
      {onRestartTour && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border bg-slate-50 dark:bg-dark-card amoled:bg-amoled-card">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 amoled:bg-blue-900/30">
              <Target className="w-6 h-6 text-blue-600 dark:text-blue-400 amoled:text-blue-400" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-1">
                Quick Start Tour
              </h4>
              <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-3">
                {quickStartProgress === 100 
                  ? 'Completed! Want to restart the tour?' 
                  : `Progress: ${quickStartProgress}% complete`
                }
              </p>
              
              <button
                onClick={onRestartTour}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Restart Tour
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help & Guide Card */}
      {onOpenHelp && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border bg-slate-50 dark:bg-dark-card amoled:bg-amoled-card">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30 amoled:bg-orange-900/30">
              <HelpCircle className="w-6 h-6 text-orange-600 dark:text-orange-400 amoled:text-orange-400" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-1">
                Help & Guide
              </h4>
              <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-3">
                Learn how to use JobTrac effectively
              </p>
              
              <button
                onClick={onOpenHelp}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-sm"
              >
                <HelpCircle className="w-4 h-4" />
                Open Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSection;
