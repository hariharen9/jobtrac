import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Users, Calendar } from 'lucide-react';
import { UserProfile } from '../../../types';
import { toast } from 'react-hot-toast';

interface UserProfileModalProps {
  isOpen: boolean;
  onComplete: (profileData: Omit<UserProfile, 'profileCompleted' | 'profileCompletedAt'>) => Promise<void>;
  onSkip: () => void;
  isSubmitting?: boolean;
}

const AGE_RANGES = ['18-25', '26-35', '36-45', '46-55', '56+'] as const;
const GENDER_OPTIONS = ['Male', 'Female', 'Other', 'Prefer not to say'] as const;

// Comprehensive list of countries for consistent data collection
const COUNTRIES = [
  'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Netherlands', 
  'Sweden', 'Norway', 'Denmark', 'Finland', 'Switzerland', 'Austria', 'Belgium',
  'Australia', 'New Zealand', 'Ireland', 'Israel', 'Singapore', 'Japan', 'South Korea',
  'India', 'China', 'Brazil', 'Mexico', 'Argentina', 'Chile', 'Colombia', 'Peru',
  'South Africa', 'Nigeria', 'Egypt', 'Kenya', 'Morocco', 'Ghana', 'Italy', 'Spain',
  'Portugal', 'Poland', 'Czech Republic', 'Hungary', 'Romania', 'Bulgaria', 'Croatia',
  'Slovenia', 'Slovakia', 'Estonia', 'Latvia', 'Lithuania', 'Russia', 'Ukraine',
  'Turkey', 'Greece', 'Cyprus', 'Malta', 'Luxembourg', 'Iceland', 'UAE', 'Saudi Arabia',
  'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Jordan', 'Lebanon', 'Pakistan', 'Bangladesh',
  'Sri Lanka', 'Nepal', 'Thailand', 'Vietnam', 'Philippines', 'Indonesia', 'Malaysia',
  'Hong Kong', 'Taiwan', 'Macau', 'Myanmar', 'Cambodia', 'Laos', 'Brunei', 'Mongolia',
  'Kazakhstan', 'Uzbekistan', 'Kyrgyzstan', 'Tajikistan', 'Turkmenistan', 'Afghanistan',
  'Iran', 'Iraq', 'Syria', 'Yemen', 'Other'
] as const;

