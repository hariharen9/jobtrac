import React from 'react';
import { BookOpen, Plus, ExternalLink, Star, Trash2, Pencil } from 'lucide-react';
import { PrepEntry } from '../../../types';

interface PrepLogProps {
  prepEntries: PrepEntry[];
  onAddPrepEntry: () => void;
  onEditPrepEntry: (entry: PrepEntry) => void;
  onDeletePrepEntry: (id: string) => void;
  loading?: boolean;
}

const PrepLog: React.FC<PrepLogProps> = ({ prepEntries, onAddPrepEntry, onEditPrepEntry, onDeletePrepEntry, loading = false }) => {
  const renderConfidenceStars = (confidence: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= confidence ? 'text-yellow-400 fill-current' : 'text-slate-300 dark:text-slate-600'}`}
          />
        ))}
      </div>
    );
  };

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
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-5 h-5" />
          My Prep Log
        </h2>
        <button
          onClick={onAddPrepEntry}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Prep Entry
        </button>
      </div>
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
              <tr key={entry.id} className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <td className="px-6 py-4">{entry.date}</td>
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{entry.topic}</td>
                <td className="px-6 py-4">
                  {entry.problems ? (
                    <a
                      href={entry.problems}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline text-indigo-600 dark:text-indigo-400 flex items-center gap-1"
                    >
                      View Problem
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-6 py-4">{entry.time}</td>
                <td className="px-6 py-4">{renderConfidenceStars(entry.confidence)}</td>
                <td className="px-6 py-4">{entry.notes}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEditPrepEntry(entry)}
                      className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      aria-label="Edit prep entry"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDeletePrepEntry(entry.id as string)}
                      className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      aria-label="Delete prep entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
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
    </div>
  );
};

export default PrepLog;