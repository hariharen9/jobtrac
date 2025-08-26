import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Trash2, Pencil } from 'lucide-react';
import { Application } from '../../../types';
import { statusColors } from '../../../utils/statusColors';

interface ApplicationRowProps {
  app: Application;
  onEditApplication: (application: Application) => void;
  onDeleteApplication: (id: string) => void;
}

const ApplicationRow: React.FC<ApplicationRowProps> = ({ app, onEditApplication, onDeleteApplication }) => {
  return (
    <>
      <td className="px-6 py-6 font-medium text-slate-900 dark:text-dark-text amoled:text-amoled-text">{app.company}</td>
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
      <td className="px-6 py-6">{app.date}</td>
      <td className="px-6 py-6">
        <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${statusColors[app.status]}`}>
          {app.status}
        </span>
      </td>
      <td className="px-6 py-6">{app.nextStep}</td>
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
            onClick={() => onDeleteApplication(app.id)}
            className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            aria-label="Delete application"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </td>
    </>
  );
};

export default React.memo(ApplicationRow);
