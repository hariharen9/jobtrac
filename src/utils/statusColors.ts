import { ApplicationStatus } from '../types';

export const statusColors: Record<ApplicationStatus, string> = {
  'To Apply': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 amoled:bg-amoled-card amoled:text-amoled-text border border-blue-200 dark:border-blue-800/50',
  'Applied': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 amoled:bg-amoled-card amoled:text-amoled-text border border-indigo-200 dark:border-indigo-800/50',
  'HR Screen': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 amoled:bg-amoled-card amoled:text-amoled-text border border-purple-200 dark:border-purple-800/50',
  'Tech Screen': 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/50 dark:text-fuchsia-300 amoled:bg-amoled-card amoled:text-amoled-text border border-fuchsia-200 dark:border-fuchsia-800/50',
  'Round 1': 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300 amoled:bg-amoled-card amoled:text-amoled-text border border-pink-200 dark:border-pink-800/50',
  'Round 2': 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300 amoled:bg-amoled-card amoled:text-amoled-text border border-pink-200 dark:border-pink-800/50',
  'Manager Round': 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300 amoled:bg-amoled-card amoled:text-amoled-text border border-rose-200 dark:border-rose-800/50',
  'Final Round': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 amoled:bg-amoled-card amoled:text-amoled-text border border-yellow-200 dark:border-yellow-800/50',
  'Offer': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 amoled:bg-amoled-card amoled:text-amoled-text border border-green-200 dark:border-green-800/50',
  'Rejected': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 amoled:bg-amoled-card amoled:text-amoled-text border border-red-200 dark:border-red-800/50',
  'Ghosted': 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300 amoled:bg-amoled-card amoled:text-amoled-text border border-slate-300 dark:border-slate-600',
};