const UserProfileModal: React.FC<UserProfileModalProps> = ({ 
  isOpen, 
  onComplete, 
  onSkip,
  isSubmitting = false 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    ageRange: '' as UserProfile['ageRange'] | '',
    gender: '' as UserProfile['gender'] | '',
    country: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.ageRange) {
      newErrors.ageRange = 'Age range is required';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Gender selection is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔄 Profile form submitted with data:', formData);
    
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      toast.error('Please fill in all required fields');
      return;
    }

    console.log('✅ Form validation passed, calling onComplete...');
    
    try {
      await onComplete({
        name: formData.name.trim(),
        ageRange: formData.ageRange as UserProfile['ageRange'],
        gender: formData.gender as UserProfile['gender'],
        country: formData.country.trim() || undefined
      });
      console.log('✅ Profile submission completed successfully');
    } catch (error) {
      console.error('❌ Error saving profile:', error);
      toast.error('Failed to save profile data. Please try again.');
    }
  };



  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20, rotateX: 2 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10, rotateX: -2 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white/90 dark:bg-dark-card/90 amoled:bg-amoled-card/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md border border-gray-200/50 dark:border-dark-border/50 amoled:border-amoled-border/50 overflow-hidden"
        style={{
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200/30 dark:border-dark-border/30 amoled:border-amoled-border/30 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20 amoled:from-indigo-900/10 amoled:to-purple-900/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div 
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
                style={{
                  boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)'
                }}
              >
                <User className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl font-bold text-slate-900 dark:text-dark-text amoled:text-amoled-text"
                >
                  Welcome to JobTrac! 🎉
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary"
                >
                  Help us personalize your experience
                </motion.p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-gradient-to-b from-white/50 to-white/30 dark:from-dark-card/50 dark:to-dark-card/30 amoled:from-amoled-card/50 amoled:to-amoled-card/30">
          {/* Name Field */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm font-medium text-slate-700 dark:text-dark-text amoled:text-amoled-text mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-white/70 dark:bg-dark-bg/70 amoled:bg-amoled-bg/70 backdrop-blur-sm text-slate-900 dark:text-dark-text amoled:text-amoled-text placeholder-slate-500 dark:placeholder-dark-text-secondary amoled:placeholder-amoled-text-secondary focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 hover:bg-white/80 dark:hover:bg-dark-bg/80 amoled:hover:bg-amoled-bg/80 ${
                  errors.name 
                    ? 'border-red-300 dark:border-red-600 focus:ring-red-500/50' 
                    : 'border-slate-300/50 dark:border-dark-border/50 amoled:border-amoled-border/50'
                }`}
                placeholder="Enter your name"
                disabled={isSubmitting}
                style={{
                  backdropFilter: 'blur(10px)'
                }}
              />
            </div>
            {errors.name && (
              <motion.p 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-2 text-xs text-red-600 dark:text-red-400 flex items-center gap-1"
              >
                <span className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0"></span>
                {errors.name}
              </motion.p>
            )}
          </motion.div>

          {/* Age Range Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-dark-text amoled:text-amoled-text mb-2">
              Age Range <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={formData.ageRange}
                onChange={(e) => handleInputChange('ageRange', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-white dark:bg-dark-bg amoled:bg-amoled-bg text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                  errors.ageRange 
                    ? 'border-red-300 dark:border-red-600' 
                    : 'border-slate-300 dark:border-dark-border amoled:border-amoled-border'
                }`}
                disabled={isSubmitting}
              >
                <option value="">Select age range</option>
                {AGE_RANGES.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>
            {errors.ageRange && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.ageRange}</p>
            )}
          </div>

          {/* Gender Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-dark-text amoled:text-amoled-text mb-2">
              Gender <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-white dark:bg-dark-bg amoled:bg-amoled-bg text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                  errors.gender 
                    ? 'border-red-300 dark:border-red-600' 
                    : 'border-slate-300 dark:border-dark-border amoled:border-amoled-border'
                }`}
                disabled={isSubmitting}
              >
                <option value="">Select gender</option>
                {GENDER_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            {errors.gender && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.gender}</p>
            )}
          </div>

          {/* Country Field (Optional) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-dark-text amoled:text-amoled-text mb-2">
              Country <span className="text-xs text-slate-500 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">(optional)</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-dark-border amoled:border-amoled-border rounded-lg bg-white dark:bg-dark-bg amoled:bg-amoled-bg text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                disabled={isSubmitting}
              >
                <option value="">Select your country</option>
                {COUNTRIES.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 amoled:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800 amoled:border-blue-800">
            <p className="text-xs text-blue-700 dark:text-blue-300 amoled:text-blue-300">
              🔒 Your data helps us improve JobTrac and provide analytics insights. All information is stored securely and never shared with third parties.
            </p>
          </div>



          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col gap-4 pt-4"
          >
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:hover:shadow-lg overflow-hidden group"
              style={{
                boxShadow: isSubmitting ? '0 4px 15px rgba(0,0,0,0.2)' : '0 10px 25px -5px rgba(99, 102, 241, 0.4), 0 8px 10px -6px rgba(99, 102, 241, 0.3)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Setting up your profile...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Setup</span>
                    <motion.div
                      initial={{ x: 0 }}
                      animate={{ x: [0, 4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    >
                      ✨
                    </motion.div>
                  </>
                )}
              </div>
            </motion.button>
            
            <motion.button
              type="button"
              onClick={onSkip}
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="text-xs text-slate-500 dark:text-dark-text-secondary amoled:text-amoled-text-secondary hover:text-slate-700 dark:hover:text-dark-text amoled:hover:text-amoled-text transition-all duration-300 underline decoration-dotted underline-offset-2 hover:decoration-solid py-2"
            >
              Skip for now
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default UserProfileModal;