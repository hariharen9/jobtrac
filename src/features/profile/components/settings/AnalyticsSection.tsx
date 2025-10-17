import React, { useState } from 'react';
import { Application } from '../../../../types';
import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react';
import AnalyticsDashboard from '../AnalyticsDashboard';

interface AnalyticsSectionProps {
  applications: Application[];
}

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ applications }) => {
  // Calculate quick stats
  const totalApps = applications.length;
  const offers = applications.filter(app => app.status === 'Offer').length;
  const interviews = applications.filter(app => 
    ['Tech Screen', 'Round 1', 'Round 2', 'Manager Round', 'Final Round'].includes(app.status)
  ).length;
  const responseRate = totalApps > 0 ? Math.round((interviews / totalApps) * 100) : 0;

  const stats = [
    {
      label: 'Total Applications',
      value: totalApps,
      icon: BarChart3,
      color: 'blue'
    },
    {
      label: 'Interviews',
      value: interviews,
      icon: Activity,
      color: 'purple'
    },
    {
      label: 'Offers',
      value: offers,
      icon: TrendingUp,
      color: 'green'
    },
    {
      label: 'Response Rate',
      value: `${responseRate}%`,
      icon: PieChart,
      color: 'orange'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 dark:bg-blue-900/30 amoled:bg-blue-900/30 text-blue-600 dark:text-blue-400 amoled:text-blue-400',
      purple: 'bg-purple-100 dark:bg-purple-900/30 amoled:bg-purple-900/30 text-purple-600 dark:text-purple-400 amoled:text-purple-400',
      green: 'bg-green-100 dark:bg-green-900/30 amoled:bg-green-900/30 text-green-600 dark:text-green-400 amoled:text-green-400',
      orange: 'bg-orange-100 dark:bg-orange-900/30 amoled:bg-orange-900/30 text-orange-600 dark:text-orange-400 amoled:text-orange-400'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-1">
          Analytics Dashboard
        </h3>
        <p className="text-sm text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
          Track your job search progress and insights
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="p-4 rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border bg-white dark:bg-dark-card amoled:bg-amoled-card"
            >
              <div className={`inline-flex p-2 rounded-lg mb-3 ${getColorClasses(stat.color)}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-slate-600 dark:text-dark-text-secondary amoled:text-amoled-text-secondary">
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Dashboard */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border bg-white dark:bg-dark-card amoled:bg-amoled-card">
        <AnalyticsDashboard applications={applications} />
      </div>
    </div>
  );
};

export default AnalyticsSection;
