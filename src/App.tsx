import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, BookOpen, Building, Users, Star, HelpCircle, User as UserIcon, Target, Search } from 'lucide-react';
import { TabType, Application, PrepEntry, NetworkingContact, StarStory, EditableItem, ApplicationStatus } from './types';
import { useAuth } from './features/auth/hooks/useAuth';
import AuthButton from './features/auth/components/AuthButton';
import { useTheme } from './hooks/shared/useTheme';
import { useFirestore } from './hooks/useFirestore';
import { useOnboarding } from './hooks/useOnboarding';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import ApplicationTracker from './features/applications/components/ApplicationTracker';
import ApplicationForm from './features/applications/components/ApplicationForm';
import ActivityCalendar from './features/applications/components/ActivityCalendar';
import KanbanBoard from './features/applications/components/KanbanBoard';
import PrepLog from './features/prepLog/components/PrepLog';
import PrepForm from './features/prepLog/components/PrepForm';
import CompanyResearch from './features/companyResearch/components/CompanyResearch';
import CompanyForm from './features/companyResearch/components/CompanyForm';
import { CompanyResearch as CompanyResearchType } from './types';
import Networking from './features/networking/components/Networking';
import NetworkingForm from './features/networking/components/NetworkingForm';
import StarStories from './features/starStories/components/StarStories';
import StarForm from './features/starStories/components/StarForm';
import Modal from './components/shared/Modal';
import ThemeToggle from './components/shared/ThemeToggle';
import HelpPage from './components/shared/HelpPage';
import CommandPalette from './components/shared/CommandPalette';
import { WelcomeWizard, QuickStartChecklist, TooltipManager } from './components/shared';
import Notes from './features/notes/components/Notes';
import { useNotes } from './features/notes/hooks/useNotes';
import './animations.css';
import { useMediaQuery } from './hooks/shared/useMediaQuery';
import MobileDashboard from './components/shared/MobileDashboard';
import { ProfileModal } from './features/profile';
import UserProfileModal from './features/auth/components/UserProfileModal';

const MemoizedApplicationTracker = React.memo(ApplicationTracker);
const MemoizedPrepLog = React.memo(PrepLog);
const MemoizedCompanyResearch = React.memo(CompanyResearch);
const MemoizedNetworking = React.memo(Networking);
const MemoizedStarStories = React.memo(StarStories);
const MemoizedActivityCalendar = React.memo(ActivityCalendar);
const MemoizedKanbanBoard = React.memo(KanbanBoard);
const MemoizedNotes = React.memo(Notes);

import JobDescriptionModal from './features/applications/components/JobDescriptionModal';
import { Toaster, toast } from 'react-hot-toast';

import './features/auth/components/SignInBackground.css';

