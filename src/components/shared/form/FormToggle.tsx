import React, { useId } from 'react';
import { motion } from 'framer-motion';
import { toggleBase, toggleOn, toggleOff, toggleKnob, cx } from './formStyles';

export interface FormToggleProps {
  /** Toggle label */
  label: string;
  /** Current checked state */
  checked: boolean;
  /** Change handler */
  onChange: (checked: boolean) => void;
  /** Optional description */
  description?: string;
  /** Icon when off */
  offIcon?: React.ComponentType<{ className?: string }>;
  /** Icon when on */
  onIcon?: React.ComponentType<{ className?: string }>;
  /** Disabled state */
  disabled?: boolean;
  /** Additional CSS classes for container */
  className?: string;
  /** Size variant */
  size?: 'sm' | 'md';
}

const FormToggle: React.FC<FormToggleProps> = ({
  label,
  checked,
  onChange,
  description,
  offIcon: OffIcon,
  onIcon: OnIcon,
  disabled = false,
  className,
  size = 'md',
}) => {
  const id = useId();

  const sizeClasses = {
    sm: {
      toggle: 'h-5 w-9',
      knob: 'h-3 w-3',
      translateOn: 'translate-x-5',
      translateOff: 'translate-x-1',
    },
    md: {
      toggle: 'h-6 w-11',
      knob: 'h-4 w-4',
      translateOn: 'translate-x-6',
      translateOff: 'translate-x-1',
    },
  };

  const currentSize = sizeClasses[size];
  const CurrentIcon = checked ? OnIcon : OffIcon;

  return (
    <div className={cx('flex items-center justify-between', className)}>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {CurrentIcon && (
          <CurrentIcon
            className={cx(
              'w-4 h-4 flex-shrink-0',
              checked
                ? 'text-slate-900 dark:text-white amoled:text-white'
                : 'text-slate-400 dark:text-slate-500 amoled:text-slate-600'
            )}
          />
        )}
        <div className="min-w-0">
          <label
            htmlFor={id}
            className={cx(
              'text-sm font-medium cursor-pointer',
              disabled && 'cursor-not-allowed opacity-50',
              checked
                ? 'text-slate-900 dark:text-white amoled:text-white'
                : 'text-slate-700 dark:text-slate-300 amoled:text-slate-400'
            )}
          >
            {label}
          </label>
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 amoled:text-slate-500 truncate">
              {description}
            </p>
          )}
        </div>
      </div>

      <motion.button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        className={cx(
          toggleBase,
          currentSize.toggle,
          checked ? toggleOn : toggleOff,
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 700, damping: 30 }}
          className={cx(
            toggleKnob,
            currentSize.knob,
            checked ? currentSize.translateOn : currentSize.translateOff
          )}
        />
      </motion.button>
    </div>
  );
};

export default FormToggle;
