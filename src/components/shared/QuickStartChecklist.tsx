import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  Circle, 
  Briefcase, 
  BookOpen, 
  Building, 
  Users, 
  Star, 
  Target,
  Trophy,
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { QuickStartTask, TabType } from '../../types';

interface QuickStartChecklistProps {
  tasks: QuickStartTask[];
  onTaskClick: (taskId: string, feature: TabType) => void;
  onComplete: (taskId: string) => void;
  onClose: () => void;
  isOpen: boolean;
  progressPercentage: number;
  demoMode?: boolean;
}

const iconMap = {
  'Briefcase': Briefcase,
  'BookOpen': BookOpen,
  'Building': Building,
  'Users': Users,
  'Star': Star,
  'Target': Target,
  'Trophy': Trophy,
  'Sparkles': Sparkles
};

const QuickStartChecklist: React.FC<QuickStartChecklistProps> = ({
  tasks,
  onTaskClick,
  onComplete,
  onClose,
  isOpen,
  progressPercentage,
  demoMode = false
}) => {
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const isAllComplete = completedTasks === totalTasks;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="fixed bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-auto sm:w-96 max-w-[calc(100vw-1rem)] sm:max-w-[calc(100vw-2rem)] bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 dark:border-dark-border amoled:border-amoled-border overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-dark-border amoled:border-amoled-border">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  {isAllComplete ? (
                    <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  ) : (
                    <Target className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-base sm:text-lg text-slate-900 dark:text-dark-text amoled:text-amoled-text truncate">
                    {isAllComplete ? 'Congratulations! 🎉' : 'Quick Start Checklist'}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary truncate">
                    {isAllComplete 
                      ? 'You\'ve completed all tasks!' 
                      : `${completedTasks} of ${totalTasks} completed`
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-dark-text amoled:hover:text-amoled-text p-1 flex-shrink-0 ml-2"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="relative">
              <div className="w-full bg-gray-200 dark:bg-dark-border amoled:bg-amoled-border rounded-full h-2 sm:h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-2 sm:h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full relative overflow-hidden"
                >
                  {isAllComplete && (
                    <motion.div
                      initial={{ x: '-100%' }}
                      animate={{ x: '200%' }}
                      transition={{ 
                        duration: 1.5, 
                        ease: 'linear',
                        repeat: Infinity,
                        repeatDelay: 2
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    />
                  )}
                </motion.div>
              </div>
              <div className="flex justify-between mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                <span>{progressPercentage}% complete</span>
                {demoMode && (
                  <span className="bg-green-100 dark:bg-green-900 amoled:bg-green-900 text-green-800 dark:text-green-200 amoled:text-green-200 px-1.5 sm:px-2 py-0.5 rounded text-xs font-medium">
                    Demo Mode
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Tasks */}
          <div className="p-3 sm:p-4 max-h-80 sm:max-h-96 overflow-y-auto">
            {isAllComplete ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-6 sm:py-8"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h4 className="text-base sm:text-lg font-semibold mb-2 text-slate-900 dark:text-dark-text amoled:text-amoled-text">Amazing Work!</h4>
                <p className="text-sm sm:text-base text-gray-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-4 sm:mb-6 px-2">
                  You've completed your quick start checklist. JobTrac is now set up and ready 
                  to help you land your dream job!
                </p>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-center text-xs sm:text-sm text-green-600 dark:text-green-400 amoled:text-green-400">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Your job search command center is ready
                  </div>
                  <div className="text-xs text-gray-500 dark:text-dark-text-secondary amoled:text-amoled-text-secondary px-2">
                    Continue using JobTrac to track your progress and stay organized
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {tasks.map((task, index) => {
                  const IconComponent = iconMap[task.icon as keyof typeof iconMap] || Target;
                  
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-start space-x-2 sm:space-x-3 p-2.5 sm:p-3 rounded-lg border transition-all cursor-pointer ${
                        task.completed
                          ? 'bg-green-50 dark:bg-green-900/20 amoled:bg-green-900/20 border-green-200 dark:border-green-800 amoled:border-green-800'
                          : 'bg-gray-50 dark:bg-dark-bg/50 amoled:bg-amoled-bg/50 border-gray-200 dark:border-dark-border amoled:border-amoled-border hover:bg-gray-100 dark:hover:bg-dark-bg/70 amoled:hover:bg-amoled-bg/70'
                      }`}
                      onClick={() => {
                        if (!task.completed) {
                          onTaskClick(task.id, task.feature);
                        }
                      }}
                    >
                      <div className="flex-shrink-0 pt-0.5">
                        {task.completed ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          >
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400 amoled:text-green-400" />
                          </motion.div>
                        ) : (
                          <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-dark-text-secondary amoled:text-amoled-text-secondary" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-medium text-xs sm:text-sm truncate pr-2 ${
                            task.completed 
                              ? 'text-green-800 dark:text-green-200 amoled:text-green-200 line-through' 
                              : 'text-gray-900 dark:text-dark-text amoled:text-amoled-text'
                          }`}>
                            {task.title}
                          </h4>
                          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                            <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center ${
                              task.completed
                                ? 'bg-green-100 dark:bg-green-800 amoled:bg-green-800'
                                : 'bg-blue-100 dark:bg-blue-900 amoled:bg-blue-900'
                            }`}>
                              <IconComponent className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                                task.completed
                                  ? 'text-green-600 dark:text-green-400 amoled:text-green-400'
                                  : 'text-blue-600 dark:text-blue-400 amoled:text-blue-400'
                              }`} />
                            </div>
                            {!task.completed && (
                              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                            )}
                          </div>
                        </div>
                        <p className={`text-xs mt-1 ${
                          task.completed
                            ? 'text-green-600 dark:text-green-400 amoled:text-green-400'
                            : 'text-gray-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary'
                        }`}>
                          {task.description}
                        </p>
                        {!task.completed && (
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 mt-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onTaskClick(task.id, task.feature);
                              }}
                              className="inline-flex items-center text-xs text-blue-600 dark:text-blue-400 amoled:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 amoled:hover:text-blue-300 font-medium"
                            >
                              {task.actionText}
                              <ArrowRight className="w-3 h-3 ml-1" />
                            </button>
                            <span className="text-gray-400 text-xs hidden sm:inline">or</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onComplete(task.id);
                              }}
                              className="inline-flex items-center text-xs text-green-600 dark:text-green-400 amoled:text-green-400 hover:text-green-800 dark:hover:text-green-300 amoled:hover:text-green-300 font-medium"
                            >
                              Mark Complete
                              <CheckCircle className="w-3 h-3 ml-1" />
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {!isAllComplete && (
            <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-dark-border amoled:border-amoled-border bg-gray-50 dark:bg-dark-bg/50 amoled:bg-amoled-bg/50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs sm:text-sm gap-2 sm:gap-0">
                <div className="text-gray-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                  Complete these tasks to get the most from JobTrac
                </div>
                <button
                  onClick={onClose}
                  className="text-blue-600 dark:text-blue-400 amoled:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 amoled:hover:text-blue-300 font-medium"
                >
                  Maybe later
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuickStartChecklist;