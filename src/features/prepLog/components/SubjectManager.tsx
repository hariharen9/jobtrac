import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Check, FolderPlus, BookOpen } from 'lucide-react';
import ConfirmationModal from '../../../components/shared/ConfirmationModal';
import SubjectManagerSkeleton from './SubjectManagerSkeleton';

interface Subject {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SubjectManagerProps {
  subjects: Subject[];
  onAddSubject: (subject: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEditSubject: (subject: Subject) => void;
  onDeleteSubject: (id: string) => void;
  onSelectSubject: (subject: Subject | null) => void;
  selectedSubjectId?: string;
  onClose: () => void;
  loading?: boolean;
}

const SubjectManager: React.FC<SubjectManagerProps> = ({
  subjects,
  onAddSubject,
  onEditSubject,
  onDeleteSubject,
  onSelectSubject,
  selectedSubjectId,
  onClose,
  loading = false
}) => {
  // Show skeleton when loading
  if (loading) {
    return <SubjectManagerSkeleton />;
  }
  
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectDescription, setNewSubjectDescription] = useState('');
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [deleteSubjectId, setDeleteSubjectId] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  
  // Refs for keyboard navigation
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonsRef = useRef<HTMLButtonElement[]>([]);
  const subjectItemsRef = useRef<HTMLDivElement[]>([]);

  // Keyboard navigation handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Escape key to close
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      
      // Handle Enter key on subject items
      if (e.key === 'Enter') {
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement.dataset.subjectId) {
          e.preventDefault();
          const subject = subjects.find(s => s.id === activeElement.dataset.subjectId);
          if (subject) {
            onSelectSubject(selectedSubjectId === subject.id ? null : subject);
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onSelectSubject, selectedSubjectId, subjects]);

  // Reset form when closing
  const resetForm = () => {
    setIsAddingSubject(false);
    setNewSubjectName('');
    setNewSubjectDescription('');
    setEditingSubject(null);
    setEditName('');
    setEditDescription('');
  };

  // Handle subject selection
  const handleSelectSubject = (subject: Subject) => {
    onSelectSubject(selectedSubjectId === subject.id ? null : subject);
  };

  // Handle add subject
  const handleAddSubject = () => {
    if (newSubjectName.trim()) {
      onAddSubject({
        name: newSubjectName.trim(),
        description: newSubjectDescription.trim() || undefined
      });
      resetForm();
    }
  };

  // Handle edit subject
  const startEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setEditName(subject.name);
    setEditDescription(subject.description || '');
  };

  const saveEditSubject = () => {
    if (editingSubject && editName.trim()) {
      onEditSubject({
        ...editingSubject,
        name: editName.trim(),
        description: editDescription.trim() || undefined,
        updatedAt: new Date()
      });
      resetForm();
    }
  };

  // Handle delete subject
  const confirmDeleteSubject = (id: string) => {
    setDeleteSubjectId(id);
    setIsConfirmModalOpen(true);
  };

  const handleDeleteSubject = () => {
    if (deleteSubjectId) {
      onDeleteSubject(deleteSubjectId);
      setIsConfirmModalOpen(false);
      setDeleteSubjectId(null);
    }
  };

  return (
    <div className="bg-white/90 dark:bg-dark-card/90 amoled:bg-amoled-card/90 backdrop-blur-xl rounded-2xl border border-slate-200/70 dark:border-dark-border/70 amoled:border-amoled-border/70 shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-dark-text amoled:text-amoled-text">Manage Subjects</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 amoled:text-slate-500">
              Organize your prep sessions by subject
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 amoled:hover:bg-slate-700/50 transition-colors backdrop-blur-sm"
          aria-label="Close modal"
        >
          <X className="w-6 h-6 text-slate-500 dark:text-slate-400" />
        </motion.button>
      </div>

      {/* Add Subject Form */}
      <motion.div 
        layout
        className="mb-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
            {isAddingSubject ? 'Create New Subject' : 'Subjects'}
          </h3>
          {!isAddingSubject && (
            <motion.button
              ref={addButtonRef}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAddingSubject(true)}
              className="flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-2.5 shadow-lg transition-all duration-200"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Add Subject</span>
            </motion.button>
          )}
        </div>
        
