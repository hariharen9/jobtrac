import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PrepEntry, Resource, Application } from '../../../types';
import { Plus, X, Star, Info, Link as LinkIcon, Clock, Calendar, AlertTriangle, CheckCircle, Circle, FolderOpen, HelpCircle } from 'lucide-react';
import { calculateNextReview } from '../../../utils/srs';
import { Timestamp } from 'firebase/firestore';
import PrepFormSkeleton from './PrepFormSkeleton';

interface Subject {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PrepFormProps {
  onSubmit: (entry: Omit<PrepEntry, 'id'>) => void;
  onCancel: () => void;
  initialData?: PrepEntry | null;
  loading?: boolean;
  applications: Application[];
  subjects: Subject[];
}

interface FormErrors {
  date?: string;
  time?: string;
  notes?: string;
  resources?: string;
  subjectId?: string;
}

const PrepForm: React.FC<PrepFormProps> = ({ onSubmit, onCancel, initialData, loading = false, applications, subjects }) => {
  // Show skeleton when loading
  if (loading) {
    return <PrepFormSkeleton />;
  }
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    resources: [] as Resource[],
    time: 1,
    confidence: 3,
    notes: '',
    linkedApplicationId: '',
    subjectId: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  // Refs for keyboard navigation
  const formRef = useRef<HTMLFormElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        date: initialData.date,
        resources: initialData.resources || [],
        time: initialData.time || 1,
        confidence: initialData.confidence || 3,
        notes: initialData.notes || '',
        linkedApplicationId: initialData.linkedApplicationId || '',
        subjectId: initialData.subjectId || ''
      });
    }
  }, [initialData]);

  const validateDate = useCallback((date: string): string | null => {
    if (!date) {
      return 'Date is required';
    } else {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return 'Invalid date format';
      }
    }
    return null;
  }, []);

  const validateTime = useCallback((time: number): string | null => {
    if (time <= 0) {
      return 'Time must be greater than 0';
    } else if (time > 24) {
      return 'Time must be less than or equal to 24 hours';
    }
    return null;
  }, []);

  const validateNotes = useCallback((notes: string): string | null => {
    if (!notes.trim()) {
      return 'Notes are required';
    } else if (notes.length > 1000) {
      return 'Notes must be less than 1000 characters';
    }
    return null;
  }, []);

  const validateResources = useCallback((resources: Resource[]): string | null => {
    for (let i = 0; i < resources.length; i++) {
      const resource = resources[i];
      if (resource.url && !resource.url.startsWith('http')) {
        return `Resource ${i + 1}: URL must start with http:// or https://`;
      }
    }
    return null;
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    const dateError = validateDate(formData.date);
    if (dateError) newErrors.date = dateError;

    const timeError = validateTime(formData.time);
    if (timeError) newErrors.time = timeError;

    const notesError = validateNotes(formData.notes);
    if (notesError) newErrors.notes = notesError;

    const resourcesError = validateResources(formData.resources);
    if (resourcesError) newErrors.resources = resourcesError;

    if (!formData.subjectId) {
      newErrors.subjectId = 'Subject is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateDate, validateTime, validateNotes, validateResources]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      date: true,
      time: true,
      notes: true,
      resources: true,
      subjectId: true
    });
    
    if (validateForm()) {
      const { nextReviewDate, srsStage } = calculateNextReview(formData.confidence, initialData?.srsStage);
      const now = Timestamp.now();
      onSubmit({ 
        ...formData, 
        nextReviewDate, 
        srsStage,
        createdAt: initialData?.createdAt || now,
        updatedAt: now
      });
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData({ ...formData, [field]: value });
    setTouched({ ...touched, [field]: true });
  };

  const handleResourceChange = (index: number, field: keyof Resource, value: string | boolean) => {
    const newResources = [...formData.resources];
    (newResources[index] as any)[field] = value;
    setFormData({ ...formData, resources: newResources });
    
    if (errors.resources) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.resources;
        return newErrors;
      });
    }
  };

  const addResource = () => {
    setFormData({ ...formData, resources: [...formData.resources, { title: '', url: '', completed: false }] });
  };

  const removeResource = (index: number) => {
    setFormData({ ...formData, resources: formData.resources.filter((_, i) => i !== index) });
  };

  // Confidence rating component with improved styling
  const ConfidenceRating = () => (
    <div className="flex flex-col items-center space-y-4 py-4">
      <div className="flex items-center gap-2">
        <p className="text-sm text-center text-slate-600 dark:text-slate-400 amoled:text-slate-500">
          How well do you know this material?
        </p>
        <div className="group relative">
          <HelpCircle className="w-4 h-4 text-slate-400 dark:text-slate-500 cursor-help" />
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-white dark:bg-dark-card amoled:bg-amoled-card border border-slate-200 dark:border-dark-border amoled:border-amoled-border rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10">
            <p className="text-xs text-slate-700 dark:text-dark-text amoled:text-amoled-text">
              Your confidence level affects when this topic will be reviewed again. 
              Lower confidence means more frequent reviews.
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-2 sm:gap-4">
        {[1, 2, 3, 4, 5].map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => handleInputChange('confidence', level)}
            className={`flex flex-col items-center transition-all duration-200 group ${
              formData.confidence === level 
                ? 'scale-110' 
                : 'hover:scale-105 opacity-80'
            }`}
            aria-label={`Confidence level ${level} out of 5`}
          >
            <Star
              className={`w-8 h-8 transition-all duration-200 ${
                level <= formData.confidence
                  ? 'text-yellow-400 fill-current'
                  : 'text-slate-300 dark:text-slate-600 amoled:text-slate-500 group-hover:text-yellow-300'
              }`}
            />
            <span className="text-xs mt-1 text-slate-500 dark:text-slate-400 amoled:text-slate-500">{level}</span>
          </button>
        ))}
      </div>
      <div className="mt-2">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200 amoled:bg-indigo-900/20 amoled:text-indigo-300">
          {formData.confidence === 1 && 'Very Low'}
          {formData.confidence === 2 && 'Low'}
          {formData.confidence === 3 && 'Medium'}
          {formData.confidence === 4 && 'High'}
          {formData.confidence === 5 && 'Very High'}
        </span>
      </div>
    </div>
  );

  const FormSection: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode }> = ({ title, icon: Icon, children }) => (
    <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border shadow-sm p-5 md:p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 amoled:bg-indigo-900/20">
          <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400 amoled:text-indigo-500" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-dark-text amoled:text-amoled-text">
          {title}
        </h3>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Escape key to cancel
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
        return;
      }
      
      // Handle Ctrl/Cmd + Enter to submit
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        const submitEvent = new Event('submit', { cancelable: true, bubbles: true });
        formRef.current?.dispatchEvent(submitEvent);
        return;
      }
      
      // Focus management
      if (e.key === 'Tab' && e.shiftKey) {
        if (document.activeElement === cancelButtonRef.current) {
          e.preventDefault();
          submitButtonRef.current?.focus();
        }
      } else if (e.key === 'Tab' && !e.shiftKey) {
        if (document.activeElement === submitButtonRef.current) {
          e.preventDefault();
          cancelButtonRef.current?.focus();
        }
      }
    };

    const form = formRef.current;
    form?.addEventListener('keydown', handleKeyDown);
    
    return () => {
      form?.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCancel]);

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 p-1 bg-slate-50 dark:bg-dark-bg/50 amoled:bg-black/50 rounded-xl">
      <div className="space-y-6">
        {/* Organization Section */}
        <FormSection title="Organization" icon={FolderOpen}>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
            {/* Subject Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-2">
                Subject
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FolderOpen className="h-5 w-5 text-slate-400 dark:text-slate-500 amoled:text-slate-600" />
                </div>
                <select
                  value={formData.subjectId}
                  onChange={(e) => handleInputChange('subjectId', e.target.value)}
                  className="pl-10 w-full rounded-lg border border-slate-300 dark:border-slate-600 amoled:border-slate-700 bg-white dark:bg-dark-card amoled:bg-amoled-card px-4 py-3 text-slate-900 dark:text-dark-text amoled:text-amoled-text shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                >
                  <option value="">Select a Subject</option>
                  {subjects && Array.isArray(subjects) ? subjects.map(subject => (
                    <option key={subject.id} value={subject.id} className="text-slate-900 dark:text-dark-text amoled:text-amoled-text">
                      {subject.name}
                    </option>
                  )) : null}
                </select>
              </div>
              {touched.subjectId && errors.subjectId && (
                <p id="subject-error" className="mt-2 text-sm text-red-600 dark:text-red-400 amoled:text-red-500 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{errors.subjectId}</span>
                </p>
              )}
            </div>
          </div>
        </FormSection>

        {/* Prep Details Section */}
        <FormSection title="Prep Details" icon={Info}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Date Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-2">
                Date *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-slate-400 dark:text-slate-500 amoled:text-slate-600" />
                </div>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className={`pl-10 w-full rounded-lg border ${
                    (touched.date && errors.date) 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-slate-300 dark:border-slate-600 focus:ring-indigo-500 focus:border-indigo-500'
                  } bg-white dark:bg-dark-card amoled:bg-amoled-card px-4 py-3 text-slate-900 dark:text-dark-text amoled:text-amoled-text shadow-sm focus:outline-none focus:ring-2 transition-colors`}
                  aria-invalid={!!errors.date}
                  aria-describedby={errors.date ? 'date-error' : undefined}
                />
              </div>
              {touched.date && errors.date && (
                <p id="date-error" className="mt-2 text-sm text-red-600 dark:text-red-400 amoled:text-red-500 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{errors.date}</span>
                </p>
              )}
            </div>

            {/* Time Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-2">
                Time Spent (hours) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-slate-400 dark:text-slate-500 amoled:text-slate-600" />
                </div>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.5"
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', parseFloat(e.target.value) || 0)}
                  className={`pl-10 w-full rounded-lg border ${
                    (touched.time && errors.time) 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-slate-300 dark:border-slate-600 focus:ring-indigo-500 focus:border-indigo-500'
                  } bg-white dark:bg-dark-card amoled:bg-amoled-card px-4 py-3 text-slate-900 dark:text-dark-text amoled:text-amoled-text shadow-sm focus:outline-none focus:ring-2 transition-colors`}
                  aria-invalid={!!errors.time}
                  aria-describedby={errors.time ? 'time-error' : undefined}
                />
              </div>
              {touched.time && errors.time && (
                <p id="time-error" className="mt-2 text-sm text-red-600 dark:text-red-400 amoled:text-red-500 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{errors.time}</span>
                </p>
              )}
            </div>

            {/* Linked Application */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-2">
                Link to Application
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon className="h-5 w-5 text-slate-400 dark:text-slate-500 amoled:text-slate-600" />
                </div>
                <select
                  value={formData.linkedApplicationId}
                  onChange={(e) => handleInputChange('linkedApplicationId', e.target.value)}
                  className="pl-10 w-full rounded-lg border border-slate-300 dark:border-slate-600 amoled:border-slate-700 bg-white dark:bg-dark-card amoled:bg-amoled-card px-4 py-3 text-slate-900 dark:text-dark-text amoled:text-amoled-text shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                >
                  <option value="">None</option>
                  {applications && Array.isArray(applications) ? applications.map(app => (
                    <option key={app.id} value={app.id} className="text-slate-900 dark:text-dark-text amoled:text-amoled-text">
                      {app.role} at {app.company}
                    </option>
                  )) : null}
                </select>
              </div>
            </div>
          </div>
        </FormSection>

        {/* Confidence Section */}
        <FormSection title="Confidence Level" icon={Star}>
          <ConfidenceRating />
        </FormSection>

        {/* Resources Section */}
        <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border shadow-sm p-5 md:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 amoled:bg-blue-900/20">
              <LinkIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 amoled:text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-dark-text amoled:text-amoled-text">
              Resources
            </h3>
          </div>
          
          <div className="space-y-4">
            {formData.resources.map((resource, index) => (
              <div 
                key={index} 
                className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-dark-bg/50 amoled:bg-amoled-bg/50 rounded-lg border border-slate-200 dark:border-dark-border/50 amoled:border-amoled-border/50"
              >
                <div className="pt-1">
                  <input
                    type="checkbox"
                    checked={resource.completed}
                    onChange={(e) => handleResourceChange(index, 'completed', e.target.checked)}
                    className="h-5 w-5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-600 amoled:border-slate-700 bg-white dark:bg-dark-card amoled:bg-amoled-card"
                    aria-label={`Mark resource ${index + 1} as completed`}
                  />
                </div>
                
                <div className="flex-grow space-y-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Resource Title"
                      value={resource.title}
                      onChange={(e) => handleResourceChange(index, 'title', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-600 amoled:border-slate-700 bg-white dark:bg-dark-card amoled:bg-amoled-card px-3 py-2 text-slate-900 dark:text-dark-text amoled:text-amoled-text shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <input
                      type="url"
                      placeholder="https://example.com/resource"
                      value={resource.url}
                      onChange={(e) => handleResourceChange(index, 'url', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-600 amoled:border-slate-700 bg-white dark:bg-dark-card amoled:bg-amoled-card px-3 py-2 text-slate-900 dark:text-dark-text amoled:text-amoled-text shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 amoled:text-slate-500">
                    {resource.completed ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Completed
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Circle className="w-4 h-4 text-slate-400 dark:text-slate-500 amoled:text-slate-600" />
                        Not completed
                      </span>
                    )}
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => removeResource(index)}
                  className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 amoled:hover:text-red-500 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 amoled:hover:bg-red-900/20 transition-colors"
                  aria-label={`Remove resource ${index + 1}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
          
          <button
            type="button"
            onClick={addResource}
            className="mt-4 w-full flex items-center justify-center gap-2 p-3 text-sm font-medium text-indigo-600 dark:text-indigo-400 amoled:text-indigo-500 hover:text-indigo-800 dark:hover:text-indigo-300 amoled:hover:text-indigo-400 rounded-lg border-2 border-dashed border-slate-300 dark:border-dark-border amoled:border-amoled-border hover:border-indigo-300 dark:hover:border-indigo-500/50 amoled:hover:border-indigo-500/30 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Resource
          </button>
          
          {touched.resources && errors.resources && (
            <p className="mt-3 text-sm text-red-600 dark:text-red-400 amoled:text-red-500 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errors.resources}</span>
            </p>
          )}
        </div>

        {/* Reflection Section */}
        <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border shadow-sm p-5 md:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 amoled:bg-purple-900/20">
              <Info className="w-5 h-5 text-purple-600 dark:text-purple-400 amoled:text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-dark-text amoled:text-amoled-text">
              Reflection
            </h3>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-2">
              Key Takeaways *
            </label>
            <textarea
              required
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={6}
              placeholder="What did you learn? What are the key patterns? What should you remember for next time?"
              className={`w-full rounded-lg border ${
                (touched.notes && errors.notes) 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-slate-300 dark:border-slate-600 focus:ring-indigo-500 focus:border-indigo-500'
              } bg-white dark:bg-dark-card amoled:bg-amoled-card px-4 py-3 text-slate-900 dark:text-dark-text amoled:text-amoled-text shadow-sm focus:outline-none focus:ring-2 transition-colors`}
              aria-invalid={!!errors.notes}
              aria-describedby={errors.notes ? 'notes-error' : undefined}
            />
            {touched.notes && errors.notes && (
              <p id="notes-error" className="mt-2 text-sm text-red-600 dark:text-red-400 amoled:text-red-500 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{errors.notes}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-slate-50/80 dark:bg-dark-bg/80 amoled:bg-black/80 backdrop-blur-sm pb-1 pr-1 rounded-b-xl">
        <button
          ref={cancelButtonRef}
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-5 py-2.5 text-sm font-semibold bg-white dark:bg-dark-card amoled:bg-amoled-card border border-slate-300 dark:border-slate-600 amoled:border-amoled-border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 amoled:hover:bg-amoled-card/80 transition-colors shadow-sm disabled:opacity-50 text-slate-700 dark:text-dark-text amoled:text-amoled-text focus:outline-none focus:ring-2 focus:ring-slate-500"
        >
          Cancel
        </button>
        <button
          ref={submitButtonRef}
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Saving...
            </>
          ) : (
            'Save Prep'
          )}
        </button>
      </div>
    </form>
  );
};

export default PrepForm;