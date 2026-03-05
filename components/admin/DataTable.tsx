'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  maxRows?: number;
  emptyMessage?: string;
}

export function DataTable({ 
  data, 
  columns, 
  maxRows = 10,
  emptyMessage = 'Nenhum dado disponível'
}: DataTableProps) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const sortedData = sortKey
    ? [...data].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        const modifier = sortDirection === 'asc' ? 1 : -1;
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return (aVal - bVal) * modifier;
        }
        
        return String(aVal).localeCompare(String(bVal)) * modifier;
      })
    : data;

  const displayData = sortedData.slice(0, maxRows);

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`pb-3 text-xs font-semibold text-gray-600 uppercase tracking-wider ${
                  column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'
                } ${column.sortable !== false ? 'cursor-pointer hover:text-[#9c1006]' : ''}`}
                onClick={() => column.sortable !== false && handleSort(column.key)}
              >
                <div className={`flex items-center gap-1 ${
                  column.align === 'right' ? 'justify-end' : column.align === 'center' ? 'justify-center' : 'justify-start'
                }`}>
                  <span>{column.label}</span>
                  {column.sortable !== false && sortKey === column.key && (
                    sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayData.map((row, idx) => (
            <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`py-3 text-sm ${
                    column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'
                  }`}
                >
                  {column.render ? (
                    column.render(row[column.key], row)
                  ) : (
                    <span className={idx < 3 ? 'font-semibold text-[#374151]' : 'text-gray-600'}>
                      {typeof row[column.key] === 'number' 
                        ? row[column.key].toLocaleString('pt-BR') 
                        : row[column.key]
                      }
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      {data.length > maxRows && (
        <div className="mt-4 text-center text-xs text-gray-500">
          Mostrando {maxRows} de {data.length} registros
        </div>
      )}
    </div>
  );
}

