import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/shared/useTheme';

const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-10 h-10 rounded-md border border-slate-300 dark:border-dark-border bg-white dark:bg-dark-card text-slate-700 dark:text-dark-text hover:bg-slate-50 dark:hover:bg-dark-card transition-colors"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
};

export default ThemeToggle;