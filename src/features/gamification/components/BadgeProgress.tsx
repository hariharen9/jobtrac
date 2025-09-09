import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Badge, UserGamificationProfile } from '../../../types';
import { allBadges, badgeTriggers } from '../../../data/badges';

const BadgeIcon = ({ name, className }: { name: string; className?: string }) => {
  const Icon = (LucideIcons as any)[name];
  return Icon ? <Icon className={className} /> : <LucideIcons.Award className={className} />;
};

const BadgeCard = ({ badge, profile }: { badge: Badge; profile: UserGamificationProfile | null }) => {
  const getBadgeProgress = () => {
    if (!profile) return { earned: false, current: 0, target: 1 };
    const earnedBadge = profile.badges.find(b => b.badgeId === badge.id);
    if (earnedBadge) return { earned: true, current: 0, target: 0 };

    for (const key in badgeTriggers) {
      const triggerKey = key as keyof typeof badgeTriggers;
      const trigger = badgeTriggers[triggerKey].find(t => t.badgeId === badge.id);
      if (trigger) {
        return { earned: false, current: profile.progress[triggerKey] || 0, target: trigger.progress };
      }
    }
    return { earned: false, current: 0, target: 1 };
  };

  const { earned, current, target } = getBadgeProgress();
  const progressPercent = target > 0 ? (current / target) * 100 : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`relative p-6 rounded-2xl overflow-hidden border ${earned ? 'border-cyan-400/50' : 'border-white/10'}`}
    >
      <div className={`absolute inset-0 bg-white/5 backdrop-blur-xl ${earned ? 'opacity-10' : 'opacity-5'}`}></div>
      {earned && <motion.div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-transparent" />}
      
      <div className="relative z-10 flex flex-col items-center text-center h-full">
        <motion.div 
          className={`w-24 h-24 rounded-full flex items-center justify-center border-2 ${earned ? 'border-cyan-400' : 'border-gray-600'} bg-gray-800/50`}
          whileHover={{ scale: 1.1 }}
        >
          <BadgeIcon name={badge.icon} className={`w-12 h-12 transition-colors duration-300 ${earned ? badge.color : 'text-gray-500'}`} />
        </motion.div>
        <h3 className={`mt-4 text-lg font-bold ${earned ? 'text-white' : 'text-gray-400'}`}>{badge.name}</h3>
        <p className="text-sm text-gray-400 mt-1 flex-grow">{badge.description}</p>
        
        {!earned ? (
          <div className="w-full mt-4">
            <div className="w-full bg-black/20 rounded-full h-2.5">
              <motion.div 
                className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: 'easeInOut' }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1.5">{current} / {target}</p>
          </div>
        ) : (
          <div className="w-full mt-4">
            <p className="text-sm font-semibold text-cyan-400">Unlocked!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const FilterButton = ({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) => (
    <button onClick={onClick} className="relative px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
        {label}
        {isActive && <motion.div layoutId="filter-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />}
    </button>
);

const BadgeProgress = ({ profile }: { profile: UserGamificationProfile | null }) => {
  const [filter, setFilter] = useState('all');

  const filteredBadges = allBadges.filter(badge => {
    if (filter === 'all') return true;
    const earned = profile?.badges.some(b => b.badgeId === badge.id);
    return filter === 'earned' ? earned : !earned;
  });

  return (
    <div>
        <div className="flex justify-center items-center mb-8 bg-white/5 rounded-full border border-white/10 backdrop-blur-md w-fit mx-auto">
            <FilterButton label="All" isActive={filter === 'all'} onClick={() => setFilter('all')} />
            <FilterButton label="Earned" isActive={filter === 'earned'} onClick={() => setFilter('earned')} />
            <FilterButton label="In Progress" isActive={filter === 'in_progress'} onClick={() => setFilter('in_progress')} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence>
                {filteredBadges.map(badge => <BadgeCard key={badge.id} badge={badge} profile={profile} />)}
            </AnimatePresence>
        </div>
    </div>
  );
};

export default BadgeProgress;