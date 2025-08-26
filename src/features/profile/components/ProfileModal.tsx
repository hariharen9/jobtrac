import React from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { GoogleAuthProvider, linkWithPopup } from 'firebase/auth';
import AnalyticsDashboard from './AnalyticsDashboard';
import GoalSetting from './GoalSetting';
import { Application, NetworkingContact, PrepEntry } from '../../../types';

const ProfileModal = ({ applications, contacts, prepEntries }: { applications: Application[], contacts: NetworkingContact[], prepEntries: PrepEntry[] }) => {
  const { user } = useAuth();

  const handleConnectGoogle = async () => {
    if (!user) return;
    const provider = new GoogleAuthProvider();
    try {
      await linkWithPopup(user, provider);
      alert('Successfully connected Google account!');
    } catch (error) {
      console.error('Error connecting Google account:', error);
      alert('Failed to connect Google account. Please try again.');
    }
  };

  const isGoogleConnected = user?.providerData.some(
    (provider) => provider.providerId === GoogleAuthProvider.PROVIDER_ID
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-dark-card amoled:bg-amoled-card">
      <h2 className="mb-6 text-2xl font-bold text-center text-slate-900 dark:text-dark-text amoled:text-amoled-text">User Profile</h2>
      <div className="flex flex-col gap-6">
        <div>
          <div className="p-4 rounded-lg bg-slate-100 dark:bg-dark-card amoled:bg-amoled-card">
            <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text">User Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium text-slate-600 dark:text-slate-400">Email:</span>
                <span className="text-slate-900 dark:text-dark-text amoled:text-amoled-text">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-slate-600 dark:text-slate-400">Name:</span>
                <span className="text-slate-900 dark:text-dark-text amoled:text-amoled-text">{user?.displayName || 'Not set'}</span>
              </div>
            </div>
          </div>

          {!isGoogleConnected && (
            <div className="mt-6">
              <button 
                onClick={handleConnectGoogle}
                className="w-full px-4 py-2 font-bold text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Connect Google Account
              </button>
            </div>
          )}
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
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
