import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { EarnedBadge, Badge } from '../../../types';
import { allBadges } from '../../../data/badges';
import SimpleTooltip from '../../../components/shared/SimpleTooltip';

const BadgeIcon = ({ name, className }: { name: string; className?: string }) => {
  const Icon = (LucideIcons as any)[name];
  return Icon ? <Icon className={className} /> : <LucideIcons.Award className={className} />;
};

const BadgeDisplay = ({ earnedBadges }: { earnedBadges: EarnedBadge[] }) => {
  const badges = earnedBadges
    .map(earned => {
      const badgeInfo = allBadges.find(b => b.id === earned.badgeId);
      return badgeInfo ? { ...badgeInfo, earnedAt: earned.earnedAt } : null;
    })
    .filter(Boolean) as (Badge & { earnedAt: any })[];

  if (badges.length === 0) {
    return (
      <div className="text-center p-8 bg-slate-100 dark:bg-dark-card rounded-lg">
        <p className="text-slate-500 dark:text-dark-text-secondary">No badges earned yet. Keep going!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {badges.map(badge => (
        <SimpleTooltip key={badge.id} content={`${badge.description} (Earned: ${new Date(badge.earnedAt.seconds * 1000).toLocaleDateString()})`}>
          <motion.div
            className="flex flex-col items-center p-4 bg-white dark:bg-dark-card rounded-lg border border-slate-200 dark:border-dark-border text-center"
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 flex items-center justify-center mb-3 shadow-lg`}>
              <BadgeIcon name={badge.icon} className={`w-8 h-8 ${badge.color}`} />
            </div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-dark-text">{badge.name}</h4>
          </motion.div>
        </SimpleTooltip>
      ))}
    </div>
  );
};

export default BadgeDisplay;
