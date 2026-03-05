'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { EquipmentFilterComponent } from '@/components/ui/equipment-filter';
import { getPDFsForEquipment } from '@/constants/pdf-links';
import { fetchEquipments } from '@/services/equipments';
import { Equipment, EquipmentCategory, EquipmentFilter } from '@/types';

interface SuporteClientProps {
  initialEquipments: Equipment[];
  initialCategories: EquipmentCategory[];
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

export function SuporteClient({
  initialEquipments,
  initialCategories,
  translations,
  locale,
}: SuporteClientProps) {
  const [filters, setFilters] = useState<EquipmentFilter>({
    categories: [],
    brands: [],
    priceRange: [0, 100000],
    search: '',
    target: undefined,
    inStock: undefined,
    featured: undefined,
  });

  const [equipments, setEquipments] = useState<Equipment[]>(initialEquipments);
  const [categories] = useState<EquipmentCategory[]>(initialCategories);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setIsLoading(true);
        const { data: eq } = await fetchEquipments({
          locale,
          search: filters.search,
          category: filters.categories[0],
          line: (filters.brands[0] as any) || undefined,
          target: filters.target || undefined,
          forSupport: true, // Mostrar TODAS as variantes na página de suporte
        });
        if (!isMounted) return;
        setEquipments(eq || []);
      } catch (error) {
        console.error('Erro ao carregar equipamentos:', error);
        if (isMounted) {
          setEquipments(initialEquipments);
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
    locale,
    filters.search,
    filters.categories,
    filters.brands,
    filters.target,
    initialEquipments,
  ]);

  const handleFiltersChange = (newFilters: EquipmentFilter) => {
    setFilters(newFilters);
  };

  return (
    <>
      {/* Filtros */}
      <section className='py-8 bg-gray-50 border-b border-gray-200'>
        <div className='container mx-auto px-4'>
          <EquipmentFilterComponent onFiltersChange={handleFiltersChange} categories={categories} />
        </div>
      </section>

      {/* Lista de Equipamentos */}
      <section className='py-12'>
        <div className='container mx-auto px-4'>
          {/* Header da lista */}
          <div className='flex items-center justify-between mb-8'>
            <h2 className='text-2xl font-bold text-black'>
              {translations.listTitle.replace('{count}', equipments.length.toString())}
            </h2>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {[...Array(8)].map((_, i) => (
                <div key={i} className='animate-pulse bg-gray-200 rounded-xl h-[350px]' />
              ))}
            </div>
          )}

          {/* Grid de Equipamentos */}
          {!isLoading && (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
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
                        d='M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 002 2v10a2 2 0 002 2zM9 9h6v6H9V9z'
                      />
                    </svg>
                  </div>
                  <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                    {translations.emptyTitle}
                  </h3>
                  <p className='text-gray-600'>{translations.emptySubtitle}</p>
                </div>
              ) : (
                equipments.map((equipment) => {
                  // const translatedEquipment = translateEquipment(equipment); // REMOVIDO TEMPORARIAMENTE
                  return (
                    <Link key={equipment.id} href={`/suporte/${equipment.id}` as any}>
                      <div className='h-[350px] flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group'>
                        {/* Imagem do equipamento */}
                        <div className='relative h-28 bg-white overflow-hidden flex-shrink-0'>
                          <div className='absolute inset-0 p-2'>
                            <img
                              src={equipment.images[0]}
                              alt={equipment.name}
                              className='w-full h-full object-contain group-hover:scale-105 transition-transform duration-300'
                            />
                          </div>
                          <div className='absolute inset-0 bg-black/5 group-hover:bg-black/2 transition-colors duration-300' />
                        </div>

                        {/* Conteúdo do card */}
                        <div className='p-3 flex flex-col flex-1'>
                          <h3 className='text-base font-bold text-black group-hover:text-gray-700 transition-colors line-clamp-1 mb-1'>
                            {equipment.name}
                          </h3>

                          <p className='text-gray-600 text-xs mb-2 line-clamp-2'>
                            {equipment.shortDescription}
                          </p>

                          <div className='flex items-center justify-between text-xs text-gray-400 mb-2'>
                            <span className='font-medium'>{equipment.brand}</span>
                            <span>{equipment.model}</span>
                          </div>

                          {/* Materiais disponíveis */}
                          <div className='mt-auto flex flex-wrap gap-1'>
                            {(() => {
                              const pdfs = getPDFsForEquipment(equipment.id);
                              const downloadCount = (pdfs?.manual ? 1 : 0) + (pdfs?.ficha ? 1 : 0);
                              return (
                                downloadCount > 0 && (
                                  <span className='inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-blue-100 text-blue-700'>
                                    📄{downloadCount}
                                  </span>
                                )
                              );
                            })()}
                            {equipment.videos && equipment.videos.length > 0 && (
                              <span className='inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-red-100 text-red-700'>
                                🎥{equipment.videos.length}
                              </span>
                            )}
                            <span className='inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-green-100 text-green-700'>
                              📊
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
