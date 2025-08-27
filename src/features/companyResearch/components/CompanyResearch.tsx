import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, Plus } from 'lucide-react';
import { CompanyResearch } from '../../../types';
import CompanyCard from './CompanyCard';
import EmptyState from '../../../components/shared/EmptyState';

interface CompanyResearchProps {
  companies: CompanyResearch[];
  onAddCompany: () => void;
  onEditCompany: (company: CompanyResearch) => void;
  onDeleteCompany: (id: string) => void;
  loading?: boolean;
}

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

const CompanyResearchComponent: React.FC<CompanyResearchProps> = ({ 
  companies, 
  onAddCompany, 
  onEditCompany,
  onDeleteCompany,
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-900 dark:text-dark-text amoled:text-amoled-text">
            <Building className="w-5 h-5" />
            Company Research
          </h2>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-slate-600 dark:text-slate-400">Loading company research...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-900 dark:text-dark-text amoled:text-amoled-text">
          <Building className="w-5 h-5" />
          Company Research
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddCompany}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2 justify-center sm:justify-start w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Add Company
        </motion.button>
      </div>
      <motion.div 
        className="space-y-4"
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {companies.map(company => (
            <motion.div key={company.id} variants={itemVariants} layout>
              <CompanyCard 
                company={company} 
                onEditCompany={onEditCompany} 
                onDeleteCompany={onDeleteCompany} 
              />
            </motion.div>
          ))}
        </AnimatePresence>
        {companies.length === 0 && (
          <EmptyState
            title="No Company Research Yet"
            message="Start researching potential employers by adding your first company. Knowledge is power!"
            buttonText="Add Company"
            onButtonClick={onAddCompany}
            icon={<Building className="w-8 h-8 text-indigo-600" />}
          />
        )}
      </motion.div>
    </div>
  );
};

export default React.memo(CompanyResearchComponent);