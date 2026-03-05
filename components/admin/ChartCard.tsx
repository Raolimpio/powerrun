'use client';

import { LucideIcon } from 'lucide-react';

interface ChartCardProps {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function ChartCard({ title, icon: Icon, children, action }: ChartCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-[#374151]" />}
          <h3 className="text-base font-semibold text-[#374151]">{title}</h3>
        </div>
        {action && (
          <button
            onClick={action.onClick}
            className="text-sm font-medium text-[#9c1006] hover:text-[#9c1006]/80 transition-colors"
          >
            {action.label}
          </button>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}

