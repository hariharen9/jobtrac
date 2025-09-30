import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PrepEntry, Resource, Application, Subject } from '../../../types';
import { Plus, X, Star, Info, Link as LinkIcon, Clock, Calendar, AlertTriangle, CheckCircle, Circle, FolderOpen, HelpCircle, BookOpen } from 'lucide-react';
import { calculateNextReview } from '../../../utils/srs';
import { Timestamp } from 'firebase/firestore';
import PrepFormSkeleton from './PrepFormSkeleton';
import { motion, AnimatePresence } from 'framer-motion';

interface PrepFormProps {
  onSubmit: (entry: Omit<PrepEntry, 'id'>) => void;
  onCancel: () => void;
  initialData?: PrepEntry | null;
  loading?: boolean;
  applications: Application[];
  subjects: Subject[];
  preFilledTopic?: string;
}

interface FormErrors {
  date?: string;
  time?: string;
  notes?: string;
  resources?: string;
  subjectId?: string;
}

// Move FormSection outside to prevent re-creation on every render
const FormSection: React.FC<{ 
  id: string;
  title: string; 
  icon: React.ElementType; 
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = React.memo(({ id, title, icon: Icon, children, isActive, onClick }) => (
  <motion.div 
    layout
    className={`rounded-xl border transition-all duration-300 ${
      isActive 
        ? 'border-indigo-300 dark:border-indigo-700 bg-white/70 dark:bg-dark-card/70 amoled:bg-amoled-card/70 backdrop-blur-sm shadow-md' 
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
      <h3 className={`text-lg font-semibold ${
        isActive 
          ? 'text-slate-800 dark:text-dark-text amoled:text-amoled-text' 
          : 'text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary'
      }`}>
        {title}
      </h3>
      <div className="ml-auto">
        <motion.div
          animate={{ rotate: isActive ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-5 h-5 text-slate-500 dark:text-slate-400 amoled:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
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

// Move ConfidenceRating outside to prevent re-creation on every render
const ConfidenceRating: React.FC<{ 
  confidence: number;
  onConfidenceChange: (value: number) => void;
}> = React.memo(({ confidence, onConfidenceChange }) => (
  <div className="flex flex-col items-center space-y-4 py-4">
    <div className="flex items-center gap-2">
      <p className="text-sm text-center text-slate-600 dark:text-slate-400 amoled:text-slate-500">
        How well do you know this material?
      </p>
      <div className="group relative">
        <HelpCircle className="w-4 h-4 text-slate-400 dark:text-slate-500 cursor-help" />
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-white dark:bg-dark-card amoled:bg-amoled-card border border-slate-200 dark:border-dark-border amoled:border-amoled-border rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10 backdrop-blur-sm">
          <p className="text-xs text-slate-700 dark:text-dark-text amoled:text-amoled-text">
            Your confidence level affects when this topic will be reviewed again. 
            Lower confidence means more frequent reviews.
          </p>
        </div>
      </div>
    </div>
    <div className="flex justify-center gap-2 sm:gap-4">
      {[1, 2, 3, 4, 5].map((level) => (
        <motion.button
          key={level}
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onConfidenceChange(level)}
          className={`flex flex-col items-center transition-all duration-200 group ${
            confidence === level 
              ? 'scale-110' 
              : 'hover:scale-105 opacity-80'
          }`}
          aria-label={`Confidence level ${level} out of 5`}
        >
          <Star
            className={`w-8 h-8 transition-all duration-200 ${
              level <= confidence
                ? 'text-yellow-400 fill-current'
                : 'text-slate-300 dark:text-slate-600 amoled:text-slate-500 group-hover:text-yellow-300'
            }`}
          />
          <span className="text-xs mt-1 text-slate-500 dark:text-slate-400 amoled:text-slate-500">{level}</span>
        </motion.button>
      ))}
    </div>
    <div className="mt-2">
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200 amoled:bg-indigo-900/20 amoled:text-indigo-300 backdrop-blur-sm">
        {confidence === 1 && 'Very Low'}
        {confidence === 2 && 'Low'}
        {confidence === 3 && 'Medium'}
        {confidence === 4 && 'High'}
        {confidence === 5 && 'Very High'}
      </span>
    </div>
  </div>
));

const PrepForm: React.FC<PrepFormProps> = ({ onSubmit, onCancel, initialData, loading = false, applications, subjects, preFilledTopic }) => {
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
    subjectId: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  // Initialize with organization section open by default
  const [activeSection, setActiveSection] = useState<string | null>('organization');
  
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
    } else if (preFilledTopic) {
      // If there's a pre-filled topic, we might want to use it
      // For now, we're just logging it to see if it's being passed correctly
      console.log('Pre-filled topic:', preFilledTopic);
    }
  }, [initialData, preFilledTopic]);

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

    // Validate subject selection
    if (!formData.subjectId) {
      newErrors.subjectId = 'Subject is required';
    } else if (safeSubjects.length > 0 && !safeSubjects.some(subject => subject.id === formData.subjectId)) {
      newErrors.subjectId = 'Please select a valid subject';
    } else if (safeSubjects.length === 0) {
      newErrors.subjectId = 'You need to create at least one subject before logging prep sessions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateDate, validateTime, validateNotes, validateResources, safeSubjects]);

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

  const toggleSection = (sectionId: string) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

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

  // Debug: Log subjects to see what's being passed
  useEffect(() => {
    // Removed debugging logs
  }, [subjects]);

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        {/* Organization Section */}
        <FormSection 
          id="organization"
          title="Organization" 
          icon={FolderOpen}
          isActive={activeSection === 'organization'}
          onClick={() => toggleSection('organization')}
        >
          <div className="grid grid-cols-1 gap-4">
            {/* Subject Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-2">
                Subject *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FolderOpen className="h-5 w-5 text-slate-400 dark:text-slate-500 amoled:text-slate-600" />
                </div>
                <select
                  value={formData.subjectId}
                  onChange={(e) => handleInputChange('subjectId', e.target.value)}
                  className="pl-10 w-full rounded-lg border border-slate-300 dark:border-slate-600 amoled:border-slate-700 bg-white/80 dark:bg-dark-card/80 amoled:bg-amoled-card/80 px-4 py-3 text-slate-900 dark:text-dark-text amoled:text-amoled-text shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors backdrop-blur-sm"
                >
                  <option value="">Select a Subject</option>
                  {safeSubjects.length > 0 ? (
                    safeSubjects.map(subject => (
                      <option 
                        key={subject.id} 
                        value={subject.id}
                      >
                        {subject.name || `Unnamed Subject (${subject.id})`}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No subjects available - create one in the subject manager
                    </option>
                  )}
                </select>
                {safeSubjects.length === 0 && (
                  <p className="mt-2 text-sm text-amber-600 dark:text-amber-400 amoled:text-amber-500 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>You need to create at least one subject before logging prep sessions. Use the "Manage Subjects" button in the Prep Dashboard.</span>
                  </p>
                )}
                {touched.subjectId && errors.subjectId && (
                  <p id="subject-error" className="mt-2 text-sm text-red-600 dark:text-red-400 amoled:text-red-500 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{errors.subjectId}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </FormSection>

        {/* Prep Details Section */}
        <FormSection 
          id="details"
          title="Prep Details" 
          icon={Info}
          isActive={activeSection === 'details'}
          onClick={() => toggleSection('details')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  } bg-white/80 dark:bg-dark-card/80 amoled:bg-amoled-card/80 px-4 py-3 text-slate-900 dark:text-dark-text amoled:text-amoled-text shadow-sm focus:outline-none focus:ring-2 transition-colors backdrop-blur-sm`}
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
                  } bg-white/80 dark:bg-dark-card/80 amoled:bg-amoled-card/80 px-4 py-3 text-slate-900 dark:text-dark-text amoled:text-amoled-text shadow-sm focus:outline-none focus:ring-2 transition-colors backdrop-blur-sm`}
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
                  className="pl-10 w-full rounded-lg border border-slate-300 dark:border-slate-600 amoled:border-slate-700 bg-white/80 dark:bg-dark-card/80 amoled:bg-amoled-card/80 px-4 py-3 text-slate-900 dark:text-dark-text amoled:text-amoled-text shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors backdrop-blur-sm"
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
        <FormSection 
          id="confidence"
          title="Confidence Level" 
          icon={Star}
          isActive={activeSection === 'confidence'}
          onClick={() => toggleSection('confidence')}
        >
          <ConfidenceRating 
            confidence={formData.confidence} 
            onConfidenceChange={(value) => handleInputChange('confidence', value)} 
          />
        </FormSection>

        {/* Resources Section */}
        <FormSection 
          id="resources"
          title="Resources" 
          icon={LinkIcon}
          isActive={activeSection === 'resources'}
          onClick={() => toggleSection('resources')}
        >
          <div className="space-y-4">
            {formData.resources.map((resource, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-4 bg-slate-50/50 dark:bg-dark-bg/30 amoled:bg-amoled-bg/30 rounded-lg border border-slate-200 dark:border-dark-border/50 amoled:border-amoled-border/50 backdrop-blur-sm"
              >
                <div className="pt-1">
                  <input
                    type="checkbox"
                    checked={resource.completed}
                    onChange={(e) => handleResourceChange(index, 'completed', e.target.checked)}
                    className="h-5 w-5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-600 amoled:border-slate-700 bg-white/80 dark:bg-dark-card/80 amoled:bg-amoled-card/80 backdrop-blur-sm"
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
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-600 amoled:border-slate-700 bg-white/80 dark:bg-dark-card/80 amoled:bg-amoled-card/80 px-3 py-2 text-slate-900 dark:text-dark-text amoled:text-amoled-text shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <input
                      type="url"
                      placeholder="https://example.com/resource"
                      value={resource.url}
                      onChange={(e) => handleResourceChange(index, 'url', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-600 amoled:border-slate-700 bg-white/80 dark:bg-dark-card/80 amoled:bg-amoled-card/80 px-3 py-2 text-slate-900 dark:text-dark-text amoled:text-amoled-text shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors backdrop-blur-sm"
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
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => removeResource(index)}
                  className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 amoled:hover:text-red-500 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 amoled:hover:bg-red-900/20 transition-colors"
                  aria-label={`Remove resource ${index + 1}`}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </motion.div>
            ))}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={addResource}
            className="mt-4 w-full flex items-center justify-center gap-2 p-3 text-sm font-medium text-indigo-600 dark:text-indigo-400 amoled:text-indigo-500 hover:text-indigo-800 dark:hover:text-indigo-300 amoled:hover:text-indigo-400 rounded-lg border-2 border-dashed border-slate-300 dark:border-dark-border amoled:border-amoled-border hover:border-indigo-300 dark:hover:border-indigo-500/50 amoled:hover:border-indigo-500/30 transition-colors backdrop-blur-sm"
          >
            <Plus className="w-5 h-5" />
            Add Resource
          </motion.button>
          
          {touched.resources && errors.resources && (
            <p className="mt-3 text-sm text-red-600 dark:text-red-400 amoled:text-red-500 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errors.resources}</span>
            </p>
          )}
        </FormSection>

        {/* Reflection Section */}
        <FormSection 
          id="reflection"
          title="Reflection" 
          icon={BookOpen}
          isActive={activeSection === 'reflection'}
          onClick={() => toggleSection('reflection')}
        >
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
              } bg-white/80 dark:bg-dark-card/80 amoled:bg-amoled-card/80 px-4 py-3 text-slate-900 dark:text-dark-text amoled:text-amoled-text shadow-sm focus:outline-none focus:ring-2 transition-colors backdrop-blur-sm`}
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
        </FormSection>
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <motion.button
          ref={cancelButtonRef}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onCancel}
          className="px-6 py-3 text-sm font-medium text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary bg-white/80 dark:bg-dark-card/80 amoled:bg-amoled-card/80 border border-slate-300 dark:border-dark-border amoled:border-amoled-border rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-dark-card/90 amoled:hover:bg-amoled-card/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-dark-bg amoled:focus:ring-offset-amoled-bg transition-colors backdrop-blur-sm"
        >
          Cancel
        </motion.button>
        <motion.button
          ref={submitButtonRef}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={safeSubjects.length === 0}
          className={`px-6 py-3 text-sm font-medium text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-dark-bg amoled:focus:ring-offset-amoled-bg transition-colors ${
            safeSubjects.length === 0
              ? 'bg-slate-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {initialData ? 'Update Entry' : 'Add Entry'}
        </motion.button>
      </div>
    </form>
  );
};

export default PrepForm;
