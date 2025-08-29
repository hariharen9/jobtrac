
const Footer = () => {
  return (
    <footer className="bg-slate-50 dark:bg-dark-bg amoled:bg-amoled-bg border-t border-slate-200 dark:border-dark-border amoled:border-amoled-border">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
          <p>&copy; {new Date().getFullYear()} JobTrac. All rights reserved.</p>
          <p className="mt-1">
            Built with 💖 by{' '}
            <a 
              href="https://hariharen9.site/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 amoled:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 amoled:hover:text-indigo-300 font-medium transition-colors"
            >
              Hariharen
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
