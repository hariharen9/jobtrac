import React, { useState, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Briefcase, BookOpen, Building, Users, Star } from 'lucide-react';
import { Application, PrepEntry, CompanyResearch, NetworkingContact, StarStory } from '../../../types';

interface ActivityCalendarProps {
  applications: Application[];
  prepEntries: PrepEntry[];
  companies: CompanyResearch[];
  contacts: NetworkingContact[];
  stories: StarStory[];
}

interface ActivityItem {
  id: string;
  type: 'application' | 'prep' | 'company' | 'contact' | 'story';
  title: string;
  date: string;
  icon: React.ElementType;
  color: string;
}

const ActivityCalendar: React.FC<ActivityCalendarProps> = ({
  applications,
  prepEntries,
  companies,
  contacts,
  stories
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Convert all data to activity items
  const activities = useMemo(() => {
    const items: ActivityItem[] = [];

    applications.forEach(app => {
      items.push({
        id: app.id,
        type: 'application',
        title: `${app.company} - ${app.role}`,
        date: app.date,
        icon: Briefcase,
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
      });
    });

    prepEntries.forEach(entry => {
      items.push({
        id: entry.id,
        type: 'prep',
        title: entry.topic,
        date: entry.date,
        icon: BookOpen,
        color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      });
    });

    companies.forEach(company => {
      items.push({
        id: company.id,
        type: 'company',
        title: `Research: ${company.company}`,
        date: company.createdAt,
        icon: Building,
        color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
      });
    });

    contacts.forEach(contact => {
      items.push({
        id: contact.id,
        type: 'contact',
        title: `${contact.name} - ${contact.company}`,
        date: contact.date,
        icon: Users,
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
      });
    });

    stories.forEach(story => {
      items.push({
        id: story.id,
        type: 'story',
        title: story.title,
        date: story.createdAt,
        icon: Star,
        color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300'
      });
    });

    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [applications, prepEntries, companies, contacts, stories]);

  // Group activities by date
  const activitiesByDate = useMemo(() => {
    return activities.reduce((acc, activity) => {
      const date = activity.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(activity);
      return acc;
    }, {} as Record<string, ActivityItem[]>);
  }, [activities]);

  // Get calendar data
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const selectedActivities = selectedDate ? activitiesByDate[selectedDate] || [] : [];

  return (
    <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
        <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Calendar className="w-5 h-5" />
          Activity Calendar
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {monthName} {year}
            </h3>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Calendar */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
            {/* Days of week header */}
            <div className="grid grid-cols-7 bg-slate-50 dark:bg-slate-700">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-3 text-center text-sm font-medium text-slate-700 dark:text-slate-300">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7">
              {days.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="p-3 h-20 border-r border-b border-slate-200 dark:border-slate-700"></div>;
                }

                const dateStr = formatDate(year, month, day);
                const dayActivities = activitiesByDate[dateStr] || [];
                const isSelected = selectedDate === dateStr;
                const isToday = dateStr === new Date().toISOString().split('T')[0];

                return (
                  <div
                    key={day}
                    className={`p-2 h-20 border-r border-b border-slate-200 dark:border-slate-700 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 ${
                      isSelected ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                    }`}
                    onClick={() => setSelectedDate(dateStr)}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      isToday ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-900 dark:text-slate-100'
                    }`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {dayActivities.slice(0, 2).map(activity => {
                        const Icon = activity.icon;
                        return (
                          <div
                            key={activity.id}
                            className={`text-xs px-1 py-0.5 rounded flex items-center gap-1 ${activity.color}`}
                          >
                            <Icon className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{activity.title}</span>
                          </div>
                        );
                      })}
                      {dayActivities.length > 2 && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 px-1">
                          +{dayActivities.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Activity Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {selectedDate ? `Activities for ${new Date(selectedDate).toLocaleDateString()}` : 'Recent Activities'}
          </h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {(selectedActivities.length > 0 ? selectedActivities : activities.slice(0, 10)).map(activity => {
              const Icon = activity.icon;
              return (
                <div
                  key={activity.id}
                  className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${activity.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                        {activity.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                      <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${activity.color}`}>
                        {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {selectedDate && selectedActivities.length === 0 && (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                No activities on this date
              </div>
            )}
            
            {!selectedDate && activities.length === 0 && (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                No activities yet. Start by adding applications, prep entries, or other items!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCalendar;
