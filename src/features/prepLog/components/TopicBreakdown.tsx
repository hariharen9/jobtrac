import React, { useMemo } from 'react';
import { PrepEntry } from '../../../types';
import { BookOpen } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useTheme } from '../../../hooks/shared/useTheme';

interface SubjectBreakdownProps {
  prepEntries: PrepEntry[];
  subjects: { id: string; name: string }[];
}

interface SubjectData {
  id: string;
  name: string;
  hours: number;
  entries: number;
}

const SubjectBreakdown: React.FC<SubjectBreakdownProps> = ({ prepEntries, subjects }) => {
  const { theme } = useTheme();

  // Create a map of subject IDs to names for quick lookup
  const subjectMap = useMemo(() => {
    const map: Record<string, string> = {};
    subjects.forEach(subject => {
      map[subject.id] = subject.name;
    });
    return map;
  }, [subjects]);

  // Process data to group by subjects and calculate hours
  const data = useMemo(() => {
    // Validate input data
    if (!prepEntries || !Array.isArray(prepEntries) || prepEntries.length === 0) {
      return [];
    }

    // Group entries by subjectId
    const entriesBySubject = prepEntries.reduce((acc, entry) => {
      // Validate entry has required properties
      if (!entry.subjectId || typeof entry.time !== 'number') {
        return acc;
      }
      
      if (!acc[entry.subjectId]) {
        acc[entry.subjectId] = {
          id: entry.subjectId,
          name: subjectMap[entry.subjectId] || entry.subjectId,
          hours: 0,
          entries: 0
        };
      }
      
      acc[entry.subjectId].hours += entry.time;
      acc[entry.subjectId].entries += 1;
      return acc;
    }, {} as Record<string, SubjectData>);

    // Convert to array and sort by hours
    return Object.values(entriesBySubject)
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 10); // Limit to top 10 subjects for better performance
  }, [prepEntries, subjectMap]);

  // Theme colors
  const tickColor = theme === 'light' ? '#64748b' : '#94a3b8';
  const tooltipBackgroundColor = theme === 'light' ? '#ffffff' : theme === 'dark' ? '#1e293b' : '#000000';
  const tooltipBorderColor = theme === 'light' ? '#e2e8f0' : theme === 'dark' ? '#334155' : '#2d2d2d';
  const tooltipTextColor = theme === 'light' ? '#1e293b' : theme === 'dark' ? '#f1f5f9' : '#f1f5f9';
  const gridColor = theme === 'light' ? '#e2e8f0' : '#334155';

  if (prepEntries.length === 0) {
    return (
      <div className="bg-white dark:bg-dark-card amoled:bg-amoled-card p-5 rounded-xl border border-slate-200 dark:border-dark-border amoled:border-amoled-border shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 amoled:bg-purple-900/20">
            <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400 amoled:text-purple-500" />
          </div>
          <h3 className="font-semibold text-slate-800 dark:text-dark-text amoled:text-amoled-text">
            Subject Breakdown
          </h3>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 amoled:text-slate-500 text-center py-6">
          Log your first prep session to see subject breakdown.
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
          Subject Breakdown
        </h3>
      </div>
      
      {data.length > 0 ? (
        <div className="h-64 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis 
                type="number" 
                tick={{ fill: tickColor, fontSize: 12 }} 
                tickFormatter={(value) => `${value}h`}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={120} 
                tick={{ fill: tickColor, fontSize: 12 }} 
                tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }} 
                contentStyle={{ 
                  backgroundColor: tooltipBackgroundColor, 
                  borderColor: tooltipBorderColor,
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  color: tooltipTextColor
                }} 
                formatter={(value, name) => {
                  if (name === 'hours') return [`${value} hours`, 'Time'];
                  if (name === 'entries') return [`${value} entries`, 'Sessions'];
                  return [value, name];
                }}
                labelStyle={{ color: tooltipTextColor, fontWeight: 'bold' }}
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
            Not enough data to show subject breakdown
          </p>
        </div>
      )}
    </div>
  );
};

export default SubjectBreakdown;