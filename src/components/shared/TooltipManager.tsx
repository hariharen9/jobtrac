import React, { useState, useEffect } from 'react';
import Tooltip from './Tooltip';
import { TooltipConfig, TabType } from '../../types';
import { tooltipConfigs } from '../../data/initialData';

interface TooltipManagerProps {
  activeTab: TabType;
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const TooltipManager: React.FC<TooltipManagerProps> = ({
  activeTab,
  isActive,
  onComplete,
  onSkip
}) => {
  const [currentTooltipIndex, setCurrentTooltipIndex] = useState(0);
  const [activeTooltips, setActiveTooltips] = useState<TooltipConfig[]>([]);

  // Filter tooltips for current tab and sort by priority
  useEffect(() => {
    const tabTooltips = tooltipConfigs
      .filter(tooltip => tooltip.feature === activeTab)
      .sort((a, b) => a.priority - b.priority);
    
    setActiveTooltips(tabTooltips);
    setCurrentTooltipIndex(0);
  }, [activeTab]);

  // Reset when tour becomes active
  useEffect(() => {
    if (isActive) {
      setCurrentTooltipIndex(0);
    }
  }, [isActive]);

  const currentTooltip = activeTooltips[currentTooltipIndex];
  const hasTooltips = activeTooltips.length > 0;
  const isVisible = isActive && hasTooltips && currentTooltip;

  const handleNext = () => {
    if (currentTooltipIndex < activeTooltips.length - 1) {
      setCurrentTooltipIndex(currentTooltipIndex + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentTooltipIndex > 0) {
      setCurrentTooltipIndex(currentTooltipIndex - 1);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  const handleComplete = () => {
    onComplete();
  };

  if (!isVisible) {
    return null;
  }

  // Check if target element exists before showing tooltip
  const targetExists = document.querySelector(currentTooltip.targetSelector);
  if (!targetExists) {
    // If target doesn't exist, skip to next tooltip
    setTimeout(() => {
      if (currentTooltipIndex < activeTooltips.length - 1) {
        setCurrentTooltipIndex(currentTooltipIndex + 1);
      } else {
        onComplete();
      }
    }, 100);
    return null;
  }

  return (
    <Tooltip
      isVisible={true}
      title={currentTooltip.title}
      content={currentTooltip.content}
      targetSelector={currentTooltip.targetSelector}
      placement={currentTooltip.placement}
      onNext={handleNext}
      onPrevious={handlePrevious}
      onSkip={handleSkip}
      onComplete={handleComplete}
      currentStep={currentTooltipIndex + 1}
      totalSteps={activeTooltips.length}
      showNavigation={activeTooltips.length > 1}
    />
  );
};

export default TooltipManager;