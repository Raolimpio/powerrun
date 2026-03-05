'use client';

import { X, Save, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Record<string, any>;
  columns: Array<{
    key: string;
    label: string;
    editable?: boolean;
    type?: 'text' | 'number' | 'textarea' | 'select';
    options?: string[];
  }>;
  onSave: (updatedData: Record<string, any>) => Promise<void>;
  title?: string;
}

export function EditModal({
  isOpen,
  onClose,
  data,
  columns,
  onSave,
  title = 'Editar Registro',
}: EditModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({ ...data });
      setErrors({});
      setHasChanges(false);
    }
  }, [isOpen, data]);

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);

    // Limpar erro do campo
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    columns.forEach((column) => {
      if (column.editable !== false) {
        const value = formData[column.key];

        // Validações básicas
        if (column.type === 'number' && value && isNaN(Number(value))) {
          newErrors[column.key] = 'Deve ser um número válido';
        }

        if (column.key === 'name' && !value?.trim()) {
          newErrors[column.key] = 'Nome é obrigatório';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Backdrop */}
      <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' onClick={onClose} />

      {/* Modal */}
      <div
        className='relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden'
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className='px-6 py-4 border-b border-gray-200 bg-gray-50'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-lg font-semibold text-gray-900'>{title}</h2>
              <p className='text-sm text-gray-600 mt-1'>
                Edite os campos abaixo e pressione Ctrl+Enter para salvar
              </p>
            </div>
            <Button variant='ghost' size='sm' onClick={onClose} className='h-8 w-8 p-0'>
              <X className='h-4 w-4' />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className='px-6 py-6 overflow-y-auto max-h-[calc(90vh-140px)]'>
          <div className='space-y-6'>
            {columns.map((column) => {
              if (column.editable === false) return null;

              const value = formData[column.key] || '';
              const error = errors[column.key];

              return (
                <div key={column.key} className='space-y-2'>
                  <Label htmlFor={column.key} className='text-sm font-medium text-gray-700'>
                    {column.label}
                    {column.key === 'name' && <span className='text-red-500 ml-1'>*</span>}
                  </Label>

                  {column.type === 'textarea' ? (
                    <Textarea
                      id={column.key}
                      value={value}
                      onChange={(e) => handleInputChange(column.key, e.target.value)}
                      className={`min-h-[100px] ${error ? 'border-red-300 focus:border-red-500' : ''}`}
                      placeholder={`Digite ${column.label.toLowerCase()}...`}
                    />
                  ) : column.type === 'select' && column.options ? (
                    <select
                      id={column.key}
                      value={value}
                      onChange={(e) => handleInputChange(column.key, e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        error ? 'border-red-300 focus:border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value=''>Selecione...</option>
                      {column.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      id={column.key}
                      type={column.type === 'number' ? 'number' : 'text'}
                      value={value}
                      onChange={(e) => handleInputChange(column.key, e.target.value)}
                      className={error ? 'border-red-300 focus:border-red-500' : ''}
                      placeholder={`Digite ${column.label.toLowerCase()}...`}
                    />
                  )}

                  {error && (
                    <div className='flex items-center space-x-2 text-red-600 text-sm'>
                      <AlertCircle className='h-4 w-4' />
                      <span>{error}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className='px-6 py-4 border-t border-gray-200 bg-gray-50'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              {hasChanges && (
                <div className='flex items-center space-x-2 text-amber-600 text-sm'>
                  <AlertCircle className='h-4 w-4' />
                  <span>Alterações não salvas</span>
                </div>
              )}
            </div>

            <div className='flex items-center space-x-3'>
              <Button variant='outline' onClick={onClose} disabled={isLoading}>
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={isLoading || !hasChanges}
                className='flex items-center space-x-2'
              >
                {isLoading ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <Save className='h-4 w-4' />
                )}
                <span>Salvar</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
