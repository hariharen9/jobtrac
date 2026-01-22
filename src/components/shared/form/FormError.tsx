import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { errorBase, cx } from './formStyles';

export interface FormErrorProps {
  /** Error message to display */
  message?: string;
  /** Unique ID for aria-describedby */
  id?: string;
  /** Additional CSS classes */
  className?: string;
}

const FormError: React.FC<FormErrorProps> = ({
  message,
  id,
  className,
}) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          id={id}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className={cx(errorBase, className)}
          role="alert"
        >
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{message}</span>
        </motion.p>
      )}
    </AnimatePresence>
  );
};

export default FormError;
