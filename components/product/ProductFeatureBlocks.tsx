'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useEquipmentTranslations } from '@/hooks/useEquipmentTranslations';
import { Equipment } from '@/types';

interface ProductFeatureBlocksProps {
  equipment: Equipment;
}

export function ProductFeatureBlocks({ equipment }: ProductFeatureBlocksProps) {
  const tCommon = useTranslations('common');
  const { translateEquipment } = useEquipmentTranslations();
  const translatedEquipment = translateEquipment(equipment);

  // Função para obter imagem específica por produto
  const getProductFeatureImage = () => {
    // Específico para Esteira TS Blue Line
    if (equipment.id === 'power-race-7000-ts') {
      return 'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756345486/Design_sem_nome_-_2025-08-27T224437.738_zblxzt.png';
    }

    // Para todos os outros produtos, usar a última imagem do equipamento
    return equipment.images[equipment.images.length - 1] || equipment.images[0];
  };

  return (
    <div className='container mx-auto px-4 mb-20'>
      {/* Primeiro Bloco - Imagem Esquerda, Texto Direita */}
      <div className='relative bg-neutral-900 mb-20 overflow-hidden rounded-2xl'>
        {/* Glassmorphism background pattern */}
        <div className='absolute inset-0 bg-gradient-to-br from-neutral-800/50 via-neutral-900 to-neutral-800/30'></div>
        <div className='absolute inset-0 backdrop-blur-sm'></div>

        <div className='relative'>
          <div className='grid grid-cols-1 lg:grid-cols-2'>
            {/* Imagem */}
            <div className='relative h-96 lg:h-[600px]'>
              <Image
                src={getProductFeatureImage()}
                alt={`${translatedEquipment.name} - Tecnologia de Ponta`}
                fill
                className='object-cover rounded-l-2xl'
              />
            </div>

            {/* Conteúdo */}
            <div className='flex items-center p-12 lg:p-16'>
              <div className='text-white'>
                <h2 className='text-4xl font-bold mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'>
                  {tCommon('tecnologiaPonta')}
                </h2>
                <p className='text-xl text-white/90 leading-relaxed mb-8'>
                  {tCommon('estruturaRobusta')}
                </p>
                <div className='space-y-4'>
                  {translatedEquipment.features.slice(3, 6).map((feature, index) => (
                    <div
                      key={`feature-advanced-${feature}-${index}`}
                      className='flex items-center space-x-3'
                    >
                      <div className='w-2 h-2 bg-white rounded-full shadow-lg shadow-white/20'></div>
                      <span className='text-white/90'>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
