import React from 'react';
import { Users, Plus } from 'lucide-react';
import { NetworkingContact } from '../../../types';
import NetworkingRow from './NetworkingRow';
import NetworkingCard from './NetworkingCard';
import { useMediaQuery } from '../../../hooks/shared/useMediaQuery';

interface NetworkingProps {
  contacts: NetworkingContact[];
  onAddContact: () => void;
  onEditContact: (contact: NetworkingContact) => void;
  onDeleteContact: (id: string) => void;
  loading?: boolean;
}

const Networking: React.FC<NetworkingProps> = ({ contacts, onAddContact, onEditContact, onDeleteContact, loading = false }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Users className="w-5 h-5" />
            Networking & Referrals
          </h2>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-slate-600 dark:text-slate-400">Loading contacts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
        <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Users className="w-5 h-5" />
          Networking & Referrals
        </h2>
        <button
          onClick={onAddContact}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2 justify-center sm:justify-start w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Add Contact
        </button>
      </div>
      {isMobile ? (
        <div className="space-y-4">
          {contacts.map(contact => (
            <NetworkingCard 
              key={contact.id} 
              contact={contact} 
              onEditContact={onEditContact} 
              onDeleteContact={onDeleteContact} 
            />
          ))}
          {contacts.length === 0 && (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              No networking contacts yet. Click "Add Contact" to start building your network!
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
            <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Company & Role</th>
                <th scope="col" className="px-6 py-3">Date Contacted</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Referral?</th>
                <th scope="col" className="px-6 py-3">Notes</th>
                <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {contacts.map(contact => (
                <NetworkingRow 
                  key={contact.id} 
                  contact={contact} 
                  onEditContact={onEditContact} 
                  onDeleteContact={onDeleteContact} 
                />
              ))}
              {contacts.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    No networking contacts yet. Click "Add Contact" to start building your network!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default React.memo(Networking);