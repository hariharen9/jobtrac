import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Plus, Filter, SortAsc, SortDesc, X, HelpCircle } from 'lucide-react';
import { StarStory } from '../../../types';
import StarStoryCard from './StarStoryCard';
import EmptyState from '../../../components/shared/EmptyState';
import SimpleTooltip from '../../../components/shared/SimpleTooltip';

type SortField = 'title' | 'createdAt';
type SortDirection = 'asc' | 'desc';

interface FilterOptions {
  title: string;
  situation: string;
  createdAt: {
    start: string;
    end: string;
  };
}

interface StarStoriesProps {
  stories: StarStory[];
  onAddStory: () => void;
  onEditStory: (story: StarStory) => void;
  onDeleteStory: (id: string) => void;
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

const StarStories: React.FC<StarStoriesProps> = ({ stories, onAddStory, onEditStory, onDeleteStory, loading = false }) => {
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    title: '',
    situation: '',
    createdAt: {
      start: '',
      end: ''
    }
  });

  // Sorting function
  const sortStories = (storyList: StarStory[]) => {
    return [...storyList].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'createdAt':
          aValue = ((a.createdAt as any)?.toDate ? (a.createdAt as any).toDate() : new Date(a.createdAt as any)).getTime();
          bValue = ((b.createdAt as any)?.toDate ? (b.createdAt as any).toDate() : new Date(b.createdAt as any)).getTime();
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
  const filterStories = (storyList: StarStory[]) => {
    return storyList.filter(story => {
      // Title filter
      if (filters.title && !story.title.toLowerCase().includes(filters.title.toLowerCase())) {
        return false;
      }

      // Situation filter
      if (filters.situation && !story.situation.toLowerCase().includes(filters.situation.toLowerCase())) {
        return false;
      }

      // Date range filter
      if (filters.createdAt.start || filters.createdAt.end) {
        const storyDate = (story.createdAt as any)?.toDate ? (story.createdAt as any).toDate() : new Date(story.createdAt as any);
        if (filters.createdAt.start && storyDate < new Date(filters.createdAt.start)) {
          return false;
        }
        if (filters.createdAt.end && storyDate > new Date(filters.createdAt.end)) {
          return false;
        }
      }

      return true;
    });
  };

  // Combined sorting and filtering
  const processedStories = useMemo(() => {
    const filtered = filterStories(stories);
    return sortStories(filtered);
  }, [stories, sortField, sortDirection, filters]);

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
      title: '',
      situation: '',
      createdAt: {
        start: '',
        end: ''
      }
    });
  };

  const hasActiveFilters = filters.title || filters.situation || filters.createdAt.start || filters.createdAt.end;



  if (loading) {
    return (
      <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-900 dark:text-dark-text amoled:text-amoled-text">
            <Star className="w-5 h-5" />
            Behavioral Story Bank (STAR Method)
          </h2>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-slate-600 dark:text-slate-400">Loading stories...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card p-6 rounded-xl shadow-sm border border-slate-200/50 dark:border-slate-700/50">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-2">
              <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 amoled:bg-indigo-900/30">
                <Star className="w-6 h-6 text-indigo-600 dark:text-indigo-400 amoled:text-indigo-500" />
              </div>
              Behavioral Story Bank (STAR Method)
              <SimpleTooltip content="Build compelling stories using Situation, Task, Action, Result format for behavioral interviews.">
                <button className="p-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors">
                  <HelpCircle className="w-4 h-4" />
                </button>
              </SimpleTooltip>
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Build compelling stories using the STAR framework
              {processedStories.length !== stories.length && (
                <span className="ml-2 text-sm">
                  (Showing {processedStories.length} of {stories.length})
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
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
              onClick={onAddStory} 
              className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-all duration-200 flex items-center gap-2 shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4" /> Add Story
            </motion.button>
          </div>
        </div>


      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card p-6 rounded-xl shadow-sm border border-slate-200/50 dark:border-slate-700/50">

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border border-slate-200 dark:border-dark-border amoled:border-amoled-border rounded-xl p-4 sm:p-6 mb-6 bg-slate-50 dark:bg-dark-card amoled:bg-amoled-card"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Title Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-dark-text amoled:text-amoled-text mb-2">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Filter by title..."
                  value={filters.title}
                  onChange={(e) => setFilters(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-slate-300 dark:border-dark-border amoled:border-amoled-border rounded-lg text-sm bg-white dark:bg-dark-bg amoled:bg-amoled-bg text-slate-900 dark:text-dark-text amoled:text-amoled-text placeholder-slate-500 dark:placeholder-slate-400 amoled:placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 amoled:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 amoled:focus:border-indigo-400 transition-all"
                />
              </div>

              {/* Situation Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-dark-text amoled:text-amoled-text mb-2">
                  Situation
                </label>
                <input
                  type="text"
                  placeholder="Filter by situation..."
                  value={filters.situation}
                  onChange={(e) => setFilters(prev => ({ ...prev, situation: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-slate-300 dark:border-dark-border amoled:border-amoled-border rounded-lg text-sm bg-white dark:bg-dark-bg amoled:bg-amoled-bg text-slate-900 dark:text-dark-text amoled:text-amoled-text placeholder-slate-500 dark:placeholder-slate-400 amoled:placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 amoled:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 amoled:focus:border-indigo-400 transition-all"
                />
              </div>

              {/* Date Range Filter */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-dark-text amoled:text-amoled-text mb-2">
                  Date Range
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    placeholder="From"
                    value={filters.createdAt.start}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      createdAt: { ...prev.createdAt, start: e.target.value }
                    }))}
                    className="px-3 py-2.5 border border-slate-300 dark:border-dark-border amoled:border-amoled-border rounded-lg text-sm bg-white dark:bg-dark-bg amoled:bg-amoled-bg text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 amoled:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 amoled:focus:border-indigo-400 transition-all"
                  />
                  <input
                    type="date"
                    placeholder="To"
                    value={filters.createdAt.end}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      createdAt: { ...prev.createdAt, end: e.target.value }
                    }))}
                    className="px-3 py-2.5 border border-slate-300 dark:border-dark-border amoled:border-amoled-border rounded-lg text-sm bg-white dark:bg-dark-bg amoled:bg-amoled-bg text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 amoled:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 amoled:focus:border-indigo-400 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Clear Filters */}
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

      {/* Sort Controls */}
      <div className="flex items-center gap-2 mb-4 text-sm">
        <span className="text-slate-600 dark:text-slate-400">Sort by:</span>
        {(['title', 'createdAt'] as SortField[]).map(field => (
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
        className="space-y-6"
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {processedStories.map(story => (
            <motion.div key={story.id} variants={itemVariants} layout>
              <StarStoryCard 
                story={story} 
                onEditStory={onEditStory} 
                onDeleteStory={onDeleteStory} 
              />
            </motion.div>
          ))}
        </AnimatePresence>
        {processedStories.length === 0 && stories.length > 0 && (
          <div className="text-center py-8">
            <p className="text-slate-500 dark:text-slate-400 mb-4">No stories match the current filters.</p>
            <button
              onClick={clearFilters}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}
        {stories.length === 0 && (
          <EmptyState
            title="No Behavioral Stories Yet"
            message="Start building your STAR method story bank by adding your first story. Be prepared for any interview question!"
            buttonText="Add Story"
            onButtonClick={onAddStory}
            icon={<Star className="w-8 h-8 text-indigo-600" />}
          />
        )}
      </motion.div>
    </div>
    </div>
  );
};

export default React.memo(StarStories);