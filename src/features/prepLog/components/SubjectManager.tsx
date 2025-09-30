import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Check, FolderPlus } from 'lucide-react';
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
      onClose(); // Close modal after adding subject
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
      onClose(); // Close modal after editing subject
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
    <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border shadow-sm p-5 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-slate-800 dark:text-dark-text amoled:text-amoled-text">Subjects</h3>
        <motion.button
          ref={addButtonRef}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsAddingSubject(true)}
          className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 amoled:text-indigo-500 hover:text-indigo-800 dark:hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
          disabled={isAddingSubject}
        >
          <FolderPlus className="w-4 h-4" />
          Add Subject
        </motion.button>
      </div>

      {/* Add Subject Form */}
      {isAddingSubject && (
        <div className="mb-4 p-4 bg-slate-50 dark:bg-dark-bg/30 amoled:bg-amoled-bg/30 rounded-lg border border-slate-200 dark:border-dark-border/50 amoled:border-amoled-border/50">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary text-sm">New Subject</h4>
            <button
              ref={(el) => { if (el) closeButtonsRef.current[0] = el; }}
              onClick={onClose}
              className="text-slate-500 hover:text-red-600 dark:hover:text-red-400 amoled:hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
              aria-label="Cancel adding subject"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <input
                type="text"
                placeholder="Subject Name"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 amoled:border-slate-700 bg-white dark:bg-dark-card amoled:bg-amoled-card px-3 py-2 text-slate-900 dark:text-dark-text amoled:text-amoled-text shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
            </div>
            <div>
              <textarea
                placeholder="Description (optional)"
                value={newSubjectDescription}
                onChange={(e) => setNewSubjectDescription(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 amoled:border-slate-700 bg-white dark:bg-dark-card amoled:bg-amoled-card px-3 py-2 text-slate-900 dark:text-dark-text amoled:text-amoled-text shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                rows={2}
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleAddSubject}
                disabled={!newSubjectName.trim()}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 ${
                  newSubjectName.trim()
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                }`}
              >
                <Plus className="w-4 h-4" />
                Add Subject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subject List */}
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
        {subjects.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 amoled:text-slate-500 text-center py-4">
            No subjects created yet. Add your first subject to organize your prep sessions.
          </p>
        ) : (
          subjects && Array.isArray(subjects) ? subjects.map((subject, index) => (
            <div
              key={subject.id}
              ref={(el) => { if (el) subjectItemsRef.current[index] = el; }}
              data-subject-id={subject.id}
              tabIndex={0}
              className={`p-3 rounded-lg border ${
                selectedSubjectId === subject.id
                  ? 'border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/20 amoled:bg-indigo-900/10'
                  : 'border-slate-200 dark:border-dark-border/50 amoled:border-amoled-border/50 hover:bg-slate-50 dark:hover:bg-dark-bg/30 amoled:hover:bg-amoled-bg/30'
              } transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              {editingSubject?.id === subject.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 amoled:border-slate-700 bg-white dark:bg-dark-card amoled:bg-amoled-card px-3 py-1.5 text-slate-900 dark:text-dark-text amoled:text-amoled-text shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    autoFocus
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 amoled:border-slate-700 bg-white dark:bg-dark-card amoled:bg-amoled-card px-3 py-1.5 text-slate-900 dark:text-dark-text amoled:text-amoled-text shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm"
                    rows={2}
                    placeholder="Description (optional)"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={resetForm}
                      className="p-1.5 text-slate-500 hover:text-red-600 dark:hover:text-red-400 amoled:hover:text-red-500 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
                      aria-label="Cancel editing"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      onClick={saveEditSubject}
                      disabled={!editName.trim()}
                      className={`p-1.5 rounded-lg transition-colors ${
                        editName.trim()
                          ? 'text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                          : 'text-slate-400 cursor-not-allowed'
                      }`}
                      aria-label="Save changes"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div onClick={() => handleSelectSubject(subject)}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-800 dark:text-dark-text amoled:text-amoled-text text-sm truncate">
                        {subject.name}
                      </h4>
                      {subject.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 amoled:text-slate-500 mt-1 line-clamp-2">
                          {subject.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditSubject(subject);
                        }}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 amoled:hover:text-indigo-500 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-label={`Edit subject ${subject.name}`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDeleteSubject(subject.id);
                        }}
                        className="p-1.5 text-slate-500 hover:text-red-600 dark:hover:text-red-400 amoled:hover:text-red-500 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label={`Delete subject ${subject.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )) : null
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleDeleteSubject}
        title="Delete Subject"
        message="This will delete the subject and all of its sessions. Prep entries will not be deleted, but will no longer be associated with this subject or its sessions. Are you sure you want to delete this subject?"
      />
    </div>
  );
};

export default SubjectManager;