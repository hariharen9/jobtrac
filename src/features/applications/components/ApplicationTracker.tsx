import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Plus, Filter, SortAsc, SortDesc, X, ChevronDown, LayoutGrid, List, Trash2, Settings, HelpCircle, Archive, Sparkles, Chrome, ExternalLink } from 'lucide-react';
import { Application, ApplicationStatus, ApplicationSource } from '../../../types';
import ApplicationCard from './ApplicationCard';
import ApplicationRow from './ApplicationRow';
import EmptyState from '../../../components/shared/EmptyState';
import SimpleTooltip from '../../../components/shared/SimpleTooltip';
import { useMediaQuery } from '../../../hooks/shared/useMediaQuery';
import ConfirmationModal from '../../../components/shared/ConfirmationModal';
import SettingsModal, { ApplicationTrackerSettings } from './SettingsModal';

type SortField = 'date' | 'company' | 'role' | 'status' | 'source' | 'priority' | 'salaryRange' | 'interviewDate';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';

interface FilterOptions {
  status: ApplicationStatus[];
  source: ApplicationSource[];
  company: string;
  dateRange: {
    start: string;
    end: string;
  };
  priority: ('High' | 'Medium' | 'Low')[];
  referral: ('Y' | 'N')[];
}

interface ApplicationTrackerProps {
  applications: Application[];
  onAddApplication: () => void;
  onEditApplication: (application: Application) => void;
  onDeleteApplication: (id: string) => void;
  onViewJD: (application: Application) => void;
  onArchiveApplication?: (id: string) => void;
  onUnarchiveApplication?: (id: string) => void;
  loading?: boolean;
}

