import React, { useState, useEffect } from 'react';
import { Application, ApplicationStatus, ApplicationSource } from '../../../types';
import RangeSlider from '../../../components/shared/RangeSlider';
import { useApplicationSettings } from '../../../hooks/useApplicationSettings';
import { Briefcase, MapPin, Calendar, DollarSign, Star, Link as LinkIcon, Mail, Users, FileText, Flag } from 'lucide-react';

interface ApplicationFormProps {
  onSubmit: (application: Omit<Application, 'id' | 'createdAt' | 'updatedAt' | 'nextStep'>) => void;
  onCancel: () => void;
  initialData?: Application | null;
  loading?: boolean;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ onSubmit, onCancel, initialData, loading = false }) => {
  const settings = useApplicationSettings();
  
  // Get default salary range based on settings
  const getDefaultSalaryRange = () => {
    if (settings.currency === 'INR' && settings.salaryDenomination === 'L') {
      return '10-20'; // 10-20 Lakhs for INR
    }
    return '50-100'; // 50-100K for USD/others
  };
  
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    link: '',
    date: new Date().toISOString().split('T')[0],
    status: 'To Apply' as ApplicationStatus,
    source: 'LinkedIn' as ApplicationSource,
    sourceOther: '',
    recruiter: '',
    referral: 'N' as 'Y' | 'N',
    location: '',
    notes: '',
    salaryRange: getDefaultSalaryRange(),
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
    interviewDate: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        company: initialData.company,
        role: initialData.role,
        link: initialData.link || '',
        date: initialData.date,
        status: initialData.status,
        source: initialData.source || 'LinkedIn',
        sourceOther: initialData.sourceOther || '',
        recruiter: initialData.recruiter || '',
        referral: initialData.referral || 'N',
        location: initialData.location || '',
        notes: initialData.notes || '',
        salaryRange: initialData.salaryRange || getDefaultSalaryRange(),
        priority: initialData.priority || 'Medium',
        interviewDate: initialData.interviewDate || ''
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { ...submissionData } = formData;
    onSubmit(submissionData);
  };

  const statusOptions: ApplicationStatus[] = [
    'To Apply', 'Applied', 'HR Screen', 'Tech Screen', 'Round 1', 'Round 2',
    'Manager Round', 'Final Round', 'Offer', 'Rejected', 'Ghosted'
  ];

  const sourceOptions: ApplicationSource[] = [
    'LinkedIn', 'Indeed', 'Glassdoor', 'Naukri', 'Company Website', 'Referral', 'Other'
  ];

  const priorityOptions: ('High' | 'Medium' | 'Low')[] = ['High', 'Medium', 'Low'];

  // Dynamic slider configuration based on currency and denomination
  const getSliderConfig = () => {
    if (settings.currency === 'INR' && settings.salaryDenomination === 'L') {
      return { min: 0, max: 50, step: 1 }; // 0-50 Lakhs with 1L increments
    }
    return { min: 0, max: 500, step: 10 }; // Default: 0-500K with 10K increments
  };

  const sliderConfig = getSliderConfig();

  // Parse and clamp salary values to valid range
  const parsedSalary = formData.salaryRange.split('-').map(Number);
  const salaryValue: [number, number] = [
    Math.max(sliderConfig.min, Math.min(sliderConfig.max, parsedSalary[0] || sliderConfig.min)),
    Math.max(sliderConfig.min, Math.min(sliderConfig.max, parsedSalary[1] || sliderConfig.max))
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 dark:bg-red-900/30 amoled:bg-red-900/20 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700';
      case 'Medium': return 'bg-yellow-100 dark:bg-yellow-900/30 amoled:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700';
      case 'Low': return 'bg-green-100 dark:bg-green-900/30 amoled:bg-green-900/20 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700';
      default: return '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Essential Information Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text uppercase tracking-wider flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          Essential Details
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          {/* Company */}
          <div className="group">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 amoled:text-slate-400 mb-2">
              Company <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g., Google, Microsoft, Startup Inc."
                className="w-full pl-4 pr-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 amoled:border-slate-800 bg-white dark:bg-dark-card amoled:bg-black text-slate-900 dark:text-dark-text amoled:text-amoled-text placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
              />
            </div>
          </div>

          {/* Role */}
          <div className="group">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 amoled:text-slate-400 mb-2">
              Role <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g., Senior Software Engineer, Product Manager"
                className="w-full pl-4 pr-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 amoled:border-slate-800 bg-white dark:bg-dark-card amoled:bg-black text-slate-900 dark:text-dark-text amoled:text-amoled-text placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Application Details Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          Application Details
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Status */}
          <div className="group">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 amoled:text-slate-400 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as ApplicationStatus })}
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 amoled:border-slate-800 bg-white dark:bg-dark-card amoled:bg-black text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600 cursor-pointer"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Source */}
          <div className="group">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 amoled:text-slate-400 mb-2">
              Source
            </label>
            <select
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value as ApplicationSource })}
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 amoled:border-slate-800 bg-white dark:bg-dark-card amoled:bg-black text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600 cursor-pointer"
            >
              {sourceOptions.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>

          {/* Other Source - Conditional */}
          {formData.source === 'Other' && (
            <div className="sm:col-span-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 amoled:text-slate-400 mb-2">
                Specify Source
              </label>
              <input
                type="text"
                value={formData.sourceOther}
                onChange={(e) => setFormData({ ...formData, sourceOther: e.target.value })}
                placeholder="Enter the source name"
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 amoled:border-slate-800 bg-white dark:bg-dark-card amoled:bg-black text-slate-900 dark:text-dark-text amoled:text-amoled-text placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
              />
            </div>
          )}

          {/* Date Applied */}
          <div className="group">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 amoled:text-slate-400 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date Applied
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 amoled:border-slate-800 bg-white dark:bg-dark-card amoled:bg-black text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
            />
          </div>

          {/* Interview Date */}
          <div className="group">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 amoled:text-slate-400 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Interview Date
            </label>
            <input
              type="date"
              value={formData.interviewDate}
              onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 amoled:border-slate-800 bg-white dark:bg-dark-card amoled:bg-black text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
            />
          </div>
        </div>
      </div>

      {/* Location & Contact Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text uppercase tracking-wider flex items-center gap-2">
          <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          Location & Contact
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Location */}
          <div className="group">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 amoled:text-slate-400 mb-2">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., San Francisco, Remote, Hybrid"
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 amoled:border-slate-800 bg-white dark:bg-dark-card amoled:bg-black text-slate-900 dark:text-dark-text amoled:text-amoled-text placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
            />
          </div>

          {/* Recruiter Email */}
          <div className="group">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 amoled:text-slate-400 mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Recruiter Email
            </label>
            <input
              type="email"
              value={formData.recruiter}
              onChange={(e) => setFormData({ ...formData, recruiter: e.target.value })}
              placeholder="recruiter@company.com"
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 amoled:border-slate-800 bg-white dark:bg-dark-card amoled:bg-black text-slate-900 dark:text-dark-text amoled:text-amoled-text placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
            />
          </div>

          {/* Job Link */}
          <div className="sm:col-span-2 group">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 amoled:text-slate-400 mb-2 flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              Job Posting Link
            </label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://company.com/careers/job-id"
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 amoled:border-slate-800 bg-white dark:bg-dark-card amoled:bg-black text-slate-900 dark:text-dark-text amoled:text-amoled-text placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
            />
          </div>
        </div>
      </div>

      {/* Compensation & Priority Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text uppercase tracking-wider flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          Compensation & Priority
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          {/* Salary Range */}
          <div className="group">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 amoled:text-slate-400 mb-2">
              Expected Salary Range
            </label>
            <div className="p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 amoled:border-slate-800 bg-slate-50 dark:bg-slate-800/50 amoled:bg-slate-900/30">
              <RangeSlider
                min={sliderConfig.min}
                max={sliderConfig.max}
                step={sliderConfig.step}
                value={salaryValue}
                onChange={(value) => setFormData({ ...formData, salaryRange: value.join('-') })}
                currency={settings.currency}
                denomination={settings.salaryDenomination}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Priority */}
            <div className="group">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 amoled:text-slate-400 mb-2 flex items-center gap-2">
                <Flag className="w-4 h-4" />
                Priority Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {priorityOptions.map(priority => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority })}
                    className={`px-4 py-3 rounded-lg border-2 font-medium text-sm transition-all duration-200 ${
                      formData.priority === priority
                        ? getPriorityColor(priority)
                        : 'border-slate-200 dark:border-slate-700 amoled:border-slate-800 bg-white dark:bg-dark-card amoled:bg-black text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>

            {/* Referral */}
            <div className="group">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 amoled:text-slate-400 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Referral
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['N', 'Y'] as const).map(value => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFormData({ ...formData, referral: value })}
                    className={`px-4 py-3 rounded-lg border-2 font-medium text-sm transition-all duration-200 ${
                      formData.referral === value
                        ? 'bg-indigo-100 dark:bg-indigo-900/30 amoled:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border-indigo-300 dark:border-indigo-700'
                        : 'border-slate-200 dark:border-slate-700 amoled:border-slate-800 bg-white dark:bg-dark-card amoled:bg-black text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    {value === 'Y' ? 'Yes' : 'No'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          Additional Notes
        </h3>
        
        <div className="group">
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={4}
            placeholder="Add any additional information, interview feedback, or reminders..."
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 amoled:border-slate-800 bg-white dark:bg-dark-card amoled:bg-black text-slate-900 dark:text-dark-text amoled:text-amoled-text placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600 resize-none"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t-2 border-slate-200 dark:border-slate-700 amoled:border-slate-800">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 amoled:text-slate-400 bg-white dark:bg-dark-card amoled:bg-black border-2 border-slate-300 dark:border-slate-600 amoled:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 amoled:hover:bg-slate-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Saving...
            </>
          ) : (
            <>
              <Star className="w-4 h-4" />
              Save Application
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ApplicationForm;
