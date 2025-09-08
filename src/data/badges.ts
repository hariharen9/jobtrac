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

  // Research & Learning
  {
    id: 'research_5',
    name: 'Company Researcher',
    description: 'Research 5 companies',
    icon: 'Building2',
    color: 'text-blue-500'
  },
  {
    id: 'star_3',
    name: 'STAR Storyteller',
    description: 'Create 3 STAR stories',
    icon: 'Star',
    color: 'text-yellow-500'
  },
];

export const badgeTriggers = {
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
  companies: [
    { progress: 5, badgeId: 'research_5' },
  ],
  stories: [
    { progress: 3, badgeId: 'star_3' },
  ],
};