function App() {
  const { user, loading: authLoading, needsProfileSetup, saveUserProfile, skipProfileSetup } = useAuth();
  useTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // User profile setup modal state
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  
  // Onboarding state
  const {
    onboarding,
    loading: onboardingLoading,
    needsOnboarding,
    completeWelcome,
    completeQuickStartTask,
    enableDemoMode,
    markTooltipsAsSeen,
    resetOnboarding,
    getProgressPercentage
  } = useOnboarding(user?.uid);
  
  const [activeTab, setActiveTab] = useState<TabType>('applications');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  const [modalType, setModalType] = useState<TabType>('applications');
  const [editingItem, setEditingItem] = useState<EditableItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isJdModalOpen, setIsJdModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  
  // Onboarding UI state
  const [showWelcomeWizard, setShowWelcomeWizard] = useState(false);
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [showTooltipTour, setShowTooltipTour] = useState(false);
  // Track whether Quick Start has been shown to prevent infinite loops
  const hasShownQuickStartRef = React.useRef(false);

  const openProfileModal = () => setProfileModalOpen(true);
  
  // Theme and notes toggle functions
  const { toggleTheme } = useTheme();
  const toggleNotes = () => setIsNotesExpanded(prev => !prev);
  
  // Initialize keyboard shortcuts
  useKeyboardShortcuts({
    setActiveTab,
    openCommandPalette: () => setIsCommandPaletteOpen(true),
    openHelp: () => setIsHelpOpen(true),
    openProfile: openProfileModal,
    toggleTheme,
    toggleNotes,
    isModalOpen: isModalOpen || isJdModalOpen || isHelpOpen || isProfileModalOpen,
    isCommandPaletteOpen
  });


  const { 
    data: applications, 
    loading: applicationsLoading, 
    addItem: addApplication,
    updateItem: updateApplication,
    deleteItem: deleteApplication
  } = useFirestore<Application>('applications', user?.uid);
  
  const { 
    data: prepEntries, 
    loading: prepLoading,
    addItem: addPrepEntry,
    updateItem: updatePrepEntry,
    deleteItem: deletePrepEntry
  } = useFirestore<PrepEntry>('prepEntries', user?.uid);
  
  const { 
    data: companies, 
    loading: companiesLoading,
    addItem: addCompany,
    updateItem: updateCompany,
    deleteItem: deleteCompany
  } = useFirestore<CompanyResearchType>('companies', user?.uid);
  
  const { 
    data: contacts, 
    loading: contactsLoading,
    addItem: addContact,
    updateItem: updateContact,
    deleteItem: deleteContact
  } = useFirestore<NetworkingContact>('contacts', user?.uid);
  
  const { 
    data: stories, 
    loading: storiesLoading,
    addItem: addStory,
    updateItem: updateStory,
    deleteItem: deleteStory
  } = useFirestore<StarStory>('stories', user?.uid);

  // Notes data for global search
  const { notes } = useNotes(user?.uid);


  const tabs = useMemo(() => [
    { id: 'applications', label: 'Application Tracker', icon: Briefcase },
    { id: 'prep', label: 'Prep Log', icon: BookOpen },
    { id: 'research', label: 'Company Research', icon: Building },
    { id: 'networking', label: 'Networking & Referrals', icon: Users },
    { id: 'star', label: 'Behavioral Story Bank', icon: Star },
  ], []);

  const openModal = useCallback((type: TabType, itemToEdit: EditableItem | null = null) => {
    setModalType(type);
    setEditingItem(itemToEdit);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingItem(null);
  }, []);

  // Auto-complete Quick Start tasks based on user actions
  const autoCompleteQuickStartTask = useCallback(async () => {
    if (!onboarding.hasCompletedWelcome) return;
    
    const taskMap: Record<TabType, string> = {
      'applications': 'add-first-application',
      'prep': 'add-prep-session', 
      'star': 'create-star-story',
      'research': 'add-company-research',
      'networking': 'add-networking-contact'
    };
    
    const taskId = taskMap[modalType];
    if (taskId) {
      const task = onboarding.quickStartTasks.find(t => t.id === taskId);
      if (task && !task.completed) {
        await completeQuickStartTask(taskId);
      }
    }
  }, [modalType, onboarding, completeQuickStartTask]);
  
  // Auto-complete goal setting task when profile modal is closed after editing
  const handleProfileModalClose = useCallback(async () => {
    setProfileModalOpen(false);
    
    // Check if user has set goals and auto-complete the task
    const goalTask = onboarding.quickStartTasks.find(t => t.id === 'set-weekly-goal');
    if (goalTask && !goalTask.completed && onboarding.hasCompletedWelcome) {
      await completeQuickStartTask('set-weekly-goal');
    }
  }, [onboarding, completeQuickStartTask]);

  const handleFormSubmit = useCallback(async <T,>(
    handler: (data: T) => Promise<void>,
    data: T
  ) => {
    try {
      setIsSubmitting(true);
      await handler(data);
      closeModal();
      
      // Auto-complete Quick Start tasks based on the action performed
      await autoCompleteQuickStartTask();
    } catch (error) {
      console.error(`Failed to submit ${modalType}:`, error);
    } finally {
      setIsSubmitting(false);
    }
  }, [closeModal, modalType]);
  
  const handleUpdate = useCallback(async <T extends { id: string }>(
    updater: (id: string, data: Partial<T>) => Promise<void>,
    item: T
  ) => {
    const { id, ...data } = item;
    await handleFormSubmit(() => updater(id, data), data);
  }, [handleFormSubmit]);

  const handleApplicationStatusUpdate = useCallback(async (id: string, newStatus: ApplicationStatus) => {
    try {
      await updateApplication(id, { status: newStatus });
      toast.success(`Application status updated to ${newStatus}!`);
    } catch (error) {
      console.error('Failed to update application status:', error);
      toast.error('Failed to update application status.');
    }
  }, [updateApplication]);

  const handleViewJD = (application: Application) => {
    setSelectedApplication(application);
    setIsJdModalOpen(true);
  };

  const handleSaveJD = async (applicationId: string, jobDescription: string) => {
    try {
      await updateApplication(applicationId, { jobDescription });
      setIsJdModalOpen(false);
      toast.success('Job description saved successfully!');
    } catch (error) {
      console.error('Failed to save job description:', error);
      toast.error('Failed to save job description.');
    }
  };

  // Onboarding handlers
  const handleWelcomeComplete = async () => {
    try {
      await completeWelcome();
      setShowWelcomeWizard(false);
      // Mark as completed persistently
      if (user?.uid) {
        localStorage.setItem(`welcome-completed-${user.uid}`, 'true');
      }
      setShowQuickStart(true);
    } catch (error) {
      console.error('Failed to complete welcome:', error);
      setShowWelcomeWizard(false);
    }
  };

  const handleWelcomeClose = () => {
    setShowWelcomeWizard(false);
    // Set persistent flag to prevent reopening
    if (user?.uid) {
      localStorage.setItem(`welcome-completed-${user.uid}`, 'true');
    }
  };

  const handleEnableDemoMode = async () => {
    await enableDemoMode();
  };

  const handleQuickStartTaskClick = (taskId: string, feature: TabType) => {
    setActiveTab(feature);
    setShowQuickStart(false);
    
    // Open appropriate modal based on task
    switch (taskId) {
      case 'add-first-application':
        openModal('applications');
        break;
      case 'add-prep-session':
        openModal('prep');
        break;
      case 'create-star-story':
        openModal('star');
        break;
      case 'add-company-research':
        openModal('research');
        break;
      case 'add-networking-contact':
        openModal('networking');
        break;
      case 'set-weekly-goal':
        openProfileModal();
        break;
    }
  };

  const handleQuickStartComplete = async (taskId: string) => {
    await completeQuickStartTask(taskId);
  };

  const handleStartTooltipTour = () => {
    setShowQuickStart(false);
    setShowTooltipTour(true);
  };

  const handleTooltipTourComplete = async () => {
    await markTooltipsAsSeen();
    setShowTooltipTour(false);
  };

  const handleRestartTour = useCallback(async () => {
    if (!user?.uid) return;
    
    try {
      // Clear localStorage flag
      localStorage.removeItem(`welcome-completed-${user.uid}`);
      
      // Reset onboarding state in Firebase
      await resetOnboarding();
      
      // Reset UI state
      setShowWelcomeWizard(false);
      setShowQuickStart(false);
      setShowTooltipTour(false);
      
      // Close profile modal
      setProfileModalOpen(false);
      
      // Show welcome wizard after a short delay
      setTimeout(() => {
        setShowWelcomeWizard(true);
      }, 500);
      
      toast.success('Welcome tour restarted!');
    } catch (error) {
      console.error('Failed to restart tour:', error);
      toast.error('Failed to restart tour');
    }
  }, [user, resetOnboarding]);

  // Handle user profile setup
  const handleProfileComplete = async (profileData: Omit<import('./types').UserProfile, 'profileCompleted' | 'profileCompletedAt'>) => {
    setIsSubmittingProfile(true);
    try {
      await saveUserProfile(profileData);
      setIsUserProfileModalOpen(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const handleProfileSkip = () => {
    skipProfileSetup();
    setIsUserProfileModalOpen(false);
  };

  // Show profile modal when user needs profile setup
  React.useEffect(() => {
    if (needsProfileSetup && user && !user.isAnonymous) {
      setIsUserProfileModalOpen(true);
    } else {
      setIsUserProfileModalOpen(false);
    }
  }, [needsProfileSetup, user]);

  // Show welcome wizard for new users (only if never completed and profile is done)
  React.useEffect(() => {
    if (!user?.uid || onboardingLoading || needsProfileSetup) return;
    
    const persistentKey = `welcome-completed-${user.uid}`;
    const hasCompletedBefore = localStorage.getItem(persistentKey);
    
    // Debug logging for mobile
    console.log('🔍 Onboarding Debug:', {
      isMobile,
      needsOnboarding,
      hasCompletedBefore,
      userUid: user.uid,
      needsProfileSetup
    });
    
    // Only show if user has never completed welcome AND Firebase confirms needsOnboarding
    if (needsOnboarding && !hasCompletedBefore) {
      console.log('🎉 Showing Welcome Wizard');
      setShowWelcomeWizard(true);
    }
  }, [onboardingLoading, needsOnboarding, user, isMobile, needsProfileSetup]);

  // Reset onboarding UI state when user changes
  React.useEffect(() => {
    if (!user) {
      hasShownQuickStartRef.current = false;
      setShowWelcomeWizard(false);
      setShowQuickStart(false);
      setShowTooltipTour(false);
    }
  }, [user]);

  // Show quick start checklist when appropriate
  React.useEffect(() => {
    if (!onboardingLoading && onboarding.hasCompletedWelcome && !onboarding.hasSeenTooltips && !hasShownQuickStartRef.current) {
      const incompleteTasks = onboarding.quickStartTasks.filter(task => !task.completed);
      
      console.log('🎯 QuickStart Debug:', {
        isMobile,
        hasCompletedWelcome: onboarding.hasCompletedWelcome,
        hasSeenTooltips: onboarding.hasSeenTooltips,
        incompleteTasks: incompleteTasks.length,
        showWelcomeWizard
      });
      
      if (incompleteTasks.length > 0 && !showWelcomeWizard) {
        console.log('🎆 Showing Quick Start Checklist');
        hasShownQuickStartRef.current = true;
        setTimeout(() => setShowQuickStart(true), 1000);
      }
    }
  }, [onboardingLoading, onboarding, showWelcomeWizard, isMobile]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'applications':
        return (
          <MemoizedApplicationTracker 
            applications={applications} 
            onAddApplication={() => openModal('applications')} 
            onEditApplication={(item) => openModal('applications', item)}
            onDeleteApplication={deleteApplication}
            onViewJD={handleViewJD}
            loading={applicationsLoading}
          />
        );
      case 'prep':
        return (
          <MemoizedPrepLog 
            prepEntries={prepEntries} 
            onAddPrepEntry={() => openModal('prep')} 
            onEditPrepEntry={(item) => openModal('prep', item)}
            onDeletePrepEntry={deletePrepEntry}
            loading={prepLoading}
          />
        );
      case 'research':
        return (
          <MemoizedCompanyResearch 
            companies={companies} 
            onAddCompany={() => openModal('research')} 
            onEditCompany={(item) => openModal('research', item)}
            onDeleteCompany={deleteCompany}
            loading={companiesLoading}
          />
        );
      case 'networking':
        return (
          <MemoizedNetworking 
            contacts={contacts} 
            onAddContact={() => openModal('networking')} 
            onEditContact={(item) => openModal('networking', item)}
            onDeleteContact={deleteContact}
            loading={contactsLoading}
          />
        );
      case 'star':
        return (
          <MemoizedStarStories 
            stories={stories} 
            onAddStory={() => openModal('star')} 
            onEditStory={(item) => openModal('star', item)}
            onDeleteStory={deleteStory}
            loading={storiesLoading}
          />
        );
      default:
        return null;
    }
  };

  const renderModalContent = () => {
    const handleSubmit = editingItem 
      ? (data: Partial<Application>) => handleUpdate(updateApplication, { ...editingItem, ...data })
      : (data: Omit<Application, 'id'>) => handleFormSubmit(addApplication, data);

    switch (modalType) {
      case 'applications':
        return (
          <ApplicationForm
            onSubmit={handleSubmit}
            onCancel={closeModal}
            initialData={editingItem}
            loading={isSubmitting}
          />
        );
      case 'prep':
        return (
          <PrepForm
            onSubmit={editingItem 
              ? (data: Partial<PrepEntry>) => handleUpdate(updatePrepEntry, { ...editingItem, ...data })
              : (data: Omit<PrepEntry, 'id'>) => handleFormSubmit(addPrepEntry, data)
            }
            onCancel={closeModal}
            initialData={editingItem}
            loading={isSubmitting}
          />
        );
      case 'research':
        return (
          <CompanyForm
            onSubmit={editingItem
              ? (data: Partial<CompanyResearchType>) => handleUpdate(updateCompany, { ...editingItem, ...data })
              : (data: Omit<CompanyResearchType, 'id'>) => handleFormSubmit(addCompany, data)
            }
            onCancel={closeModal}
            initialData={editingItem}
            loading={isSubmitting}
          />
        );
      case 'networking':
        return (
          <NetworkingForm
            onSubmit={editingItem
              ? (data: Partial<NetworkingContact>) => handleUpdate(updateContact, { ...editingItem, ...data })
              : (data: Omit<NetworkingContact, 'id'>) => handleFormSubmit(addContact, data)
            }
            onCancel={closeModal}
            initialData={editingItem}
            loading={isSubmitting}
          />
        );
      case 'star':
        return (
          <StarForm
            onSubmit={editingItem
              ? (data: Partial<StarStory>) => handleUpdate(updateStory, { ...editingItem, ...data })
              : (data: Omit<StarStory, 'id'>) => handleFormSubmit(addStory, data)
            }
            onCancel={closeModal}
            initialData={editingItem}
            loading={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-dark-bg amoled:bg-amoled-bg">
        <div className="w-16 h-16 border-4 border-indigo-600 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative login-background min-h-screen bg-slate-50 dark:bg-dark-bg amoled:bg-amoled-bg">
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          <div className="w-full max-w-xs mx-auto" style={{ maxHeight: '85vh', maxWidth: '500px', minWidth: '280px' }}>
            <div className="p-6 text-center bg-white/80 backdrop-blur-sm rounded-xl shadow-xl dark:bg-dark-card/80 amoled:bg-amoled-card/80 border border-gray-200/50 dark:border-dark-border/50 amoled:border-amoled-border/50">
              <div className="mb-4">
                <Briefcase className="w-12 h-12 mx-auto mb-3 text-indigo-600" />
                <h1 className="mb-2 text-xl font-bold text-slate-900 dark:text-dark-text amoled:text-amoled-text">
                  JobTrac
                </h1>
                <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                  Sign in to start tracking your job search journey
                </p>
              </div>
              <AuthButton />
              <div className="pt-4 mt-4 border-t border-slate-200 dark:border-dark-border amoled:border-amoled-border">
                <div className="flex items-center justify-center gap-4">
                  <ThemeToggle />
                  <button
                    onClick={() => setIsHelpOpen(true)}
                    className="flex items-center gap-2 text-xs transition-colors text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary hover:text-slate-900 dark:hover:text-dark-text amoled:hover:text-amoled-text"
                  >
                    <HelpCircle className="w-4 h-4" />
                    How it works
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Help Modal for Login Page */}
        <Modal
          isOpen={isHelpOpen}
          onClose={() => setIsHelpOpen(false)}
          title="Help & Guide"
          size="xl"
        >
          <HelpPage onClose={() => setIsHelpOpen(false)} />
        </Modal>
      </div>
    );
  }

  if (isMobile) {
    return (
      <>
        <MobileDashboard 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          renderTabContent={renderTabContent}
          openHelpModal={() => setIsHelpOpen(true)}
          openProfileModal={openProfileModal}
          openCommandPalette={() => setIsCommandPaletteOpen(true)}
          onShowQuickStart={() => setShowQuickStart(true)}
          showQuickStartButton={onboarding.hasCompletedWelcome && getProgressPercentage() < 100}
          activityCalendar={<MemoizedActivityCalendar 
            applications={applications}
            prepEntries={prepEntries}
            companies={companies}
            contacts={contacts}
            stories={stories}
          />}
          kanbanBoard={<MemoizedKanbanBoard
            applications={applications}
            onAddApplication={() => openModal('applications')}
            onEditApplication={(item) => openModal('applications', item)}
            onDeleteApplication={deleteApplication}
            onUpdateStatus={handleApplicationStatusUpdate}
            loading={applicationsLoading}
          />}
        />
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={`${editingItem ? 'Edit' : 'Add'} ${modalType.charAt(0).toUpperCase() + modalType.slice(1)}`}
          size={modalType === 'star' ? 'lg' : 'md'}
        >
          {renderModalContent()}
        </Modal>
        <Modal
          isOpen={isProfileModalOpen}
          onClose={handleProfileModalClose}
          title="Profile"
          size="lg"
        >
          <ProfileModal 
            applications={applications} 
            contacts={contacts} 
            prepEntries={prepEntries}
            stories={stories}
            companies={companies}
            onRestartTour={handleRestartTour}
            quickStartProgress={getProgressPercentage()}
          />
        </Modal>
        <Modal
          isOpen={isHelpOpen}
          onClose={() => setIsHelpOpen(false)}
          title="Help & Guide"
          size="xl"
        >
          <HelpPage onClose={() => setIsHelpOpen(false)} />
        </Modal>

        <JobDescriptionModal
          isOpen={isJdModalOpen}
          onClose={() => setIsJdModalOpen(false)}
          application={selectedApplication}
          onSave={handleSaveJD}
        />

        {/* Onboarding Components */}
        {showWelcomeWizard && (
          <WelcomeWizard
            onComplete={handleWelcomeComplete}
            onEnableDemoMode={handleEnableDemoMode}
            onClose={handleWelcomeClose}
          />
        )}
        
        <QuickStartChecklist
          tasks={onboarding.quickStartTasks}
          onTaskClick={handleQuickStartTaskClick}
          onComplete={handleQuickStartComplete}
          onClose={() => setShowQuickStart(false)}
          isOpen={showQuickStart}
          progressPercentage={getProgressPercentage()}
          demoMode={onboarding.demoMode}
        />
        
        <TooltipManager
          activeTab={activeTab}
          isActive={showTooltipTour}
          onComplete={handleTooltipTourComplete}
          onSkip={handleTooltipTourComplete}
        />
        
        {/* Command Palette */}
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          applications={applications}
          prepEntries={prepEntries}
          companies={companies}
          contacts={contacts}
          stories={stories}
          notes={notes}
          onOpenModal={openModal}
          onOpenHelp={() => setIsHelpOpen(true)}
          onOpenProfile={openProfileModal}
          onToggleTheme={toggleTheme}
          onToggleNotes={toggleNotes}
        />
      </>
    )
  }

  return (
    <div className="min-h-screen dark:bg-dark-bg amoled:bg-amoled-bg" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Toaster />
      <div className="container p-4 mx-auto sm:p-6 lg:p-8">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <h1 className="text-xl font-bold leading-tight sm:text-2xl md:text-3xl animated-gradient-text flex flex-wrap items-center gap-2">
                <div className="flex items-center justify-center flex-shrink-0">
                  <img 
                    src="/assets/jtrac-black-cropped.png" 
                    alt="JobTrac Logo" 
                    className="h-6 sm:h-8 md:h-10 w-auto object-contain dark:hidden amoled:hidden"
                  />
                  <img 
                    src="/assets/jtrac-white-cropped.png" 
                    alt="JobTrac Logo" 
                    className="h-6 sm:h-8 md:h-10 w-auto object-contain hidden dark:block amoled:block"
                  />
                </div>
                <span className="flex-shrink-0" style={{ fontFamily: 'Montserrat, sans-serif' }}>- Your Job Switch Command Center</span>
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary sm:text-base">
                A comprehensive dashboard to manage preparation, applications, and interviews.
              </p>
            </div>
            <div className="flex items-center flex-shrink-0 gap-2 sm:gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCommandPaletteOpen(true)}
                className="flex items-center gap-1 px-2 py-2 text-xs font-medium transition-colors bg-white border rounded-md sm:gap-2 sm:px-3 sm:text-sm text-slate-700 dark:text-dark-text amoled:text-amoled-text dark:bg-dark-card amoled:bg-amoled-card border-slate-300 dark:border-dark-border amoled:border-amoled-border hover:bg-slate-50 dark:hover:bg-dark-card amoled:hover:bg-amoled-card"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Command</span>
                <kbd className="hidden sm:inline text-xs px-1 py-0.5 bg-gray-100 dark:bg-gray-700 amoled:bg-gray-700 rounded">⌘K</kbd>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsHelpOpen(true)}
                className="flex items-center gap-1 px-2 py-2 text-xs font-medium transition-colors bg-white border rounded-md sm:gap-2 sm:px-3 sm:text-sm text-slate-700 dark:text-dark-text amoled:text-amoled-text dark:bg-dark-card amoled:bg-amoled-card border-slate-300 dark:border-dark-border amoled:border-amoled-border hover:bg-slate-50 dark:hover:bg-dark-card amoled:hover:bg-amoled-card"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Help</span>
              </motion.button>
              
              {/* Quick Start Button */}
              {onboarding.hasCompletedWelcome && getProgressPercentage() < 100 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowQuickStart(true)}
                  className="flex items-center gap-1 px-2 py-2 text-xs font-medium transition-colors bg-blue-50 border border-blue-200 rounded-md sm:gap-2 sm:px-3 sm:text-sm text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                >
                  <Target className="w-4 h-4" />
                  <span className="hidden sm:inline">Quick Start</span>
                </motion.button>
              )}
              
              <ThemeToggle />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openProfileModal} 
                className="p-2 transition-colors bg-white border rounded-full hover:bg-slate-100 dark:bg-dark-card amoled:bg-amoled-card dark:border-dark-border amoled:border-amoled-border dark:hover:bg-dark-card amoled:hover:bg-amoled-card"
              >
                <UserIcon className="w-6 h-6 text-slate-700 dark:text-dark-text amoled:text-amoled-text" />
              </motion.button>
              <AuthButton />
            </div>
          </div>
        </motion.header>

        {/* Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="mb-4 border-b sm:mb-6 border-slate-200 dark:border-dark-border amoled:border-amoled-border"
        >
          <nav className="flex pb-px -mb-px space-x-2 overflow-x-auto sm:space-x-6 scrollbar-hide" aria-label="Tabs">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`relative whitespace-nowrap py-3 sm:py-4 px-2 sm:px-3 text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 sm:gap-2 flex-shrink-0 ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400 amoled:text-indigo-400 font-semibold'
                      : 'text-slate-500 dark:text-dark-text-secondary amoled:text-amoled-text-secondary hover:text-slate-700 dark:hover:text-dark-text amoled:hover:text-amoled-text'
                  }`}
                  whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="flex-shrink-0 w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                      layoutId="underline"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>
        </motion.div>

        {/* Content */}
        <main>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Activity Calendar */}
        <div className="mt-8">
          <MemoizedActivityCalendar 
            applications={applications}
            prepEntries={prepEntries}
            companies={companies}
            contacts={contacts}
            stories={stories}
          />
        </div>

        {/* Kanban Board */}
        <div className="mt-8" data-tooltip="kanban-board">
          <MemoizedKanbanBoard
            applications={applications}
            onAddApplication={() => openModal('applications')}
            onEditApplication={(item) => openModal('applications', item)}
            onDeleteApplication={deleteApplication}
            onUpdateStatus={handleApplicationStatusUpdate}
            loading={applicationsLoading}
          />
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-slate-200 dark:border-dark-border amoled:border-amoled-border">
          <div className="text-center text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
            Built with 💖 by{' '}
            <a 
              href="https://hariharen9.site/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 amoled:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 amoled:hover:text-indigo-300 font-medium transition-colors"
            >
              Hariharen
            </a>
          </div>
        </footer>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={`${editingItem ? 'Edit' : 'Add'} ${modalType.charAt(0).toUpperCase() + modalType.slice(1)}`}
          size={modalType === 'star' ? 'lg' : 'md'}
        >
          {renderModalContent()}
        </Modal>

        {/* Profile Modal */}
        <Modal
          isOpen={isProfileModalOpen}
          onClose={handleProfileModalClose}
          title="Profile"
          size="lg"
        >
          <ProfileModal 
            applications={applications} 
            contacts={contacts} 
            prepEntries={prepEntries}
            stories={stories}
            companies={companies}
            onRestartTour={handleRestartTour}
            quickStartProgress={getProgressPercentage()}
          />
        </Modal>

        {/* Help Modal */}
        <Modal
          isOpen={isHelpOpen}
          onClose={() => setIsHelpOpen(false)}
          title="Help & Guide"
          size="xl"
        >
          <HelpPage onClose={() => setIsHelpOpen(false)} />
        </Modal>

        <JobDescriptionModal
          isOpen={isJdModalOpen}
          onClose={() => setIsJdModalOpen(false)}
          application={selectedApplication}
          onSave={handleSaveJD}
        />
      </div>
      
      {/* Notes Component */}
      <MemoizedNotes userId={user?.uid} isExpanded={isNotesExpanded} onToggle={toggleNotes} />
      
      {/* Onboarding Components */}
      {showWelcomeWizard && (
        <WelcomeWizard
          onComplete={handleWelcomeComplete}
          onEnableDemoMode={handleEnableDemoMode}
          onClose={handleWelcomeClose}
        />
      )}
      
      <QuickStartChecklist
        tasks={onboarding.quickStartTasks}
        onTaskClick={handleQuickStartTaskClick}
        onComplete={handleQuickStartComplete}
        onClose={() => setShowQuickStart(false)}
        isOpen={showQuickStart}
        progressPercentage={getProgressPercentage()}
        demoMode={onboarding.demoMode}
      />
      
      <TooltipManager
        activeTab={activeTab}
        isActive={showTooltipTour}
        onComplete={handleTooltipTourComplete}
        onSkip={handleTooltipTourComplete}
      />
      
      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        applications={applications}
        prepEntries={prepEntries}
        companies={companies}
        contacts={contacts}
        stories={stories}
        notes={notes}
        onOpenModal={openModal}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenProfile={openProfileModal}
        onToggleTheme={toggleTheme}
        onToggleNotes={toggleNotes}
      />

      {/* User Profile Setup Modal */}
      <UserProfileModal
        isOpen={isUserProfileModalOpen}
        onComplete={handleProfileComplete}
        onSkip={handleProfileSkip}
        isSubmitting={isSubmittingProfile}
      />
    </div>
  );
}

export default App;
