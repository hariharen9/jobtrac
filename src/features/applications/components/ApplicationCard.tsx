import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Trash2, Pencil, FileText, Flame, Calendar, Briefcase, MapPin, DollarSign, Info } from 'lucide-react';
import { Application } from '../../../types';
import { statusColors } from '../../../utils/statusColors';
import ConfirmationModal from '../../../components/shared/ConfirmationModal';
import Tooltip from '../../../components/shared/Tooltip';

interface ApplicationCardProps {
  app: Application;
  onEditApplication: (application: Application) => void;
  onDeleteApplication: (id: string) => void;
  onViewJD: (application: Application) => void;
  isSelected: boolean;
  onSelectionChange: (id: string) => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ 
  app, 
  onEditApplication, 
  onDeleteApplication, 
  onViewJD,
  isSelected,
  onSelectionChange
}) => {
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    onDeleteApplication(app.id);
    setConfirmModalOpen(false);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditApplication(app);
  };
  
  const handleViewJDClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewJD(app);
  };

  const handleCardClick = () => {
    onSelectionChange(app.id);
  };

  const priorityStyles = {
    High: { icon: <Flame className="w-4 h-4 text-red-500" />, text: 'High Priority', bg: 'bg-red-50 dark:bg-red-900/20 amoled:bg-red-900/30', textColor: 'text-red-600 dark:text-red-300 amoled:text-red-400' },
    Medium: { icon: <Flame className="w-4 h-4 text-yellow-500" />, text: 'Medium Priority', bg: 'bg-yellow-50 dark:bg-yellow-900/20 amoled:bg-yellow-900/30', textColor: 'text-yellow-600 dark:text-yellow-300 amoled:text-yellow-400' },
    Low: { icon: <Flame className="w-4 h-4 text-green-500" />, text: 'Low Priority', bg: 'bg-green-50 dark:bg-green-900/20 amoled:bg-green-900/30', textColor: 'text-green-600 dark:text-green-300 amoled:text-green-400' },
  };
  const priority = app.priority && priorityStyles[app.priority];

  return (
    <>
      <motion.div
        onClick={handleCardClick}
        className={`relative rounded-xl shadow-sm transition-all duration-300 cursor-pointer overflow-hidden ${
          isSelected 
            ? 'ring-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 amoled:bg-indigo-900/30' 
            : 'bg-white dark:bg-dark-card amoled:bg-amoled-card border border-slate-200 dark:border-dark-border amoled:border-amoled-border hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 amoled:hover:border-slate-500'
        }`}
        layout
      >
        <div className="p-5">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-bold text-lg text-slate-800 dark:text-dark-text amoled:text-amoled-text flex items-center gap-2">
                {app.company}
              </h3>
              <a
                href={app.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-indigo-600 dark:text-indigo-400 amoled:text-indigo-500 hover:underline flex items-center gap-1 text-sm"
              >
                {app.role}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="absolute top-3 right-3 flex items-center gap-1">
              <Tooltip content="Edit">
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(100,116,139,0.1)' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleEditClick}
                  className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 amoled:hover:text-indigo-500 transition-colors p-1.5 rounded-full"
                  aria-label="Edit application"
                >
                  <Pencil className="w-4 h-4" />
                </motion.button>
              </Tooltip>
              <Tooltip content="Delete">
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(100,116,139,0.1)' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDeleteClick}
                  className="text-slate-500 hover:text-red-600 dark:hover:text-red-400 amoled:hover:text-red-500 transition-colors p-1.5 rounded-full"
                  aria-label="Delete application"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </Tooltip>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <div className="flex items-center gap-2 text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
              <Calendar className="w-4 h-4" />
              <span>{app.date}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
              <MapPin className="w-4 h-4" />
              <span>{app.location || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
              <Briefcase className="w-4 h-4" />
              <span>{app.source === 'Other' ? app.sourceOther : app.source}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
              <DollarSign className="w-4 h-4" />
              <span>{app.salaryRange ? `${app.salaryRange}K` : 'N/A'}</span>
            </div>
          </div>

          {app.notes && (
            <div className="mt-4 text-sm">
              <p className="text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary flex items-center gap-2">
                <Info className="w-4 h-4" />
                Notes
              </p>
              <p className="mt-1 text-slate-800 dark:text-dark-text amoled:text-amoled-text bg-slate-50 dark:bg-slate-800/50 amoled:bg-slate-900/50 p-2 rounded-md">{app.notes}</p>
            </div>
          )}
        </div>

        <div className="bg-slate-50 dark:bg-dark-card-nested amoled:bg-amoled-card-nested px-5 py-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 amoled:border-slate-700">
          <div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[app.status]}`}>
                {app.status}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {priority && (
              <Tooltip content={priority.text}>
                <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ${priority.bg} ${priority.textColor}`}>
                  {priority.icon}
                  <span className="hidden sm:inline">{app.priority}</span>
                </div>
              </Tooltip>
            )}
            {app.interviewDate && (
              <Tooltip content={`Interview on ${app.interviewDate}`}>
                <div className="flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-300 amoled:text-green-400 bg-green-50 dark:bg-green-900/20 amoled:bg-green-900/30 px-2 py-1 rounded-full">
                  <Calendar className="w-4 h-4" />
                  <span className="hidden sm:inline">{app.interviewDate}</span>
                </div>
              </Tooltip>
            )}
            <Tooltip content={app.jobDescription ? 'View Job Description' : 'Add Job Description'}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleViewJDClick}
                className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 amoled:bg-indigo-900/60 amoled:text-indigo-400 px-3 py-1.5 rounded-full font-semibold text-xs hover:bg-indigo-200 dark:hover:bg-indigo-900 amoled:hover:bg-indigo-800 transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-3 h-3" />
                <span>JD</span>
              </motion.button>
            </Tooltip>
          </div>
        </div>
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