'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState, useEffect } from 'react';
import { EquipmentFilter } from '@/types';

interface SidebarFilterProps {
  onFiltersChange: (_filters: EquipmentFilter) => void;
  filteredCount?: number;
  initialEquipmentType?: string;
  initialProductLine?: string;
  isMobile?: boolean;
}

export function SidebarFilter({
  onFiltersChange,
  filteredCount,
  initialEquipmentType = '',
  initialProductLine = '',
  isMobile = false,
}: SidebarFilterProps) {
  const locale = useLocale();
  const t = useTranslations('equipments.filter');
  // const tCommon = useTranslations('common'); // Reservado para uso futuro
  const [selectedEquipmentType, setSelectedEquipmentType] = useState<string>(initialEquipmentType);
  const [selectedProductLine, setSelectedProductLine] = useState<string>(initialProductLine);
  const [isExpanded, setIsExpanded] = useState(!isMobile);

  // Sincronizar estado com props iniciais
  useEffect(() => {
    setSelectedEquipmentType(initialEquipmentType);
    setSelectedProductLine(initialProductLine);
  }, [initialEquipmentType, initialProductLine]);

  // Limpar linha de produto IMEDIATAMENTE quando tipo muda para incompatível
  useEffect(() => {
    if (!selectedEquipmentType) {
      // Se não há tipo selecionado, não limpar nada
      return;
    }

    const isCardioType = ['esteiras', 'bicicletas', 'elipticos', 'escadas'].includes(
      selectedEquipmentType
    );
    const isMusculacaoType = selectedEquipmentType === 'musculacao';

    const isCardioLine = ['red-line', 'blue-line'].includes(selectedProductLine);
    const isMusculacaoLine = [
      'superiores',
      'inferiores',
      'multifuncionais-musculacao',
      'bancos',
    ].includes(selectedProductLine);

    // Se selecionou cardio mas tem linha de musculação, limpar
    if (isCardioType && isMusculacaoLine) {
      setSelectedProductLine('');
      return;
    }

    // Se selecionou musculação mas tem linha de cardio, limpar
    if (isMusculacaoType && isCardioLine) {
      setSelectedProductLine('');
      return;
    }
  }, [selectedEquipmentType]); // Só executa quando o tipo muda

  // Aplicar filtros
  useEffect(() => {
    const newFilters: EquipmentFilter = {
      categories: [],
      brands: [],
      search: '',
      target: '',
    };

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

    if (selectedProductLine) {
      if (
        selectedEquipmentType === 'musculacao' &&
        ['superiores', 'inferiores', 'multifuncionais-musculacao', 'bancos'].includes(
          selectedProductLine
        )
      ) {
        newFilters.categories = [selectedProductLine];
      } else {
        newFilters.brands = [selectedProductLine];
      }
    }

    onFiltersChange(newFilters);
  }, [selectedEquipmentType, selectedProductLine]);

  const getCompatibleProductLines = (equipmentType: string) => {
    if (!equipmentType) {
      return [
        { value: '', label: t('allLines') },
        { value: 'red-line', label: t('lineRed') },
        { value: 'blue-line', label: t('lineBlue') },
        { value: 'superiores', label: t('subcategories.superiores') },
        { value: 'inferiores', label: t('subcategories.inferiores') },
        {
          value: 'multifuncionais-musculacao',
          label: t('subcategories.multifuncionais-musculacao'),
        },
        { value: 'bancos', label: t('subcategories.bancos') },
      ];
    }

    if (equipmentType === 'musculacao') {
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

    // Para esteiras, bicicletas, elípticos, simulador de escada - apenas Red e Blue Line
    if (['esteiras', 'bicicletas', 'elipticos', 'escadas'].includes(equipmentType)) {
      return [
        { value: '', label: t('allLines') },
        { value: 'red-line', label: t('lineRed') },
        { value: 'blue-line', label: t('lineBlue') },
      ];
    }

    // Fallback - não deveria chegar aqui
    return [{ value: '', label: t('allLines') }];
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

  // Função para obter cores baseadas na linha
  const getLineColors = (lineValue: string) => {
    switch (lineValue) {
      case 'red-line':
        return {
          bg: 'bg-[#9c1006]',
          text: 'text-white',
          hover: 'hover:bg-[#9c1006]/90',
        };
      case 'blue-line':
        return {
          bg: 'bg-[#61fbfe]',
          text: 'text-black',
          hover: 'hover:bg-[#61fbfe]/90',
        };
      default:
        return {
          bg: 'bg-gray-700',
          text: 'text-white',
          hover: 'hover:bg-gray-600',
        };
    }
  };

  const getFilterName = (value: string, type: 'equipment' | 'line') => {
    if (type === 'equipment') {
      return t(`equipmentTypes.${value}` as any) || value;
    } else {
      if (value === 'red-line') return t('lineRed');
      if (value === 'blue-line') return t('lineBlue');
      if (value === 'musculacao') return t('equipmentTypes.musculacao');
      return t(`subcategories.${value}` as any) || value;
    }
  };

  const [isEquipmentExpanded, setIsEquipmentExpanded] = useState(false);
  const [isLineExpanded, setIsLineExpanded] = useState(false);

  const FilterContent = () => (
    <>
      {/* Controles de filtro */}
      <div className='space-y-6'>
        {/* Tipo de Equipamento */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            {t('equipmentTypeLabel')}
          </label>

          {/* Botão Principal */}
          <button
            onClick={() => setIsEquipmentExpanded(!isEquipmentExpanded)}
            className='w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors'
          >
            <span className='text-gray-900 font-medium'>
              {selectedEquipmentType
                ? getFilterName(selectedEquipmentType, 'equipment')
                : t('allEquipmentTypes')}
            </span>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${isEquipmentExpanded ? 'rotate-180' : ''}`}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 9l-7 7-7-7'
              />
            </svg>
          </button>

          {/* Lista Expansiva */}
          {isEquipmentExpanded && (
            <div className='mt-2 space-y-2 border border-gray-200 rounded-xl p-2 bg-white'>
              {[
                { value: '', label: t('allEquipmentTypes') },
                { value: 'esteiras', label: t('equipmentTypes.esteiras') },
                { value: 'bicicletas', label: t('equipmentTypes.bicicletas') },
                { value: 'elipticos', label: t('equipmentTypes.elipticos') },
                { value: 'escadas', label: t('equipmentTypes.escadas') },
                { value: 'musculacao', label: t('equipmentTypes.musculacao') },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSelectedEquipmentType(option.value);
                    setSelectedProductLine('');
                    setIsEquipmentExpanded(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left ${
                    selectedEquipmentType === option.value
                      ? 'bg-gray-900 text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span>{option.label}</span>
                  {selectedEquipmentType === option.value && (
                    <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Linha/Subcategoria */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            {selectedEquipmentType === 'musculacao' ? t('subcategoryLabel') : t('productLineLabel')}
          </label>

          {/* Botão Principal */}
          <button
            onClick={() => setIsLineExpanded(!isLineExpanded)}
            disabled={!selectedEquipmentType}
            className={`w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl transition-colors ${
              selectedEquipmentType
                ? 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span className='font-medium'>
              {selectedProductLine
                ? getFilterName(selectedProductLine, 'line')
                : selectedEquipmentType === 'musculacao'
                  ? t('allSubcategories')
                  : t('allLines')}
            </span>
            <svg
              className={`w-5 h-5 transition-transform ${
                selectedEquipmentType ? 'text-gray-500' : 'text-gray-400'
              } ${isLineExpanded ? 'rotate-180' : ''}`}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 9l-7 7-7-7'
              />
            </svg>
          </button>

          {/* Lista Expansiva */}
          {isLineExpanded && selectedEquipmentType && (
            <div className='mt-2 space-y-2 border border-gray-200 rounded-xl p-2 bg-white'>
              {getCompatibleProductLines(selectedEquipmentType).map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSelectedProductLine(option.value);
                    setIsLineExpanded(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left ${
                    selectedProductLine === option.value
                      ? option.value === 'red-line'
                        ? 'bg-[#9c1006] text-white'
                        : option.value === 'blue-line'
                          ? 'bg-[#61fbfe] text-black'
                          : 'bg-gray-900 text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span>{option.label}</span>
                  {selectedProductLine === option.value && (
                    <svg
                      className={`w-4 h-4 ${option.value === 'blue-line' ? 'text-black' : 'text-white'}`}
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filtros Ativos */}
      {(selectedEquipmentType || selectedProductLine) && (
        <div className='mt-6 pt-4 border-t border-gray-100'>
          <h4 className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3'>
            {t('filtersApplied')}
          </h4>

          <div className='flex flex-wrap gap-2'>
            {selectedEquipmentType && (
              <span className='inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-900 text-white'>
                {getFilterName(selectedEquipmentType, 'equipment')}
                <button
                  onClick={() => setSelectedEquipmentType('')}
                  className='ml-2 hover:bg-white/20 rounded-full p-0.5 transition-colors'
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
              <span
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getLineColors(selectedProductLine).bg} ${getLineColors(selectedProductLine).text}`}
              >
                {getFilterName(selectedProductLine, 'line')}
                <button
                  onClick={() => setSelectedProductLine('')}
                  className={`ml-2 rounded-full p-0.5 transition-colors ${getLineColors(selectedProductLine).text === 'text-black' ? 'hover:bg-black/20' : 'hover:bg-white/20'}`}
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
      )}
    </>
  );

  if (isMobile) {
    return (
      <div className='bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden relative'>
        {/* Header Expansível */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className='w-full px-6 py-4 bg-black text-white flex items-center justify-between hover:bg-gray-900 transition-colors rounded-t-2xl'
        >
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center'>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z'
                />
              </svg>
            </div>
            <div className='flex items-center gap-3'>
              <div>
                <div className='text-base font-semibold text-left'>{t('filters')}</div>
                <div className='text-xs text-gray-300 text-left'>{t('refineSearch')}</div>
              </div>
              {filteredCount !== undefined && (
                <span className='bg-white/20 px-2 py-1 rounded-full text-xs'>{filteredCount}</span>
              )}
            </div>
          </div>
          <svg
            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
          </svg>
        </button>

        {/* Conteúdo Expansível */}
        {isExpanded && (
          <div className='p-6'>
            <FilterContent />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative'>
      {/* Header */}
      <div className='bg-black px-6 py-5 rounded-t-2xl'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm'>
              <svg
                className='w-5 h-5 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z'
                />
              </svg>
            </div>
            <div>
              <h3 className='text-lg font-bold text-white'>{t('filters')}</h3>
              <p className='text-gray-300 text-sm'>
                {filteredCount !== undefined ? filteredCount : 0}{' '}
                {locale === 'pt-BR'
                  ? filteredCount !== 1
                    ? 'equipamentos'
                    : 'equipamento'
                  : locale === 'es'
                    ? filteredCount !== 1
                      ? 'equipos'
                      : 'equipo'
                    : locale === 'zh-CN'
                      ? '设备'
                      : 'equipment'}
              </p>
            </div>
          </div>
          {(selectedEquipmentType || selectedProductLine) && (
            <button
              onClick={handleClearFilters}
              className='px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-all duration-200 backdrop-blur-sm'
            >
              {t('clear')}
            </button>
          )}
        </div>
      </div>

      <div className='p-6'>
        <FilterContent />
      </div>
    </div>
  );
}
