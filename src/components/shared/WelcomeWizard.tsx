import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  BookOpen, 
  Building, 
  Users, 
  Star, 
  BarChart3, 
  Target, 
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Rocket,
  Database,
  Play
} from 'lucide-react';
import { AnalyticsService } from '../../services/analyticsService';
import { useAuth } from '../../features/auth/hooks/useAuth';

interface WelcomeWizardProps {
  onComplete: () => void;
  onEnableDemoMode: () => void;
  onClose: () => void;
}

const WelcomeWizard: React.FC<WelcomeWizardProps> = ({
  onComplete,
  onEnableDemoMode,
  onClose
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMode, setSelectedMode] = useState<'demo' | 'fresh' | null>(null);
  const { user } = useAuth();

  // Track onboarding started when component mounts
  useEffect(() => {
    if (user?.uid) {
      AnalyticsService.trackEvent('onboarding_started', user.uid);
    }
  }, [user]);

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to JobTrac',
      subtitle: 'Your Complete Job Search Command Center',
      content: (
        <div className="text-center">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Rocket className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 animate-pulse" />
              </div>
            </div>
          </div>
          <p className="text-base sm:text-lg text-gray-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-3 sm:mb-4">
            Transform your job search from chaos to strategy
          </p>
          <p className="text-sm sm:text-base text-gray-500 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
            JobTrac replaces scattered spreadsheets with a unified platform that helps you 
            land your dream job faster and with more confidence.
          </p>
        </div>
      )
    },
    {
      id: 'features',
      title: 'Everything You Need in One Place',
      subtitle: 'Six Powerful Features to Supercharge Your Job Search',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[
            {
              icon: Briefcase,
              title: 'Application Tracker',
              description: 'Kanban board to visualize your pipeline'
            },
            {
              icon: BookOpen,
              title: 'Interview Prep',
              description: 'Track study sessions and confidence'
            },
            {
              icon: Star,
              title: 'STAR Stories',
              description: 'Behavioral interview answers'
            },
            {
              icon: Building,
              title: 'Company Research',
              description: 'Organize insights and culture notes'
            },
            {
              icon: Users,
              title: 'Networking Hub',
              description: 'Manage contacts and referrals'
            },
            {
              icon: BarChart3,
              title: 'Analytics',
              description: 'Track progress and success metrics'
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 dark:bg-dark-bg/50 amoled:bg-amoled-bg/50 p-3 sm:p-4 rounded-lg text-center"
            >
              <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-xs sm:text-sm mb-1 text-slate-900 dark:text-dark-text amoled:text-amoled-text">{feature.title}</h3>
              <p className="text-xs text-gray-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      )
    },
    {
      id: 'demo-choice',
      title: 'How Would You Like to Start?',
      subtitle: 'Choose your onboarding experience',
      content: (
        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedMode('demo')}
            className={`w-full p-6 rounded-xl border-2 transition-all ${
              selectedMode === 'demo'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 amoled:bg-blue-900/20'
                : 'border-gray-200 dark:border-dark-border amoled:border-amoled-border hover:border-gray-300 dark:hover:border-gray-600 amoled:hover:border-gray-600'
            }`}
          >
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2 text-slate-900 dark:text-dark-text amoled:text-amoled-text">Try with Sample Data</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-2 sm:mb-3">
                  See JobTrac in action with realistic sample applications, prep sessions, and STAR stories. 
                  Perfect for understanding the value immediately.
                </p>
                <div className="flex items-center text-xs sm:text-sm text-green-600 dark:text-green-400">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Recommended for first-time users
                </div>
              </div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedMode('fresh')}
            className={`w-full p-6 rounded-xl border-2 transition-all ${
              selectedMode === 'fresh'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 amoled:bg-blue-900/20'
                : 'border-gray-200 dark:border-dark-border amoled:border-amoled-border hover:border-gray-300 dark:hover:border-gray-600 amoled:hover:border-gray-600'
            }`}
          >
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2 text-slate-900 dark:text-dark-text amoled:text-amoled-text">Start Fresh</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-2 sm:mb-3">
                  Begin with a clean slate and add your own data step-by-step. 
                  You'll be guided through each feature as you go.
                </p>
                <div className="flex items-center text-xs sm:text-sm text-purple-600 dark:text-purple-400">
                  <Database className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  For users ready to add their own data
                </div>
              </div>
            </div>
          </motion.button>
        </div>
      )
    },
    {
      id: 'quick-start',
      title: 'Your Quick Start Checklist',
      subtitle: 'Complete these tasks to get the most value from JobTrac',
      content: (
        <div className="space-y-4">
          <p className="text-sm sm:text-base text-gray-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-4 sm:mb-6">
            {selectedMode === 'demo' 
              ? 'Explore the sample data and try these actions to familiarize yourself with JobTrac:'
              : 'Complete these quick tasks to set up your job search command center:'
            }
          </p>
          
          {[
            {
              icon: Briefcase,
              title: 'Add Your First Application',
              description: selectedMode === 'demo' 
                ? 'Browse the sample applications and try adding a new one'
                : 'Track your first job application',
              time: '2 min'
            },
            {
              icon: Target,
              title: 'Set Weekly Goals',
              description: 'Define your targets for applications and prep time',
              time: '1 min'
            },
            {
              icon: BookOpen,
              title: 'Log a Prep Session',
              description: selectedMode === 'demo'
                ? 'Check out sample prep sessions and add your own'
                : 'Track your interview preparation',
              time: '2 min'
            },
            {
              icon: Star,
              title: 'Write a STAR Story',
              description: selectedMode === 'demo'
                ? 'Review sample behavioral stories and create one'
                : 'Prepare behavioral interview answers',
              time: '5 min'
            }
          ].map((task, index) => (
            <motion.div
              key={task.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 dark:bg-dark-bg/50 amoled:bg-amoled-bg/50 rounded-lg"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900 amoled:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <task.icon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 amoled:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm sm:text-base text-slate-900 dark:text-dark-text amoled:text-amoled-text">{task.title}</h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">{task.description}</p>
              </div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-dark-text-secondary amoled:text-amoled-text-secondary font-medium flex-shrink-0">
                {task.time}
              </div>
            </motion.div>
          ))}
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      // Track step completion
      if (user?.uid) {
        const stepName = steps[currentStep].id;
        AnalyticsService.trackEvent('onboarding_step_completed', user.uid, { step_name: stepName });
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    if (user?.uid) {
      // Track welcome wizard completion
      AnalyticsService.trackEvent('onboarding_step_completed', user.uid, { step_name: 'welcome_wizard_finished' });
      
      if (selectedMode === 'demo') {
        // Track demo mode enablement
        AnalyticsService.trackEvent('demo_mode_enabled', user.uid);
        onEnableDemoMode();
      }
    }
    onComplete();
  };

  const canProceed = currentStep !== 2 || selectedMode !== null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-3 sm:p-6 border-b border-gray-200 dark:border-dark-border amoled:border-amoled-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex space-x-1 sm:space-x-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
                      index <= currentStep
                        ? 'bg-blue-600'
                        : 'bg-gray-300 dark:bg-gray-600 amoled:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-dark-text amoled:hover:text-amoled-text text-xl sm:text-2xl p-1"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-4 sm:mb-8">
                  <h1 className="text-xl sm:text-3xl font-bold mb-2 text-slate-900 dark:text-dark-text amoled:text-amoled-text">{currentStepData.title}</h1>
                  <p className="text-sm sm:text-lg text-gray-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                    {currentStepData.subtitle}
                  </p>
                </div>
                
                <div className="min-h-[200px] sm:min-h-[300px] flex items-center">
                  {currentStepData.content}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-6 border-t border-gray-200 dark:border-dark-border amoled:border-amoled-border flex items-center justify-between flex-shrink-0">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base text-gray-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary hover:text-gray-800 dark:hover:text-dark-text amoled:hover:text-amoled-text disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center space-x-3">
            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!canProceed}
                className="flex items-center space-x-2 px-4 py-2 sm:px-6 sm:py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
              >
                <span>Next</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={!canProceed}
                className="flex items-center space-x-2 px-4 py-2 sm:px-6 sm:py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
              >
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Get Started</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomeWizard;