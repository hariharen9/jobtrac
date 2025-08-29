import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Filter, SortAsc, SortDesc, X } from 'lucide-react';
import { PrepEntry } from '../../../types';
import PrepLogRow from './PrepLogRow';
import PrepLogCard from './PrepLogCard';
import { useMediaQuery } from '../../../hooks/shared/useMediaQuery';
import EmptyState from '../../../components/shared/EmptyState';

type SortField = 'date' | 'topic' | 'time' | 'confidence';
type SortDirection = 'asc' | 'desc';

interface FilterOptions {
  topic: string;
  confidence: number[];
  timeRange: {
    min: number;
    max: number;
  };
  dateRange: {
    start: string;
    end: string;
  };
}

interface PrepLogProps {
  prepEntries: PrepEntry[];
  onAddPrepEntry: () => void;
  onEditPrepEntry: (entry: PrepEntry) => void;
  onDeletePrepEntry: (id: string) => void;
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

const PrepLog: React.FC<PrepLogProps> = ({ prepEntries, onAddPrepEntry, onEditPrepEntry, onDeletePrepEntry, loading = false }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    topic: '',
    confidence: [],
    timeRange: {
      min: 0,
      max: 24
    },
    dateRange: {
      start: '',
      end: ''
    }
  });

  const confidenceOptions = [1, 2, 3, 4, 5];

  // Sorting function
  const sortPrepEntries = useCallback((entries: PrepEntry[]) => {
    return [...entries].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case 'date':
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case 'topic':
          aValue = a.topic.toLowerCase();
          bValue = b.topic.toLowerCase();
          break;
        case 'time':
          aValue = a.time;
          bValue = b.time;
          break;
        case 'confidence':
          aValue = a.confidence;
          bValue = b.confidence;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [sortField, sortDirection]);

  // Filtering function
  const filterPrepEntries = useCallback((entries: PrepEntry[]) => {
    return entries.filter(entry => {
      // Topic filter
      if (filters.topic && !entry.topic.toLowerCase().includes(filters.topic.toLowerCase())) {
        return false;
      }

      // Confidence filter
      if (filters.confidence.length > 0 && !filters.confidence.includes(entry.confidence)) {
        return false;
      }

      // Time range filter
      if (entry.time < filters.timeRange.min || entry.time > filters.timeRange.max) {
        return false;
      }

      // Date range filter
      if (filters.dateRange.start || filters.dateRange.end) {
        const entryDate = new Date(entry.date);
        if (filters.dateRange.start && entryDate < new Date(filters.dateRange.start)) {
          return false;
        }
        if (filters.dateRange.end && entryDate > new Date(filters.dateRange.end)) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  // Combined sorting and filtering
  const processedEntries = useMemo(() => {
    const filtered = filterPrepEntries(prepEntries);
    return sortPrepEntries(filtered);
  }, [prepEntries, filterPrepEntries, sortPrepEntries]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleConfidenceFilter = (confidence: number) => {
    setFilters(prev => ({
      ...prev,
      confidence: prev.confidence.includes(confidence)
        ? prev.confidence.filter(c => c !== confidence)
        : [...prev.confidence, confidence]
    }));
  };

  const clearFilters = () => {
    setFilters({
      topic: '',
      confidence: [],
      timeRange: {
        min: 0,
        max: 24
      },
      dateRange: {
        start: '',
        end: ''
      }
    });
  };

  const hasActiveFilters = filters.topic || filters.confidence.length > 0 || 
    filters.timeRange.min > 0 || filters.timeRange.max < 24 || 
    filters.dateRange.start || filters.dateRange.end;

  if (loading) {
    return (
      <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-900 dark:text-dark-text amoled:text-amoled-text">
            <BookOpen className="w-5 h-5" />
            My Prep Log
          </h2>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-slate-600 dark:text-slate-400">Loading prep entries...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card p-4 sm:p-6 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
        <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-slate-900 dark:text-dark-text amoled:text-amoled-text">
          <BookOpen className="w-5 h-5" />
          My Prep Log
          {processedEntries.length !== prepEntries.length && (
            <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
              ({processedEntries.length} of {prepEntries.length})
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
                {(filters.topic ? 1 : 0) + filters.confidence.length + (filters.timeRange.min > 0 || filters.timeRange.max < 24 ? 1 : 0) + (filters.dateRange.start || filters.dateRange.end ? 1 : 0)}
              </span>
            )}
          </motion.button>
          
          {/* Add Prep Entry Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAddPrepEntry}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2 justify-center sm:justify-start w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            Add Prep Entry
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
              {/* Topic Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Topic
                </label>
                <input
                  type="text"
                  placeholder="Filter by topic..."
                  value={filters.topic}
                  onChange={(e) => setFilters(prev => ({ ...prev, topic: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Confidence Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Confidence Level
                </label>
                <div className="flex flex-wrap gap-2">
                  {confidenceOptions.map(level => (
                    <button
                      key={level}
                      onClick={() => handleConfidenceFilter(level)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        filters.confidence.includes(level)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Range Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Time Range (Hours)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    min="0"
                    max="24"
                    value={filters.timeRange.min}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      timeRange: { ...prev.timeRange, min: Number(e.target.value) || 0 }
                    }))}
                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    min="0"
                    max="24"
                    value={filters.timeRange.max}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      timeRange: { ...prev.timeRange, max: Number(e.target.value) || 24 }
                    }))}
                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Date Range Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
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
                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <input
                    type="date"
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
      {!isMobile && (
        <div className="flex items-center gap-2 mb-4 text-sm">
          <span className="text-slate-600 dark:text-slate-400">Sort by:</span>
          {(['date', 'topic', 'time', 'confidence'] as SortField[]).map(field => (
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
        </div>
      )}
      {isMobile ? (
        <motion.div 
          className="space-y-4"
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {processedEntries.map(entry => (
              <motion.div key={entry.id} variants={itemVariants} layout>
                <PrepLogCard 
                  entry={entry} 
                  onEditPrepEntry={onEditPrepEntry} 
                  onDeletePrepEntry={onDeletePrepEntry} 
                />
              </motion.div>
            ))}
          </AnimatePresence>
          {processedEntries.length === 0 && prepEntries.length > 0 && (
            <div className="text-center py-8">
              <p className="text-slate-500 dark:text-slate-400 mb-4">No prep entries match the current filters.</p>
              <button
                onClick={clearFilters}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 font-medium"
              >
                Clear Filters
              </button>
            </div>
          )}
          {prepEntries.length === 0 && (
            <EmptyState
              title="No Prep Entries Yet"
              message="Start tracking your interview preparation by adding your first prep entry. Consistency is key!"
              buttonText="Add Prep Entry"
              onButtonClick={onAddPrepEntry}
              icon={<BookOpen className="w-8 h-8 text-indigo-600" />}
            />
          )}
        </motion.div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
            <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700/50 amoled:bg-white amoled:text-black">
              <tr>
                <th scope="col" className="px-6 py-3">
                  <button
                    onClick={() => handleSort('date')}
                    className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  >
                    Date
                    {sortField === 'date' && (
                      sortDirection === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3">
                  <button
                    onClick={() => handleSort('topic')}
                    className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  >
                    Topic
                    {sortField === 'topic' && (
                      sortDirection === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3">Problems Solved</th>
                <th scope="col" className="px-6 py-3">
                  <button
                    onClick={() => handleSort('time')}
                    className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  >
                    Time (Hrs)
                    {sortField === 'time' && (
                      sortDirection === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3">
                  <button
                    onClick={() => handleSort('confidence')}
                    className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  >
                    Confidence (1-5)
                    {sortField === 'confidence' && (
                      sortDirection === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3">Key Takeaways</th>
                <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <motion.tbody
              variants={listVariants}
              initial="hidden"
              animate="visible"
            >
              {processedEntries.map(entry => (
                <motion.tr 
                  key={entry.id} 
                  variants={itemVariants}
                  className="bg-white dark:bg-dark-card amoled:bg-amoled-card border-b border-slate-200 dark:border-slate-700"
                  whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
                  transition={{ duration: 0.2 }}
                >
                  <PrepLogRow 
                    entry={entry} 
                    onEditPrepEntry={onEditPrepEntry} 
                    onDeletePrepEntry={onDeletePrepEntry} 
                  />
                </motion.tr>
              ))}
              {processedEntries.length === 0 && prepEntries.length > 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    <div className="flex flex-col items-center gap-3">
                      <p>No prep entries match the current filters.</p>
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
              {prepEntries.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    <EmptyState
                      title="No Prep Entries Yet"
                      message="Start tracking your interview preparation by adding your first prep entry. Consistency is key!"
                      buttonText="Add Prep Entry"
                      onButtonClick={onAddPrepEntry}
                      icon={<BookOpen className="w-8 h-8 text-indigo-600" />}
                    />
                  </td>
                </tr>
              )}
            </motion.tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default React.memo(PrepLog);