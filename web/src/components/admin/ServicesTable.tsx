'use client';

import React, { useState } from 'react';
import { GripVertical, MoreHorizontal, Edit, Trash, Power, PowerOff } from 'lucide-react';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { toast } from 'sonner';

interface Service {
  id: string;
  name: string;
  slug: string;
  category: string;
  isActive: boolean;
  _count?: {
    institutes: number;
  };
}

interface ServicesTableProps {
  initialServices: Service[];
}

export function ServicesTable({ initialServices }: ServicesTableProps) {
  const [services, setServices] = useState(initialServices);

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/admin/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (!res.ok) throw new Error();
      setServices(services.map(s => s.id === id ? { ...s, isActive: !currentStatus } : s));
      toast.success(`Service ${!currentStatus ? 'activated' : 'deactivated'}`);
    } catch {
      toast.error('Failed to update service status');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50">
            <th className="w-10 px-3 py-3"></th>
            <th className="text-left font-semibold text-slate-600 px-4 py-3 text-xs uppercase tracking-wider">Service Name</th>
            <th className="text-left font-semibold text-slate-600 px-4 py-3 text-xs uppercase tracking-wider">Category</th>
            <th className="text-center font-semibold text-slate-600 px-4 py-3 text-xs uppercase tracking-wider">Institutes</th>
            <th className="text-center font-semibold text-slate-600 px-4 py-3 text-xs uppercase tracking-wider">Status</th>
            <th className="text-right font-semibold text-slate-600 px-5 py-3 text-xs uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {services.map((service) => (
            <tr key={service.id} className="hover:bg-slate-50/50 transition-colors group">
              <td className="px-3 py-3">
                <GripVertical className="h-4 w-4 text-slate-300 group-hover:text-slate-400 cursor-grab" />
              </td>
              <td className="px-4 py-3.5">
                <p className="font-medium text-slate-800">{service.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">/{service.slug}</p>
              </td>
              <td className="px-4 py-3.5 text-slate-500">{service.category || 'General'}</td>
              <td className="px-4 py-3.5 text-center">
                <span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-slate-100 px-2 text-xs font-medium text-slate-600">
                  {service._count?.institutes || 0}
                </span>
              </td>
              <td className="px-4 py-3.5 flex justify-center">
                <StatusBadge status={service.isActive ? 'ACTIVE' : 'INACTIVE'} />
              </td>
              <td className="px-5 py-3.5 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button 
                    onClick={() => toggleStatus(service.id, service.isActive)}
                    className={`p-1.5 rounded-md transition-colors ${service.isActive ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
                    title={service.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {service.isActive ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                  </button>
                  <button className="p-1.5 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
