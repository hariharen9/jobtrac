import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Subject } from '../../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Filter, SortAsc, SortDesc, X, AlertTriangle, Calendar, Clock, Star, TrendingUp, FolderOpen, Target, HelpCircle, BarChart3, ChevronDown } from 'lucide-react';
import { PrepEntry } from '../../../types';
import PrepLogSubjectCard from './PrepLogSubjectCard';
import { useMediaQuery } from '../../../hooks/shared/useMediaQuery';
import EmptyState from '../../../components/shared/EmptyState';
import SimpleTooltip from '../../../components/shared/SimpleTooltip';
import PrepAnalytics from './PrepAnalytics';
import TodaysReviews from './TodaysReviews';
import TopicBreakdown from './TopicBreakdown';
import SubjectManager from './SubjectManager';
import PrepLogSkeleton from './PrepLogSkeleton';

type SortField = 'date' | 'subject' | 'time' | 'confidence';
type SortDirection = 'asc' | 'desc';

interface FilterOptions {
  subject: string;
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

// Using imported types from global types file

interface PrepLogProps {
  prepEntries: PrepEntry[];
  subjects: Subject[];
  onAddPrepEntry: () => void;
  onEditPrepEntry: (entry: PrepEntry) => void;
  onDeletePrepEntry: (id: string) => void;
  onAddSubject: (subject: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEditSubject: (subject: Subject) => void;
  onDeleteSubject: (id: string) => void;
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

// Mobile Sidebar Collapsible Component
const MobileSidebarCollapsible: React.FC<{
  prepEntries: PrepEntry[];
  onEditPrepEntry: (entry: PrepEntry) => void;
  subjects: Subject[];
}> = ({ prepEntries, onEditPrepEntry, subjects }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border shadow-sm hover:shadow-md transition-all"
      >
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 amoled:text-indigo-400" />
          <span className="font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text">
            Review & Analytics
          </span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-slate-500 dark:text-dark-text-secondary amoled:text-amoled-text-secondary" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-4">
              <TodaysReviews prepEntries={prepEntries} onEditPrepEntry={onEditPrepEntry} subjects={subjects} />
              <PrepAnalytics prepEntries={prepEntries} />
              <TopicBreakdown prepEntries={prepEntries} subjects={subjects} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PrepLog: React.FC<PrepLogProps> = ({ 
  prepEntries, 
  subjects, 
  onAddPrepEntry, 
  onEditPrepEntry, 
  onDeletePrepEntry, 
  onAddSubject,
  onEditSubject,
  onDeleteSubject,
  loading = false 
}) => {
  const isMobile = useMediaQuery('(max-width: 1023px)');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [showSubjectManager, setShowSubjectManager] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    subject: '',
    confidence: [],
    timeRange: { min: 0, max: 24 },
    dateRange: { start: '', end: '' }
  });
  const [error, setError] = useState<string | null>(null);
  const [hasCreatedDefaultSubject, setHasCreatedDefaultSubject] = useState(false);
  
  // Create a default subject if none exist
  useEffect(() => {
    if (!hasCreatedDefaultSubject && subjects && subjects.length === 0 && onAddSubject) {
      onAddSubject({
        name: 'General Prep',
        description: 'Default subject for general preparation sessions'
      });
      setHasCreatedDefaultSubject(true);
    }
  }, [subjects, onAddSubject, hasCreatedDefaultSubject]);
  
  // Refs for keyboard navigation
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const logPrepButtonRef = useRef<HTMLButtonElement>(null);
  const subjectCardRefs = useRef<HTMLDivElement[]>([]);

  const confidenceOptions = [1, 2, 3, 4, 5];

  // Group entries by subject
  const entriesBySubject = useMemo(() => {
    const grouped: Record<string, PrepEntry[]> = {};
    prepEntries.forEach(entry => {
      if (!grouped[entry.subjectId]) {
        grouped[entry.subjectId] = [];
      }
      grouped[entry.subjectId].push(entry);
    });
    return grouped;
  }, [prepEntries]);

  // Create subject entries with sorted prep entries
  const subjectEntries = useMemo(() => {
    return Object.entries(entriesBySubject).map(([subjectId, entries]) => {
      // Sort entries by date, newest first
      const sortedEntries = [...entries].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      const subject = subjects.find(s => s.id === subjectId);
      return { subjectName: subject?.name || 'Uncategorized', subjectId, entries: sortedEntries };
    });
  }, [entriesBySubject, subjects]);

  const processedSubjectEntries = useMemo(() => {
    try {
      // Validate input
      if (!Array.isArray(subjectEntries)) {
        throw new Error('Invalid subject entries data provided');
      }
      
      // Filter subjects based on filters
      let filteredSubjects = subjectEntries.filter(({ subjectName, entries }) => {
        // Validate subject structure
        if (!subjectName || typeof subjectName !== 'string') {
          console.warn('Skipping subject with invalid name:', { subjectName, entries });
          return false;
        }
        
        // Validate entries
        if (!Array.isArray(entries) || entries.length === 0) {
          console.warn('Skipping subject with invalid entries:', { subjectName, entries });
          return false;
        }
        
        // Subject filter - case insensitive partial match
        if (filters.subject && !subjectName.toLowerCase().includes(filters.subject.toLowerCase())) return false;
        
        // Confidence filter - check if any entry matches
        if (filters.confidence.length > 0) {
          const hasMatchingConfidence = entries.some(entry => 
            filters.confidence.includes(entry.confidence)
          );
          if (!hasMatchingConfidence) return false;
        }
        
        // Time range filter - check if any entry matches
        const hasMatchingTime = entries.some(entry => 
          entry.time >= filters.timeRange.min && entry.time <= filters.timeRange.max
        );
        if (!hasMatchingTime) return false;
        
        // Date range filter - check if any entry matches
        const hasMatchingDate = entries.some(entry => {
          const entryDate = new Date(entry.date);
          // Check if entryDate is valid
          if (isNaN(entryDate.getTime())) {
            console.warn('Skipping entry with invalid date:', entry);
            return false;
          }
          
          if (filters.dateRange.start) {
            const startDate = new Date(filters.dateRange.start);
            // Check if startDate is valid
            if (isNaN(startDate.getTime()) || entryDate < startDate) return false;
          }
          
          if (filters.dateRange.end) {
            const endDate = new Date(filters.dateRange.end);
            // Check if endDate is valid
            if (isNaN(endDate.getTime()) || entryDate > endDate) return false;
          }
          
          return true;
        });
        
        return hasMatchingDate;
      });
      
      // Sort subjects
      return filteredSubjects.sort((a, b) => {
        if (sortField === 'subject') {
          return sortDirection === 'asc' 
            ? a.subjectName.localeCompare(b.subjectName) 
            : b.subjectName.localeCompare(a.subjectName);
        }
        
        // For other sort fields, use the latest entry in each subject
        const aLatest = a.entries[0];
        const bLatest = b.entries[0];
        
        // Validate entries exist
        if (!aLatest || !bLatest) {
          return 0;
        }
        
        let aValue: any = aLatest[sortField as keyof PrepEntry];
        let bValue: any = bLatest[sortField as keyof PrepEntry];
        
        if (sortField === 'date') {
          aValue = new Date(aLatest.date).getTime();
          bValue = new Date(bLatest.date).getTime();
        }
        
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    } catch (error) {
      console.error('Error processing subject entries:', error);
      setError('Failed to process subjects. Please try again.');
      return [];
    }
  }, [subjectEntries, filters, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    try {
      if (sortField === field) {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
      } else {
        setSortField(field);
        setSortDirection('desc');
      }
    } catch (error) {
      console.error('Error handling sort:', error);
      setError('Failed to sort entries. Please try again.');
    }
  };

  const handleConfidenceFilter = (level: number) => {
    try {
      if (typeof level !== 'number' || level < 1 || level > 5) {
        throw new Error('Invalid confidence level');
      }
      
      setFilters(prev => ({
        ...prev,
        confidence: prev.confidence.includes(level)
          ? prev.confidence.filter(c => c !== level)
          : [...prev.confidence, level],
      }));
    } catch (error) {
      console.error('Error handling confidence filter:', error);
      setError('Failed to apply confidence filter. Please try again.');
    }
  };

  const clearFilters = () => {
    try {
      setFilters({ subject: '', confidence: [], timeRange: { min: 0, max: 24 }, dateRange: { start: '', end: '' } });
      setError(null); // Clear any existing errors
    } catch (error) {
      console.error('Error clearing filters:', error);
      setError('Failed to clear filters. Please try again.');
    }
  };

  const hasActiveFilters = filters.subject || filters.confidence.length > 0 || filters.timeRange.min > 0 || filters.timeRange.max < 24 || filters.dateRange.start || filters.dateRange.end;

  // Calculate stats
  const totalHours = useMemo(() => {
    try {
      return prepEntries.reduce((sum, entry) => {
        // Validate entry
        if (typeof entry.time !== 'number' || isNaN(entry.time)) {
          console.warn('Skipping entry with invalid time:', entry);
          return sum;
        }
        return sum + entry.time;
      }, 0);
    } catch (error) {
      console.error('Error calculating total hours:', error);
      setError('Failed to calculate stats. Please try again.');
      return 0;
    }
  }, [prepEntries]);

  const averageConfidence = useMemo(() => {
    try {
      if (prepEntries.length === 0) return 0;
      const sum = prepEntries.reduce((sum, entry) => {
        // Validate entry
        if (typeof entry.confidence !== 'number' || isNaN(entry.confidence)) {
          console.warn('Skipping entry with invalid confidence:', entry);
          return sum;
        }
        return sum + entry.confidence;
      }, 0);
      return Math.round((sum / prepEntries.length) * 10) / 10;
    } catch (error) {
      console.error('Error calculating average confidence:', error);
      setError('Failed to calculate stats. Please try again.');
      return 0;
    }
  }, [prepEntries]);

  // Calculate additional stats for the dashboard
  const currentStreak = useMemo(() => {
    if (!prepEntries || prepEntries.length === 0) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    let currentDate = new Date(today);
    
    // Create a set of dates with prep entries
    const prepDates = new Set(prepEntries.map(entry => {
      const date = new Date(entry.date);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    }));
    
    // Count consecutive days
    while (prepDates.has(currentDate.getTime())) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  }, [prepEntries]);

  const avgHoursPerDay = useMemo(() => {
    if (!prepEntries || prepEntries.length === 0) return 0;
    
    const uniqueDates = new Set(prepEntries.map(entry => new Date(entry.date).toDateString()));
    const totalHours = prepEntries.reduce((sum, entry) => sum + entry.time, 0);
    return uniqueDates.size > 0 ? totalHours / uniqueDates.size : 0;
  }, [prepEntries]);

  if (loading) {
    return <PrepLogSkeleton />;
  }

  // Error state for invalid data
  if (!Array.isArray(prepEntries)) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-lg shadow-sm p-6">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-slate-800 dark:text-dark-text amoled:text-amoled-text mb-2">Error Loading Data</h3>
        <p className="text-slate-600 dark:text-slate-400 amoled:text-slate-500 text-center mb-4">
          There was an error loading your prep entries. Please try refreshing the page.
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  // Display error message if there's an error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-lg shadow-sm p-6">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-slate-800 dark:text-dark-text amoled:text-amoled-text mb-2">Something Went Wrong</h3>
        <p className="text-slate-600 dark:text-slate-400 amoled:text-slate-500 text-center mb-4">
          {error}
        </p>
        <div className="flex gap-3">
          <button 
            onClick={() => setError(null)} 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  const dashboardSidebar = (
    <aside className="lg:col-span-1 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card p-4 rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 amoled:text-slate-500">Total Hours</span>
          </div>
          <p className="text-xl font-bold text-slate-800 dark:text-dark-text amoled:text-amoled-text">{totalHours.toFixed(1)}</p>
        </div>
        <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card p-4 rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 amoled:text-slate-500">Avg. Confidence</span>
          </div>
          <p className="text-xl font-bold text-slate-800 dark:text-dark-text amoled:text-amoled-text">{averageConfidence}</p>
        </div>
        <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card p-4 rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 amoled:text-slate-500">Current Streak</span>
          </div>
          <p className="text-xl font-bold text-slate-800 dark:text-dark-text amoled:text-amoled-text">{currentStreak} days</p>
        </div>
        <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card p-4 rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-green-500 dark:text-green-400" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 amoled:text-slate-500">Avg. Hours/Day</span>
          </div>
          <p className="text-xl font-bold text-slate-800 dark:text-dark-text amoled:text-amoled-text">{avgHoursPerDay.toFixed(1)}</p>
        </div>
      </div>
      
      <TodaysReviews prepEntries={prepEntries} onEditPrepEntry={onEditPrepEntry} subjects={subjects} />
      <PrepAnalytics prepEntries={prepEntries} />
      <TopicBreakdown prepEntries={prepEntries} subjects={subjects} />
    </aside>
  );

  // Keyboard navigation handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Escape key to close modals
      if (e.key === 'Escape') {
        if (showFilters) {
          setShowFilters(false);
          filterButtonRef.current?.focus();
        } else if (showSubjectManager) {
          setShowSubjectManager(false);
        }
        return;
      }
      
      // Handle Ctrl/Cmd + K for quick filters
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowFilters(prev => !prev);
        if (!showFilters) {
          setTimeout(() => {
            const subjectInput = document.querySelector('input[placeholder="Search subjects..."]') as HTMLInputElement;
            subjectInput?.focus();
          }, 100);
        }
        return;
      }
      
      // Handle Ctrl/Cmd + N for new prep
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        onAddPrepEntry();
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showFilters, showSubjectManager, onAddPrepEntry]);

  return (
    <div className="bg-slate-50 dark:bg-dark-bg amoled:bg-amoled-bg min-h-full">
      <div className="container mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-dark-text amoled:text-amoled-text">
              <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50">
                <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              Prep Dashboard
              <SimpleTooltip content="Log study sessions, track confidence levels, and use spaced repetition for interview prep.">
                <button className="p-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors">
                  <HelpCircle className="w-4 h-4" />
                </button>
              </SimpleTooltip>
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 amoled:text-slate-500">
              Track your learning progress and review schedules
            </p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }} 
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowSubjectManager(true)}
              className="bg-white dark:bg-dark-card amoled:bg-amoled-card text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary px-4 py-2 rounded-lg font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-700 amoled:hover:bg-slate-700/20 transition-all flex items-center gap-2 border border-slate-300 dark:border-dark-border amoled:border-amoled-border shadow-sm"
            >
              <FolderOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Manage Subjects</span>
              <span className="sm:hidden">Subjects</span>
            </motion.button>
            <motion.button
              ref={filterButtonRef}
              whileHover={{ scale: 1.03 }} 
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 shadow-sm ${
                hasActiveFilters 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                  : 'bg-white dark:bg-dark-card amoled:bg-amoled-card border border-slate-300 dark:border-dark-border amoled:border-amoled-border text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary hover:bg-slate-50 dark:hover:bg-slate-700 amoled:hover:bg-slate-700/20'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="bg-white/20 dark:bg-dark-bg/30 rounded-full px-2 py-0.5 text-xs">
                  {filters.confidence.length + (filters.subject ? 1 : 0) + (filters.dateRange.start || filters.dateRange.end ? 1 : 0)}
                </span>
              )}
            </motion.button>
            {hasActiveFilters && (
              <motion.button
                whileHover={{ scale: 1.03 }} 
                whileTap={{ scale: 0.98 }}
                onClick={clearFilters}
                className="px-3 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-1 shadow-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                title="Clear all filters"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Clear</span>
              </motion.button>
            )}
            <motion.button
              ref={logPrepButtonRef}
              whileHover={{ scale: 1.03 }} 
              whileTap={{ scale: 0.98 }}
              onClick={onAddPrepEntry}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Log Prep</span>
              <span className="sm:hidden">Log</span>
            </motion.button>
          </div>
        </div>

        {isMobile && (
          <MobileSidebarCollapsible 
            prepEntries={prepEntries}
            onEditPrepEntry={onEditPrepEntry}
            subjects={subjects}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-6">
          <main className="lg:col-span-2 space-y-6">
            {/* Filter Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }} 
                  className="border border-slate-200 dark:border-dark-border amoled:border-amoled-border rounded-xl p-4 sm:p-6 mb-6 bg-slate-50 dark:bg-dark-card amoled:bg-amoled-card"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    {/* Subject Filter */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-dark-text amoled:text-amoled-text mb-2">
                        Subject
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <BookOpen className="h-4 w-4 text-slate-400 dark:text-slate-500 amoled:text-slate-600" />
                        </div>
                        <input
                          type="text"
                          value={filters.subject}
                          onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
                          placeholder="Search subjects..."
                          className="pl-10 w-full rounded-lg border border-slate-300 dark:border-dark-border amoled:border-amoled-border bg-white dark:bg-dark-bg amoled:bg-amoled-bg px-3 py-2 text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 amoled:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 amoled:focus:border-indigo-400 transition-all"
                        />
                      </div>
                    </div>
                    
                    {/* Confidence Filter */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-dark-text amoled:text-amoled-text mb-2">
                        Confidence Level
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {confidenceOptions.map(level => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => handleConfidenceFilter(level)}
                            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all ${
                              filters.confidence.includes(level)
                                ? 'bg-indigo-600 dark:bg-indigo-500 amoled:bg-indigo-600 text-white shadow-sm'
                                : 'bg-white dark:bg-dark-bg amoled:bg-amoled-bg text-slate-700 dark:text-dark-text amoled:text-amoled-text hover:bg-slate-100 dark:hover:bg-slate-700 amoled:hover:bg-slate-900 border border-slate-200 dark:border-dark-border amoled:border-amoled-border'
                            }`}
                            aria-pressed={filters.confidence.includes(level)}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Date Range Filter */}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-dark-text amoled:text-amoled-text mb-2">
                        Date Range
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-4 w-4 text-slate-400 dark:text-slate-500 amoled:text-slate-600" />
                          </div>
                          <input
                            type="date"
                            value={filters.dateRange.start}
                            onChange={(e) => {
                              try {
                                const dateValue = e.target.value;
                                // Validate date format
                                if (dateValue && isNaN(Date.parse(dateValue))) {
                                  setError('Invalid start date format');
                                  return;
                                }
                                setFilters(prev => ({
                                  ...prev,
                                  dateRange: { ...prev.dateRange, start: dateValue }
                                }));
                                setError(null); // Clear any existing errors
                              } catch (error) {
                                console.error('Error handling start date change:', error);
                                setError('Failed to update start date. Please try again.');
                              }
                            }}
                            className="pl-10 w-full rounded-lg border border-slate-300 dark:border-dark-border amoled:border-amoled-border bg-white dark:bg-dark-bg amoled:bg-amoled-bg px-3 py-2 text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 amoled:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 amoled:focus:border-indigo-400 transition-all text-sm"
                          />
                        </div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-4 w-4 text-slate-400 dark:text-slate-500 amoled:text-slate-600" />
                          </div>
                          <input
                            type="date"
                            value={filters.dateRange.end}
                            onChange={(e) => {
                              try {
                                const dateValue = e.target.value;
                                // Validate date format
                                if (dateValue && isNaN(Date.parse(dateValue))) {
                                  setError('Invalid end date format');
                                  return;
                                }
                                setFilters(prev => ({
                                  ...prev,
                                  dateRange: { ...prev.dateRange, end: dateValue }
                                }));
                                setError(null); // Clear any existing errors
                              } catch (error) {
                                console.error('Error handling end date change:', error);
                                setError('Failed to update end date. Please try again.');
                              }
                            }}
                            className="pl-10 w-full rounded-lg border border-slate-300 dark:border-dark-border amoled:border-amoled-border bg-white dark:bg-dark-bg amoled:bg-amoled-bg px-3 py-2 text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 amoled:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 amoled:focus:border-indigo-400 transition-all text-sm"
                          />
                        </div>
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

            {/* Controls and Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border shadow-sm p-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-dark-text amoled:text-amoled-text">
                  Prep Subjects
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 amoled:text-slate-500">
                  {processedSubjectEntries.length} subject{processedSubjectEntries.length !== 1 ? 's' : ''}
                </p>
                {subjects && subjects.length === 0 && (
                  <p className="text-sm text-amber-600 dark:text-amber-400 amoled:text-amber-500 mt-1">
                    Create your first subject to organize your prep sessions
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-600 dark:text-slate-400 amoled:text-slate-500">Sort by:</span>
                  <select
                    value={sortField}
                    onChange={(e) => handleSort(e.target.value as SortField)}
                    className="bg-white dark:bg-dark-card amoled:bg-amoled-card border border-slate-300 dark:border-slate-600 amoled:border-amoled-border rounded-lg py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-dark-text amoled:text-amoled-text text-sm"
                    aria-label="Sort by"
                  >
                    <option value="date">Date</option>
                    <option value="subject">Subject</option>
                    <option value="time">Time</option>
                    <option value="confidence">Confidence</option>
                  </select>
                </div>
                <button
                  onClick={() => handleSort(sortField)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 amoled:hover:bg-slate-700/50 transition-colors"
                  aria-label={sortDirection === 'asc' ? 'Sort descending' : 'Sort ascending'}
                >
                  {sortDirection === 'asc' ? (
                    <SortAsc className="w-4 h-4 text-slate-600 dark:text-slate-400 amoled:text-slate-500" />
                  ) : (
                    <SortDesc className="w-4 h-4 text-slate-600 dark:text-slate-400 amoled:text-slate-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Entries List */}
            <motion.div className="space-y-4" variants={listVariants} initial="hidden" animate="visible">
              <AnimatePresence>
                {processedSubjectEntries.map(({ subjectName, subjectId, entries }, index) => (
                  <motion.div 
                    key={subjectId} 
                    variants={itemVariants} 
                    layout
                    ref={(el) => {
                      if (el) {
                        subjectCardRefs.current[index] = el;
                      }
                    }}
                  >
                    <PrepLogSubjectCard 
                      subjectName={subjectName}
                      entries={entries}
                      onEditPrepEntry={onEditPrepEntry} 
                      onDeletePrepEntry={onDeletePrepEntry}
                      onLogNewPrep={() => onAddPrepEntry()} // Simplified for now
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            
            {processedSubjectEntries.length === 0 && (
              <div className="pt-10">
                <EmptyState
                  title={hasActiveFilters ? "No Entries Match Filters" : (subjects && subjects.length === 0 ? "No Subjects Created" : "No Prep Entries Logged")}
                  message={
                    hasActiveFilters 
                      ? "Try adjusting your filters to see more results." 
                      : (subjects && subjects.length === 0 
                          ? "Create your first subject to organize your prep sessions." 
                          : "Log your first prep entry to see it appear here.")
                  }
                  buttonText={subjects && subjects.length === 0 ? "Create Subject" : "Log First Prep Entry"}
                  onButtonClick={subjects && subjects.length === 0 ? () => setShowSubjectManager(true) : onAddPrepEntry}
                  icon={<BookOpen className="w-12 h-12 text-slate-400" />}
                />
              </div>
            )}
          </main>

          {/* Sidebar */}
          {!isMobile && dashboardSidebar}
        </div>
      </div>

      {/* Subject Manager Modal */}
      <AnimatePresence>
        {showSubjectManager && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden"
            >
              <SubjectManager
                subjects={subjects || []}
                onAddSubject={onAddSubject}
                onEditSubject={onEditSubject}
                onDeleteSubject={onDeleteSubject}
                onClose={() => setShowSubjectManager(false)}
                onSelectSubject={(subject) => {
                  setShowSubjectManager(false);
                }}
                loading={loading}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default React.memo(PrepLog);