import { ApplicationStatus } from '../types';

export const statusColors: Record<ApplicationStatus, string> = {
  'To Apply': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  'Applied': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
  'HR Screen': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
  'Tech Screen': 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/50 dark:text-fuchsia-300',
  'Round 1': 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300',
  'Round 2': 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300',
  'Manager Round': 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300',
  'Final Round': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  'Offer': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'Rejected': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  'Ghosted': 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
};