'use client';

import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

interface AnalyticsChartsProps {
  data: {
    dailyRegistrations: any[];
    dailyTraffic: any[];
    categoryDistribution: any[];
    statusBreakdown: any[];
  };
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  const [activeTrend, setActiveTrend] = useState<'registrations' | 'traffic'>('registrations');

  const chartData = activeTrend === 'registrations' ? data.dailyRegistrations : data.dailyTraffic;
  const chartColor = activeTrend === 'registrations' ? '#6366f1' : '#10b981';
  const chartTitle = activeTrend === 'registrations' ? 'New Registrations' : 'Platform Traffic';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Registration / Traffic Trend */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm transition-all duration-300">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">{chartTitle} (Last 14 Days)</h3>
            <p className="text-[10px] text-slate-400 font-medium">Daily performance metrics</p>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTrend('registrations')}
              className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${
                activeTrend === 'registrations' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Registrations
            </button>
            <button 
              onClick={() => setActiveTrend('traffic')}
              className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${
                activeTrend === 'traffic' 
                ? 'bg-white text-emerald-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Traffic
            </button>
          </div>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8' }}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '12px' }}
                itemStyle={{ color: chartColor, fontWeight: 'bold' }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke={chartColor} 
                strokeWidth={3} 
                dot={{ fill: chartColor, strokeWidth: 2, r: 4, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-800 mb-6 flex items-center justify-between">
          Service Distribution
          <span className="text-[10px] uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold">Volume</span>
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.categoryDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#64748b', fontWeight: 500 }}
                width={80}
              />
              <Tooltip cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20} animationDuration={1500}>
                {data.categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
