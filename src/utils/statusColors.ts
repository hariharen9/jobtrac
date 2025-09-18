import { ApplicationStatus } from '../types';

export const statusColors: Record<ApplicationStatus, string> = {
  'To Apply': 'bg-blue-100 text-blue-800',
  'Applied': 'bg-indigo-100 text-indigo-800',
  'HR Screen': 'bg-purple-100 text-purple-800',
  'Tech Screen': 'bg-fuchsia-100 text-fuchsia-800',
  'Round 1': 'bg-pink-100 text-pink-800',
  'Round 2': 'bg-pink-100 text-pink-800',
  'Manager Round': 'bg-rose-100 text-rose-800',
  'Final Round': 'bg-yellow-100 text-yellow-800',
  'Offer': 'bg-green-100 text-green-800',
  'Rejected': 'bg-red-100 text-red-800',
  'Ghosted': 'bg-slate-100 text-slate-800',
};