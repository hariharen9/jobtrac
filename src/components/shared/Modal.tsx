import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900 bg-opacity-50 flex justify-center items-center p-4 sm:p-6 z-50"
          onClick={onClose}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`bg-white dark:bg-dark-bg amoled:bg-amoled-bg rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[85vh] sm:max-h-[90vh] overflow-y-auto mx-2 sm:mx-4 my-4 sm:my-6`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-3 sm:p-4 md:p-6 border-b border-slate-200 dark:border-dark-border amoled:border-amoled-border sticky top-0 bg-white dark:bg-dark-bg amoled:bg-amoled-bg z-10">
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text pr-4">{title}</h3>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary dark:hover:text-dark-text amoled:hover:text-amoled-text transition-colors flex-shrink-0 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 sm:p-4 md:p-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;