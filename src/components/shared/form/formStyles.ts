/**
 * Shared Form Design System - Based on Vault Design Language
 *
 * A consistent, modern, professional design system for all forms.
 * Uses a clean black/white aesthetic with subtle shadows and smooth transitions.
 */

// Base input styles
export const inputBase = [
  'w-full rounded-lg border transition-all duration-200',
  'bg-white dark:bg-dark-card amoled:bg-amoled-card',
  'text-slate-900 dark:text-dark-text amoled:text-amoled-text',
  'placeholder-slate-400 dark:placeholder-slate-500',
  'focus:outline-none focus:ring-2 focus:border-transparent',
].join(' ');

export const inputNormal = [
  'border-slate-300 dark:border-dark-border amoled:border-amoled-border',
  'focus:ring-slate-900 dark:focus:ring-white amoled:focus:ring-white',
  'hover:border-slate-400 dark:hover:border-slate-500',
].join(' ');

export const inputError = [
  'border-red-300 dark:border-red-600 amoled:border-red-700',
  'focus:ring-red-500',
].join(' ');

export const inputDisabled = 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-800';

// Input sizes
export const inputSizes = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-4 py-4 text-lg',
};

// Label styles
export const labelBase = [
  'block text-sm font-medium mb-2',
  'text-slate-700 dark:text-dark-text amoled:text-amoled-text',
].join(' ');

export const labelRequired = "after:content-['*'] after:ml-0.5 after:text-red-500";

// Error message styles
export const errorBase = [
  'mt-2 text-sm flex items-center gap-1.5',
  'text-red-600 dark:text-red-400 amoled:text-red-500',
].join(' ');

// Button styles
export const buttonBase = [
  'inline-flex items-center justify-center gap-2',
  'font-medium rounded-lg transition-all duration-200',
  'focus:outline-none focus:ring-2 focus:ring-offset-2',
  'disabled:opacity-50 disabled:cursor-not-allowed',
].join(' ');

export const buttonVariants = {
  primary: [
    'bg-slate-900 dark:bg-white amoled:bg-white',
    'text-white dark:text-slate-900 amoled:text-slate-900',
    'hover:bg-slate-800 dark:hover:bg-slate-100 amoled:hover:bg-slate-100',
    'focus:ring-slate-900 dark:focus:ring-white',
    'shadow-sm hover:shadow-md',
  ].join(' '),
  secondary: [
    'bg-white dark:bg-dark-card amoled:bg-amoled-card',
    'text-slate-700 dark:text-dark-text amoled:text-amoled-text',
    'border border-slate-300 dark:border-dark-border amoled:border-amoled-border',
    'hover:bg-slate-50 dark:hover:bg-slate-800 amoled:hover:bg-slate-900',
    'focus:ring-slate-500',
  ].join(' '),
  ghost: [
    'bg-slate-100 dark:bg-dark-bg amoled:bg-amoled-bg',
    'text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary',
    'hover:bg-slate-200 dark:hover:bg-dark-card amoled:hover:bg-amoled-card',
    'focus:ring-slate-500',
  ].join(' '),
  danger: [
    'bg-red-600 text-white',
    'hover:bg-red-700',
    'focus:ring-red-500',
  ].join(' '),
};

export const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

// Section/Card styles
export const sectionBase = [
  'rounded-xl border transition-all duration-300',
  'border-slate-200 dark:border-dark-border amoled:border-amoled-border',
  'bg-white dark:bg-dark-card amoled:bg-amoled-card',
].join(' ');

export const sectionActive = [
  'border-slate-400 dark:border-slate-500 amoled:border-slate-600',
  'shadow-md',
].join(' ');

export const sectionInactive = [
  'hover:border-slate-300 dark:hover:border-slate-600',
  'hover:shadow-sm',
].join(' ');

// Toggle switch styles
export const toggleBase = [
  'relative inline-flex h-6 w-11 items-center rounded-full',
  'transition-colors duration-200 ease-in-out',
  'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900',
].join(' ');

export const toggleOn = 'bg-slate-900 dark:bg-white amoled:bg-white';
export const toggleOff = 'bg-slate-200 dark:bg-dark-border amoled:bg-amoled-border';

export const toggleKnob = [
  'inline-block h-4 w-4 transform rounded-full bg-white dark:bg-slate-900',
  'transition-transform duration-200 ease-in-out',
  'shadow-sm',
].join(' ');

// Tag/Chip styles
export const tagBase = [
  'inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-sm font-medium',
  'bg-slate-100 dark:bg-slate-800 amoled:bg-slate-900',
  'text-slate-700 dark:text-slate-300 amoled:text-slate-400',
  'border border-slate-200 dark:border-slate-700 amoled:border-slate-800',
].join(' ');

export const tagRemoveButton = [
  'ml-1 hover:text-slate-900 dark:hover:text-white',
  'transition-colors duration-150',
].join(' ');

// Button group (chip selection) styles
export const chipBase = [
  'px-4 py-2.5 rounded-lg border text-sm font-medium',
  'transition-all duration-200 cursor-pointer',
  'focus:outline-none focus:ring-2 focus:ring-offset-1',
].join(' ');

export const chipUnselected = [
  'border-slate-200 dark:border-dark-border amoled:border-amoled-border',
  'bg-white dark:bg-dark-card amoled:bg-amoled-card',
  'text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary',
  'hover:border-slate-300 dark:hover:border-slate-500',
  'hover:bg-slate-50 dark:hover:bg-slate-800 amoled:hover:bg-slate-900',
].join(' ');

export const chipSelected = [
  'border-slate-900 dark:border-white amoled:border-white',
  'bg-slate-900 dark:bg-white amoled:bg-white',
  'text-white dark:text-slate-900 amoled:text-slate-900',
  'shadow-sm',
].join(' ');

// Icon wrapper styles
export const iconWrapper = [
  'flex items-center justify-center',
  'p-2 rounded-lg',
  'bg-slate-100 dark:bg-slate-800 amoled:bg-slate-900',
].join(' ');

export const iconWrapperActive = [
  'bg-slate-900 dark:bg-white amoled:bg-white',
  'text-white dark:text-slate-900 amoled:text-slate-900',
].join(' ');

// Form actions container
export const actionsContainer = [
  'flex flex-col-reverse sm:flex-row justify-end gap-3',
  'pt-6 border-t',
  'border-slate-200 dark:border-dark-border amoled:border-amoled-border',
].join(' ');

// Section header styles (for flat layout grouping)
export const sectionHeaderContainer = [
  'flex items-center gap-2 pb-2 border-b',
  'border-slate-200 dark:border-slate-700 amoled:border-slate-800',
].join(' ');

export const sectionHeaderIcon = 'w-4 h-4 text-slate-400 dark:text-slate-500 amoled:text-slate-600';

export const sectionHeaderTitle = [
  'text-sm font-semibold uppercase tracking-wide',
  'text-slate-900 dark:text-white amoled:text-amoled-text',
].join(' ');

// Helper function to combine classes conditionally
export const cx = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ');
};
