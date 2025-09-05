import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    setJd(application?.jobDescription || '');
  }, [application]);

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
        <div data-color-mode="light">
          <MDEditor
            value={jd}
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