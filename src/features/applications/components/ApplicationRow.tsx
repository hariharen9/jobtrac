import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Trash2, Pencil, FileText, Flame, Calendar } from 'lucide-react';
import { Application } from '../../../types';
import { statusColors } from '../../../utils/statusColors';

interface ApplicationRowProps {
  app: Application;
  onEditApplication: (application: Application) => void;
  onDeleteApplication: (id: string) => void;
  onViewJD: (application: Application) => void;
  isSelected: boolean;
  onSelectionChange: (id: string) => void;
}

const ApplicationRow: React.FC<ApplicationRowProps> = ({ 
  app, 
  onEditApplication, 
  onDeleteApplication, 
  onViewJD,
  isSelected,
  onSelectionChange 
}) => {

  const priorityColor = {
    High: 'text-red-500',
    Medium: 'text-yellow-500',
    Low: 'text-green-500',
  };

  return (
    <tr 
      className={`border-b border-slate-200 dark:border-dark-border amoled:border-amoled-border transition-colors duration-200 ${isSelected ? 'bg-indigo-50 dark:bg-indigo-900/20 amoled:bg-indigo-900/30' : 'bg-white dark:bg-dark-card amoled:bg-amoled-card hover:bg-slate-50 dark:hover:bg-slate-800/50 amoled:hover:bg-slate-900/50'}`}
      onClick={() => onSelectionChange(app.id)}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <input 
          type="checkbox" 
          className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 amoled:border-slate-500 bg-transparent text-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-400 amoled:focus:ring-indigo-500"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onSelectionChange(app.id);
          }}
        />
      </td>
      <td className="px-6 py-4 font-medium text-slate-900 dark:text-dark-text amoled:text-amoled-text">
        <div className="flex items-center gap-2">
          {app.priority && <Flame className={`w-4 h-4 ${priorityColor[app.priority]}`} />}
          {app.company}
        </div>
      </td>
      <td className="px-6 py-4">
        <a
          href={app.link}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline text-indigo-600 dark:text-indigo-400 amoled:text-indigo-500 flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          {app.role}
          <ExternalLink className="w-3 h-3" />
        </a>
      </td>
      <td className="px-6 py-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => { e.stopPropagation(); onViewJD(app); }}
          className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 amoled:bg-indigo-900/60 amoled:text-indigo-400 px-3 py-1 rounded-full font-semibold text-xs hover:bg-indigo-200 dark:hover:bg-indigo-900 amoled:hover:bg-indigo-800 transition-colors flex items-center gap-1"
        >
          <FileText className="w-3 h-3" />
          {app.jobDescription ? 'View JD' : 'Add JD'}
        </motion.button>
      </td>
      <td className="px-6 py-4 text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">{app.date}</td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wide whitespace-nowrap ${statusColors[app.status]}`}>
          {app.status}
        </span>
      </td>
      <td className="px-6 py-4 text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">{app.source === 'Other' ? app.sourceOther : app.source}</td>
      <td className="px-6 py-4 text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">{app.salaryRange ? `${app.salaryRange}K` : 'N/A'}</td>
      <td className="px-6 py-4 text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
        {app.interviewDate ? (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {app.interviewDate}
          </div>
        ) : (
          'N/A'
        )}
      </td>
      <td className="px-6 py-4 text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">{app.location}</td>
      <td className="px-6 py-4 max-w-xs truncate text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">{app.notes}</td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onEditApplication(app); }}
            className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 amoled:hover:text-indigo-500 transition-colors p-1.5 rounded-full"
            aria-label="Edit application"
          >
            <Pencil className="w-4 h-4" />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onDeleteApplication(app.id); }}
            className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 amoled:hover:text-red-500 transition-colors p-1.5 rounded-full"
            aria-label="Delete application"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </td>
    </tr>
  );
};

export default React.memo(ApplicationRow);