import React from 'react';

const MobileFooter: React.FC = () => {
  return (
    <div className="mt-8 pt-6 border-t border-slate-200 dark:border-dark-border amoled:border-amoled-border">
      <div className="text-center">
        <p className="text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary text-sm">
          Made with ❤️  by{' '}
          <a 
            href="https://hariharen.site/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-indigo-600 dark:text-indigo-400 amoled:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 amoled:hover:text-indigo-300 font-medium transition-colors"
          >
            Hariharen
          </a>
        </p>
      </div>
    </div>
  );
};

export default MobileFooter;