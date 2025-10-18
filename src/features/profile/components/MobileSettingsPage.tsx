import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  BarChart3, 
  Target, 
  Database, 
  MessageCircle, 
  Trash2,
  ArrowLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { Application, NetworkingContact, PrepEntry, StarStory, CompanyResearch } from '../../../types';
import AccountSection from './settings/AccountSection';
import AnalyticsSection from './settings/AnalyticsSection';
import GoalsSection from './settings/GoalsSection';
import DataSection from './settings/DataSection';
import SupportSection from './settings/SupportSection';
import DangerZoneSection from './settings/DangerZoneSection';

interface MobileSettingsPageProps {
  isOpen: boolean;
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

const MobileSettingsPage: React.FC<MobileSettingsPageProps> = ({
  isOpen,
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
  const [activeSection, setActiveSection] = useState<SettingsSection | null>(null);

  // Reset to main menu when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveSection(null);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeSection) {
          setActiveSection(null);
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, activeSection, onClose]);

  if (!isOpen) return null;

  const sections = [
    { 
      id: 'account' as const, 
      label: 'Account', 
      icon: User,
      description: 'Manage your profile and authentication',
      color: 'bg-blue-500'
    },
    { 
      id: 'analytics' as const, 
      label: 'Analytics', 
      icon: BarChart3,
      description: 'View your job search statistics',
      color: 'bg-purple-500'
    },
    { 
      id: 'goals' as const, 
      label: 'Goals', 
      icon: Target,
      description: 'Set and track your targets',
      color: 'bg-green-500'
    },
    { 
      id: 'data' as const, 
      label: 'Data', 
      icon: Database,
      description: 'Import, export, and manage data',
      color: 'bg-orange-500'
    },
    { 
      id: 'support' as const, 
      label: 'Support', 
      icon: MessageCircle,
      description: 'Get help and contact support',
      color: 'bg-pink-500'
    },
    { 
      id: 'danger' as const, 
      label: 'Danger Zone', 
      icon: Trash2,
      description: 'Delete account and data',
      color: 'bg-red-500'
    }
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

  const getSectionTitle = () => {
    const section = sections.find(s => s.id === activeSection);
    return section?.label || 'Settings';
  };

  const modalContent = () => {
    // Main menu view
    if (!activeSection) {
      return (
        <div className="flex flex-col h-full bg-white dark:bg-dark-bg amoled:bg-amoled-bg">
        {/* Header */}
        <div className="px-4 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="text-center">
              <img 
                src="/assets/jtrac-white-cropped.png" 
                alt="JobTrac Logo" 
                className="h-8 w-auto object-contain mx-auto"
              />
            </div>
            <div className="w-9" /> {/* Spacer for centering */}
          </div>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-1">Settings</h1>
            <p className="text-indigo-100 text-sm">Customize your JobTrac experience</p>
          </div>
        </div>

        {/* Settings Menu */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {sections.map((section, index) => {
              const Icon = section.icon;
              
              return (
                <motion.button
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onClick={() => setActiveSection(section.id)}
                  className="w-full p-4 rounded-2xl bg-white dark:bg-dark-card amoled:bg-amoled-card border border-slate-200 dark:border-dark-border amoled:border-amoled-border shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${section.color} shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-1">
                        {section.label}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                        {section.description}
                      </p>
                    </div>
                    
                    <ChevronRight className="w-5 h-5 text-slate-400 dark:text-dark-text-secondary amoled:text-amoled-text-secondary" />
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Quick Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 amoled:from-slate-900 amoled:to-black border border-slate-200 dark:border-dark-border amoled:border-amoled-border"
          >
            <h3 className="font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-3">
              Quick Overview
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 rounded-xl bg-white dark:bg-dark-card amoled:bg-amoled-card shadow-sm">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {applications.length}
                </div>
                <div className="text-xs text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                  Applications
                </div>
              </div>
              <div className="text-center p-3 rounded-xl bg-white dark:bg-dark-card amoled:bg-amoled-card shadow-sm">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {contacts.length}
                </div>
                <div className="text-xs text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                  Contacts
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="text-center p-3 rounded-xl bg-white dark:bg-dark-card amoled:bg-amoled-card shadow-sm">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {stories.length}
                </div>
                <div className="text-xs text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                  Stories
                </div>
              </div>
              <div className="text-center p-3 rounded-xl bg-white dark:bg-dark-card amoled:bg-amoled-card shadow-sm">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {companies.length}
                </div>
                <div className="text-xs text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                  Companies
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      );
    }

    // Section detail view
    return (
      <div className="flex flex-col h-full bg-white dark:bg-dark-bg amoled:bg-amoled-bg">
      {/* Section Header */}
      <div className="px-4 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-b border-indigo-700">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveSection(null)}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex-1">
            <h2 className="text-lg font-semibold">{getSectionTitle()}</h2>
          </div>
        </div>
      </div>

      {/* Section Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="p-4 pb-8"
            style={{ 
              // Ensure content is accessible on mobile with safe areas
              paddingBottom: 'max(2rem, env(safe-area-inset-bottom))'
            }}
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={activeSection ? () => setActiveSection(null) : onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-4 md:inset-8 bg-white dark:bg-dark-bg amoled:bg-amoled-bg rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Close button - only show on main menu */}
            {!activeSection && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            )}
            
            {modalContent()}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSettingsPage;