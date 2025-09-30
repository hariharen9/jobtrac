import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { PrepEntry } from '../../../types';
import { useTheme } from '../../../hooks/shared/useTheme';
import { BookOpen } from 'lucide-react';

interface TopicBreakdownProps {
  prepEntries: PrepEntry[];
}

const TopicBreakdown: React.FC<TopicBreakdownProps> = ({ prepEntries }) => {
  const { theme } = useTheme();

  const data = useMemo(() => {
    // Validate input data
    if (!prepEntries || !Array.isArray(prepEntries)) {
      return [];
    }

    const timeByTopic = prepEntries.reduce((acc, entry) => {
      // Validate entry has required properties
      if (!entry.topic || typeof entry.time !== 'number') {
        return acc;
      }
      
      const topic = entry.topic || 'Uncategorized';
      acc[topic] = (acc[topic] || 0) + entry.time;
      return acc;
    }, {} as { [key: string]: number });

    return Object.entries(timeByTopic)
      .map(([topic, hours]) => ({ topic, hours }))
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 10); // Limit to top 10 topics for better performance
  }, [prepEntries]);

  const tickColor = theme === 'light' ? '#64748b' : '#94a3b8';
  const tooltipBackgroundColor = theme === 'light' ? '#fff' : '#1e293b';
  const tooltipBorderColor = theme === 'light' ? '#ddd' : '#334155';

  if (prepEntries.length === 0) {
    return (
      <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card p-5 rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 amoled:bg-purple-900/20">
            <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400 amoled:text-purple-500" />
          </div>
          <h3 className="font-semibold text-slate-800 dark:text-dark-text amoled:text-amoled-text">
            Topic Breakdown
          </h3>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 amoled:text-slate-500 text-center py-6">
          Log your first prep session to see topic breakdown.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card p-5 rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 amoled:bg-purple-900/20">
          <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400 amoled:text-purple-500" />
        </div>
        <h3 className="font-semibold text-slate-800 dark:text-dark-text amoled:text-amoled-text">
          Topic Breakdown
        </h3>
      </div>
      
      {data.length > 0 ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'light' ? '#e2e8f0' : '#334155'}/>
              <XAxis type="number" tick={{ fill: tickColor, fontSize: 12 }} />
              <YAxis 
                type="category" 
                dataKey="topic" 
                width={90} 
                tick={{ fill: tickColor, fontSize: 12 }} 
                tickFormatter={(value) => value.length > 12 ? `${value.substring(0, 12)}...` : value}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }} 
                contentStyle={{ 
                  backgroundColor: tooltipBackgroundColor, 
                  border: `1px solid ${tooltipBorderColor}`,
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }} 
                formatter={(value) => [`${value} hours`, 'Time']}
                labelFormatter={(label) => `Topic: ${label}`}
              />
              <Bar 
                dataKey="hours" 
                fill="#818cf8" 
                background={{ fill: theme === 'light' ? '#f1f5f9' : '#1e293b' }} 
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center py-10">
          <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-sm text-slate-500 dark:text-slate-400 amoled:text-slate-500">
            Not enough data to show topic breakdown
          </p>
        </div>
      )}
    </div>
  );
};

export default TopicBreakdown;