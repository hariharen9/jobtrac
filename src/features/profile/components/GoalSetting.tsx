import React, { useState, useEffect, useCallback } from 'react';
import Confetti from 'react-confetti';
import { useFirestore } from '../../../hooks/useFirestore';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import { Goal, Application, NetworkingContact, PrepEntry } from '../../../types';

const GoalSetting = ({ applications, contacts, prepEntries }: { applications: Application[], contacts: NetworkingContact[], prepEntries: PrepEntry[] }) => {
  const { user } = useAuth();
  const { data: goals, addItem, updateItem } = useFirestore<Goal>('goals', user?.uid);
  
  const [goal, setGoal] = useState<Goal | null>(null);
  const [type, setType] = useState<'weekly' | 'monthly'>('weekly');
  const [applicationsGoal, setApplicationsGoal] = useState(0);
  const [networkingGoal, setNetworkingGoal] = useState(0);
  const [prepGoal, setPrepGoal] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (goals && goals.length > 0) {
      const currentGoal = goals.find(g => g.type === type);
      setGoal(currentGoal || null);
      if (currentGoal) {
        setApplicationsGoal(currentGoal.applications);
        setNetworkingGoal(currentGoal.networking);
        setPrepGoal(currentGoal.prep);
      } else {
        setApplicationsGoal(0);
        setNetworkingGoal(0);
        setPrepGoal(0);
      }
    } else {
      setGoal(null);
    }
  }, [goals, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const goalData = { type, applications: applicationsGoal, networking: networkingGoal, prep: prepGoal };
    if (goal) {
      await updateItem(goal.id, goalData);
    } else {
      await addItem(goalData);
    }
    alert('Goal saved!');
  };

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

  const checkGoalCompletion = useCallback(() => {
    if (!goal) return;

    const applicationsProgress = getProgress('applications');
    const networkingProgress = getProgress('contacts');
    const prepProgress = getProgress('prepEntries');

    if (
      applicationsProgress >= goal.applications &&
      networkingProgress >= goal.networking &&
      prepProgress >= goal.prep
    ) {
      setShowConfetti(true);
    }
  }, [goal, getProgress]);

  useEffect(() => {
    checkGoalCompletion();
  }, [applications, contacts, prepEntries, goal, checkGoalCompletion]);

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const Progress = ({ value, max }: { value: number, max: number }) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${(value / max) * 100}%` }}></div>
    </div>
  );

  return (
    <div className="p-4 border-2 border-dashed rounded-lg border-slate-300 dark:border-slate-600">
      {showConfetti && <Confetti />}
      <form onSubmit={handleSubmit}>
        <div className="flex items-center mb-4">
          <label className="mr-4 font-medium">Goal Type:</label>
          <select value={type} onChange={(e) => setType(e.target.value as 'weekly' | 'monthly')} className="px-2 py-1 border rounded-md dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600">
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block mb-1 font-medium">Applications</label>
            <input type="number" value={applicationsGoal} onChange={(e) => setApplicationsGoal(parseInt(e.target.value, 10))} className="w-full px-2 py-1 border rounded-md dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600" />
            <Progress value={getProgress('applications')} max={applicationsGoal} />
          </div>
          <div>
            <label className="block mb-1 font-medium">Networking Contacts</label>
            <input type="number" value={networkingGoal} onChange={(e) => setNetworkingGoal(parseInt(e.target.value, 10))} className="w-full px-2 py-1 border rounded-md dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600" />
            <Progress value={getProgress('contacts')} max={networkingGoal} />
          </div>
          <div>
            <label className="block mb-1 font-medium">Prep Sessions</label>
            <input type="number" value={prepGoal} onChange={(e) => setPrepGoal(parseInt(e.target.value, 10))} className="w-full px-2 py-1 border rounded-md dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600" />
            <Progress value={getProgress('prepEntries')} max={prepGoal} />
          </div>
        </div>
        <div className="mt-4 text-right">
          <button type="submit" className="px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Save Goal</button>
        </div>
      </form>
    </div>
  );
};

export default GoalSetting;