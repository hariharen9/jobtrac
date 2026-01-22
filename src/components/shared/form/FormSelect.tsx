import React, { useId } from 'react';
import { ChevronDown } from 'lucide-react';
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

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FormSelectProps {
  /** Select label */
  label?: string;
  /** Current value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Options array */
  options: SelectOption[];
  /** Placeholder text (first disabled option) */
  placeholder?: string;
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
  /** Helper text below input */
  helperText?: string;
  /** Additional CSS classes for container */
  className?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  required = false,
  disabled = false,
  icon,
  size = 'md',
  helperText,
  className,
}) => {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={cx('group', className)}>
      {label && (
        <FormLabel htmlFor={id} required={required} icon={icon}>
          {label}
        </FormLabel>
      )}
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={cx(
            inputBase,
            inputSizes[size],
            error ? inputError : inputNormal,
            disabled && inputDisabled,
            'appearance-none cursor-pointer pr-10'
          )}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500 amoled:text-slate-600" />
        </div>
      </div>
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 amoled:text-slate-500">
          {helperText}
        </p>
      )}
      <FormError message={error} id={errorId} />
    </div>
  );
};

export default FormSelect;
