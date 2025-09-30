import React, { useState, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';

interface SimpleTooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const SimpleTooltip: React.FC<SimpleTooltipProps> = ({ content, children, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const targetRef = useRef<HTMLElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback(() => {
    timerRef.current = setTimeout(() => {
      if (targetRef.current) {
        const rect = targetRef.current.getBoundingClientRect();
        let top = 0, left = 0;

        // getBoundingClientRect is relative to the viewport, which is what position:fixed uses.
        // No scroll adjustments are needed.
        switch (position) {
          case 'top':
            top = rect.top;
            left = rect.left + rect.width / 2;
            break;
          case 'bottom':
            top = rect.bottom;
            left = rect.left + rect.width / 2;
            break;
          case 'left':
            top = rect.top + rect.height / 2;
            left = rect.left;
            break;
          case 'right':
            top = rect.top + rect.height / 2;
            left = rect.right;
            break;
        }
        setCoords({ top, left });
        setIsVisible(true);
      }
    }, 500); // Reduced delay for better UX
  }, [position]);

  const handleMouseLeave = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setIsVisible(false);
  }, []);

  const positionClasses = {
    top: '-translate-x-1/2 -translate-y-full -mt-2',
    bottom: '-translate-x-1/2 translate-y-2',
    left: '-translate-x-full -translate-y-1/2 -ml-2',
    right: 'translate-x-2 -translate-y-1/2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-800',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-800 rotate-180',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-800',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-800',
  }

  return (
    <>
      {React.cloneElement(children, { 
        ref: targetRef, 
        onMouseEnter: handleMouseEnter, 
        onMouseLeave: handleMouseLeave 
      })}
      {isVisible && ReactDOM.createPortal(
        <div 
          style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
          className={`fixed ${positionClasses[position]} w-max max-w-xs bg-gray-800 text-white text-xs rounded-md px-3 py-1.5 z-50 shadow-lg animate-fade-in`}
        >
          {content}
          <div className={`absolute w-0 h-0 border-4 border-transparent ${arrowClasses[position]}`}></div>
        </div>,
        document.body
      )}
    </>
  );
};

export default SimpleTooltip;