import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Pencil } from 'lucide-react';
import { CompanyResearch } from '../../../types';

interface CompanyCardProps {
  company: CompanyResearch;
  onEditCompany: (company: CompanyResearch) => void;
  onDeleteCompany: (id: string) => void;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, onEditCompany, onDeleteCompany }) => {
  return (
    <motion.div 
      className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow relative space-y-4"
      whileHover={{ scale: 1.02, boxShadow: '0px 2px 10px rgba(0,0,0,0.05)' }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 pr-12">
          <h3 className="font-bold text-xl text-slate-900 dark:text-dark-text amoled:text-amoled-text">{company.company}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{company.whatTheyDo}</p>
        </div>
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEditCompany(company)}
            className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2"
            aria-label="Edit company research"
          >
            <Pencil className="w-5 h-5" />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDeleteCompany(company.id as string)}
            className="text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors p-2"
            aria-label="Delete company research"
          >
            <Trash2 className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-2">Why I want to work here:</h4>
          <p className="text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">{company.why}</p>
        </div>
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-2">My questions for them:</h4>
          <p className="italic text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">"{company.questions}"</p>
        </div>
        {company.values && (
          <div className="md:col-span-2">
            <h4 className="font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-2">Company Values:</h4>
            <p className="text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">{company.values}</p>
          </div>
        )}
        {company.news && (
          <div className="md:col-span-2">
            <h4 className="font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-2">Recent News:</h4>
            <p className="text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">{company.news}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default React.memo(CompanyCard);
