import { LucideIcon } from 'lucide-react';

type KPICardProps = {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  variant?: 'default' | 'primary' | 'warning' | 'danger';
};

const variants = {
  default:  { card: 'bg-white', iconBg: 'bg-slate-100', iconColor: 'text-slate-500', valueColor: 'text-slate-900' },
  primary:  { card: 'bg-indigo-600 text-white', iconBg: 'bg-indigo-500/20', iconColor: 'text-indigo-200', valueColor: 'text-white' },
  warning:  { card: 'bg-white', iconBg: 'bg-amber-100', iconColor: 'text-amber-600', valueColor: 'text-slate-900' },
  danger:   { card: 'bg-white', iconBg: 'bg-rose-100', iconColor: 'text-rose-600', valueColor: 'text-slate-900' },
};

export function KPICard({ title, value, subtitle, icon: Icon, trend, variant = 'default' }: KPICardProps) {
  const v = variants[variant];

  return (
    <div className={`rounded-xl border border-slate-200/60 shadow-sm p-5 relative overflow-hidden ${v.card}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider ${variant === 'primary' ? 'text-indigo-200' : 'text-slate-500'}`}>
            {title}
          </p>
          <p className={`text-3xl font-bold mt-1 tracking-tight ${v.valueColor}`}>
            {value}
          </p>
          {subtitle && (
            <p className={`text-xs mt-1 ${variant === 'primary' ? 'text-indigo-200/70' : 'text-slate-400'}`}>
              {subtitle}
            </p>
          )}
          {trend && (
            <p className={`text-xs mt-2 font-medium ${trend.value >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
            </p>
          )}
        </div>
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${v.iconBg}`}>
          <Icon className={`h-5 w-5 ${v.iconColor}`} />
        </div>
      </div>
    </div>
  );
}
