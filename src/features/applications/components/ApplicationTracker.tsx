import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Plus, Filter, SortAsc, SortDesc, X, ChevronDown } from 'lucide-react';
import { Application, ApplicationStatus } from '../../../types';
import ApplicationCard from './ApplicationCard';
import ApplicationRow from './ApplicationRow';
import EmptyState from '../../../components/shared/EmptyState';

type SortField = 'date' | 'company' | 'role' | 'status' | 'source' | 'priority' | 'salaryRange' | 'interviewDate';
type SortDirection = 'asc' | 'desc';

interface FilterOptions {
  status: ApplicationStatus[];
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

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

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
    company: '',
    dateRange: {
      start: '',
      end: ''
    }
  });

  const statusOptions: ApplicationStatus[] = [
    'To Apply', 'Applied', 'HR Screen', 'Tech Screen', 'Round 1', 'Round 2',
    'Manager Round', 'Final Round', 'Offer', 'Rejected', 'Ghosted'
  ];

  // Sorting function
  const sortApplications = (apps: Application[]) => {
    return [...apps].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case 'date':
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case 'company':
          aValue = a.company.toLowerCase();
          bValue = b.company.toLowerCase();
          break;
        case 'role':
          aValue = a.role.toLowerCase();
          bValue = b.role.toLowerCase();
          break;
        case 'status':
          aValue = statusOptions.indexOf(a.status);
          bValue = statusOptions.indexOf(b.status);
          break;
        case 'source':
          aValue = (a.source === 'Other' ? a.sourceOther : a.source) || '';
          bValue = (b.source === 'Other' ? b.sourceOther : b.source) || '';
          break;
        case 'priority':
            aValue = a.priority || 'Medium';
            bValue = b.priority || 'Medium';
            break;
        case 'salaryRange':
            aValue = a.salaryRange || '';
            bValue = b.salaryRange || '';
            break;
        case 'interviewDate':
            aValue = a.interviewDate || '';
            bValue = b.interviewDate || '';
            break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  // Filtering function
  const filterApplications = (apps: Application[]) => {
    return apps.filter(app => {
      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(app.status)) {
        return false;
      }

      // Company filter
      if (filters.company && !app.company.toLowerCase().includes(filters.company.toLowerCase())) {
        return false;
      }

      // Date range filter
      if (filters.dateRange.start || filters.dateRange.end) {
        const appDate = new Date(app.date);
        if (filters.dateRange.start && appDate < new Date(filters.dateRange.start)) {
          return false;
        }
        if (filters.dateRange.end && appDate > new Date(filters.dateRange.end)) {
          return false;
        }
      }

      return true;
    });
  };

  // Combined sorting and filtering
  const processedApplications = useMemo(() => {
    const filtered = filterApplications(applications);
    return sortApplications(filtered);
  }, [applications, sortField, sortDirection, filters]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleStatusFilter = (status: ApplicationStatus) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: [],
      company: '',
      dateRange: {
        start: '',
        end: ''
      }
    });
  };

  const hasActiveFilters = filters.status.length > 0 || filters.company || filters.dateRange.start || filters.dateRange.end;
  if (loading) {
    return (
      <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-900 dark:text-dark-text amoled:text-amoled-text">
            <Briefcase className="w-5 h-5" />
            My Applications
          </h2>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-slate-600 dark:text-slate-400">Loading applications...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card p-4 sm:p-6 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
        <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-slate-900 dark:text-dark-text amoled:text-amoled-text">
          <Briefcase className="w-5 h-5" />
          My Applications
          {processedApplications.length !== applications.length && (
            <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
              ({processedApplications.length} of {applications.length})
            </span>
          )}
        </h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {/* Filter Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`${hasActiveFilters 
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' 
              : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
            } px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 justify-center sm:justify-start`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="bg-indigo-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                {filters.status.length + (filters.company ? 1 : 0) + (filters.dateRange.start || filters.dateRange.end ? 1 : 0)}
              </span>
            )}
          </motion.button>
          
          {/* Add Application Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAddApplication}
            data-tooltip="add-application"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2 justify-center sm:justify-start"
          >
            <Plus className="w-4 h-4" />
            Add Application
          </motion.button>
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-4 bg-slate-50 dark:bg-slate-800/50"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Status Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map(status => (
                    <button
                      key={status}
                      onClick={() => handleStatusFilter(status)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        filters.status.includes(status)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Company Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  placeholder="Filter by company name..."
                  value={filters.company}
                  onChange={(e) => setFilters(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Date Range Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Date Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    placeholder="From"
                    value={filters.dateRange.start}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      dateRange: { ...prev.dateRange, start: e.target.value }
                    }))}
                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <input
                    type="date"
                    placeholder="To"
                    value={filters.dateRange.end}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      dateRange: { ...prev.dateRange, end: e.target.value }
                    }))}
                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Sorting Options */}
            <div className="mt-4 pt-4 border-t border-slate-300 dark:border-slate-600">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Additional Sorting Options
              </label>
              <div className="flex flex-wrap gap-2">
                {(['source', 'priority', 'salaryRange', 'interviewDate'] as SortField[]).map(field => (
                  <button
                    key={field}
                    onClick={() => handleSort(field)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
                      sortField === field
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'
                    }`}
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                    {sortField === field && (
                      sortDirection === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={clearFilters}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Clear Filters
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sort Controls */}
      <div className="hidden sm:flex items-center gap-2 mb-4 text-sm">
        <span className="text-slate-600 dark:text-slate-400">Sort by:</span>
        {(['date', 'company', 'role', 'status'] as SortField[]).map(field => (
          <button
            key={field}
            onClick={() => handleSort(field)}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
              sortField === field
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {field.charAt(0).toUpperCase() + field.slice(1)}
            {sortField === field && (
              sortDirection === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
            )}
          </button>
        ))}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1 px-3 py-1 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          More Options...
        </button>
      </div>
      
      {/* Mobile Card View */}
      <motion.div 
        className="sm:hidden space-y-4"
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {processedApplications.map(app => (
            <motion.div key={app.id} variants={itemVariants} layout>
              <ApplicationCard 
                app={app} 
                onEditApplication={onEditApplication} 
                onDeleteApplication={onDeleteApplication} 
                onViewJD={onViewJD}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        {processedApplications.length === 0 && applications.length > 0 && (
          <div className="text-center py-8">
            <p className="text-slate-500 dark:text-slate-400 mb-4">No applications match the current filters.</p>
            <button
              onClick={clearFilters}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}
        {applications.length === 0 && (
          <EmptyState
            title="No Applications Yet"
            message="Start tracking your job search by adding your first application. It's quick and easy!"
            buttonText="Add Application"
            onButtonClick={onAddApplication}
            icon={<Briefcase className="w-8 h-8 text-indigo-600" />}
          />
        )}
      </motion.div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
          <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700/50 amoled:bg-white amoled:text-black">
            <tr>
              <th scope="col" className="px-6 py-3">
                <button
                  onClick={() => handleSort('company')}
                  className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                >
                  Company
                  {sortField === 'company' && (
                    sortDirection === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                  )}
                </button>
              </th>
              <th scope="col" className="px-6 py-3">
                <button
                  onClick={() => handleSort('role')}
                  className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                >
                  Role
                  {sortField === 'role' && (
                    sortDirection === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                  )}
                </button>
              </th>
              <th scope="col" className="px-6 py-3">JD</th>
              <th scope="col" className="px-6 py-3">
                <button
                  onClick={() => handleSort('date')}
                  className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                >
                  Date Applied
                  {sortField === 'date' && (
                    sortDirection === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                  )}
                </button>
              </th>
              <th scope="col" className="px-6 py-3">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                >
                  Status
                  {sortField === 'status' && (
                    sortDirection === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                  )}
                </button>
              </th>
              <th scope="col" className="px-6 py-3">Source</th>
              <th scope="col" className="px-6 py-3">Salary</th>
              <th scope="col" className="px-6 py-3">Interview Date</th>
              <th scope="col" className="px-6 py-3">Location</th>
              <th scope="col" className="px-6 py-3">Notes</th>
              <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <motion.tbody
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            {processedApplications.map(app => (
              <motion.tr 
                key={app.id} 
                variants={itemVariants}
                className="bg-white dark:bg-dark-card amoled:bg-amoled-card border-b border-slate-200 dark:border-slate-700"
                whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
                transition={{ duration: 0.2 }}
              >
                <ApplicationRow 
                  app={app} 
                  onEditApplication={onEditApplication} 
                  onDeleteApplication={onDeleteApplication} 
                  onViewJD={onViewJD}
                />
              </motion.tr>
            ))}
            {processedApplications.length === 0 && applications.length > 0 && (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                  <div className="flex flex-col items-center gap-3">
                    <p>No applications match the current filters.</p>
                    <button
                      onClick={clearFilters}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 font-medium"
                    >
                      Clear Filters
                    </button>
                  </div>
                </td>
              </tr>
            )}
            {applications.length === 0 && (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                  <EmptyState
                    title="No Applications Yet"
                    message="Start tracking your job search by adding your first application. It's quick and easy!"
                    buttonText="Add Application"
                    onButtonClick={onAddApplication}
                    icon={<Briefcase className="w-8 h-8 text-indigo-600" />}
                  />
                </td>
              </tr>
            )}
          </motion.tbody>
        </table>
      </div>
    </div>
  );
};

export default React.memo(ApplicationTracker);