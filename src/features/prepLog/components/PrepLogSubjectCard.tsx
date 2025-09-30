import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PrepEntry } from '../../../types';
import { Pencil, Trash2, Clock, Link as LinkIcon, CheckCircle, Circle, BookOpen, ChevronDown, Star, Plus, Calendar, AlertCircle } from 'lucide-react';
import ConfirmationModal from '../../../components/shared/ConfirmationModal';

interface PrepLogSubjectCardProps {
  subjectName: string;
  entries: PrepEntry[];
  onEditPrepEntry: (entry: PrepEntry) => void;
  onDeletePrepEntry: (id: string) => void;
  onLogNewPrep: (subjectId: string) => void;
}

// Component to display SRS status badge
const SRSStatusBadge: React.FC<{ entry: PrepEntry }> = ({ entry }) => {
  // Check if entry has SRS data
  if (!entry.nextReviewDate || entry.srsStage === undefined) {
    return (
      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 amoled:bg-gray-800 amoled:text-gray-400">
        <AlertCircle className="w-3 h-3 mr-1" />
        Not tracked
      </span>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextReviewDate = new Date(entry.nextReviewDate);
  nextReviewDate.setHours(0, 0, 0, 0);
  
  // Check if review is due
  if (nextReviewDate <= today) {
    return (
      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 amoled:bg-red-900/40 amoled:text-red-400">
        <AlertCircle className="w-3 h-3 mr-1" />
        Review due
      </span>
    );
  }
  
  // Calculate days until next review
  const diffTime = nextReviewDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 3) {
    return (
      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 amoled:bg-amber-900/40 amoled:text-amber-400">
        <Calendar className="w-3 h-3 mr-1" />
        {diffDays} day{diffDays !== 1 ? 's' : ''} left
      </span>
    );
  }
  
  return (
    <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 amoled:bg-green-900/40 amoled:text-green-400">
      <Calendar className="w-3 h-3 mr-1" />
      {diffDays} days left
    </span>
  );
};

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

// Component to display individual prep entries
const PrepEntryCard: React.FC<{ 
  entry: PrepEntry; 
  onEdit: (entry: PrepEntry) => void; 
  onDelete: (id: string) => void;
}> = ({ entry, onEdit, onDelete }) => {
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);
  
  const handleDeleteClick = () => setConfirmModalOpen(true);
  const handleConfirmDelete = () => {
    onDelete(entry.id);
    setConfirmModalOpen(false);
  };

  // Keyboard navigation for prep entries
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (document.activeElement === editButtonRef.current) {
          e.preventDefault();
          onEdit(entry);
        } else if (document.activeElement === deleteButtonRef.current) {
          e.preventDefault();
          handleDeleteClick();
        }
      }
    };

    const editButton = editButtonRef.current;
    const deleteButton = deleteButtonRef.current;
    
    editButton?.addEventListener('keydown', handleKeyDown);
    deleteButton?.addEventListener('keydown', handleKeyDown);
    
    return () => {
      editButton?.removeEventListener('keydown', handleKeyDown);
      deleteButton?.removeEventListener('keydown', handleKeyDown);
    };
  }, [entry, onEdit, onDelete]);

  // Ensure entry date is valid
  const displayDate = entry.date ? new Date(entry.date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) : 'Invalid Date';

  // Format time
  const displayTime = `${entry.time} hour${entry.time !== 1 ? 's' : ''}`;

  const hasResources = entry.resources && entry.resources.length > 0;
  const [resourcesExpanded, setResourcesExpanded] = useState(false);

  return (
    <>
      <div className="p-4 bg-slate-50 dark:bg-dark-bg/30 amoled:bg-amoled-bg/30 rounded-lg border border-slate-200 dark:border-dark-border/50 amoled:border-amoled-border/50 mb-3">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400 amoled:text-slate-500 flex-shrink-0" />
              <p className="text-sm text-slate-500 dark:text-slate-400 amoled:text-slate-500 truncate">{displayDate}</p>
              <SRSStatusBadge entry={entry} />
            </div>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <button 
              ref={editButtonRef}
              onClick={() => onEdit(entry)} 
              className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 amoled:hover:text-indigo-500 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label={`Edit prep entry from ${displayDate}`}
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button 
              ref={deleteButtonRef}
              onClick={handleDeleteClick} 
              className="p-1.5 text-slate-500 hover:text-red-600 dark:hover:text-red-400 amoled:hover:text-red-500 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label={`Delete prep entry from ${displayDate}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {entry.notes && (
            <p className="text-sm text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary bg-white dark:bg-dark-card/50 amoled:bg-amoled-card/50 p-2 rounded-lg">
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
            <div className="flex items-center gap-2">
              <ConfidenceBadge level={entry.confidence} />
              {entry.srsStage !== undefined && (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200 amoled:bg-indigo-900/20 amoled:text-indigo-300">
                  Stage {entry.srsStage}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Resources Section */}
        {hasResources && (
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-dark-border/30 amoled:border-amoled-border/30">
            <button 
              onClick={() => setResourcesExpanded(!resourcesExpanded)} 
              className="flex items-center justify-between w-full text-sm font-medium text-slate-600 dark:text-slate-300 amoled:text-slate-400 py-1"
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
      </div>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Prep Entry"
        message={`Are you sure you want to delete the prep entry from "${displayDate}"? This action cannot be undone.`}
      />
    </>
  );
};

const PrepLogSubjectCard: React.FC<PrepLogSubjectCardProps> = ({ 
  subjectName, 
  entries, 
  onEditPrepEntry, 
  onDeletePrepEntry, 
  onLogNewPrep
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [latestEntry, ...olderEntries] = [...entries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const cardRef = useRef<HTMLDivElement>(null);
  const expandButtonRef = useRef<HTMLButtonElement>(null);
  const logPrepButtonRef = useRef<HTMLButtonElement>(null);

  // Keyboard navigation for subject cards
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (document.activeElement === expandButtonRef.current) {
          e.preventDefault();
          setIsExpanded(prev => !prev);
        } else if (document.activeElement === logPrepButtonRef.current) {
          e.preventDefault();
          onLogNewPrep(latestEntry.subjectId);
        }
      }
      
      // Arrow key navigation between subject cards
      if (e.key === 'ArrowDown' && document.activeElement === cardRef.current) {
        e.preventDefault();
        const nextCard = cardRef.current?.parentElement?.nextElementSibling?.firstElementChild as HTMLElement;
        nextCard?.focus();
      }
      
      if (e.key === 'ArrowUp' && document.activeElement === cardRef.current) {
        e.preventDefault();
        const prevCard = cardRef.current?.parentElement?.previousElementSibling?.firstElementChild as HTMLElement;
        prevCard?.focus();
      }
    };

    const card = cardRef.current;
    card?.addEventListener('keydown', handleKeyDown);
    
    return () => {
      card?.removeEventListener('keydown', handleKeyDown);
    };
  }, [subjectName, onLogNewPrep, latestEntry]);

  // Calculate subject stats
  const totalHours = entries.reduce((sum, entry) => sum + entry.time, 0);
  const avgConfidence = entries.length > 0 
    ? Math.round(entries.reduce((sum, entry) => sum + entry.confidence, 0) / entries.length * 10) / 10
    : 0;

  // Calculate SRS stats
  const entriesWithSRS = entries.filter(entry => entry.nextReviewDate && entry.srsStage !== undefined);
  const dueForReview = entriesWithSRS.filter(entry => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextReviewDate = new Date(entry.nextReviewDate!);
    nextReviewDate.setHours(0, 0, 0, 0);
    return nextReviewDate <= today;
  });

  // Ensure latest entry date is valid
  const displayDate = latestEntry?.date ? new Date(latestEntry.date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) : 'Invalid Date';

  return (
    <motion.div 
      ref={cardRef}
      tabIndex={0}
      className="bg-white dark:bg-dark-card amoled:bg-amoled-card border border-slate-200 dark:border-dark-border amoled:border-amoled-border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500"
      layout
      role="article"
      aria-labelledby={`subject-${subjectName}`}
    >
      {/* Subject Header */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400 amoled:text-indigo-500 flex-shrink-0" />
              <h3 
                id={`subject-${subjectName}`}
                className="font-semibold text-lg text-slate-800 dark:text-dark-text amoled:text-amoled-text truncate"
              >
                {subjectName}
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm mt-2">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                <Clock className="w-4 h-4" />
                <span>{entries.length} prep entr{entries.length !== 1 ? 'ies' : 'y'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                <Clock className="w-4 h-4" />
                <span>{totalHours.toFixed(1)} hours</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>Avg: {avgConfidence}</span>
              </div>
              {entriesWithSRS.length > 0 && (
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                  <Calendar className="w-4 h-4" />
                  <span>{dueForReview.length} due</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <button 
              ref={expandButtonRef}
              onClick={() => setIsExpanded(!isExpanded)} 
              className="p-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 amoled:hover:text-indigo-500 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-expanded={isExpanded}
              aria-label={isExpanded ? `Collapse prep entries for ${subjectName}` : `Expand prep entries for ${subjectName}`}
            >
              <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Latest Prep Entry Preview */}
        {latestEntry && (
          <div className="bg-slate-50 dark:bg-dark-bg/20 amoled:bg-amoled-bg/20 p-4 rounded-lg border border-slate-200 dark:border-dark-border/30 amoled:border-amoled-border/30">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary text-sm">
                Latest Prep Entry
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 amoled:text-slate-500">
                  {displayDate}
                </span>
                <SRSStatusBadge entry={latestEntry} />
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                  <Clock className="w-4 h-4" />
                  <span>{latestEntry.time} hour{latestEntry.time !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < latestEntry.confidence
                          ? 'text-yellow-400 fill-current'
                          : 'text-slate-300 dark:text-slate-600 amoled:text-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ConfidenceBadge level={latestEntry.confidence} />
                {latestEntry.srsStage !== undefined && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200 amoled:bg-indigo-900/20 amoled:text-indigo-300">
                    Stage {latestEntry.srsStage}
                  </span>
                )}
              </div>
            </div>
            {latestEntry.notes && (
              <p className="text-sm text-slate-600 dark:text-slate-400 amoled:text-slate-500 mt-2 line-clamp-2">
                {latestEntry.notes}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Expanded Prep Entries */}
      {isExpanded && (
        <div className="px-5 pb-4 border-t border-slate-200 dark:border-dark-border amoled:border-amoled-border">
          <div className="py-3">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary text-sm">
                All Prep Entries
              </h4>
              <button
                ref={logPrepButtonRef}
                onClick={() => onLogNewPrep(latestEntry.subjectId)}
                className="flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 amoled:text-indigo-500 hover:text-indigo-800 dark:hover:text-indigo-300 amoled:hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Prep Entry
              </button>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
              {olderEntries.map(entry => (
                <PrepEntryCard 
                  key={entry.id} 
                  entry={entry} 
                  onEdit={onEditPrepEntry} 
                  onDelete={onDeletePrepEntry} 
                />
              ))}
              
              {latestEntry && (
                <PrepEntryCard 
                  key={latestEntry.id} 
                  entry={latestEntry} 
                  onEdit={onEditPrepEntry} 
                  onDelete={onDeletePrepEntry} 
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Action */}
      <div className="px-5 py-3 bg-slate-50/50 dark:bg-dark-bg/20 amoled:bg-amoled-bg/20 border-t border-slate-200 dark:border-dark-border amoled:border-amoled-border">
        <motion.button 
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98}}
          onClick={() => onLogNewPrep(latestEntry.subjectId)} 
          className="w-full text-center text-sm font-medium text-indigo-600 dark:text-indigo-400 amoled:text-indigo-500 hover:text-indigo-800 dark:hover:text-indigo-300 amoled:hover:text-indigo-400 py-2 rounded-lg dark:hover:bg-dark-bg/30 amoled:hover:bg-amoled-bg/30 hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label={`Log new prep entry for ${subjectName}`}
        >
          <BookOpen className="w-4 h-4"/>
          Log new prep
        </motion.button>
      </div>
    </motion.div>
  );
};

export default React.memo(PrepLogSubjectCard);