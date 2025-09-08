import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StarTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const StarTooltip: React.FC<StarTooltipProps> = ({ content, children, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative flex items-center" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.1 } }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.5, delay: 0.2 } }}
            className={`absolute ${positionClasses[position]} w-max max-w-xs bg-gray-800 text-white text-xs rounded-md px-3 py-1.5 z-10 shadow-lg`}
          >
            {content}
            <div 
              className={`absolute w-0 h-0 border-transparent
                ${position === 'top' && 'top-full left-1/2 -translate-x-1/2 border-t-4 border-t-gray-800'}
                ${position === 'bottom' && 'bottom-full left-1/2 -translate-x-1/2 border-b-4 border-b-gray-800 rotate-180'}
                ${position === 'left' && 'left-full top-1/2 -translate-y-1/2 border-l-4 border-l-gray-800'}
                ${position === 'right' && 'right-full top-1/2 -translate-y-1/2 border-r-4 border-r-gray-800'}
              `}
            ></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StarTooltip;
