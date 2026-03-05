'use client';

import { ChevronLeft, ChevronRight, Search, Download, MoreHorizontal } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CellEditor } from './CellEditor';

interface Column {
  key: string;
  label: string;
  editable?: boolean;
  type?: 'text' | 'number' | 'select';
  options?: string[];
  width?: string;
}

interface DataTableProps {
  data: Array<Record<string, any>>;
  columns: Column[];
  onDataChange?: (_newData: Array<Record<string, any>>) => void;
  title?: string;
  searchable?: boolean;
  filterable?: boolean;
  exportable?: boolean;
  editable?: boolean;
  className?: string;
}

export function DataTable({
  data,
  columns,
  onDataChange,
  title,
  searchable = true,
  filterable = true,
  exportable = true,
  editable = true,
  className = '',
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [editingCell, setEditingCell] = useState<{ row: number; column: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [localData, setLocalData] = useState(data);

  // Filtrar e ordenar dados
  const filteredData = useMemo(() => {
    let filtered = localData;

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Ordenação
    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];

        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [localData, searchTerm, sortColumn, sortDirection]);

  // Paginação
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleEdit = (rowIndex: number, column: string, value: any) => {
    setEditingCell({ row: rowIndex, column });
    setEditValue(String(value || ''));
  };

  const handleSave = () => {
    if (editingCell && onDataChange) {
      const newData = [...localData];
      const actualRowIndex = startIndex + editingCell.row;
      newData[actualRowIndex] = {
        ...newData[actualRowIndex],
        [editingCell.column]: editValue,
      };
      setLocalData(newData);
      onDataChange(newData);
    }
    setEditingCell(null);
    setEditValue('');
  };

  const handleCancel = () => {
    setEditingCell(null);
    setEditValue('');
  };

  // Função reservada para futura implementação de navegação por teclado
  // const handleKeyDown = (e: React.KeyboardEvent) => {
  //   if (e.key === 'Enter' && !e.shiftKey) {
  //     e.preventDefault();
  //     handleSave();
  //   } else if (e.key === 'Escape') {
  //     e.preventDefault();
  //     handleCancel();
  //   }
  // };

  const handleExport = () => {
    const csvContent = [
      columns.map((col) => col.label).join(','),
      ...filteredData.map((row) => columns.map((col) => `"${row[col.key] || ''}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'data'}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      {/* Header */}
      <div className='px-6 py-4 border-b border-gray-200'>
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='text-lg font-semibold text-gray-900'>{title || 'Tabela de Dados'}</h3>
            <p className='text-sm text-gray-600 mt-1'>
              {filteredData.length} de {data.length} registros
            </p>
          </div>

          <div className='flex items-center space-x-3'>
            {searchable && (
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                <Input
                  placeholder='Buscar...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='pl-10 w-64'
                />
              </div>
            )}

            {exportable && (
              <Button
                variant='outline'
                size='sm'
                onClick={handleExport}
                className='flex items-center space-x-2'
              >
                <Download className='h-4 w-4' />
                <span>Exportar</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-gray-50'>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors ${
                    column.width ? `w-${column.width}` : ''
                  }`}
                  onClick={() => handleSort(column.key)}
                >
                  <div className='flex items-center space-x-2'>
                    <span>{column.label}</span>
                    {sortColumn === column.key && (
                      <span className='text-blue-600'>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
              {editable && (
                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20'>
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {paginatedData.map((row, rowIndex) => (
              <tr key={rowIndex} className='hover:bg-gray-50 transition-colors'>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-4 py-3 text-sm ${
                      editingCell?.row === rowIndex && editingCell?.column === column.key
                        ? 'p-0'
                        : ''
                    }`}
                  >
                    {editingCell?.row === rowIndex && editingCell?.column === column.key ? (
                      <CellEditor
                        value={row[column.key]}
                        type={column.type}
                        options={column.options}
                        onSave={(newValue) => {
                          const newData = [...localData];
                          const actualRowIndex = startIndex + editingCell.row;
                          newData[actualRowIndex] = {
                            ...newData[actualRowIndex],
                            [editingCell.column]: newValue,
                          };
                          setLocalData(newData);
                          onDataChange?.(newData);
                          setEditingCell(null);
                        }}
                        onCancel={() => setEditingCell(null)}
                        placeholder={`Digite ${column.label.toLowerCase()}...`}
                      />
                    ) : (
                      <div
                        className={`group relative ${
                          column.editable && editable
                            ? 'cursor-pointer hover:bg-blue-50 rounded px-2 py-1 -mx-2 -my-1 transition-colors duration-150'
                            : ''
                        }`}
                        onClick={() => {
                          if (column.editable && editable) {
                            handleEdit(rowIndex, column.key, row[column.key]);
                          }
                        }}
                      >
                        {column.key === 'line' ? (
                          <Badge variant='outline' className='text-xs'>
                            {row[column.key]}
                          </Badge>
                        ) : (
                          <span className='text-gray-900'>{row[column.key] || '—'}</span>
                        )}
                        {column.editable && editable && (
                          <div className='absolute -top-8 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10'>
                            Clique para editar
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                ))}
                {editable && (
                  <td className='px-4 py-3 text-sm'>
                    <Button
                      size='sm'
                      variant='ghost'
                      onClick={() => {
                        // Implementar ações adicionais
                      }}
                      className='h-8 w-8 p-0'
                    >
                      <MoreHorizontal className='h-4 w-4' />
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className='px-6 py-4 border-t border-gray-200'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <span className='text-sm text-gray-700'>
              Mostrando {startIndex + 1} a{' '}
              {Math.min(startIndex + itemsPerPage, filteredData.length)} de {filteredData.length}{' '}
              registros
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className='text-sm border border-gray-300 rounded px-2 py-1'
            >
              <option value={10}>10 por página</option>
              <option value={20}>20 por página</option>
              <option value={50}>50 por página</option>
              <option value={100}>100 por página</option>
            </select>
          </div>

          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>

            <span className='text-sm text-gray-700'>
              Página {currentPage} de {totalPages}
            </span>

            <Button
              variant='outline'
              size='sm'
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
