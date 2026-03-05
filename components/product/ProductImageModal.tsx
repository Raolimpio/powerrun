'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { Equipment } from '@/types';

interface ProductImageModalProps {
  equipment: Equipment;
  isOpen: boolean;
  onClose: () => void;
  initialIndex: number;
}

export function ProductImageModal({
  equipment,
  isOpen,
  onClose,
  initialIndex,
}: ProductImageModalProps) {
  const tCommon = useTranslations('common');
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % equipment.images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + equipment.images.length) % equipment.images.length);
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-[60] flex items-center justify-center'>
      {/* Backdrop ultra-blur */}
      <div
        className='absolute inset-0 bg-black/95 backdrop-blur-xl transition-opacity duration-500'
        onClick={onClose}
      />

      {/* Container do Modal */}
      <div className='relative z-10 w-full h-full flex items-center justify-center p-4'>
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className='absolute top-6 right-6 z-20 w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-black/80 transition-colors duration-200'
        >
          <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
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
          {equipment.images.length > 1 && (
            <button
              onClick={prevImage}
              className='absolute left-4 z-20 w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-black/80 transition-colors duration-200'
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
          {equipment.images.length > 1 && (
            <button
              onClick={nextImage}
              className='absolute right-4 z-20 w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-black/80 transition-colors duration-200'
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
              src={equipment.images[currentIndex]}
              alt={`${equipment.name} - ${tCommon('imagem')} ${currentIndex + 1}`}
              fill
              className='object-contain bg-black/50'
              priority
            />
          </div>
        </div>

        {/* Info da Imagem */}
        <div className='absolute top-6 left-6 z-20'>
          <div className='bg-black/60 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20'>
            <h3 className='text-white font-semibold text-lg'>{equipment.name}</h3>
            <p className='text-white/70 text-sm'>
              {tCommon('imagem')} {currentIndex + 1}/{equipment.images.length}
            </p>
          </div>
        </div>

        {/* Thumbnails Navigation */}
        {equipment.images.length > 1 && (
          <div className='absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6'>
            <div className='bg-black/40 backdrop-blur-lg rounded-2xl p-4 border border-white/10'>
              <div className='flex gap-3 overflow-x-auto pb-2 scrollbar-hide'>
                {equipment.images.map((image, index) => (
                  <button
                    key={`thumb-${index}-${image.slice(-20)}`}
                    onClick={() => setCurrentIndex(index)}
                    className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                      currentIndex === index
                        ? 'ring-3 ring-white scale-110 shadow-xl'
                        : 'opacity-60 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${tCommon('imagem')} ${index + 1}`}
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
          <div className='bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20'>
            <span className='text-white/80 text-sm'>Deslize para navegar</span>
          </div>
        </div>
      </div>
    </div>
  );
}
