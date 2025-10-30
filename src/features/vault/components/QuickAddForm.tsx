import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Plus, 
  ExternalLink,
  FileText,
  Briefcase,
  Award,
  User,
  BookOpen,
  Wrench,
  Globe
} from 'lucide-react';
import { 
  FaGithub, 
  FaLinkedin, 
  FaGoogle, 
  FaDropbox, 
  FaMicrosoft,
  FaBehance,
  FaDribbble,
  FaStackOverflow,
  FaYoutube,
  FaMedium
} from 'react-icons/fa';
import { ResourceCategory } from '../../../types';
import { ResourceTemplate } from './VaultQuickActions';

interface QuickAddFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    url: string;
    description: string;
    category: ResourceCategory;
    tags: string[];
  }) => void;
  onUseTemplate: (template: ResourceTemplate) => void;
}

const categoryIcons: Record<ResourceCategory, React.ComponentType<{ className?: string }>> = {
  Documents: FileText,
  Portfolio: Briefcase,
  Credentials: Award,
  Profiles: User,
  Learning: BookOpen,
  Tools: Wrench,
};

const quickTemplates: ResourceTemplate[] = [
  {
    id: 'resume',
    title: 'Resume',
    category: 'Documents',
    description: 'Professional resume',
    tags: ['resume', 'cv'],
    icon: FaGoogle,
    placeholder: 'https://drive.google.com/file/d/...'
  },
  {
    id: 'portfolio',
    title: 'Portfolio',
    category: 'Portfolio',
    description: 'Personal portfolio',
    tags: ['portfolio', 'website'],
    icon: Globe,
    placeholder: 'https://yourname.dev'
  },
  {
    id: 'linkedin',
    title: 'LinkedIn',
    category: 'Profiles',
    description: 'LinkedIn profile',
    tags: ['linkedin', 'profile'],
    icon: FaLinkedin,
    placeholder: 'https://linkedin.com/in/...'
  },
  {
    id: 'github',
    title: 'GitHub',
    category: 'Profiles',
    description: 'GitHub profile',
    tags: ['github', 'code'],
    icon: FaGithub,
    placeholder: 'https://github.com/...'
  },
  {
    id: 'behance',
    title: 'Behance',
    category: 'Portfolio',
    description: 'Creative portfolio',
    tags: ['behance', 'design', 'creative'],
    icon: FaBehance,
    placeholder: 'https://behance.net/...'
  },
  {
    id: 'dribbble',
    title: 'Dribbble',
    category: 'Portfolio',
    description: 'Design portfolio',
    tags: ['dribbble', 'design', 'ui'],
    icon: FaDribbble,
    placeholder: 'https://dribbble.com/...'
  },
  {
    id: 'stackoverflow',
    title: 'Stack Overflow',
    category: 'Profiles',
    description: 'Developer profile',
    tags: ['stackoverflow', 'developer'],
    icon: FaStackOverflow,
    placeholder: 'https://stackoverflow.com/users/...'
  },
  {
    id: 'medium',
    title: 'Medium',
    category: 'Profiles',
    description: 'Writing profile',
    tags: ['medium', 'blog', 'writing'],
    icon: FaMedium,
    placeholder: 'https://medium.com/@...'
  }
];

const QuickAddForm: React.FC<QuickAddFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onUseTemplate
}) => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    category: 'Documents' as ResourceCategory,
    tags: [] as string[]
  });
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.url.trim()) return;
    
    onSubmit(formData);
    setFormData({
      title: '',
      url: '',
      description: '',
      category: 'Documents',
      tags: []
    });
    setTagInput('');
    onClose();
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleTemplateClick = (template: ResourceTemplate) => {
    setFormData({
      title: template.title,
      url: template.placeholder,
      description: template.description,
      category: template.category,
      tags: template.tags
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="p-6 bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-2xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text">
                Quick Add Resource
              </h3>
              <button
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-dark-text amoled:hover:text-amoled-text transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Templates */}
            <div className="mb-6">
              <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-3">
                Quick templates:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                {quickTemplates.map((template) => {
                  const Icon = template.icon;
                  return (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateClick(template)}
                      className="p-3 bg-slate-50 dark:bg-dark-bg amoled:bg-amoled-bg rounded-lg hover:bg-slate-100 dark:hover:bg-dark-border amoled:hover:bg-amoled-border transition-colors text-center"
                    >
                      <Icon className="w-5 h-5 mx-auto mb-1 text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary" />
                      <span className="text-xs font-medium text-slate-700 dark:text-dark-text amoled:text-amoled-text">
                        {template.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Resource title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-dark-border amoled:border-amoled-border rounded-lg bg-white dark:bg-dark-card amoled:bg-amoled-card text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.url}
                    onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-dark-border amoled:border-amoled-border rounded-lg bg-white dark:bg-dark-card amoled:bg-amoled-card text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-dark-border amoled:border-amoled-border rounded-lg bg-white dark:bg-dark-card amoled:bg-amoled-card text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as ResourceCategory }))}
                  className="px-3 py-2 border border-slate-300 dark:border-dark-border amoled:border-amoled-border rounded-lg bg-white dark:bg-dark-card amoled:bg-amoled-card text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {Object.keys(categoryIcons).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    placeholder="Add tags..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-3 py-2 border border-slate-300 dark:border-dark-border amoled:border-amoled-border rounded-lg bg-white dark:bg-dark-card amoled:bg-amoled-card text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-2 bg-slate-100 dark:bg-dark-bg amoled:bg-amoled-bg text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary rounded-lg hover:bg-slate-200 dark:hover:bg-dark-border amoled:hover:bg-amoled-border transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 dark:bg-indigo-950/30 amoled:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 amoled:text-indigo-400 text-sm rounded"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          tags: prev.tags.filter((_, i) => i !== index)
                        }))}
                        className="text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-dark-border amoled:border-amoled-border text-slate-700 dark:text-dark-text amoled:text-amoled-text rounded-lg hover:bg-slate-50 dark:hover:bg-dark-card amoled:hover:bg-amoled-card transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Add Resource
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuickAddForm;