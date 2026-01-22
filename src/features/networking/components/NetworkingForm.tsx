import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Building2,
  Briefcase,
  Calendar,
  MessageSquare,
  UserCheck,
  Clock,
  Linkedin,
  Mail,
  Phone,
  Coffee,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { NetworkingContact } from '../../../types';
import {
  FormInput,
  FormTextarea,
  FormButtonGroup,
  FormActions,
  FormSectionHeader,
} from '../../../components/shared/form';

interface NetworkingFormProps {
  onSubmit: (contact: Omit<NetworkingContact, 'id'>) => void;
  onCancel: () => void;
  initialData?: NetworkingContact | null;
  loading?: boolean;
}

// Status options with icons and hover colors for better UX
const statusOptions = [
  { value: 'Planning to reach out', label: 'Planning', icon: Clock, hoverColor: 'purple' as const },
  { value: 'Messaged on LinkedIn', label: 'LinkedIn', icon: Linkedin, hoverColor: 'blue' as const },
  { value: 'Email sent', label: 'Email', icon: Mail, hoverColor: 'teal' as const },
  { value: 'Connected on LinkedIn', label: 'Connected', icon: UserCheck, hoverColor: 'green' as const },
  { value: 'Had initial conversation', label: 'Talked', icon: Phone, hoverColor: 'blue' as const },
  { value: 'Follow-up scheduled', label: 'Follow-up', icon: Coffee, hoverColor: 'orange' as const },
  { value: 'Referral provided', label: 'Referral', icon: CheckCircle, hoverColor: 'green' as const },
  { value: 'No response', label: 'No response', icon: AlertCircle, hoverColor: 'maroon' as const },
  { value: 'Not interested', label: 'Declined', icon: XCircle, hoverColor: 'red' as const },
];

const NetworkingForm: React.FC<NetworkingFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    role: '',
    date: new Date().toISOString().split('T')[0],
    status: '',
    referral: 'N' as 'Y' | 'N',
    notes: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        company: initialData.company,
        role: initialData.role,
        date: initialData.date,
        status: initialData.status,
        referral: initialData.referral || 'N',
        notes: initialData.notes || '',
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Contact Information */}
      <div className="space-y-4">
        <FormSectionHeader title="Contact" icon={User} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Name"
            icon={User}
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: value })}
            placeholder="e.g., John Smith"
            required
          />
          <FormInput
            label="Company"
            icon={Building2}
            value={formData.company}
            onChange={(value) => setFormData({ ...formData, company: value })}
            placeholder="e.g., Google"
            required
          />
        </div>

        <FormInput
          label="Role / Title"
          icon={Briefcase}
          value={formData.role}
          onChange={(value) => setFormData({ ...formData, role: value })}
          placeholder="e.g., Senior Software Engineer"
          required
        />
      </div>

      {/* Status & Interaction */}
      <div className="space-y-4">
        <FormSectionHeader title="Status" icon={MessageSquare} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Date Contacted"
            icon={Calendar}
            type="date"
            value={formData.date}
            onChange={(value) => setFormData({ ...formData, date: value })}
          />

          <FormButtonGroup
            label="Referral Received?"
            value={formData.referral}
            onChange={(value) => setFormData({ ...formData, referral: value as 'Y' | 'N' })}
            options={[
              { value: 'N', label: 'No' },
              { value: 'Y', label: 'Yes' },
            ]}
          />
        </div>

        <FormButtonGroup
          label="Current Status"
          value={formData.status}
          onChange={(value) => setFormData({ ...formData, status: value })}
          options={statusOptions}
          columns={3}
          required
        />
      </div>

      {/* Notes */}
      <div className="space-y-4">
        <FormSectionHeader title="Notes" icon={FileText} />

        <FormTextarea
          value={formData.notes}
          onChange={(value) => setFormData({ ...formData, notes: value })}
          placeholder="Conversation details, follow-up actions, key topics discussed..."
          rows={3}
          showCharCount
          maxLength={1000}
        />
      </div>

      {/* Actions */}
      <FormActions
        onCancel={onCancel}
        isLoading={loading}
        submitText={initialData ? 'Update Contact' : 'Save Contact'}
        loadingText="Saving..."
        submitIcon={UserCheck}
      />
    </motion.form>
  );
};

export default NetworkingForm;
