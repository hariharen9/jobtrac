import React from 'react';
import { Briefcase, Plus, ExternalLink, Trash2, Pencil } from 'lucide-react';
import { Application } from '../../../types';
import { statusColors } from '../../../utils/statusColors';

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
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2 justify-center sm:justify-start"
        >
          <Plus className="w-4 h-4" />
          Add Application
        </button>
      </div>
      
      {/* Mobile Card View */}
      <div className="sm:hidden space-y-4">
        {applications.map(app => (
          <div key={app.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">{app.company}</h3>
                <a
                  href={app.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 text-sm mt-1"
                >
                  {app.role}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onEditApplication(app)}
                  className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-1"
                  aria-label="Edit application"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => onDeleteApplication(app.id)}
                  className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1"
                  aria-label="Delete application"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-500 dark:text-slate-400">Date:</span>
                <span className="ml-1 text-slate-900 dark:text-slate-100">{app.date}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Location:</span>
                <span className="ml-1 text-slate-900 dark:text-slate-100">{app.location}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${statusColors[app.status]}`}>
                {app.status}
              </span>
            </div>
            
            {app.nextStep && (
              <div className="text-sm">
                <span className="text-slate-500 dark:text-slate-400">Next:</span>
                <span className="ml-1 text-slate-900 dark:text-slate-100">{app.nextStep}</span>
              </div>
            )}
            
            {app.notes && (
              <div className="text-sm">
                <span className="text-slate-500 dark:text-slate-400">Notes:</span>
                <p className="mt-1 text-slate-900 dark:text-slate-100">{app.notes}</p>
              </div>
            )}
          </div>
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
              <tr key={app.id} className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{app.company}</td>
                <td className="px-6 py-4">
                  <a
                    href={app.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-indigo-600 dark:text-indigo-400 flex items-center gap-1"
                  >
                    {app.role}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </td>
                <td className="px-6 py-4">{app.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${statusColors[app.status]}`}>
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4">{app.nextStep}</td>
                <td className="px-6 py-4">{app.location}</td>
                <td className="px-6 py-4 max-w-xs truncate">{app.notes}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onEditApplication(app)}
                      className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      aria-label="Edit application"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDeleteApplication(app.id)}
                      className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      aria-label="Delete application"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
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

export default ApplicationTracker;