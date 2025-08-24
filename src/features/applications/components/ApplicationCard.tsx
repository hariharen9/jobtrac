import React from 'react';
import { motion } from 'framer-motion';
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
    <motion.div 
      className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-4"
      whileHover={{ scale: 1.02, boxShadow: '0px 2px 10px rgba(0,0,0,0.05)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">{app.company}</h3>
          <a
            href={app.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 text-sm mt-1"
          >
            {app.role}
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
        <div className="flex items-center gap-2">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEditApplication(app)}
            className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2"
            aria-label="Edit application"
          >
            <Pencil className="w-5 h-5" />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDeleteApplication(app.id)}
            className="text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors p-2"
            aria-label="Delete application"
          >
            <Trash2 className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-slate-500 dark:text-slate-400">Date Applied</p>
          <p className="text-slate-900 dark:text-slate-100 font-medium">{app.date}</p>
        </div>
        <div>
          <p className="text-slate-500 dark:text-slate-400">Location</p>
          <p className="text-slate-900 dark:text-slate-100 font-medium">{app.location}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusColors[app.status]}`}>
          {app.status}
        </span>
      </div>
      
      {app.nextStep && (
        <div className="text-sm">
          <p className="text-slate-500 dark:text-slate-400">Next Step</p>
          <p className="mt-1 text-slate-900 dark:text-slate-100 font-medium">{app.nextStep}</p>
        </div>
      )}
      
      {app.notes && (
        <div className="text-sm">
          <p className="text-slate-500 dark:text-slate-400">Notes</p>
          <p className="mt-1 text-slate-900 dark:text-slate-100">{app.notes}</p>
        </div>
      )}
    </motion.div>
  );
};

export default React.memo(ApplicationCard);
