import React from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { GoogleAuthProvider, linkWithPopup } from 'firebase/auth';
import { CheckCircle, Link, Trash2, RotateCcw, Target, Database } from 'lucide-react';
import { useState } from 'react';
import Modal from '../../../components/shared/Modal';
import { toast } from 'react-hot-toast';
import AnalyticsDashboard from './AnalyticsDashboard';
import GoalSetting from './GoalSetting';
import { Application, NetworkingContact, PrepEntry, StarStory, CompanyResearch } from '../../../types';
import DataImportExportModal from '../../../components/shared/DataImportExportModal';
import { useDataImportExport } from '../../../hooks/useDataImportExport';

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    <path d="M1 1h22v22H1z" fill="none" />
  </svg>
);

const ProfileModal = ({ 
  applications = [], 
  contacts = [], 
  prepEntries = [],
  stories = [],
  companies = [],
  onRestartTour, 
  quickStartProgress 
}: { 
  applications?: Application[], 
  contacts?: NetworkingContact[], 
  prepEntries?: PrepEntry[],
  stories?: StarStory[],
  companies?: CompanyResearch[],
  onRestartTour?: () => void,
  quickStartProgress?: number 
}) => {
  const { user, logout } = useAuth();
  const { importData } = useDataImportExport(user?.uid);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showFinalDeleteConfirmation, setShowFinalDeleteConfirmation] = useState(false);
  const [showImportExportModal, setShowImportExportModal] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');

  const handleConnectGoogle = async () => {
    if (!user) return;
    const provider = new GoogleAuthProvider();
    try {
      await linkWithPopup(user, provider);
      alert('Successfully connected Google account! 🎉');
    } catch (error) {
      console.error('Error connecting Google account:', error);
      alert('Failed to connect Google account. Please try again.');
    }
  };

  const isGoogleConnected = user?.providerData.some(
    (provider) => provider.providerId === GoogleAuthProvider.PROVIDER_ID
  );

  const isAnonymous = user?.isAnonymous;
  const userType = isGoogleConnected ? 'Google' : isAnonymous ? 'Guest' : 'Email';

  const handleDeleteAccount = async () => {
    if (!user) return;
    try {
      await logout();
      toast.success('User account deleted successfully.');
    } catch (error: unknown) {
      console.error('Error deleting account:', error);
      if (error instanceof Error) {
        toast.error(`Failed to delete account: ${error.message || 'Unknown error'}`);
      } else {
        toast.error('Failed to delete account: An unknown error occurred.');
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-dark-card amoled:bg-amoled-card">
      <h2 className="mb-6 text-2xl font-bold text-center text-slate-900 dark:text-dark-text amoled:text-amoled-text">User Profile</h2>
      <div className="flex flex-col gap-6">
        {/* Google Connection Section */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 amoled:from-amoled-card amoled:to-amoled-card border border-blue-200 dark:border-blue-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isGoogleConnected ? 'bg-green-100 dark:bg-green-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                {isGoogleConnected ? (
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <Link className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text">
                  Google Account
                </h3>
                <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                  {isGoogleConnected 
                    ? '✅ Connected - Enhanced sync & backup enabled' 
                    : '🔗 Connect for better sync and data backup'
                  }
                </p>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                    userType === 'Google' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      : userType === 'Guest'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  }`}>
                    {userType === 'Google' && '🔗'} {userType === 'Guest' && '👤'} {userType === 'Email' && '📧'} {userType} User
                  </span>
                </div>
              </div>
            </div>
            <button 
              onClick={handleConnectGoogle}
              disabled={isGoogleConnected}
              className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-lg transition-all ${
                isGoogleConnected
                  ? 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700 hover:scale-105 shadow-md hover:shadow-lg'
              }`}
            >
              <GoogleIcon />
              {isGoogleConnected ? 'Connected' : 'Connect Google'}
            </button>
          </div>
        </div>

        <div>
          <div className="p-4 rounded-lg bg-slate-100 dark:bg-dark-card amoled:bg-amoled-card">
            <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text">Analytics Dashboard</h3>
            <AnalyticsDashboard applications={applications} />
          </div>

          <div className="p-4 mt-6 rounded-lg bg-slate-100 dark:bg-dark-card amoled:bg-amoled-card text-slate-900 dark:text-dark-text amoled:text-amoled-text">
            <h3 className="mb-4 text-lg font-semibold">Goal Setting</h3>
            <GoalSetting applications={applications} contacts={contacts} prepEntries={prepEntries} />
          </div>

          {/* Restart Onboarding Tour Section */}
          {onRestartTour && (
            <div className="p-4 mt-6 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 amoled:from-amoled-card amoled:to-amoled-card border border-blue-200 dark:border-blue-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 amoled:bg-blue-900/30 rounded-lg">
                    <Target className="w-5 h-5 text-blue-600 dark:text-blue-400 amoled:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text">
                      Quick Start Tour
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                      {quickStartProgress === 100 
                        ? '✅ Completed! Want to restart the tour?' 
                        : `📝 Progress: ${quickStartProgress}% complete - Restart anytime`
                      }
                    </p>
                  </div>
                </div>
                <button
                  onClick={onRestartTour}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restart Tour
                </button>
              </div>
            </div>
          )}

          {/* Data Import/Export Section */}
          <div className="p-4 mt-6 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 amoled:from-amoled-card amoled:to-amoled-card border border-purple-200 dark:border-purple-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 amoled:bg-purple-900/30 rounded-lg">
                  <Database className="w-5 h-5 text-purple-600 dark:text-purple-400 amoled:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text">
                    Data Import/Export
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                    📁 Import from spreadsheets or export for backup & peace of mind
                  </p>
                  <div className="mt-1 text-xs text-purple-600 dark:text-purple-400 amoled:text-purple-400">
                    💾 {(applications?.length || 0) + (prepEntries?.length || 0) + (stories?.length || 0) + (companies?.length || 0) + (contacts?.length || 0)} items ready to export
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowImportExportModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold text-sm hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg"
              >
                <Database className="w-4 h-4" />
                Import/Export
              </button>
            </div>
          </div>

          {/* Thanks Section */}
          <div className="mt-6 p-6 rounded-xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-pink-900/30 amoled:from-amoled-card amoled:via-amoled-card amoled:to-amoled-card border-2 border-gradient-to-r from-indigo-200 to-purple-200 dark:border-indigo-700/50">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-3">
                💜 Thank You for Using JobTrac! 
              </h3>
              <p className="text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary max-w-2xl mx-auto leading-relaxed">
                Your job search journey matters, and I'm honored to be part of it! 🚀 JobTrac was built to help amazing people like you (and me as well) land their dream jobs. 
                Every feature you use brings you one step closer to success! ✨
              </p>
            </div>

            <div className="flex flex-col items-center space-y-6">
              {/* Social Links */}
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="https://hariharen9.site" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white/70 dark:bg-dark-card/70 amoled:bg-amoled-card/70 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 text-slate-700 dark:text-dark-text amoled:text-amoled-text"
                >
                  🌐 Portfolio
                </a>
                <a 
                  href="https://linkedin.com/in/hariharen9" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-100/70 dark:bg-blue-900/30 amoled:bg-blue-900/30 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 text-blue-700 dark:text-blue-300"
                >
                  💼 LinkedIn
                </a>
                <a 
                  href="https://twitter.com/thisishariharen" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-sky-100/70 dark:bg-sky-900/30 amoled:bg-sky-900/30 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 text-sky-700 dark:text-sky-300"
                >
                  🐦 Twitter
                </a>
                <a 
                  href="https://github.com/hariharen9" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100/70 dark:bg-gray-700/30 amoled:bg-gray-700/30 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 text-gray-700 dark:text-gray-300"
                >
                  💻 GitHub
                </a>
                <a 
                  href="https://medium.com/@hariharen" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-green-100/70 dark:bg-green-900/30 amoled:bg-green-900/30 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 text-green-700 dark:text-green-300"
                >
                  📝 Medium
                </a>
              </div>

              {/* Support Section */}
              <div className="text-center">
                <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-4">
                  💖 Love JobTrac? Consider supporting the development!
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a 
                    href="https://www.buymeacoffee.com/hariharen" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform"
                  >
                    ☕ Buy Me a Coffee
                  </a>
                  <a 
                    href="https://paypal.me/thisishariharen" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform"
                  >
                    💳 PayPal
                  </a>
                </div>
              </div>

              {/* Footer Message */}
              {/* <div className="text-center pt-4 border-t border-slate-200/50 dark:border-slate-600/50 w-full">
                <p className="text-sm text-slate-500 dark:text-dark-text-secondary amoled:text-amoled-text-secondary italic">
                  🌟 "Building scalable & resilient systems in the cloud" - Hariharen 🌟
                </p>
              </div> */}
            </div>
          </div>
        </div>

        {/* Delete Account Section */}
        <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900/20 amoled:bg-amoled-card border border-red-200 dark:border-red-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text">Delete Account</h3>
              <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">Permanently delete your account and all associated data.</p>
            </div>
            <button
              onClick={() => setShowDeleteConfirmation(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold text-sm hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
   

      {/* First Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        title="Confirm Account Deletion"
        size="md"
      >
        <div className="p-4 text-center">
          <Trash2 className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-lg font-semibold text-slate-900 dark:text-dark-text mb-2">Are you absolutely sure?</p>
          <p className="text-slate-600 dark:text-dark-text-secondary mb-6">
            This action is irreversible. All your data, including applications, prep entries, company research, networking contacts, and STAR stories, will be permanently deleted.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setShowDeleteConfirmation(false)}
              className="px-6 py-2 rounded-lg font-semibold text-sm bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors text-slate-800 dark:text-slate-200"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setShowDeleteConfirmation(false);
                setShowFinalDeleteConfirmation(true);
              }}
              className="px-6 py-2 rounded-lg font-semibold text-sm bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Yes, Delete My Account
            </button>
          </div>
        </div>
      </Modal>

      {/* Second Confirmation Modal */}
      <Modal
        isOpen={showFinalDeleteConfirmation}
        onClose={() => {
          setShowFinalDeleteConfirmation(false);
          setDeleteInput('');
        }}
        title="Final Confirmation"
        size="sm"
      >
        <div className="p-4 text-center">
          <p className="text-slate-600 dark:text-dark-text-secondary mb-4">
            To confirm deletion, please type "<span className="font-bold text-red-600">delete</span>" below:
          </p>
          <input
            type="text"
            value={deleteInput}
            onChange={(e) => setDeleteInput(e.target.value)}
            className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg mb-4 text-center text-slate-900 dark:text-dark-text bg-white dark:bg-dark-card focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={handleDeleteAccount}
            disabled={deleteInput !== 'delete'}
            className={`w-full px-6 py-2 rounded-lg font-semibold text-sm transition-colors ${deleteInput === 'delete' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            Delete Account Permanently
          </button>
        </div>
      </Modal>
    
      {/* Data Import/Export Modal */}
      <DataImportExportModal
        isOpen={showImportExportModal}
        onClose={() => setShowImportExportModal(false)}
        applications={applications}
        prepEntries={prepEntries}
        stories={stories}
        companies={companies}
        contacts={contacts}
        onImportData={importData}
      />
    </div>
  );
};

export default ProfileModal;