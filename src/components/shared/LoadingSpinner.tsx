import React from 'react';
import { motion } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars' | 'orbit';
  color?: 'primary' | 'secondary' | 'white';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'spinner',
  color = 'primary',
  text
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'text-indigo-600',
    secondary: 'text-slate-600',
    white: 'text-white'
  };

  const dotSizes = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4'
  };

  const barSizes = {
    sm: 'w-0.5 h-3',
    md: 'w-1 h-4',
    lg: 'w-1.5 h-6',
    xl: 'w-2 h-8'
  };

  // Spring animation for smooth scaling
  const pulseSpring = useSpring({
    from: { scale: 0.8, opacity: 0.5 },
    to: async (next) => {
      while (true) {
        await next({ scale: 1.2, opacity: 1 });
        await next({ scale: 0.8, opacity: 0.5 });
      }
    },
    config: { duration: 1000 }
  });

  const renderSpinner = () => {
    switch (variant) {
      case 'spinner':
        return (
          <motion.div
            className={`${sizeClasses[size]} border-2 border-current border-t-transparent rounded-full ${colorClasses[color]}`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        );

      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`${dotSizes[size]} bg-current rounded-full ${colorClasses[color]}`}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <animated.div
            style={pulseSpring}
            className={`${sizeClasses[size]} bg-current rounded-full ${colorClasses[color]}`}
          />
        );

      case 'bars':
        return (
          <div className="flex space-x-1 items-end">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className={`${barSizes[size]} bg-current rounded-sm ${colorClasses[color]}`}
                animate={{
                  scaleY: [1, 2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        );

      case 'orbit':
        return (
          <div className={`relative ${sizeClasses[size]}`}>
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 ${dotSizes[size]} bg-current rounded-full ${colorClasses[color]}`} />
            </motion.div>
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            >
              <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 ${dotSizes[size]} bg-current rounded-full opacity-60 ${colorClasses[color]}`} />
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      {renderSpinner()}
      {text && (
        <motion.p
          className={`text-sm font-medium ${colorClasses[color]}`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;