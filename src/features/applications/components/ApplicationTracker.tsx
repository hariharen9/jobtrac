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
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{total}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Apps</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-yellow-500">{interviews}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Interviews</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-green-500">{offers}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Offers</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-blue-500">{successRate}%</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Success Rate</p>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-12">Loading applications...</div>;
  }

  return (
    <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card p-4 sm:p-6 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
        <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-slate-900 dark:text-dark-text amoled:text-amoled-text">
          <Briefcase className="w-5 h-5" />
          My Applications
        </h2>
        <div className="flex items-center gap-2">
          <motion.button onClick={() => setViewMode('grid')} className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-500'}`}><LayoutGrid /></motion.button>
          <motion.button onClick={() => setViewMode('list')} className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-500'}`}><List /></motion.button>
          <motion.button onClick={() => setShowFilters(!showFilters)} className={`p-2 rounded-md ${hasActiveFilters ? 'bg-indigo-100 text-indigo-600' : 'text-slate-500'}`}><Filter /></motion.button>
          <motion.button onClick={onAddApplication} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2"><Plus className="w-4 h-4" /> Add</motion.button>
        </div>
      </div>

      <QuickStats />

      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="border-t border-b border-slate-200 dark:border-slate-700 py-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Status</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {statusOptions.map(s => <button key={s} onClick={() => handleFilterChange('status', filters.status.includes(s) ? filters.status.filter(i => i !== s) : [...filters.status, s])} className={`px-2 py-1 text-xs rounded-full ${filters.status.includes(s) ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>{s}</button>)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Source</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {sourceOptions.map(s => <button key={s} onClick={() => handleFilterChange('source', filters.source.includes(s) ? filters.source.filter(i => i !== s) : [...filters.source, s])} className={`px-2 py-1 text-xs rounded-full ${filters.source.includes(s) ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>{s}</button>)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Company</label>
                <input type="text" value={filters.company} onChange={e => handleFilterChange('company', e.target.value)} className="w-full mt-2 p-2 border rounded-md bg-transparent" placeholder="Filter by company..." />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={clearFilters} className="text-sm text-indigo-600 hover:underline">Clear Filters</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedItems.length > 0 && (
        <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 p-3 rounded-lg mb-4">
          <span className="text-sm font-medium">{selectedItems.length} selected</span>
          <button onClick={() => setConfirmBulkDeleteOpen(true)} className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 font-medium"><Trash2 className="w-4 h-4" /> Delete Selected</button>
        </div>
      )}

      {viewMode === 'grid' ? (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        </motion.div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700">
              <tr>
                <th scope="col" className="p-4"><input type="checkbox" onChange={handleSelectAll} checked={selectedItems.length === processedApplications.length && processedApplications.length > 0} /></th>
                <th scope="col" className="px-6 py-3"><button onClick={() => handleSort('company')}>Company</button></th>
                <th scope="col" className="px-6 py-3"><button onClick={() => handleSort('role')}>Role</button></th>
                <th scope="col" className="px-6 py-3">JD</th>
                <th scope="col" className="px-6 py-3"><button onClick={() => handleSort('date')}>Date Applied</button></th>
                <th scope="col" className="px-6 py-3"><button onClick={() => handleSort('status')}>Status</button></th>
                <th scope="col" className="px-6 py-3">Source</th>
                <th scope="col" className="px-6 py-3">Salary</th>
                <th scope="col" className="px-6 py-3">Interview Date</th>
                <th scope="col" className="px-6 py-3">Location</th>
                <th scope="col" className="px-6 py-3">Notes</th>
                <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
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