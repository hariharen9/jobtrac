import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Trash2, Pencil, FileText, Flame, Calendar, Briefcase, MapPin, DollarSign, Info } from 'lucide-react';
import { Application } from '../../../types';
import { statusColors } from '../../../utils/statusColors';
import ConfirmationModal from '../../../components/shared/ConfirmationModal';
import SimpleTooltip from '../../../components/shared/SimpleTooltip';
import CompanyIcon from './CompanyIcon';

interface ApplicationCardProps {
  app: Application;
  onEditApplication: (application: Application) => void;
  onDeleteApplication: (id: string) => void;
  onViewJD: (application: Application) => void;
  isSelected: boolean;
  onSelectionChange: (id: string) => void;
  currency?: 'USD' | 'INR' | 'EUR' | 'GBP';
  salaryDenomination?: 'K' | 'L';
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ 
  app, 
  onEditApplication, 
  onDeleteApplication, 
  onViewJD,
  isSelected,
  onSelectionChange,
  currency = 'USD',
  salaryDenomination = 'K'
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
    Medium: { icon: <Flame className="w-4 h-4 text-amber-500" />, text: 'Medium Priority', bg: 'bg-amber-50 dark:bg-amber-900/20 amoled:bg-amber-900/30', textColor: 'text-amber-600 dark:text-amber-300 amoled:text-amber-400' },
    Low: { icon: <Flame className="w-4 h-4 text-green-500" />, text: 'Low Priority', bg: 'bg-green-50 dark:bg-green-900/20 amoled:bg-green-900/30', textColor: 'text-green-600 dark:text-green-300 amoled:text-green-400' },
  };
  const priority = app.priority && priorityStyles[app.priority];

  // Determine if the card has minimal content
  const hasMinimalContent = !app.notes && !app.interviewDate && !app.priority && !app.salaryRange;

  return (
    <>
      <motion.div
        onClick={handleCardClick}
        className={`relative rounded-xl shadow-sm transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full ${
          isSelected 
            ? 'ring-2 ring-indigo-500 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20' 
            : 'bg-white dark:bg-dark-card amoled:bg-amoled-card border border-slate-200 dark:border-dark-border amoled:border-amoled-border hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 amoled:hover:border-slate-500'
        }`}
        layout
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="p-5 flex-grow">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold">
                <CompanyIcon companyName={app.company} size={20} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-dark-text amoled:text-amoled-text flex items-center gap-2">
                  {app.company}
                </h3>
                <a
                  href={app.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-indigo-600 dark:text-indigo-400 amoled:text-indigo-500 hover:underline flex items-center gap-1 text-sm mt-1"
                >
                  {app.role}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <SimpleTooltip content="Edit">
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleEditClick}
                  className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 amoled:hover:text-indigo-500 transition-colors p-1.5 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                  aria-label="Edit application"
                >
                  <Pencil className="w-4 h-4" />
                </motion.button>
              </SimpleTooltip>
              <SimpleTooltip content="Delete">
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDeleteClick}
                  className="text-slate-500 hover:text-red-600 dark:hover:text-red-400 amoled:hover:text-red-500 transition-colors p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30"
                  aria-label="Delete application"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </SimpleTooltip>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm flex-grow">
            <div className="flex items-center gap-2.5 text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
              <div className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Applied</p>
                <p className="font-medium">{app.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
              <div className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Location</p>
                <p className="font-medium">{app.location || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
              <div className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Source</p>
                <p className="font-medium">{app.source === 'Other' ? app.sourceOther : app.source}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
              <div className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Salary</p>
                <p className="font-medium">
                  {app.salaryRange ? `${currency === 'USD' ? '$' : currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : '£'}${app.salaryRange}${salaryDenomination}` : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {app.notes && (
            <div className="mt-4 text-sm">
              <div className="flex items-center gap-2 text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-2">
                <div className="p-1 rounded-md bg-slate-100 dark:bg-slate-800">
                  <Info className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium">Notes</span>
              </div>
              <p className="text-slate-800 dark:text-dark-text amoled:text-amoled-text bg-slate-50 dark:bg-slate-800/50 amoled:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                {app.notes}
              </p>
            </div>
          )}
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 amoled:bg-slate-900/30 px-5 py-3.5 flex items-center justify-between border-t border-slate-200 dark:border-slate-700 amoled:border-slate-800 mt-auto">
          <div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusColors[app.status]}`}>
                {app.status}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {priority && (
              <SimpleTooltip content={priority.text}>
                <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${priority.bg} ${priority.textColor}`}>
                  {priority.icon}
                  <span className="hidden sm:inline">{app.priority}</span>
                </div>
              </SimpleTooltip>
            )}
            {app.interviewDate && (
              <SimpleTooltip content={`Interview on ${app.interviewDate}`}>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-green-600 dark:text-green-300 amoled:text-green-400 bg-green-50 dark:bg-green-900/20 amoled:bg-green-900/30 px-2.5 py-1 rounded-full">
                  <Calendar className="w-4 h-4" />
                  <span className="hidden sm:inline">{app.interviewDate}</span>
                </div>
              </SimpleTooltip>
            )}
            <SimpleTooltip content={app.jobDescription ? 'View Job Description' : 'Add Job Description'}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleViewJDClick}
                className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 amoled:bg-indigo-900/60 amoled:text-indigo-400 px-3 py-1.5 rounded-full font-semibold text-xs hover:bg-indigo-200 dark:hover:bg-indigo-900 amoled:hover:bg-indigo-800 transition-all duration-200 flex items-center gap-1.5 shadow-sm"
              >
                <FileText className="w-3 h-3" />
                <span>JD</span>
              </motion.button>
            </SimpleTooltip>
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