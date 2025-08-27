import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Plus } from 'lucide-react';
import { Application } from '../../../types';
import ApplicationCard from './ApplicationCard';
import ApplicationRow from './ApplicationRow';
import EmptyState from '../../../components/shared/EmptyState';

interface ApplicationTrackerProps {
  applications: Application[];
  onAddApplication: () => void;
  onEditApplication: (application: Application) => void;
  onDeleteApplication: (id: string) => void;
  onViewJD: (application: Application) => void;
  loading?: boolean;
}

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({ 
  applications, 
  onAddApplication, 
  onEditApplication,
  onDeleteApplication,
  onViewJD,
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-900 dark:text-dark-text amoled:text-amoled-text">
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
    <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card p-4 sm:p-6 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
        <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-slate-900 dark:text-dark-text amoled:text-amoled-text">
          <Briefcase className="w-5 h-5" />
          My Applications
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddApplication}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2 justify-center sm:justify-start w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Add Application
        </motion.button>
      </div>
      
      {/* Mobile Card View */}
      <motion.div 
        className="sm:hidden space-y-4"
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {applications.map(app => (
            <motion.div key={app.id} variants={itemVariants} layout>
              <ApplicationCard 
                app={app} 
                onEditApplication={onEditApplication} 
                onDeleteApplication={onDeleteApplication} 
                onViewJD={onViewJD}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        {applications.length === 0 && (
          <EmptyState
            title="No Applications Yet"
            message="Start tracking your job search by adding your first application. It's quick and easy!"
            buttonText="Add Application"
            onButtonClick={onAddApplication}
            icon={<Briefcase className="w-8 h-8 text-indigo-600" />}
          />
        )}
      </motion.div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
          <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700/50 amoled:bg-white amoled:text-black">
            <tr>
              <th scope="col" className="px-6 py-3 text-center">Company</th>
              <th scope="col" className="px-6 py-3 text-center">Role</th>
              <th scope="col" className="px-6 py-3 text-center">JD</th>
              <th scope="col" className="px-6 py-3 text-center">Date Applied</th>
              <th scope="col" className="px-6 py-3 text-center">Status</th>
              <th scope="col" className="px-6 py-3 text-center">Next Step</th>
              <th scope="col" className="px-6 py-3 text-center">Location</th>
              <th scope="col" className="px-6 py-3 text-center">Notes</th>
              <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <motion.tbody
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            {applications.map(app => (
              <motion.tr 
                key={app.id} 
                variants={itemVariants}
                className="bg-white dark:bg-dark-card amoled:bg-amoled-card border-b border-slate-200 dark:border-slate-700"
                whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
                transition={{ duration: 0.2 }}
              >
                <ApplicationRow 
                  app={app} 
                  onEditApplication={onEditApplication} 
                  onDeleteApplication={onDeleteApplication} 
                  onViewJD={onViewJD}
                />
              </motion.tr>
            ))}
            {applications.length === 0 && (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                  <EmptyState
                    title="No Applications Yet"
                    message="Start tracking your job search by adding your first application. It's quick and easy!"
                    buttonText="Add Application"
                    onButtonClick={onAddApplication}
                    icon={<Briefcase className="w-8 h-8 text-indigo-600" />}
                  />
                </td>
              </tr>
            )}
          </motion.tbody>
        </table>
      </div>
    </div>
  );
};

export default React.memo(ApplicationTracker);