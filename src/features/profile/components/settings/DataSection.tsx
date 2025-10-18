import React, { useState } from 'react';
import { Application, PrepEntry, StarStory, CompanyResearch, NetworkingContact } from '../../../../types';
import { Database, FileText } from 'lucide-react';
import { useAuth } from '../../../auth/hooks/useAuth';
import { useDataImportExport } from '../../../../hooks/useDataImportExport';
import DataImportExportModal from '../../../../components/shared/DataImportExportModal';

interface DataSectionProps {
  applications: Application[];
  prepEntries: PrepEntry[];
  stories: StarStory[];
  companies: CompanyResearch[];
  contacts: NetworkingContact[];
}

const DataSection: React.FC<DataSectionProps> = ({
  applications,
  prepEntries,
  stories,
  companies,
  contacts
}) => {
  const { user } = useAuth();
  const { importData } = useDataImportExport(user?.uid);
  const [showImportExportModal, setShowImportExportModal] = useState(false);

  const totalItems = applications.length + prepEntries.length + stories.length + companies.length + contacts.length;

  const dataBreakdown = [
    { label: 'Applications', count: applications.length, color: 'blue' },
    { label: 'Prep Entries', count: prepEntries.length, color: 'purple' },
    { label: 'STAR Stories', count: stories.length, color: 'yellow' },
    { label: 'Company Research', count: companies.length, color: 'green' },
    { label: 'Networking Contacts', count: contacts.length, color: 'pink' }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 dark:bg-blue-900/30 amoled:bg-blue-900/30 text-blue-700 dark:text-blue-300 amoled:text-blue-300',
      purple: 'bg-purple-100 dark:bg-purple-900/30 amoled:bg-purple-900/30 text-purple-700 dark:text-purple-300 amoled:text-purple-300',
      yellow: 'bg-yellow-100 dark:bg-yellow-900/30 amoled:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 amoled:text-yellow-300',
      green: 'bg-green-100 dark:bg-green-900/30 amoled:bg-green-900/30 text-green-700 dark:text-green-300 amoled:text-green-300',
      pink: 'bg-pink-100 dark:bg-pink-900/30 amoled:bg-pink-900/30 text-pink-700 dark:text-pink-300 amoled:text-pink-300'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-1">
          Data Management
        </h3>
        <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
          Import, export, and manage your data
        </p>
      </div>

      {/* Total Items Card */}
      <div className="p-6 rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 amoled:from-indigo-900/20 amoled:to-purple-900/20">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-dark-card amoled:bg-amoled-card shadow-sm">
            <Database className="w-8 h-8 text-indigo-600 dark:text-indigo-400 amoled:text-indigo-400" />
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 dark:text-dark-text amoled:text-amoled-text">
              {totalItems}
            </div>
            <div className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
              Total items stored
            </div>
          </div>
        </div>
      </div>

      {/* Data Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {dataBreakdown.map((item, index) => (
          <div
            key={index}
            className="p-3 rounded-lg border border-slate-200 dark:border-dark-border amoled:border-amoled-border bg-white dark:bg-dark-card amoled:bg-amoled-card"
          >
            <div className={`inline-flex px-2 py-1 rounded text-xs font-medium mb-2 ${getColorClasses(item.color)}`}>
              {item.count}
            </div>
            <div className="text-xs text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* Import/Export Actions */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border bg-slate-50 dark:bg-dark-card amoled:bg-amoled-card">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 amoled:bg-purple-900/30">
            <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400 amoled:text-purple-400" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-1">
              Import & Export
            </h4>
            <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-4">
              Import from spreadsheets or export for backup
            </p>
            
            <button
              onClick={() => setShowImportExportModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
            >
              <Database className="w-4 h-4" />
              Manage Data
            </button>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border bg-blue-50 dark:bg-blue-900/10 amoled:bg-blue-900/10">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <Database className="w-5 h-5 text-blue-600 dark:text-blue-400 amoled:text-blue-400" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-1">
              Data Safety
            </h4>
            <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
              Your data is automatically synced to Firebase. Export regularly for additional backup and peace of mind.
            </p>
          </div>
        </div>
      </div>

      {/* Import/Export Modal */}
      <DataImportExportModal
        isOpen={showImportExportModal}
        onClose={() => setShowImportExportModal(false)}
        applications={applications}
        prepEntries={prepEntries}
        stories={stories}
        companies={companies}
        contacts={contacts}
        onImportData={importData}
      />
    </div>
  );
};

export default DataSection;
