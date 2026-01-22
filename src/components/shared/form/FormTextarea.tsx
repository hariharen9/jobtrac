import React, { useId } from 'react';
import FormLabel from './FormLabel';
import FormError from './FormError';
import {
  inputBase,
  inputNormal,
  inputError,
  inputDisabled,
  inputSizes,
  cx,
} from './formStyles';

export interface FormTextareaProps {
  /** Textarea label */
  label?: string;
  /** Current value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Blur handler */
  onBlur?: () => void;
  /** Placeholder text */
  placeholder?: string;
  /** Number of rows */
  rows?: number;
  /** Error message */
  error?: string;
  /** Is field required */
  required?: boolean;
  /** Is field disabled */
  disabled?: boolean;
  /** Icon to show in label */
  icon?: React.ComponentType<{ className?: string }>;
  /** Input size */
  size?: 'sm' | 'md' | 'lg';
  /** Show character count */
  showCharCount?: boolean;
  /** Maximum character count */
  maxLength?: number;
  /** Helper text below input */
  helperText?: string;
  /** Allow resize */
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  /** Additional CSS classes for container */
  className?: string;
  /** Auto focus */
  autoFocus?: boolean;
}

const FormTextarea: React.FC<FormTextareaProps> = ({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  rows = 4,
  error,
  required = false,
  disabled = false,
  icon,
  size = 'md',
  showCharCount = false,
  maxLength,
  helperText,
  resize = 'vertical',
  className,
  autoFocus,
}) => {
  const id = useId();
  const errorId = `${id}-error`;

  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize',
  };

  const charCount = value?.length || 0;
  const isOverLimit = maxLength ? charCount > maxLength : false;

  return (
    <div className={cx('group', className)}>
      {label && (
        <FormLabel htmlFor={id} required={required} icon={icon}>
          {label}
        </FormLabel>
      )}
      <div className="relative">
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          rows={rows}
          required={required}
          disabled={disabled}
          autoFocus={autoFocus}
          maxLength={maxLength}
          aria-invalid={!!error || isOverLimit}
          aria-describedby={error ? errorId : undefined}
          className={cx(
            inputBase,
            inputSizes[size],
            error || isOverLimit ? inputError : inputNormal,
            disabled && inputDisabled,
            resizeClasses[resize]
          )}
        />
      </div>
      <div className="flex items-center justify-between mt-1.5">
        {helperText && !error ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 amoled:text-slate-500">
            {helperText}
          </p>
        ) : (
          <div />
        )}
        {showCharCount && (
          <p
            className={cx(
              'text-xs font-medium',
              isOverLimit
                ? 'text-red-600 dark:text-red-400 amoled:text-red-500'
                : 'text-slate-400 dark:text-slate-500 amoled:text-slate-600'
            )}
          >
            {charCount}
            {maxLength && ` / ${maxLength}`}
          </p>
        )}
      </div>
      <FormError message={error} id={errorId} />
    </div>
  );
};

export default FormTextarea;
