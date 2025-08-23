import React from 'react';
import { NetworkingContact } from '../../../types';
import { Pencil, Trash2 } from 'lucide-react';

interface NetworkingCardProps {
  contact: NetworkingContact;
  onEditContact: (contact: NetworkingContact) => void;
  onDeleteContact: (id: string) => void;
}

const NetworkingCard: React.FC<NetworkingCardProps> = ({ contact, onEditContact, onDeleteContact }) => {
  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">{contact.name}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{contact.company} - {contact.role}</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onEditContact(contact)}
            className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2"
            aria-label="Edit contact"
          >
            <Pencil className="w-5 h-5" />
          </button>
          <button 
            onClick={() => onDeleteContact(contact.id)}
            className="text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors p-2"
            aria-label="Delete contact"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-slate-500 dark:text-slate-400">Date Contacted</p>
          <p className="text-slate-900 dark:text-slate-100 font-medium">{contact.dateContacted}</p>
        </div>
        <div>
          <p className="text-slate-500 dark:text-slate-400">Status</p>
          <p className="text-slate-900 dark:text-slate-100 font-medium">{contact.status}</p>
        </div>
      </div>
      
      {contact.referral && (
        <div className="text-sm">
          <p className="text-slate-500 dark:text-slate-400">Referral</p>
          <p className="mt-1 text-slate-900 dark:text-slate-100">Yes</p>
        </div>
      )}
      
      {contact.notes && (
        <div className="text-sm">
          <p className="text-slate-500 dark:text-slate-400">Notes</p>
          <p className="mt-1 text-slate-900 dark:text-slate-100">{contact.notes}</p>
        </div>
      )}
    </div>
  );
};

export default React.memo(NetworkingCard);
