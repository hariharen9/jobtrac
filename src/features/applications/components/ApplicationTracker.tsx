import React from 'react';
import { Briefcase, Plus } from 'lucide-react';
import { Application } from '../../../types';
import ApplicationCard from './ApplicationCard';
import ApplicationRow from './ApplicationRow';

interface ApplicationTrackerProps {
  applications: Application[];
  onAddApplication: () => void;
  onEditApplication: (application: Application) => void;
  onDeleteApplication: (id: string) => void;
  loading?: boolean;
}

const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({ 
  applications, 
  onAddApplication, 
  onEditApplication,
  onDeleteApplication,
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Briefcase className="w-5 h-5" />
            My Applications
          </h2>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-slate-600 dark:text-slate-400">Loading applications...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
        <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Briefcase className="w-5 h-5" />
          My Applications
        </h2>
        <button
          onClick={onAddApplication}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2 justify-center sm:justify-start w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Add Application
        </button>
      </div>
      
      {/* Mobile Card View */}
      <div className="sm:hidden space-y-4">
        {applications.map(app => (
          <ApplicationCard 
            key={app.id} 
            app={app} 
            onEditApplication={onEditApplication} 
            onDeleteApplication={onDeleteApplication} 
          />
        ))}
        {applications.length === 0 && (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            No applications yet. Click "Add Application" to get started!
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
          <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700/50">
            <tr>
              <th scope="col" className="px-6 py-3">Company</th>
              <th scope="col" className="px-6 py-3">Role</th>
              <th scope="col" className="px-6 py-3">Date Applied</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Next Step</th>
              <th scope="col" className="px-6 py-3">Location</th>
              <th scope="col" className="px-6 py-3">Notes</th>
              <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <ApplicationRow 
                key={app.id} 
                app={app} 
                onEditApplication={onEditApplication} 
                onDeleteApplication={onDeleteApplication} 
              />
            ))}
            {applications.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                  No applications yet. Click "Add Application" to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default React.memo(ApplicationTracker);