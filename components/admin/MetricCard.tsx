'use client';

import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'red' | 'blue' | 'green' | 'gray';
}

const colorStyles = {
  red: {
    bg: 'bg-red-50',
    icon: 'text-[#9c1006]',
    border: 'border-red-200',
    trend: 'text-[#9c1006]',
  },
  blue: {
    bg: 'bg-cyan-50',
    icon: 'text-[#61fbfe]',
    border: 'border-cyan-200',
    trend: 'text-[#61fbfe]',
  },
  green: {
    bg: 'bg-green-50',
    icon: 'text-green-600',
    border: 'border-green-200',
    trend: 'text-green-600',
  },
  gray: {
    bg: 'bg-gray-50',
    icon: 'text-[#374151]',
    border: 'border-gray-300',
    trend: 'text-gray-700',
  },
};

export function MetricCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  color = 'gray',
}: MetricCardProps) {
  const styles = colorStyles[color];

  return (
    <div className={`${styles.bg} border ${styles.border} rounded-xl p-6 hover:shadow-md transition-all`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 bg-white rounded-lg ${styles.border} border`}>
          <Icon className={`w-5 h-5 ${styles.icon}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            <span>{trend.isPositive ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-[#374151] mb-2">{value}</p>
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
    </div>
  );
}

