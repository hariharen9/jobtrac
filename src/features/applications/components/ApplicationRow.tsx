import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Trash2, Pencil, FileText, Flame, Calendar } from 'lucide-react';
import { Application } from '../../../types';
import { statusColors } from '../../../utils/statusColors';
import ConfirmationModal from '../../../components/shared/ConfirmationModal';

interface ApplicationRowProps {
  app: Application;
  onEditApplication: (application: Application) => void;
  onDeleteApplication: (id: string) => void;
  onViewJD: (application: Application) => void;
}

const ApplicationRow: React.FC<ApplicationRowProps> = ({ app, onEditApplication, onDeleteApplication, onViewJD }) => {
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);

  const handleDeleteClick = () => {
    setConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    onDeleteApplication(app.id);
    setConfirmModalOpen(false);
  };

  const priorityColor = {
    High: 'text-red-500',
    Medium: 'text-yellow-500',
    Low: 'text-green-500',
  };

  return (
    <>
      <td className="px-6 py-6 font-medium text-slate-900 dark:text-dark-text amoled:text-amoled-text">
        <div className="flex items-center gap-2">
          {app.priority && <Flame className={`w-4 h-4 ${priorityColor[app.priority]}`} />}
          {app.company}
        </div>
      </td>
      <td className="px-6 py-6">
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
      <td className="px-6 py-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onViewJD(app)}
          className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-semibold text-xs hover:bg-indigo-200 transition-colors flex items-center gap-1"
        >
          <FileText className="w-3 h-3" />
          {app.jobDescription ? 'View JD' : 'Add JD'}
        </motion.button>
      </td>
      <td className="px-6 py-6">{app.date}</td>
      <td className="px-6 py-6">
        <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wide whitespace-nowrap ${statusColors[app.status]}`}>
          {app.status}
        </span>
      </td>
      <td className="px-6 py-6">{app.source === 'Other' ? app.sourceOther : app.source}</td>
      <td className="px-6 py-6">{app.salaryRange ? `${app.salaryRange}K` : 'N/A'}</td>
      <td className="px-6 py-6">
        {app.interviewDate ? (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {app.interviewDate}
          </div>
        ) : (
          'N/A'
        )}
      </td>
      <td className="px-6 py-6">{app.location}</td>
      <td className="px-6 py-6 max-w-xs truncate">{app.notes}</td>
      <td className="px-6 py-6 text-right">
        <div className="flex items-center justify-end gap-2">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEditApplication(app)}
            className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            aria-label="Edit application"
          >
            <Pencil className="w-4 h-4" />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDeleteClick}
            className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            aria-label="Delete application"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </td>
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

export default React.memo(ApplicationRow);
