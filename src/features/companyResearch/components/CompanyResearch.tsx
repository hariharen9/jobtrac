import React from 'react';
import { Building, Plus } from 'lucide-react';
import { CompanyResearch } from '../../../types';
import CompanyCard from './CompanyCard';

interface CompanyResearchProps {
  companies: CompanyResearch[];
  onAddCompany: () => void;
  onEditCompany: (company: CompanyResearch) => void;
  onDeleteCompany: (id: string) => void;
  loading?: boolean;
}

const CompanyResearchComponent: React.FC<CompanyResearchProps> = ({ 
  companies, 
  onAddCompany, 
  onEditCompany,
  onDeleteCompany,
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
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
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Building className="w-5 h-5" />
          Company Research
        </h2>
        <button
          onClick={onAddCompany}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Company
        </button>
      </div>
      <div className="space-y-4">
        {companies.map(company => (
          <CompanyCard 
            key={company.id} 
            company={company} 
            onEditCompany={onEditCompany} 
            onDeleteCompany={onDeleteCompany} 
          />
        ))}
        {companies.length === 0 && (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            No company research yet. Click "Add Company" to start researching potential employers!
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(CompanyResearchComponent);