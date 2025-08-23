import React from 'react';
import { BookOpen, Plus } from 'lucide-react';
import { PrepEntry } from '../../../types';
import PrepLogRow from './PrepLogRow';
import PrepLogCard from './PrepLogCard';
import { useMediaQuery } from '../../../hooks/shared/useMediaQuery';

interface PrepLogProps {
  prepEntries: PrepEntry[];
  onAddPrepEntry: () => void;
  onEditPrepEntry: (entry: PrepEntry) => void;
  onDeletePrepEntry: (id: string) => void;
  loading?: boolean;
}

const PrepLog: React.FC<PrepLogProps> = ({ prepEntries, onAddPrepEntry, onEditPrepEntry, onDeletePrepEntry, loading = false }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
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
    <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
        <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-5 h-5" />
          My Prep Log
        </h2>
        <button
          onClick={onAddPrepEntry}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2 justify-center sm:justify-start w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Add Prep Entry
        </button>
      </div>
      {isMobile ? (
        <div className="space-y-4">
          {prepEntries.map(entry => (
            <PrepLogCard 
              key={entry.id} 
              entry={entry} 
              onEditPrepEntry={onEditPrepEntry} 
              onDeletePrepEntry={onDeletePrepEntry} 
            />
          ))}
          {prepEntries.length === 0 && (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              No prep entries yet. Click "Add Prep Entry" to start tracking your preparation!
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
            <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">Topic</th>
                <th scope="col" className="px-6 py-3">Problems Solved</th>
                <th scope="col" className="px-6 py-3">Time (Hrs)</th>
                <th scope="col" className="px-6 py-3">Confidence (1-5)</th>
                <th scope="col" className="px-6 py-3">Key Takeaways</th>
                <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {prepEntries.map(entry => (
                <PrepLogRow 
                  key={entry.id} 
                  entry={entry} 
                  onEditPrepEntry={onEditPrepEntry} 
                  onDeletePrepEntry={onDeletePrepEntry} 
                />
              ))}
              {prepEntries.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    No prep entries yet. Click "Add Prep Entry" to start tracking your preparation!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default React.memo(PrepLog);