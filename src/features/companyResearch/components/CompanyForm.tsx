import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  FileText,
  Heart,
  HelpCircle,
  Users,
  Newspaper,
  Search,
} from 'lucide-react';
import { CompanyResearch } from '../../../types';
import {
  FormInput,
  FormTextarea,
  FormActions,
  FormSectionHeader,
} from '../../../components/shared/form';

interface CompanyFormProps {
  onSubmit: (company: Omit<CompanyResearch, 'id'>) => void;
  onCancel: () => void;
  initialData?: CompanyResearch | null;
  loading?: boolean;
}

const CompanyForm: React.FC<CompanyFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    company: '',
    whatTheyDo: '',
    values: '',
    why: '',
    questions: '',
    news: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        company: initialData.company,
        whatTheyDo: initialData.whatTheyDo,
        values: initialData.values || '',
        why: initialData.why,
        questions: initialData.questions,
        news: initialData.news || '',
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

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
    if (validateForm()) {
      onSubmit({ ...formData, date: new Date().toISOString().split('T')[0] });
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Company Overview */}
      <div className="space-y-4">
        <FormSectionHeader title="Company Overview" icon={Building2} />

        <FormInput
          label="Company Name"
          icon={Building2}
          value={formData.company}
          onChange={(value) => handleChange('company', value)}
          placeholder="e.g., Google, Microsoft, Apple"
          error={errors.company}
          required
        />

        <FormTextarea
          label="What They Do"
          icon={FileText}
          value={formData.whatTheyDo}
          onChange={(value) => handleChange('whatTheyDo', value)}
          placeholder="Brief description of the company's business, products, or services..."
          rows={3}
          error={errors.whatTheyDo}
          showCharCount
          maxLength={500}
          required
        />
      </div>

      {/* Your Motivation */}
      <div className="space-y-4">
        <FormSectionHeader title="Your Motivation" icon={Heart} />

        <FormTextarea
          label="Why I Want to Work Here"
          icon={Heart}
          value={formData.why}
          onChange={(value) => handleChange('why', value)}
          placeholder="Your motivation, alignment with career goals, specific interests in their products/mission..."
          rows={4}
          error={errors.why}
          showCharCount
          maxLength={800}
          required
        />
      </div>

      {/* Interview Preparation */}
      <div className="space-y-4">
        <FormSectionHeader title="Interview Prep" icon={HelpCircle} />

        <FormTextarea
          label="Questions to Ask Them"
          icon={HelpCircle}
          value={formData.questions}
          onChange={(value) => handleChange('questions', value)}
          placeholder="Thoughtful questions about the role, team, company culture, growth opportunities..."
          rows={3}
          error={errors.questions}
          showCharCount
          maxLength={600}
          required
        />
      </div>

      {/* Company Intelligence (Optional) */}
      <div className="space-y-4">
        <FormSectionHeader title="Company Intel" icon={Search} />

        <FormTextarea
          label="Company Values & Culture"
          icon={Users}
          value={formData.values}
          onChange={(value) => handleChange('values', value)}
          placeholder="Key values, mission, culture points, diversity initiatives..."
          rows={3}
          showCharCount
          maxLength={500}
        />

        <FormTextarea
          label="Recent News & Updates"
          icon={Newspaper}
          value={formData.news}
          onChange={(value) => handleChange('news', value)}
          placeholder="Recent company news, product launches, funding, acquisitions, industry developments..."
          rows={3}
          showCharCount
          maxLength={500}
        />
      </div>

      {/* Actions */}
      <FormActions
        onCancel={onCancel}
        isLoading={loading}
        submitText={initialData ? 'Update Research' : 'Save Research'}
        loadingText="Saving..."
        submitIcon={Search}
      />
    </motion.form>
  );
};

export default CompanyForm;
