import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle } from 'lucide-react';
import {
  sectionBase,
  sectionActive,
  sectionInactive,
  iconWrapper,
  iconWrapperActive,
  cx,
} from './formStyles';

export interface FormSectionProps {
  /** Section ID for accessibility */
  id: string;
  /** Section title */
  title: string;
  /** Icon to display */
  icon: React.ComponentType<{ className?: string }>;
  /** Section content */
  children: React.ReactNode;
  /** Is section expanded */
  isOpen: boolean;
  /** Toggle handler */
  onToggle: () => void;
  /** Is this section required */
  required?: boolean;
  /** Is this section completed (shows checkmark) */
  isCompleted?: boolean;
  /** Optional subtitle/description */
  subtitle?: string;
  /** Additional CSS classes */
  className?: string;
}

const FormSection: React.FC<FormSectionProps> = ({
  id,
  title,
  icon: Icon,
  children,
  isOpen,
  onToggle,
  required = false,
  isCompleted = false,
  subtitle,
  className,
}) => {
  return (
    <motion.div
      layout
      className={cx(
        sectionBase,
        isOpen ? sectionActive : sectionInactive,
        className
      )}
    >
      {/* Section Header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-900 dark:focus:ring-white rounded-xl"
        aria-expanded={isOpen}
        aria-controls={`section-content-${id}`}
      >
        {/* Icon */}
        <div
          className={cx(
            iconWrapper,
            isOpen && iconWrapperActive
          )}
        >
          <Icon
            className={cx(
              'w-5 h-5',
              isOpen
                ? 'text-white dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400'
            )}
          />
        </div>

        {/* Title & Subtitle */}
        <div className="flex-1 min-w-0">
          <h3
            className={cx(
              'text-base font-semibold',
              isOpen
                ? 'text-slate-900 dark:text-white amoled:text-white'
                : 'text-slate-700 dark:text-slate-300 amoled:text-slate-400'
            )}
          >
            {title}
            {required && <span className="text-red-500 ml-1">*</span>}
          </h3>
          {subtitle && (
            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
              {subtitle}
            </p>
          )}
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-2">
          {isCompleted && !isOpen && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <CheckCircle className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
            </motion.div>
          )}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-slate-400 dark:text-slate-500" />
          </motion.div>
        </div>
      </button>

      {/* Section Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`section-content-${id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 border-t border-slate-200 dark:border-slate-700 amoled:border-slate-800">
              <div className="pt-4 space-y-4">
                {children}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default React.memo(FormSection);
