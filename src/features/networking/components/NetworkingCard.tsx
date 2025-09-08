import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NetworkingContact } from '../../../types';
import { Pencil, Trash2 } from 'lucide-react';
import ConfirmationModal from '../../../components/shared/ConfirmationModal';

interface NetworkingCardProps {
  contact: NetworkingContact;
  onEditContact: (contact: NetworkingContact) => void;
  onDeleteContact: (id: string) => void;
}

const NetworkingCard: React.FC<NetworkingCardProps> = ({ contact, onEditContact, onDeleteContact }) => {
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);

  const handleDeleteClick = () => {
    setConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    onDeleteContact(contact.id);
    setConfirmModalOpen(false);
  };

  return (
    <>
      <motion.div 
        className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-4"
        whileHover={{ scale: 1.02, boxShadow: '0px 2px 10px rgba(0,0,0,0.05)' }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-dark-text amoled:text-amoled-text">{contact.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{contact.company} - {contact.role}</p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEditContact(contact)}
              className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2"
              aria-label="Edit contact"
            >
              <Pencil className="w-5 h-5" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDeleteClick}
              className="text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors p-2"
              aria-label="Delete contact"
            >
              <Trash2 className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500 dark:text-slate-400">Date Contacted</p>
            <p className="text-slate-900 dark:text-dark-text amoled:text-amoled-text font-medium">{contact.date}</p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">Status</p>
            <p className="text-slate-900 dark:text-dark-text amoled:text-amoled-text font-medium">{contact.status}</p>
          </div>
        </div>
        
        {contact.referral && (
          <div className="text-sm">
            <p className="text-slate-500 dark:text-slate-400">Referral</p>
            <p className="mt-1 text-slate-900 dark:text-dark-text amoled:text-amoled-text">{contact.referral === 'Y' ? 'Yes' : 'No'}</p>
          </div>
        )}
        
        {contact.notes && (
          <div className="text-sm">
            <p className="text-slate-500 dark:text-slate-400">Notes</p>
            <p className="mt-1 text-slate-900 dark:text-dark-text amoled:text-amoled-text">{contact.notes}</p>
          </div>
        )}
      </motion.div>
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Contact"
        message={`Are you sure you want to delete the contact ${contact.name}? This action cannot be undone.`}
      />
    </>
  );
};

export default React.memo(NetworkingCard);
