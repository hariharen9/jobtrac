import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { UserGamificationProfile } from '../../../types';
import SimpleTooltip from '../../../components/shared/SimpleTooltip';

const streakIcons: { [key: string]: React.ReactElement } = {
  appOpen: <LucideIcons.Calendar className="w-6 h-6 text-white" />,
  applications: <LucideIcons.Briefcase className="w-6 h-6 text-white" />,
  prepEntries: <LucideIcons.BookOpen className="w-6 h-6 text-white" />,
  contacts: <LucideIcons.Users className="w-6 h-6 text-white" />,
  companies: <LucideIcons.Building2 className="w-6 h-6 text-white" />,
  stories: <LucideIcons.Star className="w-6 h-6 text-white" />,
};

const streakNames: { [key: string]: string } = {
    appOpen: 'Daily Visit',
    applications: 'Application',
    prepEntries: 'Prep',
    contacts: 'Networking',
    companies: 'Research',
    stories: 'STAR Story',
};

const ProfileStreakDisplay = ({ streaks }: { streaks: UserGamificationProfile['streaks'] }) => {
  const activeStreaks = Object.entries(streaks)
    .map(([key, value]) => ({ name: streakNames[key] || key, ...value, icon: streakIcons[key] || <LucideIcons.Flame className="w-6 h-6 text-white" /> }))
    .filter(s => s.current > 0)
    .sort((a, b) => b.current - a.current);

  if (activeStreaks.length === 0) {
    return <p className="text-xs text-center text-slate-500 dark:text-dark-text-secondary">No active streaks. Open the app tomorrow to start one!</p>;
  }

  return (
    <div className="flex items-center justify-center -space-x-3">
      {activeStreaks.map((streak, index) => (
        <SimpleTooltip key={index} content={`${streak.name} Streak: ${streak.current} day${streak.current > 1 ? 's' : ''}`}>
          <motion.div
            className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-md border-2 border-white dark:border-dark-card cursor-pointer"
            style={{ zIndex: activeStreaks.length - index }}
            whileHover={{ scale: 1.2, y: -8, zIndex: activeStreaks.length + 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {streak.icon}
          </motion.div>
        </SimpleTooltip>
      ))}
    </div>
  );
};

export default ProfileStreakDisplay;
