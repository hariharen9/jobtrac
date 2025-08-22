import React from 'react';
import { CheckCircle, XCircle, Pencil, Trash2 } from 'lucide-react';
import { NetworkingContact } from '../../../types';

interface NetworkingRowProps {
  contact: NetworkingContact;
  onEditContact: (contact: NetworkingContact) => void;
  onDeleteContact: (id: string) => void;
}

const NetworkingRow: React.FC<NetworkingRowProps> = ({ contact, onEditContact, onDeleteContact }) => {
  return (
    <tr className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
      <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{contact.name}</td>
      <td className="px-6 py-4">{contact.company} - {contact.role}</td>
      <td className="px-6 py-4">{contact.date}</td>
      <td className="px-6 py-4">{contact.status}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-1">
          {contact.referral === 'Y' ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-green-700 font-medium">Yes</span>
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 text-red-600" />
              <span className="text-red-700 font-medium">No</span>
            </>
          )}
        </div>
      </td>
      <td className="px-6 py-4">{contact.notes}</td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={() => onEditContact(contact)}
            className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            aria-label="Edit contact"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDeleteContact(contact.id as string)}
            className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            aria-label="Delete contact"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default React.memo(NetworkingRow);
