'use client';

import { useState } from 'react';
import { Equipment } from '@/types';

interface ProductVariant {
  id: string;
  name: string;
  displayName: string;
  image: string;
  isActive?: boolean;
}

interface ProductVariantSelectorProps {
  currentEquipment: Equipment;
  onVariantChange: (variantId: string) => void;
}

// Configuração das variantes de todas as séries
const PRODUCT_SERIES_VARIANTS: Record<string, ProductVariant[]> = {
  // PR4000 Series
  pr4000: [
    {
      id: 'esteira-pr4000-18',
      name: 'PR4000 1.8',
      displayName: 'PR4000 1.8',
      image: 'https://res.cloudinary.com/dq0bovaz5/image/upload/v1755203712/3_atupd0.png',
    },
    {
      id: 'esteira-pr4000-30',
      name: 'PR4000 3.0',
      displayName: 'PR4000 3.0',
      image: 'https://res.cloudinary.com/dq0bovaz5/image/upload/v1755203712/4_bmnoav.png',
    },
  ],
  // PR5000 Series
  pr5000: [
    {
      id: 'esteira-pr5000',
      name: 'PR5000',
      displayName: 'PR5000',
      image: 'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756297828/5_ufc7nz.png',
    },
    {
      id: 'esteira-pr5000i',
      name: 'PR5000i',
      displayName: 'PR5000i',
      image: 'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756297849/6_vws1yt.png',
    },
  ],
  // PR6000 Series
  pr6000: [
    {
      id: 'esteira-pr6000',
      name: 'PR6000',
      displayName: 'PR6000',
      image: 'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756297860/7_y7xxhe.png',
    },
    {
      id: 'esteira-pr6000i',
      name: 'PR6000i',
      displayName: 'PR6000i',
      image: 'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756297869/8_csee85.png',
    },
  ],
  // PR7000 Series (Power Race)
  pr7000: [
    {
      id: 'power-race-7000',
      name: 'PR7000 LED',
      displayName: 'PR7000 LED',
      image: 'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756300607/6_ktdeb7.png',
    },
    {
      id: 'power-race-7000-ts',
      name: 'PR7000 TS',
      displayName: 'PR7000 TS',
      image: 'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756300595/21_zs48vf.png',
    },
  ],
};

export function ProductVariantSelector({
  currentEquipment,
  onVariantChange,
}: ProductVariantSelectorProps) {
  const [selectedVariant, setSelectedVariant] = useState(currentEquipment.id);

  // Detectar qual série é baseada no ID do produto
  const getProductSeries = (equipmentId: string): string | null => {
    for (const [series, variants] of Object.entries(PRODUCT_SERIES_VARIANTS)) {
      if (variants.some((variant) => variant.id === equipmentId)) {
        return series;
      }
    }
    return null;
  };

  const currentSeries = getProductSeries(currentEquipment.id);

  if (!currentSeries) {
    return null;
  }

  const variants = PRODUCT_SERIES_VARIANTS[currentSeries];

  const handleVariantSelect = (variantId: string) => {
    if (variantId !== selectedVariant) {
      setSelectedVariant(variantId);
      onVariantChange(variantId);
    }
  };

  return (
    <div className='flex justify-start gap-4 my-6 no-border'>
      {variants.map((variant) => {
        const isSelected = variant.id === selectedVariant;

        return (
          <button
            key={variant.id}
            onClick={() => handleVariantSelect(variant.id)}
            className={`
              flex flex-col items-center gap-2 p-2 rounded-lg transition-all duration-200 btn-exception no-border
              ${isSelected ? 'opacity-100' : 'opacity-70 hover:opacity-90'}
            `}
          >
            {/* Imagem da esteira - maior com mais padding */}
            <div
              className={`
              relative w-20 h-16 rounded-md overflow-hidden bg-white flex items-center justify-center no-border
              ${isSelected ? 'ring-2 ring-red-500' : 'ring-1 ring-white/50'}
            `}
            >
              <img
                src={variant.image}
                alt={variant.name}
                className='max-w-full max-h-full object-contain p-1'
              />
            </div>

            {/* Nome da variante */}
            <span
              className={`
              text-xs font-medium transition-colors duration-200 text-center
              ${isSelected ? 'text-white' : 'text-white/80'}
            `}
            >
              {variant.displayName}
            </span>
          </button>
        );
      })}
    </div>
  );
}
