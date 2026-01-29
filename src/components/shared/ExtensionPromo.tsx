import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chrome, X, Zap } from 'lucide-react';
import { useMediaQuery } from '../../hooks/shared/useMediaQuery';

const ExtensionPromo = () => {
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const EXTENSION_URL = "https://chromewebstore.google.com/detail/jobtrac-job-application-i/nipmnhedccgblgibeiikbcphcofgjfba";
  const STORAGE_KEY = 'jobtrac_extension_promo_dismissed';

  useEffect(() => {
    // Check if previously dismissed
    const dismissed = localStorage.getItem(STORAGE_KEY);

    // Show after a small delay if not dismissed and not on mobile (extensions usually desktop)
    if (!dismissed && !isMobile) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isMobile]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  if (isMobile) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: -50 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed bottom-6 left-6 z-40 max-w-sm"
        >
          <a
            href={EXTENSION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block group relative bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-xl shadow-2xl border border-indigo-100 dark:border-indigo-900/50 amoled:border-indigo-900/50 overflow-hidden hover:-translate-y-1 transition-transform duration-300"
          >
            {/* Gradient border effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-dark-bg transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-4 flex gap-4 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 amoled:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Chrome className="w-6 h-6" />
              </div>

              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-slate-900 dark:text-dark-text amoled:text-amoled-text text-sm">
                    New! Browser Extension
                  </h3>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    FREE
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-3 leading-relaxed">
                  Import jobs from LinkedIn & Indeed with one click. No more copy-pasting!
                </p>

                <div className="flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:underline">
                  <Zap className="w-3 h-3 mr-1" />
                  Add to Chrome
                </div>
              </div>
            </div>

            {/* Shine effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shine pointer-events-none" />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExtensionPromo;
