import React, { useMemo } from 'react';
import { PrepEntry } from '../../../types';
import { BookOpen, ChevronRight, Calendar, HelpCircle } from 'lucide-react';

interface TodaysReviewsProps {
  prepEntries: PrepEntry[];
  onEditPrepEntry: (entry: PrepEntry) => void;
}

const TodaysReviews: React.FC<TodaysReviewsProps> = ({ prepEntries, onEditPrepEntry }) => {
  const dueTopics = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const dueEntries = new Map<string, PrepEntry>();

    for (const entry of prepEntries) {
      // Validate that entry has required properties
      if (!entry.topic || !entry.date) continue;
      
      // Validate nextReviewDate exists and is valid
      if (entry.nextReviewDate) {
        // Validate that dates are properly formatted
        const entryDate = new Date(entry.date);
        const nextReviewDate = new Date(entry.nextReviewDate);
        const todayDate = new Date(today);
        
        // Check if dates are valid
        if (isNaN(entryDate.getTime()) || isNaN(nextReviewDate.getTime()) || isNaN(todayDate.getTime())) {
          continue;
        }
        
        // Check if review is due (nextReviewDate is today or in the past)
        if (nextReviewDate <= todayDate) {
          const existing = dueEntries.get(entry.topic);
          // If there's an existing entry for this topic, keep the more recent one
          if (!existing || new Date(entry.date) > new Date(existing.date)) {
            dueEntries.set(entry.topic, entry);
          }
        }
      }
    }

    return Array.from(dueEntries.values());
  }, [prepEntries]);

  if (prepEntries.length === 0) {
    return (
      <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card p-5 rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 amoled:bg-amber-900/20">
            <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400 amoled:text-amber-500" />
          </div>
          <h3 className="font-semibold text-slate-800 dark:text-dark-text amoled:text-amoled-text">
            Today's Reviews
          </h3>
          <div className="ml-auto relative group">
            <HelpCircle className="w-5 h-5 text-slate-400 dark:text-slate-500 amoled:text-slate-600 cursor-help" />
            <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-white dark:bg-dark-card amoled:bg-amoled-card border border-slate-200 dark:border-dark-border amoled:border-amoled-border rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10">
              <p className="text-sm text-slate-700 dark:text-dark-text amoled:text-amoled-text">
                Based on your confidence levels, these topics are due for review today using spaced repetition.
              </p>
            </div>
          </div>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 amoled:text-slate-500 text-center py-4">
          Log your first prep session to see review schedules.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card p-5 rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 amoled:bg-amber-900/20">
          <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400 amoled:text-amber-500" />
        </div>
        <h3 className="font-semibold text-slate-800 dark:text-dark-text amoled:text-amoled-text">
          Today's Reviews
        </h3>
        {dueTopics.length > 0 && (
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold dark:bg-indigo-900/30 dark:text-indigo-200 amoled:bg-indigo-900/20 amoled:text-indigo-300">
            {dueTopics.length}
          </span>
        )}
        <div className="ml-auto relative group">
          <HelpCircle className="w-5 h-5 text-slate-400 dark:text-slate-500 amoled:text-slate-600 cursor-help" />
          <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-white dark:bg-dark-card amoled:bg-amoled-card border border-slate-200 dark:border-dark-border amoled:border-amoled-border rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10">
            <p className="text-sm text-slate-700 dark:text-dark-text amoled:text-amoled-text">
              Based on your confidence levels, these topics are due for review today using spaced repetition.
            </p>
          </div>
        </div>
      </div>
      
      {dueTopics.length > 0 ? (
        <ul className="space-y-2">
          {dueTopics.map(entry => (
            <li 
              key={entry.id} 
              className="flex items-center justify-between p-3 bg-slate-50 dark:bg-dark-bg/50 amoled:bg-amoled-bg/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 dark:text-dark-text amoled:text-amoled-text truncate">
                  {entry.topic}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 amoled:text-slate-500 mt-1">
                  Last studied: {new Date(entry.date).toLocaleDateString()}
                </p>
              </div>
              <button 
                onClick={() => onEditPrepEntry(entry)}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 amoled:text-indigo-500 hover:text-indigo-800 dark:hover:text-indigo-300 amoled:hover:text-indigo-400 p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 amoled:hover:bg-indigo-900/20"
              >
                Review
                <ChevronRight className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-6">
          <div className="mx-auto w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
            <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-sm font-medium text-slate-800 dark:text-dark-text amoled:text-amoled-text mb-1">
            All caught up!
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 amoled:text-slate-500">
            No topics due for review today.
          </p>
        </div>
      )}
    </div>
  );
};

export default TodaysReviews;