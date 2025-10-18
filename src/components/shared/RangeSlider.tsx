import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { animated, useSpring } from '@react-spring/web';

interface RangeSliderProps {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  currency?: 'USD' | 'INR' | 'EUR' | 'GBP';
  denomination?: 'K' | 'L';
}

const RangeSlider: React.FC<RangeSliderProps> = ({ 
  min, 
  max, 
  step, 
  value, 
  onChange, 
  currency = 'USD', 
  denomination = 'K' 
}) => {
  const [minVal, setMinVal] = useState(value[0]);
  const [maxVal, setMaxVal] = useState(value[1]);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Spring animations for smooth interactions
  const trackSpring = useSpring({
    background: isDragging 
      ? 'linear-gradient(90deg, rgb(99 102 241), rgb(168 85 247))' 
      : 'linear-gradient(90deg, rgb(99 102 241), rgb(139 92 246))',
    height: isHovered ? '8px' : '6px',
    config: { tension: 300, friction: 30 }
  });

  const valueSpring = useSpring({
    minVal,
    maxVal,
    config: { tension: 300, friction: 30 }
  });

  // Get currency symbol
  const getCurrencySymbol = (curr: string) => {
    switch (curr) {
      case 'USD': return '$';
      case 'INR': return '₹';
      case 'EUR': return '€';
      case 'GBP': return '£';
      default: return '$';
    }
  };

  const currencySymbol = getCurrencySymbol(currency);

  // Format display value with "+" for max values
  const formatDisplayValue = (val: number, isMax: boolean) => {
    if (isMax && val === max && currency === 'INR' && denomination === 'L' && max === 50) {
      return `${currencySymbol}${val}${denomination}+`;
    }
    return `${currencySymbol}${val}${denomination}`;
  };

  // Convert value to percentage
  const getPercent = useCallback(
    (val: number) => ((val - min) / (max - min)) * 100,
    [min, max]
  );

  // Update range bar style
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxVal);

    if (sliderRef.current) {
      const rangeElement = sliderRef.current.querySelector('.range-fill') as HTMLDivElement;
      if (rangeElement) {
        rangeElement.style.left = `${minPercent}%`;
        rangeElement.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [minVal, maxVal, getPercent]);

  // Call onChange when values change
  useEffect(() => {
    onChange([minVal, maxVal]);
  }, [minVal, maxVal, onChange]);

  const calculateValueFromMouseEvent = useCallback((e: MouseEvent | TouchEvent, sliderRect: DOMRect) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const newPixelPos = clientX - sliderRect.left;
    const newPercent = Math.max(0, Math.min(100, (newPixelPos / sliderRect.width) * 100));
    const newValue = Math.round(((newPercent / 100) * (max - min) + min) / step) * step;
    return newValue;
  }, [min, max, step]);

  const handleThumbMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent, isMinThumb: boolean) => {
    e.preventDefault();
    const sliderRect = sliderRef.current?.getBoundingClientRect();
    if (!sliderRect) return;

    const onMouseMove = (moveEvent: MouseEvent | TouchEvent) => {
      let newValue = calculateValueFromMouseEvent(moveEvent, sliderRect);

      if (isMinThumb) {
        newValue = Math.min(newValue, maxVal - step);
        newValue = Math.max(newValue, min);
        setMinVal(newValue);
      } else {
        newValue = Math.max(newValue, minVal + step);
        newValue = Math.min(newValue, max);
        setMaxVal(newValue);
      }
    };

    const onMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchmove', onMouseMove);
      document.removeEventListener('touchend', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchmove', onMouseMove);
    document.addEventListener('touchend', onMouseUp);
  }, [min, max, step, minVal, maxVal, calculateValueFromMouseEvent]);

  return (
    <motion.div 
      className="relative pt-8 pb-4 w-full"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        ref={sliderRef}
        className="relative h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden"
      >
        {/* Animated background track */}
        <animated.div 
          style={trackSpring}
          className="range-fill absolute rounded-full"
        />

        {/* Min thumb */}
        <motion.div
          className="absolute w-6 h-6 -mt-2 -ml-3 bg-white rounded-full shadow-lg border-2 border-indigo-500 cursor-pointer touch-none z-10"
          style={{ left: `${getPercent(minVal)}%` }}
          onMouseDown={(e) => {
            setIsDragging(true);
            handleThumbMouseDown(e, true);
          }}
          onTouchStart={(e) => {
            setIsDragging(true);
            handleThumbMouseDown(e, true);
          }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 1.1 }}
          animate={{
            boxShadow: isDragging 
              ? '0 0 0 8px rgba(99, 102, 241, 0.2), 0 4px 12px rgba(0, 0, 0, 0.15)'
              : '0 0 0 0px rgba(99, 102, 241, 0), 0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 text-xs font-medium whitespace-nowrap rounded-md"
            initial={{ opacity: 0, scale: 0.8, y: 5 }}
            animate={{ 
              opacity: isHovered || isDragging ? 1 : 0, 
              scale: isHovered || isDragging ? 1 : 0.8,
              y: isHovered || isDragging ? 0 : 5
            }}
            transition={{ duration: 0.2 }}
          >
            {formatDisplayValue(minVal, false)}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-slate-800 dark:border-t-slate-200" />
          </motion.div>
        </motion.div>

        {/* Max thumb */}
        <motion.div
          className="absolute w-6 h-6 -mt-2 -ml-3 bg-white rounded-full shadow-lg border-2 border-indigo-500 cursor-pointer touch-none z-10"
          style={{ left: `${getPercent(maxVal)}%` }}
          onMouseDown={(e) => {
            setIsDragging(true);
            handleThumbMouseDown(e, false);
          }}
          onTouchStart={(e) => {
            setIsDragging(true);
            handleThumbMouseDown(e, false);
          }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 1.1 }}
          animate={{
            boxShadow: isDragging 
              ? '0 0 0 8px rgba(99, 102, 241, 0.2), 0 4px 12px rgba(0, 0, 0, 0.15)'
              : '0 0 0 0px rgba(99, 102, 241, 0), 0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 text-xs font-medium whitespace-nowrap rounded-md"
            initial={{ opacity: 0, scale: 0.8, y: 5 }}
            animate={{ 
              opacity: isHovered || isDragging ? 1 : 0, 
              scale: isHovered || isDragging ? 1 : 0.8,
              y: isHovered || isDragging ? 0 : 5
            }}
            transition={{ duration: 0.2 }}
          >
            {formatDisplayValue(maxVal, true)}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-slate-800 dark:border-t-slate-200" />
          </motion.div>
        </motion.div>

        {/* Range indicator with pulse effect */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
          style={{
            left: `${getPercent(minVal)}%`,
            width: `${getPercent(maxVal) - getPercent(minVal)}%`
          }}
          animate={{
            boxShadow: isDragging 
              ? '0 0 10px rgba(99, 102, 241, 0.5)'
              : '0 0 0px rgba(99, 102, 241, 0)'
          }}
          transition={{ duration: 0.2 }}
        />
      </div>
    </motion.div>
  );
};

export default RangeSlider;
