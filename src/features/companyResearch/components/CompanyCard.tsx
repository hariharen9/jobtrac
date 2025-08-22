import React from 'react';
import { Trash2, Pencil } from 'lucide-react';
import { CompanyResearch } from '../../../types';

interface CompanyCardProps {
  company: CompanyResearch;
  onEditCompany: (company: CompanyResearch) => void;
  onDeleteCompany: (id: string) => void;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, onEditCompany, onDeleteCompany }) => {
  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow relative">
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <button 
          onClick={() => onEditCompany(company)}
          className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          aria-label="Edit company research"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button 
          onClick={() => onDeleteCompany(company.id as string)}
          className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          aria-label="Delete company research"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-2 pr-16">{company.company}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{company.whatTheyDo}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Why I want to work here:</h4>
          <p className="text-slate-700 dark:text-slate-300">{company.why}</p>
        </div>
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">My questions for them:</h4>
          <p className="italic text-slate-700 dark:text-slate-300">"{company.questions}"</p>
        </div>
        {company.values && (
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Company Values:</h4>
            <p className="text-slate-700 dark:text-slate-300">{company.values}</p>
          </div>
        )}
        {company.news && (
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Recent News:</h4>
            <p className="text-slate-700 dark:text-slate-300">{company.news}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(CompanyCard);
