import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { buttonHover, buttonTap, buttonPress } from '../../utils/animations';

interface AnimatedButtonProps extends Omit<HTMLMotionProps<"button">, 'whileHover' | 'whileTap'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
  ripple?: boolean;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  children,
  ripple = true,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = "relative overflow-hidden font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500 shadow-lg shadow-indigo-500/25",
    secondary: "bg-slate-200 hover:bg-slate-300 text-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-100 focus:ring-slate-500",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-700 dark:hover:bg-slate-800 dark:text-slate-300 focus:ring-slate-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-lg shadow-red-500/25",
    success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 shadow-lg shadow-green-500/25"
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base"
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ripple && !disabled && !loading) {
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      const rippleElement = document.createElement('span');
      rippleElement.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
      `;
      
      button.appendChild(rippleElement);
      
      setTimeout(() => {
        rippleElement.remove();
      }, 600);
    }
    
    if (props.onClick) {
      props.onClick(e);
    }
  };

  return (
    <>
      <style>{`
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
      <motion.button
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        whileHover={!disabled && !loading ? buttonHover : undefined}
        whileTap={!disabled && !loading ? buttonTap : undefined}
        disabled={disabled || loading}
        onClick={handleClick}
        {...props}
      >
        <motion.div 
          className="flex items-center justify-center gap-2"
          animate={loading ? { opacity: 0.7 } : { opacity: 1 }}
        >
          {loading && (
            <motion.div
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          )}
          {!loading && icon && iconPosition === 'left' && (
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {icon}
            </motion.span>
          )}
          <motion.span
            animate={loading ? { x: 10 } : { x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.span>
          {!loading && icon && iconPosition === 'right' && (
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {icon}
            </motion.span>
          )}
        </motion.div>
      </motion.button>
    </>
  );
};

export default AnimatedButton;