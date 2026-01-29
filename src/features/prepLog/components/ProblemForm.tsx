import React, { useState, useEffect } from 'react';
import {
  Code2,
  Link as LinkIcon,
  Tag,
  FileText,
  Clock,
  Calendar
} from 'lucide-react';
import { CodingProblem, ProblemPlatform, ProblemDifficulty, ProblemStatus } from '../../../types';
import {
  FormInput,
  FormSelect,
  FormTextarea,
  FormTagInput,
  FormActions,
  SelectOption
} from '../../../components/shared/form';

interface ProblemFormProps {
  initialData?: CodingProblem | null;
  onSubmit: (data: Omit<CodingProblem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const platformOptions: SelectOption[] = [
  { value: 'LeetCode', label: 'LeetCode' },
  { value: 'NeetCode', label: 'NeetCode' },
  { value: 'HackerRank', label: 'HackerRank' },
  { value: 'Other', label: 'Other' },
];

const difficultyOptions: SelectOption[] = [
  { value: 'Easy', label: 'Easy' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Hard', label: 'Hard' },
];

const statusOptions: SelectOption[] = [
  { value: 'Todo', label: 'Todo' },
  { value: 'Solved', label: 'Solved' },
  { value: 'Attempted', label: 'Attempted' },
  { value: 'Revision Needed', label: 'Revision Needed' },
];

const ProblemForm: React.FC<ProblemFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<Partial<CodingProblem>>({
    title: '',
    platform: 'LeetCode',
    difficulty: 'Medium',
    status: 'Todo',
    link: '',
    notes: '',
    tags: [],
    timeSpent: 0,
    solvedDate: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = async () => {
    await onSubmit(formData as Omit<CodingProblem, 'id' | 'createdAt' | 'updatedAt'>);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Problem Title"
          value={formData.title || ''}
          onChange={(val) => setFormData(prev => ({ ...prev, title: val }))}
          placeholder="e.g. Two Sum"
          required
          icon={Code2}
          autoFocus
        />

        <FormInput
          label="Problem Link"
          type="url"
          value={formData.link || ''}
          onChange={(val) => setFormData(prev => ({ ...prev, link: val }))}
          placeholder="https://leetcode.com/problems/..."
          icon={LinkIcon}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormSelect
          label="Platform"
          value={formData.platform || 'LeetCode'}
          onChange={(val) => setFormData(prev => ({ ...prev, platform: val as ProblemPlatform }))}
          options={platformOptions}
        />

        <FormSelect
          label="Difficulty"
          value={formData.difficulty || 'Medium'}
          onChange={(val) => setFormData(prev => ({ ...prev, difficulty: val as ProblemDifficulty }))}
          options={difficultyOptions}
        />

        <FormSelect
          label="Status"
          value={formData.status || 'Todo'}
          onChange={(val) => setFormData(prev => ({ ...prev, status: val as ProblemStatus }))}
          options={statusOptions}
        />
      </div>

      {(formData.status === 'Solved' || formData.status === 'Attempted') && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
          <FormInput
            label="Time Spent (minutes)"
            type="number"
            value={formData.timeSpent || 0}
            onChange={(val) => setFormData(prev => ({ ...prev, timeSpent: parseInt(val) || 0 }))}
            icon={Clock}
            min={0}
          />

          <FormInput
            label="Date Solved"
            type="date"
            value={formData.solvedDate || new Date().toISOString().split('T')[0]}
            onChange={(val) => setFormData(prev => ({ ...prev, solvedDate: val }))}
            icon={Calendar}
          />
        </div>
      )}

      <FormTagInput
        label="Tags"
        value={formData.tags || []}
        onChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
        placeholder="Type tag and press Enter (e.g. DP, Arrays)"
        icon={Tag}
      />

      <FormTextarea
        label="Notes & Key Takeaways"
        value={formData.notes || ''}
        onChange={(val) => setFormData(prev => ({ ...prev, notes: val }))}
        placeholder="What did you learn? What was the tricky part?"
        rows={4}
        icon={FileText}
      />

      <FormActions
        onCancel={onCancel}
        onSubmit={handleSubmit}
        isLoading={loading}
        submitText={initialData ? 'Update Problem' : 'Add Problem'}
        isDisabled={!formData.title}
      />
    </div>
  );
};

export default ProblemForm;