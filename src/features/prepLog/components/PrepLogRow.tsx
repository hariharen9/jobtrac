import React from 'react';
import { ExternalLink, Star, Trash2, Pencil } from 'lucide-react';
import { PrepEntry } from '../../../types';

interface PrepLogRowProps {
  entry: PrepEntry;
  onEditPrepEntry: (entry: PrepEntry) => void;
  onDeletePrepEntry: (id: string) => void;
}

const PrepLogRow: React.FC<PrepLogRowProps> = ({ entry, onEditPrepEntry, onDeletePrepEntry }) => {
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

  return (
    <tr className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
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
  );
};

export default React.memo(PrepLogRow);
