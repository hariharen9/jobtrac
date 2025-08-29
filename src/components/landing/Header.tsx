
import { Briefcase, Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../hooks/shared/useTheme';

const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-sm dark:bg-dark-bg/80 amoled:bg-amoled-bg/80 border-b border-slate-200 dark:border-dark-border amoled:border-amoled-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-indigo-600" />
            <span className="text-xl font-bold text-slate-900 dark:text-dark-text amoled:text-amoled-text">
              JobTrac
            </span>
          </Link>
          <nav className="flex items-center gap-4">
            <a href="#features" className="hidden sm:block text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-dark-text-secondary dark:hover:text-indigo-400 amoled:text-amoled-text-secondary amoled:hover:text-indigo-400 transition-colors">
              Features
            </a>
            <Link to="/auth" className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-dark-text-secondary dark:hover:text-indigo-400 amoled:text-amoled-text-secondary amoled:hover:text-indigo-400 transition-colors">
              Sign In
            </Link>
            <Link
              to="/auth"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
            >
              Sign Up
            </Link>
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-dark-card">
              {theme === 'dark' || theme === 'amoled' ? <Sun className="w-5 h-5 text-slate-500" /> : <Moon className="w-5 h-5 text-slate-500" />}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
