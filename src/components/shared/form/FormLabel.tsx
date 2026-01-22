import React from 'react';
import { labelBase, labelRequired, cx } from './formStyles';

export interface FormLabelProps {
  /** Label text */
  children: React.ReactNode;
  /** Input ID this label is for */
  htmlFor?: string;
  /** Show required indicator */
  required?: boolean;
  /** Optional icon to display before label */
  icon?: React.ComponentType<{ className?: string }>;
  /** Additional CSS classes */
  className?: string;
}

const FormLabel: React.FC<FormLabelProps> = ({
  children,
  htmlFor,
  required = false,
  icon: Icon,
  className,
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cx(
        labelBase,
        required && labelRequired,
        Icon && 'flex items-center gap-2',
        className
      )}
    >
      {Icon && <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400 amoled:text-slate-500" />}
      {children}
    </label>
  );
};

export default FormLabel;
