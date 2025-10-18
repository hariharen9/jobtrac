import React from 'react';
import { BookOpen, Plus, Filter, FolderOpen, Layers } from 'lucide-react';

const PrepLogSkeleton: React.FC = () => {
  return (
    <div className="bg-slate-50 dark:bg-dark-bg amoled:bg-amoled-bg min-h-full">
      <div className="container mx-auto p-4 sm:p-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 animate-pulse">
                <BookOpen className="w-6 h-6 text-transparent" />
              </div>
              <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
            </div>
            <div className="h-4 w-80 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-24 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded-lg animate-pulse"></div>
            <div className="h-10 w-24 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded-lg animate-pulse"></div>
            <div className="h-10 w-20 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded-lg animate-pulse"></div>
            <div className="h-10 w-24 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded-lg animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-6">
          <main className="lg:col-span-2 space-y-6">
            {/* Filter Panel Skeleton */}
            <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border shadow-sm p-5">
              <div className="flex justify-between items-center mb-4">
                <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
                <div className="h-4 w-12 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <div className="h-4 w-12 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
                  <div className="h-10 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded-lg animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-8 w-8 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded-full animate-pulse"></div>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="h-10 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded-lg animate-pulse"></div>
                    <div className="h-10 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded-lg animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls and Stats Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border shadow-sm p-5">
              <div>
                <div className="h-5 w-24 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
                <div className="h-8 w-24 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded-lg animate-pulse"></div>
                <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded-lg animate-pulse"></div>
              </div>
            </div>

            {/* Topic Cards Skeleton */}
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-dark-card amoled:bg-amoled-card border border-slate-200 dark:border-dark-border amoled:border-amoled-border rounded-xl shadow-sm overflow-hidden">
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-5 w-5 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
                          <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
                          <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
                          <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
                        </div>
                      </div>
                      <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded-lg animate-pulse"></div>
                    </div>
                    <div className="bg-slate-50 dark:bg-dark-bg/20 amoled:bg-amoled-bg/20 p-4 rounded-lg border border-slate-200 dark:border-dark-border/30 amoled:border-amoled-border/30">
                      <div className="flex justify-between items-start mb-2">
                        <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
                        <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((j) => (
                              <div key={j} className="h-4 w-4 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
                            ))}
                          </div>
                        </div>
                        <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded-full animate-pulse"></div>
                      </div>
                      <div className="h-4 w-full mt-2 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>

          {/* Sidebar Skeleton */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card p-4 rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-4 w-4 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
                  <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
                </div>
                <div className="h-6 w-12 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
              </div>
              <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card p-4 rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-4 w-4 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
                  <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
                </div>
                <div className="h-6 w-12 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
              </div>
            </div>
            
            {/* Reviews Skeleton */}
            <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card p-5 rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded-lg animate-pulse"></div>
                <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
                <div className="h-5 w-5 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded-full animate-pulse ml-auto"></div>
              </div>
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-dark-bg/50 amoled:bg-amoled-bg/50 rounded-lg">
                    <div>
                      <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse mb-2"></div>
                      <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
                    </div>
                    <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Analytics Skeleton */}
            <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card p-5 rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded-lg animate-pulse"></div>
                <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
              </div>
              <div className="mb-4 flex gap-4">
                <div>
                  <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse mb-1"></div>
                  <div className="h-5 w-12 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
                </div>
                <div>
                  <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse mb-1"></div>
                  <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="h-32 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PrepLogSkeleton;