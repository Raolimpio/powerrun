'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui';
import { useEquipmentTranslations } from '@/hooks/useEquipmentTranslations';
import { printTechnicalSheet } from '@/lib/pdf-generator';
import { Equipment } from '@/types';

interface ProductInfoProps {
  equipment: Equipment;
  productLine: 'red' | 'blue' | 'musculacao';
  colors: {
    text: string;
    solid: string;
    hover: string;
  };
  onShowSpecs: () => void;
}

export function ProductInfo({ equipment, colors, onShowSpecs }: ProductInfoProps) {
  const t = useTranslations('product');
  const { translateEquipment } = useEquipmentTranslations();
  const translatedEquipment = translateEquipment(equipment);

  // USAR SISTEMA UNIFICADO DE PDF
  const generateTechnicalSheet = () => {
    printTechnicalSheet(equipment);
  };

  return (
    <div className='space-y-12'>
      {/* Recursos Principais */}
      <section className='space-y-6'>
        <h2 className='text-2xl font-bold text-black'>{t('featuresTitle')}</h2>
        <div className='space-y-3'>
          {translatedEquipment.features.slice(0, 4).map((feature, index) => (
            <div
              key={`feature-${feature}-${index}`}
              className={`flex items-start gap-4 pb-4 border-b border-gray-100 last:border-b-0 ${colors.hover} transition-colors duration-200 rounded-lg px-2 py-1`}
            >
              <div
                className='w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 shadow-sm'
                style={{ backgroundColor: colors.solid }}
              ></div>
              <span className='text-gray-700 text-lg leading-relaxed'>{feature}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Ações */}
      <section className='space-y-4'>
        <Button
          onClick={onShowSpecs}
          className='w-full py-4 text-lg font-medium transition-all duration-200 bg-black text-white hover:bg-gray-800'
        >
          {t('specsCta')}
        </Button>

        {/* NOVO BOTÃO: GERAR FICHA TÉCNICA */}
        <Button
          onClick={generateTechnicalSheet}
          className='w-full py-4 text-lg font-medium transition-all duration-200 bg-gray-800 text-white hover:bg-gray-900 flex items-center justify-center gap-3'
        >
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
            />
          </svg>
          Gerar Ficha Técnica
        </Button>
      </section>
    </div>
  );
}
