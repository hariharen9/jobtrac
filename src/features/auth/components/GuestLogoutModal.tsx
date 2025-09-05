import React from 'react';
import Modal from '../../../components/shared/Modal';

interface GuestLogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const GuestLogoutModal: React.FC<GuestLogoutModalProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Guest User Sign Out" size="md">
      <div className="p-4 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <p className="text-lg font-semibold text-slate-900 dark:text-dark-text mb-2">
          Guest User Sign Out
        </p>
        
        <p className="text-slate-600 dark:text-dark-text-secondary mb-6">
          You are signed in as a guest. Signing out will permanently delete all your data. 
          To keep your data, connect a Google account ( Via Profile ) <br/> before signing out. 😭
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg font-semibold text-sm bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors text-slate-800 dark:text-slate-200"
          >
            Cancel
          </button>
          
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-lg font-semibold text-sm bg-red-600 text-white hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
          >
            Sign Out & Delete Data
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default GuestLogoutModal;