import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    Wrench,
    Grid3X3,
    List,
    Archive,
    CheckSquare,
    Square,
    ChevronDown,
    Filter
} from 'lucide-react';
import { VaultResource, ResourceCategory } from '../../../types';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';
import LinkPreview from './LinkPreview';
import VaultAnalytics from './VaultAnalytics';
import VaultActionsMenu from './VaultActionsMenu';
import QuickAddForm from './QuickAddForm';
import { exportToJSON, exportToCSV, exportToMarkdown, exportToPDF } from '../utils/exportUtils';

interface VaultManagerProps {
    resources: VaultResource[];
    onAddResource: () => void;
    onEditResource: (resource: VaultResource) => void;
    onDeleteResource: (id: string) => void;
    onQuickAdd: (data: {
        title: string;
        url: string;
        description: string;
        category: ResourceCategory;
        tags: string[];
    }) => void;
    onBulkDelete: (ids: string[]) => void;
    onBulkUpdate: (ids: string[], updates: Partial<VaultResource>) => void;
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
    Documents: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800/30 amoled:bg-blue-950/20 amoled:text-blue-400 amoled:border-blue-800/20',
    Portfolio: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-800/30 amoled:bg-purple-950/20 amoled:text-purple-400 amoled:border-purple-800/20',
    Credentials: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800/30 amoled:bg-amber-950/20 amoled:text-amber-400 amoled:border-amber-800/20',
    Profiles: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800/30 amoled:bg-emerald-950/20 amoled:text-emerald-400 amoled:border-emerald-800/20',
    Learning: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-300 dark:border-indigo-800/30 amoled:bg-indigo-950/20 amoled:text-indigo-400 amoled:border-indigo-800/20',
    Tools: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950/30 dark:text-slate-300 dark:border-slate-800/30 amoled:bg-slate-950/20 amoled:text-slate-400 amoled:border-slate-800/20',
};

