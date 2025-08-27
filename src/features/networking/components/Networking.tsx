import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus } from 'lucide-react';
import { NetworkingContact } from '../../../types';
import NetworkingRow from './NetworkingRow';
import NetworkingCard from './NetworkingCard';
import { useMediaQuery } from '../../../hooks/shared/useMediaQuery';
import EmptyState from '../../../components/shared/EmptyState';

interface NetworkingProps {
  contacts: NetworkingContact[];
  onAddContact: () => void;
  onEditContact: (contact: NetworkingContact) => void;
  onDeleteContact: (id: string) => void;
  loading?: boolean;
}

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

const Networking: React.FC<NetworkingProps> = ({ contacts, onAddContact, onEditContact, onDeleteContact, loading = false }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (loading) {
    return (
      <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-900 dark:text-dark-text amoled:text-amoled-text">
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
    <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card p-4 sm:p-6 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
        <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-slate-900 dark:text-dark-text amoled:text-amoled-text">
          <Users className="w-5 h-5" />
          Networking & Referrals
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddContact}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2 justify-center sm:justify-start w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Add Contact
        </motion.button>
      </div>
      {isMobile ? (
        <motion.div 
          className="space-y-4"
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {contacts.map(contact => (
              <motion.div key={contact.id} variants={itemVariants} layout>
                <NetworkingCard 
                  contact={contact} 
                  onEditContact={onEditContact} 
                  onDeleteContact={onDeleteContact} 
                />
              </motion.div>
            ))}
          </AnimatePresence>
          {contacts.length === 0 && (
            <EmptyState
              title="No Networking Contacts Yet"
              message="Start building your professional network by adding your first contact. Every connection counts!"
              buttonText="Add Contact"
              onButtonClick={onAddContact}
              icon={<Users className="w-8 h-8 text-indigo-600" />}
            />
          )}
        </motion.div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
            <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700/50 amoled:bg-amoled-card">
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
            <motion.tbody
              variants={listVariants}
              initial="hidden"
              animate="visible"
            >
              {contacts.map(contact => (
                <motion.tr 
                  key={contact.id} 
                  variants={itemVariants}
                  className="bg-white dark:bg-dark-card amoled:bg-amoled-card border-b border-slate-200 dark:border-slate-700"
                  whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
                  transition={{ duration: 0.2 }}
                >
                  <NetworkingRow 
                    contact={contact} 
                    onEditContact={onEditContact} 
                    onDeleteContact={onDeleteContact} 
                  />
                </motion.tr>
              ))}
              {contacts.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    <EmptyState
                      title="No Networking Contacts Yet"
                      message="Start building your professional network by adding your first contact. Every connection counts!"
                      buttonText="Add Contact"
                      onButtonClick={onAddContact}
                      icon={<Users className="w-8 h-8 text-indigo-600" />}
                    />
                  </td>
                </tr>
              )}
            </motion.tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default React.memo(Networking);