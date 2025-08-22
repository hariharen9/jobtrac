import React, { useState } from 'react';
import { Briefcase, BookOpen, Building, Users, Star, HelpCircle } from 'lucide-react';
import { TabType, Application, PrepEntry, NetworkingContact, StarStory, EditableItem, ApplicationStatus } from './types';
import { useAuth } from './features/auth/hooks/useAuth';
import AuthButton from './features/auth/components/AuthButton';
import { useTheme } from './hooks/shared/useTheme';
import { useFirestore } from './hooks/useFirestore';
import ApplicationTracker from './features/applications/components/ApplicationTracker';
import ApplicationForm from './features/applications/components/ApplicationForm';
import ActivityCalendar from './features/applications/components/ActivityCalendar';
import KanbanBoard from './features/applications/components/KanbanBoard';
import PrepLog from './features/prepLog/components/PrepLog';
import PrepForm from './features/prepLog/components/PrepForm';
import CompanyResearch from './features/companyResearch/components/CompanyResearch';
import CompanyForm from './features/companyResearch/components/CompanyForm';
import Networking from './features/networking/components/Networking';
import NetworkingForm from './features/networking/components/NetworkingForm';
import StarStories from './features/starStories/components/StarStories';
import StarForm from './features/starStories/components/StarForm';
import Modal from './components/shared/Modal';
import ThemeToggle from './components/shared/ThemeToggle';
import HelpPage from './components/shared/HelpPage';
import Notes from './features/notes/components/Notes';
import './animations.css';



function App() {
  const { user, loading: authLoading } = useAuth();
  useTheme();
  
  const [activeTab, setActiveTab] = useState<TabType>('applications');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [modalType, setModalType] = useState<TabType>('applications');
  const [editingItem, setEditingItem] = useState<EditableItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  } = useFirestore<CompanyResearch>('companies', user?.uid);
  
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


  const tabs = [
    { id: 'applications', label: 'Application Tracker', icon: Briefcase },
    { id: 'prep', label: 'Prep Log', icon: BookOpen },
    { id: 'research', label: 'Company Research', icon: Building },
    { id: 'networking', label: 'Networking & Referrals', icon: Users },
    { id: 'star', label: 'Behavioral Story Bank', icon: Star },
  ];

  const openModal = (type: TabType, itemToEdit: EditableItem | null = null) => {
    setModalType(type);
    setEditingItem(itemToEdit);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleFormSubmit = async <T,>(
    handler: (data: T) => Promise<void>,
    data: T
  ) => {
    try {
      setIsSubmitting(true);
      await handler(data);
      closeModal();
    } catch (error) {
      console.error(`Failed to submit ${modalType}:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleUpdate = async <T extends { id: string }>(
    updater: (id: string, data: Partial<T>) => Promise<void>,
    item: T
  ) => {
    const { id, ...data } = item;
    await handleFormSubmit(() => updater(id, data), data);
  };

  const handleApplicationStatusUpdate = async (id: string, newStatus: ApplicationStatus) => {
    try {
      await updateApplication(id, { status: newStatus });
      console.log(`Updated application ${id} status to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update application status:', error);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'applications':
        return (
          <ApplicationTracker 
            applications={applications} 
            onAddApplication={() => openModal('applications')} 
            onEditApplication={(item) => openModal('applications', item)}
            onDeleteApplication={deleteApplication}
            loading={applicationsLoading}
          />
        );
      case 'prep':
        return (
          <PrepLog 
            prepEntries={prepEntries} 
            onAddPrepEntry={() => openModal('prep')} 
            onEditPrepEntry={(item) => openModal('prep', item)}
            onDeletePrepEntry={deletePrepEntry}
            loading={prepLoading}
          />
        );
      case 'research':
        return (
          <CompanyResearch 
            companies={companies} 
            onAddCompany={() => openModal('research')} 
            onEditCompany={(item) => openModal('research', item)}
            onDeleteCompany={deleteCompany}
            loading={companiesLoading}
          />
        );
      case 'networking':
        return (
          <Networking 
            contacts={contacts} 
            onAddContact={() => openModal('networking')} 
            onEditContact={(item) => openModal('networking', item)}
            onDeleteContact={deleteContact}
            loading={contactsLoading}
          />
        );
      case 'star':
        return (
          <StarStories 
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
              ? (data: Partial<CompanyResearch>) => handleUpdate(updateCompany, { ...editingItem, ...data })
              : (data: Omit<CompanyResearch, 'id'>) => handleFormSubmit(addCompany, data)
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
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="w-16 h-16 border-4 border-indigo-600 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div className="w-full max-w-md mx-4">
          <div className="p-8 text-center bg-white rounded-lg shadow-lg dark:bg-slate-800">
            <div className="mb-6">
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-indigo-600" />
              <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                Job Search Tracker
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Sign in to start tracking your job search journey
              </p>
            </div>
            <AuthButton />
            <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-center gap-4">
                <ThemeToggle />
                <button
                  onClick={() => setIsHelpOpen(true)}
                  className="flex items-center gap-2 text-sm transition-colors text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                >
                  <HelpCircle className="w-4 h-4" />
                  How it works
                </button>
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="container p-4 mx-auto sm:p-6 lg:p-8">
        <header className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <h1 className="text-xl font-bold leading-tight sm:text-2xl md:text-3xl animated-gradient-text">
                JobTrac - Your Job Switch Command Center
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 sm:text-base">
                A comprehensive dashboard to manage preparation, applications, and interviews.
              </p>
            </div>
            <div className="flex items-center flex-shrink-0 gap-2 sm:gap-3">
              <button
                onClick={() => setIsHelpOpen(true)}
                className="flex items-center gap-1 px-2 py-2 text-xs font-medium transition-colors bg-white border rounded-md sm:gap-2 sm:px-3 sm:text-sm text-slate-700 dark:text-slate-300 dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Help</span>
              </button>
              <ThemeToggle />
              <AuthButton />
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="mb-4 border-b sm:mb-6 border-slate-200 dark:border-slate-700">
          <nav className="flex pb-px -mb-px space-x-2 overflow-x-auto sm:space-x-6 scrollbar-hide" aria-label="Tabs">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`whitespace-nowrap py-3 sm:py-4 px-2 sm:px-3 text-xs sm:text-sm font-medium border-b-2 transition-colors flex items-center gap-1 sm:gap-2 flex-shrink-0 ${
                    isActive
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <Icon className="flex-shrink-0 w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <main>{renderTabContent()}</main>

        {/* Activity Calendar */}
        <div className="mt-8">
          <ActivityCalendar 
            applications={applications}
            prepEntries={prepEntries}
            companies={companies}
            contacts={contacts}
            stories={stories}
          />
        </div>

        {/* Kanban Board */}
        <div className="mt-8">
          <KanbanBoard
            applications={applications}
            onAddApplication={() => openModal('applications')}
            onEditApplication={(item) => openModal('applications', item)}
            onDeleteApplication={deleteApplication}
            onUpdateStatus={handleApplicationStatusUpdate}
            loading={applicationsLoading}
          />
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
          <div className="text-center text-sm text-slate-600 dark:text-slate-400">
            Built with 💖 by{' '}
            <a 
              href="https://hariharen9.site/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
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

        {/* Help Modal */}
        <Modal
          isOpen={isHelpOpen}
          onClose={() => setIsHelpOpen(false)}
          title="Help & Guide"
          size="xl"
        >
          <HelpPage onClose={() => setIsHelpOpen(false)} />
        </Modal>
      </div>
      
      {/* Notes Component */}
      <Notes userId={user?.uid} />
    </div>
  );
}

export default App;