const VaultManager: React.FC<VaultManagerProps> = ({
    resources,
    onAddResource,
    onEditResource,
    onDeleteResource,
    onQuickAdd,
    onBulkDelete,
    onBulkUpdate,
    loading
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | 'all'>('all');
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedResources, setSelectedResources] = useState<string[]>([]);
    const [showPreviews] = useState(true);
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [showBulkActions, setShowBulkActions] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

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

    const handleOpenLink = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const handleSelectResource = (id: string) => {
        setSelectedResources(prev =>
            prev.includes(id)
                ? prev.filter(resId => resId !== id)
                : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        setSelectedResources(filteredResources.map(r => r.id));
    };

    const handleClearSelection = () => {
        setSelectedResources([]);
    };

    const handleBulkToggleFavorite = (ids: string[]) => {
        ids.forEach(id => {
            const resource = resources.find(r => r.id === id);
            if (resource) {
                onBulkUpdate([id], { isFavorite: !resource.isFavorite });
            }
        });
        setSelectedResources([]);
    };

    const handleBulkTogglePublic = (ids: string[]) => {
        ids.forEach(id => {
            const resource = resources.find(r => r.id === id);
            if (resource) {
                onBulkUpdate([id], { isPublic: !resource.isPublic });
            }
        });
        setSelectedResources([]);
    };

    const handleBulkDeleteResources = (ids: string[]) => {
        onBulkDelete(ids);
        setSelectedResources([]);
    };

    const handleExport = (format: 'json' | 'csv' | 'md' | 'pdf') => {
        switch (format) {
            case 'json':
                exportToJSON(resources);
                break;
            case 'csv':
                exportToCSV(resources);
                break;
            case 'md':
                exportToMarkdown(resources);
                break;
            case 'pdf':
                exportToPDF(resources);
                break;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-indigo-600 border-dashed rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50/50 dark:bg-dark-bg/50 amoled:bg-amoled-bg/50 -m-8 p-8 min-h-screen">
            {/* Professional Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-dark-text amoled:text-amoled-text">
                            Resource Vault
                        </h2>
                        <p className="text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                            Centralized repository for your professional resources
                        </p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onAddResource}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white amoled:bg-white text-white dark:text-slate-900 amoled:text-slate-900 font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Resource</span>
                    </motion.button>
                </div>
            </motion.div>

            {/* Filters and Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6 p-4 bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border shadow-sm"
            >
                <div className="space-y-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-dark-text-secondary amoled:text-amoled-text-secondary" />
                        <input
                            type="text"
                            placeholder="Search resources..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-dark-bg amoled:bg-amoled-bg border border-slate-200 dark:border-dark-border amoled:border-amoled-border rounded-lg text-slate-900 dark:text-dark-text amoled:text-amoled-text placeholder-slate-500 dark:placeholder-dark-text-secondary amoled:placeholder-amoled-text-secondary focus:border-slate-400 dark:focus:border-dark-text-secondary amoled:focus:border-amoled-text-secondary focus:ring-2 focus:ring-slate-200 dark:focus:ring-dark-border amoled:focus:ring-amoled-border transition-all duration-200"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Category Filter */}
                        <div className="flex-1">
                            {/* Mobile: Category Dropdown */}
                            <div className="md:hidden relative">
                                <button
                                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                    className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedCategory !== 'all'
                                        ? `${categoryColors[selectedCategory]} border shadow-sm`
                                        : 'bg-slate-100 dark:bg-dark-bg amoled:bg-amoled-bg text-slate-700 dark:text-dark-text amoled:text-amoled-text hover:bg-slate-200 dark:hover:bg-dark-border amoled:hover:bg-amoled-border'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Filter className="w-4 h-4" />
                                        <span>
                                            {selectedCategory === 'all' ? 'All Categories' : selectedCategory}
                                        </span>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {showCategoryDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-dark-card amoled:bg-amoled-card border border-slate-200 dark:border-dark-border amoled:border-amoled-border rounded-lg shadow-lg z-50"
                                        >
                                            <div className="p-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedCategory('all');
                                                        setShowCategoryDropdown(false);
                                                    }}
                                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedCategory === 'all'
                                                        ? 'bg-slate-900 dark:bg-white amoled:bg-white text-white dark:text-slate-900 amoled:text-slate-900'
                                                        : 'text-slate-700 dark:text-dark-text amoled:text-amoled-text hover:bg-slate-100 dark:hover:bg-dark-bg amoled:hover:bg-amoled-bg'
                                                        }`}
                                                >
                                                    <Filter className="w-4 h-4" />
                                                    <span>All Categories</span>
                                                </button>

                                                {categories.map(category => {
                                                    const CategoryIcon = categoryIcons[category];
                                                    return (
                                                        <button
                                                            key={category}
                                                            onClick={() => {
                                                                setSelectedCategory(category);
                                                                setShowCategoryDropdown(false);
                                                            }}
                                                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedCategory === category
                                                                ? `${categoryColors[category]} border`
                                                                : 'text-slate-700 dark:text-dark-text amoled:text-amoled-text hover:bg-slate-100 dark:hover:bg-dark-bg amoled:hover:bg-amoled-bg'
                                                                }`}
                                                        >
                                                            <CategoryIcon className="w-4 h-4" />
                                                            <span>{category}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Desktop: Category Pills */}
                            <div className="hidden md:flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSelectedCategory('all')}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedCategory === 'all'
                                        ? 'bg-slate-900 dark:bg-white amoled:bg-white text-white dark:text-slate-900 amoled:text-slate-900 shadow-sm'
                                        : 'bg-slate-100 dark:bg-dark-bg amoled:bg-amoled-bg text-slate-700 dark:text-dark-text amoled:text-amoled-text hover:bg-slate-200 dark:hover:bg-dark-border amoled:hover:bg-amoled-border'
                                        }`}
                                >
                                    All
                                </button>
                                {categories.map(category => {
                                    const CategoryIcon = categoryIcons[category];
                                    return (
                                        <button
                                            key={category}
                                            onClick={() => setSelectedCategory(category)}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${selectedCategory === category
                                                ? `${categoryColors[category]} border shadow-sm`
                                                : 'bg-slate-100 dark:bg-dark-bg amoled:bg-amoled-bg text-slate-700 dark:text-dark-text amoled:text-amoled-text hover:bg-slate-200 dark:hover:bg-dark-border amoled:hover:bg-amoled-border'
                                                }`}
                                        >
                                            <CategoryIcon className="w-4 h-4" />
                                            <span>{category}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Actions and View Controls */}
                        <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                            <VaultActionsMenu
                                resources={resources}
                                selectedResources={selectedResources}
                                onQuickAdd={() => setShowQuickAdd(true)}
                                onBulkActions={() => setShowBulkActions(!showBulkActions)}
                                onExport={handleExport}
                            />

                            <button
                                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${showFavoritesOnly
                                    ? 'bg-amber-100 dark:bg-amber-950/30 amoled:bg-amber-950/20 text-amber-700 dark:text-amber-300 amoled:text-amber-400 border border-amber-200 dark:border-amber-800/30 amoled:border-amber-800/20'
                                    : 'bg-slate-100 dark:bg-dark-bg amoled:bg-amoled-bg text-slate-700 dark:text-dark-text amoled:text-amoled-text hover:bg-slate-200 dark:hover:bg-dark-border amoled:hover:bg-amoled-border'
                                    }`}
                            >
                                <Star className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                                <span>Favorites</span>
                            </button>

                            {/* View Mode Toggle */}
                            <div className="flex bg-slate-100 dark:bg-dark-bg amoled:bg-amoled-bg rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 ${viewMode === 'grid'
                                        ? 'bg-white dark:bg-dark-card amoled:bg-amoled-card text-slate-900 dark:text-dark-text amoled:text-amoled-text shadow-sm'
                                        : 'text-slate-500 dark:text-dark-text-secondary amoled:text-amoled-text-secondary hover:text-slate-700 dark:hover:text-dark-text amoled:hover:text-amoled-text'
                                        }`}
                                >
                                    <Grid3X3 className="w-4 h-4" />
                                    <span className="hidden sm:inline">Grid</span>
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 ${viewMode === 'list'
                                        ? 'bg-white dark:bg-dark-card amoled:bg-amoled-card text-slate-900 dark:text-dark-text amoled:text-amoled-text shadow-sm'
                                        : 'text-slate-500 dark:text-dark-text-secondary amoled:text-amoled-text-secondary hover:text-slate-700 dark:hover:text-dark-text amoled:hover:text-amoled-text'
                                        }`}
                                >
                                    <List className="w-4 h-4" />
                                    <span className="hidden sm:inline">List</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Quick Add Form */}
            <QuickAddForm
                isOpen={showQuickAdd}
                onClose={() => setShowQuickAdd(false)}
                onSubmit={onQuickAdd}
                onUseTemplate={() => { }}
            />

            {/* Bulk Actions Panel */}
            <AnimatePresence>
                {showBulkActions && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mb-6"
                    >
                        <div className="p-4 bg-slate-50 dark:bg-dark-bg amoled:bg-amoled-bg rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text">
                                    Bulk Actions
                                </h3>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={selectedResources.length === resources.length ? handleClearSelection : handleSelectAll}
                                        className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary hover:text-slate-900 dark:hover:text-dark-text amoled:hover:text-amoled-text transition-colors"
                                    >
                                        {selectedResources.length === resources.length ? (
                                            <CheckSquare className="w-4 h-4" />
                                        ) : (
                                            <Square className="w-4 h-4" />
                                        )}
                                        {selectedResources.length === resources.length ? 'Deselect All' : 'Select All'}
                                    </button>
                                </div>
                            </div>

                            {selectedResources.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                                        {selectedResources.length} selected:
                                    </span>

                                    <button
                                        onClick={() => handleBulkToggleFavorite(selectedResources)}
                                        className="flex items-center gap-1 px-2 py-1 text-xs bg-amber-100 dark:bg-amber-950/30 amoled:bg-amber-950/20 text-amber-700 dark:text-amber-300 amoled:text-amber-400 rounded hover:bg-amber-200 dark:hover:bg-amber-950/50 amoled:hover:bg-amber-950/30 transition-colors"
                                    >
                                        <Star className="w-3 h-3" />
                                        Toggle Favorite
                                    </button>

                                    <button
                                        onClick={() => handleBulkTogglePublic(selectedResources)}
                                        className="flex items-center gap-1 px-2 py-1 text-xs bg-green-100 dark:bg-green-950/30 amoled:bg-green-950/20 text-green-700 dark:text-green-300 amoled:text-green-400 rounded hover:bg-green-200 dark:hover:bg-green-950/50 amoled:hover:bg-green-950/30 transition-colors"
                                    >
                                        <Globe className="w-3 h-3" />
                                        Toggle Public
                                    </button>

                                    <button
                                        onClick={() => {
                                            if (window.confirm(`Delete ${selectedResources.length} selected resources?`)) {
                                                handleBulkDeleteResources(selectedResources);
                                            }
                                        }}
                                        className="flex items-center gap-1 px-2 py-1 text-xs bg-red-100 dark:bg-red-950/30 amoled:bg-red-950/20 text-red-700 dark:text-red-300 amoled:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-950/50 amoled:hover:bg-red-950/30 transition-colors"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                        Delete
                                    </button>
                                </div>
                            )}

                            {selectedResources.length === 0 && (
                                <p className="text-sm text-slate-500 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                                    Select resources to perform bulk actions
                                </p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Resources Grid */}
            {filteredResources.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16"
                >
                    <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 dark:bg-dark-bg amoled:bg-amoled-bg rounded-2xl flex items-center justify-center">
                        <Archive className="w-12 h-12 text-slate-400 dark:text-dark-text-secondary amoled:text-amoled-text-secondary" />
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-4">
                        {resources.length === 0 ? 'No resources yet' : 'No resources match your filters'}
                    </h3>

                    <p className="text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-8 max-w-md mx-auto">
                        {resources.length === 0
                            ? 'Start building your professional resource library. Add links to your resume, portfolio, certifications, and other career materials.'
                            : 'Try adjusting your search terms or filters to find what you\'re looking for.'
                        }
                    </p>

                    {resources.length === 0 && (
                        <button
                            onClick={onAddResource}
                            className="inline-flex items-center gap-3 px-6 py-3 bg-slate-900 dark:bg-white amoled:bg-white text-white dark:text-slate-900 amoled:text-slate-900 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Add Your First Resource</span>
                        </button>
                    )}
                </motion.div>
            ) : (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                    <AnimatePresence>
                        {filteredResources.map((resource, index) => {
                            const CategoryIcon = categoryIcons[resource.category];

                            if (viewMode === 'list') {
                                return (
                                    <motion.div
                                        key={resource.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="group bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border p-6 hover:shadow-lg transition-all duration-200"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`p-3 rounded-lg ${categoryColors[resource.category]} flex-shrink-0`}>
                                                <CategoryIcon className="w-5 h-5" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text truncate">
                                                            {resource.title}
                                                        </h3>
                                                        <p className="text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mt-1 line-clamp-2">
                                                            {resource.description}
                                                        </p>

                                                        {/* Tags */}
                                                        {resource.tags.length > 0 && (
                                                            <div className="flex flex-wrap gap-2 mt-3">
                                                                {resource.tags.slice(0, 4).map((tag, tagIndex) => (
                                                                    <span
                                                                        key={tagIndex}
                                                                        className="px-2 py-1 text-xs font-medium bg-slate-100 dark:bg-dark-bg amoled:bg-amoled-bg text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary rounded-md"
                                                                    >
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                                {resource.tags.length > 4 && (
                                                                    <span className="px-2 py-1 text-xs font-medium bg-slate-100 dark:bg-dark-bg amoled:bg-amoled-bg text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary rounded-md">
                                                                        +{resource.tags.length - 4}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-2 flex-shrink-0">
                                                        {resource.isFavorite && (
                                                            <Star className="w-4 h-4 text-amber-500 fill-current" />
                                                        )}
                                                        {resource.isPublic ? (
                                                            <Globe className="w-4 h-4 text-emerald-500" />
                                                        ) : (
                                                            <Lock className="w-4 h-4 text-slate-400 dark:text-dark-text-secondary amoled:text-amoled-text-secondary" />
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-dark-border amoled:border-amoled-border">
                                                    <span className="text-sm text-slate-500 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                                                        {formatDistanceToNow(
                                                            resource.createdAt instanceof Date
                                                                ? resource.createdAt
                                                                : resource.createdAt.toDate(),
                                                            { addSuffix: true }
                                                        )}
                                                    </span>

                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => handleCopyLink(resource.url, resource.title)}
                                                            className="p-2 text-slate-400 dark:text-dark-text-secondary amoled:text-amoled-text-secondary hover:text-slate-600 dark:hover:text-dark-text amoled:hover:text-amoled-text hover:bg-slate-100 dark:hover:bg-dark-bg amoled:hover:bg-amoled-bg rounded-lg transition-all duration-200"
                                                            title="Copy link"
                                                        >
                                                            <Copy className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleOpenLink(resource.url)}
                                                            className="p-2 text-slate-400 dark:text-dark-text-secondary amoled:text-amoled-text-secondary hover:text-slate-600 dark:hover:text-dark-text amoled:hover:text-amoled-text hover:bg-slate-100 dark:hover:bg-dark-bg amoled:hover:bg-amoled-bg rounded-lg transition-all duration-200"
                                                            title="Open link"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => onEditResource(resource)}
                                                            className="p-2 text-slate-400 dark:text-dark-text-secondary amoled:text-amoled-text-secondary hover:text-slate-600 dark:hover:text-dark-text amoled:hover:text-amoled-text hover:bg-slate-100 dark:hover:bg-dark-bg amoled:hover:bg-amoled-bg rounded-lg transition-all duration-200"
                                                            title="Edit resource"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => onDeleteResource(resource.id)}
                                                            className="p-2 text-slate-400 dark:text-dark-text-secondary amoled:text-amoled-text-secondary hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 amoled:hover:bg-red-950/10 rounded-lg transition-all duration-200"
                                                            title="Delete resource"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            }

                            // Grid view
                            return (
                                <motion.div
                                    key={resource.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -4 }}
                                    className={`group bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-2xl border p-6 hover:shadow-xl transition-all duration-300 ${selectedResources.includes(resource.id)
                                        ? 'border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-800/30 amoled:ring-indigo-800/20'
                                        : 'border-slate-200 dark:border-dark-border amoled:border-amoled-border hover:border-slate-300 dark:hover:border-dark-text-secondary amoled:hover:border-amoled-text-secondary'
                                        }`}
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleSelectResource(resource.id)}
                                                className="p-1 hover:bg-slate-100 dark:hover:bg-dark-bg amoled:hover:bg-amoled-bg rounded transition-colors"
                                            >
                                                {selectedResources.includes(resource.id) ? (
                                                    <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                                ) : (
                                                    <Square className="w-4 h-4 text-slate-400 dark:text-dark-text-secondary amoled:text-amoled-text-secondary" />
                                                )}
                                            </button>
                                            <div className={`p-3 rounded-xl ${categoryColors[resource.category]} flex-shrink-0`}>
                                                <CategoryIcon className="w-5 h-5" />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {resource.isFavorite && (
                                                <Star className="w-4 h-4 text-amber-500 fill-current" />
                                            )}
                                            {resource.isPublic ? (
                                                <Globe className="w-4 h-4 text-emerald-500" />
                                            ) : (
                                                <Lock className="w-4 h-4 text-slate-400 dark:text-dark-text-secondary amoled:text-amoled-text-secondary" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-2 line-clamp-2 group-hover:text-slate-700 dark:group-hover:text-dark-text-secondary amoled:group-hover:text-amoled-text-secondary transition-colors">
                                        {resource.title}
                                    </h3>

                                    <p className="text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-4 line-clamp-3 text-sm leading-relaxed">
                                        {resource.description}
                                    </p>

                                    {/* Tags */}
                                    {resource.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {resource.tags.slice(0, 3).map((tag, tagIndex) => (
                                                <span
                                                    key={tagIndex}
                                                    className="px-2 py-1 text-xs font-medium bg-slate-100 dark:bg-dark-bg amoled:bg-amoled-bg text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary rounded-md"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                            {resource.tags.length > 3 && (
                                                <span className="px-2 py-1 text-xs font-medium bg-slate-100 dark:bg-dark-bg amoled:bg-amoled-bg text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary rounded-md">
                                                    +{resource.tags.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Link Preview */}
                                    {showPreviews && (
                                        <div className="mb-4">
                                            <LinkPreview url={resource.url} title={resource.title} />
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-dark-border amoled:border-amoled-border">
                                        <span className="text-sm text-slate-500 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                                            {formatDistanceToNow(
                                                resource.createdAt instanceof Date
                                                    ? resource.createdAt
                                                    : resource.createdAt.toDate(),
                                                { addSuffix: true }
                                            )}
                                        </span>

                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleCopyLink(resource.url, resource.title)}
                                                className="p-2 text-slate-400 dark:text-dark-text-secondary amoled:text-amoled-text-secondary hover:text-slate-600 dark:hover:text-dark-text amoled:hover:text-amoled-text hover:bg-slate-100 dark:hover:bg-dark-bg amoled:hover:bg-amoled-bg rounded-lg transition-all duration-200"
                                                title="Copy link"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleOpenLink(resource.url)}
                                                className="p-2 text-slate-400 dark:text-dark-text-secondary amoled:text-amoled-text-secondary hover:text-slate-600 dark:hover:text-dark-text amoled:hover:text-amoled-text hover:bg-slate-100 dark:hover:bg-dark-bg amoled:hover:bg-amoled-bg rounded-lg transition-all duration-200"
                                                title="Open link"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onEditResource(resource)}
                                                className="p-2 text-slate-400 dark:text-dark-text-secondary amoled:text-amoled-text-secondary hover:text-slate-600 dark:hover:text-dark-text amoled:hover:text-amoled-text hover:bg-slate-100 dark:hover:bg-dark-bg amoled:hover:bg-amoled-bg rounded-lg transition-all duration-200"
                                                title="Edit resource"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onDeleteResource(resource.id)}
                                                className="p-2 text-slate-400 dark:text-dark-text-secondary amoled:text-amoled-text-secondary hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 amoled:hover:bg-red-950/10 rounded-lg transition-all duration-200"
                                                title="Delete resource"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

            {/* Advanced Analytics */}
            <VaultAnalytics resources={resources} />
        </div>
    );
};

export default VaultManager;