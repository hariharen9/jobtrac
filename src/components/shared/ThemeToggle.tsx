import React from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../../hooks/shared/useTheme';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const renderIcon = () => {
    if (theme === 'light') return <Sun className="w-4 h-4" />;
    if (theme === 'dark') return <Moon className="w-4 h-4" />;
    return <Sparkles className="w-4 h-4" />;
  };

  const getAriaLabel = () => {
    if (theme === 'light') return 'Switch to dark mode';
    if (theme === 'dark') return 'Switch to amoled mode';
    return 'Switch to light mode';
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-10 h-10 rounded-md border border-slate-300 dark:border-dark-border amoled:border-amoled-border bg-white dark:bg-dark-card amoled:bg-amoled-card text-slate-700 dark:text-dark-text amoled:text-amoled-text hover:bg-slate-50 dark:hover:bg-dark-card amoled:hover:bg-amoled-card transition-colors"
      aria-label={getAriaLabel()}
    >
      {renderIcon()}
    </button>
  );
};

export default ThemeToggle;