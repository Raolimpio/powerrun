'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, { useState, useEffect, useCallback } from 'react';
import { CloudinaryImage } from '@/components/performance/CloudinaryImage';
import { EquipmentCard } from '@/components/ui';
import { SidebarFilter } from '@/components/ui/sidebar-filter';
import { MOCK_EQUIPMENT } from '@/constants/equipment-data';
import { useEquipmentTranslations } from '@/hooks/useEquipmentTranslations';
import { groupTreadmillsBySeries, capitalize } from '@/lib/utils';
import { fetchEquipments } from '@/services/equipments';
import { Equipment, EquipmentFilter } from '@/types';

interface EquipamentosClientProps {
  initialEquipments: Equipment[] | undefined;
  translations: {
    listTitle: string;
    emptyTitle: string;
    emptySubtitle: string;
  };
  locale: string;
  initialFilters?: EquipmentFilter;
}

function EquipamentosClientComponent({
  initialEquipments,
  translations,
  locale,
  initialFilters,
}: EquipamentosClientProps) {
  const t = useTranslations('equipments');
  const tCommon = useTranslations('common');
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const { translateEquipment } = useEquipmentTranslations();

  // Buscar e traduzir equipamentos em destaque
  const getFeaturedEquipment = (id: string) => {
    const equipment = MOCK_EQUIPMENT.find((eq) => eq.id === id);
    if (equipment) {
      return translateEquipment(equipment);
    }
    return null;
  };

  const featuredEscada = getFeaturedEquipment('escada-pr600');
  const featuredBike = getFeaturedEquipment('bicicleta-spinning-pr200');
  const featuredEsteira = getFeaturedEquipment('power-race-7000-ts');
  const featuredMultiGym = getFeaturedEquipment('multi-gym-pr012');

  // Verificação de segurança: garantir que initialEquipments seja sempre um array válido
  const [filters, setFilters] = useState<EquipmentFilter>(
    initialFilters || {
      categories: [],
      brands: [],
      priceRange: [0, 100000],
      search: '',
      target: '',
    }
  );

  const [equipments, setEquipments] = useState<Equipment[]>(initialEquipments || []);
  const [hasAppliedFilters, setHasAppliedFilters] = useState(false);

  // Equipamentos em destaque agora integrados no SidebarFilter

  // Função para determinar equipmentType baseado nos query params
  const getInitialEquipmentType = () => {
    const search = searchParams.get('search');
    const categoria = searchParams.get('categoria');

    if (search === 'esteira') return 'esteiras';
    if (search === 'bicicleta') return 'bicicletas';
    if (search === 'elíptico') return 'elipticos';
    if (search === 'escada') return 'escadas';
    if (categoria === 'musculacao') return 'musculacao';

    return '';
  };

  // Estado para controle dos filtros COM valores iniciais baseados nos query params
  const [currentEquipmentType, setCurrentEquipmentType] =
    useState<string>(getInitialEquipmentType());
  const [currentProductLine, setCurrentProductLine] = useState<string>('');

  // Traduzir equipamentos iniciais APENAS na primeira renderização
  useEffect(() => {
    if (!hasAppliedFilters && initialEquipments && Array.isArray(initialEquipments)) {
      const translatedEquipments = initialEquipments.map((equipment) =>
        translateEquipment(equipment)
      );
      // Aplicar agrupamento de esteiras em séries na primeira renderização
      const groupedEquipments = groupTreadmillsBySeries(translatedEquipments);
      setEquipments(groupedEquipments);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ← Intencional: executa APENAS uma vez na montagem inicial

  // Sincroniza filtros via query string
  useEffect(() => {
    const categoryFromQuery = searchParams.get('categoria');
    const searchFromQuery = searchParams.get('search');

    if (categoryFromQuery || searchFromQuery) {
      const newFilters = {
        categories: categoryFromQuery ? [categoryFromQuery] : [],
        brands: [],
        search: searchFromQuery || '',
        target: '',
        priceRange: [0, 100000] as [number, number],
      };

      setFilters(newFilters);
    }
  }, [searchParams]);

  // Carregamento dinâmico de equipamentos baseado nos filtros
  useEffect(() => {
    // Verificar se há filtros ativos
    const hasActiveFilters = !!(
      filters.search ||
      filters.categories.length > 0 ||
      filters.brands.length > 0 ||
      filters.target
    );

    if (!hasActiveFilters) {
      // Sem filtros ativos - usar dados iniciais traduzidos
      if (hasAppliedFilters && initialEquipments && Array.isArray(initialEquipments)) {
        // SÓ muda se estava filtrado antes
        const translatedEquipments = initialEquipments.map((equipment) =>
          translateEquipment(equipment)
        );
        // Aplicar agrupamento de esteiras em séries quando não há filtros específicos
        const groupedEquipments = groupTreadmillsBySeries(translatedEquipments);
        setEquipments(groupedEquipments);
        setHasAppliedFilters(false);
      } else if (!hasAppliedFilters && initialEquipments && Array.isArray(initialEquipments)) {
        // Primeira renderização sem filtros - aplicar agrupamento de séries
        const translatedEquipments = initialEquipments.map((equipment) =>
          translateEquipment(equipment)
        );
        const groupedEquipments = groupTreadmillsBySeries(translatedEquipments);
        setEquipments(groupedEquipments);
      }
      return;
    }

    // Filtros ativos - carregar dados filtrados
    setHasAppliedFilters(true);
    let isMounted = true;

    async function load() {
      try {
        setIsLoading(true);
        const { data: eq } = await fetchEquipments({
          locale,
          search: filters.search,
          category: filters.categories[0],
          line: filters.brands[0] as 'red-line' | 'blue-line' | 'musculacao' | undefined,
          target: filters.target || undefined,
        });
        if (!isMounted) return;
        const translatedEq = (eq || []).map((equipment) => translateEquipment(equipment));
        setEquipments(translatedEq);
      } catch {
        // Em caso de erro, manter os dados atuais
        if (isMounted) {
          // Em caso de erro, manter os dados atuais
          setIsLoading(false);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [
    filters.search,
    filters.categories,
    filters.brands,
    filters.target,
    hasAppliedFilters,
    locale,
    translateEquipment,
    initialEquipments,
  ]);

  const handleFiltersChange = useCallback((newFilters: EquipmentFilter) => {
    // CORREÇÃO: Quando selecionamos apenas uma linha (Red/Blue), limpar o tipo específico
    const productLine = newFilters.brands[0] || '';
    const hasOnlyProductLine = productLine && !newFilters.search && !newFilters.categories.length;

    // Atualizar tipo de equipamento APENAS se não for seleção exclusiva de linha
    if (!hasOnlyProductLine) {
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
    } else {
      // Se é seleção exclusiva de linha, limpar o tipo específico
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
      setCurrentProductLine(productLine);
    }

    setFilters(newFilters);
    // Removido: Auto-scroll para produtos após filtrar
  }, []);

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Layout com Sidebar */}
      <div className='container mx-auto px-4 pt-28 pb-8'>
        <div className='lg:flex gap-8'>
          {/* Sidebar de Filtros */}
          <aside className='w-80 flex-shrink-0 hidden lg:block sticky top-28 self-start space-y-6'>
            <SidebarFilter
              onFiltersChange={handleFiltersChange}
              initialEquipmentType={currentEquipmentType}
              initialProductLine={currentProductLine}
              filteredCount={(equipments || []).length}
            />

            {/* Equipamentos em Destaque */}
            <div className='bg-white rounded-2xl p-4 shadow-sm border border-gray-100'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                {tCommon('featuredEquipments')}
              </h3>

              <div className='space-y-3'>
                <Link
                  href={`/${locale}/equipamentos/escada-pr600`}
                  className='group flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200'
                >
                  <img
                    src='https://res.cloudinary.com/dq0bovaz5/image/upload/v1755203715/11_gnm1yo.png'
                    alt='Escada PR600'
                    className='w-12 h-12 object-contain bg-gray-100 rounded-lg mr-3 flex-shrink-0'
                  />
                  <div className='flex-1'>
                    <div className='font-medium text-sm text-gray-900 group-hover:text-gray-700'>
                      {capitalize(featuredEscada?.name || 'Escada PR600')}
                    </div>
                    <div className='text-xs text-gray-500'>{t('heroBanners.escadas.title')}</div>
                  </div>
                  <svg
                    className='w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 5l7 7-7 7'
                    />
                  </svg>
                </Link>

                <Link
                  href={`/${locale}/equipamentos/bicicleta-spinning-pr200`}
                  className='group flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200'
                >
                  <img
                    src='https://res.cloudinary.com/dq0bovaz5/image/upload/v1756266844/Bike_Spinning_spk8jt.png'
                    alt='Bike Cross PR200'
                    className='w-12 h-12 object-contain bg-gray-100 rounded-lg mr-3 flex-shrink-0'
                  />
                  <div className='flex-1'>
                    <div className='font-medium text-sm text-gray-900 group-hover:text-gray-700'>
                      {capitalize(featuredBike?.name || 'Bike Cross PR200')}
                    </div>
                    <div className='text-xs text-gray-500'>{t('heroBanners.bicicletas.title')}</div>
                  </div>
                  <svg
                    className='w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 5l7 7-7 7'
                    />
                  </svg>
                </Link>

                <Link
                  href={`/${locale}/equipamentos/power-race-7000-ts`}
                  className='group flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200'
                >
                  <img
                    src='https://res.cloudinary.com/dq0bovaz5/image/upload/v1756300595/21_zs48vf.png'
                    alt='Esteira 7000TS'
                    className='w-12 h-12 object-contain bg-gray-100 rounded-lg mr-3 flex-shrink-0'
                  />
                  <div className='flex-1'>
                    <div className='font-medium text-sm text-gray-900 group-hover:text-gray-700'>
                      {capitalize(featuredEsteira?.name || 'Esteira 7000TS')}
                    </div>
                    <div className='text-xs text-gray-500'>{t('heroBanners.esteiras.title')}</div>
                  </div>
                  <svg
                    className='w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 5l7 7-7 7'
                    />
                  </svg>
                </Link>

                <Link
                  href={`/${locale}/equipamentos/multi-gym-pr012`}
                  className='group flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200'
                >
                  <img
                    src='https://res.cloudinary.com/dq0bovaz5/image/upload/v1755203716/13_kvflks.png'
                    alt='MultiGym PR012'
                    className='w-12 h-12 object-contain bg-gray-100 rounded-lg mr-3 flex-shrink-0'
                  />
                  <div className='flex-1'>
                    <div className='font-medium text-sm text-gray-900 group-hover:text-gray-700'>
                      {capitalize(featuredMultiGym?.name || 'MultiGym PR012')}
                    </div>
                    <div className='text-xs text-gray-500'>{t('heroBanners.musculacao.title')}</div>
                  </div>
                  <svg
                    className='w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 5l7 7-7 7'
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </aside>

          {/* Área Principal de Produtos */}
          <main className='flex-1 min-w-0'>
            {/* Filtro Mobile - Visível apenas em telas pequenas */}
            <div className='lg:hidden mb-6'>
              <SidebarFilter
                onFiltersChange={handleFiltersChange}
                initialEquipmentType={currentEquipmentType}
                initialProductLine={currentProductLine}
                filteredCount={(equipments || []).length}
                isMobile={true}
              />
            </div>

            {/* Banner Dinâmico */}
            <div className='mb-8'>
              {(() => {
                // PRIORIDADE 1: COMBINAÇÕES ESPECÍFICAS (Tipo + Linha)

                // ESTEIRAS + BLUE LINE
                if (currentEquipmentType === 'esteiras' && currentProductLine === 'blue-line') {
                  return (
                    <div className='relative overflow-hidden rounded-2xl h-64 bg-gradient-to-r from-[#61fbfe]/20 to-[#00bcd4]/20'>
                      <CloudinaryImage
                        src='https://res.cloudinary.com/dq0bovaz5/image/upload/v1756335223/Design_sem_nome_-_2025-08-27T195336.831_cxy6pq.png'
                        alt='Esteiras Blue Line'
                        fill
                        className='object-cover rounded-2xl'
                        sizes='(max-width: 768px) 100vw, 50vw'
                        quality={80}
                      />
                      <div className='absolute inset-0 bg-black/30 rounded-2xl'></div>
                      <div className='relative z-10 p-8 h-full flex flex-col justify-center carousel-card-text no-border'>
                        <div>
                          <h2 className='text-3xl font-bold text-white mb-2'>
                            {t('heroBanners.blueLineTreadmills.title')}
                          </h2>
                          <p className='text-white/90 text-lg'>
                            {t('heroBanners.blueLineTreadmills.subtitle')}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }

                // ESTEIRAS + RED LINE
                if (currentEquipmentType === 'esteiras' && currentProductLine === 'red-line') {
                  return (
                    <div className='relative overflow-hidden rounded-2xl h-64 bg-gradient-to-r from-[#9c1006]/20 to-[#d32f2f]/20'>
                      <CloudinaryImage
                        src='https://res.cloudinary.com/dq0bovaz5/image/upload/v1756363528/Design_sem_nome_-_2025-08-28T034501.828_wrvqwr.png'
                        alt='Esteiras Red Line'
                        fill
                        className='object-cover rounded-2xl'
                        sizes='(max-width: 768px) 100vw, 50vw'
                        quality={80}
                      />
                      <div className='absolute inset-0 bg-black/30 rounded-2xl'></div>
                      <div className='relative z-10 p-8 h-full flex flex-col justify-center carousel-card-text no-border'>
                        <div>
                          <h2 className='text-3xl font-bold text-white mb-2'>
                            {t('heroBanners.redLineTreadmills.title')}
                          </h2>
                          <p className='text-white/90 text-lg'>
                            {t('heroBanners.redLineTreadmills.subtitle')}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }

                // BICICLETAS + BLUE LINE
                if (currentEquipmentType === 'bicicletas' && currentProductLine === 'blue-line') {
                  return (
                    <div className='relative overflow-hidden rounded-2xl h-64 bg-gradient-to-r from-[#61fbfe]/20 to-[#00bcd4]/20'>
                      <CloudinaryImage
                        src='https://res.cloudinary.com/dq0bovaz5/image/upload/v1756361457/Design_sem_nome_-_2025-08-28T030847.647_shh2ip.png'
                        alt='Bicicletas Blue Line'
                        fill
                        className='object-cover rounded-2xl'
                        sizes='(max-width: 768px) 100vw, 50vw'
                        quality={80}
                      />
                      <div className='absolute inset-0 bg-black/30 rounded-2xl'></div>
                      <div className='relative z-10 p-8 h-full flex flex-col justify-center carousel-card-text no-border'>
                        <div>
                          <h2 className='text-3xl font-bold text-white mb-2'>
                            {t('heroBanners.blueLineBikes.title')}
                          </h2>
                          <p className='text-white/90 text-lg'>
                            {t('heroBanners.blueLineBikes.subtitle')}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }

                // BICICLETAS + RED LINE
                if (currentEquipmentType === 'bicicletas' && currentProductLine === 'red-line') {
                  return (
                    <div className='relative overflow-hidden rounded-2xl h-64 bg-gradient-to-r from-[#9c1006]/20 to-[#d32f2f]/20'>
                      <CloudinaryImage
                        src='https://res.cloudinary.com/dq0bovaz5/image/upload/v1756363006/7_t5vk0x.png'
                        alt='Bicicletas Red Line'
                        fill
                        className='object-cover rounded-2xl'
                        sizes='(max-width: 768px) 100vw, 50vw'
                        quality={80}
                      />
                      <div className='absolute inset-0 bg-black/30 rounded-2xl'></div>
                      <div className='relative z-10 p-8 h-full flex flex-col justify-center carousel-card-text no-border'>
                        <div>
                          <h2 className='text-3xl font-bold text-white mb-2'>
                            {t('heroBanners.redLineBikes.title')}
                          </h2>
                          <p className='text-white/90 text-lg'>
                            {t('heroBanners.redLineBikes.subtitle')}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }

                // ELÍPTICOS + BLUE LINE
                if (currentEquipmentType === 'elipticos' && currentProductLine === 'blue-line') {
                  return (
                    <div className='relative overflow-hidden rounded-2xl h-64 bg-gradient-to-r from-[#61fbfe]/20 to-[#00bcd4]/20'>
                      <CloudinaryImage
                        src='https://res.cloudinary.com/dq0bovaz5/image/upload/v1756361554/Design_sem_nome_-_2025-08-28T030909.601_glp1nb.png'
                        alt='Elípticos Blue Line'
                        fill
                        className='object-cover rounded-2xl'
                        sizes='(max-width: 768px) 100vw, 50vw'
                        quality={80}
                      />
                      <div className='absolute inset-0 bg-black/30 rounded-2xl'></div>
                      <div className='relative z-10 p-8 h-full flex flex-col justify-center carousel-card-text no-border'>
                        <div>
                          <h2 className='text-3xl font-bold text-white mb-2'>
                            {t('heroBanners.blueLineEllipticals.title')}
                          </h2>
                          <p className='text-white/90 text-lg'>
                            {t('heroBanners.blueLineEllipticals.subtitle')}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }

                // ELÍPTICOS + RED LINE
                if (currentEquipmentType === 'elipticos' && currentProductLine === 'red-line') {
                  return (
                    <div className='relative overflow-hidden rounded-2xl h-64 bg-gradient-to-r from-[#9c1006]/20 to-[#d32f2f]/20'>
                      <CloudinaryImage
                        src='https://res.cloudinary.com/dq0bovaz5/image/upload/v1756366247/10_dbavyj.png'
                        alt='Elípticos Red Line'
                        fill
                        className='object-cover rounded-2xl'
                        sizes='(max-width: 768px) 100vw, 50vw'
                        quality={80}
                      />
                      <div className='absolute inset-0 bg-black/30 rounded-2xl'></div>
                      <div className='relative z-10 p-8 h-full flex flex-col justify-center carousel-card-text no-border'>
                        <div>
                          <h2 className='text-3xl font-bold text-white mb-2'>
                            {t('heroBanners.redLineEllipticals.title')}
                          </h2>
                          <p className='text-white/90 text-lg'>
                            {t('heroBanners.redLineEllipticals.subtitle')}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }

                // ESCADAS + BLUE LINE
                if (currentEquipmentType === 'escadas' && currentProductLine === 'blue-line') {
                  return (
                    <div className='relative overflow-hidden rounded-2xl h-64 bg-gradient-to-r from-[#61fbfe]/20 to-[#00bcd4]/20'>
                      <CloudinaryImage
                        src='https://res.cloudinary.com/dq0bovaz5/image/upload/v1756361586/Design_sem_nome_-_2025-08-28T030918.969_qsyx9k.png'
                        alt='Escadas Blue Line'
                        fill
                        className='object-cover rounded-2xl'
                        sizes='(max-width: 768px) 100vw, 50vw'
                        quality={80}
                      />
                      <div className='absolute inset-0 bg-black/30 rounded-2xl'></div>
                      <div className='relative z-10 p-8 h-full flex flex-col justify-center carousel-card-text no-border'>
                        <div>
                          <h2 className='text-3xl font-bold text-white mb-2'>
                            {t('heroBanners.blueLineStairs.title')}
                          </h2>
                          <p className='text-white/90 text-lg'>
                            {t('heroBanners.blueLineStairs.subtitle')}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }

                // ESCADAS + RED LINE
                if (currentEquipmentType === 'escadas' && currentProductLine === 'red-line') {
                  return (
                    <div className='relative overflow-hidden rounded-2xl h-64 bg-gradient-to-r from-[#9c1006]/20 to-[#d32f2f]/20'>
                      <CloudinaryImage
                        src='https://res.cloudinary.com/dq0bovaz5/image/upload/v1756366275/9_itrub3.png'
                        alt='Escadas Red Line'
                        fill
                        className='object-cover rounded-2xl'
                        sizes='(max-width: 768px) 100vw, 50vw'
                        quality={80}
                      />
                      <div className='absolute inset-0 bg-black/30 rounded-2xl'></div>
                      <div className='relative z-10 p-8 h-full flex flex-col justify-center carousel-card-text no-border'>
                        <div>
                          <h2 className='text-3xl font-bold text-white mb-2'>
                            {t('heroBanners.redLineStairs.title')}
                          </h2>
                          <p className='text-white/90 text-lg'>
                            {t('heroBanners.redLineStairs.subtitle')}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }

                // PRIORIDADE 2: Apenas linhas específicas (sem tipo)
                if (currentProductLine === 'blue-line' && !currentEquipmentType) {
                  return (
                    <div className='relative overflow-hidden rounded-2xl h-64 bg-gradient-to-r from-[#61fbfe]/20 to-[#00bcd4]/20'>
                      <CloudinaryImage
                        src='https://res.cloudinary.com/dq0bovaz5/image/upload/v1756334905/Design_sem_nome_-_2025-08-27T191245.756_at3sj6.png'
                        alt='Blue Line Premium'
                        fill
                        className='object-cover rounded-2xl'
                        sizes='(max-width: 768px) 100vw, 50vw'
                        quality={80}
                      />
                      <div className='absolute inset-0 bg-black/30 rounded-2xl'></div>
                      <div className='relative z-10 p-8 h-full flex flex-col justify-center carousel-card-text no-border'>
                        <div>
                          <h2 className='text-3xl font-bold text-white mb-2'>
                            {t('heroBanners.blueLinePremium.title')}
                          </h2>
                          <p className='text-white/90 text-lg'>
                            {t('heroBanners.blueLinePremium.subtitle')}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }

                if (currentProductLine === 'red-line' && !currentEquipmentType) {
                  return (
                    <div className='relative overflow-hidden rounded-2xl h-64 bg-gradient-to-r from-[#9c1006]/20 to-[#d32f2f]/20'>
                      <CloudinaryImage
                        src='https://res.cloudinary.com/dq0bovaz5/image/upload/v1756363528/Design_sem_nome_-_2025-08-28T034501.828_wrvqwr.png'
                        alt='Red Line Padrão'
                        fill
                        className='object-cover rounded-2xl'
                        sizes='(max-width: 768px) 100vw, 50vw'
                        quality={80}
                      />
                      <div className='absolute inset-0 bg-black/30 rounded-2xl'></div>
                      <div className='relative z-10 p-8 h-full flex flex-col justify-center carousel-card-text no-border'>
                        <div>
                          <h2 className='text-3xl font-bold text-white mb-2'>
                            {t('heroBanners.redLinePremium.title')}
                          </h2>
                          <p className='text-white/90 text-lg'>
                            {t('heroBanners.redLinePremium.subtitle')}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }

                // PRIORIDADE 3: Apenas tipos específicos (sem linha)
                if (currentEquipmentType === 'esteiras' && !currentProductLine) {
                  return (
                    <div className='relative overflow-hidden rounded-2xl h-64 bg-gradient-to-r from-[#61fbfe]/20 to-[#00bcd4]/20'>
                      <CloudinaryImage
                        src='https://res.cloudinary.com/dq0bovaz5/image/upload/v1756334905/Design_sem_nome_-_2025-08-27T191245.756_at3sj6.png'
                        alt='Esteiras Profissionais'
                        fill
                        className='object-cover rounded-2xl'
                        sizes='(max-width: 768px) 100vw, 50vw'
                        quality={80}
                      />
                      <div className='absolute inset-0 bg-black/30 rounded-2xl'></div>
                      <div className='relative z-10 p-8 h-full flex flex-col justify-center carousel-card-text no-border'>
                        <div>
                          <h2 className='text-3xl font-bold text-white mb-2'>
                            {t('heroBanners.esteiras.title')}
                          </h2>
                          <p className='text-white/90 text-lg'>
                            {t('heroBanners.esteiras.subtitle')}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }

                if (currentEquipmentType === 'bicicletas' && !currentProductLine) {
                  return (
                    <div className='relative overflow-hidden rounded-2xl h-64 bg-gradient-to-r from-blue-600/20 to-blue-500/20'>
                      <CloudinaryImage
                        src='https://res.cloudinary.com/dq0bovaz5/image/upload/v1756361493/Design_sem_nome_-_2025-08-28T030842.523_tjiry1.png'
                        alt='Bicicletas Ergométricas'
                        fill
                        className='object-cover rounded-2xl'
                        sizes='(max-width: 768px) 100vw, 50vw'
                        quality={80}
                      />
                      <div className='absolute inset-0 bg-black/30 rounded-2xl'></div>
                      <div className='relative z-10 p-8 h-full flex flex-col justify-center carousel-card-text no-border'>
                        <div>
                          <h2 className='text-3xl font-bold text-white mb-2'>
                            {t('heroBanners.bicicletas.title')}
                          </h2>
                          <p className='text-white/90 text-lg'>
                            {t('heroBanners.bicicletas.subtitle')}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }

                if (currentEquipmentType === 'elipticos' && !currentProductLine) {
                  return (
                    <div className='relative overflow-hidden rounded-2xl h-64 bg-gradient-to-r from-purple-600/20 to-purple-500/20'>
                      <CloudinaryImage
                        src='https://res.cloudinary.com/dq0bovaz5/image/upload/v1756361554/Design_sem_nome_-_2025-08-28T030909.601_glp1nb.png'
                        alt='Elípticos Avançados'
                        fill
                        className='object-cover rounded-2xl'
                        sizes='(max-width: 768px) 100vw, 50vw'
                        quality={80}
                      />
                      <div className='absolute inset-0 bg-black/30 rounded-2xl'></div>
                      <div className='relative z-10 p-8 h-full flex flex-col justify-center carousel-card-text no-border'>
                        <div>
                          <h2 className='text-3xl font-bold text-white mb-2'>
                            {t('heroBanners.elipticos.title')}
                          </h2>
                          <p className='text-white/90 text-lg'>
                            {t('heroBanners.elipticos.subtitle')}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }

                if (currentEquipmentType === 'escadas' && !currentProductLine) {
                  return (
                    <div className='relative overflow-hidden rounded-2xl h-64 bg-gradient-to-r from-orange-600/20 to-orange-500/20'>
                      <CloudinaryImage
                        src='https://res.cloudinary.com/dq0bovaz5/image/upload/v1756361586/Design_sem_nome_-_2025-08-28T030918.969_qsyx9k.png'
                        alt='Simuladores de Escada'
                        fill
                        className='object-cover rounded-2xl'
                        sizes='(max-width: 768px) 100vw, 50vw'
                        quality={80}
                      />
                      <div className='absolute inset-0 bg-black/30 rounded-2xl'></div>
                      <div className='relative z-10 p-8 h-full flex flex-col justify-center carousel-card-text no-border'>
                        <div>
                          <h2 className='text-3xl font-bold text-white mb-2'>
                            {t('heroBanners.escadas.title')}
                          </h2>
                          <p className='text-white/90 text-lg'>
                            {t('heroBanners.escadas.subtitle')}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }

                if (currentEquipmentType === 'musculacao') {
                  return (
                    <div className='relative overflow-hidden rounded-2xl h-64 bg-black'>
                      <div className='absolute inset-0 bg-gradient-to-r from-gray-900 to-black'></div>
                      <div className='relative z-10 p-8 h-full flex flex-col justify-center carousel-card-text no-border'>
                        <div>
                          <h2 className='text-3xl font-bold text-white mb-2'>
                            {t('heroBanners.musculacao.title')}
                          </h2>
                          <p className='text-white/90 text-lg'>
                            {t('heroBanners.musculacao.subtitle')}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }

                // PADRÃO: Sem filtros específicos
                return (
                  <div className='relative overflow-hidden rounded-2xl h-64 bg-gradient-to-r from-[#61fbfe]/20 to-[#00bcd4]/20'>
                    <CloudinaryImage
                      src='https://res.cloudinary.com/dq0bovaz5/image/upload/v1756334905/Design_sem_nome_-_2025-08-27T191245.756_at3sj6.png'
                      alt='Power Run - Todos os Equipamentos'
                      fill
                      className='object-cover rounded-2xl'
                      sizes='(max-width: 768px) 100vw, 50vw'
                      quality={80}
                    />
                    <div className='absolute inset-0 bg-black/30 rounded-2xl'></div>
                    <div className='relative z-10 p-8 h-full flex flex-col justify-center carousel-card-text no-border'>
                      <div>
                        <h2 className='text-3xl font-bold text-white mb-2'>
                          {t('heroBanners.allEquipment.title')}
                        </h2>
                        <p className='text-white/90 text-lg'>
                          {t('heroBanners.allEquipment.subtitle')}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6'>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className='animate-pulse bg-white rounded-xl h-80 shadow-sm' />
                ))}
              </div>
            )}

            {/* Grid de Equipamentos */}
            {!isLoading && (
              <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6'>
                {(equipments || []).length === 0 ? (
                  <div className='col-span-full text-center py-16'>
                    <div className='w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center'>
                      <svg
                        className='w-10 h-10 text-gray-400'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 002 2v10a2 2 0 002 2zM9 9h6v6H9V9z'
                        />
                      </svg>
                    </div>
                    <h3 className='text-2xl font-semibold text-gray-900 mb-3'>
                      {translations.emptyTitle}
                    </h3>
                    <p className='text-gray-600 max-w-md mx-auto'>{translations.emptySubtitle}</p>
                  </div>
                ) : (
                  (equipments || []).map((equipment: Equipment) => (
                    <EquipmentCard
                      key={`${equipment.id}-${equipment.name}`}
                      equipment={equipment}
                    />
                  ))
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export const EquipamentosClient = React.memo(EquipamentosClientComponent);
