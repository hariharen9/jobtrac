import React, { useState } from 'react';
import Modal from '../../../components/shared/Modal';

interface QuickAddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (companyName: string) => Promise<void>;
}

const QuickAddCompanyModal: React.FC<QuickAddCompanyModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [companyName, setCompanyName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(companyName.trim());
      setCompanyName('');
      onClose();
    } catch (error) {
      console.error('Failed to add company:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Target Company"
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-dark-text amoled:text-amoled-text mb-2">
            Company Name
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. Google, Microsoft, Startup Inc."
            className="w-full px-4 py-2 border border-slate-300 dark:border-dark-border amoled:border-amoled-border rounded-lg bg-white dark:bg-dark-card amoled:bg-amoled-card text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            autoFocus
            required
          />
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            This will add the company to your "Company Intelligence" list so you can track networking coverage.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!companyName.trim() || isSubmitting}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Adding...
              </>
            ) : (
              'Add Company'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default QuickAddCompanyModal;