'use client';

import { Search, Package, Zap, Dumbbell } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Product {
  name: string;
  commercialDescription: string;
  commercialDescriptionEN?: string;
  commercialDescriptionES?: string;
  commercialDescriptionZH?: string;
  category: string;
}

interface ProductSelectorProps {
  products: Record<string, Product>;
  selectedProductId: string | null;
  onProductSelect: (productId: string) => void;
}

export function ProductSelector({
  products,
  selectedProductId,
  onProductSelect,
}: ProductSelectorProps) {
  const t = useTranslations('documentacao-tecnica');
  const locale = useLocale();
  const [searchQuery, setSearchQuery] = useState('');

  // Função para obter a descrição no idioma correto
  const getLocalizedDescription = (product: Product) => {
    switch (locale) {
      case 'en':
        return product.commercialDescriptionEN || product.commercialDescription;
      case 'es':
        return product.commercialDescriptionES || product.commercialDescription;
      case 'zh-CN':
        return product.commercialDescriptionZH || product.commercialDescription;
      default:
        return product.commercialDescription;
    }
  };

  // Função para obter ícone da categoria
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'musculacao':
        return <Dumbbell className='h-4 w-4' />;
      case 'esteira':
      case 'spinning':
      case 'eliptico':
      case 'escada':
      case 'bike':
        return <Zap className='h-4 w-4' />;
      default:
        return <Package className='h-4 w-4' />;
    }
  };

  // Filtrar produtos baseado na busca
  const filteredProducts = Object.entries(products).filter(([_id, product]) => {
    const searchLower = searchQuery.toLowerCase();
    const nameMatch = product.name.toLowerCase().includes(searchLower);
    const descriptionMatch = getLocalizedDescription(product).toLowerCase().includes(searchLower);
    const categoryMatch = product.category.toLowerCase().includes(searchLower);

    return nameMatch || descriptionMatch || categoryMatch;
  });

  // Agrupar produtos por categoria
  const groupedProducts = filteredProducts.reduce(
    (acc, [id, product]) => {
      const category = product.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push([id, product]);
      return acc;
    },
    {} as Record<string, Array<[string, Product]>>
  );

  return (
    <div className='space-y-4'>
      {/* Search Input */}
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4' />
        <Input
          placeholder={t('selection.search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500/20'
        />
      </div>

      {/* Products List */}
      <ScrollArea className='h-96'>
        <div className='space-y-4'>
          {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
            <div key={category} className='space-y-2'>
              <div className='flex items-center gap-2 px-2'>
                {getCategoryIcon(category)}
                <h4 className='font-medium text-slate-700 capitalize'>
                  {t(`categories.${category}`, { fallback: category })}
                </h4>
                <Badge variant='outline' className='text-xs'>
                  {categoryProducts.length}
                </Badge>
              </div>

              <div className='space-y-1'>
                {categoryProducts.map(([id, product]) => (
                  <button
                    key={id}
                    onClick={() => onProductSelect(id)}
                    className={`
                      w-full text-left p-3 border transition-all duration-200
                      ${
                        selectedProductId === id
                          ? 'border-black bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className='flex items-start justify-between gap-2 mb-2'>
                      <h5 className='font-medium text-sm text-black leading-tight'>
                        {product.name}
                      </h5>
                      <Badge
                        variant='outline'
                        className='bg-gray-100 text-gray-700 border-gray-300 text-xs flex-shrink-0'
                      >
                        {getCategoryIcon(category)}
                        <span className='ml-1'>
                          {t(`categories.${category}`, { fallback: category })}
                        </span>
                      </Badge>
                    </div>
                    <p className='text-xs text-gray-600 line-clamp-2'>
                      {getLocalizedDescription(product)}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className='text-center py-8'>
            <Search className='h-12 w-12 text-slate-300 mx-auto mb-3' />
            <p className='text-slate-500 text-sm'>{t('selection.noResults')}</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
