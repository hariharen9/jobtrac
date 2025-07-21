import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  StickyNote,
  Plus,
  X,
  Settings,
  Pin,
  PinOff,
  Edit3,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  Save,
  Hash,
  Link,
  Maximize2,
  Minimize2
} from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { useNotes } from '../hooks/useNotes';
import { NotePage } from '../types';
import './Notes.css';

interface NotesProps {
  userId: string | undefined;
}

const COLORS = [
  { value: '#fbbf24', name: 'Amber' },
  { value: '#3b82f6', name: 'Blue' },
  { value: '#ef4444', name: 'Red' },
  { value: '#10b981', name: 'Emerald' },
  { value: '#8b5cf6', name: 'Violet' },
  { value: '#f59e0b', name: 'Orange' },
  { value: '#06b6d4', name: 'Cyan' },
  { value: '#ec4899', name: 'Pink' },
];

export default function Notes({ userId }: NotesProps) {
  const {
    userNotes,
    loading,
    error,
    addPage,
    updatePage,
    deletePage,
    updateSettings,
    clearError
  } = useNotes(userId);

  const [isExpanded, setIsExpanded] = useState(false);
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [titleInput, setTitleInput] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });

  // Update window size on resize
  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Set initial size
    updateWindowSize();

    // Add event listener
    window.addEventListener('resize', updateWindowSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);
  
  // Define sizes with proper constraints
  const normalSize = { width: '600px', height: '700px' };
  const expandedSize = { 
    width: Math.min(windowSize.width * 0.85, 1000), 
    height: Math.min(windowSize.height * 0.8, 750) 
  };

  // Set active page to first page when notes load
  useEffect(() => {
    if (userNotes?.pages?.length && !activePageId) {
      setActivePageId(userNotes.pages[0].id);
    }
  }, [userNotes, activePageId]);

  const activePage = userNotes?.pages?.find(page => page.id === activePageId);

  const handleAddPage = async () => {
    await addPage();
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

  const handleUpdateContent = async (content: string) => {
    if (activePage) {
      await updatePage(activePage.id, { content });
    }
  };

  const handleTogglePin = async (pageId: string) => {
    const page = userNotes?.pages?.find(p => p.id === pageId);
    if (page) {
      await updatePage(pageId, { pinned: !page.pinned });
    }
  };

  const handleColorChange = async (pageId: string, color: string) => {
    await updatePage(pageId, { color });
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

      {/* Notes Panel */}
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
                ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                : 'bottom-20 right-4'
            }`}
            style={{ 
              width: isMaximized ? expandedSize.width : normalSize.width,
              height: isMaximized ? expandedSize.height : normalSize.height,
              maxWidth: '95vw',
              maxHeight: '95vh'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <StickyNote className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  My Notes
                </h3>
                {userNotes?.pages?.length && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">
                    {userNotes.pages.length}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isMaximized ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </motion.button>
                <motion.button
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Settings className="w-4 h-4" />
                </motion.button>
                <motion.button
                  onClick={handleAddPage}
                  className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-4 h-4" />
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

            {/* Page Tabs */}
            <div className="flex items-center gap-1 p-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 overflow-x-auto">
              {userNotes?.pages?.map((page, index) => (
                <div
                  key={page.id}
                  className="flex items-center gap-1 flex-shrink-0"
                >
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all group relative ${
                      activePageId === page.id
                        ? 'text-slate-900 dark:text-slate-100 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                    style={{
                      backgroundColor: activePageId === page.id 
                        ? `${page.color}20` 
                        : 'transparent'
                    }}
                    onClick={() => setActivePageId(page.id)}
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
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
                        className="bg-transparent border-none outline-none text-sm font-medium min-w-0 max-w-24"
                        autoFocus
                      />
                    ) : (
                      <span 
                        className="text-sm font-medium truncate max-w-20"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTitleEdit(page.id, page.title);
                        }}
                      >
                        {page.title}
                      </span>
                    )}

                    {page.pinned && (
                      <Pin className="w-3 h-3 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                    )}

                    {/* Page Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTogglePin(page.id);
                        }}
                        className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
                      >
                        {page.pinned ? (
                          <PinOff className="w-3 h-3" />
                        ) : (
                          <Pin className="w-3 h-3" />
                        )}
                      </button>
                      {userNotes.pages.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePage(page.id);
                          }}
                          className="p-1 text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
              {activePage ? (
                <div 
                  className="h-full" 
                  data-color-mode={userNotes?.settings?.theme === 'auto' ? 'auto' : userNotes?.settings?.theme || 'light'}
                >
                  <MDEditor
                    key={`${activePage.id}-${userNotes?.settings?.theme}-${userNotes?.settings?.fontSize}-${userNotes?.settings?.showPreview}`}
                    value={activePage.content}
                    onChange={(value) => handleUpdateContent(value || '')}
                    preview={userNotes?.settings?.showPreview ? 'live' : 'edit'}
                    hideToolbar={false}
                    visibleDragBar={false}
                    textareaProps={{
                      placeholder: 'Start writing your note...',
                      style: { 
                        fontSize: `${userNotes?.settings?.fontSize || 14}px`,
                        fontFamily: 'Inter, system-ui, sans-serif',
                        lineHeight: 1.6
                      },
                    }}
                    height={isMaximized ? expandedSize.height - 160 : 580}
                    data-color-mode={userNotes?.settings?.theme === 'auto' ? 'auto' : userNotes?.settings?.theme || 'light'}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
                  <div className="text-center">
                    <StickyNote className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                    <p>Select a note to start writing</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            onClick={() => setIsSettingsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 w-full max-w-md mx-4 border border-slate-200 dark:border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Notes Settings
                </h3>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Default Color */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
                    Default Color
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {COLORS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => updateSettings({ defaultColor: color.value })}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          userNotes?.settings?.defaultColor === color.value
                            ? 'border-slate-900 dark:border-slate-100 scale-110'
                            : 'border-slate-300 dark:border-slate-600 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Font Size */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
                    Font Size: {userNotes?.settings?.fontSize || 14}px
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="20"
                    value={userNotes?.settings?.fontSize || 14}
                    onChange={(e) => updateSettings({ fontSize: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>

                {/* Theme */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
                    Theme
                  </label>
                  <select
                    value={userNotes?.settings?.theme || 'auto'}
                    onChange={(e) => updateSettings({ theme: e.target.value as 'light' | 'dark' | 'auto' })}
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  >
                    <option value="auto">Auto</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>

                {/* Show Preview */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    Show Preview
                  </label>
                  <button
                    onClick={() => updateSettings({ showPreview: !userNotes?.settings?.showPreview })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      userNotes?.settings?.showPreview
                        ? 'bg-amber-500'
                        : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        userNotes?.settings?.showPreview ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Color Picker for Active Page */}
              {activePage && (
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <label className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
                    Current Note Color
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {COLORS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => handleColorChange(activePage.id, color.value)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          activePage.color === color.value
                            ? 'border-slate-900 dark:border-slate-100 scale-110'
                            : 'border-slate-300 dark:border-slate-600 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
