'use client';

import { Save, X, Check, AlertCircle, Edit3, Type, Hash, Calendar, List } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CellEditorProps {
  value: any;
  type?: 'text' | 'number' | 'date' | 'select' | 'boolean';
  options?: string[];
  onSave: (value: any) => void;
  onCancel: () => void;
  placeholder?: string;
  className?: string;
}

export function CellEditor({
  value,
  type = 'text',
  options = [],
  onSave,
  onCancel,
  placeholder = 'Digite o valor...',
  className = '',
}: CellEditorProps) {
  const [editValue, setEditValue] = useState(String(value || ''));
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  const validateValue = (val: string) => {
    if (type === 'number') {
      const numVal = Number(val);
      if (isNaN(numVal) && val !== '') {
        setIsValid(false);
        setErrorMessage('Deve ser um número válido');
        return false;
      }
    }

    if (type === 'date') {
      const dateVal = new Date(val);
      if (isNaN(dateVal.getTime()) && val !== '') {
        setIsValid(false);
        setErrorMessage('Deve ser uma data válida');
        return false;
      }
    }

    setIsValid(true);
    setErrorMessage('');
    return true;
  };

  const handleChange = (newValue: string) => {
    setEditValue(newValue);
    validateValue(newValue);
  };

  const handleSave = () => {
    if (!validateValue(editValue)) return;

    let processedValue: any = editValue;

    if (type === 'number') {
      processedValue = editValue === '' ? '' : Number(editValue);
    } else if (type === 'date') {
      processedValue = editValue === '' ? '' : editValue;
    } else if (type === 'boolean') {
      processedValue =
        editValue.toLowerCase() === 'true' ||
        editValue === '1' ||
        editValue.toLowerCase() === 'sim';
    }

    onSave(processedValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleSave();
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'number':
        return <Hash className='h-3 w-3' />;
      case 'date':
        return <Calendar className='h-3 w-3' />;
      case 'select':
        return <List className='h-3 w-3' />;
      case 'boolean':
        return <Check className='h-3 w-3' />;
      default:
        return <Type className='h-3 w-3' />;
    }
  };

  const getInputType = () => {
    switch (type) {
      case 'number':
        return 'number';
      case 'date':
        return 'date';
      default:
        return 'text';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Editor Container */}
      <div className='flex items-center space-x-1 bg-white border border-blue-300 rounded-md shadow-lg'>
        {/* Type Indicator */}
        <div className='flex items-center px-2 py-1 bg-blue-50 border-r border-blue-200'>
          <div className='text-blue-600' title={`Tipo: ${type}`}>
            {getTypeIcon()}
          </div>
        </div>

        {/* Input */}
        {type === 'select' && options.length > 0 ? (
          <select
            value={editValue}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className='flex-1 h-8 border-0 focus:ring-0 focus:border-0 px-2 py-1 text-sm bg-transparent'
            autoFocus
          >
            <option value=''>Selecione...</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : type === 'boolean' ? (
          <select
            value={editValue}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className='flex-1 h-8 border-0 focus:ring-0 focus:border-0 px-2 py-1 text-sm bg-transparent'
            autoFocus
          >
            <option value=''>Selecione...</option>
            <option value='true'>Sim</option>
            <option value='false'>Não</option>
          </select>
        ) : (
          <Input
            ref={inputRef}
            type={getInputType()}
            value={editValue}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className='flex-1 h-8 border-0 focus:ring-0 focus:border-0 px-2 py-1 text-sm'
            placeholder={placeholder}
            autoFocus
          />
        )}

        {/* Action Buttons */}
        <div className='flex items-center space-x-1 pr-1'>
          <Button
            size='sm'
            variant='ghost'
            onClick={handleSave}
            disabled={!isValid}
            className='h-6 w-6 p-0 hover:bg-green-100'
            title='Salvar (Enter)'
          >
            <Save className='h-3 w-3 text-green-600' />
          </Button>
          <Button
            size='sm'
            variant='ghost'
            onClick={onCancel}
            className='h-6 w-6 p-0 hover:bg-red-100'
            title='Cancelar (Esc)'
          >
            <X className='h-3 w-3 text-red-600' />
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {!isValid && (
        <div className='absolute -bottom-6 left-0 flex items-center space-x-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded shadow-sm border border-red-200'>
          <AlertCircle className='h-3 w-3' />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Help Text */}
      <div className='absolute -bottom-6 left-0 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded shadow-sm'>
        Enter para salvar • Esc para cancelar • Tab para próximo
      </div>
    </div>
  );
}

// Componente para células editáveis
interface EditableCellProps {
  value: any;
  type?: 'text' | 'number' | 'date' | 'select' | 'boolean';
  options?: string[];
  onEdit: (value: any) => void;
  className?: string;
  placeholder?: string;
}

export function EditableCell({
  value,
  type = 'text',
  options = [],
  onEdit,
  className = '',
  placeholder = 'Clique para editar...',
}: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (newValue: any) => {
    onEdit(newValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <CellEditor
        value={value}
        type={type}
        options={options}
        onSave={handleSave}
        onCancel={handleCancel}
        placeholder={placeholder}
        className={className}
      />
    );
  }

  const formatValue = (val: any) => {
    if (val === null || val === undefined || val === '') return '—';

    if (type === 'boolean') {
      return val ? 'Sim' : 'Não';
    }

    if (type === 'date' && val) {
      return new Date(val).toLocaleDateString('pt-BR');
    }

    return String(val);
  };

  return (
    <div
      className={`group relative cursor-pointer hover:bg-blue-50 rounded px-2 py-1 -mx-2 -my-1 transition-colors duration-150 ${className}`}
      onClick={handleEdit}
    >
      <span className='text-gray-900'>{formatValue(value)}</span>

      {/* Edit Indicator */}
      <div className='absolute -top-6 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
        <div className='bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg flex items-center space-x-1'>
          <Edit3 className='h-3 w-3' />
          <span>Editar</span>
        </div>
      </div>
    </div>
  );
}
