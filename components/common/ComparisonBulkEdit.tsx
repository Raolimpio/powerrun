'use client';

import { Edit3, Save, X, Check, Copy, AlertCircle, Maximize2, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { exportProductsToExcel } from '@/lib/excel-exporter';

interface ProductData {
  id: string;
  name: string;
  category: string;
  line: 'red' | 'blue' | 'musculacao';
  lineConfig: any;
  specifications: Record<string, string>;
  features: string[];
  equipmentData?: any;
}

interface ComparisonBulkEditProps {
  products: ProductData[];
  specifications: string[];
  onSave: (_updatedProducts: ProductData[]) => void;
  onCancel: () => void;
  className?: string;
}

export function ComparisonBulkEdit({
  products,
  specifications,
  onSave,
  onCancel,
  className = '',
}: ComparisonBulkEditProps) {
  const [editingData, setEditingData] = useState(products);
  const [editingSpec, setEditingSpec] = useState<string | null>(null);
  const [bulkValue, setBulkValue] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [hasChanges, setHasChanges] = useState(false);
  const [savedData, setSavedData] = useState<Record<string, Record<string, string>>>({});
  const [expandedEditor, setExpandedEditor] = useState<{
    isOpen: boolean;
    productId: string;
    spec: string;
    value: string;
  }>({
    isOpen: false,
    productId: '',
    spec: '',
    value: '',
  });

  const getLineColor = (line: string) => {
    switch (line) {
      case 'blue':
        return 'bg-blue-50 border-blue-200';
      case 'red':
        return 'bg-red-50 border-red-200';
      case 'musculacao':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const handleSpecEdit = (spec: string) => {
    setEditingSpec(spec);
    setBulkValue('');
    setSelectedProducts(new Set());
  };

  const handleBulkEdit = () => {
    if (!editingSpec || !bulkValue || selectedProducts.size === 0) return;

    const updatedProducts = editingData.map((product) => {
      if (selectedProducts.has(product.id)) {
        return {
          ...product,
          specifications: {
            ...product.specifications,
            [editingSpec]: bulkValue,
          },
        };
      }
      return product;
    });

    setEditingData(updatedProducts);
    setHasChanges(true);
    setEditingSpec(null);
    setBulkValue('');
    setSelectedProducts(new Set());
  };

  const handleCancelEdit = () => {
    setEditingSpec(null);
    setBulkValue('');
    setSelectedProducts(new Set());
  };

  // Função reservada para futura implementação de seleção de produtos
  // const toggleProductSelection = (productId: string) => {
  //   const newSelected = new Set(selectedProducts);
  //   if (newSelected.has(productId)) {
  //     newSelected.delete(productId);
  //   } else {
  //     newSelected.add(productId);
  //   }
  //   setSelectedProducts(newSelected);
  // };

  const selectAllProducts = () => {
    if (selectedProducts.size === editingData.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(editingData.map((p) => p.id)));
    }
  };

  const handleCellEdit = (productId: string, spec: string, value: string) => {
    const updatedProducts = editingData.map((product) => {
      if (product.id === productId) {
        return {
          ...product,
          specifications: {
            ...product.specifications,
            [spec]: value,
          },
        };
      }
      return product;
    });

    setEditingData(updatedProducts);
    setHasChanges(true);
  };

  const copyValueToAll = (sourceProductId: string, spec: string) => {
    const sourceProduct = editingData.find((p) => p.id === sourceProductId);
    if (!sourceProduct) return;

    const value = sourceProduct.specifications[spec];
    const updatedProducts = editingData.map((product) => ({
      ...product,
      specifications: {
        ...product.specifications,
        [spec]: value,
      },
    }));

    setEditingData(updatedProducts);
    setHasChanges(true);
  };

  const openExpandedEditor = (productId: string, spec: string, value: string) => {
    setExpandedEditor({
      isOpen: true,
      productId,
      spec,
      value: value || '',
    });
  };

  const handleExpandedSave = (newValue: string) => {
    handleCellEdit(expandedEditor.productId, expandedEditor.spec, newValue);
    setExpandedEditor({
      isOpen: false,
      productId: '',
      spec: '',
      value: '',
    });
  };

  // Funções reservadas para futura implementação de formatação de texto
  // const getTextHeight = (text: string) => {
  //   if (!text) return 'h-12';
  //   const lines = text.split('\n').length;
  //   const estimatedLines = Math.ceil(text.length / 35);
  //   const totalLines = Math.max(lines, estimatedLines);
  //   if (totalLines <= 1) return 'h-12';
  //   if (totalLines <= 2) return 'h-20';
  //   if (totalLines <= 3) return 'h-28';
  //   if (totalLines <= 4) return 'h-36';
  //   if (totalLines <= 5) return 'h-44';
  //   if (totalLines <= 6) return 'h-52';
  //   if (totalLines <= 7) return 'h-60';
  //   return 'h-72';
  // };

  // Função reservada para futura implementação
  // const formatTextForDisplay = (text: string, maxLength: number = 100) => {
  //   if (!text) return '';
  //   if (text.length <= maxLength) return text;
  //   const words = text.split(' ');
  //   const lines = [];
  //   let currentLine = '';
  //   for (const word of words) {
  //     if ((currentLine + word).length > maxLength && currentLine) {
  //       lines.push(currentLine.trim());
  //       currentLine = word;
  //     } else {
  //       currentLine += (currentLine ? ' ' : '') + word;
  //     }
  //   }
  //   if (currentLine) {
  //     lines.push(currentLine.trim());
  //   }
  //   return lines.join('\n');
  // };

  // Função para ajustar alturas de todos os textareas
  const adjustAllTextareaHeights = () => {
    const textareas = document.querySelectorAll('textarea[data-auto-resize="true"]');
    textareas.forEach((textarea) => {
      const target = textarea as HTMLTextAreaElement;
      target.style.height = 'auto';
      const newHeight = Math.max(target.scrollHeight, 48);
      target.style.height = `${newHeight}px`;
    });
  };

  // Carregar dados salvos do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('fichas-tecnicas-saved-data');
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        setSavedData(parsedData);
      } catch (error) {
        console.error('Erro ao carregar dados salvos:', error);
      }
    }
  }, []);

  // Salvar dados no localStorage quando houver mudanças
  useEffect(() => {
    if (Object.keys(savedData).length > 0) {
      localStorage.setItem('fichas-tecnicas-saved-data', JSON.stringify(savedData));
    }
  }, [savedData]);

  // Ajustar alturas quando o componente carrega
  useEffect(() => {
    const timer = setTimeout(() => {
      adjustAllTextareaHeights();
    }, 100);

    return () => clearTimeout(timer);
  }, [editingData]);

  // Função para verificar se um campo está preenchido
  const isFieldFilled = (productId: string, spec: string) => {
    const value = editingData.find((p) => p.id === productId)?.specifications[spec];
    return value && value.trim().length > 0;
  };

  // Função para verificar se um campo foi salvo
  const isFieldSaved = (productId: string, spec: string) => {
    return savedData[productId] && savedData[productId][spec] !== undefined;
  };

  // Função para obter a cor de fundo baseada no status
  const getFieldBackgroundColor = (productId: string, spec: string) => {
    const isFilled = isFieldFilled(productId, spec);
    const isSaved = isFieldSaved(productId, spec);

    if (isSaved) {
      return 'bg-green-50 border-green-200'; // Verde claro para salvo
    } else if (isFilled) {
      return 'bg-yellow-50 border-yellow-200'; // Amarelo claro para preenchido mas não salvo
    } else {
      return 'bg-red-50 border-red-200'; // Vermelho claro para pendente
    }
  };

  // Função para salvar um campo específico
  const saveField = (productId: string, spec: string, value: string) => {
    setSavedData((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [spec]: value,
      },
    }));
  };

  // Função para salvar todos os campos preenchidos
  const saveAllFilledFields = () => {
    const newSavedData = { ...savedData };

    editingData.forEach((product) => {
      Object.keys(product.specifications).forEach((spec) => {
        const value = product.specifications[spec];
        if (value && value.trim().length > 0) {
          if (!newSavedData[product.id]) {
            newSavedData[product.id] = {};
          }
          newSavedData[product.id][spec] = value;
        }
      });
    });

    setSavedData(newSavedData);
    setHasChanges(false);
  };

  // Função para exportar para Excel
  const handleExportToExcel = () => {
    try {
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `fichas-tecnicas-comparacao-${timestamp}.csv`;

      exportProductsToExcel(editingData, specifications, {
        filename,
        includeFeatures: true,
      });
    } catch (error) {
      console.error('Erro ao exportar para Excel:', error);
    }
  };

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className='bg-gray-50 border-b border-gray-200 p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              Comparação de Especificações - Modo Edição
            </h3>
            <p className='text-sm text-gray-600'>
              Comparação horizontal de {editingData.length} produtos com edição inline
            </p>

            {/* Indicadores de Status */}
            <div className='flex items-center space-x-4 mt-3'>
              <div className='flex items-center space-x-1'>
                <div className='w-3 h-3 bg-blue-100 border border-blue-300 rounded'></div>
                <span className='text-xs text-gray-600'>
                  Especificações: {specifications.length}
                </span>
              </div>
              <div className='flex items-center space-x-1'>
                <div className='w-3 h-3 bg-gray-100 border border-gray-300 rounded'></div>
                <span className='text-xs text-gray-600'>Produtos: {editingData.length}</span>
              </div>
              {(() => {
                let totalFields = 0;
                let filledFields = 0;
                let savedFields = 0;

                editingData.forEach((product) => {
                  specifications.forEach((spec) => {
                    totalFields++;
                    if (isFieldFilled(product.id, spec)) filledFields++;
                    if (isFieldSaved(product.id, spec)) savedFields++;
                  });
                });

                const pendingFields = totalFields - filledFields;
                const unsavedFields = filledFields - savedFields;

                return (
                  <>
                    <div className='flex items-center space-x-1'>
                      <div className='w-3 h-3 bg-green-100 border border-green-300 rounded'></div>
                      <span className='text-xs text-gray-600'>Salvos: {savedFields}</span>
                    </div>
                    <div className='flex items-center space-x-1'>
                      <div className='w-3 h-3 bg-yellow-100 border border-yellow-300 rounded'></div>
                      <span className='text-xs text-gray-600'>Preenchidos: {unsavedFields}</span>
                    </div>
                    <div className='flex items-center space-x-1'>
                      <div className='w-3 h-3 bg-red-100 border border-red-300 rounded'></div>
                      <span className='text-xs text-gray-600'>Pendentes: {pendingFields}</span>
                    </div>
                  </>
                );
              })()}
            </div>
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
              onClick={handleExportToExcel}
              variant='outline'
              className='flex items-center space-x-2'
            >
              <Download className='h-4 w-4' />
              <span>Exportar Excel</span>
            </Button>

            <Button
              onClick={saveAllFilledFields}
              className='flex items-center space-x-2 bg-green-600 hover:bg-green-700'
            >
              <Save className='h-4 w-4' />
              <span>Salvar Cache</span>
            </Button>

            <Button
              onClick={() => onSave(editingData)}
              disabled={!hasChanges}
              className='flex items-center space-x-2'
            >
              <Save className='h-4 w-4' />
              <span>Salvar Tudo</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Bulk Edit Panel */}
      {editingSpec && (
        <div className='bg-blue-50 border-b border-blue-200 p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='flex items-center space-x-2'>
                <Badge variant='default' className='text-xs'>
                  Editando: {editingSpec}
                </Badge>
                <span className='text-sm text-gray-700'>
                  {selectedProducts.size} de {editingData.length} produtos selecionados
                </span>
              </div>

              <div className='flex items-center space-x-2'>
                <textarea
                  value={bulkValue}
                  onChange={(e) => setBulkValue(e.target.value)}
                  placeholder='Novo valor para aplicar...'
                  className='w-64 text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y'
                  rows={4}
                  style={{ lineHeight: '1.5' }}
                />
                <Button
                  size='sm'
                  onClick={handleBulkEdit}
                  disabled={!bulkValue || selectedProducts.size === 0}
                  className='flex items-center space-x-1'
                >
                  <Check className='h-3 w-3' />
                  <span>Aplicar</span>
                </Button>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={handleCancelEdit}
                  className='flex items-center space-x-1'
                >
                  <X className='h-3 w-3' />
                  <span>Cancelar</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                <div className='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    checked={selectedProducts.size === editingData.length && editingData.length > 0}
                    onChange={selectAllProducts}
                    className='rounded border-gray-300'
                  />
                  <span>Especificação</span>
                </div>
              </th>
              {editingData.map((product) => (
                <th
                  key={product.id}
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  <div className={`p-3 rounded-lg border ${getLineColor(product.line)}`}>
                    <h5 className='text-sm font-bold text-gray-900 truncate' title={product.name}>
                      {product.name}
                    </h5>
                    <p className='text-xs text-gray-600 mt-1'>{product.lineConfig.name}</p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {specifications.map((spec) => (
              <tr key={spec} className='hover:bg-gray-50 transition-colors'>
                <td className='px-6 py-4 text-sm font-medium text-gray-900'>
                  <div className='flex items-center space-x-2'>
                    <input
                      type='checkbox'
                      checked={editingSpec === spec}
                      onChange={() => handleSpecEdit(spec)}
                      className='rounded border-gray-300'
                    />
                    <span>{spec}</span>
                    <Button
                      size='sm'
                      variant='ghost'
                      onClick={() => handleSpecEdit(spec)}
                      className='h-6 w-6 p-0 hover:bg-blue-100'
                      title='Editar esta especificação em massa'
                    >
                      <Edit3 className='h-3 w-3 text-blue-600' />
                    </Button>
                  </div>
                </td>
                {editingData.map((product) => (
                  <td key={product.id} className='px-6 py-4 text-sm text-gray-700'>
                    <div
                      className={`flex items-center space-x-2 p-2 rounded transition-colors ${
                        editingSpec === spec && selectedProducts.has(product.id)
                          ? 'bg-blue-100 border border-blue-300'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className='relative group flex-1'>
                        <textarea
                          value={product.specifications[spec] || ''}
                          onChange={(e) => handleCellEdit(product.id, spec, e.target.value)}
                          className={`text-sm border w-full rounded-md px-3 py-2 resize-none transition-all duration-200 ${getFieldBackgroundColor(product.id, spec)}`}
                          placeholder='Digite o valor...'
                          data-auto-resize='true'
                          style={{
                            minHeight: '48px',
                            height: 'auto',
                            overflow: 'hidden',
                            lineHeight: '1.5',
                          }}
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            const newHeight = Math.max(target.scrollHeight, 48);
                            target.style.height = `${newHeight}px`;
                          }}
                          onFocus={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            const newHeight = Math.max(target.scrollHeight, 48);
                            target.style.height = `${newHeight}px`;
                          }}
                        />

                        {/* Botão de salvar campo individual */}
                        {isFieldFilled(product.id, spec) && !isFieldSaved(product.id, spec) && (
                          <Button
                            size='sm'
                            variant='ghost'
                            onClick={() =>
                              saveField(product.id, spec, product.specifications[spec] || '')
                            }
                            className='absolute -top-1 -right-1 h-5 w-5 p-0 bg-green-100 hover:bg-green-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200'
                            title='Salvar este campo'
                          >
                            <Save className='h-3 w-3 text-green-600' />
                          </Button>
                        )}

                        {/* Botão de expandir para textos muito longos */}
                        {(product.specifications[spec] || '').length > 100 && (
                          <Button
                            size='sm'
                            variant='ghost'
                            onClick={() =>
                              openExpandedEditor(
                                product.id,
                                spec,
                                product.specifications[spec] || ''
                              )
                            }
                            className={`absolute -top-1 -right-1 h-5 w-5 p-0 bg-blue-100 hover:bg-blue-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                              isFieldFilled(product.id, spec) && !isFieldSaved(product.id, spec)
                                ? '-right-7'
                                : ''
                            }`}
                            title='Editar em modal expandido'
                          >
                            <Maximize2 className='h-3 w-3 text-blue-600' />
                          </Button>
                        )}
                      </div>

                      <Button
                        size='sm'
                        variant='ghost'
                        onClick={() => copyValueToAll(product.id, spec)}
                        className='h-6 w-6 p-0 hover:bg-gray-200'
                        title='Copiar para todos'
                      >
                        <Copy className='h-3 w-3 text-gray-600' />
                      </Button>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Features Section */}
      {editingData.some((p) => p.features.length > 0) && (
        <div className='border-t border-gray-200 bg-gray-50 p-6'>
          <h4 className='text-sm font-semibold text-gray-900 mb-4'>Recursos Principais</h4>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {editingData.map((product) => (
              <div
                key={product.id}
                className={`p-4 rounded-lg border ${getLineColor(product.line)}`}
              >
                <h5 className='text-sm font-bold text-gray-900 mb-2'>{product.name}</h5>
                <div className='space-y-1'>
                  {product.features.map((feature, index) => (
                    <div key={index} className='text-xs text-gray-700'>
                      <span className='text-blue-600 mr-1'>•</span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expanded Editor Modal */}
      {expandedEditor.isOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden'>
            <div className='bg-gray-50 border-b border-gray-200 p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-lg font-semibold text-gray-900'>Editor Expandido</h3>
                  <p className='text-sm text-gray-600'>
                    {expandedEditor.spec} -{' '}
                    {editingData.find((p) => p.id === expandedEditor.productId)?.name}
                  </p>
                </div>
                <Button
                  variant='ghost'
                  onClick={() =>
                    setExpandedEditor({ isOpen: false, productId: '', spec: '', value: '' })
                  }
                  className='h-8 w-8 p-0'
                >
                  <X className='h-4 w-4' />
                </Button>
              </div>
            </div>

            <div className='p-6'>
              <textarea
                value={expandedEditor.value}
                onChange={(e) => setExpandedEditor((prev) => ({ ...prev, value: e.target.value }))}
                className='w-full h-96 text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y'
                placeholder='Digite o valor...'
                style={{ lineHeight: '1.5' }}
              />
            </div>

            <div className='bg-gray-50 border-t border-gray-200 p-4'>
              <div className='flex items-center justify-end space-x-3'>
                <Button
                  variant='outline'
                  onClick={() =>
                    setExpandedEditor({ isOpen: false, productId: '', spec: '', value: '' })
                  }
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => handleExpandedSave(expandedEditor.value)}
                  className='flex items-center space-x-2'
                >
                  <Save className='h-4 w-4' />
                  <span>Salvar</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
