import React, { useState, useEffect } from 'react';
import {
  Star,
  Target,
  Zap,
  Trophy,
  Lightbulb,
  BookOpen
} from 'lucide-react';
import { StarStory } from '../../../types';
import {
  FormInput,
  FormTextarea,
  FormActions,
  FormSectionHeader
} from '../../../components/shared/form';

interface StarFormProps {
  onSubmit: (story: Omit<StarStory, 'id'>) => void;
  onCancel: () => void;
  initialData?: StarStory | null;
  loading?: boolean;
}

const StarForm: React.FC<StarFormProps> = ({ onSubmit, onCancel, initialData, loading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    situation: '',
    task: '',
    action: '',
    result: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        situation: initialData.situation,
        task: initialData.task,
        action: initialData.action,
        result: initialData.result
      });
    }
  }, [initialData]);

  const handleSubmit = () => {
    onSubmit({ ...formData, createdAt: new Date().toISOString() });
  };

  return (
    <div className="space-y-6">
      <FormInput
        label="Story Title"
        value={formData.title}
        onChange={(val) => setFormData(prev => ({ ...prev, title: val }))}
        placeholder="e.g., Led Team Through Critical System Migration"
        required
        autoFocus
        icon={BookOpen}
      />

      <div className="space-y-4">
        <FormSectionHeader title="The STAR Method" icon={Star} />

        <div className="pl-4 border-l-4 border-blue-500">
          <FormTextarea
            label="Situation"
            value={formData.situation}
            onChange={(val) => setFormData(prev => ({ ...prev, situation: val }))}
            placeholder="Describe the context and background. What was the situation you were in?"
            required
            rows={3}
            icon={Target}
          />
        </div>

        <div className="pl-4 border-l-4 border-purple-500">
          <FormTextarea
            label="Task"
            value={formData.task}
            onChange={(val) => setFormData(prev => ({ ...prev, task: val }))}
            placeholder="What was your responsibility or goal? What needed to be accomplished?"
            required
            rows={3}
            icon={Trophy}
          />
        </div>

        <div className="pl-4 border-l-4 border-orange-500">
          <FormTextarea
            label="Action"
            value={formData.action}
            onChange={(val) => setFormData(prev => ({ ...prev, action: val }))}
            placeholder="What specific actions did you take? Focus on YOUR contributions and decisions."
            required
            rows={4}
            icon={Zap}
          />
        </div>

        <div className="pl-4 border-l-4 border-green-500">
          <FormTextarea
            label="Result"
            value={formData.result}
            onChange={(val) => setFormData(prev => ({ ...prev, result: val }))}
            placeholder="What was the outcome? Include metrics, impact, and lessons learned."
            required
            rows={3}
            icon={Lightbulb}
          />
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-dark-card amoled:bg-amoled-card p-4 rounded-lg border border-slate-100 dark:border-slate-800">
        <h4 className="text-sm font-medium text-slate-700 dark:text-dark-text amoled:text-amoled-text mb-2 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-yellow-500" />
          STAR Method Tips:
        </h4>
        <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 ml-6 list-disc">
          <li>Keep each section concise but detailed enough to understand the context</li>
          <li>Focus on YOUR specific contributions in the Action section</li>
          <li>Include quantifiable results when possible (percentages, time saved, etc.)</li>
          <li>This story should demonstrate skills relevant to the job you're applying for</li>
        </ul>
      </div>

      <FormActions
        onCancel={onCancel}
        onSubmit={handleSubmit}
        isLoading={loading}
        submitText={initialData ? 'Update Story' : 'Save Story'}
        isDisabled={!formData.title || !formData.situation || !formData.task || !formData.action || !formData.result}
      />
    </div>
  );
};

export default StarForm;