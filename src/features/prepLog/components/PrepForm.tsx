import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  X,
  Star,
  Link as LinkIcon,
  Clock,
  Calendar,
  CheckCircle,
  Circle,
  FolderOpen,
  BookOpen,
  Briefcase,
  ExternalLink,
} from 'lucide-react';
import { PrepEntry, Resource, Application, Subject } from '../../../types';
import { calculateNextReview } from '../../../utils/srs';
import { Timestamp } from 'firebase/firestore';
import PrepFormSkeleton from './PrepFormSkeleton';
import {
  FormInput,
  FormTextarea,
  FormSelect,
  FormActions,
  FormSectionHeader,
  FormButtonGroup,
} from '../../../components/shared/form';

interface PrepFormProps {
  onSubmit: (entry: Omit<PrepEntry, 'id'>) => void;
  onCancel: () => void;
  initialData?: PrepEntry | null;
  loading?: boolean;
  applications: Application[];
  subjects: Subject[];
  preFilledTopic?: string;
}

// Confidence options with descriptions
const confidenceOptions = [
  { value: '1', label: '1', description: 'Very Low', hoverColor: 'red' as const },
  { value: '2', label: '2', description: 'Low', hoverColor: 'orange' as const },
  { value: '3', label: '3', description: 'Medium', hoverColor: 'yellow' as const },
  { value: '4', label: '4', description: 'High', hoverColor: 'green' as const },
  { value: '5', label: '5', description: 'Very High', hoverColor: 'green' as const },
];

// Resource Item Component
const ResourceItem: React.FC<{
  resource: Resource;
  index: number;
  onChange: (index: number, field: keyof Resource, value: string | boolean) => void;
  onRemove: (index: number) => void;
}> = React.memo(({ resource, index, onChange, onRemove }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-dark-bg/50 amoled:bg-amoled-bg/50 rounded-lg border border-slate-200 dark:border-dark-border amoled:border-amoled-border"
  >
    <button
      type="button"
      onClick={() => onChange(index, 'completed', !resource.completed)}
      className="mt-1 flex-shrink-0"
      aria-label={resource.completed ? 'Mark as incomplete' : 'Mark as complete'}
    >
      {resource.completed ? (
        <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
      ) : (
        <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 amoled:text-slate-700 hover:text-slate-400" />
      )}
    </button>

    <div className="flex-1 space-y-2">
      <input
        type="text"
        placeholder="Resource title"
        value={resource.title}
        onChange={(e) => onChange(index, 'title', e.target.value)}
        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-dark-border amoled:border-amoled-border bg-white dark:bg-dark-card amoled:bg-amoled-card text-slate-900 dark:text-dark-text amoled:text-amoled-text placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent transition-all"
      />
      <div className="flex items-center gap-2">
        <ExternalLink className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <input
          type="url"
          placeholder="https://example.com/resource"
          value={resource.url}
          onChange={(e) => onChange(index, 'url', e.target.value)}
          className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-dark-border amoled:border-amoled-border bg-white dark:bg-dark-card amoled:bg-amoled-card text-slate-900 dark:text-dark-text amoled:text-amoled-text placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent transition-all"
        />
      </div>
    </div>

    <motion.button
      type="button"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => onRemove(index)}
      className="p-1.5 text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 amoled:hover:bg-red-950/40 transition-colors"
      aria-label="Remove resource"
    >
      <X className="w-4 h-4" />
    </motion.button>
  </motion.div>
));

