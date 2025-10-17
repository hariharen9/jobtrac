import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, Plus, Filter, SortAsc, SortDesc, X, Search, Grid3X3, List, LayoutGrid } from 'lucide-react';
import { CompanyResearch } from '../../../types';
import CompanyCard from './CompanyCard';
import EmptyState from '../../../components/shared/EmptyState';
import { useMediaQuery } from '../../../hooks/shared/useMediaQuery';
import SimpleTooltip from '../../../components/shared/SimpleTooltip';

type SortField = 'company' | 'date' | 'priority';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'grid' | 'list' | 'compact';

interface FilterOptions {
  company: string;
  dateRange: {
    start: string;
    end: string;
  };
  hasValues: boolean | null;
  hasNews: boolean | null;
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
      staggerChildren: 0.08,
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
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(isMobile ? 'list' : 'grid');
  const [filters, setFilters] = useState<FilterOptions>({
    company: '',
    dateRange: {
      start: '',
      end: ''
    },
    hasValues: null,
    hasNews: null
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
        case 'date':
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case 'priority':
          // Priority based on completeness (values + news + questions + why)
          const aScore = [a.values, a.news, a.questions, a.why].filter(Boolean).length;
          const bScore = [b.values, b.news, b.questions, b.why].filter(Boolean).length;
          aValue = aScore;
          bValue = bScore;
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
      if (filters.dateRange.start || filters.dateRange.end) {
        const companyDate = new Date(company.date);
        if (filters.dateRange.start && companyDate < new Date(filters.dateRange.start)) {
          return false;
        }
        if (filters.dateRange.end && companyDate > new Date(filters.dateRange.end)) {
          return false;
        }
      }

      // Has values filter
      if (filters.hasValues !== null) {
        const hasValues = !!(company.values && company.values.trim());
        if (filters.hasValues !== hasValues) return false;
      }

      // Has news filter
      if (filters.hasNews !== null) {
        const hasNews = !!(company.news && company.news.trim());
        if (filters.hasNews !== hasNews) return false;
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
      setSortDirection(field === 'date' ? 'desc' : 'asc');
    }
  };

  const clearFilters = () => {
    setFilters({
      company: '',
      dateRange: { start: '', end: '' },
      hasValues: null,
      hasNews: null
    });
  };

  const hasActiveFilters = filters.company || filters.dateRange.start || filters.dateRange.end || 
                          filters.hasValues !== null || filters.hasNews !== null;

  if (loading) {
    return (
      <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200 dark:border-dark-border amoled:border-amoled-border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-dark-text amoled:text-amoled-text">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 amoled:bg-indigo-900/30">
              <Building className="w-6 h-6 text-indigo-600 dark:text-indigo-400 amoled:text-indigo-500" />
            </div>
            Company Intelligence
          </h2>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-slate-600 dark:text-slate-400 amoled:text-slate-500">Loading company research...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200 dark:border-dark-border amoled:border-amoled-border">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 gap-4">
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-dark-text amoled:text-amoled-text">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 amoled:bg-indigo-900/30">
              <Building className="w-6 h-6 text-indigo-600 dark:text-indigo-400 amoled:text-indigo-500" />
            </div>
            Company Intelligence
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 amoled:text-slate-500">
            Research and insights on potential employers
          </p>
          {processedCompanies.length !== companies.length && (
            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400 amoled:text-amber-500">
              Showing {processedCompanies.length} of {companies.length} companies
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* View Mode Toggle - Desktop Only */}
          {!isMobile && (
            <div className="flex items-center bg-slate-100 dark:bg-slate-700/50 amoled:bg-slate-800/30 rounded-lg p-1">
              <SimpleTooltip content="Grid View">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-dark-card amoled:bg-amoled-card text-indigo-600 dark:text-indigo-400 amoled:text-indigo-500 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 amoled:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 amoled:hover:text-slate-400'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </motion.button>
              </SimpleTooltip>
              <SimpleTooltip content="List View">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-dark-card amoled:bg-amoled-card text-indigo-600 dark:text-indigo-400 amoled:text-indigo-500 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 amoled:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 amoled:hover:text-slate-400'
                  }`}
                >
                  <List className="w-4 h-4" />
                </motion.button>
              </SimpleTooltip>
              <SimpleTooltip content="Compact View">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('compact')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'compact'
                      ? 'bg-white dark:bg-dark-card amoled:bg-amoled-card text-indigo-600 dark:text-indigo-400 amoled:text-indigo-500 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 amoled:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 amoled:hover:text-slate-400'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </motion.button>
              </SimpleTooltip>
            </div>
          )}

          {/* Filter Button */}
          <SimpleTooltip content="Filter & Sort">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-lg transition-all ${
                hasActiveFilters || showFilters
                  ? 'bg-indigo-100 dark:bg-indigo-900/50 amoled:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 amoled:text-indigo-500 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700/50 amoled:bg-slate-800/30 text-slate-600 dark:text-slate-400 amoled:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600/50 amoled:hover:bg-slate-700/30'
              }`}
            >
              <Filter className="w-4 h-4" />
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full"></span>
              )}
            </motion.button>
          </SimpleTooltip>

          {/* Add Company Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAddCompany}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Company</span>
            <span className="sm:hidden">Add</span>
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
            transition={{ duration: 0.3 }}
            className="bg-slate-50/50 dark:bg-slate-800/30 amoled:bg-slate-900/20 border border-slate-200 dark:border-slate-700 amoled:border-slate-800 rounded-xl p-4 sm:p-5 mb-6 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800 dark:text-dark-text amoled:text-amoled-text">Filters & Sorting</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-indigo-600 dark:text-indigo-400 amoled:text-indigo-500 hover:text-indigo-800 dark:hover:text-indigo-300 amoled:hover:text-indigo-400 font-medium flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Clear All
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Search & Sort */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 amoled:text-slate-400 mb-2">
                    Search Companies
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 amoled:text-slate-600" />
                    <input
                      type="text"
                      placeholder="Search by company name..."
                      value={filters.company}
                      onChange={(e) => setFilters(prev => ({ ...prev, company: e.target.value }))}
                      className="pl-10 w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 amoled:border-slate-700 rounded-lg text-sm bg-white dark:bg-dark-card amoled:bg-amoled-card text-slate-900 dark:text-dark-text amoled:text-amoled-text placeholder-slate-500 dark:placeholder-slate-400 amoled:placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 amoled:text-slate-400 mb-2">
                    Sort By
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { field: 'date' as SortField, label: 'Date Added' },
                      { field: 'company' as SortField, label: 'Company Name' },
                      { field: 'priority' as SortField, label: 'Completeness' }
                    ].map(({ field, label }) => (
                      <button
                        key={field}
                        onClick={() => handleSort(field)}
                        className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          sortField === field
                            ? 'bg-indigo-100 dark:bg-indigo-900/50 amoled:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 amoled:text-indigo-400'
                            : 'bg-white dark:bg-dark-card amoled:bg-amoled-card text-slate-600 dark:text-slate-400 amoled:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 amoled:hover:bg-slate-800/50'
                        }`}
                      >
                        {label}
                        {sortField === field && (
                          sortDirection === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Advanced Filters */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 amoled:text-slate-400 mb-2">
                    Date Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={filters.dateRange.start}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        dateRange: { ...prev.dateRange, start: e.target.value }
                      }))}
                      className="px-3 py-2.5 border border-slate-300 dark:border-slate-600 amoled:border-slate-700 rounded-lg text-sm bg-white dark:bg-dark-card amoled:bg-amoled-card text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                    <input
                      type="date"
                      value={filters.dateRange.end}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        dateRange: { ...prev.dateRange, end: e.target.value }
                      }))}
                      className="px-3 py-2.5 border border-slate-300 dark:border-slate-600 amoled:border-slate-700 rounded-lg text-sm bg-white dark:bg-dark-card amoled:bg-amoled-card text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 amoled:text-slate-400 mb-2">
                    Content Filters
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFilters(prev => ({ 
                        ...prev, 
                        hasValues: prev.hasValues === true ? null : true 
                      }))}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        filters.hasValues === true
                          ? 'bg-emerald-100 dark:bg-emerald-900/50 amoled:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 amoled:text-emerald-400'
                          : 'bg-white dark:bg-dark-card amoled:bg-amoled-card text-slate-600 dark:text-slate-400 amoled:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 amoled:hover:bg-slate-800/50'
                      }`}
                    >
                      Has Values
                    </button>
                    <button
                      onClick={() => setFilters(prev => ({ 
                        ...prev, 
                        hasNews: prev.hasNews === true ? null : true 
                      }))}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        filters.hasNews === true
                          ? 'bg-amber-100 dark:bg-amber-900/50 amoled:bg-amber-900/30 text-amber-700 dark:text-amber-300 amoled:text-amber-400'
                          : 'bg-white dark:bg-dark-card amoled:bg-amoled-card text-slate-600 dark:text-slate-400 amoled:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 amoled:hover:bg-slate-800/50'
                      }`}
                    >
                      Has News
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Companies List */}
      <motion.div 
        className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6' 
            : viewMode === 'compact'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4'
            : 'space-y-4 sm:space-y-6'
        }`}
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
                viewMode={viewMode}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty States */}
      {processedCompanies.length === 0 && companies.length > 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 amoled:bg-slate-800 rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-slate-400 dark:text-slate-500 amoled:text-slate-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-dark-text amoled:text-amoled-text mb-2">No matches found</h3>
          <p className="text-slate-600 dark:text-slate-400 amoled:text-slate-500 mb-4">
            No companies match your current filters. Try adjusting your search criteria.
          </p>
          <button
            onClick={clearFilters}
            className="text-indigo-600 dark:text-indigo-400 amoled:text-indigo-500 hover:text-indigo-800 dark:hover:text-indigo-300 amoled:hover:text-indigo-400 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}

      {companies.length === 0 && (
        <EmptyState
          title="Start Building Your Company Intelligence"
          message="Research potential employers to stand out in interviews. Knowledge about company culture, values, and recent news gives you a competitive edge."
          buttonText="Add Your First Company"
          onButtonClick={onAddCompany}
          icon={
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 amoled:bg-indigo-900/30 rounded-full flex items-center justify-center">
              <Building className="w-8 h-8 text-indigo-600 dark:text-indigo-400 amoled:text-indigo-500" />
            </div>
          }
        />
      )}
    </div>
  );
};

export default React.memo(CompanyResearchComponent);