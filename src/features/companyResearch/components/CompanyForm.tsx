import React, { useState, useEffect } from 'react';
import { CompanyResearch } from '../../../types';

interface CompanyFormProps {
  onSubmit: (company: Omit<CompanyResearch, 'id'>) => void;
  onCancel: () => void;
  initialData?: CompanyResearch | null;
  loading?: boolean;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ onSubmit, onCancel, initialData, loading = false }) => {
  const [formData, setFormData] = useState({
    company: '',
    whatTheyDo: '',
    values: '',
    why: '',
    questions: '',
    news: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        company: initialData.company,
        whatTheyDo: initialData.whatTheyDo,
        values: initialData.values || '',
        why: initialData.why,
        questions: initialData.questions,
        news: initialData.news || ''
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company Name *</label>
        <input
          type="text"
          required
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          placeholder="e.g., Google, Microsoft, Apple"
          className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">What They Do *</label>
        <textarea
          required
          value={formData.whatTheyDo}
          onChange={(e) => setFormData({ ...formData, whatTheyDo: e.target.value })}
          rows={2}
          placeholder="Brief description of the company's business, products, or services"
          className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company Values</label>
        <textarea
          value={formData.values}
          onChange={(e) => setFormData({ ...formData, values: e.target.value })}
          rows={2}
          placeholder="Key values, mission, or culture points"
          className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Why I Want to Work Here *</label>
        <textarea
          required
          value={formData.why}
          onChange={(e) => setFormData({ ...formData, why: e.target.value })}
          rows={3}
          placeholder="Your motivation, alignment with career goals, specific interests"
          className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Questions to Ask Them *</label>
        <textarea
          required
          value={formData.questions}
          onChange={(e) => setFormData({ ...formData, questions: e.target.value })}
          rows={2}
          placeholder="Thoughtful questions about the role, team, or company"
          className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Recent News/Updates</label>
        <textarea
          value={formData.news}
          onChange={(e) => setFormData({ ...formData, news: e.target.value })}
          rows={2}
          placeholder="Recent company news, product launches, or industry developments"
          className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div className="flex justify-end gap-3 pt-4">
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
            'Save Company Research'
          )}
        </button>
      </div>
    </form>
  );
};

export default CompanyForm;