        <AnimatePresence>
          {isAddingSubject && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-6"
            >
              <div className="p-5 bg-slate-50/70 dark:bg-dark-bg/30 amoled:bg-amoled-bg/30 rounded-xl border border-slate-200/50 dark:border-dark-border/50 amoled:border-amoled-border/50 backdrop-blur-sm shadow-sm">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-2">
                      Subject Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Data Structures & Algorithms"
                      value={newSubjectName}
                      onChange={(e) => setNewSubjectName(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-600 amoled:border-slate-700 bg-white/80 dark:bg-dark-card/80 amoled:bg-amoled-card/80 px-4 py-3 text-slate-900 dark:text-dark-text amoled:text-amoled-text shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 backdrop-blur-sm"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-2">
                      Description (optional)
                    </label>
                    <textarea
                      placeholder="Brief description of what this subject covers..."
                      value={newSubjectDescription}
                      onChange={(e) => setNewSubjectDescription(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-600 amoled:border-slate-700 bg-white/80 dark:bg-dark-card/80 amoled:bg-amoled-card/80 px-4 py-3 text-slate-900 dark:text-dark-text amoled:text-amoled-text shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-all duration-200 backdrop-blur-sm"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={resetForm}
                      className="px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddSubject}
                      disabled={!newSubjectName.trim()}
                      className={`px-4 py-2.5 text-sm font-medium text-white rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        newSubjectName.trim()
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md'
                          : 'bg-slate-300 dark:bg-slate-600 cursor-not-allowed'
                      }`}
                    >
                      Create Subject
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Subjects List */}
      <div className="space-y-3">
        {subjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-1">No subjects yet</h3>
            <p className="text-slate-500 dark:text-slate-400">
              Create your first subject to get started
            </p>
          </div>
        ) : (
          subjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-xl border transition-all duration-200 ${
                selectedSubjectId === subject.id
                  ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 amoled:bg-indigo-900/10 shadow-sm'
                  : 'border-slate-200/50 dark:border-dark-border/50 amoled:border-amoled-border/50 hover:border-slate-300 dark:hover:border-slate-600 amoled:hover:border-slate-700'
              } bg-white/70 dark:bg-dark-card/70 amoled:bg-amoled-card/70 backdrop-blur-sm`}
            >
              {editingSubject?.id === subject.id ? (
                // Edit Mode
                <div className="p-5">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-2">
                        Subject Name *
                      </label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-600 amoled:border-slate-700 bg-white/80 dark:bg-dark-card/80 amoled:bg-amoled-card/80 px-4 py-2.5 text-slate-900 dark:text-dark-text amoled:text-amoled-text shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 backdrop-blur-sm"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-2">
                        Description (optional)
                      </label>
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-600 amoled:border-slate-700 bg-white/80 dark:bg-dark-card/80 amoled:bg-amoled-card/80 px-4 py-2.5 text-slate-900 dark:text-dark-text amoled:text-amoled-text shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-all duration-200 backdrop-blur-sm"
                        rows={2}
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={resetForm}
                        className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveEditSubject}
                        disabled={!editName.trim()}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center gap-2 ${
                          editName.trim()
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md'
                            : 'bg-slate-300 dark:bg-slate-600 cursor-not-allowed'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // View Mode
                <div 
                  className="p-5 cursor-pointer"
                  onClick={() => handleSelectSubject(subject)}
                  data-subject-id={subject.id}
                  tabIndex={0}
                  role="button"
                  aria-pressed={selectedSubjectId === subject.id}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-slate-800 dark:text-dark-text amoled:text-amoled-text truncate">
                          {subject.name}
                        </h4>
                        {selectedSubjectId === subject.id && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200">
                            Selected
                          </span>
                        )}
                      </div>
                      {subject.description && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 amoled:text-slate-500 mb-3">
                          {subject.description}
                        </p>
                      )}
                      <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 amoled:text-slate-500">
                        <span>
                          Created {new Date(subject.createdAt).toLocaleDateString()}
                        </span>
                        {subject.updatedAt > subject.createdAt && (
                          <span className="ml-2">
                            • Updated {new Date(subject.updatedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditSubject(subject);
                        }}
                        className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 amoled:hover:bg-slate-700/50 transition-colors"
                        aria-label={`Edit ${subject.name}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDeleteSubject(subject.id);
                        }}
                        className="p-2 rounded-lg text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700 amoled:hover:bg-slate-700/50 transition-colors"
                        aria-label={`Delete ${subject.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleDeleteSubject}
        title="Delete Subject"
        message="Are you sure you want to delete this subject? This action cannot be undone and all associated prep logs will be removed."
      />
    </div>
  );
};

export default SubjectManager;