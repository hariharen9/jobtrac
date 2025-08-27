import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  message: string;
  buttonText: string;
  onButtonClick: () => void;
  icon: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, message, buttonText, onButtonClick, icon }) => {
  return (
    <div className="text-center py-12 px-6 bg-slate-50 dark:bg-slate-800/50 amoled:bg-amoled-card rounded-lg">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="inline-block p-4 bg-indigo-100 dark:bg-indigo-500/20 rounded-full mb-4"
      >
        {icon}
      </motion.div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 mt-2 mb-6 max-w-md mx-auto">{message}</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onButtonClick}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2 mx-auto"
      >
        <Plus className="w-4 h-4" />
        {buttonText}
      </motion.button>
    </div>
  );
};

export default EmptyState;
