import React from 'react';
import { motion } from 'framer-motion';
import { PrepEntry } from '../../../types';
import { Pencil, Trash2 } from 'lucide-react';

interface PrepLogCardProps {
  entry: PrepEntry;
  onEditPrepEntry: (entry: PrepEntry) => void;
  onDeletePrepEntry: (id: string) => void;
}

const PrepLogCard: React.FC<PrepLogCardProps> = ({ entry, onEditPrepEntry, onDeletePrepEntry }) => {
  return (
    <motion.div 
      className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-4"
      whileHover={{ scale: 1.02, boxShadow: '0px 2px 10px rgba(0,0,0,0.05)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-slate-900 dark:text-dark-text amoled:text-amoled-text">{entry.topic}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{entry.date}</p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEditPrepEntry(entry)}
            className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2"
            aria-label="Edit prep entry"
          >
            <Pencil className="w-5 h-5" />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDeletePrepEntry(entry.id)}
            className="text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors p-2"
            aria-label="Delete prep entry"
          >
            <Trash2 className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-slate-500 dark:text-slate-400">Problems</p>
          <p className="text-slate-900 dark:text-dark-text amoled:text-amoled-text font-medium">{entry.problems}</p>
        </div>
        <div>
          <p className="text-slate-500 dark:text-slate-400">Time (Hrs)</p>
          <p className="text-slate-900 dark:text-dark-text amoled:text-amoled-text font-medium">{entry.time}</p>
        </div>
        <div>
          <p className="text-slate-500 dark:text-slate-400">Confidence</p>
          <p className="text-slate-900 dark:text-dark-text amoled:text-amoled-text font-medium">{entry.confidence}</p>
        </div>
      </div>
      
      {entry.notes && (
        <div className="text-sm">
          <p className="text-slate-500 dark:text-slate-400">Notes</p>
          <p className="mt-1 text-slate-900 dark:text-dark-text amoled:text-amoled-text">{entry.notes}</p>
        </div>
      )}
    </motion.div>
  );
};

export default React.memo(PrepLogCard);
