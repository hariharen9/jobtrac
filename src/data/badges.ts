import { Badge } from '../types';

export const allBadges: Badge[] = [
  // Application Milestones
  {
    id: 'app_1',
    name: 'First Application',
    description: 'Submit your first job application',
    icon: 'Rocket',
    color: 'text-green-500'
  },
  {
    id: 'app_10',
    name: 'Tenacious Ten',
    description: 'Submit 10 applications',
    icon: 'Target',
    color: 'text-blue-500'
  },
  {
    id: 'app_50',
    name: 'Fifty Club',
    description: 'Submit 50 applications',
    icon: 'Award',
    color: 'text-purple-500'
  },
  {
    id: 'app_finalist',
    name: 'The Finalist',
    description: 'Reach the final interview round',
    icon: 'Trophy',
    color: 'text-amber-400'
  },
  {
    id: 'app_offer',
    name: 'The Offer',
    description: 'Receive your first job offer!',
    icon: 'PartyPopper',
    color: 'text-pink-500'
  },

  // Interview Preparation
  {
    id: 'prep_1',
    name: 'Prep Starter',
    description: 'Complete your first prep session',
    icon: 'BookOpen',
    color: 'text-green-500'
  },
  {
    id: 'prep_10_hours',
    name: 'Study Master',
    description: 'Log 10 hours of preparation',
    icon: 'Clock',
    color: 'text-blue-500'
  },
  {
    id: 'prep_confidence',
    name: 'Confidence Boost',
    description: 'Log a prep session with 80% or higher confidence',
    icon: 'Sparkles',
    color: 'text-yellow-400'
  },

  // Networking Achievements
  {
    id: 'net_1',
    name: 'First Connection',
    description: 'Add your first networking contact',
    icon: 'Users',
    color: 'text-green-500'
  },
  {
    id: 'net_10',
    name: 'Networker',
    description: 'Add 10 networking contacts',
    icon: 'Network',
    color: 'text-blue-500'
  },
  {
    id: 'net_referral',
    name: 'Referral Rockstar',
    description: 'Log a contact who gave you a referral',
    icon: 'Handshake',
    color: 'text-teal-500'
  },

  // Detail & Quality
  {
    id: 'detail_notes',
    name: 'Detail Oriented',
    description: 'Add notes to 10 applications',
    icon: 'FileText',
    color: 'text-indigo-400'
  },
  {
    id: 'detail_jd',
    name: 'Archivist',
    description: 'Save the job description for 5 applications',
    icon: 'Archive',
    color: 'text-orange-500'
  },

  // Meta & Power-User
  {
    id: 'meta_dark_mode',
    name: 'Night Owl',
    description: 'Embrace the darkness and switch to dark mode',
    icon: 'Moon',
    color: 'text-purple-400'
  },
  {
    id: 'meta_quick_start',
    name: 'Quick Starter',
    description: 'Complete the Quick Start checklist',
    icon: 'CheckCircle',
    color: 'text-green-600'
  },
];

export const badgeTriggers = {
  // Progress metrics that are simple counts
  applications: [
    { progress: 1, badgeId: 'app_1' },
    { progress: 10, badgeId: 'app_10' },
    { progress: 50, badgeId: 'app_50' },
  ],
  prepEntries: [
    { progress: 1, badgeId: 'prep_1' },
  ],
  prepTime: [
    { progress: 600, badgeId: 'prep_10_hours' }, // 10 hours in minutes
  ],
  contacts: [
    { progress: 1, badgeId: 'net_1' },
    { progress: 10, badgeId: 'net_10' },
  ],
  // These will need custom tracking logic
  app_status_final: [{ progress: 1, badgeId: 'app_finalist' }],
  app_status_offer: [{ progress: 1, badgeId: 'app_offer' }],
  prep_confidence_high: [{ progress: 1, badgeId: 'prep_confidence' }],
  net_referrals: [{ progress: 1, badgeId: 'net_referral' }],
  app_notes_added: [{ progress: 10, badgeId: 'detail_notes' }],
  app_jd_saved: [{ progress: 5, badgeId: 'detail_jd' }],
  theme_dark: [{ progress: 1, badgeId: 'meta_dark_mode' }],
  quick_start_done: [{ progress: 1, badgeId: 'meta_quick_start' }],
};