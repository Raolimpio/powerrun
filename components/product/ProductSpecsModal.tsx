'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useEffect, useState, useMemo } from 'react';
import { useEquipmentTranslations } from '@/hooks/useEquipmentTranslations';
import { Equipment } from '@/types';

interface ProductSpecsModalProps {
  equipment: Equipment;
  isOpen: boolean;
  onClose: () => void;
  productLine: 'red' | 'blue' | 'musculacao';
  colors: {
    text: string;
    solid: string;
    hover: string;
  };
}

export function ProductSpecsModal({ equipment, isOpen, onClose, colors }: ProductSpecsModalProps) {
  const [activeTab, setActiveTab] = useState('');
  const tCommon = useTranslations('common');
  const tProduct = useTranslations('product');
  const { translateSpecification } = useEquipmentTranslations();

  // Função para traduzir nomes de categorias
  const translateCategoryName = (categoryName: string): string => {
    try {
      return tCommon(`specCategories.${categoryName}`);
    } catch {
      return categoryName;
    }
  };

  // Função utilitária para filtrar especificações vazias
  const filterEmptySpecifications = (specifications: Record<string, any>) => {
    return Object.fromEntries(
      Object.entries(specifications).filter(([, value]) => {
        // Remove campos que contêm apenas "—" ou estão vazios
        return value && value.toString().trim() !== '—' && value.toString().trim() !== '';
      })
    );
  };

  // Close modal on 'Escape' key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  // Memoize the calculation of categories with deterministic ordering
  const specCategories = useMemo(() => {
    // Ordem e aliases por categoria para diferentes tipos de equipamentos (inclui cardio/spinning e musculação)
    const categories: Record<string, string[]> = {
      Principais: [
        // Cardio - Esteiras
        'Motor',
        'Motor/Inversor',
        'Velocidade Máxima',
        'Inclinação',
        'Sistema de inclinação',
        'Área útil',
        'Área Útil',
        // Cardio - Bicicletas
        'Roda de Inércia',
        'Disco de Inércia',
        'Sistema de Transmissão',
        'Freio',
        'Movimento Central',
        'Pé de Vela',
        // Cardio - Escada (NÃO inclui Inclinação - escada não tem inclinação ajustável)
        'Velocidade de operação',
        'Velocidade',
        'passos/min',
        'Área do degrau',
        // Musculação
        'Carga',
        'Carga Máxima',
        'Capacidade',
        'Capacidade de Uso',
        'Capacidade de Utilização',
        'Peso do Usuário',
      ],
      'Display e Controles': [
        'Display',
        'Módulo',
        'Módulo multifuncional',
        'Conteúdo da tela',
        'Idioma Display',
        'Atalhos de velocidade',
        'Atalhos de Velocidade',
        'Verificação cardíaca',
        'Verificação Cardíaca',
        'Botão de emergência',
      ],
      Ergonomia: [
        'Guidão',
        'Assento',
        'Assento (Selim)',
        'Banco',
        'Regulagens',
        'Ajuste do assento Vertical',
        'Ajuste do assento Horizontal',
        'Estofado',
        'Manopla/Pegada',
      ],
      Construção: [
        'Carenagens',
        'Carenagem',
        'Estrutura',
        'Revestimento',
        'Pintura',
        'Material',
        'Deck',
        'Sapatas',
        'Fixadores',
        'Bateria de Peso',
        'Cabos',
        'Alça',
        'Imagens/Modelo',
        'Estofado',
        'Lona',
        'Lona antiestática',
        'Largura da lona',
        'Plataforma/lona de corrida',
        'Manoplas',
        'Manopla/Pegada',
      ],
      'Dimensões e Peso': [
        'Dimensões (C x L)',
        'Dimensões (C x L x A)',
        'Dimensões Totais',
        'Dimensões',
        'Dimensões C × L × A (mm)',
        'Altura',
        'Largura',
        'Profundidade',
        'Base',
        'Peso do Equipamento',
        'Peso Total',
        'Peso',
      ],
      Operação: [
        'Lubrificação',
        'Tensão',
        'Fonte de energia',
        'Tipo de carga',
        'Rodas de transporte',
        'Rodas de Transporte',
        'Rodas/Porta-objetos',
        'Rodas de Transporte e Porta-objetos',
        'Rodízios',
        'Rodízio',
        'Porta-squeeze/objetos',
        'Porta-objetos',
        'Suporte p/ Celular',
        'Suporte p/ celular',
        'Suporte p/ celular e Garrafa',
        'Tomada USB',
        'Programas de treinamento',
        'Sistema de amortecimento',
        'Pedais',
        'Rolos',
        'Coluna de Suporte',
      ],
      Aparência: ['Cores', 'Cor'],
      Garantia: ['Garantia'],
    };

    const normalize = (str: string) => str.toLowerCase();

    const sortByCategoryOrder = (entries: [string, string][], keys: string[]) => {
      return entries.sort((a, b) => {
        const aIndex = keys.findIndex((k) => normalize(a[0]).includes(normalize(k)));
        const bIndex = keys.findIndex((k) => normalize(b[0]).includes(normalize(k)));
        const ai = aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex;
        const bi = bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex;
        if (ai !== bi) return ai - bi;
        return a[0].localeCompare(b[0]);
      });
    };

    const getSpecs = (keys: string[]) => {
      // Filtrar especificações vazias primeiro
      const filteredSpecs = filterEmptySpecifications(equipment.specifications);
      const matched = Object.entries(filteredSpecs).filter(([key]) => {
        const normalizedKey = normalize(key);
        return keys.some((catKey) => {
          const normalizedCatKey = normalize(catKey);
          // Busca exata ou parcial
          return normalizedKey === normalizedCatKey || 
                 normalizedKey.includes(normalizedCatKey) ||
                 normalizedCatKey.includes(normalizedKey);
        });
      });
      return sortByCategoryOrder(matched, keys);
    };

    // Filtrar especificações que não fazem sentido para o tipo de equipamento
    const filterByEquipmentType = (specs: [string, string][], categoryName: string) => {
      const equipmentId = equipment.id.toLowerCase();
      const isEscada = equipmentId.includes('escada');
      const isEsteira = equipmentId.includes('esteira');
      
      // Para escada, remover "Inclinação" da categoria Principais (escada não tem inclinação ajustável)
      if (categoryName === 'Principais' && isEscada) {
        return specs.filter(([key]) => {
          const normalizedKey = normalize(key);
          return !normalizedKey.includes('inclinação') && !normalizedKey.includes('inclinacao');
        });
      }
      
      // Para esteiras, manter todas as especificações
      return specs;
    };

    const allDefinedKeys = Object.values(categories).flat();
    const filteredSpecs = filterEmptySpecifications(equipment.specifications);
    
    // Coletar todas as especificações que já foram categorizadas
    const categorizedKeys = new Set<string>();
    Object.entries(categories).forEach(([, keys]) => {
      const specs = getSpecs(keys);
      specs.forEach(([key]) => categorizedKeys.add(key));
    });
    
    // Especificações restantes são aquelas que não foram categorizadas
    const remainingSpecs = Object.entries(filteredSpecs)
      .filter(([key]) => !categorizedKeys.has(key))
      .sort((a, b) => a[0].localeCompare(b[0]));

    const tabs: Record<string, any> = {};
    
    // Adicionar categorias de especificações (ordem definida)
    Object.entries(categories).forEach(([name, keys]) => {
      let specs = getSpecs(keys);
      // Filtrar especificações por tipo de equipamento
      specs = filterByEquipmentType(specs, name);
      if (specs.length > 0) {
        tabs[name] = specs;
      }
    });

    // NÃO adicionar Recursos aqui - já são destacados na página individual do produto
    
    // Adicionar especificações restantes em "Outras"
    if (remainingSpecs.length > 0) {
      tabs['Outras'] = remainingSpecs;
    }

    // Downloads sempre por último
    if (equipment.downloads && equipment.downloads.length > 0) {
      tabs['Downloads'] = equipment.downloads;
    }

    return tabs;
  }, [equipment]);

  // Set the initial active tab only when the modal opens
  useEffect(() => {
    if (isOpen) {
      const firstTab = Object.keys(specCategories)[0];
      if (firstTab) {
        setActiveTab(firstTab);
      }
    }
  }, [isOpen, specCategories]);

  if (!isOpen) return null;

  const renderContent = () => {
    if (!activeTab) return null;
    const content = specCategories[activeTab];
    if (!content) return null;

    // Recursos não são mostrados aqui - já são destacados na página individual do produto

    if (activeTab === 'Downloads') {
      return (
        <div className='space-y-3 w-full' style={{ maxWidth: '100%' }}>
          {content.map((download: any, index: number) => (
            <div
              key={`download-${download.name || download.title || index}`}
              className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200/80 w-full'
              style={{ maxWidth: '100%', minWidth: 0 }}
            >
              <div className='min-w-0 flex-1' style={{ maxWidth: '100%' }}>
                <p className='font-semibold text-sm text-gray-800 break-words' style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{download.name}</p>
                <p className='text-xs text-gray-500 uppercase'>{download.type}</p>
              </div>
              <button
                className='text-xs font-medium px-3 py-2 rounded-md flex-shrink-0 self-start sm:self-center transition-colors hover:opacity-80'
                style={{ color: colors.text, backgroundColor: `${colors.solid}15` }}
              >
                Baixar
              </button>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className='bg-gray-50/80 rounded-lg border border-gray-200/50 w-full' style={{ maxWidth: '100%', overflow: 'hidden' }}>
        <div className='divide-y divide-gray-200/50'>
          {content.map(([key, value]: [string, any]) => (
            <div
              key={key}
              className='flex flex-col sm:flex-row sm:grid sm:grid-cols-3 gap-2 sm:gap-4 px-3 sm:px-4 py-3 sm:py-4 w-full'
              style={{ maxWidth: '100%', minWidth: 0 }}
            >
              <dt className='text-sm font-medium text-gray-600 sm:col-span-1 break-words flex-shrink-0' style={{ maxWidth: '100%', minWidth: 0 }}>
                {translateSpecification(key)}:
              </dt>
              <dd
                className='text-sm font-semibold text-gray-900 sm:col-span-2 break-words'
                style={{ 
                  wordBreak: 'break-word', 
                  overflowWrap: 'anywhere',
                  maxWidth: '100%',
                  minWidth: 0,
                }}
              >
                {value}
              </dd>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4'
      onClick={onClose}
      style={{ 
        maxHeight: '100vh', 
        maxWidth: '100vw',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <div className='absolute inset-0 bg-black/60 backdrop-blur-md' aria-hidden='true' />
      <div
        className='relative z-10 w-full h-full sm:h-[90vh] sm:max-h-[90vh] sm:max-w-6xl bg-white sm:rounded-xl sm:rounded-2xl shadow-2xl flex flex-col'
        style={{
          maxHeight: '100vh',
          maxWidth: '100vw',
          height: '100%',
          width: '100%',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Fixo */}
        <div className='flex-shrink-0 flex items-start justify-between border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 bg-white' style={{ minHeight: '70px', maxHeight: '70px' }}>
          <div className='min-w-0 flex-1 pr-4'>
            <h2 className='text-base sm:text-lg font-bold text-gray-900 break-words'>
              {tProduct('specsCta')}
            </h2>
            <p className='text-xs sm:text-sm font-medium break-words' style={{ color: colors.solid }}>
              {equipment.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className='w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0'
            aria-label='Fechar'
          >
            <svg
              className='w-4 h-4 sm:w-5 sm:h-5 text-gray-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

        {/* Container Principal - Flexível */}
        <div 
          className='flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0'
          style={{
            height: 'calc(100% - 70px)',
            maxHeight: 'calc(100vh - 70px)',
            overflow: 'hidden',
          }}
        >
          {/* Sidebar - Tabs e Imagem */}
          <div 
            className='lg:w-72 xl:w-80 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-gray-200 bg-gray-50 lg:bg-white flex flex-col overflow-hidden'
            style={{
              maxHeight: '100%',
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
          >
            {/* Imagem - Desktop */}
            {equipment.images && equipment.images.length > 0 && (
              <div className='hidden lg:block p-4 border-b border-gray-200 flex-shrink-0'>
                <Image
                  src={equipment.images[0]}
                  alt={equipment.name}
                  width={280}
                  height={200}
                  className='rounded-lg object-cover w-full h-48'
                />
              </div>
            )}

            {/* Tabs de Navegação */}
            <div className='flex-1 overflow-y-auto overflow-x-hidden'>
              {/* Mobile: Layout Horizontal com Scroll */}
              <div className='lg:hidden p-3 border-b border-gray-200 bg-white flex-shrink-0'>
                <div
                  className='flex space-x-2 overflow-x-auto pb-2'
                  style={
                    {
                      scrollbarWidth: 'thin',
                      msOverflowStyle: 'auto',
                    } as React.CSSProperties
                  }
                >
                  {Object.keys(specCategories).map((tabName) => (
                    <button
                      key={tabName}
                      onClick={() => setActiveTab(tabName)}
                      className={`flex-shrink-0 px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                        activeTab === tabName ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      style={activeTab === tabName ? { backgroundColor: colors.solid } : {}}
                    >
                      {translateCategoryName(tabName)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Desktop: Layout Vertical */}
              <div className='hidden lg:block p-3 space-y-1'>
                {Object.keys(specCategories).map((tabName) => (
                  <button
                    key={tabName}
                    onClick={() => setActiveTab(tabName)}
                    className={`w-full text-left text-sm font-medium p-3 rounded-lg transition-colors ${
                      activeTab === tabName ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    style={activeTab === tabName ? { backgroundColor: colors.solid } : {}}
                  >
                    {translateCategoryName(tabName)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Conteúdo Principal - Scrollável */}
          <div
            className='flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 bg-white'
            style={{
              height: '100%',
              maxHeight: '100%',
              WebkitOverflowScrolling: 'touch',
              overflowX: 'hidden',
            }}
          >
            <div className='w-full' style={{ maxWidth: '100%' }}>
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
