'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { EquipmentCard } from '@/components/ui';
import type { Equipment } from '@/types';

interface LineEquipmentCarouselProps {
  title: string;
  subtitle?: string;
  equipments: Equipment[];
  id?: string;
}

export function LineEquipmentCarousel({
  title,
  subtitle,
  equipments,
  id,
}: LineEquipmentCarouselProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;

    const cardWidth = container.offsetWidth * 0.7;
    const delta = direction === 'left' ? -cardWidth : cardWidth;
    container.scrollBy({ left: delta, behavior: 'smooth' });
  };

  // Scroll automático suave entre os cards (sem depender do scroll do usuário)
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    if (equipments.length <= 1) return;

    const interval = setInterval(() => {
      const c = scrollRef.current;
      if (!c) return;

      const cardWidth = c.offsetWidth * 0.7;
      const maxScrollLeft = c.scrollWidth - c.clientWidth;

      // Se chegou perto do final, volta para o início
      if (c.scrollLeft + cardWidth >= maxScrollLeft - 8) {
        c.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        c.scrollBy({ left: cardWidth, behavior: 'smooth' });
      }
    }, 6000); // a cada 6s

    return () => clearInterval(interval);
  }, [equipments.length]);

  if (!equipments.length) return null;

  return (
    <section id={id} className='pt-10 pb-4'>
      <div className='mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900 mb-1'>{title}</h2>
          {subtitle && <p className='text-gray-600 text-sm md:text-base max-w-2xl'>{subtitle}</p>}
        </div>
      </div>

      <div className='relative'>
        {/* Botões de navegação do carrossel (desktop) */}
        <button
          type='button'
          onClick={() => scroll('left')}
          className='hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg border border-gray-200 text-gray-700 hover:bg-gray-50'
          aria-label='Ver equipamentos anteriores'
        >
          <ChevronLeft className='w-5 h-5' />
        </button>
        <button
          type='button'
          onClick={() => scroll('right')}
          className='hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg border border-gray-200 text-gray-700 hover:bg-gray-50'
          aria-label='Ver próximos equipamentos'
        >
          <ChevronRight className='w-5 h-5' />
        </button>

        <div
          ref={scrollRef}
          className='flex gap-6 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth scrollbar-hide'
        >
          {equipments.map((equipment) => (
            <div
              key={equipment.id}
              className='snap-start min-w-[260px] sm:min-w-[320px] md:min-w-[340px] max-w-[360px]'
            >
              <EquipmentCard equipment={equipment} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
