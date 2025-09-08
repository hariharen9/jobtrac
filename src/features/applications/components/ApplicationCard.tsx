import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Trash2, Pencil, FileText } from 'lucide-react';
import { Application } from '../../../types';
import { statusColors } from '../../../utils/statusColors';
import ConfirmationModal from '../../../components/shared/ConfirmationModal';

interface ApplicationCardProps {
  app: Application;
  onEditApplication: (application: Application) => void;
  onDeleteApplication: (id: string) => void;
  onViewJD: (application: Application) => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ app, onEditApplication, onDeleteApplication, onViewJD }) => {
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);

  const handleDeleteClick = () => {
    setConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    onDeleteApplication(app.id);
    setConfirmModalOpen(false);
  };

  return (
    <>
      <motion.div 
        className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-4"
        whileHover={{ scale: 1.02, boxShadow: '0px 2px 10px rgba(0,0,0,0.05)' }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-dark-text amoled:text-amoled-text">{app.company}</h3>
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
              onClick={handleDeleteClick}
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
            <p className="text-slate-900 dark:text-dark-text amoled:text-amoled-text font-medium">{app.date}</p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">Location</p>
            <p className="text-slate-900 dark:text-dark-text amoled:text-amoled-text font-medium">{app.location}</p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">Source</p>
            <p className="text-slate-900 dark:text-dark-text amoled:text-amoled-text font-medium">
              {app.source === 'Other' ? app.sourceOther : app.source}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap ${statusColors[app.status]}`}>
            {app.status}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onViewJD(app)}
            className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-semibold text-xs hover:bg-indigo-200 transition-colors flex items-center gap-1"
          >
            <FileText className="w-3 h-3" />
            {app.jobDescription ? 'View JD' : 'Add JD'}
          </motion.button>
        </div>
        
        
        
        {app.notes && (
          <div className="text-sm">
            <p className="text-slate-500 dark:text-slate-400">Notes</p>
            <p className="mt-1 text-slate-900 dark:text-dark-text amoled:text-amoled-text">{app.notes}</p>
          </div>
        )}
      </motion.div>
      <ConfirmationModal
  isOpen={isConfirmModalOpen}
  onClose={() => setConfirmModalOpen(false)}
  onConfirm={handleConfirmDelete}
  title="Delete Application"
  message={
    <>
      Are you sure you want to delete the application for{" "}
      <strong>{app.role}</strong> at <strong>{app.company}</strong>? This action
      cannot be undone.
    </>
  }
/>

    </>
  );
};

export default React.memo(ApplicationCard);
