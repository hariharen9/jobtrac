import React, { useState, useId, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import FormLabel from './FormLabel';
import {
  inputBase,
  inputNormal,
  inputSizes,
  tagBase,
  tagRemoveButton,
  buttonBase,
  buttonVariants,
  buttonSizes,
  cx,
} from './formStyles';

export interface FormTagInputProps {
  /** Input label */
  label?: string;
  /** Current tags array */
  value: string[];
  /** Change handler */
  onChange: (tags: string[]) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Icon to show in label */
  icon?: React.ComponentType<{ className?: string }>;
  /** Maximum number of tags */
  maxTags?: number;
  /** Helper text below input */
  helperText?: string;
  /** Additional CSS classes for container */
  className?: string;
  /** Disable adding new tags */
  disabled?: boolean;
  /** Validate tag before adding */
  validateTag?: (tag: string) => boolean | string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Allow duplicates */
  allowDuplicates?: boolean;
}

const FormTagInput: React.FC<FormTagInputProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Add a tag...',
  icon,
  maxTags,
  helperText,
  className,
  disabled = false,
  validateTag,
  size = 'md',
  allowDuplicates = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const id = useId();

  const handleAddTag = useCallback(() => {
    const tag = inputValue.trim();
    if (!tag) return;

    // Check for duplicates
    if (!allowDuplicates && value.includes(tag)) {
      setError('Tag already exists');
      return;
    }

    // Check max tags
    if (maxTags && value.length >= maxTags) {
      setError(`Maximum ${maxTags} tags allowed`);
      return;
    }

    // Custom validation
    if (validateTag) {
      const validationResult = validateTag(tag);
      if (typeof validationResult === 'string') {
        setError(validationResult);
        return;
      }
      if (!validationResult) {
        setError('Invalid tag');
        return;
      }
    }

    onChange([...value, tag]);
    setInputValue('');
    setError(null);
  }, [inputValue, value, onChange, allowDuplicates, maxTags, validateTag]);

  const handleRemoveTag = useCallback(
    (tagToRemove: string) => {
      onChange(value.filter((tag) => tag !== tagToRemove));
      setError(null);
    },
    [value, onChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      // Remove last tag on backspace when input is empty
      handleRemoveTag(value[value.length - 1]);
    }
  };

  const isMaxReached = maxTags ? value.length >= maxTags : false;

  return (
    <div className={cx('group', className)}>
      {label && (
        <FormLabel htmlFor={id} icon={icon}>
          {label}
        </FormLabel>
      )}

      {/* Tags Display */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          <AnimatePresence mode="popLayout">
            {value.map((tag) => (
              <motion.span
                key={tag}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className={tagBase}
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  disabled={disabled}
                  className={cx(tagRemoveButton, disabled && 'cursor-not-allowed')}
                  aria-label={`Remove ${tag}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Input Row */}
      <div className="flex gap-2">
        <input
          id={id}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setError(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder={isMaxReached ? `Max ${maxTags} tags reached` : placeholder}
          disabled={disabled || isMaxReached}
          className={cx(
            inputBase,
            inputSizes[size],
            inputNormal,
            'flex-1',
            (disabled || isMaxReached) && 'opacity-50 cursor-not-allowed'
          )}
        />
        <motion.button
          type="button"
          whileHover={{ scale: disabled || isMaxReached ? 1 : 1.02 }}
          whileTap={{ scale: disabled || isMaxReached ? 1 : 0.98 }}
          onClick={handleAddTag}
          disabled={disabled || isMaxReached || !inputValue.trim()}
          className={cx(
            buttonBase,
            buttonVariants.ghost,
            buttonSizes[size]
          )}
          aria-label="Add tag"
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Error/Helper Text */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-2 text-sm text-red-600 dark:text-red-400 amoled:text-red-500"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 amoled:text-slate-500">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default FormTagInput;
