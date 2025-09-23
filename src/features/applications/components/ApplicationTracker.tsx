import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Plus, Filter, SortAsc, SortDesc, X, ChevronDown, LayoutGrid, List, Trash2 } from 'lucide-react';
import { Application, ApplicationStatus, ApplicationSource } from '../../../types';
import ApplicationCard from './ApplicationCard';
import ApplicationRow from './ApplicationRow';
import EmptyState from '../../../components/shared/EmptyState';
import ConfirmationModal from '../../../components/shared/ConfirmationModal';

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
}

interface ApplicationTrackerProps {
  applications: Application[];
  onAddApplication: () => void;
  onEditApplication: (application: Application) => void;
  onDeleteApplication: (id: string) => void;
  onViewJD: (application: Application) => void;
  loading?: boolean;
}

const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({ 
  applications, 
  onAddApplication, 
  onEditApplication,
  onDeleteApplication,
  onViewJD,
  loading = false 
}) => {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    status: [],
    source: [],
    company: '',
    dateRange: { start: '', end: '' }
  });
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isConfirmBulkDeleteOpen, setConfirmBulkDeleteOpen] = useState(false);

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
        if (filters.status.length > 0 && !filters.status.includes(app.status)) return false;
        if (filters.source.length > 0 && !filters.source.includes(app.source)) return false;
        if (filters.company && !app.company.toLowerCase().includes(filters.company.toLowerCase())) return false;
        if (filters.dateRange.start && new Date(app.date) < new Date(filters.dateRange.start)) return false;
        if (filters.dateRange.end && new Date(app.date) > new Date(filters.dateRange.end)) return false;
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
  }, [applications, filters, sortField, sortDirection]);

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
    setFilters({ status: [], source: [], company: '', dateRange: { start: '', end: '' } });
  };

  const hasActiveFilters = filters.status.length > 0 || filters.source.length > 0 || filters.company || filters.dateRange.start || filters.dateRange.end;

  const QuickStats = () => {
    const total = applications.length;
    const interviews = applications.filter(a => ['HR Screen', 'Tech Screen', 'Round 1', 'Round 2', 'Manager Round', 'Final Round'].includes(a.status)).length;
    const offers = applications.filter(a => a.status === 'Offer').length;
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

  if (loading) {
    return <div className="text-center py-12">Loading applications...</div>;
  }

  return (
    <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200 dark:border-dark-border amoled:border-amoled-border">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-dark-text amoled:text-amoled-text">
          <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50">
            <Briefcase className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          My Applications
        </h2>
        <div className="flex items-center gap-3">
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
        </div>
      </div>

      <QuickStats />

      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }} 
            className="border-t border-b border-slate-200 dark:border-slate-700 py-5 mb-6 rounded-lg bg-slate-50/50 dark:bg-slate-800/30 backdrop-blur-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Status</label>
                <div className="flex flex-wrap gap-2 mt-3">
                  {statusOptions.map(s => (
                    <motion.button
                      key={s}
                      onClick={() => handleFilterChange('status', filters.status.includes(s) ? filters.status.filter(i => i !== s) : [...filters.status, s])}
                      className={`px-3 py-1.5 text-xs rounded-full transition-all duration-200 ${
                        filters.status.includes(s) 
                          ? 'bg-indigo-600 text-white shadow-sm' 
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600'
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
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Source</label>
                <div className="flex flex-wrap gap-2 mt-3">
                  {sourceOptions.map(s => (
                    <motion.button
                      key={s}
                      onClick={() => handleFilterChange('source', filters.source.includes(s) ? filters.source.filter(i => i !== s) : [...filters.source, s])}
                      className={`px-3 py-1.5 text-xs rounded-full transition-all duration-200 ${
                        filters.source.includes(s) 
                          ? 'bg-indigo-600 text-white shadow-sm' 
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600'
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
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Company</label>
                <input 
                  type="text" 
                  value={filters.company} 
                  onChange={e => handleFilterChange('company', e.target.value)} 
                  className="w-full mt-3 p-2.5 border rounded-lg bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 transition-all" 
                  placeholder="Filter by company..." 
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <motion.button 
                onClick={clearFilters} 
                className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors"
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
              isSelected={selectedItems.includes(app.id)}
              onSelectionChange={handleSelectionChange}
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
        <EmptyState
          title="No Applications Found"
          message={hasActiveFilters ? "Try adjusting your filters or add a new application." : "Start tracking your job search by adding your first application."}
          buttonText={hasActiveFilters ? "Clear Filters" : "Add Application"}
          onButtonClick={hasActiveFilters ? clearFilters : onAddApplication}
          icon={<Briefcase className="w-12 h-12 text-slate-400" />}
        />
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