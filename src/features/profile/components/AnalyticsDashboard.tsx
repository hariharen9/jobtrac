import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Application } from '../../../types';

import { TooltipProps } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560', '#775DD0', '#546E7A', '#26a69a', '#D10CE8'];

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 text-white bg-gray-800 rounded-md bg-opacity-80">
        <p className="label">{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

const ApplicationsByStatusChart = ({ applications }: { applications: Application[] }) => {
  const data = applications.reduce((acc, app) => {
    const status = app.status || 'N/A';
    const existing = acc.find((item) => item.name === status);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: status, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  return (
    <div className="p-4 border-2 border-dashed rounded-lg border-slate-300 dark:border-slate-600 amoled:border-amoled-foreground">
      <h4 className="mb-2 text-center text-md text-slate-800 dark:text-dark-text amoled:text-amoled-text">Applications by Status</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend formatter={(value, entry) => (entry.dataKey === 'value' ? '' : value)} />
          <Bar dataKey="value" fill="#FFFFFF">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const TrendAnalysisChart = ({ applications }: { applications: Application[] }) => {
  const [range, setRange] = useState<'monthly' | 'quarterly' | 'yearly' | 'lifetime'>('monthly');

  const processData = () => {
    // Sort applications by date
    const sortedApps = [...applications].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Filter by date range if not lifetime
    let filteredApps = sortedApps;
    if (range !== 'lifetime') {
      const now = new Date();
      let startDate = new Date();

      switch (range) {
        case 'monthly':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarterly':
          startDate.setMonth(now.getMonth() - 3);
          break;
        case 'yearly':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filteredApps = sortedApps.filter(app => new Date(app.date) >= startDate);
    }

    // Group by time period
    const data = filteredApps.reduce((acc, app) => {
      let periodLabel = '';
      const appDate = new Date(app.date);

      switch (range) {
        case 'monthly':
          periodLabel = appDate.toLocaleString('default', { month: 'short', year: '2-digit' });
          break;
        case 'quarterly': {
          const quarter = Math.floor(appDate.getMonth() / 3) + 1;
          periodLabel = `Q${quarter} ${appDate.getFullYear()}`;
          break;
        }
        case 'yearly':
          periodLabel = appDate.getFullYear().toString();
          break;
        case 'lifetime':
          periodLabel = appDate.toLocaleString('default', { month: 'short', year: '2-digit' });
          break;
      }

      const existing = acc.find((item: { period: string; }) => item.period === periodLabel);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ period: periodLabel, count: 1 });
      }
      return acc;
    }, [] as { period: string; count: number }[]);

    return data;
  };

  const data = processData();

  return (
    <div className="p-4 mt-4 border-2 border-dashed rounded-lg border-slate-300 dark:border-slate-600 amoled:border-amoled-foreground">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h4 className="text-md text-slate-800 dark:text-dark-text amoled:text-amoled-text">Applications Timeline</h4>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1 text-sm rounded-full ${
              range === 'monthly' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
            onClick={() => setRange('monthly')}
          >
            Monthly
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-full ${
              range === 'quarterly' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
            onClick={() => setRange('quarterly')}
          >
            Quarterly
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-full ${
              range === 'yearly' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
            onClick={() => setRange('yearly')}
          >
            Yearly
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-full ${
              range === 'lifetime' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
            onClick={() => setRange('lifetime')}
          >
            Lifetime
          </button>
        </div>
      </div>
      
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis allowDecimals={false} label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="p-2 text-white bg-gray-800 rounded-md bg-opacity-80">
                      <p className="label">{`${label} : ${payload[0].value} applications`}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#8884d8" 
              activeDot={{ r: 8 }} 
              name="Applications"
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-64 text-slate-500 dark:text-slate-400">
          No application data available for the selected time range
        </div>
      )}
      
      <p className="mt-4 text-xs text-center text-slate-400">
        Showing applications for the {range === 'lifetime' ? 'entire history' : `last ${range}`}
      </p>
    </div>
  );
};

const BenchmarkComparison = ({ applications }: { applications: Application[] }) => {
  const benchmarks = {
    applicationsPerInterview: 15,
    interviewsPerOffer: 3,
    applicationsPerOffer: 45,
    responseRate: 25, // Percentage of applications that get a response
    referralRate: 40, // Percentage of applications that come from referrals
    timeToOffer: 42, // Days from application to offer
  };

  // Define interview-related statuses based on the Kanban board
  const interviewStatuses = ['Tech Screen', 'Round 1', 'Round 2', 'Manager Round', 'Final Round'];
  
  // Count applications with interview-related statuses
  const interviews = applications.filter(app => interviewStatuses.includes(app.status)).length;
  const offers = applications.filter(app => app.status === 'Offer').length;
  const referredApps = applications.filter(app => app.referral === 'Y').length;
  const totalApps = applications.length;

  // Calculate time to offer metric
  const calculateTimeToOffer = () => {
    const offerApps = applications.filter(app => app.status === 'Offer');
    if (offerApps.length === 0) return 0;
    
    const totalTime = offerApps.reduce((sum, app) => {
      const appDate = new Date(app.date);
      // For this calculation, we'll assume today's date if no offer date is available
      // In a real implementation, you might want to track offer dates separately
      const offerDate = new Date(); // Placeholder - in real app, you'd have offer date
      const diffTime = Math.abs(offerDate.getTime() - appDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return sum + diffDays;
    }, 0);
    
    return Math.round(totalTime / offerApps.length);
  };

  const userStats = {
    applicationsPerInterview: interviews > 0 ? Math.round(totalApps / interviews) : 0,
    interviewsPerOffer: offers > 0 ? Math.round(interviews / offers) : 0,
    applicationsPerOffer: offers > 0 ? Math.round(totalApps / offers) : 0,
    responseRate: totalApps > 0 ? Math.round((interviews / totalApps) * 100) : 0,
    referralRate: totalApps > 0 ? Math.round((referredApps / totalApps) * 100) : 0,
    timeToOffer: calculateTimeToOffer(),
  };

  // Prepare data for the chart
  const chartData = [
    {
      name: 'Apps per Interview',
      shortName: 'Apps/Interview',
      user: userStats.applicationsPerInterview,
      benchmark: benchmarks.applicationsPerInterview,
      description: 'Applications before getting an interview',
      ideal: 'Lower is better',
    },
    {
      name: 'Interviews per Offer',
      shortName: 'Interviews/Offer',
      user: userStats.interviewsPerOffer,
      benchmark: benchmarks.interviewsPerOffer,
      description: 'Interviews before receiving a job offer',
      ideal: 'Lower is better',
    },
    {
      name: 'Apps per Offer',
      shortName: 'Apps/Offer',
      user: userStats.applicationsPerOffer,
      benchmark: benchmarks.applicationsPerOffer,
      description: 'Applications before receiving a job offer',
      ideal: 'Lower is better',
    },
    {
      name: 'Response Rate',
      shortName: 'Response %',
      user: userStats.responseRate,
      benchmark: benchmarks.responseRate,
      description: 'Applications that get any response',
      ideal: 'Higher is better',
      isPercentage: true,
    },
    {
      name: 'Referral Rate',
      shortName: 'Referral %',
      user: userStats.referralRate,
      benchmark: benchmarks.referralRate,
      description: 'Applications that come from referrals',
      ideal: 'Higher is better',
      isPercentage: true,
    },
    {
      name: 'Time to Offer',
      shortName: 'Days to Offer',
      user: userStats.timeToOffer,
      benchmark: benchmarks.timeToOffer,
      description: 'Average days from application to offer',
      ideal: 'Lower is better',
      unit: 'days',
    },
  ];

  return (
    <div className="p-4 mt-4 border-2 border-dashed rounded-lg border-slate-300 dark:border-slate-600 amoled:border-amoled-foreground">
      <h4 className="mb-4 text-center text-md text-slate-800 dark:text-dark-text amoled:text-amoled-text">Job Search Efficiency Comparison</h4>
      <p className="mb-6 text-sm text-center text-slate-600 dark:text-slate-400">
        See how your job search metrics compare to industry averages
      </p>
      
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 100,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="shortName" 
              angle={-45} 
              textAnchor="end" 
              height={80}
              tick={{ fontSize: 11 }}
              interval={0}
            />
            <YAxis 
              label={{ 
                value: 'Count', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle' }
              }} 
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = chartData.find(item => item.shortName === label);
                  return (
                    <div className="p-3 bg-white dark:bg-dark-card amoled:bg-amoled-card border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg min-w-[200px]">
                      <p className="font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text mb-2">{data?.name || label}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{data?.description}</p>
                      <div className="space-y-1">
                        <p className="text-sm">
                          <span className="inline-block w-3 h-3 bg-[#0088FE] mr-2"></span>
                          <span className="text-slate-700 dark:text-slate-300">Your Stats: </span>
                          <span className="font-semibold">
                            {payload[0].value !== null && payload[0].value !== undefined ? 
                              (data?.isPercentage ? `${payload[0].value}%` : 
                               data?.unit ? `${payload[0].value} ${data.unit}` : 
                               payload[0].value) : 
                              'N/A'}
                          </span>
                        </p>
                        <p className="text-sm">
                          <span className="inline-block w-3 h-3 bg-[#00C49F] mr-2"></span>
                          <span className="text-slate-700 dark:text-slate-300">Industry Avg: </span>
                          <span className="font-semibold">
                            {payload[1].value !== null && payload[1].value !== undefined ? 
                              (data?.isPercentage ? `${payload[1].value}%` : 
                               data?.unit ? `${payload[1].value} ${data.unit}` : 
                               payload[1].value) : 
                              'N/A'}
                          </span>
                        </p>
                      </div>
                      <p className="text-xs mt-2 text-slate-500 dark:text-slate-400">{data?.ideal}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend 
              formatter={(value) => {
                if (value === 'user') return 'Your Stats';
                if (value === 'benchmark') return 'Industry Average';
                return value;
              }}
            />
            <Bar dataKey="user" name="user" fill="#0088FE">
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-user-${index}`} 
                  fill={entry.user !== null && entry.user !== undefined ? '#0088FE' : '#CCCCCC'} 
                />
              ))}
            </Bar>
            <Bar dataKey="benchmark" name="benchmark" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chartData.map((metric, index) => (
          <div 
            key={index} 
            className="p-4 bg-white dark:bg-dark-card amoled:bg-amoled-card border border-slate-200 dark:border-slate-600 rounded-lg shadow-sm"
          >
            <div className="flex justify-between items-start">
              <h5 className="font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text">{metric.name}</h5>
              <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full">
                {metric.ideal}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 mb-3">{metric.description}</p>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-dark-text amoled:text-amoled-text">
                  {metric.user !== null && metric.user !== undefined ? 
                    (metric.isPercentage ? `${metric.user}%` : 
                     metric.unit ? `${metric.user} ${metric.unit}` : 
                     metric.user) : 
                    'N/A'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Your Stats</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-slate-500 dark:text-slate-400">
                  {metric.benchmark !== null && metric.benchmark !== undefined ? 
                    (metric.isPercentage ? `${metric.benchmark}%` : 
                     metric.unit ? `${metric.benchmark} ${metric.unit}` : 
                     metric.benchmark) : 
                    'N/A'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Industry Avg</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <p className="mt-6 text-xs text-center text-slate-400">
        *Industry benchmarks are based on general averages and may vary by field and experience level.
      </p>
    </div>
  );
};

const SourceAnalysisChart = ({ applications }: { applications: Application[] }) => {
  // Group applications by source
  const sourceData = applications.reduce((acc, app) => {
    const source = app.source === 'Other' && app.sourceOther ? app.sourceOther : app.source;
    const existing = acc.find((item: { name: string; }) => item.name === source);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: source, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Group by referral status
  const referralData = applications.reduce(
    (acc, app) => {
      if (app.referral === 'Y') {
        acc[0].value++;
      } else {
        acc[1].value++;
      }
      return acc;
    },
    [
      { name: 'Referred', value: 0 },
      { name: 'Not Referred', value: 0 },
    ]
  );

  return (
    <div className="space-y-6">
      <div className="p-4 border-2 border-dashed rounded-lg border-slate-300 dark:border-slate-600 amoled:border-amoled-foreground">
        <h4 className="mb-4 text-center text-md text-slate-800 dark:text-dark-text amoled:text-amoled-text">Applications by Source</h4>
        {sourceData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sourceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#8884d8">
                {sourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-slate-500 dark:text-slate-400">
            No source data available
          </div>
        )}
      </div>

      <div className="p-4 border-2 border-dashed rounded-lg border-slate-300 dark:border-slate-600 amoled:border-amoled-foreground">
        <h4 className="mb-4 text-center text-md text-slate-800 dark:text-dark-text amoled:text-amoled-text">Referral vs Non-Referral Applications</h4>
        {referralData.some(item => item.value > 0) ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie 
                data={referralData} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                outerRadius={100} 
                fill="#8884d8" 
                label
              >
                {referralData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-slate-500 dark:text-slate-400">
            No referral data available
          </div>
        )}
      </div>
    </div>
  );
};

const SuccessMetricsChart = ({ applications }: { applications: Application[] }) => {
  // Calculate success metrics
  const totalApplications = applications.length;
  const successfulApplications = applications.filter(app => 
    app.status === 'Offer' || app.status === 'Final Round' || app.status === 'Round 2'
  ).length;
  
  const responseRate = totalApplications > 0 
    ? Math.round((successfulApplications / totalApplications) * 100) 
    : 0;
  
  // Group by status for success analysis
  const statusData = applications.reduce((acc, app) => {
    const existing = acc.find((item: { name: string; }) => item.name === app.status);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: app.status, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Filter to only show successful statuses
  const successfulStatuses = ['Offer', 'Final Round', 'Round 2'];
  const successData = statusData.filter(item => successfulStatuses.includes(item.name));
  
  const successRateData = [
    { name: 'Successful', value: successData.reduce((sum, item) => sum + item.value, 0) },
    { name: 'Other', value: totalApplications - successData.reduce((sum, item) => sum + item.value, 0) }
  ];

  return (
    <div className="space-y-6">
      <div className="p-4 border-2 border-dashed rounded-lg border-slate-300 dark:border-slate-600 amoled:border-amoled-foreground">
        <h4 className="mb-4 text-center text-md text-slate-800 dark:text-dark-text amoled:text-amoled-text">Success Rate Overview</h4>
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="text-5xl font-bold text-indigo-600 dark:text-indigo-400">
            {responseRate}%
          </div>
          <div className="text-slate-600 dark:text-slate-400">
            Applications reaching final stages
          </div>
        </div>
        
        {successRateData.some(item => item.value > 0) ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie 
                data={successRateData} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                outerRadius={100} 
                fill="#8884d8" 
                label
              >
                {successRateData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.name === 'Successful' ? '#10B981' : '#94A3B8'} 
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-slate-500 dark:text-slate-400">
            No success data available
          </div>
        )}
      </div>

      <div className="p-4 border-2 border-dashed rounded-lg border-slate-300 dark:border-slate-600 amoled:border-amoled-foreground">
        <h4 className="mb-4 text-center text-md text-slate-800 dark:text-dark-text amoled:text-amoled-text">Applications by Status</h4>
        {statusData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#8884d8">
                {statusData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={successfulStatuses.includes(entry.name) ? '#10B981' : COLORS[index % COLORS.length]} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-slate-500 dark:text-slate-400">
            No status data available
          </div>
        )}
      </div>
    </div>
  );
};

const ReferralRateChart = ({ applications }: { applications: Application[] }) => {
  const data = applications.reduce(
    (acc, app) => {
      if (app.referral === 'Y') {
        acc[0].value++;
      } else {
        acc[1].value++;
      }
      return acc;
    },
    [
      { name: 'Referred', value: 0 },
      { name: 'Not Referred', value: 0 },
    ]
  );

  return (
    <div className="p-4 mt-4 border-2 border-dashed rounded-lg border-slate-300 dark:border-slate-600 amoled:border-amoled-foreground">
      <h4 className="mb-2 text-center text-md text-slate-800 dark:text-dark-text amoled:text-amoled-text">Referral Rate</h4>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const ApplicationStatusRadarChart = ({ applications }: { applications: Application[] }) => {
  const data = applications.reduce((acc, app) => {
    const status = app.status || 'N/A';
    const existing = acc.find((item) => item.subject === status);
    if (existing) {
      existing.A++;
    } else {
      acc.push({ subject: status, A: 1, fullMark: applications.length });
    }
    return acc;
  }, [] as { subject: string; A: number; fullMark: number }[]);

  return (
    <div className="p-4 mt-4 border-2 border-dashed rounded-lg border-slate-300 dark:border-slate-600 amoled:border-amoled-foreground">
      <h4 className="mb-2 text-center text-md text-slate-800 dark:text-dark-text amoled:text-amoled-text">Application Status Distribution</h4>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis />
          <Radar name="Applications" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};


const AnalyticsDashboard = ({ applications }: { applications: Application[] }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div>
      <div className="flex flex-wrap justify-center mb-4 gap-1">
        <button
          className={`px-3 py-2 text-sm font-semibold ${activeTab === 'overview' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`px-3 py-2 text-sm font-semibold ${activeTab === 'timeline' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}
          onClick={() => setActiveTab('timeline')}
        >
          Timeline
        </button>
        <button
          className={`px-3 py-2 text-sm font-semibold ${activeTab === 'distribution' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}
          onClick={() => setActiveTab('distribution')}
        >
          Distribution
        </button>
        <button
          className={`px-3 py-2 text-sm font-semibold ${activeTab === 'sources' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}
          onClick={() => setActiveTab('sources')}
        >
          Sources
        </button>
        <button
          className={`px-3 py-2 text-sm font-semibold ${activeTab === 'success' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}
          onClick={() => setActiveTab('success')}
        >
          Success Metrics
        </button>
        <button
          className={`px-3 py-2 text-sm font-semibold ${activeTab === 'benchmarks' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}
          onClick={() => setActiveTab('benchmarks')}
        >
          Benchmarks
        </button>
      </div>

      {activeTab === 'overview' && (
        <>
          <ApplicationsByStatusChart applications={applications} />
          <ReferralRateChart applications={applications} />
        </>
      )}

      {activeTab === 'timeline' && (
        <TrendAnalysisChart applications={applications} />
      )}

      {activeTab === 'distribution' && (
        <ApplicationStatusRadarChart applications={applications} />
      )}

      {activeTab === 'sources' && (
        <SourceAnalysisChart applications={applications} />
      )}

      {activeTab === 'success' && (
        <SuccessMetricsChart applications={applications} />
      )}

      {activeTab === 'benchmarks' && (
        <BenchmarkComparison applications={applications} />
      )}
    </div>
  );
};

export default AnalyticsDashboard;
