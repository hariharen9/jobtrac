import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github } from 'lucide-react';
import ThemeToggle from '../shared/ThemeToggle';

const Header = () => {
  return (
    <motion.nav
      className="relative z-50 flex items-center justify-between p-4 sm:p-6 backdrop-blur-md bg-white/70 dark:bg-dark-card/70 amoled:bg-amoled-card/70 border-b border-white/20 dark:border-dark-border/30 amoled:border-amoled-border/30"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="flex items-center flex-shrink-0"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative flex items-center justify-center">
          <img 
            src="/assets/jtrac-black-cropped.png" 
            alt="JobTrac Logo" 
            className="h-6 sm:h-10 w-auto object-contain dark:hidden amoled:hidden"
          />
          <img 
            src="/assets/jtrac-white-cropped.png" 
            alt="JobTrac Logo" 
            className="h-6 sm:h-10 w-auto object-contain hidden dark:block amoled:block"
          />
        </div>
      </motion.div>
      
      <div className="flex items-center space-x-1 sm:space-x-4">
        <div className="hidden sm:flex items-center space-x-6 mr-4">
          <button
            onClick={() => {
              document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-slate-700 dark:text-dark-text amoled:text-amoled-text hover:text-indigo-600 dark:hover:text-indigo-400 amoled:hover:text-indigo-400 transition-colors font-medium"
          >
            Features
          </button>
          <button
            onClick={() => {
              document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-slate-700 dark:text-dark-text amoled:text-amoled-text hover:text-indigo-600 dark:hover:text-indigo-400 amoled:hover:text-indigo-400 transition-colors font-medium"
          >
            Pricing
          </button>
        </div>
        <div className="flex items-center">
          <ThemeToggle />
        </div>
        <div
          className="relative group"
        >
          <motion.a
            href="https://github.com/hariharen9/jobtrac"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 sm:p-2 rounded-lg bg-white/50 dark:bg-dark-card/50 amoled:bg-amoled-card/50 backdrop-blur-sm border border-white/20 dark:border-dark-border/30 amoled:border-amoled-border/30 hover:bg-white/70 dark:hover:bg-dark-card/70 amoled:hover:bg-amoled-card/70 transition-all duration-300 flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <Github className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700 dark:text-dark-text amoled:text-amoled-text" />
          </motion.a>
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-md px-3 py-1.5 z-10 shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          >
            Star us on GitHub! ⭐
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-b-4 border-b-yellow-400 border-l-4 border-l-transparent border-r-4 border-r-transparent"></div>
          </div>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-shrink-0"
        >
          <Link
            to="/auth"
            className="px-4 py-2 sm:px-8 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm whitespace-nowrap"
          >
            <span className="sm:hidden">Start Now 🚀</span>
            <span className="hidden sm:inline">Launch JobTrac 🚀</span>
          </Link>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Header;