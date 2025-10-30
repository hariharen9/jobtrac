import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  ExternalLink,
  Calendar,
  BarChart3,
  Activity
} from 'lucide-react';
import { VaultResource } from '../../../types';
import { formatDistanceToNow, isAfter, subDays } from 'date-fns';

interface VaultAnalyticsProps {
  resources: VaultResource[];
}

const VaultAnalytics: React.FC<VaultAnalyticsProps> = ({ resources }) => {
  const analytics = useMemo(() => {
    const now = new Date();
    const lastWeek = subDays(now, 7);
    const lastMonth = subDays(now, 30);

    // Recent activity
    const recentResources = resources.filter(r => 
      isAfter(
        r.createdAt instanceof Date ? r.createdAt : r.createdAt.toDate(), 
        lastWeek
      )
    ).length;

    // Most used categories
    const categoryUsage = resources.reduce((acc, resource) => {
      acc[resource.category] = (acc[resource.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topCategory = Object.entries(categoryUsage)
      .sort(([,a], [,b]) => b - a)[0];

    // Public vs Private ratio
    const publicCount = resources.filter(r => r.isPublic).length;
    const privateCount = resources.length - publicCount;

    // Favorites
    const favoritesCount = resources.filter(r => r.isFavorite).length;

    // Recent additions
    const thisMonth = resources.filter(r => 
      isAfter(
        r.createdAt instanceof Date ? r.createdAt : r.createdAt.toDate(), 
        lastMonth
      )
    ).length;

    // Potential issues (resources without descriptions or tags)
    const incompleteResources = resources.filter(r => 
      !r.description.trim() || r.tags.length === 0
    ).length;

    return {
      recentResources,
      topCategory,
      publicCount,
      privateCount,
      favoritesCount,
      thisMonth,
      incompleteResources,
      categoryUsage
    };
  }, [resources]);

  const insights = [
    {
      icon: Activity,
      title: 'Recent Activity',
      value: analytics.recentResources,
      subtitle: 'resources added this week',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30 amoled:bg-blue-950/20'
    },
    {
      icon: TrendingUp,
      title: 'Monthly Growth',
      value: analytics.thisMonth,
      subtitle: 'resources added this month',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950/30 amoled:bg-green-950/20'
    },
    {
      icon: CheckCircle,
      title: 'Public Resources',
      value: analytics.publicCount,
      subtitle: 'ready to share with recruiters',
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/30 amoled:bg-emerald-950/20'
    },
    {
      icon: AlertTriangle,
      title: 'Needs Attention',
      value: analytics.incompleteResources,
      subtitle: 'resources missing details',
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/30 amoled:bg-amber-950/20'
    }
  ];

  if (resources.length === 0) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-8 space-y-6"
    >
      {/* Quick Insights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + (index * 0.1) }}
              className={`p-4 rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border ${insight.bgColor}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon className={`w-5 h-5 ${insight.color}`} />
                <span className="text-sm font-medium text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                  {insight.title}
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-1">
                {insight.value}
              </div>
              <div className="text-xs text-slate-500 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                {insight.subtitle}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="p-6 bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-2xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border"
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text">
              Category Distribution
            </h3>
          </div>
          
          <div className="space-y-3">
            {Object.entries(analytics.categoryUsage)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([category, count]) => {
                const percentage = (count / resources.length) * 100;
                return (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 dark:text-dark-text amoled:text-amoled-text">
                      {category}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-slate-200 dark:bg-dark-bg amoled:bg-amoled-bg rounded-full h-2">
                        <motion.div
                          className="h-full bg-slate-600 dark:bg-dark-text-secondary amoled:bg-amoled-text-secondary rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: 0.8, duration: 0.8 }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text w-8 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </motion.div>

        {/* Quick Actions & Tips */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="p-6 bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-2xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border"
        >
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text">
              Optimization Tips
            </h3>
          </div>
          
          <div className="space-y-4">
            {analytics.incompleteResources > 0 && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 amoled:bg-amber-950/10 rounded-lg border border-amber-200 dark:border-amber-800/30 amoled:border-amber-800/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                      Complete {analytics.incompleteResources} resource{analytics.incompleteResources > 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                      Add descriptions and tags to make them more discoverable
                    </p>
                  </div>
                </div>
              </div>
            )}

            {analytics.publicCount < resources.length / 2 && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 amoled:bg-blue-950/10 rounded-lg border border-blue-200 dark:border-blue-800/30 amoled:border-blue-800/20">
                <div className="flex items-start gap-2">
                  <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      Consider making more resources public
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                      Public resources can be easily shared with recruiters
                    </p>
                  </div>
                </div>
              </div>
            )}

            {analytics.favoritesCount === 0 && resources.length > 3 && (
              <div className="p-3 bg-purple-50 dark:bg-purple-950/20 amoled:bg-purple-950/10 rounded-lg border border-purple-200 dark:border-purple-800/30 amoled:border-purple-800/20">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-purple-800 dark:text-purple-300">
                      Mark important resources as favorites
                    </p>
                    <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">
                      Quick access to your most important resources
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Success message when everything is optimized */}
            {analytics.incompleteResources === 0 && analytics.publicCount >= resources.length / 2 && analytics.favoritesCount > 0 && (
              <div className="p-3 bg-green-50 dark:bg-green-950/20 amoled:bg-green-950/10 rounded-lg border border-green-200 dark:border-green-800/30 amoled:border-green-800/20">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-300">
                      Your vault is well organized! 🎉
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                      All resources are complete and ready for job applications
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default VaultAnalytics;