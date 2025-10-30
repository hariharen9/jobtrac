import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  Upload, 
  Copy, 
  Trash2, 
  Star, 
  Globe, 
  Lock, 
  Plus,
  FileText,
  Briefcase,
  Award,
  User,
  BookOpen,
  Wrench,
  Zap,
  CheckSquare,
  Square
} from 'lucide-react';
import { 
  FaGithub, 
  FaLinkedin, 
  FaGoogle, 
  FaDropbox, 
  FaMicrosoft
} from 'react-icons/fa';
import { VaultResource, ResourceCategory } from '../../../types';
import { toast } from 'react-hot-toast';

interface VaultQuickActionsProps {
  resources: VaultResource[];
  selectedResources: string[];
  onSelectResource: (id: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onBulkDelete: (ids: string[]) => void;
  onBulkToggleFavorite: (ids: string[]) => void;
  onBulkTogglePublic: (ids: string[]) => void;
  onAddResource: () => void;
  onAddFromTemplate: (template: ResourceTemplate) => void;
}

interface ResourceTemplate {
  id: string;
  title: string;
  category: ResourceCategory;
  description: string;
  tags: string[];
  icon: React.ComponentType<{ className?: string }>;
  placeholder: string;
}

const resourceTemplates: ResourceTemplate[] = [
  {
    id: 'resume',
    title: 'Resume/CV',
    category: 'Documents',
    description: 'Your professional resume or curriculum vitae',
    tags: ['resume', 'cv', 'professional'],
    icon: FaGoogle,
    placeholder: 'https://drive.google.com/file/d/your-resume-id'
  },
  {
    id: 'portfolio',
    title: 'Portfolio Website',
    category: 'Portfolio',
    description: 'Your personal portfolio showcasing your work',
    tags: ['portfolio', 'website', 'showcase'],
    icon: Globe,
    placeholder: 'https://yourname.dev'
  },
  {
    id: 'linkedin',
    title: 'LinkedIn Profile',
    category: 'Profiles',
    description: 'Your professional LinkedIn profile',
    tags: ['linkedin', 'profile', 'networking'],
    icon: FaLinkedin,
    placeholder: 'https://linkedin.com/in/yourname'
  },
  {
    id: 'github',
    title: 'GitHub Profile',
    category: 'Profiles',
    description: 'Your GitHub profile and repositories',
    tags: ['github', 'code', 'repositories'],
    icon: FaGithub,
    placeholder: 'https://github.com/yourusername'
  },
  {
    id: 'certification',
    title: 'Professional Certification',
    category: 'Credentials',
    description: 'Industry certification or course completion',
    tags: ['certification', 'credential', 'achievement'],
    icon: Award,
    placeholder: 'https://coursera.org/verify/your-certificate'
  },
  {
    id: 'cover-letter',
    title: 'Cover Letter Template',
    category: 'Documents',
    description: 'Customizable cover letter template',
    tags: ['cover-letter', 'template', 'application'],
    icon: FaGoogle,
    placeholder: 'https://docs.google.com/document/d/your-cover-letter'
  }
];

const VaultQuickActions: React.FC<VaultQuickActionsProps> = ({
  resources,
  selectedResources,
  onSelectResource,
  onSelectAll,
  onClearSelection,
  onBulkDelete,
  onBulkToggleFavorite,
  onBulkTogglePublic,
  onAddResource,
  onAddFromTemplate
}) => {
  const [showTemplates, setShowTemplates] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const handleExportResources = () => {
    const exportData = resources.map(resource => ({
      title: resource.title,
      url: resource.url,
      description: resource.description,
      category: resource.category,
      tags: resource.tags.join(', '),
      isPublic: resource.isPublic,
      isFavorite: resource.isFavorite,
      createdAt: resource.createdAt.toDate().toISOString()
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vault-resources-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Resources exported successfully!');
  };

  const handleCopySelectedUrls = () => {
    const selectedUrls = resources
      .filter(r => selectedResources.includes(r.id))
      .map(r => `${r.title}: ${r.url}`)
      .join('\n');
    
    navigator.clipboard.writeText(selectedUrls);
    toast.success(`Copied ${selectedResources.length} resource URLs`);
  };

  const allSelected = resources.length > 0 && selectedResources.length === resources.length;
  const someSelected = selectedResources.length > 0;

  return (
    <div className="space-y-4">
      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowTemplates(!showTemplates)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-950/30 amoled:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 amoled:text-indigo-400 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-950/50 amoled:hover:bg-indigo-950/30 transition-colors"
        >
          <Zap className="w-4 h-4" />
          <span className="text-sm font-medium">Quick Add</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowBulkActions(!showBulkActions)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-950/30 amoled:bg-purple-950/20 text-purple-700 dark:text-purple-300 amoled:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-950/50 amoled:hover:bg-purple-950/30 transition-colors"
        >
          <CheckSquare className="w-4 h-4" />
          <span className="text-sm font-medium">Bulk Actions</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleExportResources}
          disabled={resources.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-950/30 amoled:bg-green-950/20 text-green-700 dark:text-green-300 amoled:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-950/50 amoled:hover:bg-green-950/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          <span className="text-sm font-medium">Export</span>
        </motion.button>
      </div>

      {/* Templates Panel */}
      <AnimatePresence>
        {showTemplates && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-slate-50 dark:bg-dark-bg amoled:bg-amoled-bg rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-3">
                Quick Add Templates
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {resourceTemplates.map((template) => {
                  const Icon = template.icon;
                  return (
                    <motion.button
                      key={template.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onAddFromTemplate(template);
                        setShowTemplates(false);
                      }}
                      className="p-3 bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-lg border border-slate-200 dark:border-dark-border amoled:border-amoled-border hover:border-slate-300 dark:hover:border-dark-text-secondary amoled:hover:border-amoled-text-secondary transition-colors text-left"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="w-5 h-5 text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary" />
                        <span className="text-sm font-medium text-slate-900 dark:text-dark-text amoled:text-amoled-text">
                          {template.title}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                        {template.description}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Actions Panel */}
      <AnimatePresence>
        {showBulkActions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-slate-50 dark:bg-dark-bg amoled:bg-amoled-bg rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text">
                  Bulk Actions
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={allSelected ? onClearSelection : onSelectAll}
                    className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary hover:text-slate-900 dark:hover:text-dark-text amoled:hover:text-amoled-text transition-colors"
                  >
                    {allSelected ? (
                      <CheckSquare className="w-4 h-4" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                    {allSelected ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
              </div>

              {someSelected && (
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                    {selectedResources.length} selected:
                  </span>
                  
                  <button
                    onClick={handleCopySelectedUrls}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-950/30 amoled:bg-blue-950/20 text-blue-700 dark:text-blue-300 amoled:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-950/50 amoled:hover:bg-blue-950/30 transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    Copy URLs
                  </button>

                  <button
                    onClick={() => onBulkToggleFavorite(selectedResources)}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-amber-100 dark:bg-amber-950/30 amoled:bg-amber-950/20 text-amber-700 dark:text-amber-300 amoled:text-amber-400 rounded hover:bg-amber-200 dark:hover:bg-amber-950/50 amoled:hover:bg-amber-950/30 transition-colors"
                  >
                    <Star className="w-3 h-3" />
                    Toggle Favorite
                  </button>

                  <button
                    onClick={() => onBulkTogglePublic(selectedResources)}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-green-100 dark:bg-green-950/30 amoled:bg-green-950/20 text-green-700 dark:text-green-300 amoled:text-green-400 rounded hover:bg-green-200 dark:hover:bg-green-950/50 amoled:hover:bg-green-950/30 transition-colors"
                  >
                    <Globe className="w-3 h-3" />
                    Toggle Public
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Delete ${selectedResources.length} selected resources?`)) {
                        onBulkDelete(selectedResources);
                      }
                    }}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-red-100 dark:bg-red-950/30 amoled:bg-red-950/20 text-red-700 dark:text-red-300 amoled:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-950/50 amoled:hover:bg-red-950/30 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              )}

              {!someSelected && (
                <p className="text-sm text-slate-500 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                  Select resources to perform bulk actions
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VaultQuickActions;
export type { ResourceTemplate };