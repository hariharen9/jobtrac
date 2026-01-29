import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Briefcase,
  Award,
  User,
  BookOpen,
  Wrench
} from 'lucide-react';
import { VaultResource, ResourceCategory } from '../../../types';
import {
  FormInput,
  FormTextarea,
  FormButtonGroup,
  FormTagInput,
  FormToggle,
  FormActions,
  ButtonGroupOption
} from '../../../components/shared/form';

interface VaultFormProps {
  onSubmit: (data: Omit<VaultResource, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
  initialData?: VaultResource | null;
  loading: boolean;
}

const categoryIcons: Record<ResourceCategory, React.ComponentType<{ className?: string }>> = {
  Documents: FileText,
  Portfolio: Briefcase,
  Credentials: Award,
  Profiles: User,
  Learning: BookOpen,
  Tools: Wrench,
};

const categoryDescriptions: Record<ResourceCategory, string> = {
  Documents: 'CVs, resumes, cover letters, and other documents',
  Portfolio: 'Projects, case studies, and work samples',
  Credentials: 'Certifications, awards, and achievements',
  Profiles: 'LinkedIn, GitHub, personal websites, and professional profiles',
  Learning: 'Courses, tutorials, books, and learning resources',
  Tools: 'Job search tools, templates, and utilities',
};

const categories: ResourceCategory[] = ['Documents', 'Portfolio', 'Credentials', 'Profiles', 'Learning', 'Tools'];

const VaultForm: React.FC<VaultFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  loading
}) => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    category: 'Documents' as ResourceCategory,
    tags: [] as string[],
    isPublic: false,
    isFavorite: false,
  });

  const [urlError, setUrlError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        url: initialData.url,
        description: initialData.description,
        category: initialData.category,
        tags: initialData.tags,
        isPublic: initialData.isPublic,
        isFavorite: initialData.isFavorite,
      });
    }
  }, [initialData]);

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, url }));
    if (url && !validateUrl(url)) {
      setUrlError('Please enter a valid URL (e.g., https://example.com)');
    } else {
      setUrlError('');
    }
  };

  const handleSubmit = async () => { // Changed to match FormActions onSubmit signature (void)
    if (!formData.title.trim() || !formData.url.trim()) {
      return;
    }

    if (!validateUrl(formData.url)) {
      setUrlError('Please enter a valid URL');
      return;
    }

    try {
      // Filter out undefined values before submitting
      const cleanData = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== undefined)
      ) as typeof formData;

      await onSubmit(cleanData);
    } catch (error) {
      console.error('Error submitting vault resource:', error);
    }
  };

  const categoryOptions: ButtonGroupOption[] = categories.map(cat => ({
    value: cat,
    label: cat,
    icon: categoryIcons[cat],
    description: categoryDescriptions[cat],
    hoverColor: 'blue' // Closest to indigo in the design system
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <FormInput
        label="Resource Title"
        value={formData.title}
        onChange={(val) => setFormData(prev => ({ ...prev, title: val }))}
        placeholder="e.g., My Resume - Software Engineer"
        required
        autoFocus
      />

      <FormInput
        label="Resource URL"
        type="url"
        value={formData.url}
        onChange={handleUrlChange}
        placeholder="https://drive.google.com/file/d/..."
        required
        error={urlError}
        helperText={!urlError ? "Enter the full URL to the resource" : undefined}
      />

      <FormButtonGroup
        label="Category"
        value={formData.category}
        onChange={(val) => setFormData(prev => ({ ...prev, category: val as ResourceCategory }))}
        options={categoryOptions}
        columns={3}
        required
      />

      <FormTextarea
        label="Description"
        value={formData.description}
        onChange={(val) => setFormData(prev => ({ ...prev, description: val }))}
        placeholder="Brief description of this resource..."
        rows={3}
      />

      <FormTagInput
        label="Tags"
        value={formData.tags}
        onChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
        placeholder="Add a tag..."
        helperText="Press Enter to add tags"
      />

      <div className="space-y-4 pt-2">
        <FormToggle
          label="Mark as favorite"
          checked={formData.isFavorite}
          onChange={(checked) => setFormData(prev => ({ ...prev, isFavorite: checked }))}
        />

        <FormToggle
          label="Public resource"
          description="(Safe to share with recruiters)"
          checked={formData.isPublic}
          onChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked }))}
        />
      </div>

      <FormActions
        onCancel={onCancel}
        onSubmit={handleSubmit}
        isLoading={loading}
        submitText={initialData ? 'Update Resource' : 'Add Resource'}
        isDisabled={!formData.title.trim() || !formData.url.trim() || !!urlError}
      />
    </motion.div>
  );
};

export default VaultForm;