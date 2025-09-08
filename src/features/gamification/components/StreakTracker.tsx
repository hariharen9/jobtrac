import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Briefcase, BookOpen, Users, Building, Star, Calendar } from 'lucide-react';
import { UserGamificationProfile } from '../../../types';
import SimpleTooltip from '../../../components/shared/SimpleTooltip';

const streakIcons: { [key: string]: React.ReactElement } = {
  appOpen: <Calendar className="w-5 h-5" />,
  applications: <Briefcase className="w-5 h-5" />,
  prepEntries: <BookOpen className="w-5 h-5" />,
  contacts: <Users className="w-5 h-5" />,
  companies: <Building className="w-5 h-5" />,
  stories: <Star className="w-5 h-5" />,
};

const streakNames: { [key: string]: string } = {
    appOpen: 'Daily Visits',
    applications: 'Application Streak',
    prepEntries: 'Prep Streak',
    contacts: 'Networking Streak',
    companies: 'Research Streak',
    stories: 'STAR Story Streak',
};

const StreakTracker = ({ streaks }: { streaks: UserGamificationProfile['streaks'] }) => {
  const streakItems = Object.keys(streaks).map(key => ({
    name: streakNames[key] || key,
    ...streaks[key],
    icon: streakIcons[key] || <Flame className="w-5 h-5" />,
  }));

  if (streakItems.length === 0) {
    return (
        <div className="text-center p-8 bg-slate-100 dark:bg-dark-card rounded-lg">
            <p className="text-slate-500 dark:text-dark-text-secondary">No streaks started yet. Perform an activity to start a streak!</p>
        </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {streakItems.map((streak, index) => (
        <SimpleTooltip key={index} content={`Longest streak: ${streak.longest} days`}>
            <motion.div 
                className="bg-white dark:bg-dark-card p-4 rounded-lg border border-slate-200 dark:border-dark-border"
                whileHover={{ y: -5 }}
            >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                {streak.icon}
                <h3 className="font-medium text-slate-900 dark:text-dark-text">{streak.name}</h3>
                </div>
                <div className="flex items-center gap-1 text-orange-500">
                <Flame className="w-5 h-5" />
                <span className="font-bold text-lg">{streak.current}</span>
                </div>
            </div>
            <div className="mt-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                <motion.div 
                className="bg-gradient-to-r from-orange-400 to-red-500 h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(streak.current / (streak.longest || 1)) * 100}%` }}
                />
            </div>
            </motion.div>
        </SimpleTooltip>
      ))}
    </div>
  );
};

export default StreakTracker;
