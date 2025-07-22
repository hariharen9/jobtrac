import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  StickyNote,
  Plus,
  X,
  Edit3,
  Trash2,
  Save,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useNotes } from '../hooks/useNotes';
import { NotePage } from '../types';
import './Notes.css';

interface NotesProps {
  userId: string | undefined;
}

export default function Notes({ userId }: NotesProps) {
  const {
    userNotes,
    loading,
    error,
    addPage,
    updatePage,
    deletePage,
    clearError
  } = useNotes(userId);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [titleInput, setTitleInput] = useState('');
  const [noteContent, setNoteContent] = useState('');

  // Set active page to first page when notes load
  useEffect(() => {
    if (userNotes?.pages?.length && !activePageId) {
      setActivePageId(userNotes.pages[0].id);
    }
  }, [userNotes, activePageId]);

  // Update note content when active page changes
  useEffect(() => {
    const activePage = userNotes?.pages?.find(page => page.id === activePageId);
    if (activePage) {
      setNoteContent(activePage.content);
    }
  }, [activePageId, userNotes]);

  const activePage = userNotes?.pages?.find(page => page.id === activePageId);

  const handleAddPage = async () => {
    const newPageId = await addPage();
    if (newPageId) {
      // Find the new page and set it as active
      const newPage = userNotes?.pages?.find(p => p.id === newPageId);
      if (newPage) {
        setActivePageId(newPage.id);
      }
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      await deletePage(pageId);
      // Set active page to first remaining page
      if (userNotes?.pages?.length && userNotes.pages.length > 1) {
        const remainingPages = userNotes.pages.filter(p => p.id !== pageId);
        setActivePageId(remainingPages[0]?.id || null);
      }
    }
  };

  const handleContentChange = (content: string) => {
    setNoteContent(content);
  };

  const handleSaveContent = async () => {
    if (activePage && noteContent !== activePage.content) {
      await updatePage(activePage.id, { content: noteContent });
    }
  };

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

      {/* Floating Note Button */}
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-12 h-12 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <StickyNote className="w-6 h-6" />
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Simplified Notes Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 50, y: 50 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              x: 0, 
              y: 0
            }}
            exit={{ opacity: 0, scale: 0.8, x: 50, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed z-40 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden ${
              isMaximized 
                ? 'inset-4 max-w-6xl max-h-[90vh] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
                : 'bottom-20 right-4 w-96 h-[500px]'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <StickyNote className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  Quick Notes
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={handleAddPage}
                  className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Add new note"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
                {activePage && noteContent !== activePage.content && (
                  <motion.button
                    onClick={handleSaveContent}
                    className="p-1.5 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Save changes"
                  >
                    <Save className="w-4 h-4" />
                  </motion.button>
                )}
                <motion.button
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title={isMaximized ? "Minimize" : "Expand"}
                >
                  {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </motion.button>
                <motion.button
                  onClick={() => setIsExpanded(false)}
                  className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Note Tabs */}
            {userNotes?.pages && userNotes.pages.length > 1 && (
              <div className="flex items-center gap-1 p-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 overflow-x-auto">
                {userNotes.pages.map((page) => (
                  <motion.div
                    key={page.id}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer transition-all group text-xs ${
                      activePageId === page.id
                        ? 'bg-amber-100 dark:bg-amber-900/20 text-slate-900 dark:text-slate-100'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                    onClick={() => setActivePageId(page.id)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: page.color }}
                    />
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
                        className="bg-transparent border-none outline-none text-xs font-medium w-16"
                        autoFocus
                      />
                    ) : (
                      <span 
                        className="font-medium truncate max-w-16"
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          handleTitleEdit(page.id, page.title);
                        }}
                      >
                        {page.title}
                      </span>
                    )}
                    {userNotes.pages.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePage(page.id);
                        }}
                        className="p-0.5 text-slate-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete note"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {activePage ? (
                <div className="flex-1 flex flex-col">
                  <textarea
                    value={noteContent}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder="Start writing your note here...\n\nYou can use basic formatting:\n- **bold text**\n- *italic text*\n- Lists and more!"
                    className="flex-1 w-full p-4 text-sm resize-none border-none outline-none bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                    style={{
                      fontFamily: 'Inter, system-ui, sans-serif',
                      lineHeight: 1.5
                    }}
                  />
                  {activePage.content && (
                    <div className="border-t border-slate-200 dark:border-slate-700 p-4 max-h-32 overflow-y-auto bg-slate-50 dark:bg-slate-900">
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">Preview:</div>
                      <div 
                        className="text-sm text-slate-700 dark:text-slate-300 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: noteContent
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\*(.*?)\*/g, '<em>$1</em>')
                            .replace(/\n/g, '<br>')
                        }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-slate-500 dark:text-slate-400">
                  <div className="text-center">
                    <StickyNote className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                    <p className="text-sm">Click the + button to create your first note</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
