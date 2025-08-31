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

const ApplicationTimelineChart = ({ applications }: { applications: Application[] }) => {
  const data = applications
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc, app) => {
      const date = new Date(app.date).toLocaleDateString();
      const existing = acc.find((item) => item.date === date);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ date, count: 1 });
      }
      return acc;
    }, [] as { date: string; count: number }[]);

  return (
    <div className="p-4 mt-4 border-2 border-dashed rounded-lg border-slate-300 dark:border-slate-600 amoled:border-amoled-foreground">
      <h4 className="mb-2 text-center text-md text-slate-800 dark:text-dark-text amoled:text-amoled-text">Application Timeline</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
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
      <div className="flex justify-center mb-4">
        <button
          className={`px-4 py-2 font-semibold ${activeTab === 'overview' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`px-4 py-2 font-semibold ${activeTab === 'timeline' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}
          onClick={() => setActiveTab('timeline')}
        >
          Timeline
        </button>
      </div>

      {activeTab === 'overview' && (
        <>
          <ApplicationsByStatusChart applications={applications} />
          <ReferralRateChart applications={applications} />
          <ApplicationStatusRadarChart applications={applications} />
        </>
      )}

      {activeTab === 'timeline' && (
        <ApplicationTimelineChart applications={applications} />
      )}
    </div>
  );
};

export default AnalyticsDashboard;
