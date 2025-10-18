import React, { ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import { X } from 'lucide-react';
import { modalBackdrop, modalContent } from '../../utils/animations';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Spring animation for backdrop blur
  const backdropSpring = useSpring({
    backdropFilter: isOpen ? 'blur(8px)' : 'blur(0px)',
    config: { tension: 300, friction: 30 }
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={modalBackdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex justify-center items-center p-4 sm:p-6"
          onClick={onClose}
        >
          {/* Animated backdrop with blur */}
          <animated.div
            style={backdropSpring}
            className="absolute inset-0 bg-slate-900/60"
          />
          
          {/* Floating particles effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/10 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          <motion.div
            variants={modalContent}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`relative bg-white dark:bg-dark-bg amoled:bg-amoled-bg rounded-xl shadow-2xl w-full ${sizeClasses[size]} max-h-[85vh] sm:max-h-[90vh] overflow-hidden mx-2 sm:mx-4 my-4 sm:my-6 border border-slate-200/50 dark:border-slate-700/50`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with enhanced styling */}
            <motion.div 
              className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-200 dark:border-dark-border amoled:border-amoled-border sticky top-0 bg-white/95 dark:bg-dark-bg/95 amoled:bg-amoled-bg/95 backdrop-blur-sm z-10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-dark-text amoled:text-amoled-text pr-4">
                {title}
              </h3>
              <motion.button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary dark:hover:text-dark-text amoled:hover:text-amoled-text transition-all duration-200 flex-shrink-0 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </motion.div>
            
            {/* Content with scroll animation */}
            <motion.div 
              className="p-4 sm:p-6 overflow-y-auto max-h-[calc(85vh-120px)] sm:max-h-[calc(90vh-120px)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {children}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;