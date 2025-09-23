import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Trash2, Pencil, FileText, Flame, Calendar, Briefcase, MapPin, DollarSign } from 'lucide-react';
import { Application } from '../../../types';
import { statusColors } from '../../../utils/statusColors';
import SimpleTooltip from '../../../components/shared/SimpleTooltip';
import CompanyIcon from './CompanyIcon';

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
    Medium: 'text-amber-500',
    Low: 'text-green-500',
  };

  return (
    <tr 
      className={`border-b border-slate-200 dark:border-dark-border amoled:border-amoled-border transition-all duration-200 ${
        isSelected 
          ? 'bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20' 
          : 'bg-white dark:bg-dark-card amoled:bg-amoled-card hover:bg-slate-50 dark:hover:bg-slate-800/50 amoled:hover:bg-slate-900/50'
      }`}
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
          <div className="flex items-center gap-2">
            <div className="w-5 h-5">
              <CompanyIcon companyName={app.company} size={20} />
            </div>
            <span className="font-semibold">{app.company}</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <a
          href={app.link}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline text-indigo-600 dark:text-indigo-400 amoled:text-indigo-500 flex items-center gap-1 font-medium"
          onClick={(e) => e.stopPropagation()}
        >
          {app.role}
          <ExternalLink className="w-3 h-3 flex-shrink-0" />
        </a>
      </td>
      <td className="px-6 py-4">
        <SimpleTooltip content={app.jobDescription ? 'View Job Description' : 'Add Job Description'}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.stopPropagation(); onViewJD(app); }}
            className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 amoled:bg-indigo-900/60 amoled:text-indigo-400 px-3 py-1.5 rounded-full font-semibold text-xs hover:bg-indigo-200 dark:hover:bg-indigo-900 amoled:hover:bg-indigo-800 transition-all duration-200 flex items-center gap-1 shadow-sm"
          >
            <FileText className="w-3 h-3" />
            {app.jobDescription ? 'View JD' : 'Add JD'}
          </motion.button>
        </SimpleTooltip>
      </td>
      <td className="px-6 py-4 text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 flex-shrink-0" />
          <span className="whitespace-nowrap">{app.date}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide whitespace-nowrap ${statusColors[app.status]}`}>
          {app.status}
        </span>
      </td>
      <td className="px-6 py-4 text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 flex-shrink-0" />
          <span className="truncate max-w-xs">{app.source === 'Other' ? app.sourceOther : app.source}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 flex-shrink-0" />
          {app.salaryRange ? `${app.salaryRange}K` : 'N/A'}
        </div>
      </td>
      <td className="px-6 py-4 text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
        {app.interviewDate ? (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span className="whitespace-nowrap">{app.interviewDate}</span>
          </div>
        ) : (
          <span className="text-slate-400">N/A</span>
        )}
      </td>
      <td className="px-6 py-4 text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="truncate max-w-xs">{app.location || 'N/A'}</span>
        </div>
      </td>
      <td className="px-6 py-4 max-w-xs truncate text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
        {app.notes || 'No notes'}
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <SimpleTooltip content="Edit">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); onEditApplication(app); }}
              className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 amoled:hover:text-indigo-500 transition-colors p-1.5 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
              aria-label="Edit application"
            >
              <Pencil className="w-4 h-4" />
            </motion.button>
          </SimpleTooltip>
          <SimpleTooltip content="Delete">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); onDeleteApplication(app.id); }}
              className="text-slate-500 hover:text-red-600 dark:hover:text-red-400 amoled:hover:text-red-500 transition-colors p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30"
              aria-label="Delete application"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </SimpleTooltip>
        </div>
      </td>
    </tr>
  );
};

export default React.memo(ApplicationRow);