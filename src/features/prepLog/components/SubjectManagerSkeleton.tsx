import React from 'react';
import { FolderPlus } from 'lucide-react';

const SubjectManagerSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border shadow-sm p-5 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
        <div className="h-8 w-24 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded-lg animate-pulse"></div>
      </div>

      {/* Subject List Skeleton */}
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-3 rounded-lg border border-slate-200 dark:border-dark-border/50 amoled:border-amoled-border/50"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse mb-2"></div>
                <div className="h-3 w-48 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center gap-1 ml-2">
                <div className="h-6 w-6 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded-lg animate-pulse"></div>
                <div className="h-6 w-6 bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectManagerSkeleton;