import React, { useState, useEffect } from 'react';
import { Application, ApplicationStatus } from '../../../types';

interface ApplicationFormProps {
  onSubmit: (application: Omit<Application, 'id'>) => void;
  onCancel: () => void;
  initialData?: Application | null;
  loading?: boolean;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ onSubmit, onCancel, initialData, loading = false }) => {
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    link: '',
    date: new Date().toISOString().split('T')[0],
    status: 'To Apply' as ApplicationStatus,
    nextStep: '',
    recruiter: '',
    referral: 'N' as 'Y' | 'N',
    location: '',
    notes: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        company: initialData.company,
        role: initialData.role,
        link: initialData.link || '',
        date: initialData.date,
        status: initialData.status,
        nextStep: initialData.nextStep || '',
        recruiter: initialData.recruiter || '',
        referral: initialData.referral || 'N',
        location: initialData.location || '',
        notes: initialData.notes || ''
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const statusOptions: ApplicationStatus[] = [
    'To Apply', 'Applied', 'HR Screen', 'Tech Screen', 'Round 1', 
    'Manager Round', 'Final Round', 'Offer', 'Rejected', 'Ghosted'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company *</label>
          <input
            type="text"
            required
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role *</label>
          <input
            type="text"
            required
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Job Link</label>
          <input
            type="url"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date Applied</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as ApplicationStatus })}
            className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Recruiter Email</label>
          <input
            type="email"
            value={formData.recruiter}
            onChange={(e) => setFormData({ ...formData, recruiter: e.target.value })}
            className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Referral?</label>
          <select
            value={formData.referral}
            onChange={(e) => setFormData({ ...formData, referral: e.target.value as 'Y' | 'N' })}
            className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="N">No</option>
            <option value="Y">Yes</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Next Step</label>
        <input
          type="text"
          value={formData.nextStep}
          onChange={(e) => setFormData({ ...formData, nextStep: e.target.value })}
          className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
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
            'Save Application'
          )}
        </button>
      </div>
    </form>
  );
};

export default ApplicationForm;