import React from 'react';
import { ExternalLink, Trash2, Pencil } from 'lucide-react';
import { Application } from '../../../types';
import { statusColors } from '../../../utils/statusColors';

interface ApplicationCardProps {
  app: Application;
  onEditApplication: (application: Application) => void;
  onDeleteApplication: (id: string) => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ app, onEditApplication, onDeleteApplication }) => {
  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-3">
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
  );
};

export default React.memo(ApplicationCard);
