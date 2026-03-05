'use client';

import { useEffect, useState } from 'react';
import { fetchEquipments } from '@/services/equipments';
import { Equipment, EquipmentCategory, EquipmentFilter } from '@/types';

interface SuporteClientMinimalProps {
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

export function SuporteClientMinimal({
  initialEquipments,
  initialCategories: _initialCategories,
  translations,
  locale,
}: SuporteClientMinimalProps) {
  const [filters] = useState<EquipmentFilter>({
    categories: [],
    brands: [],
    priceRange: [0, 100000],
    search: '',
    target: undefined,
    inStock: undefined,
    featured: undefined,
  });

  const [, setEquipments] = useState<Equipment[]>(initialEquipments);
  const [, setIsLoading] = useState(false);

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

  // Removed unused handleFiltersChange function

  return (
    <section className='py-12'>
      <div className='container mx-auto px-4'>
        <h2 className='text-2xl font-bold text-black mb-8'>
          {translations.listTitle.replace('{count}', initialEquipments.length.toString())}
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {initialEquipments.length === 0 ? (
            <div className='col-span-full text-center py-12'>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                {translations.emptyTitle}
              </h3>
              <p className='text-gray-600'>{translations.emptySubtitle}</p>
            </div>
          ) : (
            initialEquipments.slice(0, 4).map((equipment) => (
              <div key={equipment.id} className='bg-white border border-gray-200 rounded-xl p-6'>
                <h3 className='text-lg font-bold text-black mb-2'>{equipment.name}</h3>
                <p className='text-gray-600 text-sm'>{equipment.shortDescription}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
