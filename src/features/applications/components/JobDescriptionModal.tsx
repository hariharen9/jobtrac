import React, { useState, useEffect, useMemo } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Application } from '../../../types';
import { motion } from 'framer-motion';

interface JobDescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application | null;
  onSave: (applicationId: string, jobDescription: string) => void;
}

const JobDescriptionModal: React.FC<JobDescriptionModalProps> = ({ isOpen, onClose, application, onSave }) => {
  const [jd, setJd] = useState(application?.jobDescription || '');
  const [keywords, setKeywords] = useState('');

  useEffect(() => {
    setJd(application?.jobDescription || '');
  }, [application]);

  const highlightedJd = useMemo(() => {
    if (!keywords) return jd;
    const keywordList = keywords.split(',').map(k => k.trim()).filter(Boolean);
    if (keywordList.length === 0) return jd;
    const regex = new RegExp(`(${keywordList.join('|')})`, 'gi');
    return jd.replace(regex, '<mark>$1</mark>');
  }, [jd, keywords]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (application) {
      onSave(application.id, jd);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-2xl mx-2 sm:mx-4 my-4 sm:my-6"
      >
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-slate-900 dark:text-dark-text amoled:text-amoled-text">Job Description for {application?.role} at {application?.company}</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter keywords to highlight, separated by commas..."
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 bg-white dark:bg-dark-card amoled:bg-amoled-card text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div data-color-mode="light">
          <MDEditor
            value={highlightedJd}
            onChange={(value) => setJd(value || '')}
            height={300}
            className="text-sm"
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-end items-center gap-3 sm:gap-4 mt-4 sm:mt-6">
          <p className="text-xs text-slate-500 dark:text-slate-400 mr-auto sm:mr-0 mb-2 sm:mb-0">Markdown is supported</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-lg font-semibold text-sm bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Close
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="w-full sm:w-auto px-4 py-2 rounded-lg font-semibold text-sm bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            Save
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default JobDescriptionModal;
