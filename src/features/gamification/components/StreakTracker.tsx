import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { UserGamificationProfile } from '../../../types';
import SimpleTooltip from '../../../components/shared/SimpleTooltip';

const streakIcons: { [key: string]: React.ReactElement } = {
  appOpen: <LucideIcons.CalendarCheck className="w-8 h-8" />,
  applications: <LucideIcons.Briefcase className="w-8 h-8" />,
  prepEntries: <LucideIcons.BookOpen className="w-8 h-8" />,
  contacts: <LucideIcons.Users className="w-8 h-8" />,
  companies: <LucideIcons.Building2 className="w-8 h-8" />,
  stories: <LucideIcons.Star className="w-8 h-8" />,
};

const streakNames: { [key: string]: string } = {
  appOpen: 'Daily Visit',
  applications: 'Application',
  prepEntries: 'Prep',
  contacts: 'Networking',
  companies: 'Research',
  stories: 'STAR Story',
};

const Path = (props: any) => (
  <motion.path
    fill="none"
    strokeWidth="4"
    stroke="rgba(255, 255, 255, 0.1)"
    strokeLinecap="round"
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    transition={{ duration: 2, ease: "easeInOut" }}
    {...props}
  />
);

const StreakTracker = ({ streaks }: { streaks: UserGamificationProfile['streaks'] }) => {
  const activeStreaks = Object.entries(streaks)
    .map(([key, value]) => ({ id: key, name: streakNames[key] || key, ...value, icon: streakIcons[key] || <LucideIcons.Flame className="w-8 h-8" /> }))
    .filter(s => s.current > 0)
    .sort((a, b) => b.current - a.current);

  if (activeStreaks.length === 0) {
    return (
      <div className="text-center p-12 bg-white/5 rounded-2xl border border-dashed border-white/20">
        <h3 className="text-2xl font-bold text-white">No Active Streaks</h3>
        <p className="text-white/60 mt-2">Open the app tomorrow or complete an activity to start a new streak!</p>
      </div>
    );
  }

  return (
    <div className="relative w-full flex items-center justify-center p-10">
      <svg width="100%" height="100" viewBox="0 0 1000 100" preserveAspectRatio="none" className="absolute top-0 left-0">
        <Path d="M 0 50 Q 125 0, 250 50 T 500 50 T 750 50 T 1000 50" />
      </svg>
      <div className="relative w-full flex justify-around">
        {activeStreaks.map((streak, index) => (
          <SimpleTooltip key={streak.id} content={`Longest: ${streak.longest} day${streak.longest > 1 ? 's' : ''}`}>
            <motion.div
              className="flex flex-col items-center text-center cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.2 }}
              whileHover={{ scale: 1.1 }}
            >
              <motion.div 
                className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center border-2 border-cyan-400/50 shadow-lg backdrop-blur-md"
                whileHover={{ boxShadow: '0px 0px 25px rgba(0, 255, 255, 0.5)' }}
              >
                {streak.icon}
              </motion.div>
              <p className="mt-4 font-semibold text-lg">{streak.name}</p>
              <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-400">{streak.current}</p>
              <p className="text-sm text-white/60">Day Streak</p>
            </motion.div>
          </SimpleTooltip>
        ))}
      </div>
    </div>
  );
};

export default StreakTracker;