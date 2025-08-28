import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

interface TooltipProps {
  isVisible: boolean;
  title: string;
  content: string;
  targetSelector: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
  onNext?: () => void;
  onPrevious?: () => void;
  onSkip?: () => void;
  onComplete?: () => void;
  currentStep?: number;
  totalSteps?: number;
  showNavigation?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({
  isVisible,
  title,
  content,
  targetSelector,
  placement,
  onNext,
  onPrevious,
  onSkip,
  onComplete,
  currentStep = 1,
  totalSteps = 1,
  showNavigation = false
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible) return;

    const updatePosition = () => {
      const element = document.querySelector(targetSelector) as HTMLElement;
      if (!element || !tooltipRef.current) return;

      setTargetElement(element);
      const elementRect = element.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const margin = 12;

      let x = 0;
      let y = 0;

      switch (placement) {
        case 'top':
          x = elementRect.left + (elementRect.width / 2) - (tooltipRect.width / 2);
          y = elementRect.top - tooltipRect.height - margin;
          break;
        case 'bottom':
          x = elementRect.left + (elementRect.width / 2) - (tooltipRect.width / 2);
          y = elementRect.bottom + margin;
          break;
        case 'left':
          x = elementRect.left - tooltipRect.width - margin;
          y = elementRect.top + (elementRect.height / 2) - (tooltipRect.height / 2);
          break;
        case 'right':
          x = elementRect.right + margin;
          y = elementRect.top + (elementRect.height / 2) - (tooltipRect.height / 2);
          break;
      }

      // Keep tooltip within viewport
      const padding = 16;
      x = Math.max(padding, Math.min(x, window.innerWidth - tooltipRect.width - padding));
      y = Math.max(padding, Math.min(y, window.innerHeight - tooltipRect.height - padding));

      setPosition({ x, y });
    };

    // Initial position calculation
    setTimeout(updatePosition, 50);
    
    // Update position on scroll and resize
    const handleUpdate = () => {
      updatePosition();
    };

    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);
    
    return () => {
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [isVisible, targetSelector, placement]);

  // Highlight target element
  useEffect(() => {
    if (!isVisible || !targetElement) return;

    const originalStyle = {
      position: targetElement.style.position,
      zIndex: targetElement.style.zIndex,
      boxShadow: targetElement.style.boxShadow,
      borderRadius: targetElement.style.borderRadius,
    };

    // Add highlight styles
    targetElement.style.position = 'relative';
    targetElement.style.zIndex = '30';
    targetElement.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.3), 0 0 20px rgba(59, 130, 246, 0.2)';
    targetElement.style.borderRadius = '8px';

    return () => {
      // Restore original styles
      Object.entries(originalStyle).forEach(([key, value]) => {
        if (value) {
          (targetElement.style as any)[key] = value;
        } else {
          (targetElement.style as any).removeProperty(key);
        }
      });
    };
  }, [isVisible, targetElement]);

  if (!isVisible) return null;

  const getArrowStyles = () => {
    const arrowSize = 8;
    switch (placement) {
      case 'top':
        return {
          bottom: -arrowSize,
          left: '50%',
          transform: 'translateX(-50%)',
          borderLeft: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid transparent`,
          borderTop: `${arrowSize}px solid rgba(17, 24, 39, 0.95)`,
        };
      case 'bottom':
        return {
          top: -arrowSize,
          left: '50%',
          transform: 'translateX(-50%)',
          borderLeft: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid transparent`,
          borderBottom: `${arrowSize}px solid rgba(17, 24, 39, 0.95)`,
        };
      case 'left':
        return {
          right: -arrowSize,
          top: '50%',
          transform: 'translateY(-50%)',
          borderTop: `${arrowSize}px solid transparent`,
          borderBottom: `${arrowSize}px solid transparent`,
          borderLeft: `${arrowSize}px solid rgba(17, 24, 39, 0.95)`,
        };
      case 'right':
        return {
          left: -arrowSize,
          top: '50%',
          transform: 'translateY(-50%)',
          borderTop: `${arrowSize}px solid transparent`,
          borderBottom: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid rgba(17, 24, 39, 0.95)`,
        };
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-20" />
      
      {/* Tooltip */}
      <AnimatePresence>
        <motion.div
          ref={tooltipRef}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="fixed z-40 bg-gray-900 text-white rounded-xl shadow-2xl border border-gray-700 max-w-sm"
          style={{
            left: position.x,
            top: position.y,
          }}
        >
          {/* Arrow */}
          <div
            className="absolute"
            style={getArrowStyles()}
          />
          
          {/* Content */}
          <div className="p-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                {showNavigation && (
                  <div className="text-xs text-gray-400 mb-1">
                    Step {currentStep} of {totalSteps}
                  </div>
                )}
                <h3 className="font-semibold text-sm">{title}</h3>
              </div>
              <button
                onClick={onSkip || onComplete}
                className="text-gray-400 hover:text-white ml-2 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Content */}
            <p className="text-sm text-gray-300 mb-4 leading-relaxed">
              {content}
            </p>
            
            {/* Navigation */}
            {showNavigation ? (
              <div className="flex items-center justify-between">
                <div className="flex space-x-1">
                  {Array.from({ length: totalSteps }).map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index < currentStep
                          ? 'bg-blue-400'
                          : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
                
                <div className="flex items-center space-x-2">
                  {onPrevious && currentStep > 1 && (
                    <button
                      onClick={onPrevious}
                      className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-300 hover:text-white transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                  )}
                  
                  {onNext && currentStep < totalSteps ? (
                    <button
                      onClick={onNext}
                      className="flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={onComplete}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Got it!
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-end space-x-2">
                {onSkip && (
                  <button
                    onClick={onSkip}
                    className="px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Skip
                  </button>
                )}
                <button
                  onClick={onComplete}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Got it!
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default Tooltip;