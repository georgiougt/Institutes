'use client';

import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';

interface AnalyticsChartsProps {
  data: {
    dailyRegistrations: any[];
    categoryDistribution: any[];
    statusBreakdown: any[];
  };
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Registration Trend */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-800 mb-6 flex items-center justify-between">
          New Registrations (Last 14 Days)
          <span className="text-[10px] uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold">Trend</span>
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.dailyRegistrations}>
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
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#6366f1" 
                strokeWidth={3} 
                dot={{ fill: '#6366f1', strokeWidth: 2, r: 4, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
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
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
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
