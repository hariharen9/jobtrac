import React, { useState, useEffect } from 'react';
import { NetworkingContact } from '../../../types';

interface NetworkingFormProps {
  onSubmit: (contact: Omit<NetworkingContact, 'id'>) => void;
  onCancel: () => void;
  initialData?: NetworkingContact | null;
  loading?: boolean;
}

const NetworkingForm: React.FC<NetworkingFormProps> = ({ onSubmit, onCancel, initialData, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    role: '',
    date: new Date().toISOString().split('T')[0],
    status: '',
    referral: 'N' as 'Y' | 'N',
    notes: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        company: initialData.company,
        role: initialData.role,
        date: initialData.date,
        status: initialData.status,
        referral: initialData.referral || 'N',
        notes: initialData.notes || ''
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const statusOptions = [
    'Planning to reach out',
    'Messaged on LinkedIn',
    'Email sent',
    'Connected on LinkedIn',
    'Had initial conversation',
    'Follow-up scheduled',
    'Referral provided',
    'No response',
    'Not interested'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-dark-text amoled:text-amoled-text mb-1">Contact Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., John Smith"
            className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 bg-white dark:bg-dark-card amoled:bg-amoled-card text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-dark-text amoled:text-amoled-text mb-1">Company *</label>
          <input
            type="text"
            required
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="e.g., Google"
            className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 bg-white dark:bg-dark-card amoled:bg-amoled-card text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-dark-text amoled:text-amoled-text mb-1">Role/Title *</label>
          <input
            type="text"
            required
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            placeholder="e.g., Senior Software Engineer"
            className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 bg-white dark:bg-dark-card amoled:bg-amoled-card text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-dark-text amoled:text-amoled-text mb-1">Date Contacted</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 bg-white dark:bg-dark-card amoled:bg-amoled-card text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-dark-text amoled:text-amoled-text mb-1">Status *</label>
          <select
            required
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 bg-white dark:bg-dark-card amoled:bg-amoled-card text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select status...</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-dark-text amoled:text-amoled-text mb-1">Provided Referral?</label>
          <select
            value={formData.referral}
            onChange={(e) => setFormData({ ...formData, referral: e.target.value as 'Y' | 'N' })}
            className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 bg-white dark:bg-dark-card amoled:bg-amoled-card text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="N">No</option>
            <option value="Y">Yes</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-dark-text amoled:text-amoled-text mb-1">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          placeholder="Conversation details, follow-up actions, personal notes..."
          className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 bg-white dark:bg-dark-card amoled:bg-amoled-card text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-dark-text amoled:text-amoled-text bg-white dark:bg-dark-card amoled:bg-amoled-card border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
              Saving...
            </>
          ) : (
            'Save Contact'
          )}
        </button>
      </div>
    </form>
  );
};

export default NetworkingForm;