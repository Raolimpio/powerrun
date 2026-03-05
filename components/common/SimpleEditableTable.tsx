'use client';

import { Edit3, Save, X, Download, Check, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

// ========================================
// 🎯 COMPONENTE SIMPLES DE CÉLULA EDITÁVEL
// ========================================

interface SimpleEditableCellProps {
  value: string;
  onSave: (newValue: string) => void;
  placeholder?: string;
  className?: string;
}

function SimpleEditableCell({
  value,
  onSave,
  placeholder = '',
  className = '',
}: SimpleEditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = () => {
    if (editValue !== value) {
      onSave(editValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className='relative'>
        <input
          type='text'
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          placeholder={placeholder}
          className={`w-full p-2 border-2 border-blue-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
          autoFocus
        />

        <div className='absolute -right-12 top-0 flex space-x-1'>
          <button
            onClick={handleSave}
            className='p-1 text-green-600 hover:bg-green-100 rounded'
            title='Salvar'
          >
            <Check className='h-4 w-4' />
          </button>
          <button
            onClick={handleCancel}
            className='p-1 text-red-600 hover:bg-red-100 rounded'
            title='Cancelar'
          >
            <X className='h-4 w-4' />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group cursor-pointer hover:bg-blue-50 rounded-md p-2 transition-colors border border-transparent hover:border-blue-200 ${className}`}
      onClick={() => setIsEditing(true)}
    >
      <div className='flex items-center justify-between'>
        <span className='text-sm text-gray-900'>
          {value || <span className='text-gray-400 italic'>{placeholder}</span>}
        </span>
        <Edit3 className='h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity' />
      </div>
    </div>
  );
}

// ========================================
// 🎯 TABELA SIMPLES E FUNCIONAL
// ========================================

interface SimpleEditableTableProps {
  data: Array<Record<string, any>>;
  columns: Array<{
    key: string;
    label: string;
    editable?: boolean;
  }>;
  onDataChange: (newData: Array<Record<string, any>>) => void;
  title?: string;
  className?: string;
}

export function SimpleEditableTable({
  data,
  columns,
  onDataChange,
  title,
  className = '',
}: SimpleEditableTableProps) {
  const [localData, setLocalData] = useState(data);
  const [changes, setChanges] = useState<
    Array<{
      rowIndex: number;
      column: string;
      oldValue: any;
      newValue: any;
    }>
  >([]);

  useEffect(() => {
    setLocalData(data);
    setChanges([]);
  }, [data]);

  const handleCellChange = (rowIndex: number, column: string, newValue: string) => {
    const oldValue = localData[rowIndex][column];

    setLocalData((prev) => {
      const newData = [...prev];
      newData[rowIndex] = { ...newData[rowIndex], [column]: newValue };
      return newData;
    });

    // Track changes
    const change = { rowIndex, column, oldValue, newValue };
    setChanges((prev) => {
      const existingChangeIndex = prev.findIndex(
        (c) => c.rowIndex === rowIndex && c.column === column
      );

      if (existingChangeIndex >= 0) {
        const newChanges = [...prev];
        newChanges[existingChangeIndex] = change;
        return newChanges;
      } else {
        return [...prev, change];
      }
    });
  };

  const handleSaveAll = () => {
    onDataChange(localData);
    setChanges([]);
  };

  const handleReset = () => {
    setLocalData(data);
    setChanges([]);
  };

  const getChangedRows = () => {
    return Array.from(new Set(changes.map((c) => c.rowIndex)));
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      {/* Header */}
      <div className='bg-gray-50 border-b border-gray-200 p-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='text-lg font-semibold text-gray-900'>{title || 'Tabela Editável'}</h3>
            <p className='text-sm text-gray-600 mt-1'>
              Clique nas células para editar. Enter para salvar, Escape para cancelar.
            </p>
          </div>

          <div className='flex items-center space-x-3'>
            {/* Change Indicator */}
            {changes.length > 0 && (
              <div className='flex items-center space-x-2 text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200'>
                <AlertCircle className='h-4 w-4' />
                <span className='text-sm font-medium'>
                  {changes.length} alteração{changes.length !== 1 ? 'ões' : ''}
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className='flex space-x-2'>
              <button
                onClick={handleReset}
                disabled={changes.length === 0}
                className='inline-flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              >
                <X className='h-4 w-4' />
                <span>Desfazer</span>
              </button>

              <button
                onClick={handleSaveAll}
                disabled={changes.length === 0}
                className='inline-flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              >
                <Save className='h-4 w-4' />
                <span>Salvar Tudo</span>
              </button>
            </div>
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
                  className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {localData.map((row, rowIndex) => {
              const isChanged = getChangedRows().includes(rowIndex);

              return (
                <tr
                  key={rowIndex}
                  className={`hover:bg-gray-50 transition-colors ${
                    isChanged ? 'bg-blue-50 border-l-4 border-l-blue-400' : ''
                  }`}
                >
                  {columns.map((column) => (
                    <td key={column.key} className='px-4 py-3'>
                      {column.editable !== false ? (
                        <SimpleEditableCell
                          value={row[column.key] || ''}
                          onSave={(newValue) => handleCellChange(rowIndex, column.key, newValue)}
                          placeholder={`Editar ${column.label.toLowerCase()}`}
                        />
                      ) : (
                        <span className='text-sm text-gray-900'>{row[column.key] || '—'}</span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className='bg-gray-50 border-t border-gray-200 px-4 py-3'>
        <div className='flex items-center justify-between text-sm text-gray-600'>
          <div>
            Total: <span className='font-medium'>{localData.length}</span> registros
          </div>
          <div>
            Alterados: <span className='font-medium'>{getChangedRows().length}</span> registros
          </div>
        </div>
      </div>
    </div>
  );
}

// ========================================
// 🎯 EXPORTADOR DE MUDANÇAS SIMPLES
// ========================================

interface SimpleChangesExporterProps {
  changes: Array<{
    rowIndex: number;
    column: string;
    oldValue: any;
    newValue: any;
  }>;
  originalData: Array<Record<string, any>>;
  filename?: string;
  className?: string;
}

export function SimpleChangesExporter({
  changes,
  originalData,
  filename = 'changes',
  className = '',
}: SimpleChangesExporterProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportChanges = async () => {
    if (changes.length === 0) return;

    setIsExporting(true);

    try {
      const changesData = {
        metadata: {
          exportedAt: new Date().toISOString(),
          exportedBy: 'Power Run Admin',
          totalChanges: changes.length,
          affectedRows: Array.from(new Set(changes.map((c) => c.rowIndex))).length,
        },
        changes: changes.map((change) => ({
          ...change,
          productName: originalData[change.rowIndex]?.name || `Produto ${change.rowIndex + 1}`,
          columnLabel: change.column,
        })),
      };

      const jsonString = JSON.stringify(changesData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      setTimeout(() => {
        setIsExporting(false);
      }, 1000);
    } catch (error) {
      console.error('Erro ao exportar mudanças:', error);
      setIsExporting(false);
    }
  };

  if (changes.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <button
        onClick={handleExportChanges}
        disabled={isExporting}
        className='inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white font-medium rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
      >
        {isExporting ? (
          <>
            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
            <span>Exportando...</span>
          </>
        ) : (
          <>
            <Download className='h-4 w-4' />
            <span>Exportar Mudanças ({changes.length})</span>
          </>
        )}
      </button>
    </div>
  );
}
