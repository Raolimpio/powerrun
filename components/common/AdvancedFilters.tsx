'use client';

import { Filter, X, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FilterOption {
  key: string;
  label: string;
  type: 'text' | 'select' | 'range';
  options?: string[];
}

interface AdvancedFiltersProps {
  filters: FilterOption[];
  onApplyFilters: (filters: Record<string, any>) => void;
  onClearFilters: () => void;
  className?: string;
}

export function AdvancedFilters({
  filters,
  onApplyFilters,
  onClearFilters,
  className = '',
}: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});

  const handleFilterChange = (key: string, value: any) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    const nonEmptyFilters = Object.entries(filterValues).reduce(
      (acc, [key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, any>
    );

    setActiveFilters(nonEmptyFilters);
    onApplyFilters(nonEmptyFilters);
    setIsExpanded(false);
  };

  const handleClearFilters = () => {
    setFilterValues({});
    setActiveFilters({});
    onClearFilters();
  };

  const getActiveFiltersCount = () => {
    return Object.keys(activeFilters).length;
  };

  const removeFilter = (key: string) => {
    const newFilters = { ...activeFilters };
    delete newFilters[key];
    setActiveFilters(newFilters);
    onApplyFilters(newFilters);
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      {/* Filter Toggle */}
      <div className='px-4 py-3 border-b border-gray-200'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setIsExpanded(!isExpanded)}
              className='flex items-center space-x-2'
            >
              <Filter className='h-4 w-4' />
              <span>Filtros</span>
              {getActiveFiltersCount() > 0 && (
                <Badge variant='secondary' className='ml-2'>
                  {getActiveFiltersCount()}
                </Badge>
              )}
              {isExpanded ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
            </Button>

            {getActiveFiltersCount() > 0 && (
              <Button
                variant='ghost'
                size='sm'
                onClick={handleClearFilters}
                className='text-red-600 hover:text-red-700'
              >
                Limpar todos
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters */}
        {getActiveFiltersCount() > 0 && (
          <div className='mt-3 flex flex-wrap gap-2'>
            {Object.entries(activeFilters).map(([key, value]) => {
              const filter = filters.find((f) => f.key === key);
              return (
                <Badge key={key} variant='secondary' className='flex items-center space-x-2'>
                  <span className='text-xs'>
                    {filter?.label}: {String(value)}
                  </span>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => removeFilter(key)}
                    className='h-4 w-4 p-0 hover:bg-red-100'
                  >
                    <X className='h-3 w-3' />
                  </Button>
                </Badge>
              );
            })}
          </div>
        )}
      </div>

      {/* Filter Form */}
      {isExpanded && (
        <div className='p-4 space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {filters.map((filter) => (
              <div key={filter.key} className='space-y-2'>
                <Label htmlFor={filter.key} className='text-sm font-medium text-gray-700'>
                  {filter.label}
                </Label>

                {filter.type === 'select' && filter.options ? (
                  <select
                    id={filter.key}
                    value={filterValues[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  >
                    <option value=''>Todos</option>
                    {filter.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : filter.type === 'range' ? (
                  <div className='flex items-center space-x-2'>
                    <Input
                      type='number'
                      placeholder='Min'
                      value={filterValues[`${filter.key}_min`] || ''}
                      onChange={(e) => handleFilterChange(`${filter.key}_min`, e.target.value)}
                      className='text-sm'
                    />
                    <span className='text-gray-500'>-</span>
                    <Input
                      type='number'
                      placeholder='Max'
                      value={filterValues[`${filter.key}_max`] || ''}
                      onChange={(e) => handleFilterChange(`${filter.key}_max`, e.target.value)}
                      className='text-sm'
                    />
                  </div>
                ) : (
                  <Input
                    id={filter.key}
                    type='text'
                    placeholder={`Filtrar por ${filter.label.toLowerCase()}...`}
                    value={filterValues[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className='flex items-center justify-end space-x-3 pt-4 border-t border-gray-200'>
            <Button variant='outline' onClick={() => setIsExpanded(false)}>
              Cancelar
            </Button>
            <Button onClick={handleApplyFilters} className='flex items-center space-x-2'>
              <Search className='h-4 w-4' />
              <span>Aplicar Filtros</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Exportação default também para garantir compatibilidade
export default AdvancedFilters;