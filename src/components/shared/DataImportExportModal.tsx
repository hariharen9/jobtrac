import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Download, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Info,
  X,
  RefreshCw,
  Copy,
  Sparkles
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Application, PrepEntry, StarStory, CompanyResearch, NetworkingContact } from '../../types';
import { AnalyticsService } from '../../services/analyticsService';
import { useAuth } from '../../features/auth/hooks/useAuth';

interface DataImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  applications: Application[];
  prepEntries: PrepEntry[];
  stories: StarStory[];
  companies: CompanyResearch[];
  contacts: NetworkingContact[];
  onImportData: (data: any) => Promise<void>;
}

type TabType = 'import' | 'export';

const DataImportExportModal: React.FC<DataImportExportModalProps> = ({
  isOpen,
  onClose,
  applications,
  prepEntries,
  stories,
  companies,
  contacts,
  onImportData
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('import');
  const [isProcessing, setIsProcessing] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<any[]>([]);
  const [importType, setImportType] = useState<string>('applications');
  const { user } = useAuth();
  const [showAIPrompt, setShowAIPrompt] = useState(false);

  // CSV format templates
  const csvFormats = {
    applications: {
      name: 'Job Applications',
      headers: ['company', 'role', 'link', 'date', 'status', 'location', 'recruiter', 'referral', 'nextStep', 'notes'],
      example: 'Google,Software Engineer,https://careers.google.com/jobs/12345,2024-01-15,applied,Mountain View CA,Jane Smith,N,Phone screening scheduled,Great company culture'
    },
    prepEntries: {
      name: 'Prep Sessions',
      headers: ['date', 'topic', 'problems', 'time', 'confidence', 'notes'],
      example: '2024-01-15,System Design,Design a chat application,120,8,Focused on scalability and real-time messaging'
    },
    stories: {
      name: 'STAR Stories',
      headers: ['title', 'situation', 'task', 'action', 'result'],
      example: 'Led Team Through Crisis,Our main server crashed during peak hours,Restore service and prevent data loss,Coordinated with team to implement backup systems,Restored service in 30 minutes with zero data loss'
    },
    companies: {
      name: 'Company Research',
      headers: ['company', 'whatTheyDo', 'values', 'why', 'questions', 'news'],
      example: 'Google,Search engine and cloud services,Innovation and user focus,Cutting-edge technology and impact,What are the biggest challenges in search today?,Recently announced new AI initiatives'
    },
    contacts: {
      name: 'Networking Contacts',
      headers: ['name', 'company', 'role', 'date', 'status', 'referral', 'notes'],
      example: 'John Doe,Google,Engineering Manager,2024-01-15,contacted,Y,Met at tech conference - very helpful'
    }
  };

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please select a CSV file');
      return;
    }

    setImportFile(file);
    
    // Parse CSV for preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      const lines = csv.split('\n').filter(line => line.trim());
      const headers = lines[0]?.split(',') || [];
      const preview = lines.slice(1, 6).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
          obj[header.trim()] = values[index]?.trim() || '';
          return obj;
        }, {} as any);
      });
      setImportPreview(preview);
    };
    reader.readAsText(file);
  }, []);

  const handleImport = useCallback(async () => {
    if (!importFile) {
      toast.error('Please select a file to import');
      return;
    }

    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const csv = e.target?.result as string;
        const lines = csv.split('\n').filter(line => line.trim());
        const headers = lines[0]?.split(',').map(h => h.trim()) || [];
        
        const data = lines.slice(1).map(line => {
          const values = line.split(',');
          return headers.reduce((obj, header, index) => {
            obj[header] = values[index]?.trim() || '';
            return obj;
          }, {} as any);
        }).filter(item => Object.values(item).some(val => val));

        await onImportData({ type: importType, data });
        toast.success(`Successfully imported ${data.length} ${importType}!`);
        setImportFile(null);
        setImportPreview([]);
        onClose();
      };
      reader.readAsText(importFile);
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import data. Please check the file format.');
    } finally {
      setIsProcessing(false);
    }
  }, [importFile, importType, onImportData, onClose]);

  const handleExport = useCallback(async () => {
    setIsProcessing(true);
    try {
      // Track data export event
      if (user?.uid) {
        AnalyticsService.trackEvent('data_exported', user.uid);
      }
      
      const exportData = {
        applications: applications.map(app => ({
          company: app.company,
          role: app.role,
          link: app.link,
          date: app.date,
          status: app.status,
          location: app.location,
          recruiter: app.recruiter,
          referral: app.referral,
          nextStep: app.nextStep,
          notes: app.notes,
          exportedAt: new Date().toISOString()
        })),
        prepEntries: prepEntries.map(prep => ({
          date: prep.date,
          topic: prep.topic,
          problems: prep.problems,
          time: prep.time,
          confidence: prep.confidence,
          notes: prep.notes,
          exportedAt: new Date().toISOString()
        })),
        stories: stories.map(story => ({
          title: story.title,
          situation: story.situation,
          task: story.task,
          action: story.action,
          result: story.result,
          exportedAt: new Date().toISOString()
        })),
        companies: companies.map(company => ({
          company: company.company,
          whatTheyDo: company.whatTheyDo,
          values: company.values,
          why: company.why,
          questions: company.questions,
          news: company.news,
          exportedAt: new Date().toISOString()
        })),
        contacts: contacts.map(contact => ({
          name: contact.name,
          company: contact.company,
          role: contact.role,
          date: contact.date,
          status: contact.status,
          referral: contact.referral,
          notes: contact.notes,
          exportedAt: new Date().toISOString()
        }))
      };

      // Create JSON export
      const jsonBlob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const jsonUrl = URL.createObjectURL(jsonBlob);
      const jsonLink = document.createElement('a');
      jsonLink.href = jsonUrl;
      jsonLink.download = `jobtrac-export-${new Date().toISOString().split('T')[0]}.json`;
      jsonLink.click();
      URL.revokeObjectURL(jsonUrl);

      // Create CSV exports for each data type
      Object.entries(exportData).forEach(([type, data]) => {
        if (data.length > 0) {
          const headers = Object.keys(data[0]);
          const csvContent = [
            headers.join(','),
            ...data.map(item => headers.map(header => `"${(item as any)[header] || ''}"`).join(','))
          ].join('\n');
          
          const csvBlob = new Blob([csvContent], { type: 'text/csv' });
          const csvUrl = URL.createObjectURL(csvBlob);
          const csvLink = document.createElement('a');
          csvLink.href = csvUrl;
          csvLink.download = `jobtrac-${type}-${new Date().toISOString().split('T')[0]}.csv`;
          csvLink.click();
          URL.revokeObjectURL(csvUrl);
        }
      });

      toast.success('Data exported successfully! Check your downloads folder.');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    } finally {
      setIsProcessing(false);
    }
  }, [applications, prepEntries, stories, companies, contacts, user]);

  const copyAIPrompt = useCallback(() => {
    const format = csvFormats[importType as keyof typeof csvFormats];
    const prompt = `I have job search data in a spreadsheet that I want to convert to CSV format for import into JobTrac. Please convert my data to match this exact format:

Required CSV format for ${format.name}:
Headers: ${format.headers.join(', ')}

Example row:
${format.example}

Please:
1. Convert my data to CSV format with these exact headers
2. Make sure each row follows the same structure
3. Use quotes around text that contains commas
4. Return only the CSV data (headers + data rows)

Here's my data:
[Paste your spreadsheet data here]`;
    
    navigator.clipboard.writeText(prompt);
    toast.success('AI prompt copied to clipboard!');
  }, [importType]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-xl shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-border amoled:border-amoled-border">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-dark-text amoled:text-amoled-text">
            Data Import/Export
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-bg amoled:hover:bg-amoled-bg rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-dark-text-secondary amoled:text-amoled-text-secondary" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-dark-border amoled:border-amoled-border">
          {[
            { id: 'import', label: 'Import Data', icon: Upload },
            { id: 'export', label: 'Export Data', icon: Download }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary hover:text-gray-900 dark:hover:text-dark-text amoled:hover:text-amoled-text'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <AnimatePresence mode="wait">
            {activeTab === 'import' ? (
              <motion.div
                key="import"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Import Instructions */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 amoled:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-blue-900 dark:text-blue-200 amoled:text-blue-200">
                        CSV Import Format
                      </h3>
                      <p className="text-sm text-blue-700 dark:text-blue-300 amoled:text-blue-300 mt-1">
                        Upload a CSV file with your existing data. Make sure the column headers match our expected format.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Data Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-text amoled:text-amoled-text mb-2">
                    Select Data Type
                  </label>
                  <select
                    value={importType}
                    onChange={(e) => setImportType(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-dark-border amoled:border-amoled-border rounded-lg bg-white dark:bg-dark-bg amoled:bg-amoled-bg text-gray-900 dark:text-dark-text amoled:text-amoled-text"
                  >
                    {Object.entries(csvFormats).map(([key, format]) => (
                      <option key={key} value={key}>{format.name}</option>
                    ))}
                  </select>
                </div>

                {/* Format Documentation */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 dark:text-dark-text amoled:text-amoled-text">
                    Expected Format for {csvFormats[importType as keyof typeof csvFormats].name}
                  </h4>
                  
                  <div className="bg-gray-50 dark:bg-dark-bg amoled:bg-amoled-bg p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-2">
                      Required Headers:
                    </p>
                    <code className="text-sm text-blue-600 dark:text-blue-400 break-all">
                      {csvFormats[importType as keyof typeof csvFormats].headers.join(', ')}
                    </code>
                    
                    <p className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mt-4 mb-2">
                      Example Row:
                    </p>
                    <code className="text-sm text-gray-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary break-all">
                      {csvFormats[importType as keyof typeof csvFormats].example}
                    </code>
                  </div>
                </div>

                {/* AI-Powered CSV Generation */}
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 amoled:from-amoled-card amoled:to-amoled-card rounded-lg border border-purple-200 dark:border-purple-700/50">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-purple-900 dark:text-purple-200 amoled:text-purple-200 mb-2">
                        🤖 AI-Powered CSV Generation
                      </h4>
                      <p className="text-sm text-purple-700 dark:text-purple-300 amoled:text-purple-300 mb-4">
                        Have data in a spreadsheet? Let AI convert it to the correct CSV format!
                      </p>
                      <div className="bg-white/70 dark:bg-dark-bg/50 amoled:bg-amoled-bg/50 p-3 rounded-lg mb-4">
                        <p className="text-sm text-gray-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-2">
                          <strong>How it works:</strong>
                        </p>
                        <ol className="text-sm text-gray-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary space-y-1 list-decimal list-inside">
                          <li>Copy the AI prompt below</li>
                          <li>Go to ChatGPT, Claude, or Gemini</li>
                          <li>Paste the prompt and add your spreadsheet data</li>
                          <li>Get back a perfectly formatted CSV!</li>
                        </ol>
                      </div>
                      <button
                        onClick={copyAIPrompt}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold text-sm hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg"
                      >
                        <Copy className="w-4 h-4" />
                        Copy AI Prompt for {csvFormats[importType as keyof typeof csvFormats].name}
                      </button>
                    </div>
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-text amoled:text-amoled-text mb-2">
                    Upload CSV File
                  </label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="w-full p-3 border border-gray-300 dark:border-dark-border amoled:border-amoled-border rounded-lg bg-white dark:bg-dark-bg amoled:bg-amoled-bg"
                  />
                </div>

                {/* Preview */}
                {importPreview.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-dark-text amoled:text-amoled-text mb-3">
                      Preview (first 5 rows)
                    </h4>
                    <div className="overflow-x-auto bg-gray-50 dark:bg-dark-bg amoled:bg-amoled-bg rounded-lg p-4">
                      <table className="w-full text-sm">
                        <thead>
                          <tr>
                            {Object.keys(importPreview[0]).map(header => (
                              <th key={header} className="text-left p-2 font-medium text-gray-700 dark:text-dark-text amoled:text-amoled-text">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {importPreview.map((row, index) => (
                            <tr key={index} className="border-t border-gray-200 dark:border-dark-border amoled:border-amoled-border">
                              {Object.values(row).map((value: any, cellIndex) => (
                                <td key={cellIndex} className="p-2 text-gray-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                                  {value}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Import Button */}
                <button
                  onClick={handleImport}
                  disabled={!importFile || isProcessing}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Upload className="w-5 h-5" />
                  )}
                  {isProcessing ? 'Importing...' : 'Import Data'}
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="export"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Export Instructions */}
                <div className="p-4 bg-green-50 dark:bg-green-900/20 amoled:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-green-900 dark:text-green-200 amoled:text-green-200">
                        Complete Data Export
                      </h3>
                      <p className="text-sm text-green-700 dark:text-green-300 amoled:text-green-300 mt-1">
                        Export all your JobTrac data for backup or migration. Includes both JSON and CSV formats.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Data Summary */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Applications', count: applications.length, icon: FileText },
                    { label: 'Prep Sessions', count: prepEntries.length, icon: FileText },
                    { label: 'STAR Stories', count: stories.length, icon: FileText },
                    { label: 'Company Research', count: companies.length, icon: FileText },
                    { label: 'Networking Contacts', count: contacts.length, icon: FileText }
                  ].map(item => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="p-4 bg-gray-50 dark:bg-dark-bg amoled:bg-amoled-bg rounded-lg text-center">
                        <Icon className="w-8 h-8 mx-auto mb-2 text-gray-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary" />
                        <div className="text-2xl font-bold text-gray-900 dark:text-dark-text amoled:text-amoled-text">
                          {item.count}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                          {item.label}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Export Options */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 dark:text-dark-text amoled:text-amoled-text">
                    What will be exported:
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                    <li>• Complete JSON backup with all data</li>
                    <li>• Separate CSV files for each data type</li>
                    <li>• Applications, prep sessions, STAR stories, company research, and contacts</li>
                    <li>• Export timestamp for tracking</li>
                    <li>• Notes are excluded for privacy (available separately)</li>
                  </ul>
                </div>

                {/* Export Button */}
                <button
                  onClick={handleExport}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                  {isProcessing ? 'Exporting...' : 'Export All Data'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default DataImportExportModal;