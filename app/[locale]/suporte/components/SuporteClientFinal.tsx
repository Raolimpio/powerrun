'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button, EquipmentCard } from '@/components/ui';
import { SidebarFilter } from '@/components/ui/sidebar-filter';
import { getProductLineConfig } from '@/constants/product-line-mapping';
import { useEquipmentTranslations } from '@/hooks/useEquipmentTranslations';
import { Equipment, EquipmentFilter } from '@/types';

interface SuporteClientFinalProps {
  initialEquipments: Equipment[];
  translations: {
    listTitle: string;
    emptyTitle: string;
    emptySubtitle: string;
    materiaisDisponiveis: string;
    downloads: string;
    videos: string;
    especificacoes: string;
  };
  locale: string;
}

export function SuporteClientFinal({
  initialEquipments,
  translations,
  locale,
}: SuporteClientFinalProps) {
  const [equipments, setEquipments] = useState<Equipment[]>(initialEquipments);
  const [allEquipments, setAllEquipments] = useState<Equipment[]>(initialEquipments); // Lista completa para filtragem
  const [isLoading, setIsLoading] = useState(false);
  const { translateEquipment } = useEquipmentTranslations();

  // Estado dos filtros
  const [filters, setFilters] = useState<EquipmentFilter>({
    categories: [],
    brands: [],
    priceRange: [0, 100000],
    search: '',
    target: '',
  });

  // Estado para controle dos filtros do sidebar
  const [currentEquipmentType, setCurrentEquipmentType] = useState<string>('');
  const [currentProductLine, setCurrentProductLine] = useState<string>('');
  const filtersRef = useRef<EquipmentFilter>(filters);

  // Atualizar ref quando filters mudar
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  // Função para normalizar texto removendo acentos e caracteres especiais
  const normalizeText = useCallback((text: string): string => {
    if (!text) return '';
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .toLowerCase()
      .trim();
  }, []);

  // Traduzir equipamentos quando o idioma mudar
  useEffect(() => {
    const translatedEquipments = initialEquipments.map((equipment) =>
      translateEquipment(equipment)
    );
    setAllEquipments(translatedEquipments);
  }, [initialEquipments, translateEquipment, locale]);

  // Função para aplicar filtros localmente (sem API)
  const applyFilters = useCallback(
    (filtersToApply: EquipmentFilter) => {
      setIsLoading(true);

      setTimeout(() => {
        let filtered = [...allEquipments];

        // Filtro de busca por texto
        if (filtersToApply.search) {
          // Termo original e normalizado
          const originalSearchTerm = filtersToApply.search.toLowerCase();
          const searchTerm = normalizeText(filtersToApply.search);

          // Mapeamento de termos de busca para subcategorias (usar termo original e normalizado)
          const searchTermToSubcategory: Record<string, string[]> = {
            bicicleta: ['bicicletas-spinning', 'bicicletas-vertical', 'bicicletas-horizontal'],
            bike: ['bicicletas-spinning', 'bicicletas-vertical', 'bicicletas-horizontal'],
            esteira: ['esteiras'],
            treadmill: ['esteiras'],
            eliptico: ['eliptico'],
            elíptico: ['eliptico'],
            elliptical: ['eliptico'],
            escada: ['simulador-escada'],
            stair: ['simulador-escada'],
          };

          // Obter subcategorias correspondentes (tentar com termo original e normalizado)
          const matchingSubcategories =
            searchTermToSubcategory[originalSearchTerm] ||
            searchTermToSubcategory[searchTerm] ||
            [];

          filtered = filtered.filter((equipment) => {
            // 1. Buscar em todos os campos traduzidos com normalização
            const searchableText = [
              equipment.name,
              equipment.cardName || '',
              equipment.shortDescription,
              equipment.cardDescription || '',
              equipment.description || '',
              equipment.brand || '',
              equipment.model || '',
              equipment.features.join(' '),
            ]
              .filter(Boolean)
              .join(' ')
              .toLowerCase();

            // Normalizar o texto pesquisável para comparação
            const normalizedSearchableText = normalizeText(searchableText);

            // Verificar se o texto contém o termo de busca
            const textMatch =
              searchableText.includes(originalSearchTerm) ||
              searchableText.includes(searchTerm) ||
              normalizedSearchableText.includes(searchTerm);

            // 2. Verificar subcategoria do equipamento usando product-line-mapping
            let subcategoryMatch = false;
            try {
              const productConfig = getProductLineConfig(equipment.id);
              const equipmentSubcategory = productConfig.subcategory || '';

              // Verificar se o termo de busca corresponde a uma subcategoria conhecida
              if (matchingSubcategories.length > 0) {
                subcategoryMatch = matchingSubcategories.some(
                  (subcat) =>
                    equipmentSubcategory.includes(subcat) || subcat === equipmentSubcategory
                );
              }

              // Também verificar se a subcategoria contém o termo de busca (normalizado)
              if (!subcategoryMatch && equipmentSubcategory) {
                const normalizedSubcategory = normalizeText(equipmentSubcategory);
                subcategoryMatch =
                  normalizedSubcategory.includes(searchTerm) ||
                  equipmentSubcategory.toLowerCase().includes(originalSearchTerm);
              }
            } catch {
              // Se não conseguir obter a config, continuar apenas com busca de texto
            }

            // Retornar true se encontrar no texto OU na subcategoria
            return textMatch || subcategoryMatch;
          });
        }

        // Filtro por categoria usando product-line-mapping
        if (filtersToApply.categories && filtersToApply.categories.length > 0) {
          // Filter by search term
          filtered = filtered.filter((equipment) => {
            return filtersToApply.categories.some((category) => {
              // Categoria exata
              if (equipment.category?.toLowerCase() === category.toLowerCase()) {
                return true;
              }

              // Para categorias como 'cardio' e 'musculacao', usar product-line-mapping
              try {
                const productConfig = getProductLineConfig(equipment.id);
                if (category === 'cardio') {
                  return productConfig.type === 'cardio';
                }
                if (category === 'musculacao') {
                  return productConfig.type === 'musculacao';
                }
              } catch {
                console.warn('Erro ao obter config do produto:', equipment.id);
              }

              return false;
            });
          });
        }

        // Filtro por linha/marca (brands)
        if (filtersToApply.brands && filtersToApply.brands.length > 0) {
          // Filter by search term
          filtered = filtered.filter((equipment) => {
            return filtersToApply.brands.some((brand) => {
              // Primeiro, verificar categoria direta do equipment
              if (brand === 'blue-line' && equipment.category?.toLowerCase() === 'blue-line') {
                return true;
              }
              if (brand === 'red-line' && equipment.category?.toLowerCase() === 'red-line') {
                return true;
              }
              if (brand === 'musculacao' && equipment.category?.toLowerCase() === 'musculacao') {
                return true;
              }

              // Depois, usar product-line-mapping
              try {
                const productConfig = getProductLineConfig(equipment.id);

                if (brand === 'blue-line') {
                  return productConfig.line === 'blue';
                }
                if (brand === 'red-line') {
                  return productConfig.line === 'red';
                }
                if (brand === 'musculacao') {
                  return productConfig.line === 'musculacao';
                }
              } catch {
                console.warn('Erro ao obter config do produto:', equipment.id);
              }

              // Fallback para brand
              return equipment.brand?.toLowerCase().includes(brand.toLowerCase());
            });
          });
        }

        // Filtro por público-alvo
        if (filtersToApply.target) {
          const normalizedTarget = filtersToApply.target.toLowerCase();
          const targetMapping: Record<string, string> = {
            academias: 'academia',
            academia: 'academia',
            condominios: 'condominio',
            condominio: 'condominio',
            residencias: 'residencia',
            residencia: 'residencia',
          };

          const mappedTarget = targetMapping[normalizedTarget];
          if (mappedTarget) {
            filtered = filtered.filter((equipment) =>
              equipment.targets.includes(mappedTarget as 'academia' | 'condominio' | 'residencia')
            );
          }
        }

        setEquipments(filtered);
        setIsLoading(false);
      }, 150);
    },
    [allEquipments, normalizeText]
  );

  // Reaplicar filtros quando os equipamentos traduzidos mudarem
  useEffect(() => {
    if (allEquipments.length > 0) {
      applyFilters(filtersRef.current);
    }
  }, [allEquipments, applyFilters]);

  // Handler para mudanças nos filtros
  const handleFiltersChange = (newFilters: EquipmentFilter) => {
    // Atualizar estado centralizado para sincronização
    if (newFilters.search === 'esteira') {
      setCurrentEquipmentType('esteiras');
    } else if (newFilters.search === 'bicicleta') {
      setCurrentEquipmentType('bicicletas');
    } else if (newFilters.search === 'elíptico') {
      setCurrentEquipmentType('elipticos');
    } else if (newFilters.search === 'escada') {
      setCurrentEquipmentType('escadas');
    } else if (
      newFilters.categories.includes('musculacao') ||
      newFilters.categories.includes('superiores') ||
      newFilters.categories.includes('inferiores') ||
      newFilters.categories.includes('multifuncionais-musculacao') ||
      newFilters.categories.includes('bancos')
    ) {
      setCurrentEquipmentType('musculacao');
    } else {
      setCurrentEquipmentType('');
    }

    // Atualizar linha de produto ou subcategoria
    if (
      newFilters.categories[0] &&
      ['superiores', 'inferiores', 'multifuncionais-musculacao', 'bancos'].includes(
        newFilters.categories[0]
      )
    ) {
      setCurrentProductLine(newFilters.categories[0]);
    } else {
      setCurrentProductLine(newFilters.brands[0] || '');
    }

    setFilters(newFilters);
    applyFilters(newFilters);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Layout com Sidebar */}
      <div className='container mx-auto px-4 pt-28 pb-8'>
        <div className='lg:flex gap-8'>
          {/* Sidebar de Filtros */}
          <aside className='w-80 flex-shrink-0 hidden lg:block sticky top-28 self-start'>
            <SidebarFilter
              onFiltersChange={handleFiltersChange}
              initialEquipmentType={currentEquipmentType}
              initialProductLine={currentProductLine}
              filteredCount={equipments.length}
            />
          </aside>

          {/* Área Principal de Produtos */}
          <main className='flex-1 min-w-0'>
            {/* Filtro Mobile - Visível apenas em telas pequenas */}
            <div className='lg:hidden mb-6'>
              <SidebarFilter
                onFiltersChange={handleFiltersChange}
                initialEquipmentType={currentEquipmentType}
                initialProductLine={currentProductLine}
                filteredCount={equipments.length}
                isMobile={true}
              />
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className='flex items-center justify-center py-8'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
                <span className='ml-3 text-gray-600'>Filtrando...</span>
              </div>
            )}

            {/* Grid de Equipamentos */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
              {equipments.length === 0 ? (
                <div className='col-span-full text-center py-12'>
                  <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center'>
                    <svg
                      className='w-8 h-8 text-gray-400'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d={
                          filters.search ||
                          filters.categories.length > 0 ||
                          filters.brands.length > 0
                            ? 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                            : 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 002 2v10a2 2 0 002 2zM9 9h6v6H9V9z'
                        }
                      />
                    </svg>
                  </div>
                  <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                    {filters.search || filters.categories.length > 0 || filters.brands.length > 0
                      ? 'Nenhum equipamento encontrado'
                      : translations.emptyTitle}
                  </h3>
                  <p className='text-gray-600'>
                    {filters.search || filters.categories.length > 0 || filters.brands.length > 0
                      ? 'Tente ajustar os filtros para encontrar o equipamento que procura.'
                      : translations.emptySubtitle}
                  </p>
                  {(filters.search ||
                    filters.categories.length > 0 ||
                    filters.brands.length > 0) && (
                    <Button
                      variant='outline'
                      onClick={() => {
                        setFilters({
                          categories: [],
                          brands: [],
                          priceRange: [0, 100000],
                          search: '',
                          target: '',
                        });
                        setEquipments(allEquipments);
                      }}
                      className='mt-4'
                    >
                      Limpar Filtros
                    </Button>
                  )}
                </div>
              ) : (
                equipments.map((equipment) => (
                  <EquipmentCard key={equipment.id} equipment={equipment} linkPrefix='/suporte' />
                ))
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
