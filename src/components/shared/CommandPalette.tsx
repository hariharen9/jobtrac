import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Command, 
  Briefcase, 
  BookOpen, 
  Building, 
  Users, 
  Star,
  HelpCircle,
  User as UserIcon,
  Plus,
  Edit3,
  ArrowUp,
  ArrowDown,
  CornerDownLeft,
  Hash,
  Sun,
  StickyNote
} from 'lucide-react';
import { TabType, Application, PrepEntry, CompanyResearch, NetworkingContact, StarStory, EditableItem } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  applications: Application[];
  prepEntries: PrepEntry[];
  companies: CompanyResearch[];
  contacts: NetworkingContact[];
  stories: StarStory[];
  onOpenModal: (type: TabType, item?: EditableItem) => void;
  onOpenHelp: () => void;
  onOpenProfile: () => void;
  onToggleTheme: () => void;
  onToggleNotes: () => void;
}

interface Command {
  id: string;
  title: string;
  description: string;
  action: () => void;
  icon: React.ComponentType<{ className?: string }>;
  category: 'navigation' | 'actions' | 'items';
  shortcut?: string;
  keywords?: string[];
}

const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  applications,
  prepEntries,
  companies,
  contacts,
  stories,
  onOpenModal,
  onOpenHelp,
  onOpenProfile,
  onToggleTheme,
  onToggleNotes
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: Command[] = useMemo(() => [
    // Navigation Commands
    {
      id: 'nav-applications',
      title: 'Go to Applications',
      description: 'View and manage job applications',
      action: () => { setActiveTab('applications'); onClose(); },
      icon: Briefcase,
      category: 'navigation',
      shortcut: '⌘1',
      keywords: ['applications', 'jobs', 'tracker', 'kanban']
    },
    {
      id: 'nav-prep',
      title: 'Go to Prep Log',
      description: 'Track interview preparation sessions',
      action: () => { setActiveTab('prep'); onClose(); },
      icon: BookOpen,
      category: 'navigation',
      shortcut: '⌘2',
      keywords: ['prep', 'preparation', 'interview', 'study']
    },
    {
      id: 'nav-research',
      title: 'Go to Company Research',
      description: 'Manage company insights and research',
      action: () => { setActiveTab('research'); onClose(); },
      icon: Building,
      category: 'navigation',
      shortcut: '⌘3',
      keywords: ['research', 'company', 'insights', 'culture']
    },
    {
      id: 'nav-networking',
      title: 'Go to Networking',
      description: 'Track contacts and referrals',
      action: () => { setActiveTab('networking'); onClose(); },
      icon: Users,
      category: 'navigation',
      shortcut: '⌘4',
      keywords: ['networking', 'contacts', 'referrals', 'people']
    },
    {
      id: 'nav-star',
      title: 'Go to STAR Stories',
      description: 'Manage behavioral interview stories',
      action: () => { setActiveTab('star'); onClose(); },
      icon: Star,
      category: 'navigation',
      shortcut: '⌘5',
      keywords: ['star', 'stories', 'behavioral', 'interviews']
    },
    {
      id: 'nav-help',
      title: 'Open Help',
      description: 'View help and documentation',
      action: () => { onOpenHelp(); onClose(); },
      icon: HelpCircle,
      category: 'navigation',
      shortcut: '⌘H',
      keywords: ['help', 'documentation', 'guide', 'support']
    },
    {
      id: 'nav-profile',
      title: 'Open Profile',
      description: 'View profile and analytics',
      action: () => { onOpenProfile(); onClose(); },
      icon: UserIcon,
      category: 'navigation',
      shortcut: '⌘P',
      keywords: ['profile', 'analytics', 'settings', 'dashboard']
    },
    {
      id: 'toggle-theme',
      title: 'Toggle Theme',
      description: 'Switch between light, dark, and amoled themes',
      action: () => { onToggleTheme(); onClose(); },
      icon: Sun,
      category: 'navigation',
      shortcut: '⌘⌥T',
      keywords: ['theme', 'dark', 'light', 'amoled', 'appearance']
    },
    {
      id: 'toggle-notes',
      title: 'Toggle Notes',
      description: 'Show or hide the notes panel',
      action: () => { onToggleNotes(); onClose(); },
      icon: StickyNote,
      category: 'navigation',
      shortcut: '⌘⌥N',
      keywords: ['notes', 'toggle', 'show', 'hide', 'panel']
    },
    // Action Commands
    {
      id: 'add-application',
      title: 'Add New Application',
      description: 'Create a new job application',
      action: () => { onOpenModal('applications'); onClose(); },
      icon: Plus,
      category: 'actions',
      keywords: ['add', 'new', 'application', 'job']
    },
    {
      id: 'add-prep',
      title: 'Add Prep Session',
      description: 'Log a new preparation session',
      action: () => { onOpenModal('prep'); onClose(); },
      icon: Plus,
      category: 'actions',
      keywords: ['add', 'prep', 'session', 'study']
    },
    {
      id: 'add-company',
      title: 'Add Company Research',
      description: 'Create new company research entry',
      action: () => { onOpenModal('research'); onClose(); },
      icon: Plus,
      category: 'actions',
      keywords: ['add', 'company', 'research']
    },
    {
      id: 'add-contact',
      title: 'Add Contact',
      description: 'Add a new networking contact',
      action: () => { onOpenModal('networking'); onClose(); },
      icon: Plus,
      category: 'actions',
      keywords: ['add', 'contact', 'networking']
    },
    {
      id: 'add-story',
      title: 'Add STAR Story',
      description: 'Create a new behavioral story',
      action: () => { onOpenModal('star'); onClose(); },
      icon: Plus,
      category: 'actions',
      keywords: ['add', 'star', 'story', 'behavioral']
    }
  ], [setActiveTab, onClose, onOpenModal, onOpenHelp, onOpenProfile, onToggleTheme, onToggleNotes]);

  // Add item-specific commands based on current tab
  const itemCommands: Command[] = useMemo(() => {
    const items: Command[] = [];
    
    if (activeTab === 'applications' && applications.length > 0) {
      applications.slice(0, 5).forEach((app, index) => {
        items.push({
          id: `edit-app-${app.id}`,
          title: `Edit ${app.company} - ${app.role}`,
          description: `Edit application for ${app.role} at ${app.company}`,
          action: () => { onOpenModal('applications', app); onClose(); },
          icon: Edit3,
          category: 'items',
          keywords: [app.company.toLowerCase(), app.role.toLowerCase(), 'edit', 'application']
        });
      });
    }
    
    if (activeTab === 'prep' && prepEntries.length > 0) {
      prepEntries.slice(0, 5).forEach((prep, index) => {
        items.push({
          id: `edit-prep-${prep.id}`,
          title: `Edit ${prep.topic}`,
          description: `Edit prep session: ${prep.topic}`,
          action: () => { onOpenModal('prep', prep); onClose(); },
          icon: Edit3,
          category: 'items',
          keywords: [prep.topic.toLowerCase(), 'edit', 'prep']
        });
      });
    }
    
    if (activeTab === 'research' && companies.length > 0) {
      companies.slice(0, 5).forEach((company, index) => {
        items.push({
          id: `edit-company-${company.id}`,
          title: `Edit ${company.company}`,
          description: `Edit company research for ${company.company}`,
          action: () => { onOpenModal('research', company); onClose(); },
          icon: Edit3,
          category: 'items',
          keywords: [company.company.toLowerCase(), 'edit', 'company']
        });
      });
    }
    
    if (activeTab === 'networking' && contacts.length > 0) {
      contacts.slice(0, 5).forEach((contact, index) => {
        items.push({
          id: `edit-contact-${contact.id}`,
          title: `Edit ${contact.name}`,
          description: `Edit contact: ${contact.name} at ${contact.company}`,
          action: () => { onOpenModal('networking', contact); onClose(); },
          icon: Edit3,
          category: 'items',
          keywords: [contact.name.toLowerCase(), contact.company.toLowerCase(), 'edit', 'contact']
        });
      });
    }
    
    if (activeTab === 'star' && stories.length > 0) {
      stories.slice(0, 5).forEach((story, index) => {
        items.push({
          id: `edit-story-${story.id}`,
          title: `Edit ${story.title}`,
          description: `Edit STAR story: ${story.title}`,
          action: () => { onOpenModal('star', story); onClose(); },
          icon: Edit3,
          category: 'items',
          keywords: [story.title.toLowerCase(), 'edit', 'story', 'star']
        });
      });
    }
    
    return items;
  }, [activeTab, applications, prepEntries, companies, contacts, stories, onOpenModal, onClose]);

  const allCommands = useMemo(() => [...commands, ...itemCommands], [commands, itemCommands]);

  const filteredCommands = useMemo(() => {
    if (!searchTerm) return allCommands;
    
    return allCommands.filter(command => {
      const searchLower = searchTerm.toLowerCase();
      return (
        command.title.toLowerCase().includes(searchLower) ||
        command.description.toLowerCase().includes(searchLower) ||
        command.keywords?.some(keyword => keyword.includes(searchLower))
      );
    });
  }, [allCommands, searchTerm]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev === 0 ? filteredCommands.length - 1 : prev - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchTerm]);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.category]) acc[command.category] = [];
    acc[command.category].push(command);
    return acc;
  }, {} as Record<string, Command[]>);

  const categoryLabels = {
    navigation: 'Navigation',
    actions: 'Actions',
    items: 'Current Tab Items'
  };

  const categoryIcons = {
    navigation: Hash,
    actions: Plus,
    items: Edit3
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <div className="flex items-start justify-center min-h-screen pt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl mx-4 bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-2xl shadow-2xl border border-gray-200 dark:border-dark-border amoled:border-amoled-border overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center p-4 border-b border-gray-200 dark:border-dark-border amoled:border-amoled-border">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Type a command or search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent text-gray-900 dark:text-dark-text amoled:text-amoled-text placeholder-gray-500 dark:placeholder-dark-text-secondary amoled:placeholder-amoled-text-secondary outline-none"
                autoFocus
              />
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-dark-bg amoled:bg-amoled-bg rounded border">
                  <ArrowUp className="w-3 h-3" />
                </kbd>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-dark-bg amoled:bg-amoled-bg rounded border">
                  <ArrowDown className="w-3 h-3" />
                </kbd>
                <span>to navigate</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-dark-bg amoled:bg-amoled-bg rounded border flex items-center">
                  <CornerDownLeft className="w-3 h-3" />
                </kbd>
                <span>to select</span>
              </div>
            </div>

            {/* Commands */}
            <div className="max-h-96 overflow-y-auto">
              {filteredCommands.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No commands found</p>
                </div>
              ) : (
                <div className="p-2">
                  {Object.entries(groupedCommands).map(([category, categoryCommands]) => {
                    const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons];
                    return (
                      <div key={category} className="mb-4 last:mb-0">
                        <div className="flex items-center px-2 py-1 text-xs font-semibold text-gray-500 dark:text-dark-text-secondary amoled:text-amoled-text-secondary uppercase tracking-wider">
                          <CategoryIcon className="w-3 h-3 mr-2" />
                          {categoryLabels[category as keyof typeof categoryLabels]}
                        </div>
                        {categoryCommands.map((command, index) => {
                          const globalIndex = filteredCommands.findIndex(cmd => cmd.id === command.id);
                          const isSelected = globalIndex === selectedIndex;
                          const Icon = command.icon;
                          
                          return (
                            <motion.div
                              key={command.id}
                              className={`flex items-center justify-between px-3 py-3 mx-1 rounded-lg cursor-pointer transition-colors ${
                                isSelected
                                  ? 'bg-indigo-50 dark:bg-indigo-900/20 amoled:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 amoled:text-indigo-300'
                                  : 'text-gray-700 dark:text-dark-text amoled:text-amoled-text hover:bg-gray-50 dark:hover:bg-dark-bg/50 amoled:hover:bg-amoled-bg/50'
                              }`}
                              onClick={command.action}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <div className="flex items-center flex-1">
                                <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm">{command.title}</div>
                                  <div className="text-xs text-gray-500 dark:text-dark-text-secondary amoled:text-amoled-text-secondary truncate">
                                    {command.description}
                                  </div>
                                </div>
                              </div>
                              {command.shortcut && (
                                <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-dark-bg amoled:bg-amoled-bg rounded border flex-shrink-0 ml-2">
                                  {command.shortcut}
                                </kbd>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CommandPalette;