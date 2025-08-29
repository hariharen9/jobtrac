import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Filter, SortAsc, SortDesc, X } from 'lucide-react';
import { NetworkingContact } from '../../../types';
import NetworkingRow from './NetworkingRow';
import NetworkingCard from './NetworkingCard';
import { useMediaQuery } from '../../../hooks/shared/useMediaQuery';
import EmptyState from '../../../components/shared/EmptyState';

type SortField = 'name' | 'company' | 'date' | 'status';
type SortDirection = 'asc' | 'desc';

interface FilterOptions {
  name: string;
  company: string;
  status: string[];
  referral: 'all' | 'Y' | 'N';
  dateRange: {
    start: string;
    end: string;
  };
}

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
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    name: '',
    company: '',
    status: [],
    referral: 'all',
    dateRange: {
      start: '',
      end: ''
    }
  });

  // Get unique statuses from contacts for filter options
  const statusOptions = useMemo(() => {
    const statuses = new Set(contacts.map(contact => contact.status).filter(Boolean));
    return Array.from(statuses).sort();
  }, [contacts]);

  // Sorting function
  const sortContacts = (contactList: NetworkingContact[]) => {
    return [...contactList].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'company':
          aValue = a.company.toLowerCase();
          bValue = b.company.toLowerCase();
          break;
        case 'date':
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case 'status':
          aValue = a.status.toLowerCase();
          bValue = b.status.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  // Filtering function
  const filterContacts = (contactList: NetworkingContact[]) => {
    return contactList.filter(contact => {
      // Name filter
      if (filters.name && !contact.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }

      // Company filter
      if (filters.company && !contact.company.toLowerCase().includes(filters.company.toLowerCase())) {
        return false;
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(contact.status)) {
        return false;
      }

      // Referral filter
      if (filters.referral !== 'all' && contact.referral !== filters.referral) {
        return false;
      }

      // Date range filter
      if (filters.dateRange.start || filters.dateRange.end) {
        const contactDate = new Date(contact.date);
        if (filters.dateRange.start && contactDate < new Date(filters.dateRange.start)) {
          return false;
        }
        if (filters.dateRange.end && contactDate > new Date(filters.dateRange.end)) {
          return false;
        }
      }

      return true;
    });
  };

  // Combined sorting and filtering
  const processedContacts = useMemo(() => {
    const filtered = filterContacts(contacts);
    return sortContacts(filtered);
  }, [contacts, sortField, sortDirection, filters]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleStatusFilter = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }));
  };

  const clearFilters = () => {
    setFilters({
      name: '',
      company: '',
      status: [],
      referral: 'all',
      dateRange: {
        start: '',
        end: ''
      }
    });
  };

  const hasActiveFilters = filters.name || filters.company || filters.status.length > 0 || 
    filters.referral !== 'all' || filters.dateRange.start || filters.dateRange.end;

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
          {processedContacts.length !== contacts.length && (
            <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
              ({processedContacts.length} of {contacts.length})
            </span>
          )}
        </h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {/* Filter Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`${hasActiveFilters 
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' 
              : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
            } px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 justify-center sm:justify-start`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="bg-indigo-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                {(filters.name ? 1 : 0) + (filters.company ? 1 : 0) + filters.status.length + (filters.referral !== 'all' ? 1 : 0) + (filters.dateRange.start || filters.dateRange.end ? 1 : 0)}
              </span>
            )}
          </motion.button>
          
          {/* Add Contact Button */}
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
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-4 bg-slate-50 dark:bg-slate-800/50"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Name Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Filter by name..."
                  value={filters.name}
                  onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Company Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  placeholder="Filter by company..."
                  value={filters.company}
                  onChange={(e) => setFilters(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Status Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map(status => (
                    <button
                      key={status}
                      onClick={() => handleStatusFilter(status)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        filters.status.includes(status)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Referral Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Referral
                </label>
                <select
                  value={filters.referral}
                  onChange={(e) => setFilters(prev => ({ ...prev, referral: e.target.value as 'all' | 'Y' | 'N' }))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All</option>
                  <option value="Y">Yes</option>
                  <option value="N">No</option>
                </select>
              </div>

              {/* Date Range Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Date Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      dateRange: { ...prev.dateRange, start: e.target.value }
                    }))}
                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <input
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      dateRange: { ...prev.dateRange, end: e.target.value }
                    }))}
                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={clearFilters}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Clear Filters
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sort Controls */}
      {!isMobile && (
        <div className="flex items-center gap-2 mb-4 text-sm">
          <span className="text-slate-600 dark:text-slate-400">Sort by:</span>
          {(['name', 'company', 'date', 'status'] as SortField[]).map(field => (
            <button
              key={field}
              onClick={() => handleSort(field)}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                sortField === field
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {field.charAt(0).toUpperCase() + field.slice(1)}
              {sortField === field && (
                sortDirection === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
              )}
            </button>
          ))}
        </div>
      )}
      {isMobile ? (
        <motion.div 
          className="space-y-4"
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {processedContacts.map(contact => (
              <motion.div key={contact.id} variants={itemVariants} layout>
                <NetworkingCard 
                  contact={contact} 
                  onEditContact={onEditContact} 
                  onDeleteContact={onDeleteContact} 
                />
              </motion.div>
            ))}
          </AnimatePresence>
          {processedContacts.length === 0 && contacts.length > 0 && (
            <div className="text-center py-8">
              <p className="text-slate-500 dark:text-slate-400 mb-4">No contacts match the current filters.</p>
              <button
                onClick={clearFilters}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 font-medium"
              >
                Clear Filters
              </button>
            </div>
          )}
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
            <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700/50 amoled:bg-white amoled:text-black">
              <tr>
                <th scope="col" className="px-6 py-3">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  >
                    Name
                    {sortField === 'name' && (
                      sortDirection === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3">
                  <button
                    onClick={() => handleSort('company')}
                    className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  >
                    Company & Role
                    {sortField === 'company' && (
                      sortDirection === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3">
                  <button
                    onClick={() => handleSort('date')}
                    className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  >
                    Date Contacted
                    {sortField === 'date' && (
                      sortDirection === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3">
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  >
                    Status
                    {sortField === 'status' && (
                      sortDirection === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                    )}
                  </button>
                </th>
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
              {processedContacts.map(contact => (
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
              {processedContacts.length === 0 && contacts.length > 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    <div className="flex flex-col items-center gap-3">
                      <p>No contacts match the current filters.</p>
                      <button
                        onClick={clearFilters}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 font-medium"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
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