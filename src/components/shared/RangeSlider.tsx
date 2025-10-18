import React, { useState, useRef, useCallback, useEffect } from 'react';

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
  const sliderRef = useRef<HTMLDivElement>(null);

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
    <div className="relative pt-8 pb-4 w-full">
      <div
        ref={sliderRef}
        className="relative h-1 rounded-md bg-slate-200 dark:bg-slate-700"
      >
        <div className="range-fill absolute h-1 rounded-md bg-indigo-500" />

        <div
          className="absolute w-5 h-5 -mt-2 -ml-2 bg-white rounded-full shadow-md border-2 border-indigo-500 cursor-pointer touch-none"
          style={{ left: `${getPercent(minVal)}%` }}
          onMouseDown={(e) => handleThumbMouseDown(e, true)}
          onTouchStart={(e) => handleThumbMouseDown(e, true)}
        >
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap">
            {formatDisplayValue(minVal, false)}
          </div>
        </div>

        <div
          className="absolute w-5 h-5 -mt-2 -ml-2 bg-white rounded-full shadow-md border-2 border-indigo-500 cursor-pointer touch-none"
          style={{ left: `${getPercent(maxVal)}%` }}
          onMouseDown={(e) => handleThumbMouseDown(e, false)}
          onTouchStart={(e) => handleThumbMouseDown(e, false)}
        >
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap">
            {formatDisplayValue(maxVal, true)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RangeSlider;
