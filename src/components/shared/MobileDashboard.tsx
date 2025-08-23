import React from 'react';
import { Briefcase, BookOpen, Building, Users, Star, HelpCircle } from 'lucide-react';
import { TabType } from '../../types';
import ThemeToggle from './ThemeToggle';
import AuthButton from '../../features/auth/components/AuthButton';

interface MobileDashboardProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  renderTabContent: () => React.ReactNode;
  openHelpModal: () => void;
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



const MobileDashboard: React.FC<MobileDashboardProps> = ({ activeTab, setActiveTab, renderTabContent, openHelpModal, activityCalendar, kanbanBoard }) => {
  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900">
      <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-indigo-600" />
          <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">JobTrac</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openHelpModal}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          <ThemeToggle />
          <AuthButton />
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 pb-20">
        {renderTabContent()}
        <div className="mt-8">
          {activityCalendar}
        </div>
        <div className="mt-8">
          {kanbanBoard}
        </div>
      </main>
      <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
        <nav className="flex justify-around">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex flex-col items-center justify-center w-full pt-2 pb-1 text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </footer>
    </div>
  );
};

export default MobileDashboard;
