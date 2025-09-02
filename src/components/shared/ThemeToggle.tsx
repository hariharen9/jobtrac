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
    <div className="relative">
      <button
        onClick={toggleTheme}
        className="group relative flex items-center justify-center w-10 h-10 rounded-md border border-slate-300 dark:border-dark-border amoled:border-amoled-border bg-white dark:bg-dark-card amoled:bg-amoled-card text-slate-700 dark:text-dark-text amoled:text-amoled-text hover:bg-white dark:hover:bg-dark-card amoled:hover:bg-amoled-card transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] hover:-translate-y-0.5"
        aria-label={getAriaLabel()}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-red-500/10 to-green-500/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-400/20 via-red-400/20 to-green-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
        {renderIcon()}
      </button>
    </div>
  );
};

export default ThemeToggle;