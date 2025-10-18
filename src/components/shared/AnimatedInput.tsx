import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

interface AnimatedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  success?: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'underlined';
  showPasswordToggle?: boolean;
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({
  label,
  error,
  success,
  icon,
  size = 'md',
  variant = 'default',
  showPasswordToggle = false,
  type = 'text',
  className = '',
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  const inputType = showPasswordToggle && type === 'password' 
    ? (showPassword ? 'text' : 'password') 
    : type;

  // Spring animations for smooth interactions
  const labelSpring = useSpring({
    transform: isFocused || hasValue 
      ? 'translateY(-24px) scale(0.85)' 
      : 'translateY(0px) scale(1)',
    color: error 
      ? '#ef4444' 
      : isFocused 
        ? '#6366f1' 
        : '#64748b',
    config: { tension: 300, friction: 30 }
  });

  const borderSpring = useSpring({
    borderColor: error 
      ? '#ef4444' 
      : success 
        ? '#10b981' 
        : isFocused 
          ? '#6366f1' 
          : '#d1d5db',
    boxShadow: isFocused 
      ? error 
        ? '0 0 0 3px rgba(239, 68, 68, 0.1)' 
        : '0 0 0 3px rgba(99, 102, 241, 0.1)'
      : '0 0 0 0px rgba(0, 0, 0, 0)',
    config: { tension: 300, friction: 30 }
  });

  const iconSpring = useSpring({
    scale: isFocused ? 1.1 : 1,
    color: error 
      ? '#ef4444' 
      : success 
        ? '#10b981' 
        : isFocused 
          ? '#6366f1' 
          : '#9ca3af',
    config: { tension: 400, friction: 30 }
  });

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg'
  };

  const variantClasses = {
    default: 'border-2 rounded-lg bg-white dark:bg-dark-card',
    filled: 'border-0 rounded-lg bg-slate-100 dark:bg-slate-800',
    underlined: 'border-0 border-b-2 rounded-none bg-transparent'
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasValue(!!e.target.value);
    onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(!!e.target.value);
    props.onChange?.(e);
  };

  return (
    <div className="relative">
      {/* Floating Label */}
      {label && (
        <animated.label
          style={labelSpring}
          className="absolute left-4 pointer-events-none origin-left font-medium transition-colors duration-200 z-10"
          onClick={() => inputRef.current?.focus()}
        >
          {label}
        </animated.label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {icon && (
          <animated.div 
            style={iconSpring}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
          >
            {icon}
          </animated.div>
        )}

        {/* Input Field */}
        <animated.input
          ref={inputRef}
          type={inputType}
          style={borderSpring}
          className={`
            w-full transition-all duration-200 outline-none
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            ${icon ? 'pl-10' : ''}
            ${showPasswordToggle ? 'pr-10' : ''}
            ${error ? 'border-red-500' : success ? 'border-green-500' : ''}
            text-slate-900 dark:text-slate-100
            placeholder-slate-400 dark:placeholder-slate-500
            ${className}
          `}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />

        {/* Password Toggle */}
        {showPasswordToggle && (
          <motion.button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            onClick={() => setShowPassword(!showPassword)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </motion.button>
        )}

        {/* Status Icons */}
        <AnimatePresence>
          {(error || success) && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${showPasswordToggle ? 'right-10' : 'right-3'}`}
            >
              {error && <AlertCircle className="w-5 h-5 text-red-500" />}
              {success && <CheckCircle className="w-5 h-5 text-green-500" />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error/Success Messages */}
      <AnimatePresence>
        {(error || success) && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mt-2"
          >
            {error && (
              <motion.p 
                className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                animate={{ x: [0, -5, 5, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
              >
                <AlertCircle size={14} />
                {error}
              </motion.p>
            )}
            {success && (
              <motion.p 
                className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <CheckCircle size={14} />
                {success}
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedInput;