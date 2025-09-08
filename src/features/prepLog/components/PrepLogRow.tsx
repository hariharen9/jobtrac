import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Star, Trash2, Pencil } from 'lucide-react';
import { PrepEntry } from '../../../types';
import ConfirmationModal from '../../../components/shared/ConfirmationModal';

interface PrepLogRowProps {
  entry: PrepEntry;
  onEditPrepEntry: (entry: PrepEntry) => void;
  onDeletePrepEntry: (id: string) => void;
}

const PrepLogRow: React.FC<PrepLogRowProps> = ({ entry, onEditPrepEntry, onDeletePrepEntry }) => {
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);

  const handleDeleteClick = () => {
    setConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    onDeletePrepEntry(entry.id as string);
    setConfirmModalOpen(false);
  };

  const renderConfidenceStars = (confidence: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= confidence ? 'text-yellow-400 fill-current' : 'text-slate-300 dark:text-dark-text-secondary amoled:text-amoled-text-secondary'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <td className="px-6 py-6">{entry.date}</td>
      <td className="px-6 py-6 font-medium text-slate-900 dark:text-dark-text amoled:text-amoled-text">{entry.topic}</td>
      <td className="px-6 py-6">
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
      <td className="px-6 py-6">{entry.time}</td>
      <td className="px-6 py-6">{renderConfidenceStars(entry.confidence)}</td>
      <td className="px-6 py-6">{entry.notes}</td>
      <td className="px-6 py-6 text-right">
        <div className="flex items-center justify-end gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEditPrepEntry(entry)}
            className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            aria-label="Edit prep entry"
          >
            <Pencil className="w-4 h-4" />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDeleteClick}
            className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            aria-label="Delete prep entry"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </td>
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Prep Entry"
        message={`Are you sure you want to delete the prep entry for ${entry.topic}? This action cannot be undone.`}
      />
    </>
  );
};

export default React.memo(PrepLogRow);
