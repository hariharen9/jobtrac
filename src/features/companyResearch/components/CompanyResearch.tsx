import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, Plus, Filter, SortAsc, SortDesc, X } from 'lucide-react';
import { CompanyResearch } from '../../../types';
import CompanyCard from './CompanyCard';
import EmptyState from '../../../components/shared/EmptyState';

type SortField = 'company' | 'createdAt';
type SortDirection = 'asc' | 'desc';

interface FilterOptions {
  company: string;
  createdAt: {
    start: string;
    end: string;
  };
}

interface CompanyResearchProps {
  companies: CompanyResearch[];
  onAddCompany: () => void;
  onEditCompany: (company: CompanyResearch) => void;
  onDeleteCompany: (id: string) => void;
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

const CompanyResearchComponent: React.FC<CompanyResearchProps> = ({ 
  companies, 
  onAddCompany, 
  onEditCompany,
  onDeleteCompany,
  loading = false 
}) => {
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    company: '',
    createdAt: {
      start: '',
      end: ''
    }
  });

  // Sorting function
  const sortCompanies = (companyList: CompanyResearch[]) => {
    return [...companyList].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case 'company':
          aValue = a.company.toLowerCase();
          bValue = b.company.toLowerCase();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
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
  const filterCompanies = (companyList: CompanyResearch[]) => {
    return companyList.filter(company => {
      // Company name filter
      if (filters.company && !company.company.toLowerCase().includes(filters.company.toLowerCase())) {
        return false;
      }

      // Date range filter
      if (filters.createdAt.start || filters.createdAt.end) {
        const companyDate = new Date(company.createdAt);
        if (filters.createdAt.start && companyDate < new Date(filters.createdAt.start)) {
          return false;
        }
        if (filters.createdAt.end && companyDate > new Date(filters.createdAt.end)) {
          return false;
        }
      }

      return true;
    });
  };

  // Combined sorting and filtering
  const processedCompanies = useMemo(() => {
    const filtered = filterCompanies(companies);
    return sortCompanies(filtered);
  }, [companies, sortField, sortDirection, filters]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const clearFilters = () => {
    setFilters({
      company: '',
      createdAt: {
        start: '',
        end: ''
      }
    });
  };

  const hasActiveFilters = filters.company || filters.createdAt.start || filters.createdAt.end;
  if (loading) {
    return (
      <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-900 dark:text-dark-text amoled:text-amoled-text">
            <Building className="w-5 h-5" />
            Company Research
          </h2>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-slate-600 dark:text-slate-400">Loading company research...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card p-6 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-900 dark:text-dark-text amoled:text-amoled-text">
          <Building className="w-5 h-5" />
          Company Research
          {processedCompanies.length !== companies.length && (
            <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
              ({processedCompanies.length} of {companies.length})
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
                {(filters.company ? 1 : 0) + (filters.createdAt.start || filters.createdAt.end ? 1 : 0)}
              </span>
            )}
          </motion.button>
          
          {/* Add Company Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAddCompany}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2 justify-center sm:justify-start w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            Add Company
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
                    value={filters.createdAt.start}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      createdAt: { ...prev.createdAt, start: e.target.value }
                    }))}
                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <input
                    type="date"
                    placeholder="To"
                    value={filters.createdAt.end}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      createdAt: { ...prev.createdAt, end: e.target.value }
                    }))}
                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
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
      <div className="flex items-center gap-2 mb-4 text-sm">
        <span className="text-slate-600 dark:text-slate-400">Sort by:</span>
        {(['company', 'createdAt'] as SortField[]).map(field => (
          <button
            key={field}
            onClick={() => handleSort(field)}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
              sortField === field
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {field === 'createdAt' ? 'Date Created' : field.charAt(0).toUpperCase() + field.slice(1)}
            {sortField === field && (
              sortDirection === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
            )}
          </button>
        ))}
      </div>

      <motion.div 
        className="space-y-4"
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {processedCompanies.map(company => (
            <motion.div key={company.id} variants={itemVariants} layout>
              <CompanyCard 
                company={company} 
                onEditCompany={onEditCompany} 
                onDeleteCompany={onDeleteCompany} 
              />
            </motion.div>
          ))}
        </AnimatePresence>
        {processedCompanies.length === 0 && companies.length > 0 && (
          <div className="text-center py-8">
            <p className="text-slate-500 dark:text-slate-400 mb-4">No companies match the current filters.</p>
            <button
              onClick={clearFilters}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}
        {companies.length === 0 && (
          <EmptyState
            title="No Company Research Yet"
            message="Start researching potential employers by adding your first company. Knowledge is power!"
            buttonText="Add Company"
            onButtonClick={onAddCompany}
            icon={<Building className="w-8 h-8 text-indigo-600" />}
          />
        )}
      </motion.div>
    </div>
  );
};

export default React.memo(CompanyResearchComponent);