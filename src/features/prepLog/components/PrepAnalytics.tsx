import React, { useMemo, useEffect, useRef } from 'react';
import { PrepEntry } from '../../../types';
import SimpleTooltip from '../../../components/shared/SimpleTooltip';
import { TrendingUp, Clock, Target, BarChart3, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { useTheme } from '../../../hooks/shared/useTheme';

interface PrepAnalyticsProps {
  prepEntries: PrepEntry[];
}

// Color palette for charts
const COLORS = ['#818cf8', '#60a5fa', '#38bdf8', '#22d3ee', '#2dd4bf', '#34d399', '#a3e635', '#facc15', '#fbbf24', '#fb923c'];

const PrepAnalytics: React.FC<PrepAnalyticsProps> = ({ prepEntries }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // Calculate various analytics metrics
  const analytics = useMemo(() => {
    // Only calculate if we have entries
    if (!prepEntries || prepEntries.length === 0) {
      return { 
        days: [], 
        maxHours: 0, 
        totalHours: 0, 
        streak: 0,
        avgHoursPerDay: 0,
        mostActiveDay: '',
        topicsCount: 0,
        avgConfidence: 0,
        timeByDayOfWeek: [],
        timeByTopic: [],
        confidenceDistribution: []
      };
    }

    // Calculate total hours
    const totalHours = prepEntries.reduce((sum, entry) => sum + entry.time, 0);
    
    // Calculate average hours per day
    const uniqueDates = new Set(prepEntries.map(entry => new Date(entry.date).toDateString()));
    const avgHoursPerDay = uniqueDates.size > 0 ? totalHours / uniqueDates.size : 0;
    
    // Calculate current streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    let currentDate = new Date(today);
    
    // Create a set of dates with prep entries
    const prepDates = new Set(prepEntries.map(entry => {
      const date = new Date(entry.date);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    }));
    
    // Count consecutive days
    while (prepDates.has(currentDate.getTime())) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }

    // Calculate most active day of week
    const dayOfWeekMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeekCount = Array(7).fill(0);
    const dayOfWeekHours = Array(7).fill(0);
    
    prepEntries.forEach(entry => {
      const date = new Date(entry.date);
      const dayIndex = date.getDay();
      dayOfWeekCount[dayIndex]++;
      dayOfWeekHours[dayIndex] += entry.time;
    });
    
    const mostActiveDayIndex = dayOfWeekHours.indexOf(Math.max(...dayOfWeekHours));
    const mostActiveDay = dayOfWeekMap[mostActiveDayIndex] || 'N/A';

    // Calculate topics count
    const topics = new Set(prepEntries.map(entry => entry.topic));
    const topicsCount = topics.size;

    // Calculate average confidence
    const totalConfidence = prepEntries.reduce((sum, entry) => sum + entry.confidence, 0);
    const avgConfidence = prepEntries.length > 0 ? totalConfidence / prepEntries.length : 0;

    // Calculate time by day of week for chart
    const timeByDayOfWeek = dayOfWeekMap.map((day, index) => ({
      name: day.substring(0, 3), // Short name for chart
      hours: dayOfWeekHours[index],
      sessions: dayOfWeekCount[index]
    }));

    // Calculate time by topic for chart (top 10)
    const timeByTopicMap = new Map<string, number>();
    prepEntries.forEach(entry => {
      const current = timeByTopicMap.get(entry.topic) || 0;
      timeByTopicMap.set(entry.topic, current + entry.time);
    });
    
    const timeByTopic = Array.from(timeByTopicMap.entries())
      .map(([topic, hours]) => ({ name: topic, hours }))
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 10); // Top 10 topics

    // Calculate confidence distribution
    const confidenceCount = Array(5).fill(0);
    prepEntries.forEach(entry => {
      const index = entry.confidence - 1;
      if (index >= 0 && index < 5) {
        confidenceCount[index]++;
      }
    });
    
    const confidenceDistribution = confidenceCount.map((count, index) => ({
      name: `Level ${index + 1}`,
      value: count
    }));

    const oneYearAgo = new Date(new Date().setFullYear(today.getFullYear() - 1));
    const prepDataByDate = new Map<string, number>();
    
    // Calculate prep data by date
    for (const entry of prepEntries) {
      if (entry.date) {
        const date = new Date(entry.date).toISOString().split('T')[0];
        prepDataByDate.set(date, (prepDataByDate.get(date) || 0) + entry.time);
      }
    }

    // Find max hours for color scaling
    const hoursArray = Array.from(prepDataByDate.values());
    const maxHours = hoursArray.length > 0 ? Math.max(...hoursArray) : 0;

    // Generate days array only for the date range that has data
    const startDate = hoursArray.length > 0 ? oneYearAgo : new Date();
    const endDate = new Date();
    
    const daysInPeriod = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const days = Array.from({ length: Math.min(daysInPeriod, 365) }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      return {
        date: dateString,
        value: prepDataByDate.get(dateString) || 0,
        dayOfWeek: date.getDay(),
      };
    });

    const firstDayOfWeek = days[0]?.dayOfWeek || 0;
    const blankDays = Array.from({ length: firstDayOfWeek }, (_, i) => ({ date: `blank-${i}`, value: -1, dayOfWeek: 0 }));
    
    return { 
      days: [...blankDays, ...days], 
      maxHours, 
      totalHours, 
      streak,
      avgHoursPerDay,
      mostActiveDay,
      topicsCount,
      avgConfidence,
      timeByDayOfWeek,
      timeByTopic,
      confidenceDistribution
    };
  }, [prepEntries]);

  useEffect(() => {
    if (scrollContainerRef.current && analytics.days.length > 0) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, [analytics.days.length]);

  const getColor = (value: number, maxValue: number) => {
    if (value === 0) return 'bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800';
    if (maxValue === 0) return 'bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800';
    
    const ratio = value / maxValue;
    if (ratio < 0.25) return 'bg-blue-200 dark:bg-blue-900/50 amoled:bg-blue-900/40';
    if (ratio < 0.5) return 'bg-blue-400 dark:bg-blue-700 amoled:bg-blue-700/70';
    if (ratio < 0.75) return 'bg-blue-600 dark:bg-blue-600 amoled:bg-blue-600/80';
    return 'bg-blue-800 dark:bg-blue-500 amoled:bg-blue-500/90';
  };

  // Chart styling based on theme
  const tickColor = theme === 'light' ? '#64748b' : '#94a3b8';
  const tooltipBackgroundColor = theme === 'light' ? '#fff' : '#1e293b';
  const tooltipBorderColor = theme === 'light' ? '#ddd' : '#334155';
  const gridColor = theme === 'light' ? '#e2e8f0' : '#334155';

  // Don't render if no data
  if (!prepEntries || prepEntries.length === 0) {
    return (
      <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card p-5 rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 amoled:bg-blue-900/20">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400 amoled:text-blue-500" />
          </div>
          <h3 className="font-semibold text-slate-800 dark:text-dark-text amoled:text-amoled-text">
            Prep Analytics
          </h3>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 amoled:text-slate-500 text-center py-6">
          Log your first prep session to see analytics.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border shadow-sm">
      <div className="p-5">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 amoled:bg-blue-900/20">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400 amoled:text-blue-500" />
          </div>
          <h3 className="font-semibold text-slate-800 dark:text-dark-text amoled:text-amoled-text">
            Prep Analytics
          </h3>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-50 dark:bg-dark-bg/30 amoled:bg-amoled-bg/30 p-4 rounded-lg border border-slate-200 dark:border-dark-border/30 amoled:border-amoled-border/30">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 amoled:text-slate-500">Total Hours</span>
            </div>
            <p className="text-xl font-bold text-slate-800 dark:text-dark-text amoled:text-amoled-text">{analytics.totalHours.toFixed(1)}</p>
          </div>
          <div className="bg-slate-50 dark:bg-dark-bg/30 amoled:bg-amoled-bg/30 p-4 rounded-lg border border-slate-200 dark:border-dark-border/30 amoled:border-amoled-border/30">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 amoled:text-slate-500">Current Streak</span>
            </div>
            <p className="text-xl font-bold text-slate-800 dark:text-dark-text amoled:text-amoled-text">{analytics.streak} days</p>
          </div>
          <div className="bg-slate-50 dark:bg-dark-bg/30 amoled:bg-amoled-bg/30 p-4 rounded-lg border border-slate-200 dark:border-dark-border/30 amoled:border-amoled-border/30">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-green-500 dark:text-green-400" />
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 amoled:text-slate-500">Avg. Hours/Day</span>
            </div>
            <p className="text-xl font-bold text-slate-800 dark:text-dark-text amoled:text-amoled-text">{analytics.avgHoursPerDay.toFixed(1)}</p>
          </div>
          <div className="bg-slate-50 dark:bg-dark-bg/30 amoled:bg-amoled-bg/30 p-4 rounded-lg border border-slate-200 dark:border-dark-border/30 amoled:border-amoled-border/30">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-purple-500 dark:text-purple-400" />
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 amoled:text-slate-500">Topics</span>
            </div>
            <p className="text-xl font-bold text-slate-800 dark:text-dark-text amoled:text-amoled-text">{analytics.topicsCount}</p>
          </div>
        </div>
        
        {/* Activity Heatmap */}
        <div className="mb-8">
          <h4 className="font-medium text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Activity Heatmap (Last Year)
          </h4>
          <div className="flex gap-2">
            <div ref={scrollContainerRef} className="overflow-x-auto pb-2 scrollbar-hide">
              <div className="grid grid-rows-7 grid-flow-col gap-0.5">
                {analytics.days.map((day, index) => {
                  const cell = <div className={`w-3 h-3 rounded-sm ${day.value === -1 ? '' : getColor(day.value, analytics.maxHours)}`} />;
                  if (day.value > 0) {
                    return (
                      <SimpleTooltip 
                        key={index} 
                        content={`${day.date}: ${day.value.toFixed(1)} hours`}
                      >
                        {cell}
                      </SimpleTooltip>
                    );
                  }
                  return <div key={index}>{cell}</div>;
                })}
              </div>
            </div>
          </div>
          <div className="flex justify-end text-xs text-slate-500 dark:text-slate-400 amoled:text-slate-500 mt-2">
            <span>Less</span>
            <div className="w-3 h-3 rounded-sm bg-slate-200 dark:bg-slate-700 amoled:bg-slate-800 mx-1"></div>
            <div className="w-3 h-3 rounded-sm bg-blue-200 dark:bg-blue-900/50 amoled:bg-blue-900/40 mx-1"></div>
            <div className="w-3 h-3 rounded-sm bg-blue-400 dark:bg-blue-700 amoled:bg-blue-700/70 mx-1"></div>
            <div className="w-3 h-3 rounded-sm bg-blue-600 dark:bg-blue-600 amoled:bg-blue-600/80 mx-1"></div>
            <div className="w-3 h-3 rounded-sm bg-blue-800 dark:bg-blue-500 amoled:bg-blue-500/90 mx-1"></div>
            <span>More</span>
          </div>
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Time by Day of Week */}
          <div className="bg-slate-50 dark:bg-dark-bg/30 amoled:bg-amoled-bg/30 p-4 rounded-lg border border-slate-200 dark:border-dark-border/30 amoled:border-amoled-border/30">
            <h4 className="font-medium text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-3">
              Activity by Day of Week
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.timeByDayOfWeek}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 12 }} />
                  <YAxis tick={{ fill: tickColor, fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }} 
                    contentStyle={{ 
                      backgroundColor: tooltipBackgroundColor, 
                      border: `1px solid ${tooltipBorderColor}`,
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }} 
                    formatter={(value) => [`${value} hours`, 'Time']}
                  />
                  <Bar dataKey="hours" fill="#818cf8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Time by Topic */}
          <div className="bg-slate-50 dark:bg-dark-bg/30 amoled:bg-amoled-bg/30 p-4 rounded-lg border border-slate-200 dark:border-dark-border/30 amoled:border-amoled-border/30">
            <h4 className="font-medium text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-3">
              Time Spent by Topic (Top 10)
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.timeByTopic} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis type="number" tick={{ fill: tickColor, fontSize: 12 }} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={80} 
                    tick={{ fill: tickColor, fontSize: 12 }} 
                    tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
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
                  <Bar dataKey="hours" fill="#60a5fa" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Confidence Distribution */}
          <div className="bg-slate-50 dark:bg-dark-bg/30 amoled:bg-amoled-bg/30 p-4 rounded-lg border border-slate-200 dark:border-dark-border/30 amoled:border-amoled-border/30 lg:col-span-2">
            <h4 className="font-medium text-slate-700 dark:text-dark-text-secondary amoled:text-amoled-text-secondary mb-3">
              Confidence Level Distribution
            </h4>
            <div className="h-64 flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.confidenceDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  >
                    {analytics.confidenceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: tooltipBackgroundColor, 
                      border: `1px solid ${tooltipBorderColor}`,
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }} 
                    formatter={(value) => [`${value} sessions`, 'Count']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrepAnalytics;