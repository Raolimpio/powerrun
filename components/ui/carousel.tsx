'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from './button';
import { CloudinaryImage } from '../performance/CloudinaryImage';

interface CarouselItem {
  id: number;
  name: string;
  description: string;
  image: string;
  url?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  // eslint-disable-next-line no-unused-vars
  onCardClick?: (url: string) => void;
}

export function Carousel({ items, onCardClick }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [_imageErrors] = useState<{ [key: number]: boolean }>({});
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const [itemsPerView, setItemsPerView] = useState(3);
  const maxIndex = Math.max(0, items.length - itemsPerView);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1); // mobile: 1 item
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2); // tablet: 2 items
      } else {
        setItemsPerView(3); // desktop: 3 items
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const goToPrevious = () => {
    // console.log('Previous clicked, current:', currentIndex);
    const newIndex = Math.max(0, currentIndex - 1);
    setCurrentIndex(newIndex);
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth / itemsPerView;
      carouselRef.current.scrollTo({
        left: newIndex * cardWidth,
        behavior: 'smooth',
      });
    }
  };

  const goToNext = () => {
    // console.log('Next clicked, current:', currentIndex, 'max:', maxIndex);
    const newIndex = Math.min(maxIndex, currentIndex + 1);
    setCurrentIndex(newIndex);
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth / itemsPerView;
      carouselRef.current.scrollTo({
        left: newIndex * cardWidth,
        behavior: 'smooth',
      });
    }
  };

  // Removido handleImageError não utilizado

  // Drag & Swipe handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Só inicia drag se não for nos botões
    if ((e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeft(carouselRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (carouselRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    // Só inicia drag se não for nos botões
    if ((e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeft(carouselRef.current?.scrollLeft || 0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - (carouselRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Removido useEffect que estava conflitando com as setas

  // Sync scroll position with current index (simplificado)
  useEffect(() => {
    const handleScroll = () => {
      if (isDragging && carouselRef.current) {
        const cardWidth = carouselRef.current.offsetWidth / itemsPerView;
        const scrollPosition = carouselRef.current.scrollLeft;
        const newIndex = Math.round(scrollPosition / cardWidth);
        if (newIndex !== currentIndex && newIndex >= 0 && newIndex <= maxIndex) {
          setCurrentIndex(newIndex);
        }
      }
    };

    const element = carouselRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll, { passive: true });
      return () => element.removeEventListener('scroll', handleScroll);
    }

    // Retorno necessário para todos os caminhos
    return () => {};
  }, [currentIndex, maxIndex, itemsPerView, isDragging]);

  return (
    <div
      className='w-full'
      style={{
        backgroundColor: 'white',
        margin: 0,
        padding: 0,
      }}
    >
      {/* Layout com Setas Externas */}
      <div className='flex items-center justify-center gap-6 sm:gap-8 lg:gap-12'>
        {/* Seta Anterior - Externa */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            goToPrevious();
          }}
          disabled={currentIndex === 0}
          className='w-12 h-12 sm:w-14 sm:h-14 min-h-[44px] min-w-[44px] bg-white/90 hover:bg-white active:bg-white/80 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl rounded-full flex items-center justify-center text-gray-800 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-white/30 touch-manipulation btn-exception no-border'
          aria-label='Slide anterior'
        >
          <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15 19l-7-7 7-7'
            />
          </svg>
        </button>

        {/* Container dos Cards - Entre as Setas */}
        <div className='flex-1 relative overflow-hidden'>
          {/* Container dos Cards - 3 visíveis */}
          <div
            ref={carouselRef}
            className={`flex overflow-hidden select-none ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab scroll-smooth'
            }`}
            style={{
              scrollSnapType: 'x mandatory',
              backgroundColor: 'white',
              margin: 0,
              padding: 0,
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className='flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 px-4'
                style={{
                  scrollSnapAlign: 'start',
                  backgroundColor: 'white',
                  margin: 0,
                }}
              >
                {/* CARD MELHORADO UI */}
                <div
                  className='relative h-80 overflow-hidden rounded-3xl shadow-2xl group cursor-pointer transition-all duration-500 hover:shadow-3xl focus:outline-none focus:ring-4 focus:ring-white/20 transform-gpu hover:-translate-y-1 touch-manipulation'
                  tabIndex={0}
                  role='button'
                  aria-label={`Explorar ${item.name}`}
                  onClick={(e) => {
                    if (isDragging) {
                      e.preventDefault();
                      e.stopPropagation();
                      return;
                    }
                    if (item.url && onCardClick) {
                      e.preventDefault();
                      e.stopPropagation();
                      onCardClick(item.url);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (item.url && onCardClick) {
                        onCardClick(item.url);
                      }
                    }
                  }}
                >
                  {/* Imagem com Fallback */}
                  {!_imageErrors[item.id] ? (
                    <CloudinaryImage
                      src={item.image}
                      alt={item.name}
                      fill
                      className='object-cover group-hover:scale-105 transition-transform duration-700 ease-out'
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                      quality={85}
                    />
                  ) : (
                    // Fallback quando imagem não carrega
                    <div className='w-full h-full bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 flex items-center justify-center'>
                      <div className='text-center text-white'>
                        <div className='w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm'>
                          <svg
                            className='w-8 h-8'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                            />
                          </svg>
                        </div>
                        <p className='text-base font-medium opacity-75'>Equipamento Premium</p>
                      </div>
                    </div>
                  )}

                  {/* Overlay Gradiente Melhorado */}
                  <div className='absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 via-30% to-transparent group-hover:from-black/90 group-hover:via-black/45 transition-all duration-500' />

                  {/* Texto Dentro da Imagem - Design Melhorado */}
                  <div className='absolute bottom-0 left-0 right-0 p-6 transform transition-all duration-300 no-border carousel-card-text'>
                    <h3 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight group-hover:text-white transition-colors duration-300'>
                      {item.name}
                    </h3>
                    <p className='text-white text-lg sm:text-xl mb-4 leading-relaxed group-hover:opacity-100 transition-opacity duration-300'>
                      {item.description}
                    </p>
                    <Button
                      className='bg-white/15 hover:bg-white/25 active:bg-white/35 text-white border-white/20 backdrop-blur-md transition-all duration-300 rounded-lg px-5 py-3 sm:px-6 sm:py-3 text-sm font-medium shadow-lg group-hover:bg-white/30 min-h-[44px] flex items-center justify-center btn-exception'
                      variant='outline'
                      size='sm'
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (item.url && onCardClick) {
                          onCardClick(item.url);
                        }
                      }}
                    >
                      <span className='flex items-center gap-3'>
                        Explorar
                        <svg
                          className='w-4 h-4 transition-transform group-hover:translate-x-0.5 ml-1'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M17 8l4 4m0 0l-4 4m4-4H3'
                          />
                        </svg>
                      </span>
                    </Button>
                  </div>

                  {/* Borda sutil no hover */}
                  <div className='absolute inset-0 rounded-2xl border border-white/0 group-hover:border-white/10 transition-all duration-300 pointer-events-none'></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seta Próxima - Externa */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            goToNext();
          }}
          disabled={currentIndex >= maxIndex}
          className='w-12 h-12 sm:w-14 sm:h-14 min-h-[44px] min-w-[44px] bg-white/90 hover:bg-white active:bg-white/80 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl rounded-full flex items-center justify-center text-gray-800 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-white/30 touch-manipulation btn-exception no-border'
          aria-label='Próximo slide'
        >
          <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
          </svg>
        </button>
      </div>

      {/* Indicadores Melhorados */}
      <div className='flex justify-center mt-6 space-x-2'>
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            // eslint-disable-next-line react/no-array-index-key
            key={`indicator-page-${index}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCurrentIndex(index);
              if (carouselRef.current) {
                const cardWidth = carouselRef.current.offsetWidth / itemsPerView;
                carouselRef.current.scrollTo({
                  left: index * cardWidth,
                  behavior: 'smooth',
                });
              }
            }}
            className={`h-3 w-3 rounded-full transition-all duration-300 btn-exception no-border ${
              index === currentIndex ? 'bg-gray-800 scale-125' : 'bg-gray-400 hover:bg-gray-600'
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
