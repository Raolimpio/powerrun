'use client';

import { RefreshCw, LogOut, User, Bell } from 'lucide-react';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  lastUpdate?: string;
  onRefresh?: () => void;
  onLogout?: () => void;
  refreshing?: boolean;
}

export function DashboardHeader({ 
  title, 
  subtitle, 
  lastUpdate, 
  onRefresh, 
  onLogout,
  refreshing = false 
}: DashboardHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[#374151]">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">
                {subtitle}
                {lastUpdate && (
                  <span className="ml-2 text-xs text-gray-400">
                    • Atualizado: {lastUpdate}
                  </span>
                )}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#9c1006] rounded-full"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-[#9c1006] rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-[#374151]">Admin</span>
            </div>

            {/* Refresh Button */}
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden md:inline">Atualizar</span>
              </button>
            )}

            {/* Logout Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Sair</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

