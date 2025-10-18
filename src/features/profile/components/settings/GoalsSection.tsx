import React, { useState, useEffect, useCallback } from 'react';
import { Application, NetworkingContact, PrepEntry, Goal } from '../../../../types';
import { Target, TrendingUp, Calendar, CheckCircle2, Award, Zap } from 'lucide-react';
import { useFirestore } from '../../../../hooks/useFirestore';
import { useAuth } from '../../../auth/hooks/useAuth';

interface GoalsSectionProps {
  applications: Application[];
  contacts: NetworkingContact[];
  prepEntries: PrepEntry[];
}

const GoalsSection: React.FC<GoalsSectionProps> = ({
  applications,
  contacts,
  prepEntries
}) => {
  const { user } = useAuth();
  const { data: goals, addItem, updateItem } = useFirestore<Goal>('goals', user?.uid || '');

  const [goal, setGoal] = useState<Goal | null>(null);
  const [type, setType] = useState<'weekly' | 'monthly'>('weekly');
  const [applicationsGoal, setApplicationsGoal] = useState(10);
  const [networkingGoal, setNetworkingGoal] = useState(5);
  const [prepGoal, setPrepGoal] = useState(3);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (goals && goals.length > 0) {
      const currentGoal = goals.find(g => g.type === type);
      setGoal(currentGoal || null);
      if (currentGoal) {
        setApplicationsGoal(currentGoal.applications);
        setNetworkingGoal(currentGoal.networking);
        setPrepGoal(currentGoal.prep);
      }
    }
  }, [goals, type]);

  const getProgress = useCallback((activity: 'applications' | 'contacts' | 'prepEntries') => {
    const today = new Date();
    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const startDate = type === 'weekly' ? firstDayOfWeek : firstDayOfMonth;

    switch (activity) {
      case 'applications':
        return applications.filter(item => new Date(item.date) >= startDate).length;
      case 'contacts':
        return contacts.filter(item => new Date(item.date) >= startDate).length;
      case 'prepEntries':
        return prepEntries.filter(item => new Date(item.date) >= startDate).length;
      default:
        return 0;
    }
  }, [type, applications, contacts, prepEntries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const goalData = {
        type,
        applications: applicationsGoal,
        networking: networkingGoal,
        prep: prepGoal
      };

      if (goal) {
        await updateItem(goal.id, goalData);
      } else {
        await addItem(goalData);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const applicationsProgress = getProgress('applications');
  const networkingProgress = getProgress('contacts');
  const prepProgress = getProgress('prepEntries');

  const totalProgress = applicationsGoal + networkingGoal + prepGoal;
  const totalCompleted = applicationsProgress + networkingProgress + prepProgress;
  const overallPercentage = totalProgress > 0 ? Math.round((totalCompleted / totalProgress) * 100) : 0;

  const getProgressColor = (current: number, target: number) => {
    const percentage = target > 0 ? (current / target) * 100 : 0;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-slate-400 dark:bg-slate-600';
  };

  const ProgressBar = ({ current, target, label, icon: Icon }: { current: number; target: number; label: string; icon: any }) => {
    const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;
    const isComplete = current >= target && target > 0;

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-slate-600 dark:text-slate-400 amoled:text-slate-500" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 amoled:text-slate-400">
              {label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text">
              {current} / {target}
            </span>
            {isComplete && (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            )}
          </div>
        </div>
        <div className="relative w-full h-2 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${getProgressColor(current, target)}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-1">
          Goal Setting & Progress
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 amoled:text-slate-500">
          Set targets and track your job search momentum
        </p>
      </div>

      {/* Goal Type Selector */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 amoled:bg-slate-900/30 border border-slate-200 dark:border-slate-700 amoled:border-slate-800">
        <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 amoled:text-slate-400">
          Goal Period:
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setType('weekly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${type === 'weekly'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
              : 'bg-white dark:bg-slate-700 amoled:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:border-indigo-400'
              }`}
          >
            Weekly
          </button>
          <button
            type="button"
            onClick={() => setType('monthly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${type === 'monthly'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
              : 'bg-white dark:bg-slate-700 amoled:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:border-indigo-400'
              }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Overall Progress Card */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 amoled:from-indigo-900/10 amoled:to-blue-900/10 border border-indigo-200 dark:border-indigo-800 amoled:border-indigo-900">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-600">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text">
                Overall Progress
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 amoled:text-slate-500">
                {type === 'weekly' ? 'This Week' : 'This Month'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {overallPercentage}%
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 amoled:text-slate-500">
              {totalCompleted} of {totalProgress}
            </div>
          </div>
        </div>
        <div className="relative w-full h-3 bg-white/50 dark:bg-slate-800/50 amoled:bg-slate-900/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-600 to-blue-600 transition-all duration-500"
            style={{ width: `${overallPercentage}%` }}
          />
        </div>
      </div>

      {/* Goal Setting Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 rounded-xl border-2 border-slate-200 dark:border-slate-700 amoled:border-slate-800 bg-white dark:bg-dark-card amoled:bg-amoled-card">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h4 className="font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text">
              Set Your Targets
            </h4>
          </div>

          <div className="space-y-6">
            {/* Applications Goal */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 amoled:text-slate-400">
                Applications Target
              </label>
              <input
                type="number"
                min="0"
                value={applicationsGoal}
                onChange={(e) => setApplicationsGoal(parseInt(e.target.value, 10) || 0)}
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 amoled:border-slate-800 bg-white dark:bg-dark-card amoled:bg-black text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
              <ProgressBar
                current={applicationsProgress}
                target={applicationsGoal}
                label="Applications Submitted"
                icon={TrendingUp}
              />
            </div>

            {/* Networking Goal */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 amoled:text-slate-400">
                Networking Contacts Target
              </label>
              <input
                type="number"
                min="0"
                value={networkingGoal}
                onChange={(e) => setNetworkingGoal(parseInt(e.target.value, 10) || 0)}
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 amoled:border-slate-800 bg-white dark:bg-dark-card amoled:bg-black text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
              <ProgressBar
                current={networkingProgress}
                target={networkingGoal}
                label="Contacts Made"
                icon={TrendingUp}
              />
            </div>

            {/* Prep Sessions Goal */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 amoled:text-slate-400">
                Prep Sessions Target
              </label>
              <input
                type="number"
                min="0"
                value={prepGoal}
                onChange={(e) => setPrepGoal(parseInt(e.target.value, 10) || 0)}
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 amoled:border-slate-800 bg-white dark:bg-dark-card amoled:bg-black text-slate-900 dark:text-dark-text amoled:text-amoled-text focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
              <ProgressBar
                current={prepProgress}
                target={prepGoal}
                label="Prep Sessions Completed"
                icon={TrendingUp}
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-6 pt-6 border-t-2 border-slate-200 dark:border-slate-700 amoled:border-slate-800">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Save Goals
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Tips Card */}
      <div className="p-5 rounded-xl border border-blue-200 dark:border-blue-800 amoled:border-blue-900 bg-blue-50 dark:bg-blue-900/10 amoled:bg-blue-900/10">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 amoled:text-blue-400" />
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text">
              Goal Setting Tips
            </h4>
            <ul className="text-sm text-slate-600 dark:text-slate-400 amoled:text-slate-500 space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                <span>Set realistic targets based on your schedule and availability</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                <span>Weekly goals help maintain consistent momentum in your search</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                <span>Track progress regularly to identify what strategies work best</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                <span>Celebrate when you hit milestones - you're making progress! 🎉</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalsSection;
