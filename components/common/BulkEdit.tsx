'use client';

import { Save, X, Plus, Trash2, Copy, Check, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface BulkEditProps {
  data: Array<Record<string, any>>;
  columns: Array<{
    key: string;
    label: string;
    editable?: boolean;
  }>;
  onSave: (_updatedData: Array<Record<string, any>>) => void;
  onCancel: () => void;
  className?: string;
}

export function BulkEdit({ data, columns, onSave, onCancel, className = '' }: BulkEditProps) {
  const [editingData, setEditingData] = useState(data);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [bulkValue, setBulkValue] = useState('');
  const [bulkColumn, setBulkColumn] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  const editableColumns = columns.filter((col) => col.editable !== false);

  const handleRowSelect = (index: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === editingData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(editingData.map((_, index) => index)));
    }
  };

  const handleCellEdit = (rowIndex: number, column: string, value: string) => {
    const newData = [...editingData];
    newData[rowIndex] = {
      ...newData[rowIndex],
      [column]: value,
    };
    setEditingData(newData);
    setHasChanges(true);
  };

  const handleBulkEdit = () => {
    if (!bulkColumn || !bulkValue) return;

    const newData = [...editingData];
    selectedRows.forEach((index) => {
      newData[index] = {
        ...newData[index],
        [bulkColumn]: bulkValue,
      };
    });
    setEditingData(newData);
    setHasChanges(true);
    setBulkValue('');
  };

  const handleAddRow = () => {
    const newRow: Record<string, any> = {};
    editableColumns.forEach((col) => {
      newRow[col.key] = '';
    });
    setEditingData([...editingData, newRow]);
    setHasChanges(true);
  };

  const handleDeleteRows = () => {
    const newData = editingData.filter((_, index) => !selectedRows.has(index));
    setEditingData(newData);
    setSelectedRows(new Set());
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(editingData);
  };

  const handleDuplicateRow = (index: number) => {
    const duplicatedRow = { ...editingData[index] };
    const newData = [...editingData];
    newData.splice(index + 1, 0, duplicatedRow);
    setEditingData(newData);
    setHasChanges(true);
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      {/* Header */}
      <div className='px-6 py-4 border-b border-gray-200 bg-gray-50'>
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='text-lg font-semibold text-gray-900'>Edição em Massa</h3>
            <p className='text-sm text-gray-600 mt-1'>
              {editingData.length} registros • {selectedRows.size} selecionados
            </p>
          </div>

          <div className='flex items-center space-x-3'>
            {hasChanges && (
              <Badge variant='destructive' className='text-xs'>
                <AlertCircle className='h-3 w-3 mr-1' />
                Alterações não salvas
              </Badge>
            )}

            <Button variant='outline' onClick={onCancel} className='flex items-center space-x-2'>
              <X className='h-4 w-4' />
              <span>Cancelar</span>
            </Button>

            <Button
              onClick={handleSave}
              disabled={!hasChanges}
              className='flex items-center space-x-2'
            >
              <Save className='h-4 w-4' />
              <span>Salvar Tudo</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className='px-6 py-4 border-b border-gray-200 bg-blue-50'>
        <div className='flex items-center space-x-4'>
          <div className='flex items-center space-x-2'>
            <input
              type='checkbox'
              checked={selectedRows.size === editingData.length && editingData.length > 0}
              onChange={handleSelectAll}
              className='rounded border-gray-300'
            />
            <span className='text-sm font-medium text-gray-700'>
              Selecionar todos ({selectedRows.size})
            </span>
          </div>

          {selectedRows.size > 0 && (
            <>
              <div className='flex items-center space-x-2'>
                <select
                  value={bulkColumn}
                  onChange={(e) => setBulkColumn(e.target.value)}
                  className='text-sm border border-gray-300 rounded px-2 py-1'
                >
                  <option value=''>Selecionar coluna</option>
                  {editableColumns.map((col) => (
                    <option key={col.key} value={col.key}>
                      {col.label}
                    </option>
                  ))}
                </select>

                <Input
                  value={bulkValue}
                  onChange={(e) => setBulkValue(e.target.value)}
                  placeholder='Valor para aplicar'
                  className='w-48 text-sm'
                />

                <Button
                  size='sm'
                  onClick={handleBulkEdit}
                  disabled={!bulkColumn || !bulkValue}
                  className='flex items-center space-x-1'
                >
                  <Check className='h-3 w-3' />
                  <span>Aplicar</span>
                </Button>
              </div>

              <Button
                size='sm'
                variant='destructive'
                onClick={handleDeleteRows}
                className='flex items-center space-x-1'
              >
                <Trash2 className='h-3 w-3' />
                <span>Excluir ({selectedRows.size})</span>
              </Button>
            </>
          )}

          <Button
            size='sm'
            variant='outline'
            onClick={handleAddRow}
            className='flex items-center space-x-1'
          >
            <Plus className='h-3 w-3' />
            <span>Adicionar Linha</span>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12'>
                #
              </th>
              {editableColumns.map((column) => (
                <th
                  key={column.key}
                  className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  {column.label}
                </th>
              ))}
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20'>
                Ações
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {editingData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`hover:bg-gray-50 transition-colors ${
                  selectedRows.has(rowIndex) ? 'bg-blue-50' : ''
                }`}
              >
                <td className='px-4 py-3 text-sm'>
                  <div className='flex items-center space-x-2'>
                    <input
                      type='checkbox'
                      checked={selectedRows.has(rowIndex)}
                      onChange={() => handleRowSelect(rowIndex)}
                      className='rounded border-gray-300'
                    />
                    <span className='text-gray-500 text-xs'>{rowIndex + 1}</span>
                  </div>
                </td>

                {editableColumns.map((column) => (
                  <td key={column.key} className='px-4 py-3 text-sm'>
                    <Input
                      value={row[column.key] || ''}
                      onChange={(e) => handleCellEdit(rowIndex, column.key, e.target.value)}
                      className='h-8 text-sm'
                      placeholder={`${column.label}...`}
                    />
                  </td>
                ))}

                <td className='px-4 py-3 text-sm'>
                  <div className='flex items-center space-x-1'>
                    <Button
                      size='sm'
                      variant='ghost'
                      onClick={() => handleDuplicateRow(rowIndex)}
                      className='h-6 w-6 p-0 hover:bg-blue-100'
                      title='Duplicar linha'
                    >
                      <Copy className='h-3 w-3 text-blue-600' />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className='px-6 py-4 border-t border-gray-200 bg-gray-50'>
        <div className='flex items-center justify-between'>
          <div className='text-sm text-gray-600'>
            {editingData.length} registros • {selectedRows.size} selecionados
          </div>

          <div className='flex items-center space-x-2'>
            <Button variant='outline' onClick={onCancel} size='sm'>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges}
              size='sm'
              className='flex items-center space-x-2'
            >
              <Save className='h-4 w-4' />
              <span>Salvar Alterações</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
