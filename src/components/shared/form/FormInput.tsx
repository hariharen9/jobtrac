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

export interface FormInputProps {
  /** Input label */
  label?: string;
  /** Input type */
  type?: 'text' | 'email' | 'url' | 'password' | 'number' | 'date' | 'tel';
  /** Current value */
  value: string | number;
  /** Change handler */
  onChange: (value: string) => void;
  /** Blur handler */
  onBlur?: () => void;
  /** Placeholder text */
  placeholder?: string;
  /** Error message */
  error?: string;
  /** Is field required */
  required?: boolean;
  /** Is field disabled */
  disabled?: boolean;
  /** Icon to show in label */
  icon?: React.ComponentType<{ className?: string }>;
  /** Icon to show inside input (right side) */
  trailingIcon?: React.ComponentType<{ className?: string }>;
  /** Input size */
  size?: 'sm' | 'md' | 'lg';
  /** Helper text below input */
  helperText?: string;
  /** Additional input props */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  /** Additional CSS classes for container */
  className?: string;
  /** Auto focus */
  autoFocus?: boolean;
  /** Min value for number inputs */
  min?: number;
  /** Max value for number inputs */
  max?: number;
  /** Step value for number inputs */
  step?: number;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  required = false,
  disabled = false,
  icon,
  trailingIcon: TrailingIcon,
  size = 'md',
  helperText,
  inputProps,
  className,
  autoFocus,
  min,
  max,
  step,
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
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoFocus={autoFocus}
          min={min}
          max={max}
          step={step}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={cx(
            inputBase,
            inputSizes[size],
            error ? inputError : inputNormal,
            disabled && inputDisabled,
            TrailingIcon && 'pr-12'
          )}
          {...inputProps}
        />
        {TrailingIcon && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <TrailingIcon className="w-4 h-4 text-slate-400 dark:text-slate-500 amoled:text-slate-600" />
          </div>
        )}
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

export default FormInput;
