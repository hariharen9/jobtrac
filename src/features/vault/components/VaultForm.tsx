import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  ExternalLink, 
  Star, 
  Globe, 
  Lock, 
  Plus,
  FileText,
  Briefcase,
  Award,
  User,
  BookOpen,
  Wrench
} from 'lucide-react';
import { VaultResource, ResourceCategory } from '../../../types';

interface VaultFormProps {
  onSubmit: (data: Omit<VaultResource, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
  initialData?: VaultResource | null;
  loading: boolean;
}

const categoryIcons: Record<ResourceCategory, React.ComponentType<{ className?: string }>> = {
  Documents: FileText,
  Portfolio: Briefcase,
  Credentials: Award,
  Profiles: User,
  Learning: BookOpen,
  Tools: Wrench,
};

const categoryDescriptions: Record<ResourceCategory, string> = {
  Documents: 'CVs, resumes, cover letters, and other documents',
  Portfolio: 'Projects, case studies, and work samples',
  Credentials: 'Certifications, awards, and achievements',
  Profiles: 'LinkedIn, GitHub, personal websites, and professional profiles',
  Learning: 'Courses, tutorials, books, and learning resources',
  Tools: 'Job search tools, templates, and utilities',
};

const VaultForm: React.FC<VaultFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  loading
}) => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    category: 'Documents' as ResourceCategory,
    tags: [] as string[],
    isPublic: false,
    isFavorite: false,
  });

  const [tagInput, setTagInput] = useState('');
  const [urlError, setUrlError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        url: initialData.url,
        description: initialData.description,
        category: initialData.category,
        tags: initialData.tags,
        isPublic: initialData.isPublic,
        isFavorite: initialData.isFavorite,
      });
    }
  }, [initialData]);

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, url }));
    if (url && !validateUrl(url)) {
      setUrlError('Please enter a valid URL (e.g., https://example.com)');
    } else {
      setUrlError('');
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.url.trim()) {
      return;
    }

    if (!validateUrl(formData.url)) {
      setUrlError('Please enter a valid URL');
      return;
    }

    try {
      // Filter out undefined values before submitting
      const cleanData = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== undefined)
      ) as typeof formData;
      
      await onSubmit(cleanData);
    } catch (error) {
      console.error('Error submitting vault resource:', error);
    }
  };

  const categories: ResourceCategory[] = ['Documents', 'Portfolio', 'Credentials', 'Profiles', 'Learning', 'Tools'];

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-dark-text amoled:text-amoled-text mb-2">
          Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="e.g., My Resume - Software Engineer"
          className="w-full px-3 py-2 border border-slate-300 dark:border-dark-border amoled:border-amoled-border rounded-lg bg-white dark:bg-dark-card amoled:bg-amoled-card text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          required
        />
      </div>

      {/* URL */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-dark-text amoled:text-amoled-text mb-2">
          URL *
        </label>
        <div className="relative">
          <input
            type="url"
            value={formData.url}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://drive.google.com/file/d/..."
            className={`w-full px-3 py-2 pr-10 border rounded-lg bg-white dark:bg-dark-card amoled:bg-amoled-card text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              urlError ? 'border-red-300 dark:border-red-600' : 'border-slate-300 dark:border-dark-border amoled:border-amoled-border'
            }`}
            required
          />
          <ExternalLink className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>
        {urlError && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{urlError}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-dark-text amoled:text-amoled-text mb-2">
          Category *
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {categories.map(category => {
            const CategoryIcon = categoryIcons[category];
            const isSelected = formData.category === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, category }))}
                className={`p-3 border rounded-lg text-left transition-colors ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 amoled:bg-indigo-900/20'
                    : 'border-slate-300 dark:border-dark-border amoled:border-amoled-border bg-white dark:bg-dark-card amoled:bg-amoled-card hover:border-slate-400'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <CategoryIcon className={`w-4 h-4 ${
                    isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary'
                  }`} />
                  <span className={`text-sm font-medium ${
                    isSelected ? 'text-indigo-900 dark:text-indigo-300' : 'text-slate-900 dark:text-dark-text amoled:text-amoled-text'
                  }`}>
                    {category}
                  </span>
                </div>
                <p className={`text-xs ${
                  isSelected ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary'
                }`}>
                  {categoryDescriptions[category]}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-dark-text amoled:text-amoled-text mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Brief description of this resource..."
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 dark:border-dark-border amoled:border-amoled-border rounded-lg bg-white dark:bg-dark-card amoled:bg-amoled-card text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-dark-text amoled:text-amoled-text mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 dark:bg-indigo-900/20 amoled:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 amoled:text-indigo-300 text-sm rounded"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-200"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a tag..."
            className="flex-1 px-3 py-2 border border-slate-300 dark:border-dark-border amoled:border-amoled-border rounded-lg bg-white dark:bg-dark-card amoled:bg-amoled-card text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={handleAddTag}
            disabled={!tagInput.trim()}
            className="px-3 py-2 bg-slate-100 dark:bg-dark-bg amoled:bg-amoled-bg text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary rounded-lg hover:bg-slate-200 dark:hover:bg-dark-card amoled:hover:bg-amoled-card disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className={`w-4 h-4 ${formData.isFavorite ? 'text-yellow-500 fill-current' : 'text-slate-400'}`} />
            <span className="text-sm font-medium text-slate-700 dark:text-dark-text amoled:text-amoled-text">
              Mark as favorite
            </span>
          </div>
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, isFavorite: !prev.isFavorite }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              formData.isFavorite ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-dark-border amoled:bg-amoled-border'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                formData.isFavorite ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {formData.isPublic ? (
              <Globe className="w-4 h-4 text-green-500" />
            ) : (
              <Lock className="w-4 h-4 text-slate-400" />
            )}
            <span className="text-sm font-medium text-slate-700 dark:text-dark-text amoled:text-amoled-text">
              Public resource
            </span>
            <span className="text-xs text-slate-500 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
              (Safe to share with recruiters)
            </span>
          </div>
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, isPublic: !prev.isPublic }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              formData.isPublic ? 'bg-green-600' : 'bg-slate-200 dark:bg-dark-border amoled:bg-amoled-border'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                formData.isPublic ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-dark-border amoled:border-amoled-border">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-slate-300 dark:border-dark-border amoled:border-amoled-border text-slate-700 dark:text-dark-text amoled:text-amoled-text rounded-lg hover:bg-slate-50 dark:hover:bg-dark-card amoled:hover:bg-amoled-card transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !formData.title.trim() || !formData.url.trim() || !!urlError}
          className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Saving...' : initialData ? 'Update Resource' : 'Add Resource'}
        </button>
      </div>
    </motion.form>
  );
};

export default VaultForm;