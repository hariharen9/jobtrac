import React from 'react';
import { Application, NetworkingContact, PrepEntry } from '../../../../types';
import { Target } from 'lucide-react';
import GoalSetting from '../GoalSetting';

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
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-1">
          Goal Setting
        </h3>
        <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
          Set and track your weekly or monthly targets
        </p>
      </div>

      {/* Goal Setting Component */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border bg-white dark:bg-dark-card amoled:bg-amoled-card">
        <GoalSetting 
          applications={applications}
          contacts={contacts}
          prepEntries={prepEntries}
        />
      </div>

      {/* Tips Card */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border bg-blue-50 dark:bg-blue-900/10 amoled:bg-blue-900/10">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <Target className="w-5 h-5 text-blue-600 dark:text-blue-400 amoled:text-blue-400" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-1">
              Goal Setting Tips
            </h4>
            <ul className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary space-y-1">
              <li>• Set realistic, achievable targets based on your schedule</li>
              <li>• Weekly goals help maintain consistent momentum</li>
              <li>• Track progress to identify what's working</li>
              <li>• Celebrate when you hit your milestones! 🎉</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalsSection;
