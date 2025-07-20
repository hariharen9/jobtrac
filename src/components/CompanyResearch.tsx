import React from 'react';
import { Building, Plus, Trash2, Pencil } from 'lucide-react';
import { CompanyResearch } from '../types';

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
          <div key={company.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow relative">
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

export default CompanyResearchComponent;