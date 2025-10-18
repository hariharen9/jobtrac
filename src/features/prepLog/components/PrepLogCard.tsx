import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PrepEntry } from '../../../types';
import { Pencil, Trash2, Clock, Link as LinkIcon, CheckCircle, Circle, BookOpen, ChevronDown, Star, Calendar } from 'lucide-react';
import ConfirmationModal from '../../../components/shared/ConfirmationModal';

interface PrepLogCardProps {
  entry: PrepEntry;
  relatedEntries: PrepEntry[]; // New prop for related entries
  onEditPrepEntry: (entry: PrepEntry) => void;
  onDeletePrepEntry: (id: string) => void;
  onLogAnotherSession: (topic: string) => void;
}

const ConfidenceBadge: React.FC<{ level: number }> = ({ level }) => {
  const confidenceMap = {
    1: { text: 'Very Low', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 amoled:bg-red-900/40 amoled:text-red-400' },
    2: { text: 'Low', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 amoled:bg-orange-900/40 amoled:text-orange-400' },
    3: { text: 'Medium', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 amoled:bg-yellow-900/40 amoled:text-yellow-400' },
    4: { text: 'High', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 amoled:bg-green-900/40 amoled:text-green-400' },
    5: { text: 'Very High', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 amoled:bg-blue-900/40 amoled:text-blue-400' },
  };
  const { text, color } = confidenceMap[level as keyof typeof confidenceMap] || confidenceMap[3];
  return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${color}`}>{text}</span>;
};

// Component to display related entries in a compact format
const RelatedEntriesList: React.FC<{ entries: PrepEntry[] }> = ({ entries }) => {
  // Sort entries by date, newest first
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-3 mt-3">
      <h4 className="font-medium text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary text-sm">
        Previous Sessions ({entries.length})
      </h4>
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
        {sortedEntries.map((entry) => {
          const displayDate = entry.date ? new Date(entry.date).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric'
          }) : 'Invalid Date';
          
          return (
            <div 
              key={entry.id} 
              className="flex items-center justify-between p-3 bg-slate-50 dark:bg-dark-bg/30 amoled:bg-amoled-bg/30 rounded-lg border border-slate-200 dark:border-dark-border/50 amoled:border-amoled-border/50"
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400 amoled:text-slate-500" />
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-dark-text amoled:text-amoled-text">{displayDate}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                      {entry.time}h
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < entry.confidence
                              ? 'text-yellow-400 fill-current'
                              : 'text-slate-300 dark:text-slate-600 amoled:text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PrepLogCard: React.FC<PrepLogCardProps> = ({ entry, relatedEntries, onEditPrepEntry, onDeletePrepEntry, onLogAnotherSession }) => {
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [resourcesExpanded, setResourcesExpanded] = useState(false);
  const [relatedEntriesExpanded, setRelatedEntriesExpanded] = useState(false); // New state for related entries expansion

  const handleDeleteClick = () => setConfirmModalOpen(true);
  const handleConfirmDelete = () => {
    onDeletePrepEntry(entry.id);
    setConfirmModalOpen(false);
  };

  const hasResources = entry.resources && entry.resources.length > 0;
  const hasRelatedEntries = relatedEntries && relatedEntries.length > 0;

  // Ensure entry date is valid
  const displayDate = entry.date ? new Date(entry.date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) : 'Invalid Date';

  // Format time
  const displayTime = `${entry.time} hour${entry.time !== 1 ? 's' : ''}`;

  return (
    <>
      <motion.div 
        className="bg-white dark:bg-dark-card amoled:bg-amoled-card border border-slate-200 dark:border-dark-border amoled:border-amoled-border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
        layout
        role="article"
        aria-labelledby={`prep-topic-${entry.id}`}
      >
        {/* Main Content */}
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400 amoled:text-slate-500 flex-shrink-0" />
                <p className="text-sm text-slate-500 dark:text-slate-400 amoled:text-slate-500 truncate">{displayDate}</p>
              </div>
              <h3 
                id={`prep-topic-${entry.id}`}
                className="font-semibold text-lg text-slate-800 dark:text-dark-text amoled:text-amoled-text mt-1 truncate"
              >
                {entry.topic}
              </h3>
            </div>
            <div className="flex items-center gap-1 ml-2">
              <motion.button 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }} 
                onClick={() => onEditPrepEntry(entry)} 
                className="p-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 amoled:hover:text-indigo-500 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
                aria-label={`Edit prep entry for ${entry.topic}`}
              >
                <Pencil className="w-4 h-4" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }} 
                onClick={handleDeleteClick} 
                className="p-2 text-slate-500 hover:text-red-600 dark:hover:text-red-400 amoled:hover:text-red-500 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
                aria-label={`Delete prep entry for ${entry.topic}`}
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          <div className="space-y-4">
            {entry.notes && (
              <p className="text-sm text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary bg-slate-50 dark:bg-dark-bg/50 amoled:bg-amoled-bg/50 p-3 rounded-lg">
                {entry.notes}
              </p>
            )}
            
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                  <Clock className="w-4 h-4" />
                  <span>{displayTime}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < entry.confidence
                          ? 'text-yellow-400 fill-current'
                          : 'text-slate-300 dark:text-slate-600 amoled:text-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <ConfidenceBadge level={entry.confidence} />
            </div>
          </div>
        </div>

        {/* Footer with collapsible resources and related entries */}
        <div className="bg-slate-50/70 dark:bg-dark-bg/30 amoled:bg-amoled-bg/30 px-5 py-3 border-t border-slate-200 dark:border-dark-border amoled:border-amoled-border">
          {/* Resources Section */}
          {(hasResources || entry.linkedApplicationId) && (
            <div className="mb-3">
              {hasResources && (
                <div className="mb-2">
                  <button 
                    onClick={() => setResourcesExpanded(!resourcesExpanded)} 
                    className="flex items-center justify-between w-full text-sm font-medium text-slate-600 dark:text-slate-300 amoled:text-slate-400 py-2"
                    aria-expanded={resourcesExpanded}
                    aria-controls={`resources-list-${entry.id}`}
                  >
                    <span className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" />
                      {resourcesExpanded ? 'Hide' : 'Show'} Resources ({entry.resources.length})
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${resourcesExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  {resourcesExpanded && (
                    <ul 
                      id={`resources-list-${entry.id}`}
                      className="mt-2 space-y-2"
                    >
                      {entry.resources.map((resource, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 amoled:hover:bg-slate-700/30">
                          {resource.completed ? (
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" aria-label="Completed" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" aria-label="Not completed" />
                          )}
                          <div className="min-w-0">
                            <a 
                              href={resource.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-indigo-600 dark:text-indigo-400 amoled:text-indigo-500 hover:underline truncate block"
                            >
                              {resource.title || resource.url}
                            </a>
                            {resource.title && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 amoled:text-slate-500 truncate mt-1">
                                {resource.url}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              {entry.linkedApplicationId && (
                <div className="text-xs text-slate-500 dark:text-slate-400 amoled:text-slate-500 flex items-center gap-1.5 pt-2 border-t border-slate-200 dark:border-slate-700/50 amoled:border-amoled-border/50 mt-2">
                  <LinkIcon className="w-3 h-3"/>
                  <span>Linked to an application</span>
                </div>
              )}
            </div>
          )}

          {/* Related Entries Section */}
          {hasRelatedEntries && (
            <div className="pt-2">
              <button 
                onClick={() => setRelatedEntriesExpanded(!relatedEntriesExpanded)} 
                className="flex items-center justify-between w-full text-sm font-medium text-slate-600 dark:text-slate-300 amoled:text-slate-400 py-2"
                aria-expanded={relatedEntriesExpanded}
                aria-controls={`related-entries-${entry.id}`}
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  {relatedEntriesExpanded ? 'Hide' : 'Show'} Related Sessions ({relatedEntries.length})
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${relatedEntriesExpanded ? 'rotate-180' : ''}`} />
              </button>
              {relatedEntriesExpanded && (
                <div id={`related-entries-${entry.id}`} className="mt-2">
                  <RelatedEntriesList entries={relatedEntries} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Action */}
        <div className="px-5 py-3 bg-slate-50/50 dark:bg-dark-bg/20 amoled:bg-amoled-bg/20 border-t border-slate-200 dark:border-dark-border amoled:border-amoled-border">
          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98}}
            onClick={() => onLogAnotherSession(entry.topic)} 
            className="w-full text-center text-sm font-medium text-indigo-600 dark:text-indigo-400 amoled:text-indigo-500 hover:text-indigo-800 dark:hover:text-indigo-300 amoled:hover:text-indigo-400 py-2 rounded-lg dark:hover:bg-dark-bg/30 amoled:hover:bg-amoled-bg/30 hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
            aria-label={`Log another session for ${entry.topic}`}
          >
            <BookOpen className="w-4 h-4"/>
            Log another session
          </motion.button>
        </div>
      </motion.div>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Prep Entry"
        message={`Are you sure you want to delete the prep entry for "${entry.topic}"? This action cannot be undone.`}
      />
    </>
  );
};

export default React.memo(PrepLogCard);