const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({ 
  applications, 
  onAddApplication, 
  onEditApplication,
  onDeleteApplication,
  onViewJD,
  onArchiveApplication,
  onUnarchiveApplication,
  loading = false 
}) => {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    status: [],
    source: [],
    company: '',
    dateRange: { start: '', end: '' },
    priority: [],
    referral: [],
  });
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isConfirmBulkDeleteOpen, setConfirmBulkDeleteOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [settings, setSettings] = useState<ApplicationTrackerSettings>(() => {
    const saved = localStorage.getItem('applicationTrackerSettings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse settings:', e);
      }
    }
    return {
      viewMode: 'comfy',
      showStats: false,
      currency: 'INR',
      salaryDenomination: 'L',
    };
  });

  // Save settings to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('applicationTrackerSettings', JSON.stringify(settings));
    // Dispatch custom event for same-window updates
    window.dispatchEvent(new Event('applicationSettingsChanged'));
  }, [settings]);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const statusOptions: ApplicationStatus[] = [
    'To Apply', 'Applied', 'HR Screen', 'Tech Screen', 'Round 1', 'Round 2',
    'Manager Round', 'Final Round', 'Offer', 'Rejected', 'Ghosted'
  ];

  const sourceOptions: ApplicationSource[] = [
    'LinkedIn', 'Indeed', 'Glassdoor', 'Naukri', 'Company Website', 'Referral', 'Other'
  ];

  const processedApplications = useMemo(() => {
    return [...applications]
      .filter(app => {
        // Show archived or active applications based on toggle
        if (showArchived && !app.archived) return false;
        if (!showArchived && app.archived) return false;
        
        if (filters.status.length > 0 && !filters.status.includes(app.status)) return false;
        if (filters.source.length > 0 && !filters.source.includes(app.source)) return false;
        if (filters.company && !app.company.toLowerCase().includes(filters.company.toLowerCase())) return false;
        if (filters.dateRange.start && new Date(app.date) < new Date(filters.dateRange.start)) return false;
        if (filters.dateRange.end && new Date(app.date) > new Date(filters.dateRange.end)) return false;
        if (filters.priority.length > 0 && !filters.priority.includes(app.priority!)) return false;
        if (filters.referral.length > 0 && !filters.referral.includes(app.referral)) return false;
        return true;
      })
      .sort((a, b) => {
        let aValue: any = a[sortField];
        let bValue: any = b[sortField];
        
        if (sortField === 'date' || sortField === 'interviewDate') {
          aValue = aValue ? new Date(aValue).getTime() : 0;
          bValue = bValue ? new Date(bValue).getTime() : 0;
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [applications, filters, sortField, sortDirection, showArchived]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleFilterChange = <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSelectionChange = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedItems(processedApplications.map(app => app.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleDeleteRequest = (id: string) => {
    setItemToDelete(id);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      onDeleteApplication(itemToDelete);
      setItemToDelete(null);
    }
  };

  const handleDeleteSelected = () => {
    selectedItems.forEach(id => onDeleteApplication(id));
    setSelectedItems([]);
    setConfirmBulkDeleteOpen(false);
  };

  const clearFilters = () => {
    setFilters({ status: [], source: [], company: '', dateRange: { start: '', end: '' }, priority: [], referral: [] });
  };

  const hasActiveFilters = filters.status.length > 0 || filters.source.length > 0 || filters.company || filters.dateRange.start || filters.dateRange.end || filters.priority.length > 0 || filters.referral.length > 0;

  const QuickStats = () => {
    const activeApplications = applications.filter(a => !a.archived);
    const total = activeApplications.length;
    const interviews = activeApplications.filter(a => ['HR Screen', 'Tech Screen', 'Round 1', 'Round 2', 'Manager Round', 'Final Round'].includes(a.status)).length;
    const offers = activeApplications.filter(a => a.status === 'Offer').length;
    const successRate = total > 0 ? ((offers / total) * 100).toFixed(1) : 0;

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30 p-4 rounded-xl text-center shadow-sm border border-indigo-100 dark:border-indigo-800/50 backdrop-blur-sm">
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{total}</p>
          <p className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">Total Apps</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 p-4 rounded-xl text-center shadow-sm border border-amber-100 dark:border-amber-800/50 backdrop-blur-sm">
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{interviews}</p>
          <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">Interviews</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 p-4 rounded-xl text-center shadow-sm border border-emerald-100 dark:border-emerald-800/50 backdrop-blur-sm">
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{offers}</p>
          <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">Offers</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-xl text-center shadow-sm border border-blue-100 dark:border-blue-800/50 backdrop-blur-sm">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{successRate}%</p>
          <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Success Rate</p>
        </div>
      </div>
    );
  };

  React.useEffect(() => {
    if (isMobile) {
      setViewMode('grid');
    } else if (settings.viewMode === 'compact') {
      setViewMode('list');
    }
  }, [isMobile, settings.viewMode]);

  if (loading) {
    return <div className="text-center py-12">Loading applications...</div>;
  }

  return (
    <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200 dark:border-dark-border amoled:border-amoled-border">
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-dark-text amoled:text-amoled-text">
          <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50">
            <Briefcase className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          {showArchived ? 'Archived Applications' : 'My Applications'}
          {showArchived && (
            <span className="ml-2 px-2 py-1 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full">
              {applications.filter(app => app.archived).length}
            </span>
          )}
          <SimpleTooltip content="Track job applications from submission to offer. Use status updates and priority levels to stay organized.">
            <button className="p-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors">
              <HelpCircle className="w-4 h-4" />
            </button>
          </SimpleTooltip>
        </h2>
        <div className="flex items-center gap-3">
          {!isMobile && settings.viewMode === 'comfy' && (
            <>
              <motion.button 
                onClick={() => setViewMode('grid')} 
                className={`p-2.5 rounded-lg transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400 shadow-sm' 
                    : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LayoutGrid className="w-5 h-5" />
              </motion.button>
              <motion.button 
                onClick={() => setViewMode('list')} 
                className={`p-2.5 rounded-lg transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400 shadow-sm' 
                    : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <List className="w-5 h-5" />
              </motion.button>
            </>
          )}
          <SimpleTooltip content={showArchived ? "Show Active Applications" : "Show Archived Applications"}>
            <motion.button 
              onClick={() => setShowArchived(!showArchived)} 
              className={`p-2.5 rounded-lg transition-all duration-200 ${
                showArchived 
                  ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Archive className="w-5 h-5" />
            </motion.button>
          </SimpleTooltip>
          <motion.button 
            onClick={() => setShowFilters(!showFilters)} 
            className={`p-2.5 rounded-lg transition-all duration-200 ${
              hasActiveFilters 
                ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400 shadow-sm' 
                : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Filter className="w-5 h-5" />
          </motion.button>
          <motion.button 
            onClick={onAddApplication} 
            className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-all duration-200 flex items-center gap-2 shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-4 h-4" /> Add Application
          </motion.button>
          {!isMobile && (
            <motion.button 
              onClick={() => setIsSettingsModalOpen(true)}
              className="p-2.5 rounded-lg transition-all duration-200 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </div>

      {!isMobile && settings.viewMode === 'comfy' && settings.showStats && <QuickStats />}

      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }} 
            className="border border-slate-200 dark:border-dark-border amoled:border-amoled-border rounded-xl p-4 sm:p-6 mb-6 bg-slate-50 dark:bg-dark-card amoled:bg-amoled-card"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-dark-text amoled:text-amoled-text mb-2">Status</label>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map(s => (
                    <motion.button
                      key={s}
                      onClick={() => handleFilterChange('status', filters.status.includes(s) ? filters.status.filter(i => i !== s) : [...filters.status, s])}
                      className={`px-3 py-1.5 text-xs rounded-full transition-all duration-200 ${
                        filters.status.includes(s) 
                          ? 'bg-indigo-600 dark:bg-indigo-500 amoled:bg-indigo-600 text-white shadow-sm' 
                          : 'bg-white dark:bg-dark-bg amoled:bg-amoled-bg text-slate-700 dark:text-dark-text amoled:text-amoled-text hover:bg-slate-100 dark:hover:bg-slate-700 amoled:hover:bg-slate-900 border border-slate-200 dark:border-dark-border amoled:border-amoled-border'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-dark-text amoled:text-amoled-text mb-2">Source</label>
                <div className="flex flex-wrap gap-2">
                  {sourceOptions.map(s => (
                    <motion.button
                      key={s}
                      onClick={() => handleFilterChange('source', filters.source.includes(s) ? filters.source.filter(i => i !== s) : [...filters.source, s])}
                      className={`px-3 py-1.5 text-xs rounded-full transition-all duration-200 ${
                        filters.source.includes(s) 
                          ? 'bg-indigo-600 dark:bg-indigo-500 amoled:bg-indigo-600 text-white shadow-sm' 
                          : 'bg-white dark:bg-dark-bg amoled:bg-amoled-bg text-slate-700 dark:text-dark-text amoled:text-amoled-text hover:bg-slate-100 dark:hover:bg-slate-700 amoled:hover:bg-slate-900 border border-slate-200 dark:border-dark-border amoled:border-amoled-border'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-dark-text amoled:text-amoled-text mb-2">Company</label>
                <input 
                  type="text" 
                  value={filters.company} 
                  onChange={e => handleFilterChange('company', e.target.value)} 
                  className="w-full p-2.5 border rounded-lg bg-white dark:bg-dark-bg amoled:bg-amoled-bg text-slate-900 dark:text-dark-text amoled:text-amoled-text border-slate-300 dark:border-dark-border amoled:border-amoled-border focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 amoled:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 amoled:focus:border-indigo-400 transition-all" 
                  placeholder="Filter by company..." 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-dark-text amoled:text-amoled-text mb-2">Priority</label>
                <div className="flex flex-wrap gap-2">
                  {['High', 'Medium', 'Low'].map(p => (
                    <motion.button
                      key={p}
                      onClick={() => handleFilterChange('priority', filters.priority.includes(p as any) ? filters.priority.filter(i => i !== p) : [...filters.priority, p as any])}
                      className={`px-3 py-1.5 text-xs rounded-full transition-all duration-200 ${
                        filters.priority.includes(p as any) 
                          ? 'bg-indigo-600 dark:bg-indigo-500 amoled:bg-indigo-600 text-white shadow-sm' 
                          : 'bg-white dark:bg-dark-bg amoled:bg-amoled-bg text-slate-700 dark:text-dark-text amoled:text-amoled-text hover:bg-slate-100 dark:hover:bg-slate-700 amoled:hover:bg-slate-900 border border-slate-200 dark:border-dark-border amoled:border-amoled-border'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {p}
                    </motion.button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-dark-text amoled:text-amoled-text mb-2">Referral</label>
                <div className="flex flex-wrap gap-2">
                  {['Y', 'N'].map(r => (
                    <motion.button
                      key={r}
                      onClick={() => handleFilterChange('referral', filters.referral.includes(r as any) ? filters.referral.filter(i => i !== r) : [...filters.referral, r as any])}
                      className={`px-3 py-1.5 text-xs rounded-full transition-all duration-200 ${
                        filters.referral.includes(r as any) 
                          ? 'bg-indigo-600 dark:bg-indigo-500 amoled:bg-indigo-600 text-white shadow-sm' 
                          : 'bg-white dark:bg-dark-bg amoled:bg-amoled-bg text-slate-700 dark:text-dark-text amoled:text-amoled-text hover:bg-slate-100 dark:hover:bg-slate-700 amoled:hover:bg-slate-900 border border-slate-200 dark:border-dark-border amoled:border-amoled-border'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {r === 'Y' ? 'Yes' : 'No'}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4 pt-4 border-t border-slate-200 dark:border-dark-border amoled:border-amoled-border">
              <motion.button 
                onClick={clearFilters} 
                className="text-sm text-indigo-600 dark:text-indigo-400 amoled:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 amoled:hover:text-indigo-300 font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear All Filters
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedItems.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 p-4 rounded-lg mb-6 border border-indigo-200 dark:border-indigo-800/50"
        >
          <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">{selectedItems.length} item(s) selected</span>
          <motion.button 
            onClick={() => setConfirmBulkDeleteOpen(true)} 
            className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-semibold transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Trash2 className="w-4 h-4" /> Delete Selected
          </motion.button>
        </motion.div>
      )}

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {processedApplications.map(app => (
            <ApplicationCard 
              key={app.id} 
              app={app} 
              onEditApplication={onEditApplication} 
              onDeleteApplication={handleDeleteRequest} 
              onViewJD={onViewJD} 
              onArchiveApplication={showArchived ? onUnarchiveApplication : onArchiveApplication}
              isSelected={selectedItems.includes(app.id)}
              onSelectionChange={handleSelectionChange}
              currency={settings.currency}
              salaryDenomination={settings.salaryDenomination}
            />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-800">
              <tr>
                <th scope="col" className="p-4">
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll} 
                    checked={selectedItems.length === processedApplications.length && processedApplications.length > 0} 
                    className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 bg-transparent text-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                  />
                </th>
                <th scope="col" className="px-6 py-3.5 font-semibold text-slate-700 dark:text-slate-300">
                  <button 
                    onClick={() => handleSort('company')} 
                    className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    Company
                    {sortField === 'company' && (
                      sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3.5 font-semibold text-slate-700 dark:text-slate-300">
                  <button 
                    onClick={() => handleSort('role')} 
                    className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    Role
                    {sortField === 'role' && (
                      sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3.5 font-semibold text-slate-700 dark:text-slate-300">JD</th>
                <th scope="col" className="px-6 py-3.5 font-semibold text-slate-700 dark:text-slate-300">
                  <button 
                    onClick={() => handleSort('date')} 
                    className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    Date Applied
                    {sortField === 'date' && (
                      sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3.5 font-semibold text-slate-700 dark:text-slate-300">
                  <button 
                    onClick={() => handleSort('status')} 
                    className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    Status
                    {sortField === 'status' && (
                      sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3.5 font-semibold text-slate-700 dark:text-slate-300">Source</th>
                <th scope="col" className="px-6 py-3.5 font-semibold text-slate-700 dark:text-slate-300">Salary</th>
                <th scope="col" className="px-6 py-3.5 font-semibold text-slate-700 dark:text-slate-300">Interview Date</th>
                <th scope="col" className="px-6 py-3.5 font-semibold text-slate-700 dark:text-slate-300">Location</th>
                <th scope="col" className="px-6 py-3.5 font-semibold text-slate-700 dark:text-slate-300">Notes</th>
                <th scope="col" className="px-6 py-3.5 font-semibold text-slate-700 dark:text-slate-300"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {processedApplications.map(app => (
                <ApplicationRow 
                  key={app.id} 
                  app={app} 
                  onEditApplication={onEditApplication} 
                  onDeleteApplication={handleDeleteRequest} 
                  onViewJD={onViewJD} 
                  isSelected={selectedItems.includes(app.id)}
                  onSelectionChange={handleSelectionChange}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {processedApplications.length === 0 && (
        hasActiveFilters ? (
          <EmptyState
            title="No Applications Found"
            message="Try adjusting your filters or add a new application."
            buttonText="Clear Filters"
            onButtonClick={clearFilters}
            icon={<Briefcase className="w-12 h-12 text-slate-400" />}
          />
        ) : (
          <div className="text-center py-16 text-slate-500 dark:text-slate-400">
            <div className="max-w-md mx-auto space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600 dark:text-indigo-400">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  No applications yet
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  Ready to land your dream job? Start tracking your applications now.
                </p>

                <div className="grid gap-4">
                  <button
                    onClick={onAddApplication}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add First Application
                  </button>

                  <div className="relative hidden sm:block">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-slate-800 text-slate-500">or try this</span>
                    </div>
                  </div>

                  <a
                    href="https://chromewebstore.google.com/detail/jobtrac-job-application-i/nipmnhedccgblgibeiikbcphcofgjfba"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:flex w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 text-slate-700 dark:text-slate-200 font-medium py-3 px-6 rounded-xl transition-all hover:shadow-md items-center justify-center gap-2 group"
                  >
                    <Chrome className="w-5 h-5 text-indigo-500" />
                    <span>Use Browser Extension</span>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 ml-auto" />
                  </a>
                </div>

                <p className="hidden sm:block mt-4 text-xs text-slate-400 dark:text-slate-500">
                  Instantly import jobs from LinkedIn, Indeed & Glassdoor
                </p>
              </div>
            </div>
          </div>
        )
      )}

      <ConfirmationModal 
        isOpen={isConfirmBulkDeleteOpen}
        onClose={() => setConfirmBulkDeleteOpen(false)}
        onConfirm={handleDeleteSelected}
        title="Delete Selected Applications"
        message={`Are you sure you want to delete ${selectedItems.length} selected application(s)? This action cannot be undone.`}
      />

      <ConfirmationModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Application"
        message={`Are you sure you want to delete this application? This action cannot be undone.`}
      />
    </div>
  );
};

export default React.memo(ApplicationTracker);