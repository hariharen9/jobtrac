import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  BarChart3, 
  Target, 
  Database, 
  MessageCircle, 
  Trash2,
  ChevronRight
} from 'lucide-react';
import { Application, NetworkingContact, PrepEntry, StarStory, CompanyResearch } from '../../../types';
import AccountSection from './settings/AccountSection';
import AnalyticsSection from './settings/AnalyticsSection';
import GoalsSection from './settings/GoalsSection';
import DataSection from './settings/DataSection';
import SupportSection from './settings/SupportSection';
import DangerZoneSection from './settings/DangerZoneSection';

interface SettingsPageProps {
  applications: Application[];
  contacts: NetworkingContact[];
  prepEntries: PrepEntry[];
  stories: StarStory[];
  companies: CompanyResearch[];
  onRestartTour?: () => void;
  quickStartProgress?: number;
  onOpenHelp?: () => void;
  onClose: () => void;
}

type SettingsSection = 'account' | 'analytics' | 'goals' | 'data' | 'support' | 'danger';

const SettingsPage: React.FC<SettingsPageProps> = ({
  applications,
  contacts,
  prepEntries,
  stories,
  companies,
  onRestartTour,
  quickStartProgress,
  onOpenHelp,
  onClose
}) => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('account');

  const sections = [
    { id: 'account' as const, label: 'Account', icon: User },
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
    { id: 'goals' as const, label: 'Goals', icon: Target },
    { id: 'data' as const, label: 'Data', icon: Database },
    { id: 'support' as const, label: 'Support', icon: MessageCircle },
    { id: 'danger' as const, label: 'Danger Zone', icon: Trash2 }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'account':
        return (
          <AccountSection 
            onRestartTour={onRestartTour}
            quickStartProgress={quickStartProgress}
            onOpenHelp={onOpenHelp}
          />
        );
      case 'analytics':
        return <AnalyticsSection applications={applications} />;
      case 'goals':
        return (
          <GoalsSection 
            applications={applications}
            contacts={contacts}
            prepEntries={prepEntries}
          />
        );
      case 'data':
        return (
          <DataSection
            applications={applications}
            prepEntries={prepEntries}
            stories={stories}
            companies={companies}
            contacts={contacts}
          />
        );
      case 'support':
        return <SupportSection />;
      case 'danger':
        return <DangerZoneSection />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[85vh] bg-white dark:bg-dark-bg amoled:bg-amoled-bg">
      {/* Header */}
      <div className="px-4 py-4 border-b border-slate-200 dark:border-dark-border amoled:border-amoled-border flex-shrink-0">
        <h2 className="text-xl font-bold text-slate-900 dark:text-dark-text amoled:text-amoled-text">
          Settings
        </h2>
      </div>

      {/* Mobile Tabs - Outside flex container */}
      <div className="md:hidden border-b border-slate-200 dark:border-dark-border amoled:border-amoled-border overflow-x-auto flex-shrink-0">
        <div className="flex p-2 space-x-2 min-w-max">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-dark-card amoled:bg-amoled-card text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{section.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Sidebar - Desktop Only */}
        <div className="hidden md:flex md:flex-col md:w-64 border-r border-slate-200 dark:border-dark-border amoled:border-amoled-border flex-shrink-0">
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 amoled:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 amoled:text-indigo-400 font-medium'
                      : 'text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary hover:bg-slate-50 dark:hover:bg-dark-card amoled:hover:bg-amoled-card'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1">{section.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="p-4 md:p-6 pb-8 md:pb-12"
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
