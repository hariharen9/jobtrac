import React, { useState, useRef } from 'react';

interface SimpleTooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const SimpleTooltip: React.FC<SimpleTooltipProps> = ({ content, children, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => {
      setIsVisible(true);
    }, 1500);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
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
      {isVisible && (
        <div 
          className={`absolute ${positionClasses[position]} w-max max-w-xs bg-gray-800 text-white text-xs rounded-md px-3 py-1.5 z-10 shadow-lg animate-fade-in`}
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
        </div>
      )}
    </div>
  );
};

export default SimpleTooltip;