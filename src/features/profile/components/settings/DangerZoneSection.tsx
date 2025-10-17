import React, { useState } from 'react';
import { useAuth } from '../../../auth/hooks/useAuth';
import { Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Modal from '../../../../components/shared/Modal';

const DangerZoneSection: React.FC = () => {
  const { deleteAccount } = useAuth();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showFinalDeleteConfirmation, setShowFinalDeleteConfirmation] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      toast.success('User account deleted successfully.');
    } catch (error: unknown) {
      console.error('Error deleting account:', error);
      if (error instanceof Error) {
        toast.error(`Failed to delete account: ${error.message || 'Unknown error'}`);
      } else {
        toast.error('Failed to delete account: An unknown error occurred.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 amoled:text-red-400 mb-1">
          Danger Zone
        </h3>
        <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
          Irreversible actions that affect your account
        </p>
      </div>

      {/* Warning Card */}
      <div className="p-4 rounded-xl border-2 border-yellow-200 dark:border-yellow-700/50 amoled:border-yellow-700/50 bg-yellow-50 dark:bg-yellow-900/10 amoled:bg-yellow-900/10">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 amoled:text-yellow-400" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-1">
              Warning
            </h4>
            <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
              Actions in this section cannot be undone. Please proceed with caution.
            </p>
          </div>
        </div>
      </div>

      {/* Delete Account Card */}
      <div className="p-4 rounded-xl border-2 border-red-200 dark:border-red-700/50 amoled:border-red-700/50 bg-red-50 dark:bg-red-900/10 amoled:bg-red-900/10">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 amoled:bg-red-900/30">
            <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400 amoled:text-red-400" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-1">
              Delete Account
            </h4>
            <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-4">
              Permanently delete your account and all associated data. This action cannot be reversed.
            </p>
            
            <button
              onClick={() => setShowDeleteConfirmation(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* First Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        title="Confirm Account Deletion"
        size="md"
      >
        <div className="p-4 text-center">
          <div className="inline-flex p-4 rounded-full bg-red-100 dark:bg-red-900/30 amoled:bg-red-900/30 mb-4">
            <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400 amoled:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-2">
            Are you absolutely sure?
          </h3>
          <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-6">
            This action is irreversible. All your data, including applications, prep entries, company research, networking contacts, and STAR stories, will be permanently deleted.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setShowDeleteConfirmation(false)}
              className="px-6 py-2 rounded-lg font-medium text-sm bg-slate-200 dark:bg-slate-700 amoled:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 amoled:hover:bg-slate-600 transition-colors text-slate-800 dark:text-slate-200 amoled:text-slate-200"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setShowDeleteConfirmation(false);
                setShowFinalDeleteConfirmation(true);
              }}
              className="px-6 py-2 rounded-lg font-medium text-sm bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Yes, Delete My Account
            </button>
          </div>
        </div>
      </Modal>

      {/* Second Confirmation Modal */}
      <Modal
        isOpen={showFinalDeleteConfirmation}
        onClose={() => {
          setShowFinalDeleteConfirmation(false);
          setDeleteInput('');
        }}
        title="Final Confirmation"
        size="sm"
      >
        <div className="p-4">
          <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-4 text-center">
            To confirm deletion, please type <span className="font-bold text-red-600 dark:text-red-400 amoled:text-red-400">"delete"</span> below:
          </p>
          <input
            type="text"
            value={deleteInput}
            onChange={(e) => setDeleteInput(e.target.value)}
            placeholder="Type 'delete' to confirm"
            className="w-full p-3 border border-slate-300 dark:border-slate-700 amoled:border-slate-700 rounded-lg mb-4 text-center text-slate-900 dark:text-dark-text amoled:text-amoled-text bg-white dark:bg-dark-card amoled:bg-amoled-card focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={handleDeleteAccount}
            disabled={deleteInput !== 'delete'}
            className={`w-full px-6 py-3 rounded-lg font-medium text-sm transition-colors ${
              deleteInput === 'delete'
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-slate-300 dark:bg-slate-700 amoled:bg-slate-700 text-slate-500 dark:text-slate-400 amoled:text-slate-400 cursor-not-allowed'
            }`}
          >
            Delete Account Permanently
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default DangerZoneSection;
