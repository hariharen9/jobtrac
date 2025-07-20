import React, { useState, useEffect } from 'react';
import { StarStory } from '../types';

interface StarFormProps {
  onSubmit: (story: Omit<StarStory, 'id'>) => void;
  onCancel: () => void;
  initialData?: StarStory | null;
  loading?: boolean;
}

const StarForm: React.FC<StarFormProps> = ({ onSubmit, onCancel, initialData, loading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    situation: '',
    task: '',
    action: '',
    result: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        situation: initialData.situation,
        task: initialData.task,
        action: initialData.action,
        result: initialData.result
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
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Story Title *</label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Led Team Through Critical System Migration"
          className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      
      <div className="space-y-4">
        <div className="border-l-4 border-blue-500 pl-4">
          <label className="block text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">
            <span className="font-bold">S</span>ituation *
          </label>
          <textarea
            required
            value={formData.situation}
            onChange={(e) => setFormData({ ...formData, situation: e.target.value })}
            rows={3}
            placeholder="Describe the context and background. What was the situation you were in?"
            className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="border-l-4 border-purple-500 pl-4">
          <label className="block text-sm font-medium text-purple-700 dark:text-purple-400 mb-1">
            <span className="font-bold">T</span>ask *
          </label>
          <textarea
            required
            value={formData.task}
            onChange={(e) => setFormData({ ...formData, task: e.target.value })}
            rows={3}
            placeholder="What was your responsibility or goal? What needed to be accomplished?"
            className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="border-l-4 border-orange-500 pl-4">
          <label className="block text-sm font-medium text-orange-700 dark:text-orange-400 mb-1">
            <span className="font-bold">A</span>ction *
          </label>
          <textarea
            required
            value={formData.action}
            onChange={(e) => setFormData({ ...formData, action: e.target.value })}
            rows={4}
            placeholder="What specific actions did you take? Focus on YOUR contributions and decisions."
            className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="border-l-4 border-green-500 pl-4">
          <label className="block text-sm font-medium text-green-700 dark:text-green-400 mb-1">
            <span className="font-bold">R</span>esult *
          </label>
          <textarea
            required
            value={formData.result}
            onChange={(e) => setFormData({ ...formData, result: e.target.value })}
            rows={3}
            placeholder="What was the outcome? Include metrics, impact, and lessons learned."
            className="w-full border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">💡 STAR Method Tips:</h4>
        <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
          <li>• Keep each section concise but detailed enough to understand the context</li>
          <li>• Focus on YOUR specific contributions in the Action section</li>
          <li>• Include quantifiable results when possible (percentages, time saved, etc.)</li>
          <li>• This story should demonstrate skills relevant to the job you're applying for</li>
        </ul>
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
            'Save Story'
          )}
        </button>
      </div>
    </form>
  );
};

export default StarForm;