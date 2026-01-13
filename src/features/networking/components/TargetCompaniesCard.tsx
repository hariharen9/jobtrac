import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Building, Users, CheckCircle, ExternalLink, Plus } from 'lucide-react';
import { CompanyResearch, NetworkingContact } from '../../../types';
import SimpleTooltip from '../../../components/shared/SimpleTooltip';
import CompanyIcon from '../../applications/components/CompanyIcon';

interface TargetCompaniesCardProps {
  companies: CompanyResearch[];
  contacts: NetworkingContact[];
  onAddCompany: () => void;
  onFilterByCompany: (companyName: string) => void;
  activeFilterCompany: string;
}

const TargetCompaniesCard: React.FC<TargetCompaniesCardProps> = ({
  companies,
  contacts,
  onAddCompany,
  onFilterByCompany,
  activeFilterCompany
}) => {
  // Process data to get stats per company
  const companyStats = useMemo(() => {
    return companies.map(company => {
      const companyContacts = contacts.filter(
        c => c.company.toLowerCase().trim() === company.company.toLowerCase().trim()
      );
      
      const totalContacts = companyContacts.length;
      const contactedCount = companyContacts.filter(
        c => c.status !== 'To Contact' // Assuming 'To Contact' implies not contacted yet
      ).length;

      return {
        ...company,
        totalContacts,
        contactedCount,
        coverage: totalContacts > 0 ? (contactedCount / totalContacts) * 100 : 0
      };
    }).sort((a, b) => b.totalContacts - a.totalContacts); // Sort by most contacts
  }, [companies, contacts]);

  // Top 5 target companies for the card
  const topTargets = companyStats.slice(0, 5);

  return (
    <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card p-6 rounded-xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-dark-text amoled:text-amoled-text flex items-center gap-2">
            <Building className="w-5 h-5 text-indigo-500" />
            Target Companies
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track networking coverage
          </p>
        </div>
        <SimpleTooltip content="Add new target company (Company Research)">
          <button 
            onClick={onAddCompany}
            className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </SimpleTooltip>
      </div>

      <div className="space-y-4">
        {topTargets.length > 0 ? (
          topTargets.map(company => (
            <motion.div 
              key={company.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => onFilterByCompany(company.company)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                activeFilterCompany === company.company
                  ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/30 dark:border-indigo-800'
                  : 'bg-slate-50 border-slate-100 dark:bg-slate-800/30 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 overflow-hidden pr-2">
                  <div className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center bg-white dark:bg-slate-800 shadow-sm">
                    <CompanyIcon companyName={company.company} size={14} />
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate text-sm">
                    {company.company}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={`px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    company.totalContacts > 0 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                  }`}>
                    <Users className="w-3 h-3" />
                    {company.totalContacts}
                  </span>
                </div>
              </div>
              
              {/* Progress Bar for Outreach */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Outreach</span>
                  <span>{company.contactedCount}/{company.totalContacts}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-indigo-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${company.coverage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-6 text-slate-500 text-sm">
            No target companies found. Add companies in the Research tab.
          </div>
        )}

        {companies.length > 5 && (
          <button className="w-full text-center text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 py-2 transition-colors">
            View all {companies.length} companies
          </button>
        )}
      </div>
    </div>
  );
};

export default TargetCompaniesCard;
