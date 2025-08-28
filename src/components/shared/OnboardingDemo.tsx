import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Target, Play } from 'lucide-react';
import WelcomeWizard from './WelcomeWizard';
import QuickStartChecklist from './QuickStartChecklist';
import { defaultQuickStartTasks } from '../../data/initialData';
import { TabType } from '../../types';

interface OnboardingDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

const OnboardingDemo: React.FC<OnboardingDemoProps> = ({ isOpen, onClose }) => {
  const [currentDemo, setCurrentDemo] = useState<'menu' | 'wizard' | 'checklist'>('menu');
  const [tasks, setTasks] = useState(defaultQuickStartTasks);

  const handleTaskComplete = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: true } : task
    ));
  };

  const handleTaskClick = (taskId: string, feature: TabType) => {
    console.log('Task clicked:', taskId, 'Feature:', feature);
    handleTaskComplete(taskId);
  };

  const getProgressPercentage = () => {
    const completedTasks = tasks.filter(task => task.completed).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  if (!isOpen) return null;

  if (currentDemo === 'wizard') {
    return (
      <WelcomeWizard
        onComplete={() => setCurrentDemo('checklist')}
        onEnableDemoMode={() => console.log('Demo mode enabled')}
        onClose={() => setCurrentDemo('menu')}
      />
    );
  }

  if (currentDemo === 'checklist') {
    return (
      <QuickStartChecklist
        tasks={tasks}
        onTaskClick={handleTaskClick}
        onComplete={handleTaskComplete}
        onClose={() => setCurrentDemo('menu')}
        isOpen={true}
        progressPercentage={getProgressPercentage()}
        demoMode={true}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-8"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Onboarding System Demo</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Experience the new user onboarding features
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setCurrentDemo('wizard')}
            className="w-full p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <Play className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <div>
                <h3 className="font-semibold">Welcome Wizard</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Multi-step introduction flow for new users
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setCurrentDemo('checklist')}
            className="w-full p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
              <div>
                <h3 className="font-semibold">Quick Start Checklist</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Interactive task list with progress tracking
                </p>
              </div>
            </div>
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Close Demo
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingDemo;