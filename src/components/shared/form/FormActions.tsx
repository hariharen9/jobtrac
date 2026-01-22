import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import {
  actionsContainer,
  buttonBase,
  buttonVariants,
  buttonSizes,
  cx,
} from './formStyles';

export interface FormActionsProps {
  /** Submit button text */
  submitText?: string;
  /** Submit button text when loading */
  loadingText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Is form submitting */
  isLoading?: boolean;
  /** Is submit button disabled */
  isDisabled?: boolean;
  /** Cancel handler */
  onCancel: () => void;
  /** Submit handler (optional - form can use native submit) */
  onSubmit?: () => void;
  /** Submit button icon */
  submitIcon?: React.ComponentType<{ className?: string }>;
  /** Show cancel button */
  showCancel?: boolean;
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Align buttons */
  align?: 'left' | 'center' | 'right' | 'stretch';
  /** Additional CSS classes */
  className?: string;
}

const FormActions: React.FC<FormActionsProps> = ({
  submitText = 'Save',
  loadingText = 'Saving...',
  cancelText = 'Cancel',
  isLoading = false,
  isDisabled = false,
  onCancel,
  onSubmit,
  submitIcon: SubmitIcon,
  showCancel = true,
  size = 'md',
  align = 'right',
  className,
}) => {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    stretch: 'justify-stretch',
  };

  return (
    <div
      className={cx(
        actionsContainer,
        alignClasses[align],
        className
      )}
    >
      {showCancel && (
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCancel}
          disabled={isLoading}
          className={cx(
            buttonBase,
            buttonVariants.secondary,
            buttonSizes[size],
            align === 'stretch' && 'flex-1'
          )}
        >
          {cancelText}
        </motion.button>
      )}
      <motion.button
        type={onSubmit ? 'button' : 'submit'}
        whileHover={{ scale: isLoading || isDisabled ? 1 : 1.02 }}
        whileTap={{ scale: isLoading || isDisabled ? 1 : 0.98 }}
        onClick={onSubmit}
        disabled={isLoading || isDisabled}
        className={cx(
          buttonBase,
          buttonVariants.primary,
          buttonSizes[size],
          align === 'stretch' && 'flex-1'
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{loadingText}</span>
          </>
        ) : (
          <>
            {SubmitIcon && <SubmitIcon className="w-4 h-4" />}
            <span>{submitText}</span>
          </>
        )}
      </motion.button>
    </div>
  );
};

export default FormActions;
