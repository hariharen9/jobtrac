import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, BookOpen, Building, Users, Star, HelpCircle, User as UserIcon } from 'lucide-react';
import { TabType } from '../../types';
import ThemeToggle from './ThemeToggle';
import AuthButton from '../../features/auth/components/AuthButton';

interface MobileDashboardProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  renderTabContent: () => React.ReactNode;
  openHelpModal: () => void;
  openProfileModal: () => void;
  activityCalendar: React.ReactNode;
  kanbanBoard: React.ReactNode;
}

const tabs = [
  { id: 'applications', label: 'Apps', icon: Briefcase },
  { id: 'prep', label: 'Prep', icon: BookOpen },
  { id: 'research', label: 'Research', icon: Building },
  { id: 'networking', label: 'Network', icon: Users },
  { id: 'star', label: 'STARs', icon: Star },
];

const MobileDashboard: React.FC<MobileDashboardProps> = ({ activeTab, setActiveTab, renderTabContent, openHelpModal, openProfileModal, activityCalendar, kanbanBoard }) => {
  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-dark-bg amoled:bg-amoled-bg">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-dark-border amoled:border-amoled-border"
      >
        <div className="flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-indigo-600" />
          <h1 className="text-lg font-bold text-slate-900 dark:text-dark-text amoled:text-amoled-text">JobTrac</h1>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={openHelpModal}
            className="p-2 text-slate-500 dark:text-dark-text-secondary amoled:text-amoled-text-secondary hover:text-slate-700 dark:hover:text-dark-text amoled:hover:text-amoled-text"
          >
            <HelpCircle className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={openProfileModal}
            className="p-2 text-slate-500 dark:text-dark-text-secondary amoled:text-amoled-text-secondary hover:text-slate-700 dark:hover:text-dark-text amoled:hover:text-amoled-text"
          >
            <UserIcon className="w-5 h-5" />
          </motion.button>
          <ThemeToggle />
          <AuthButton />
        </div>
      </motion.header>
      <main className="flex-1 overflow-y-auto p-4 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="mt-8">
            {activityCalendar}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="mt-8">
            {kanbanBoard}
          </div>
        </motion.div>
      </main>
      <motion.footer 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-card amoled:bg-amoled-card border-t border-slate-200 dark:border-dark-border amoled:border-amoled-border"
      >
        <nav className="flex justify-around">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`relative flex flex-col items-center justify-center w-full pt-2 pb-1 text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 amoled:text-indigo-400'
                    : 'text-slate-500 dark:text-dark-text-secondary amoled:text-amoled-text-secondary hover:text-slate-700 dark:hover:text-dark-text amoled:hover:text-amoled-text'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    className="absolute bottom-0 w-full h-0.5 bg-indigo-500"
                    layoutId="mobile-underline"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </nav>
      </motion.footer>
    </div>
  );
};

export default MobileDashboard;
