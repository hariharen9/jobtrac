import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Pencil, Building2, Heart, HelpCircle, Newspaper, Users, Calendar, ExternalLink, MoreHorizontal } from 'lucide-react';
import { CompanyResearch } from '../../../types';
import ConfirmationModal from '../../../components/shared/ConfirmationModal';
import SimpleTooltip from '../../../components/shared/SimpleTooltip';

interface CompanyCardProps {
  company: CompanyResearch;
  onEditCompany: (company: CompanyResearch) => void;
  onDeleteCompany: (id: string) => void;
  viewMode?: 'grid' | 'list' | 'compact';
}

const CompanyCard: React.FC<CompanyCardProps> = ({ 
  company, 
  onEditCompany, 
  onDeleteCompany, 
  viewMode = 'grid' 
}) => {
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleDeleteClick = () => {
    setConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    onDeleteCompany(company.id as string);
    setConfirmModalOpen(false);
  };

  // Calculate completeness score
  const completenessScore = [
    company.whatTheyDo,
    company.values,
    company.why,
    company.questions,
    company.news
  ].filter(Boolean).length;

  const completenessPercentage = (completenessScore / 5) * 100;

  // Get completeness color
  const getCompletenessColor = (percentage: number) => {
    if (percentage >= 80) return 'text-emerald-600 dark:text-emerald-400 amoled:text-emerald-500';
    if (percentage >= 60) return 'text-amber-600 dark:text-amber-400 amoled:text-amber-500';
    return 'text-red-500 dark:text-red-400 amoled:text-red-500';
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  if (viewMode === 'compact') {
    return (
      <>
        <motion.div 
          className="group bg-white dark:bg-dark-card amoled:bg-amoled-card border border-slate-200 dark:border-dark-border amoled:border-amoled-border rounded-lg p-3 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600 amoled:hover:border-indigo-700 transition-all cursor-pointer"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          onClick={() => onEditCompany(company)}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/50 amoled:bg-indigo-900/30 rounded-md flex-shrink-0">
                <Building2 className="w-3 h-3 text-indigo-600 dark:text-indigo-400 amoled:text-indigo-500" />
              </div>
              <h3 className="font-semibold text-sm text-slate-900 dark:text-dark-text amoled:text-amoled-text truncate">
                {company.company}
              </h3>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <SimpleTooltip content="Edit">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditCompany(company);
                  }}
                  className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 amoled:hover:text-indigo-500 transition-colors"
                >
                  <Pencil className="w-3 h-3" />
                </button>
              </SimpleTooltip>
              <SimpleTooltip content="Delete">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick();
                  }}
                  className="p-1 text-slate-400 hover:text-red-500 dark:hover:text-red-400 amoled:hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </SimpleTooltip>
            </div>
          </div>
          
          <p className="text-xs text-slate-600 dark:text-slate-400 amoled:text-slate-500 line-clamp-2 mb-2">
            {company.whatTheyDo}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${
                completenessPercentage >= 80 
                  ? 'bg-emerald-500' 
                  : completenessPercentage >= 60 
                  ? 'bg-amber-500' 
                  : 'bg-red-500'
              }`} />
              <span className="text-xs text-slate-500 dark:text-slate-400 amoled:text-slate-500">
                {completenessScore}/5
              </span>
            </div>
            <span className="text-xs text-slate-400 dark:text-slate-500 amoled:text-slate-600">
              {formatDate(company.date)}
            </span>
          </div>
        </motion.div>
        
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={() => setConfirmModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Company Research"
          message={`Are you sure you want to delete the research for ${company.company}? This action cannot be undone.`}
        />
      </>
    );
  }

  if (viewMode === 'list') {
    return (
      <>
        <motion.div 
          className="group bg-white dark:bg-dark-card amoled:bg-amoled-card border border-slate-200 dark:border-dark-border amoled:border-amoled-border rounded-xl p-4 sm:p-5 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-600 amoled:hover:border-indigo-700 transition-all"
          whileHover={{ scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 amoled:bg-indigo-900/30 rounded-lg flex-shrink-0">
                  <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 amoled:text-indigo-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-lg sm:text-xl text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-1">
                    {company.company}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 amoled:text-slate-500 line-clamp-2">
                    {company.whatTheyDo}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {company.why && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-rose-500 dark:text-rose-400 amoled:text-rose-500" />
                      <h4 className="font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text">Why I want to work here</h4>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 amoled:text-slate-400 line-clamp-3 pl-6">
                      {company.why}
                    </p>
                  </div>
                )}

                {company.questions && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-blue-500 dark:text-blue-400 amoled:text-blue-500" />
                      <h4 className="font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text">Questions to ask</h4>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 amoled:text-slate-400 line-clamp-3 pl-6 italic">
                      "{company.questions}"
                    </p>
                  </div>
                )}
              </div>

              {(company.values || company.news) && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 amoled:border-slate-800">
                  <div className="grid grid-cols-1 gap-4 text-sm">
                    {company.values && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-emerald-500 dark:text-emerald-400 amoled:text-emerald-500" />
                          <h4 className="font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text">Company Values</h4>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 amoled:text-slate-400 line-clamp-2 pl-6">
                          {company.values}
                        </p>
                      </div>
                    )}

                    {company.news && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Newspaper className="w-4 h-4 text-amber-500 dark:text-amber-400 amoled:text-amber-500" />
                          <h4 className="font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text">Recent News</h4>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 amoled:text-slate-400 line-clamp-2 pl-6">
                          {company.news}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 amoled:text-slate-500">
                    Completeness
                  </span>
                  <div className={`text-sm font-bold ${getCompletenessColor(completenessPercentage)}`}>
                    {completenessPercentage.toFixed(0)}%
                  </div>
                </div>
                <div className="w-16 sm:w-20 h-2 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      completenessPercentage >= 80 
                        ? 'bg-emerald-500' 
                        : completenessPercentage >= 60 
                        ? 'bg-amber-500' 
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${completenessPercentage}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-1 sm:flex-col sm:items-end sm:gap-2">
                <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500 amoled:text-slate-600" />
                <span className="text-xs text-slate-500 dark:text-slate-400 amoled:text-slate-500">
                  {formatDate(company.date)}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <SimpleTooltip content="Edit Research">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onEditCompany(company)}
                    className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 amoled:hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 amoled:hover:bg-indigo-900/20 rounded-lg transition-all"
                  >
                    <Pencil className="w-4 h-4" />
                  </motion.button>
                </SimpleTooltip>
                <SimpleTooltip content="Delete Research">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleDeleteClick}
                    className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 amoled:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 amoled:hover:bg-red-900/20 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </SimpleTooltip>
              </div>
            </div>
          </div>
        </motion.div>
        
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={() => setConfirmModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Company Research"
          message={`Are you sure you want to delete the research for ${company.company}? This action cannot be undone.`}
        />
      </>
    );
  }

  // Grid view (default)
  return (
    <>
      <motion.div 
        className="group bg-white dark:bg-dark-card amoled:bg-amoled-card border border-slate-200 dark:border-dark-border amoled:border-amoled-border rounded-xl p-5 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-600 amoled:hover:border-indigo-700 transition-all relative overflow-hidden"
        whileHover={{ scale: 1.02, y: -4 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/30 dark:from-indigo-900/10 dark:to-purple-900/5 amoled:from-indigo-900/5 amoled:to-purple-900/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/50 amoled:bg-indigo-900/30 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 amoled:text-indigo-500" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-lg text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 amoled:group-hover:text-indigo-500 transition-colors">
                  {company.company}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 amoled:text-slate-500 line-clamp-2">
                  {company.whatTheyDo}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <SimpleTooltip content="Edit Research">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onEditCompany(company)}
                  className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 amoled:hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 amoled:hover:bg-indigo-900/20 rounded-lg transition-all"
                >
                  <Pencil className="w-4 h-4" />
                </motion.button>
              </SimpleTooltip>
              <SimpleTooltip content="Delete Research">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDeleteClick}
                  className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 amoled:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 amoled:hover:bg-red-900/20 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </SimpleTooltip>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-4 mb-5">
            {company.why && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500 dark:text-rose-400 amoled:text-rose-500" />
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-dark-text amoled:text-amoled-text">Why I want to work here</h4>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 amoled:text-slate-400 line-clamp-3 pl-6">
                  {company.why}
                </p>
              </div>
            )}

            {company.questions && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-500 dark:text-blue-400 amoled:text-blue-500" />
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-dark-text amoled:text-amoled-text">Questions to ask</h4>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 amoled:text-slate-400 line-clamp-3 pl-6 italic">
                  "{company.questions}"
                </p>
              </div>
            )}

            {company.values && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-500 dark:text-emerald-400 amoled:text-emerald-500" />
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-dark-text amoled:text-amoled-text">Company Values</h4>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 amoled:text-slate-400 line-clamp-2 pl-6">
                  {company.values}
                </p>
              </div>
            )}

            {company.news && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Newspaper className="w-4 h-4 text-amber-500 dark:text-amber-400 amoled:text-amber-500" />
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-dark-text amoled:text-amoled-text">Recent News</h4>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 amoled:text-slate-400 line-clamp-2 pl-6">
                  {company.news}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700 amoled:border-slate-800">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                completenessPercentage >= 80 
                  ? 'bg-emerald-500' 
                  : completenessPercentage >= 60 
                  ? 'bg-amber-500' 
                  : 'bg-red-500'
              }`} />
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 amoled:text-slate-500">
                {completenessScore}/5 complete
              </span>
            </div>
            
            <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 amoled:text-slate-600">
              <Calendar className="w-3 h-3" />
              {formatDate(company.date)}
            </div>
          </div>
        </div>
      </motion.div>
      
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Company Research"
        message={`Are you sure you want to delete the research for ${company.company}? This action cannot be undone.`}
      />
    </>
  );
};

export default React.memo(CompanyCard);
