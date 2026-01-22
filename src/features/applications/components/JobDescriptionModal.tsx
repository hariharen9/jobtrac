import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Application } from '../../../types';
import { motion } from 'framer-motion';
import { Bold, Italic, Underline, List, ListOrdered, X } from 'lucide-react';

interface JobDescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application | null;
  onSave: (applicationId: string, jobDescription: string) => void;
}

const JobDescriptionModal: React.FC<JobDescriptionModalProps> = ({ isOpen, onClose, application, onSave }) => {
  const [keywords, setKeywords] = useState('');
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Callback ref to handle editor initialization reliably
  const setEditorRef = useCallback((node: HTMLDivElement | null) => {
    editorRef.current = node;
    if (node && application) {
      // If the content looks like HTML, use it as is. Otherwise, convert newlines to <br>
      const content = application.jobDescription || '';
      const hasHTML = /<[a-z][\s\S]*>/i.test(content);
      
      node.innerHTML = hasHTML 
        ? content 
        : content.replace(/\n/g, '<br>');
    }
  }, [application]);

  // Apply formatting command
  const execFormatCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }, []);

  // Toolbar button component
  const ToolbarButton: React.FC<{
    onClick: () => void;
    active?: boolean;
    title: string;
    children: React.ReactNode;
  }> = ({ onClick, active, title, children }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded-md transition-colors ${
        active
          ? 'bg-indigo-100 dark:bg-indigo-900/50 amoled:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 amoled:text-indigo-300'
          : 'hover:bg-slate-100 dark:hover:bg-slate-700 amoled:hover:bg-gray-800 text-slate-600 dark:text-slate-400 amoled:text-amoled-text-secondary'
      }`}
    >
      {children}
    </button>
  );

  // Highlight keywords in the editor content
  const highlightKeywords = useCallback(() => {
    if (!editorRef.current || !keywords.trim()) return;

    const keywordList = keywords.split(',').map(k => k.trim()).filter(Boolean);
    if (keywordList.length === 0) return;

    // Get current content and selection
    const content = editorRef.current.innerHTML;

    // Remove existing highlights
    let cleanContent = content.replace(/<mark[^>]*>(.*?)<\/mark>/gi, '$1');

    // Add new highlights
    keywordList.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      cleanContent = cleanContent.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-700 px-0.5 rounded">$1</mark>');
    });

    editorRef.current.innerHTML = cleanContent;
  }, [keywords]);

  // Apply highlighting when keywords change
  useEffect(() => {
    const debounceTimer = setTimeout(highlightKeywords, 300);
    return () => clearTimeout(debounceTimer);
  }, [keywords, highlightKeywords]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (application && editorRef.current) {
      setIsSaving(true);
      // Remove highlight marks before saving
      const content = editorRef.current.innerHTML.replace(/<mark[^>]*>(.*?)<\/mark>/gi, '$1');
      await onSave(application.id, content);
      setIsSaving(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-xl shadow-2xl w-full max-w-3xl mx-2 sm:mx-4 my-4 sm:my-6 flex flex-col max-h-[90vh] amoled:border amoled:border-amoled-border"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700 amoled:border-amoled-border">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text">
              Job Description
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {application?.role} at {application?.company}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Keyword Highlight Input */}
        <div className="px-4 sm:px-6 pt-4">
          <input
            type="text"
            placeholder="Highlight keywords (comma-separated)..."
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="w-full border border-slate-300 dark:border-slate-600 amoled:border-amoled-border rounded-lg px-4 py-2.5 bg-white dark:bg-dark-card amoled:bg-amoled-card text-slate-900 dark:text-dark-text amoled:text-amoled-text placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Formatting Toolbar */}
        <div className="px-4 sm:px-6 pt-4">
          <div className="flex items-center gap-1 p-2 bg-slate-50 dark:bg-slate-800 amoled:bg-black rounded-t-lg border border-b-0 border-slate-200 dark:border-slate-700 amoled:border-amoled-border">
            <ToolbarButton onClick={() => execFormatCommand('bold')} title="Bold (Ctrl+B)">
              <Bold className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => execFormatCommand('italic')} title="Italic (Ctrl+I)">
              <Italic className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => execFormatCommand('underline')} title="Underline (Ctrl+U)">
              <Underline className="w-4 h-4" />
            </ToolbarButton>
            <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 amoled:bg-amoled-border mx-2" />
            <ToolbarButton onClick={() => execFormatCommand('insertUnorderedList')} title="Bullet List">
              <List className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => execFormatCommand('insertOrderedList')} title="Numbered List">
              <ListOrdered className="w-4 h-4" />
            </ToolbarButton>
          </div>
        </div>

        {/* Editor */}
        <div className="px-4 sm:px-6 flex-1 overflow-hidden">
          <div
            ref={setEditorRef}
            contentEditable
            className="w-full h-64 sm:h-80 overflow-y-auto p-4 border border-slate-200 dark:border-slate-700 amoled:border-amoled-border rounded-b-lg bg-white dark:bg-slate-900 amoled:bg-black text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm leading-relaxed"
            style={{ minHeight: '200px' }}
            onKeyDown={(e) => {
              // Handle keyboard shortcuts
              if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                  case 'b':
                    e.preventDefault();
                    execFormatCommand('bold');
                    break;
                  case 'i':
                    e.preventDefault();
                    execFormatCommand('italic');
                    break;
                  case 'u':
                    e.preventDefault();
                    execFormatCommand('underline');
                    break;
                }
              }
            }}
          />
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-end items-center gap-3 p-4 sm:p-6 border-t border-slate-200 dark:border-slate-700 amoled:border-amoled-border">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg font-medium text-sm bg-slate-100 dark:bg-slate-700 amoled:bg-gray-800 hover:bg-slate-200 dark:hover:bg-slate-600 amoled:hover:bg-gray-700 text-slate-700 dark:text-slate-300 amoled:text-amoled-text transition-colors"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={isSaving}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg font-medium text-sm bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              'Save'
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default JobDescriptionModal;
