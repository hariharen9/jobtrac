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
    <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-slate-800">
      <h2 className="mb-6 text-2xl font-bold text-center text-slate-900 dark:text-slate-100">User Profile</h2>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-700">
            <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">User Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium text-slate-600 dark:text-slate-400">Email:</span>
                <span className="text-slate-900 dark:text-slate-100">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-slate-600 dark:text-slate-400">Name:</span>
                <span className="text-slate-900 dark:text-slate-100">{user?.displayName || 'Not set'}</span>
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
          <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-700">
            <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Analytics Dashboard</h3>
            <AnalyticsDashboard applications={applications} />
          </div>

          <div className="p-4 mt-6 rounded-lg bg-slate-100 dark:bg-slate-700">
            <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Goal Setting</h3>
            <GoalSetting applications={applications} contacts={contacts} prepEntries={prepEntries} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
