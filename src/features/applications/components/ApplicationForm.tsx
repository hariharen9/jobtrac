import React, { useState, useEffect } from 'react';
import { Application, ApplicationStatus, ApplicationSource } from '../../../types';
import RangeSlider from '../../../components/shared/RangeSlider';
import { useApplicationSettings } from '../../../hooks/useApplicationSettings';
import {
  Briefcase, MapPin, Calendar, DollarSign, Star, Link as LinkIcon,
  Mail, Users, FileText, Flag, ChevronDown, ChevronUp
} from 'lucide-react';
import {
  FormInput,
  FormTextarea,
  FormSelect,
  FormSectionHeader,
  FormButtonGroup,
  FormActions,
  SelectOption,
  ButtonGroupOption
} from '../../../components/shared/form';

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
    interviewDate: '',
    jobDescription: ''
  });

  const [showJobDescription, setShowJobDescription] = useState(false);

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
        interviewDate: initialData.interviewDate || '',
        jobDescription: initialData.jobDescription || ''
      });
      // Auto-expand job description section if there's content
      if (initialData.jobDescription) {
        setShowJobDescription(true);
      }
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { ...submissionData } = formData;
    onSubmit(submissionData);
  };

  const statusOptions: SelectOption[] = [
    'To Apply', 'Applied', 'HR Screen', 'Tech Screen', 'Round 1', 'Round 2',
    'Manager Round', 'Final Round', 'Offer', 'Rejected', 'Ghosted'
  ].map(s => ({ value: s, label: s }));

  const sourceOptions: SelectOption[] = [
    'LinkedIn', 'Indeed', 'Glassdoor', 'Naukri', 'Company Website', 'Referral', 'Other'
  ].map(s => ({ value: s, label: s }));

  const priorityOptions: ButtonGroupOption[] = [
    { value: 'High', label: 'High' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Low', label: 'Low' }
  ];

  const referralOptions: ButtonGroupOption[] = [
    { value: 'N', label: 'No' },
    { value: 'Y', label: 'Yes' }
  ];

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
      case 'High': return 'red';
      case 'Medium': return 'yellow';
      case 'Low': return 'green';
      default: return undefined;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Essential Information Section */}
      <div className="space-y-4">
        <FormSectionHeader icon={Briefcase} title="Essential Details" />

        <div className="grid grid-cols-1 gap-4">
          <FormInput
            label="Company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="e.g., Google, Microsoft, Startup Inc."
            required
            fullWidth
          />

          <FormInput
            label="Role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            placeholder="e.g., Senior Software Engineer, Product Manager"
            required
            fullWidth
          />
        </div>
      </div>

      {/* Application Details Section */}
      <div className="space-y-4">
        <FormSectionHeader icon={FileText} title="Application Details" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormSelect
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as ApplicationStatus })}
            options={statusOptions}
            fullWidth
          />

          <FormSelect
            label="Source"
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value as ApplicationSource })}
            options={sourceOptions}
            fullWidth
          />

          {/* Other Source - Conditional */}
          {formData.source === 'Other' && (
            <div className="sm:col-span-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <FormInput
                label="Specify Source"
                value={formData.sourceOther}
                onChange={(e) => setFormData({ ...formData, sourceOther: e.target.value })}
                placeholder="Enter the source name"
                fullWidth
              />
            </div>
          )}

          <FormInput
            label="Date Applied"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            icon={Calendar}
            fullWidth
          />

          <FormInput
            label="Interview Date"
            type="date"
            value={formData.interviewDate}
            onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })}
            icon={Calendar}
            fullWidth
          />
        </div>
      </div>

      {/* Location & Contact Section */}
      <div className="space-y-4">
        <FormSectionHeader icon={MapPin} title="Location & Contact" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g., San Francisco, Remote, Hybrid"
            fullWidth
          />

          <FormInput
            label="Recruiter Email"
            type="email"
            value={formData.recruiter}
            onChange={(e) => setFormData({ ...formData, recruiter: e.target.value })}
            placeholder="recruiter@company.com"
            icon={Mail}
            fullWidth
          />

          <div className="sm:col-span-2">
            <FormInput
              label="Job Posting Link"
              type="url"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://company.com/careers/job-id"
              icon={LinkIcon}
              fullWidth
            />
          </div>
        </div>
      </div>

      {/* Compensation & Priority Section */}
      <div className="space-y-4">
        <FormSectionHeader icon={DollarSign} title="Compensation & Priority" />

        <div className="grid grid-cols-1 gap-4">
          {/* Salary Range */}
          <div>
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
            <FormButtonGroup
              label="Priority Level"
              icon={Flag}
              options={priorityOptions}
              value={formData.priority}
              onChange={(value) => setFormData({ ...formData, priority: value as 'High' | 'Medium' | 'Low' })}
              hoverColor={getPriorityColor(formData.priority)}
            />

            <FormButtonGroup
              label="Referral"
              icon={Users}
              options={referralOptions}
              value={formData.referral}
              onChange={(value) => setFormData({ ...formData, referral: value as 'Y' | 'N' })}
              hoverColor="indigo"
            />
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="space-y-4">
        <FormSectionHeader icon={FileText} title="Additional Notes" />
        <FormTextarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={4}
          placeholder="Add any additional information, interview feedback, or reminders..."
          fullWidth
        />
      </div>

      {/* Job Description Section - Collapsible */}
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setShowJobDescription(!showJobDescription)}
          className="w-full flex items-center justify-between text-sm font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text uppercase tracking-wider hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <span className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Job Description
            {formData.jobDescription && (
              <span className="text-xs font-normal normal-case text-green-600 dark:text-green-400">(saved)</span>
            )}
          </span>
          {showJobDescription ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {showJobDescription && (
          <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <FormTextarea
              value={formData.jobDescription}
              onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
              rows={8}
              placeholder="Paste the full job description here for reference..."
              fullWidth
              className="text-sm font-mono"
            />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Storing the job description helps you prepare for interviews and reference requirements later.
            </p>
          </div>
        )}
      </div>

      <FormActions
        onCancel={onCancel}
        loading={loading}
        submitLabel="Save Application"
        submitIcon={Star}
      />
    </form>
  );
};

export default ApplicationForm;
