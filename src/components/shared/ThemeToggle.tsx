import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../../hooks/shared/useTheme';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Spring animation for smooth scaling and rotation
  const buttonSpring = useSpring({
    transform: `scale(${isPressed ? 0.9 : isHovered ? 1.1 : 1}) rotate(${isPressed ? 180 : 0}deg)`,
    config: { tension: 300, friction: 30 }
  });

  // Background glow animation
  const glowSpring = useSpring({
    opacity: isHovered ? 1 : 0,
    scale: isHovered ? 1 : 0.8,
    config: { tension: 400, friction: 30 }
  });

  const handleClick = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
    toggleTheme();
  };

  const renderIcon = () => {
    const iconVariants = {
      initial: { scale: 0, rotate: -180, opacity: 0 },
      animate: { scale: 1, rotate: 0, opacity: 1 },
      exit: { scale: 0, rotate: 180, opacity: 0 }
    };

    return (
      <AnimatePresence mode="wait">
        {theme === 'light' && (
          <motion.div
            key="sun"
            variants={iconVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Sun className="w-4 h-4" />
          </motion.div>
        )}
        {theme === 'dark' && (
          <motion.div
            key="moon"
            variants={iconVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Moon className="w-4 h-4" />
          </motion.div>
        )}
        {theme === 'amoled' && (
          <motion.div
            key="sparkles"
            variants={iconVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const getAriaLabel = () => {
    if (theme === 'light') return 'Switch to dark mode';
    if (theme === 'dark') return 'Switch to amoled mode';
    return 'Switch to light mode';
  };

  return (
    <div className="relative">
      {/* Animated glow background */}
      <animated.div
        style={glowSpring}
        className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 blur-lg -z-10"
      />
      
      <animated.button
        style={buttonSpring}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center justify-center w-10 h-10 rounded-lg border-2 border-slate-300 dark:border-dark-border amoled:border-amoled-border bg-white dark:bg-dark-card amoled:bg-amoled-card text-slate-700 dark:text-dark-text amoled:text-amoled-text transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden"
        aria-label={getAriaLabel()}
      >
        {/* Animated background gradient */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-lg"
          animate={{
            background: isHovered ? [
              "linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1))",
              "linear-gradient(45deg, rgba(236, 72, 153, 0.1), rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))",
              "linear-gradient(45deg, rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1), rgba(59, 130, 246, 0.1))"
            ] : "linear-gradient(45deg, transparent, transparent, transparent)"
          }}
          transition={{ duration: 2, repeat: isHovered ? Infinity : 0, ease: "linear" }}
        />
        
        {/* Ripple effect on click */}
        {isPressed && (
          <motion.div
            className="absolute inset-0 bg-white/30 rounded-lg"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
        
        <div className="relative z-10">
          {renderIcon()}
        </div>
      </animated.button>
    </div>
  );
};

export default ThemeToggle;