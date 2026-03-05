'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { EquipmentCategory, EquipmentFilter } from '@/types';
import { Button } from './button';
import { CustomSelect } from './custom-select';

interface EquipmentFilterComponentProps {
  onFiltersChange: (_filters: EquipmentFilter) => void;
  filteredCount?: number;
  categories: EquipmentCategory[];
  // Props para valores iniciais dos filtros
  initialEquipmentType?: string;
  initialProductLine?: string;
}

export function EquipmentFilterComponent({
  onFiltersChange,
  filteredCount,
  initialEquipmentType = '',
  initialProductLine = '',
}: EquipmentFilterComponentProps) {
  const t = useTranslations('equipments.filter');
  const [selectedEquipmentType, setSelectedEquipmentType] = useState<string>(initialEquipmentType);
  const [selectedProductLine, setSelectedProductLine] = useState<string>(initialProductLine);

  // Sincronizar estado com props iniciais
  useEffect(() => {
    setSelectedEquipmentType(initialEquipmentType);
    setSelectedProductLine(initialProductLine);
  }, [initialEquipmentType, initialProductLine]);

  // Limpar linha de produto quando tipo de equipamento muda para um incompatível
  useEffect(() => {
    if (selectedEquipmentType && selectedProductLine) {
      let compatibleLines: string[] = [];

      if (selectedEquipmentType === 'musculacao') {
        // Subcategorias específicas de musculação
        compatibleLines = ['', 'superiores', 'inferiores', 'multifuncionais-musculacao', 'bancos'];
      } else if (selectedEquipmentType) {
        // Para esteiras, bicicletas, elípticos, simulador de escada
        compatibleLines = ['', 'red-line', 'blue-line'];
      }

      // Se a linha atual não é compatível, limpar
      if (!compatibleLines.includes(selectedProductLine)) {
        setSelectedProductLine('');
      }
    }
  }, [selectedEquipmentType]);

  // Aplicar filtros sempre que as seleções mudarem
  useEffect(() => {
    const newFilters: EquipmentFilter = {
      categories: [],
      brands: [],
      search: '',
      target: '',
    };

    // Mapear seleções para o formato correto do backend
    if (selectedEquipmentType === 'esteiras') {
      newFilters.search = 'esteira';
    } else if (selectedEquipmentType === 'bicicletas') {
      newFilters.search = 'bicicleta';
    } else if (selectedEquipmentType === 'elipticos') {
      newFilters.search = 'elíptico';
    } else if (selectedEquipmentType === 'escadas') {
      newFilters.search = 'escada';
    } else if (selectedEquipmentType === 'musculacao') {
      newFilters.categories = ['musculacao'];
    }

    // Linha de produto ou subcategoria
    if (selectedProductLine) {
      // Para subcategorias de musculação, usar categories ao invés de brands
      if (
        selectedEquipmentType === 'musculacao' &&
        ['superiores', 'inferiores', 'multifuncionais-musculacao', 'bancos'].includes(
          selectedProductLine
        )
      ) {
        newFilters.categories = [selectedProductLine];
      } else {
        // Para linhas normais (red-line, blue-line), usar brands
        newFilters.brands = [selectedProductLine];
      }
    }

    onFiltersChange(newFilters);
  }, [selectedEquipmentType, selectedProductLine]);

  // Função para obter linhas compatíveis com o tipo selecionado
  const getCompatibleProductLines = (equipmentType: string) => {
    if (!equipmentType) {
      return [
        { value: '', label: t('allLines') },
        { value: 'red-line', label: t('lineRed') },
        { value: 'blue-line', label: t('lineBlue') },
        { value: 'musculacao', label: t('equipmentTypes.musculacao') },
      ];
    }

    if (equipmentType === 'musculacao') {
      // Sub-filtros específicos para musculação baseados nas subcategorias do sistema
      return [
        { value: '', label: t('allSubcategories') },
        { value: 'superiores', label: t('subcategories.superiores') },
        { value: 'inferiores', label: t('subcategories.inferiores') },
        {
          value: 'multifuncionais-musculacao',
          label: t('subcategories.multifuncionais-musculacao'),
        },
        { value: 'bancos', label: t('subcategories.bancos') },
      ];
    }

    // Para esteiras, bicicletas, elípticos, simulador de escada
    // Estes equipamentos existem apenas nas linhas Red e Blue
    return [
      { value: '', label: t('allLines') },
      { value: 'red-line', label: t('lineRed') },
      { value: 'blue-line', label: t('lineBlue') },
    ];
  };

  const handleClearFilters = () => {
    setSelectedEquipmentType('');
    setSelectedProductLine('');
    onFiltersChange({
      categories: [],
      brands: [],
      search: '',
      target: '',
    });
  };

  // Estilos
  const containerClass = 'bg-white border border-gray-200';
  const labelClass = 'text-gray-900 font-semibold';

  return (
    <div className={`rounded-2xl shadow-xl ${containerClass} overflow-hidden`}>
      {/* Cabeçalho */}
      <div className='bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-5'>
        <h3 className='text-lg font-bold text-white flex items-center gap-3'>
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z'
            />
          </svg>
          {t('filters')}
        </h3>
        <p className='text-gray-300 text-sm mt-1'>{t('refineSearch')}</p>
      </div>

      <div className='p-6'>
        {/* Grid de filtros */}
        <div className='space-y-6'>
          {/* Tipo de Equipamento */}
          <div>
            <label
              className={`block text-sm font-semibold ${labelClass} mb-3 flex items-center gap-2`}
            >
              <span className='w-2 h-2 bg-gray-900 rounded-full'></span>
              {t('equipmentTypeLabel')}
            </label>
            <CustomSelect
              options={[
                { value: '', label: t('allEquipmentTypes') },
                { value: 'esteiras', label: t('equipmentTypes.esteiras') },
                { value: 'bicicletas', label: t('equipmentTypes.bicicletas') },
                { value: 'elipticos', label: t('equipmentTypes.elipticos') },
                { value: 'escadas', label: t('equipmentTypes.escadas') },
                { value: 'musculacao', label: t('equipmentTypes.musculacao') },
              ]}
              value={selectedEquipmentType}
              onChange={setSelectedEquipmentType}
              placeholder={t('selectEquipment')}
              variant='light'
            />
          </div>

          {/* Linha de Produto / Subcategoria */}
          <div>
            <label
              className={`block text-sm font-semibold ${labelClass} mb-3 flex items-center gap-2`}
            >
              <span className='w-2 h-2 bg-gray-700 rounded-full'></span>
              {selectedEquipmentType === 'musculacao'
                ? t('subcategoryLabel')
                : t('productLineLabel')}
            </label>
            <CustomSelect
              options={getCompatibleProductLines(selectedEquipmentType)}
              value={selectedProductLine}
              onChange={setSelectedProductLine}
              placeholder={
                selectedEquipmentType === 'musculacao' ? t('selectSubcategory') : t('selectLine')
              }
              variant='light'
              disabled={false}
            />
          </div>
        </div>

        {/* Filtros Ativos */}
        {(selectedEquipmentType || selectedProductLine) && (
          <div className='mt-6 pt-6 border-t border-gray-100'>
            <div className='space-y-4'>
              <h4 className='text-sm font-semibold text-gray-900 flex items-center gap-2'>
                <span className='w-2 h-2 bg-gray-800 rounded-full'></span>
                {t('filtersApplied')}
              </h4>

              <div className='flex flex-wrap gap-2'>
                {selectedEquipmentType && (
                  <span className='inline-flex items-center px-3 py-2 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300'>
                    {t(`equipmentTypes.${selectedEquipmentType}` as any) || selectedEquipmentType}
                    <button
                      onClick={() => setSelectedEquipmentType('')}
                      className='ml-2 text-gray-600 hover:text-gray-900 transition-colors'
                    >
                      <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                        <path
                          fillRule='evenodd'
                          d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </button>
                  </span>
                )}

                {selectedProductLine && (
                  <span className='inline-flex items-center px-3 py-2 rounded-full text-xs font-medium bg-gray-200 text-gray-800 border border-gray-400'>
                    {selectedProductLine === 'red-line'
                      ? t('lineRed')
                      : selectedProductLine === 'blue-line'
                        ? t('lineBlue')
                        : selectedProductLine === 'musculacao'
                          ? t('equipmentTypes.musculacao')
                          : t(`subcategories.${selectedProductLine}` as any) || selectedProductLine}
                    <button
                      onClick={() => setSelectedProductLine('')}
                      className='ml-2 text-gray-600 hover:text-gray-900 transition-colors'
                    >
                      <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                        <path
                          fillRule='evenodd'
                          d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </button>
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer com estatísticas e ações */}
        <div className='mt-6 pt-6 border-t border-gray-100'>
          <div className='flex items-center justify-between'>
            <div className='text-sm text-gray-600'>
              <span className='font-semibold text-gray-900'>
                {filteredCount !== undefined ? filteredCount : 0}
              </span>{' '}
              {t('productsFound', {
                count: filteredCount !== undefined ? filteredCount : 0,
                plural: filteredCount !== 1 ? 's' : '',
              })}
            </div>

            {(selectedEquipmentType || selectedProductLine) && (
              <Button
                variant='outline'
                size='sm'
                onClick={handleClearFilters}
                className='text-xs px-3 py-1.5 border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all'
              >
                <svg className='w-3 h-3 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                  />
                </svg>
                {t('clear')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
