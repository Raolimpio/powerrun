'use client';

import { useState } from 'react';
import { Calendar, Filter, Download, Search, ChevronDown, ChevronUp, X } from 'lucide-react';
// Temporariamente comentado para debug do erro webpack
// import { AdvancedFilters } from '@/components/common/AdvancedFilters';

interface FilterOption {
  key: string;
  label: string;
  type: 'text' | 'select' | 'range';
  options?: string[];
}

interface FilterBarProps {
  period: '7d' | '30d' | '90d' | 'all' | 'custom';
  onPeriodChange: (period: '7d' | '30d' | '90d' | 'all' | 'custom') => void;
  startDate?: Date | null;
  endDate?: Date | null;
  onStartDateChange?: (date: Date | null) => void;
  onEndDateChange?: (date: Date | null) => void;
  onExport?: () => void;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  advancedFilters?: FilterOption[];
  onAdvancedFiltersChange?: (filters: Record<string, any>) => void;
}

export function FilterBar({
  period,
  onPeriodChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onExport,
  searchPlaceholder = 'Buscar...',
  onSearch,
  advancedFilters = [],
  onAdvancedFiltersChange,
}: FilterBarProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleApplyAdvancedFilters = (filters: Record<string, any>) => {
    if (onAdvancedFiltersChange) {
      onAdvancedFiltersChange(filters);
    }
  };

  const handleClearAdvancedFilters = () => {
    if (onAdvancedFiltersChange) {
      onAdvancedFiltersChange({});
    }
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-8 py-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search Bar */}
          {onSearch && (
            <div className="flex-1 min-w-[200px] max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  onChange={(e) => onSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9c1006]/20 focus:border-[#9c1006]"
                />
              </div>
            </div>
          )}

          {/* Period Filter */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={period}
              onChange={(e) => {
                const newPeriod = e.target.value as typeof period;
                onPeriodChange(newPeriod);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#9c1006]/20 focus:border-[#9c1006]"
            >
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="90d">Últimos 90 dias</option>
              <option value="all">Todo o período</option>
              <option value="custom">Período personalizado</option>
            </select>
          </div>

          {/* Custom Date Range */}
          {period === 'custom' && onStartDateChange && onEndDateChange && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate ? startDate.toISOString().split('T')[0] : ''}
                onChange={(e) => onStartDateChange(e.target.value ? new Date(e.target.value) : null)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#9c1006]/20 focus:border-[#9c1006]"
              />
              <span className="text-sm text-gray-500">até</span>
              <input
                type="date"
                value={endDate ? endDate.toISOString().split('T')[0] : ''}
                onChange={(e) => onEndDateChange(e.target.value ? new Date(e.target.value) : null)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#9c1006]/20 focus:border-[#9c1006]"
              />
            </div>
          )}

          {/* Filter Button */}
          {advancedFilters.length > 0 && (
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filtros Avançados
              {showAdvancedFilters ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          )}

          {/* Export Button */}
          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#9c1006] rounded-lg hover:bg-[#9c1006]/90 transition-colors"
            >
              <Download className="w-4 h-4" />
              Exportar
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters Panel - Versão simplificada inline para evitar erro webpack */}
      {showAdvancedFilters && advancedFilters.length > 0 && (
        <div className="px-8 pb-4 border-t border-gray-200">
          <div className="bg-white border border-gray-200 rounded-lg mt-4">
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {advancedFilters.map((filter) => (
                  <div key={filter.key} className="space-y-2">
                    <label htmlFor={filter.key} className="text-sm font-medium text-gray-700 block">
                      {filter.label}
                    </label>
                    {filter.type === 'select' && filter.options ? (
                      <select
                        id={filter.key}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => {
                          const newFilters: Record<string, any> = {};
                          newFilters[filter.key] = e.target.value;
                          handleApplyAdvancedFilters(newFilters);
                        }}
                      >
                        <option value="">Todos</option>
                        {filter.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : filter.type === 'range' ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          placeholder="Min"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onChange={(e) => {
                            const newFilters: Record<string, any> = {};
                            newFilters[`${filter.key}_min`] = e.target.value;
                            handleApplyAdvancedFilters(newFilters);
                          }}
                        />
                        <span className="text-gray-500">-</span>
                        <input
                          type="number"
                          placeholder="Max"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onChange={(e) => {
                            const newFilters: Record<string, any> = {};
                            newFilters[`${filter.key}_max`] = e.target.value;
                            handleApplyAdvancedFilters(newFilters);
                          }}
                        />
                      </div>
                    ) : (
                      <input
                        id={filter.key}
                        type="text"
                        placeholder={`Filtrar por ${filter.label.toLowerCase()}...`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => {
                          const newFilters: Record<string, any> = {};
                          newFilters[filter.key] = e.target.value;
                          handleApplyAdvancedFilters(newFilters);
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowAdvancedFilters(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setShowAdvancedFilters(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Search className="h-4 w-4" />
                  <span>Aplicar Filtros</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