const PrepForm: React.FC<PrepFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  loading = false,
  applications,
  subjects,
  preFilledTopic,
}) => {
  // Show skeleton when loading
  if (loading) {
    return <PrepFormSkeleton />;
  }

  // Ensure subjects is always an array
  const safeSubjects = Array.isArray(subjects) ? subjects : [];

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    resources: [] as Resource[],
    time: 1,
    confidence: 3,
    notes: '',
    linkedApplicationId: '',
    subjectId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        date: initialData.date,
        resources: initialData.resources || [],
        time: initialData.time || 1,
        confidence: initialData.confidence || 3,
        notes: initialData.notes || '',
        linkedApplicationId: initialData.linkedApplicationId || '',
        subjectId: initialData.subjectId || '',
      });
    } else if (preFilledTopic) {
      console.log('Pre-filled topic:', preFilledTopic);
    }
  }, [initialData, preFilledTopic]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (formData.time <= 0) {
      newErrors.time = 'Time must be greater than 0';
    } else if (formData.time > 24) {
      newErrors.time = 'Time must be 24 hours or less';
    }

    if (!formData.notes.trim()) {
      newErrors.notes = 'Notes are required';
    } else if (formData.notes.length > 1000) {
      newErrors.notes = 'Notes must be under 1000 characters';
    }

    if (!formData.subjectId) {
      newErrors.subjectId = 'Subject is required';
    } else if (safeSubjects.length > 0 && !safeSubjects.some((s) => s.id === formData.subjectId)) {
      newErrors.subjectId = 'Please select a valid subject';
    }

    // Validate resource URLs
    for (let i = 0; i < formData.resources.length; i++) {
      const resource = formData.resources[i];
      if (resource.url && !resource.url.startsWith('http')) {
        newErrors.resources = `Resource ${i + 1}: URL must start with http:// or https://`;
        break;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, safeSubjects]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const { nextReviewDate, srsStage } = calculateNextReview(
        formData.confidence,
        initialData?.srsStage
      );
      const now = Timestamp.now();
      onSubmit({
        ...formData,
        nextReviewDate,
        srsStage,
        createdAt: initialData?.createdAt || now,
        updatedAt: now,
      });
    }
  };

  const handleChange = (field: keyof typeof formData, value: string | number) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleResourceChange = (index: number, field: keyof Resource, value: string | boolean) => {
    const newResources = [...formData.resources];
    (newResources[index] as Record<string, string | boolean>)[field] = value;
    setFormData({ ...formData, resources: newResources });
    if (errors.resources) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.resources;
        return newErrors;
      });
    }
  };

  const addResource = () => {
    setFormData({
      ...formData,
      resources: [...formData.resources, { title: '', url: '', completed: false }],
    });
  };

  const removeResource = (index: number) => {
    setFormData({
      ...formData,
      resources: formData.resources.filter((_, i) => i !== index),
    });
  };

  // Build subject options for select
  const subjectOptions = safeSubjects.map((subject) => ({
    value: subject.id,
    label: subject.name || `Unnamed Subject (${subject.id})`,
  }));

  // Build application options for select
  const applicationOptions = (applications || []).map((app) => ({
    value: app.id,
    label: `${app.role} at ${app.company}`,
  }));

  const noSubjectsWarning = safeSubjects.length === 0;

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Subject Selection */}
      <div className="space-y-4">
        <FormSectionHeader title="Subject" icon={FolderOpen} />

        <FormSelect
          label="Study Subject"
          icon={FolderOpen}
          value={formData.subjectId}
          onChange={(value) => handleChange('subjectId', value)}
          options={subjectOptions}
          placeholder="Select a subject"
          error={errors.subjectId}
          required
          helperText={
            noSubjectsWarning
              ? 'Create a subject in the Subject Manager first'
              : undefined
          }
        />
      </div>

      {/* Session Details */}
      <div className="space-y-4">
        <FormSectionHeader title="Session Details" icon={Clock} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Date"
            icon={Calendar}
            type="date"
            value={formData.date}
            onChange={(value) => handleChange('date', value)}
            error={errors.date}
            required
          />

          <FormInput
            label="Time Spent (hours)"
            icon={Clock}
            type="number"
            value={formData.time}
            onChange={(value) => handleChange('time', parseFloat(value) || 0)}
            min={0}
            max={24}
            step={0.5}
            error={errors.time}
            required
          />
        </div>

        <FormSelect
          label="Link to Application"
          icon={Briefcase}
          value={formData.linkedApplicationId}
          onChange={(value) => handleChange('linkedApplicationId', value)}
          options={applicationOptions}
          placeholder="None (optional)"
        />
      </div>

      {/* Confidence Rating */}
      <div className="space-y-4">
        <FormSectionHeader title="Confidence Level" icon={Star} />

        <div className="text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400 amoled:text-slate-500 mb-4">
            How well do you understand this material?
          </p>

          <div className="flex justify-center gap-2 sm:gap-3">
            {[1, 2, 3, 4, 5].map((level) => (
              <motion.button
                key={level}
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleChange('confidence', level)}
                className="flex flex-col items-center gap-1 p-2"
              >
                <Star
                  className={`w-8 h-8 transition-all ${
                    level <= formData.confidence
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-slate-300 dark:text-slate-600 amoled:text-slate-700'
                  }`}
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">{level}</span>
              </motion.button>
            ))}
          </div>

          <div className="mt-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-dark-card amoled:bg-amoled-card text-slate-700 dark:text-slate-300 amoled:text-slate-400 border border-slate-200 dark:border-dark-border amoled:border-amoled-border">
              {formData.confidence === 1 && 'Very Low - Review soon'}
              {formData.confidence === 2 && 'Low - Needs practice'}
              {formData.confidence === 3 && 'Medium - Getting there'}
              {formData.confidence === 4 && 'High - Well understood'}
              {formData.confidence === 5 && 'Very High - Mastered'}
            </span>
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className="space-y-4">
        <FormSectionHeader title="Resources" icon={LinkIcon} />

        <AnimatePresence mode="popLayout">
          {formData.resources.map((resource, index) => (
            <ResourceItem
              key={index}
              resource={resource}
              index={index}
              onChange={handleResourceChange}
              onRemove={removeResource}
            />
          ))}
        </AnimatePresence>

        {errors.resources && (
          <p className="text-sm text-red-600 dark:text-red-400 amoled:text-red-500">
            {errors.resources}
          </p>
        )}

        <motion.button
          type="button"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={addResource}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400 amoled:text-slate-500 rounded-lg border-2 border-dashed border-slate-300 dark:border-dark-border amoled:border-amoled-border hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Resource
        </motion.button>
      </div>

      {/* Notes / Reflection */}
      <div className="space-y-4">
        <FormSectionHeader title="Reflection" icon={BookOpen} />

        <FormTextarea
          label="Key Takeaways"
          icon={BookOpen}
          value={formData.notes}
          onChange={(value) => handleChange('notes', value)}
          placeholder="What did you learn? What patterns did you notice? What should you remember?"
          rows={5}
          error={errors.notes}
          showCharCount
          maxLength={1000}
          required
        />
      </div>

      {/* Actions */}
      <FormActions
        onCancel={onCancel}
        isLoading={false}
        isDisabled={noSubjectsWarning}
        submitText={initialData ? 'Update Entry' : 'Add Entry'}
        loadingText="Saving..."
        submitIcon={BookOpen}
      />
    </motion.form>
  );
};

export default PrepForm;
