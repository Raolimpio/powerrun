'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { useEquipmentTranslations } from '@/hooks/useEquipmentTranslations';
import { Equipment } from '@/types';

interface ProductMasonryProps {
  equipment: Equipment;
}

export function ProductMasonry({ equipment }: ProductMasonryProps) {
  const tCommon = useTranslations('common');
  const { translateEquipment } = useEquipmentTranslations();
  const translatedEquipment = translateEquipment(equipment);

  // Estado para o modal específico dos features
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

  // Função para obter imagens e títulos específicos por produto
  const getProductFeatures = () => {
    // Específico para Esteira TS Blue Line
    if (equipment.id === 'power-race-7000-ts') {
      return {
        images: [
          'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756336977/Design_sem_nome_-_2025-08-27T200942.790_jcz5nj.png', // Tela touch HD
          'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756336975/Design_sem_nome_-_2025-08-27T201935.700_jyrnbh.png', // Simulação
          'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756336972/Design_sem_nome_-_2025-08-27T201808.092_lprwmh.png', // Carregador
          'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756336974/Design_sem_nome_-_2025-08-27T200912.613_xu5ema.png', // Motor
        ],
        titles: [
          'Tela touch HD de 23.8" com experiência interativa',
          'Interfaces de entretenimento e simulação de cena real',
          'Wi-Fi integrado e carregamento sem fio',
          'Motor de 4.5HP AC Peak Power',
        ],
      };
    }

    // Para todos os outros produtos, usar imagens do próprio equipamento
    let productImages;

    // Se tem galleryImages disponível, usar essas
    if (equipment.galleryImages && equipment.galleryImages.length > 0) {
      productImages = equipment.galleryImages.slice(0, 4);
    }
    // Específico para Equipamentos Red Line e alguns Blue Line - pula a primeira imagem (principal)
    else if (
      [
        'bicicleta-spinning-pr200',
        'esteira-pr5000',
        'esteira-pr5000i',
        'esteira-pr6000',
        'esteira-pr6000i',
        'bike-vertical-pr300',
        'bike-horizontal-pr400',
        'escada-pr600',
        'power-round-550',
        'power-rush-250',
      ].includes(equipment.id)
    ) {
      productImages = equipment.images.slice(1, 5); // Índices 1, 2, 3, 4 (pula o 0)
    } else {
      // Para os demais produtos, usar as 4 primeiras imagens
      productImages =
        equipment.images && equipment.images.length >= 4
          ? equipment.images.slice(0, 4)
          : [
              ...equipment.images,
              ...equipment.images,
              ...equipment.images,
              ...equipment.images,
            ].slice(0, 4);
    }

    return {
      images: productImages,
      titles: translatedEquipment.features
        .slice(0, 4)
        .map((feature) => feature || `${translatedEquipment.name} - Detalhe`),
    };
  };

  const { images: featureImages, titles: featureTitles } = getProductFeatures();

  // Lógica removida - equipamentos sem fotos não têm mais masonry

  const openFeatureModal = (index: number) => {
    setCurrentFeatureIndex(index);
    setShowFeatureModal(true);
  };

  const closeFeatureModal = () => {
    setShowFeatureModal(false);
  };

  const nextFeatureImage = () => {
    setCurrentFeatureIndex((prev) => (prev + 1) % featureImages.length);
  };

  const prevFeatureImage = () => {
    setCurrentFeatureIndex((prev) => (prev - 1 + featureImages.length) % featureImages.length);
  };

  // Keyboard navigation para o modal
  useEffect(() => {
    if (!showFeatureModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeFeatureModal();
      if (e.key === 'ArrowLeft') prevFeatureImage();
      if (e.key === 'ArrowRight') nextFeatureImage();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [showFeatureModal]);

  // Código removido - equipamentos sem masonry não chegam até aqui

  return (
    <>
      <div className='w-full mb-20'>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-2'>
          {(() => {
            const tilesCount = featureImages.length;
            return Array.from({ length: tilesCount }).map((_, i) => {
              const imageSrc = featureImages[i];
              const featureText = featureTitles[i];
              const displayDetail = i + 2; // mantém a numeração visual iniciando em 2
              return (
                <div
                  key={`masonry-tile-${i}-${imageSrc.slice(-15)}`}
                  className='relative group overflow-hidden rounded-2xl cursor-pointer'
                  onClick={() => openFeatureModal(i)}
                >
                  <div className='relative aspect-[4/5] lg:aspect-[3/4]'>
                    <Image
                      src={imageSrc}
                      alt={`${translatedEquipment.name} - ${tCommon('detalhe')} ${displayDetail}`}
                      fill
                      className='object-cover transition-transform duration-700 group-hover:scale-110'
                    />

                    {/* Overlay simples */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/70 to-transparent'></div>

                    {/* Texto sempre visível */}
                    <div className='absolute bottom-0 left-0 right-0 p-6'>
                      <div className='bg-black/70 rounded-lg p-4 border border-white/10 group-hover:bg-black/80 transition-colors duration-300'>
                        <h3 className='text-white text-xl lg:text-2xl font-bold mb-2 leading-tight'>
                          {featureText}
                        </h3>
                        <p className='text-white/80 text-sm font-medium'>
                          {tCommon('detalhe')} #{displayDetail}
                        </p>

                        {/* Pequeno indicador visual */}
                        <div className='w-8 h-0.5 bg-white/60 mt-3 rounded-full group-hover:w-12 transition-all duration-300'></div>
                      </div>
                    </div>

                    {/* Hover effect simples */}
                    <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
                      <div className='bg-white/30 rounded-full p-3 border border-white/50 transform scale-0 group-hover:scale-100 transition-transform duration-300'>
                        <svg
                          className='w-6 h-6 text-white'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7a3 3 0 100 6 3 3 0 000-6z'
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>

      {/* Modal específico para features */}
      {showFeatureModal && (
        <div className='fixed inset-0 z-[60] flex items-center justify-center'>
          {/* Backdrop simples */}
          <div
            className='absolute inset-0 bg-black/95 transition-opacity duration-300'
            onClick={closeFeatureModal}
          />

          {/* Container do Modal */}
          <div className='relative z-10 w-full h-full flex items-center justify-center p-4'>
            {/* Botão Fechar */}
            <button
              onClick={closeFeatureModal}
              className='absolute top-6 right-6 z-20 w-12 h-12 rounded-full bg-black/70 border border-white/30 flex items-center justify-center hover:bg-black/90 transition-colors duration-200'
            >
              <svg
                className='w-6 h-6 text-white'
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

            {/* Imagem Principal */}
            <div className='relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center'>
              {/* Navegação Lateral Esquerda */}
              {featureImages.length > 1 && (
                <button
                  onClick={prevFeatureImage}
                  className='absolute left-4 z-20 w-12 h-12 rounded-full bg-black/70 border border-white/30 flex items-center justify-center hover:bg-black/90 transition-colors duration-200'
                >
                  <svg
                    className='w-6 h-6 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15 19l-7-7 7-7'
                    />
                  </svg>
                </button>
              )}

              {/* Navegação Lateral Direita */}
              {featureImages.length > 1 && (
                <button
                  onClick={nextFeatureImage}
                  className='absolute right-4 z-20 w-12 h-12 rounded-full bg-black/70 border border-white/30 flex items-center justify-center hover:bg-black/90 transition-colors duration-200'
                >
                  <svg
                    className='w-6 h-6 text-white'
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
                </button>
              )}

              {/* Imagem */}
              <div className='relative w-full h-full max-w-5xl max-h-[80vh] rounded-2xl overflow-hidden shadow-2xl'>
                <Image
                  src={featureImages[currentFeatureIndex]}
                  alt={featureTitles[currentFeatureIndex]}
                  fill
                  className='object-contain bg-black/50'
                  priority
                />
              </div>
            </div>

            {/* Info da Imagem */}
            <div className='absolute top-6 left-6 z-20'>
              <div className='bg-black/80 rounded-2xl px-6 py-4 border border-white/30'>
                <h3 className='text-white font-semibold text-lg'>
                  {featureTitles[currentFeatureIndex]}
                </h3>
                <p className='text-white/70 text-sm'>
                  {tCommon('detalhe')} #{currentFeatureIndex + 2} - {currentFeatureIndex + 1}/
                  {featureImages.length}
                </p>
              </div>
            </div>

            {/* Thumbnails Navigation */}
            {featureImages.length > 1 && (
              <div className='absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6'>
                <div className='bg-black/70 rounded-2xl p-4 border border-white/20'>
                  <div className='flex gap-3 overflow-x-auto pb-2 scrollbar-hide'>
                    {featureImages.map((image, index) => (
                      <button
                        key={`feature-thumb-${index}`}
                        onClick={() => setCurrentFeatureIndex(index)}
                        className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                          currentFeatureIndex === index
                            ? 'ring-3 ring-white scale-110 shadow-xl'
                            : 'opacity-60 hover:opacity-100 hover:scale-105'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={featureTitles[index]}
                          fill
                          className='object-cover'
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Indicadores de swipe mobile */}
            <div className='absolute bottom-20 left-1/2 -translate-x-1/2 md:hidden'>
              <div className='bg-black/80 px-4 py-2 rounded-full border border-white/30'>
                <span className='text-white/80 text-sm'>Deslize para navegar</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
