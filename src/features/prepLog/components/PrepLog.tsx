import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus } from 'lucide-react';
import { PrepEntry } from '../../../types';
import PrepLogRow from './PrepLogRow';
import PrepLogCard from './PrepLogCard';
import { useMediaQuery } from '../../../hooks/shared/useMediaQuery';
import EmptyState from '../../../components/shared/EmptyState';

interface PrepLogProps {
  prepEntries: PrepEntry[];
  onAddPrepEntry: () => void;
  onEditPrepEntry: (entry: PrepEntry) => void;
  onDeletePrepEntry: (id: string) => void;
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

const PrepLog: React.FC<PrepLogProps> = ({ prepEntries, onAddPrepEntry, onEditPrepEntry, onDeletePrepEntry, loading = false }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (loading) {
    return (
      <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-900 dark:text-dark-text amoled:text-amoled-text">
            <BookOpen className="w-5 h-5" />
            My Prep Log
          </h2>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-slate-600 dark:text-slate-400">Loading prep entries...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card p-4 sm:p-6 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
        <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-slate-900 dark:text-dark-text amoled:text-amoled-text">
          <BookOpen className="w-5 h-5" />
          My Prep Log
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddPrepEntry}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2 justify-center sm:justify-start w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Add Prep Entry
        </motion.button>
      </div>
      {isMobile ? (
        <motion.div 
          className="space-y-4"
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {prepEntries.map(entry => (
              <motion.div key={entry.id} variants={itemVariants} layout>
                <PrepLogCard 
                  entry={entry} 
                  onEditPrepEntry={onEditPrepEntry} 
                  onDeletePrepEntry={onDeletePrepEntry} 
                />
              </motion.div>
            ))}
          </AnimatePresence>
          {prepEntries.length === 0 && (
            <EmptyState
              title="No Prep Entries Yet"
              message="Start tracking your interview preparation by adding your first prep entry. Consistency is key!"
              buttonText="Add Prep Entry"
              onButtonClick={onAddPrepEntry}
              icon={<BookOpen className="w-8 h-8 text-indigo-600" />}
            />
          )}
        </motion.div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
            <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700/50 amoled:bg-amoled-card">
              <tr>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">Topic</th>
                <th scope="col" className="px-6 py-3">Problems Solved</th>
                <th scope="col" className="px-6 py-3">Time (Hrs)</th>
                <th scope="col" className="px-6 py-3">Confidence (1-5)</th>
                <th scope="col" className="px-6 py-3">Key Takeaways</th>
                <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <motion.tbody
              variants={listVariants}
              initial="hidden"
              animate="visible"
            >
              {prepEntries.map(entry => (
                <motion.tr 
                  key={entry.id} 
                  variants={itemVariants}
                  className="bg-white dark:bg-dark-card amoled:bg-amoled-card border-b border-slate-200 dark:border-slate-700"
                  whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
                  transition={{ duration: 0.2 }}
                >
                  <PrepLogRow 
                    entry={entry} 
                    onEditPrepEntry={onEditPrepEntry} 
                    onDeletePrepEntry={onDeletePrepEntry} 
                  />
                </motion.tr>
              ))}
              {prepEntries.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    <EmptyState
                      title="No Prep Entries Yet"
                      message="Start tracking your interview preparation by adding your first prep entry. Consistency is key!"
                      buttonText="Add Prep Entry"
                      onButtonClick={onAddPrepEntry}
                      icon={<BookOpen className="w-8 h-8 text-indigo-600" />}
                    />
                  </td>
                </tr>
              )}
            </motion.tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default React.memo(PrepLog);