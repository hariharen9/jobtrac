import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  StickyNote,
  Plus,
  X,
  Save,
  Maximize2,
  Minimize2,
  Book,
  Trash2,
} from 'lucide-react';
import { useNotes } from '../hooks/useNotes';
import MDEditor from '@uiw/react-md-editor';
import { useTheme } from '../../../hooks/shared/useTheme';
import ConfirmationModal from '../../../components/shared/ConfirmationModal';
import './Notes.css';

interface NotesProps {
  userId: string | undefined;
  isExpanded?: boolean;
  onToggle?: () => void;
}

interface MotionButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  className?: string;
}

const MotionButton: React.FC<MotionButtonProps> = ({ children, onClick, title, className = '' }) => (
  <motion.button
    onClick={onClick}
    className={`p-1.5 text-slate-600 dark:text-dark-text amoled:text-amoled-text-secondary amoled:text-amoled-text-secondary hover:text-slate-900 dark:hover:text-dark-text amoled:hover:text-amoled-text hover:bg-slate-200 dark:hover:bg-dark-card amoled:hover:bg-amoled-card rounded-lg transition-colors ${className}`}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    title={title}
  >
    {children}
  </motion.button>
);


export default function Notes({ userId, isExpanded: controlledExpanded, onToggle }: NotesProps) {
  const {
    notes,
    settings,
    loading,
    error,
    addPage,
    updatePage,
    deletePage,
    clearError,
  } = useNotes(userId, false); // Use real-time sync instead of polling

  const [isExpanded, setIsExpanded] = useState(false);
  // Use controlled state if provided, otherwise use internal state
  const isNotesExpanded = controlledExpanded !== undefined ? controlledExpanded : isExpanded;
  const handleToggle = onToggle || (() => setIsExpanded(prev => !prev));

  const [isMaximized, setIsMaximized] = useState(false);
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [titleInput, setTitleInput] = useState('');
  const [noteContent, setNoteContent] = useState<string | undefined>('');
  const { theme } = useTheme();

  useEffect(() => {
    if (notes?.length && !activePageId) {
      setActivePageId(notes[0].id);
    }
  }, [notes, activePageId]);

  useEffect(() => {
    const activePage = notes?.find((page) => page.id === activePageId);
    if (activePage) {
      setNoteContent(activePage.content);
    }
  }, [activePageId, notes]);

  const activePage = notes?.find((page) => page.id === activePageId);

  const handleAddPage = useCallback(async () => {
    const newPageId = await addPage();
    if (newPageId) {
      setActivePageId(newPageId);
    }
  }, [addPage]);

  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<string | null>(null);

  const handleDeleteClick = (pageId: string) => {
    setPageToDelete(pageId);
    setConfirmModalOpen(true);
  };

  const handleConfirmDelete = useCallback(async () => {
    if (!pageToDelete) return;

    await deletePage(pageToDelete);
    if (activePageId === pageToDelete) {
      const remainingPages = notes?.filter((p) => p.id !== pageToDelete);
      setActivePageId(remainingPages?.[0]?.id || null);
    }
    setConfirmModalOpen(false);
    setPageToDelete(null);
  }, [deletePage, notes, activePageId, pageToDelete]);

  const handleContentChange = (content: string | undefined) => {
    setNoteContent(content);
  };

  const handleSaveContent = useCallback(async () => {
    if (activePage && noteContent !== activePage.content) {
      await updatePage(activePage.id, { content: noteContent });
    }
  }, [activePage, noteContent, updatePage]);

  const handleTitleEdit = (pageId: string, currentTitle: string) => {
    setEditingTitle(pageId);
    setTitleInput(currentTitle);
  };

  const handleTitleSave = async () => {
    if (editingTitle && titleInput.trim()) {
      await updatePage(editingTitle, { title: titleInput.trim() });
    }
    setEditingTitle(null);
    setTitleInput('');
  };

  const handleTitleCancel = () => {
    setEditingTitle(null);
    setTitleInput('');
  };

  if (loading) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="w-12 h-12 bg-amber-400 rounded-lg shadow-lg flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white border-dashed rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!userId) return null;

  return (
    <>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 right-4 z-50 bg-red-500 text-white p-3 rounded-lg shadow-lg"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">{error}</span>
              <button
                onClick={clearError}
                className="text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="fixed bottom-4 right-4 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <motion.button
          onClick={handleToggle}
          className="w-12 h-12 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: isNotesExpanded ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <StickyNote className="w-6 h-6" />
          </motion.div>
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {isNotesExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 50, y: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 50, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed z-40 bg-white dark:bg-dark-card amoled:bg-amoled-card amoled:bg-amoled-card rounded-xl shadow-2xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border amoled:border-amoled-border flex flex-col overflow-hidden ${
              isMaximized
                ? 'inset-4 max-w-6xl max-h-[90vh] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
                : 'bottom-20 right-4 w-[450px] h-[600px]'
            }`}
          >
            <header className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-dark-border amoled:border-amoled-border amoled:border-amoled-border bg-slate-50 dark:bg-dark-bg/50 amoled:bg-amoled-bg/50 amoled:bg-amoled-bg/50 flex-shrink-0">
              <div className="flex items-center gap-2">
                <StickyNote className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text amoled:text-amoled-text">
                  Quick Notes
                </h3>
              </div>
              <div className="flex items-center gap-1">
                <MotionButton onClick={handleAddPage} title="Add new note">
                  <Plus className="w-4 h-4" />
                </MotionButton>
                {activePage && noteContent !== activePage.content && (
                  <MotionButton onClick={handleSaveContent} title="Save changes" className="text-green-600 dark:text-green-400">
                    <Save className="w-4 h-4" />
                  </MotionButton>
                )}
                <MotionButton onClick={() => setIsMaximized(!isMaximized)} title={isMaximized ? 'Minimize' : 'Expand'}>
                  {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </MotionButton>
                <MotionButton onClick={handleToggle} title="Close" className="hover:text-red-500">
                  <X className="w-4 h-4" />
                </MotionButton>
              </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
              <aside className="w-40 border-r border-slate-200 dark:border-dark-border amoled:border-amoled-border amoled:border-amoled-border flex flex-col bg-slate-50/50 dark:bg-dark-bg/20 amoled:bg-amoled-bg/20 amoled:bg-amoled-bg/20">
                <div className="p-2 border-b border-slate-200 dark:border-dark-border amoled:border-amoled-border amoled:border-amoled-border">                  <h4 className="text-xs font-semibold uppercase text-slate-500 dark:text-dark-text amoled:text-amoled-text-secondary amoled:text-amoled-text-secondary flex items-center gap-2">
                    <Book className="w-3 h-3"/>
                    My Notes
                  </h4>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {notes?.map((page) => (
                    <motion.div
                      key={page.id}
                      className={`flex items-center justify-between gap-2 p-2 cursor-pointer transition-all group text-sm ${
                        activePageId === page.id
                          ? 'bg-amber-100 dark:bg-amber-900/30 amoled:bg-amber-900/30 amoled:bg-amber-900/30 text-slate-900 dark:text-dark-text amoled:text-amoled-text amoled:text-amoled-text'
                          : 'text-slate-600 dark:text-dark-text amoled:text-amoled-text-secondary amoled:text-amoled-text-secondary hover:bg-slate-200/50 dark:hover:bg-dark-card/50 amoled:hover:bg-amoled-card/50 amoled:hover:bg-amoled-card/50'
                      }`}
                      onClick={() => setActivePageId(page.id)}
                      whileHover={{ scale: 1.02 }}
                      layout
                    >
                      {editingTitle === page.id ? (
                        <input
                          type="text"
                          value={titleInput}
                          onChange={(e) => setTitleInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleTitleSave();
                            if (e.key === 'Escape') handleTitleCancel();
                          }}
                          onBlur={handleTitleSave}
                          className="bg-transparent border-none outline-none text-sm font-medium w-full"
                          autoFocus
                        />
                      ) : (
                        <span
                          className="font-medium truncate"
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            handleTitleEdit(page.id, page.title);
                          }}
                        >
                          {page.title}
                        </span>
                      )}
                      {notes.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(page.id);
                          }}
                          className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete note"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </aside>

              <main className="flex-1 flex flex-col overflow-hidden" data-color-mode={settings.theme}>
                {activePage ? (
                  <MDEditor
                    value={noteContent}
                    onChange={handleContentChange}
                    preview="live"
                    height={isMaximized ? '100%' : 500}
                    className="flex-1 w-full rounded-none border-none"
                    onBlur={handleSaveContent}
                  />
                ) : (
                  <div className="flex-1 flex items-center justify-center text-slate-500 dark:text-slate-400 amoled:text-amoled-text-secondary amoled:text-amoled-text-secondary">
                    <div className="text-center">
                      <StickyNote className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-400 amoled:text-amoled-text-secondary amoled:text-amoled-text-secondary" />
                      <p className="text-sm">
                        Click the <Plus className="inline w-3 h-3"/> button to create your first note.
                      </p>
                    </div>
                  </div>
                )}
              </main>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Note"
        message={`Are you sure you want to delete the note "${notes?.find(p => p.id === pageToDelete)?.title || ''}"? This action cannot be undone.`}
      />
    </>
  );
}
