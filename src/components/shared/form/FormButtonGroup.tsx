import React, { useId } from 'react';
import { motion } from 'framer-motion';
import FormLabel from './FormLabel';
import FormError from './FormError';
import { chipBase, chipSelected, chipUnselected, cx } from './formStyles';

/** Available hover color variants */
export type HoverColorVariant =
  | 'blue'
  | 'green'
  | 'red'
  | 'orange'
  | 'purple'
  | 'yellow'
  | 'pink'
  | 'teal'
  | 'maroon';

export interface ButtonGroupOption {
  /** Option value */
  value: string;
  /** Display label */
  label: string;
  /** Optional icon */
  icon?: React.ComponentType<{ className?: string }>;
  /** Optional description */
  description?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Hover color variant for subtle color effect */
  hoverColor?: HoverColorVariant;
}

export interface FormButtonGroupProps {
  /** Group label */
  label?: string;
  /** Current selected value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Options array */
  options: ButtonGroupOption[];
  /** Error message */
  error?: string;
  /** Is field required */
  required?: boolean;
  /** Icon to show in label */
  icon?: React.ComponentType<{ className?: string }>;
  /** Layout direction */
  direction?: 'horizontal' | 'vertical';
  /** Number of columns (for grid layout) */
  columns?: 2 | 3 | 4;
  /** Additional CSS classes for container */
  className?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

const FormButtonGroup: React.FC<FormButtonGroupProps> = ({
  label,
  value,
  onChange,
  options,
  error,
  required = false,
  icon,
  direction = 'horizontal',
  columns,
  className,
  size = 'md',
}) => {
  const id = useId();
  const errorId = `${id}-error`;

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
  };

  const getGridClasses = () => {
    if (columns) {
      // Using explicit classes for Tailwind purge compatibility
      // Responsive: 2 cols on mobile, specified cols on sm+
      const colClasses: Record<number, string> = {
        2: 'grid grid-cols-2 gap-2',
        3: 'grid grid-cols-2 sm:grid-cols-3 gap-2',
        4: 'grid grid-cols-2 sm:grid-cols-4 gap-2',
      };
      return colClasses[columns] || 'flex flex-wrap gap-2';
    }
    if (direction === 'vertical') {
      return 'flex flex-col gap-2';
    }
    return 'flex flex-wrap gap-2';
  };

  // Hover color classes for each variant (subtle backgrounds)
  const getHoverColorClasses = (hoverColor?: HoverColorVariant, isSelected?: boolean) => {
    if (isSelected || !hoverColor) return '';

    const colorMap: Record<HoverColorVariant, string> = {
      blue: 'hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-950/30 dark:hover:border-blue-700 amoled:hover:bg-blue-950/40 amoled:hover:border-blue-800',
      green: 'hover:bg-green-50 hover:border-green-300 dark:hover:bg-green-950/30 dark:hover:border-green-700 amoled:hover:bg-green-950/40 amoled:hover:border-green-800',
      red: 'hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-950/30 dark:hover:border-red-700 amoled:hover:bg-red-950/40 amoled:hover:border-red-800',
      orange: 'hover:bg-orange-50 hover:border-orange-300 dark:hover:bg-orange-950/30 dark:hover:border-orange-700 amoled:hover:bg-orange-950/40 amoled:hover:border-orange-800',
      purple: 'hover:bg-purple-50 hover:border-purple-300 dark:hover:bg-purple-950/30 dark:hover:border-purple-700 amoled:hover:bg-purple-950/40 amoled:hover:border-purple-800',
      yellow: 'hover:bg-yellow-50 hover:border-yellow-300 dark:hover:bg-yellow-950/30 dark:hover:border-yellow-700 amoled:hover:bg-yellow-950/40 amoled:hover:border-yellow-800',
      pink: 'hover:bg-pink-50 hover:border-pink-300 dark:hover:bg-pink-950/30 dark:hover:border-pink-700 amoled:hover:bg-pink-950/40 amoled:hover:border-pink-800',
      teal: 'hover:bg-teal-50 hover:border-teal-300 dark:hover:bg-teal-950/30 dark:hover:border-teal-700 amoled:hover:bg-teal-950/40 amoled:hover:border-teal-800',
      maroon: 'hover:bg-rose-50 hover:border-rose-300 dark:hover:bg-rose-950/30 dark:hover:border-rose-700 amoled:hover:bg-rose-950/40 amoled:hover:border-rose-800',
    };

    return colorMap[hoverColor] || '';
  };

  // Get hover icon color
  const getHoverIconColor = (hoverColor?: HoverColorVariant) => {
    if (!hoverColor) return '';

    const colorMap: Record<HoverColorVariant, string> = {
      blue: 'group-hover/btn:text-blue-500 dark:group-hover/btn:text-blue-400',
      green: 'group-hover/btn:text-green-500 dark:group-hover/btn:text-green-400',
      red: 'group-hover/btn:text-red-500 dark:group-hover/btn:text-red-400',
      orange: 'group-hover/btn:text-orange-500 dark:group-hover/btn:text-orange-400',
      purple: 'group-hover/btn:text-purple-500 dark:group-hover/btn:text-purple-400',
      yellow: 'group-hover/btn:text-yellow-600 dark:group-hover/btn:text-yellow-400',
      pink: 'group-hover/btn:text-pink-500 dark:group-hover/btn:text-pink-400',
      teal: 'group-hover/btn:text-teal-500 dark:group-hover/btn:text-teal-400',
      maroon: 'group-hover/btn:text-rose-600 dark:group-hover/btn:text-rose-400',
    };

    return colorMap[hoverColor] || '';
  };

  return (
    <div className={cx('group', className)}>
      {label && (
        <FormLabel required={required} icon={icon}>
          {label}
        </FormLabel>
      )}
      <div
        className={getGridClasses()}
        role="group"
        aria-label={label}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
      >
        {options.map((option) => {
          const isSelected = value === option.value;
          const Icon = option.icon;

          return (
            <motion.button
              key={option.value}
              type="button"
              whileHover={{ scale: option.disabled ? 1 : 1.02 }}
              whileTap={{ scale: option.disabled ? 1 : 0.98 }}
              onClick={() => !option.disabled && onChange(option.value)}
              disabled={option.disabled}
              className={cx(
                'group/btn',
                chipBase,
                sizeClasses[size],
                isSelected ? chipSelected : chipUnselected,
                !isSelected && getHoverColorClasses(option.hoverColor, isSelected),
                option.disabled && 'opacity-50 cursor-not-allowed',
                option.description && 'flex flex-col items-start text-left'
              )}
              aria-pressed={isSelected}
            >
              <span className="flex items-center justify-center gap-2">
                {Icon && (
                  <Icon
                    className={cx(
                      'w-4 h-4 flex-shrink-0 transition-colors duration-200',
                      isSelected
                        ? 'text-white dark:text-slate-900 amoled:text-slate-900'
                        : 'text-slate-500 dark:text-slate-400 amoled:text-slate-500',
                      !isSelected && getHoverIconColor(option.hoverColor)
                    )}
                  />
                )}
                <span className="font-medium truncate">{option.label}</span>
              </span>
              {option.description && (
                <span
                  className={cx(
                    'text-xs mt-0.5',
                    isSelected
                      ? 'text-slate-300 dark:text-slate-600 amoled:text-slate-600'
                      : 'text-slate-500 dark:text-slate-400 amoled:text-slate-500'
                  )}
                >
                  {option.description}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
      <FormError message={error} id={errorId} />
    </div>
  );
};

export default FormButtonGroup;
