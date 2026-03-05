'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import { useEquipmentTranslations } from '@/hooks/useEquipmentTranslations';
import { capitalize } from '@/lib/utils';
import { fetchEquipments } from '@/services/equipments';
import { Equipment } from '@/types';

interface MegaMenuProps {
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  isAnimating?: boolean;
}

export function MegaMenu({
  onClose,
  onMouseEnter,
  onMouseLeave,
  isAnimating = true,
}: MegaMenuProps) {
  const [activeCategory, setActiveCategory] = useState('esteiras');
  const [redLineEquipments, setRedLineEquipments] = useState<Equipment[]>([]);
  const [blueLineEquipments, setBlueLineEquipments] = useState<Equipment[]>([]);
  const [musculationEquipments, setMusculationEquipments] = useState<Record<string, Equipment[]>>(
    {}
  );
  const [highlightEquipments, setHighlightEquipments] = useState<Equipment[]>([]);

  const t = useTranslations('common');
  const tCategories = useTranslations('categories');
  const locale = useLocale();
  const { translateEquipment } = useEquipmentTranslations();

  // Categorias principais
  const mainCategories = [
    { id: 'esteiras', slug: 'esteiras', searchTerm: 'esteira' },
    { id: 'bicicletas', slug: 'bicicletas', searchTerm: 'bicicleta' },
    { id: 'elipticos', slug: 'elipticos', searchTerm: 'eliptico' },
    { id: 'simulador-escada', slug: 'simulador-escada', searchTerm: 'escada' },
    { id: 'musculacao', slug: 'musculacao', category: 'musculacao' },
  ];

  // Subcategorias de musculação
  const musculationSubcategories = [
    {
      id: 'membros-superiores',
      name: 'Membros Superiores',
      equipments: ['pr001', 'pr002', 'pr003', 'pr004'],
    },
    {
      id: 'membros-inferiores',
      name: 'Membros Inferiores',
      equipments: ['pr005', 'pr006', 'pr008', 'pr015'],
    },
    {
      id: 'multifuncionais-bancos',
      name: 'Multifuncionais + Bancos',
      equipments: ['pr009', 'pr010', 'pr012', 'pr013', 'pr014'],
    },
  ];

  // Produtos de destaque fixos
  const fixedHighlights = [
    'multi-gym-pr012', // Multigym
    'escada-pr600', // Escada Red Line (PR600)
    'power-race-7000', // Esteiras Blue Line (Power Race 7000)
  ];

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        // Carregar todos os equipamentos
        const { data: allEquipments } = await fetchEquipments({ locale });

        if (!allEquipments || !isMounted) return;

        // Separar equipamentos por Red Line e Blue Line
        const redLine = allEquipments.filter((eq) => eq.category === 'red-line');
        const blueLine = allEquipments.filter((eq) => eq.category === 'blue-line');

        // Carregar equipamentos de musculação
        const musculationEqs = allEquipments.filter((eq) => eq.category === 'musculacao');
        const musculationData: Record<string, Equipment[]> = {};

        // Mapear equipamentos por subcategoria de musculação
        for (const subcategory of musculationSubcategories) {
          musculationData[subcategory.id] = musculationEqs.filter((eq) =>
            subcategory.equipments.some((eqId) => eq.id.includes(eqId))
          );
        }

        // Carregar destaques fixos
        const highlights = allEquipments.filter((eq) => fixedHighlights.includes(eq.id));

        if (isMounted) {
          setRedLineEquipments(redLine);
          setBlueLineEquipments(blueLine);
          setMusculationEquipments(musculationData);
          setHighlightEquipments(highlights);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do MegaMenu:', error);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [locale]);

  // Funções para filtrar equipamentos por categoria ativa (agrupadas por séries)
  const getEquipmentsForActiveCategory = (line: 'red' | 'blue') => {
    if (activeCategory === 'musculacao') {
      return []; // Musculação não usa Red/Blue Line
    }

    const equipments = line === 'red' ? redLineEquipments : blueLineEquipments;

    // Para esteiras, agrupar por séries
    if (activeCategory === 'esteiras') {
      if (line === 'red') {
        // Representantes de cada série Red Line (escolher um equipamento por série)
        const series = [];

        // PR4000 Series (representa 1.8HP + 3.0HP)
        const pr4000 = equipments.find((eq) => eq.id === 'esteira-pr4000-30'); // Usar 3.0HP como representante
        if (pr4000) series.push(pr4000);

        // PR5000 Series (representa PR5000 + PR5000i)
        const pr5000 = equipments.find((eq) => eq.id === 'esteira-pr5000');
        if (pr5000) series.push(pr5000);

        // PR6000 Series (representa PR6000 + PR6000i)
        const pr6000 = equipments.find((eq) => eq.id === 'esteira-pr6000');
        if (pr6000) series.push(pr6000);

        return series;
      } else {
        // Blue Line - Power Race 7000 Series
        const powerRace = equipments.find((eq) => eq.id === 'power-race-7000'); // Usar padrão como representante
        return powerRace ? [powerRace] : [];
      }
    }

    // Para outras categorias, usar lógica normal
    const searchTerm = mainCategories.find((cat) => cat.id === activeCategory)?.searchTerm;
    if (!searchTerm) return [];

    const filtered = equipments.filter((eq) => {
      const nameMatch = eq.name.toLowerCase().includes(searchTerm);
      const descriptionMatch = eq.description?.toLowerCase().includes(searchTerm);
      const shortDescriptionMatch = eq.shortDescription?.toLowerCase().includes(searchTerm);
      const modelMatch = eq.model?.toLowerCase().includes(searchTerm);

      // Filtros específicos por categoria
      let categorySpecificMatch = false;

      if (activeCategory === 'bicicletas') {
        categorySpecificMatch =
          eq.id.includes('bike') || eq.id.includes('bicicleta') || eq.id.includes('power-rush');
      } else if (activeCategory === 'elipticos') {
        categorySpecificMatch = eq.id.includes('eliptico') || eq.id.includes('power-round');
      } else if (activeCategory === 'simulador-escada') {
        categorySpecificMatch = eq.id.includes('escada') || eq.id.includes('power-rise');
      }

      return (
        nameMatch ||
        descriptionMatch ||
        shortDescriptionMatch ||
        modelMatch ||
        categorySpecificMatch
      );
    });

    return filtered.slice(0, 6);
  };

  const getMusculationEquipmentsForSubcategory = (subcategoryId: string) => {
    return musculationEquipments[subcategoryId] || [];
  };

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  return (
    <>
      <div
        className={`fixed top-[65px] left-0 w-full bg-white backdrop-blur-2xl shadow-2xl border-t border-gray-200 z-[60] transition-all duration-300 ease-out ${
          isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Container alinhado com o header */}
        <div
          className={`w-full px-4 pt-8 pb-6 transition-all duration-500 ease-out ${
            isAnimating ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {/* Coluna 1 - Categorias */}
            <div className='space-y-3'>
              <h3 className='text-gray-900 font-bold text-lg border-b border-gray-200 pb-2'>
                Categorias
              </h3>
              <div className='space-y-1'>
                {mainCategories.map((category) => (
                  <div
                    key={category.id}
                    onMouseEnter={() => handleCategoryClick(category.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                      activeCategory === category.id
                        ? 'bg-[#0D0D0D] text-white transform scale-105'
                        : 'hover:bg-gray-100 text-gray-700 hover:transform hover:scale-102'
                    }`}
                  >
                    <span className='font-medium text-sm'>{tCategories(category.id)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Colunas 2 e 3 - Conteúdo Dinâmico */}
            {activeCategory === 'musculacao' ? (
              // Para Musculação - Subcategorias
              <>
                {musculationSubcategories.slice(0, 2).map((subcategory) => (
                  <div key={subcategory.id} className='space-y-4'>
                    <div className='border-b border-gray-200 pb-2'>
                      <h4 className='text-gray-900 font-semibold text-base'>{subcategory.name}</h4>
                    </div>

                    <div className='space-y-2'>
                      {getMusculationEquipmentsForSubcategory(subcategory.id)
                        .slice(0, 6)
                        .map((item) => {
                          const translatedItem = translateEquipment(item);
                          return (
                            <Link
                              key={item.id}
                              href={`/equipamentos/${item.id}` as any}
                              onClick={onClose}
                              className='group block'
                            >
                              <div className='flex items-center gap-3 p-2 rounded-lg group-hover:bg-gray-100 transition-all duration-200 hover:transform hover:scale-102 duration-200 hover:transform hover:scale-102'>
                                <div className='w-10 h-10 rounded-md overflow-hidden flex-shrink-0'>
                                  <Image
                                    src={translatedItem.images[0]}
                                    alt={translatedItem.name}
                                    width={40}
                                    height={40}
                                    className='object-cover w-full h-full transition-transform group-hover:scale-110'
                                  />
                                </div>
                                <div className='flex-1 min-w-0'>
                                  <p className='font-medium text-sm truncate text-gray-900'>
                                    {capitalize(translatedItem.name)}
                                  </p>
                                  <p className='text-xs truncate text-gray-500'>
                                    {translatedItem.brand}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          );
                        })}

                      {/* Ver todos desta subcategoria */}
                      <Link
                        href='/equipamentos?categoria=musculacao'
                        onClick={onClose}
                        className='inline-flex items-center text-gray-600 hover:text-[#0D0D0D] text-sm font-medium mt-2 transition-colors'
                      >
                        {t('verTodos')} →
                      </Link>
                    </div>
                  </div>
                ))}

                {/* Terceira subcategoria na coluna de destaques será tratada mais abaixo */}
              </>
            ) : (
              // Para outras categorias - Red Line vs Blue Line
              <>
                <div className='space-y-4'>
                  <div className='border-b border-gray-200 pb-2'>
                    <h4 className='text-gray-900 font-semibold text-base'>Red Line</h4>
                    <p className='text-gray-500 text-xs'>Red Line</p>
                  </div>

                  <div className='space-y-2'>
                    {getEquipmentsForActiveCategory('red').map((item) => {
                      const translatedItem = translateEquipment(item);

                      // Nomes das séries como na página de categorias
                      let displayName = translatedItem.name;
                      let seriesDescription = translatedItem.brand;

                      if (activeCategory === 'esteiras') {
                        if (item.id === 'esteira-pr4000-30') {
                          displayName = 'PR 4000 Series';
                          seriesDescription = 'Red Line com 2 modelos disponíveis';
                        } else if (item.id === 'esteira-pr5000') {
                          displayName = 'PR 5000 Series';
                          seriesDescription = 'Red Line com 2 modelos';
                        } else if (item.id === 'esteira-pr6000') {
                          displayName = 'PR 6000 Series';
                          seriesDescription = 'Red Line com 2 modelos';
                        }
                      }

                      return (
                        <Link
                          key={item.id}
                          href={`/equipamentos/${item.id}` as any}
                          onClick={onClose}
                          className='group block'
                        >
                          <div className='flex items-center gap-3 p-2 rounded-lg transition-all duration-200 group-hover:bg-gray-100 hover:transform hover:scale-102'>
                            <div className='w-10 h-10 rounded-md overflow-hidden flex-shrink-0'>
                              <Image
                                src={translatedItem.images[0]}
                                alt={translatedItem.name}
                                width={40}
                                height={40}
                                className='object-cover w-full h-full transition-transform group-hover:scale-110'
                              />
                            </div>
                            <div className='flex-1 min-w-0'>
                              <p className='font-medium text-sm truncate text-gray-900'>
                                {capitalize(displayName)}
                              </p>
                              <p className='text-xs truncate text-gray-500'>{seriesDescription}</p>
                            </div>
                          </div>
                        </Link>
                      );
                    })}

                    <Link
                      href={`/equipamentos?search=${encodeURIComponent(mainCategories.find((cat) => cat.id === activeCategory)?.searchTerm || '')}`}
                      onClick={onClose}
                      className='inline-flex items-center text-gray-600 hover:text-[#0D0D0D] text-sm font-medium mt-2 transition-colors'
                    >
                      Ver Red Line →
                    </Link>
                  </div>
                </div>

                <div className='space-y-4'>
                  <div className='border-b border-gray-200 pb-2'>
                    <h4 className='text-gray-900 font-semibold text-base'>Blue Line</h4>
                    <p className='text-gray-500 text-xs'>Blue Line</p>
                  </div>

                  <div className='space-y-2'>
                    {getEquipmentsForActiveCategory('blue').map((item) => {
                      const translatedItem = translateEquipment(item);

                      // Nomes das séries Blue Line como na página de categorias
                      let displayName = translatedItem.name;
                      let seriesDescription = translatedItem.brand;

                      if (activeCategory === 'esteiras') {
                        if (item.id === 'power-race-7000') {
                          displayName = 'PR7000 Series';
                          seriesDescription = 'Blue Line com tecnologia avançada';
                        }
                      }

                      return (
                        <Link
                          key={item.id}
                          href={`/equipamentos/${item.id}` as any}
                          onClick={onClose}
                          className='group block'
                        >
                          <div className='flex items-center gap-3 p-2 rounded-lg group-hover:bg-gray-100 transition-all duration-200 hover:transform hover:scale-102'>
                            <div className='w-10 h-10 rounded-md overflow-hidden flex-shrink-0'>
                              <Image
                                src={translatedItem.images[0]}
                                alt={translatedItem.name}
                                width={40}
                                height={40}
                                className='object-cover w-full h-full group-hover:scale-110 transition-transform'
                              />
                            </div>
                            <div className='flex-1 min-w-0'>
                              <p className='font-medium text-sm truncate text-gray-900'>
                                {capitalize(displayName)}
                              </p>
                              <p className='text-xs truncate text-gray-500'>{seriesDescription}</p>
                            </div>
                          </div>
                        </Link>
                      );
                    })}

                    <Link
                      href={`/equipamentos?search=${encodeURIComponent(mainCategories.find((cat) => cat.id === activeCategory)?.searchTerm || '')}`}
                      onClick={onClose}
                      className='inline-flex items-center text-gray-600 hover:text-[#0D0D0D] text-sm font-medium mt-2 transition-colors'
                    >
                      Ver Blue Line →
                    </Link>
                  </div>
                </div>
              </>
            )}

            {/* Coluna 4 - Destaques Fixos */}
            <div className='space-y-4'>
              {activeCategory === 'musculacao' ? (
                // Para musculação, mostrar terceira subcategoria
                <div>
                  <div className='border-b border-gray-200 pb-2'>
                    <h4 className='text-gray-900 font-semibold text-base'>
                      {musculationSubcategories[2]?.name}
                    </h4>
                  </div>

                  <div className='space-y-2 mt-4'>
                    {getMusculationEquipmentsForSubcategory(musculationSubcategories[2]?.id)
                      .slice(0, 6)
                      .map((item) => {
                        const translatedItem = translateEquipment(item);
                        return (
                          <Link
                            key={item.id}
                            href={`/equipamentos/${item.id}` as any}
                            onClick={onClose}
                            className='group block'
                          >
                            <div className='flex items-center gap-3 p-2 rounded-lg group-hover:bg-gray-100 transition-all duration-200 hover:transform hover:scale-102'>
                              <div className='w-10 h-10 rounded-md overflow-hidden flex-shrink-0'>
                                <Image
                                  src={translatedItem.images[0]}
                                  alt={translatedItem.name}
                                  width={40}
                                  height={40}
                                  className='object-cover w-full h-full transition-transform group-hover:scale-110'
                                />
                              </div>
                              <div className='flex-1 min-w-0'>
                                <p className='font-medium text-sm truncate text-gray-900'>
                                  {capitalize(translatedItem.name)}
                                </p>
                                <p className='text-xs truncate text-gray-500'>
                                  {translatedItem.brand}
                                </p>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                  </div>
                </div>
              ) : (
                // Para outras categorias, mostrar destaques fixos
                <div>
                  <div className='border-b border-gray-200 pb-2'>
                    <h4 className='text-gray-900 font-semibold text-base'>Destaques</h4>
                    <p className='text-gray-500 text-xs'>Nossos produtos premium</p>
                  </div>

                  <div className='space-y-2 mt-4'>
                    {highlightEquipments.slice(0, 3).map((item) => {
                      const translatedHighlightItem = translateEquipment(item);
                      return (
                        <Link
                          key={item.id}
                          href={`/equipamentos/${item.id}` as any}
                          onClick={onClose}
                          className='group block'
                        >
                          <div className='flex items-center gap-3 p-2 rounded-lg border border-gray-200 hover:border-gray-300 group-hover:bg-gray-100 transition-all duration-200 hover:transform hover:scale-102'>
                            <div className='w-10 h-10 rounded-md overflow-hidden flex-shrink-0'>
                              <Image
                                src={translatedHighlightItem.images[0]}
                                alt={translatedHighlightItem.name}
                                width={40}
                                height={40}
                                className='object-cover w-full h-full transition-transform group-hover:scale-110'
                              />
                            </div>
                            <div className='flex-1 min-w-0'>
                              <p className='font-medium text-sm truncate text-gray-900'>
                                {capitalize(translatedHighlightItem.name)}
                              </p>
                              <p className='text-xs truncate text-gray-500'>
                                {translatedHighlightItem.brand}
                              </p>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
