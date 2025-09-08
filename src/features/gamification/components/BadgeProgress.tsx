import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Badge, UserGamificationProfile } from '../../../types';
import { allBadges, badgeTriggers } from '../../../data/badges';
import SimpleTooltip from '../../../components/shared/SimpleTooltip';

const BadgeIcon = ({ name, className }: { name: string; className?: string }) => {
  const Icon = (LucideIcons as any)[name];
  return Icon ? <Icon className={className} /> : <LucideIcons.Award className={className} />;
};

const BadgeProgress = ({ profile }: { profile: UserGamificationProfile | null }) => {
  if (!profile) {
    return <div>Loading profile...</div>;
  }

  const getBadgeProgress = (badge: Badge) => {
    const earnedBadge = profile.badges.find(b => b.badgeId === badge.id);
    if (earnedBadge) {
      return { earned: true, current: 0, target: 0 };
    }

    let progress = { current: 0, target: 1 }; // Default target is 1

    for (const key in badgeTriggers) {
        const triggerKey = key as keyof typeof badgeTriggers;
        const trigger = badgeTriggers[triggerKey].find(t => t.badgeId === badge.id);
        if (trigger) {
            progress.target = trigger.progress;
            progress.current = profile.progress[triggerKey] || 0;
            break;
        }
    }
    
    return { earned: false, ...progress };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {allBadges.map(badge => {
        const { earned, current, target } = getBadgeProgress(badge);
        const progressPercent = target > 0 ? (current / target) * 100 : 0;

        return (
          <SimpleTooltip key={badge.id} content={badge.description}>
            <div className={`p-4 rounded-lg border transition-all ${earned ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20' : 'bg-white dark:bg-dark-card border-slate-200 dark:border-dark-border'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${earned ? 'bg-gradient-to-br from-yellow-300 to-amber-500' : 'bg-slate-100 dark:bg-slate-700'}`}>
                  <BadgeIcon name={badge.icon} className={`w-8 h-8 ${earned ? badge.color : 'text-slate-400 dark:text-slate-500'}`} />
                </div>
                <div className="flex-grow">
                  <h4 className={`font-bold ${earned ? 'text-slate-900 dark:text-dark-text' : 'text-slate-600 dark:text-dark-text-secondary'}`}>{badge.name}</h4>
                  {!earned && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-slate-500 dark:text-dark-text-secondary mb-1">
                        <span>Progress</span>
                        <span>{current} / {target}</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <motion.div 
                          className="bg-gradient-to-r from-blue-400 to-indigo-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {earned && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">Unlocked!</p>
                  )}
                </div>
              </div>
            </div>
          </SimpleTooltip>
        );
      })}
    </div>
  );
};

export default BadgeProgress;
