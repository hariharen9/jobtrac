import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  Link as LinkIcon, 
  Tag, 
  FileText,
  CheckCircle,
  Clock
} from 'lucide-react';
import { CodingProblem, ProblemPlatform, ProblemDifficulty, ProblemStatus } from '../../../types';

interface ProblemFormProps {
  initialData?: CodingProblem | null;
  onSubmit: (data: Omit<CodingProblem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const ProblemForm: React.FC<ProblemFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<Partial<CodingProblem>>({
    title: '',
    platform: 'LeetCode',
    difficulty: 'Medium',
    status: 'Todo',
    link: '',
    notes: '',
    tags: [],
    timeSpent: 0,
    solvedDate: ''
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData as Omit<CodingProblem, 'id' | 'createdAt' | 'updatedAt'>);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags?.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...(prev.tags || []), tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Title & Link */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-dark-text amoled:text-amoled-text mb-1">
              Problem Title
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Code2 className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="pl-10 w-full rounded-lg border border-slate-300 dark:border-dark-border amoled:border-amoled-border bg-white dark:bg-dark-bg amoled:bg-amoled-bg px-3 py-2 text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. Two Sum"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-dark-text amoled:text-amoled-text mb-1">
              Problem Link
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="url"
                value={formData.link}
                onChange={e => setFormData({ ...formData, link: e.target.value })}
                className="pl-10 w-full rounded-lg border border-slate-300 dark:border-dark-border amoled:border-amoled-border bg-white dark:bg-dark-bg amoled:bg-amoled-bg px-3 py-2 text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:ring-2 focus:ring-indigo-500"
                placeholder="https://leetcode.com/problems/..."
              />
            </div>
          </div>
        </div>

        {/* Platform, Difficulty, Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-dark-text amoled:text-amoled-text mb-1">
              Platform
            </label>
            <select
              value={formData.platform}
              onChange={e => setFormData({ ...formData, platform: e.target.value as ProblemPlatform })}
              className="w-full rounded-lg border border-slate-300 dark:border-dark-border amoled:border-amoled-border bg-white dark:bg-dark-bg amoled:bg-amoled-bg px-3 py-2 text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:ring-2 focus:ring-indigo-500"
            >
              <option value="LeetCode">LeetCode</option>
              <option value="NeetCode">NeetCode</option>
              <option value="HackerRank">HackerRank</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-dark-text amoled:text-amoled-text mb-1">
              Difficulty
            </label>
            <select
              value={formData.difficulty}
              onChange={e => setFormData({ ...formData, difficulty: e.target.value as ProblemDifficulty })}
              className="w-full rounded-lg border border-slate-300 dark:border-dark-border amoled:border-amoled-border bg-white dark:bg-dark-bg amoled:bg-amoled-bg px-3 py-2 text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-dark-text amoled:text-amoled-text mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value as ProblemStatus })}
              className="w-full rounded-lg border border-slate-300 dark:border-dark-border amoled:border-amoled-border bg-white dark:bg-dark-bg amoled:bg-amoled-bg px-3 py-2 text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Todo">Todo</option>
              <option value="Solved">Solved</option>
              <option value="Attempted">Attempted</option>
              <option value="Revision Needed">Revision Needed</option>
            </select>
          </div>
        </div>

        {/* Time & Date (Only if solved/attempted) */}
        {(formData.status === 'Solved' || formData.status === 'Attempted') && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-dark-text amoled:text-amoled-text mb-1">
                Time Spent (minutes)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="number"
                  min="0"
                  value={formData.timeSpent || ''}
                  onChange={e => setFormData({ ...formData, timeSpent: parseInt(e.target.value) || 0 })}
                  className="pl-10 w-full rounded-lg border border-slate-300 dark:border-dark-border amoled:border-amoled-border bg-white dark:bg-dark-bg amoled:bg-amoled-bg px-3 py-2 text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-dark-text amoled:text-amoled-text mb-1">
                Date Solved
              </label>
              <input
                type="date"
                value={formData.solvedDate || new Date().toISOString().split('T')[0]}
                onChange={e => setFormData({ ...formData, solvedDate: e.target.value })}
                className="w-full rounded-lg border border-slate-300 dark:border-dark-border amoled:border-amoled-border bg-white dark:bg-dark-bg amoled:bg-amoled-bg px-3 py-2 text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-dark-text amoled:text-amoled-text mb-1">
            Tags
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Tag className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="pl-10 w-full rounded-lg border border-slate-300 dark:border-dark-border amoled:border-amoled-border bg-white dark:bg-dark-bg amoled:bg-amoled-bg px-3 py-2 text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:ring-2 focus:ring-indigo-500"
              placeholder="Type tag and press Enter (e.g. DP, Arrays)"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags?.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-indigo-900 dark:hover:text-indigo-200"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-dark-text amoled:text-amoled-text mb-1">
            Notes & Key Takeaways
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none">
              <FileText className="h-4 w-4 text-slate-400" />
            </div>
            <textarea
              rows={4}
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="pl-10 w-full rounded-lg border border-slate-300 dark:border-dark-border amoled:border-amoled-border bg-white dark:bg-dark-bg amoled:bg-amoled-bg px-3 py-2 text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:ring-2 focus:ring-indigo-500"
              placeholder="What did you learn? What was the tricky part?"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {initialData ? 'Update Problem' : 'Add Problem'}
        </button>
      </div>
    </form>
  );
};

export default ProblemForm;