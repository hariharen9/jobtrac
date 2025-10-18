import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Info, Heart, HelpCircle, Users, Newspaper, ChevronDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { CompanyResearch } from '../../../types';

interface CompanyFormProps {
  onSubmit: (company: Omit<CompanyResearch, 'id'>) => void;
  onCancel: () => void;
  initialData?: CompanyResearch | null;
  loading?: boolean;
}

interface FormErrors {
  company?: string;
  whatTheyDo?: string;
  why?: string;
  questions?: string;
}

// Form Section Component
const FormSection: React.FC<{ 
  id: string;
  title: string; 
  icon: React.ElementType; 
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  isRequired?: boolean;
  isCompleted?: boolean;
}> = React.memo(({ id, title, icon: Icon, children, isActive, onClick, isRequired = false, isCompleted = false }) => (
  <motion.div 
    layout
    className={`rounded-xl border transition-all duration-300 ${
      isActive 
        ? 'border-indigo-300 dark:border-indigo-700 amoled:border-indigo-800 bg-white/70 dark:bg-dark-card/70 amoled:bg-amoled-card/70 backdrop-blur-sm shadow-md' 
        : 'border-slate-200 dark:border-dark-border amoled:border-amoled-border bg-white/50 dark:bg-dark-card/50 amoled:bg-amoled-card/50 hover:bg-white/70 dark:hover:bg-dark-card/70 amoled:hover:bg-amoled-card/70 hover:shadow-sm'
    }`}
  >
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 p-4 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl"
      aria-expanded={isActive}
      aria-controls={`section-${id}`}
    >
      <div className={`p-2 rounded-lg ${
        isActive 
          ? 'bg-indigo-100 dark:bg-indigo-900/30 amoled:bg-indigo-900/20' 
          : 'bg-slate-100 dark:bg-slate-700/30 amoled:bg-slate-800/20'
      }`}>
        <Icon className={`w-5 h-5 ${
          isActive 
            ? 'text-indigo-600 dark:text-indigo-400 amoled:text-indigo-500' 
            : 'text-slate-600 dark:text-slate-400 amoled:text-slate-500'
        }`} />
      </div>
      <div className="flex-1">
        <h3 className={`text-lg font-semibold ${
          isActive 
            ? 'text-slate-800 dark:text-dark-text amoled:text-amoled-text' 
            : 'text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary'
        }`}>
          {title}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </h3>
      </div>
      <div className="flex items-center gap-2">
        {isCompleted && (
          <CheckCircle className="w-5 h-5 text-emerald-500 dark:text-emerald-400 amoled:text-emerald-500" />
        )}
        <motion.div
          animate={{ rotate: isActive ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-slate-500 dark:text-slate-400 amoled:text-slate-500" />
        </motion.div>
      </div>
    </button>
    
    <AnimatePresence>
      {isActive && (
        <motion.div
          id={`section-${id}`}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="px-4 pb-5 border-t border-slate-200 dark:border-dark-border/50 amoled:border-amoled-border/50">
            <div className="pt-4 space-y-4">
              {children}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
));

const CompanyForm: React.FC<CompanyFormProps> = ({ onSubmit, onCancel, initialData, loading = false }) => {
  const [formData, setFormData] = useState({
    company: '',
    whatTheyDo: '',
    values: '',
    why: '',
    questions: '',
    news: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [activeSection, setActiveSection] = useState<string | null>('basic');

  useEffect(() => {
    if (initialData) {
      setFormData({
        company: initialData.company,
        whatTheyDo: initialData.whatTheyDo,
        values: initialData.values || '',
        why: initialData.why,
        questions: initialData.questions,
        news: initialData.news || ''
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }

    if (!formData.whatTheyDo.trim()) {
      newErrors.whatTheyDo = 'Company description is required';
    }

    if (!formData.why.trim()) {
      newErrors.why = 'Please explain why you want to work here';
    }

    if (!formData.questions.trim()) {
      newErrors.questions = 'Please add at least one question to ask';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      company: true,
      whatTheyDo: true,
      why: true,
      questions: true
    });
    
    if (validateForm()) {
      onSubmit({ ...formData, date: new Date().toISOString().split('T')[0] });
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
    setTouched({ ...touched, [field]: true });
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as keyof FormErrors];
        return newErrors;
      });
    }
  };

  const toggleSection = (sectionId: string) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  // Calculate completion status for each section
  const sectionCompletions = {
    basic: !!(formData.company && formData.whatTheyDo),
    motivation: !!formData.why,
    preparation: !!formData.questions,
    intelligence: !!(formData.values || formData.news)
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Basic Information Section */}
      <FormSection 
        id="basic"
        title="Basic Information" 
        icon={Building2}
        isActive={activeSection === 'basic'}
        onClick={() => toggleSection('basic')}
        isRequired={true}
        isCompleted={sectionCompletions.basic}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-2">
              Company Name *
            </label>
            <input
              type="text"
              required
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              placeholder="e.g., Google, Microsoft, Apple"
              className={`w-full rounded-lg border ${
                (touched.company && errors.company) 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-slate-300 dark:border-slate-600 amoled:border-slate-700 focus:ring-indigo-500 focus:border-indigo-500'
              } bg-white/80 dark:bg-dark-card/80 amoled:bg-amoled-card/80 px-4 py-3 text-slate-900 dark:text-dark-text amoled:text-amoled-text shadow-sm focus:outline-none focus:ring-2 transition-colors backdrop-blur-sm`}
              aria-invalid={!!errors.company}
            />
            {touched.company && errors.company && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 amoled:text-red-500 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{errors.company}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-2">
              What They Do *
            </label>
            <textarea
              required
              value={formData.whatTheyDo}
              onChange={(e) => handleInputChange('whatTheyDo', e.target.value)}
              rows={3}
              placeholder="Brief description of the company's business, products, or services..."
              className={`w-full rounded-lg border ${
                (touched.whatTheyDo && errors.whatTheyDo) 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-slate-300 dark:border-slate-600 amoled:border-slate-700 focus:ring-indigo-500 focus:border-indigo-500'
              } bg-white/80 dark:bg-dark-card/80 amoled:bg-amoled-card/80 px-4 py-3 text-slate-900 dark:text-dark-text amoled:text-amoled-text shadow-sm focus:outline-none focus:ring-2 transition-colors backdrop-blur-sm resize-none`}
              aria-invalid={!!errors.whatTheyDo}
            />
            {touched.whatTheyDo && errors.whatTheyDo && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 amoled:text-red-500 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{errors.whatTheyDo}</span>
              </p>
            )}
          </div>
        </div>
      </FormSection>

      {/* Motivation Section */}
      <FormSection 
        id="motivation"
        title="Why This Company" 
        icon={Heart}
        isActive={activeSection === 'motivation'}
        onClick={() => toggleSection('motivation')}
        isRequired={true}
        isCompleted={sectionCompletions.motivation}
      >
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-2">
            Why I Want to Work Here *
          </label>
          <textarea
            required
            value={formData.why}
            onChange={(e) => handleInputChange('why', e.target.value)}
            rows={4}
            placeholder="Your motivation, alignment with career goals, specific interests in their products/mission..."
            className={`w-full rounded-lg border ${
              (touched.why && errors.why) 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                : 'border-slate-300 dark:border-slate-600 amoled:border-slate-700 focus:ring-indigo-500 focus:border-indigo-500'
            } bg-white/80 dark:bg-dark-card/80 amoled:bg-amoled-card/80 px-4 py-3 text-slate-900 dark:text-dark-text amoled:text-amoled-text shadow-sm focus:outline-none focus:ring-2 transition-colors backdrop-blur-sm resize-none`}
            aria-invalid={!!errors.why}
          />
          {touched.why && errors.why && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400 amoled:text-red-500 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errors.why}</span>
            </p>
          )}
        </div>
      </FormSection>

      {/* Interview Preparation Section */}
      <FormSection 
        id="preparation"
        title="Interview Preparation" 
        icon={HelpCircle}
        isActive={activeSection === 'preparation'}
        onClick={() => toggleSection('preparation')}
        isRequired={true}
        isCompleted={sectionCompletions.preparation}
      >
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-2">
            Questions to Ask Them *
          </label>
          <textarea
            required
            value={formData.questions}
            onChange={(e) => handleInputChange('questions', e.target.value)}
            rows={3}
            placeholder="Thoughtful questions about the role, team, company culture, growth opportunities..."
            className={`w-full rounded-lg border ${
              (touched.questions && errors.questions) 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                : 'border-slate-300 dark:border-slate-600 amoled:border-slate-700 focus:ring-indigo-500 focus:border-indigo-500'
            } bg-white/80 dark:bg-dark-card/80 amoled:bg-amoled-card/80 px-4 py-3 text-slate-900 dark:text-dark-text amoled:text-amoled-text shadow-sm focus:outline-none focus:ring-2 transition-colors backdrop-blur-sm resize-none`}
            aria-invalid={!!errors.questions}
          />
          {touched.questions && errors.questions && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400 amoled:text-red-500 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errors.questions}</span>
            </p>
          )}
        </div>
      </FormSection>

      {/* Company Intelligence Section */}
      <FormSection 
        id="intelligence"
        title="Company Intelligence" 
        icon={Info}
        isActive={activeSection === 'intelligence'}
        onClick={() => toggleSection('intelligence')}
        isCompleted={sectionCompletions.intelligence}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              Company Values & Culture
            </label>
            <textarea
              value={formData.values}
              onChange={(e) => handleInputChange('values', e.target.value)}
              rows={3}
              placeholder="Key values, mission, culture points, diversity initiatives..."
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 amoled:border-slate-700 bg-white/80 dark:bg-dark-card/80 amoled:bg-amoled-card/80 px-4 py-3 text-slate-900 dark:text-dark-text amoled:text-amoled-text shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors backdrop-blur-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-2">
              <Newspaper className="w-4 h-4 inline mr-1" />
              Recent News & Updates
            </label>
            <textarea
              value={formData.news}
              onChange={(e) => handleInputChange('news', e.target.value)}
              rows={3}
              placeholder="Recent company news, product launches, funding, acquisitions, industry developments..."
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 amoled:border-slate-700 bg-white/80 dark:bg-dark-card/80 amoled:bg-amoled-card/80 px-4 py-3 text-slate-900 dark:text-dark-text amoled:text-amoled-text shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors backdrop-blur-sm resize-none"
            />
          </div>
        </div>
      </FormSection>

      {/* Form Actions */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-3 text-sm font-medium text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary bg-white/80 dark:bg-dark-card/80 amoled:bg-amoled-card/80 border border-slate-300 dark:border-dark-border amoled:border-amoled-border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 amoled:hover:bg-slate-800/30 transition-all shadow-sm backdrop-blur-sm"
        >
          Cancel
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Saving Research...
            </div>
          ) : (
            initialData ? 'Update Research' : 'Save Research'
          )}
        </motion.button>
      </div>
    </form>
  );
};

export default CompanyForm;