import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  ExternalLink, 
  Star, 
  Copy, 
  Edit, 
  Trash2, 
  Search,
  Globe,
  Lock,
  FileText,
  Briefcase,
  Award,
  User,
  BookOpen,
  Wrench
} from 'lucide-react';
import { VaultResource, ResourceCategory } from '../../../types';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';

interface VaultManagerProps {
  resources: VaultResource[];
  onAddResource: () => void;
  onEditResource: (resource: VaultResource) => void;
  onDeleteResource: (id: string) => void;
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

const categoryColors: Record<ResourceCategory, string> = {
  Documents: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
  Portfolio: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300',
  Credentials: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300',
  Profiles: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300',
  Learning: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300',
  Tools: 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300',
};

const VaultManager: React.FC<VaultManagerProps> = ({
  resources,
  onAddResource,
  onEditResource,
  onDeleteResource,
  loading
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | 'all'>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const categories: ResourceCategory[] = ['Documents', 'Portfolio', 'Credentials', 'Profiles', 'Learning', 'Tools'];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesFavorites = !showFavoritesOnly || resource.isFavorite;
    
    return matchesSearch && matchesCategory && matchesFavorites;
  });

  const handleCopyLink = (url: string, title: string) => {
    navigator.clipboard.writeText(url);
    toast.success(`Copied link for "${title}"`);
  };

  const handleOpenLink = (url: string, resourceId?: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    // Optionally track last accessed time
    // This could be implemented later if needed
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-indigo-600 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-dark-text amoled:text-amoled-text">
            My Vault
          </h2>
          <p className="text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
            Organize and manage your job search resources
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAddResource}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Resource
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-dark-border amoled:border-amoled-border rounded-lg bg-white dark:bg-dark-card amoled:bg-amoled-card text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as ResourceCategory | 'all')}
          className="px-3 py-2 border border-slate-300 dark:border-dark-border amoled:border-amoled-border rounded-lg bg-white dark:bg-dark-card amoled:bg-amoled-card text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        {/* Favorites Filter */}
        <button
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
            showFavoritesOnly
              ? 'bg-yellow-100 border-yellow-300 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-700 dark:text-yellow-300'
              : 'bg-white border-slate-300 text-slate-700 dark:bg-dark-card dark:border-dark-border dark:text-dark-text amoled:bg-amoled-card amoled:border-amoled-border amoled:text-amoled-text'
          }`}
        >
          <Star className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
          Favorites
        </button>
      </div>

      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-dark-card amoled:bg-amoled-card rounded-full flex items-center justify-center">
            <FileText className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-2">
            {resources.length === 0 ? 'No resources yet' : 'No resources match your filters'}
          </h3>
          <p className="text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-4">
            {resources.length === 0 
              ? 'Start building your resource vault by adding your first resource.'
              : 'Try adjusting your search or filters to find what you\'re looking for.'
            }
          </p>
          {resources.length === 0 && (
            <button
              onClick={onAddResource}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Your First Resource
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((resource) => {
            const CategoryIcon = categoryIcons[resource.category];
            return (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-dark-card amoled:bg-amoled-card border border-slate-200 dark:border-dark-border amoled:border-amoled-border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded ${categoryColors[resource.category]}`}>
                      <CategoryIcon className="w-4 h-4" />
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[resource.category]}`}>
                      {resource.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {resource.isFavorite && (
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    )}
                    {resource.isPublic ? (
                      <Globe className="w-4 h-4 text-green-500" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-2 line-clamp-2">
                  {resource.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-3 line-clamp-2">
                  {resource.description}
                </p>

                {/* Tags */}
                {resource.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {resource.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-slate-100 dark:bg-dark-bg amoled:bg-amoled-bg text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {resource.tags.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-dark-bg amoled:bg-amoled-bg text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary rounded">
                        +{resource.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-dark-border amoled:border-amoled-border">
                  <span className="text-xs text-slate-500 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                    {formatDistanceToNow(resource.createdAt.toDate(), { addSuffix: true })}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopyLink(resource.url, resource.title)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-dark-text amoled:hover:text-amoled-text transition-colors"
                      title="Copy link"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenLink(resource.url)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-dark-text amoled:hover:text-amoled-text transition-colors"
                      title="Open link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEditResource(resource)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
                      title="Edit resource"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteResource(resource.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                      title="Delete resource"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Stats */}
      {resources.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-6 border-t border-slate-200 dark:border-dark-border amoled:border-amoled-border">
          {categories.map(category => {
            const count = resources.filter(r => r.category === category).length;
            const CategoryIcon = categoryIcons[category];
            return (
              <div
                key={category}
                className="text-center p-3 bg-slate-50 dark:bg-dark-bg amoled:bg-amoled-bg rounded-lg"
              >
                <CategoryIcon className="w-6 h-6 mx-auto mb-1 text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary" />
                <div className="text-lg font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text">
                  {count}
                </div>
                <div className="text-xs text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                  {category}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VaultManager;