'use client';

import { Save, RotateCcw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { CopyToClipboard, CopyChanges } from './CopyToClipboard';
import { MultiExporter } from './MultiExporter';

// ========================================
// 🎯 TABELA SIMPLES IGUAL EXCEL
// ========================================

interface ExcelLikeTableProps {
  data: Array<Record<string, any>>;
  columns: Array<{
    key: string;
    label: string;
    editable?: boolean;
  }>;
  onDataChange: (newData: Array<Record<string, any>>) => void;
  title?: string;
}

export function ExcelLikeTable({ data, columns, onDataChange, title }: ExcelLikeTableProps) {
  const [localData, setLocalData] = useState(data);
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [changes, setChanges] = useState<
    Array<{
      row: number;
      col: string;
      oldValue: any;
      newValue: any;
    }>
  >([]);

  useEffect(() => {
    setLocalData(data);
    setChanges([]);
  }, [data]);

  const startEdit = (row: number, col: string) => {
    setEditingCell({ row, col });
    setEditValue(localData[row][col] || '');
  };

  const saveEdit = () => {
    if (!editingCell) return;

    const { row, col } = editingCell;
    const oldValue = localData[row][col];
    const newValue = editValue;

    if (oldValue !== newValue) {
      // Atualizar dados
      const newData = [...localData];
      newData[row] = { ...newData[row], [col]: newValue };
      setLocalData(newData);

      // Registrar mudança
      const change = { row, col, oldValue, newValue };
      setChanges((prev) => {
        const existing = prev.find((c) => c.row === row && c.col === col);
        if (existing) {
          return prev.map((c) => (c.row === row && c.col === col ? change : c));
        }
        return [...prev, change];
      });
    }

    setEditingCell(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const saveAll = () => {
    onDataChange(localData);
    setChanges([]);
  };

  const resetAll = () => {
    setLocalData(data);
    setChanges([]);
  };

  const exportChanges = () => {
    // Esta função agora é gerenciada pelo MultiExporter
    console.log('Exportação gerenciada pelo MultiExporter');
  };

  const getChangedRows = () => {
    return Array.from(new Set(changes.map((c) => c.row)));
  };

  return (
    <div className='bg-white rounded-lg border border-gray-200 shadow-sm'>
      {/* Header */}
      <div className='bg-gray-50 border-b border-gray-200 p-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='text-lg font-semibold text-gray-900'>{title || 'Tabela Editável'}</h3>
            <p className='text-sm text-gray-600 mt-1'>
              Clique para editar • Enter para salvar • Escape para cancelar
            </p>
          </div>

          <div className='flex items-center space-x-3'>
            {/* Contador de mudanças */}
            {changes.length > 0 && (
              <div className='text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200'>
                <span className='text-sm font-medium'>
                  {changes.length} mudança{changes.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}

            {/* Botões */}
            <div className='flex space-x-2'>
              <button
                onClick={resetAll}
                disabled={changes.length === 0}
                className='inline-flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <RotateCcw className='h-4 w-4' />
                <span>Desfazer</span>
              </button>

              <button
                onClick={saveAll}
                disabled={changes.length === 0}
                className='inline-flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <Save className='h-4 w-4' />
                <span>Salvar</span>
              </button>

              {/* Copy Buttons */}
              <CopyToClipboard
                data={localData}
                format='csv'
                filename='tabela'
                size='sm'
                variant='secondary'
                className='ml-2'
              />

              <CopyChanges
                changes={changes}
                originalData={localData}
                format='csv'
                className='ml-2'
              />

              <MultiExporter
                data={localData}
                changes={changes}
                filename='mudancas'
                title='Exportar'
                className='ml-2'
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-gray-100'>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className='px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200'
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
                <tr key={rowIndex} className={`hover:bg-gray-50 ${isChanged ? 'bg-blue-50' : ''}`}>
                  {columns.map((column) => {
                    const isEditing =
                      editingCell?.row === rowIndex && editingCell?.col === column.key;

                    return (
                      <td key={column.key} className='px-3 py-2 border-r border-gray-200'>
                        {isEditing ? (
                          <input
                            type='text'
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={saveEdit}
                            className='w-full p-1 border border-blue-400 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                            autoFocus
                          />
                        ) : (
                          <div
                            className={`cursor-pointer hover:bg-blue-100 rounded p-1 ${
                              column.editable !== false ? 'hover:border hover:border-blue-300' : ''
                            }`}
                            onClick={() =>
                              column.editable !== false && startEdit(rowIndex, column.key)
                            }
                          >
                            <span className='text-sm text-gray-900'>{row[column.key] || ''}</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className='bg-gray-50 border-t border-gray-200 px-4 py-2'>
        <div className='flex items-center justify-between text-sm text-gray-600'>
          <div>
            Total: <span className='font-medium'>{localData.length}</span> linhas
          </div>
          <div>
            Alteradas: <span className='font-medium'>{getChangedRows().length}</span> linhas
          </div>
        </div>
      </div>
    </div>
  );
}
