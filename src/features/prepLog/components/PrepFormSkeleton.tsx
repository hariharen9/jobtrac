import React from 'react';
import { BookOpen, Info, Link as LinkIcon, Star, FolderOpen, Layers } from 'lucide-react';

const PrepFormSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 p-1 bg-slate-50 dark:bg-dark-bg/50 amoled:bg-black/50 rounded-xl">
      <div className="space-y-6">
        {/* Organization Section Skeleton */}
        <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border shadow-sm p-5 md:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 animate-pulse">
              <FolderOpen className="w-5 h-5 text-transparent" />
            </div>
            <div className="h-5 w-24 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
              <div className="h-12 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded-lg animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
              <div className="h-12 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Session Details Section Skeleton */}
        <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border shadow-sm p-5 md:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 animate-pulse">
              <Info className="w-5 h-5 text-transparent" />
            </div>
            <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2 space-y-2">
              <div className="h-4 w-12 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
              <div className="h-12 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded-lg animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-12 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
              <div className="h-12 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded-lg animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
              <div className="h-12 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded-lg animate-pulse"></div>
            </div>
            <div className="md:col-span-2 space-y-2">
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
              <div className="h-12 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Confidence Section Skeleton */}
        <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border shadow-sm p-5 md:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 animate-pulse">
              <Star className="w-5 h-5 text-transparent" />
            </div>
            <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
          </div>
          <div className="flex flex-col items-center space-y-4 py-4">
            <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
            <div className="flex justify-center gap-2 sm:gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded-full animate-pulse mb-1"></div>
                  <div className="h-3 w-3 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
            <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Resources Section Skeleton */}
        <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border shadow-sm p-5 md:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 animate-pulse">
              <LinkIcon className="w-5 h-5 text-transparent" />
            </div>
            <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
          </div>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-dark-bg/50 amoled:bg-amoled-bg/50 rounded-lg border border-slate-200 dark:border-dark-border/50 amoled:border-amoled-border/50">
                <div className="pt-1">
                  <div className="h-5 w-5 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
                </div>
                <div className="flex-grow space-y-3">
                  <div className="h-10 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
                  <div className="h-10 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
                  <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
                </div>
                <div className="h-5 w-5 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded-full animate-pulse"></div>
              </div>
            ))}
          </div>
          <div className="mt-4 h-12 w-full bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded-lg animate-pulse"></div>
        </div>

        {/* Reflection Section Skeleton */}
        <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border shadow-sm p-5 md:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 animate-pulse">
              <Info className="w-5 h-5 text-transparent" />
            </div>
            <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
            <div className="h-32 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Form Actions Skeleton */}
      <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-slate-50/80 dark:bg-dark-bg/80 amoled:bg-black/80 backdrop-blur-sm pb-1 pr-1 rounded-b-xl">
        <div className="h-10 w-20 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded-lg animate-pulse"></div>
        <div className="h-10 w-24 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded-lg animate-pulse"></div>
      </div>
    </div>
  );
};

export default PrepFormSkeleton;