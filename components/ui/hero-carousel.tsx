'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from './button';
import { CloudinaryImage } from '@/components/performance/CloudinaryImage';
import { APP_CONFIG } from '@/constants';

interface CarouselSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  cta: {
    primary: string;
    secondary: string;
  };
  equipmentUrl: string;
  stats: {
    stat1: { value: string; label: string };
    stat2: { value: string; label: string };
    stat3: { value: string; label: string };
  };
}

export function HeroCarousel() {
  const t = useTranslations('home.hero');
  const locale = useLocale();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slides do carrossel com os banners dos equipamentos Blue Line - usando traduções dinamicamente
  const slides: CarouselSlide[] = useMemo(() => {
    const slideIds = ['power-race-7000-ts', 'power-rise-650', 'power-round-550'];
    // Banners específicos das pastas "Banner" de cada equipamento Blue Line
    const images = [
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756335223/Design_sem_nome_-_2025-08-27T195336.831_cxy6pq.png', // Power Race 7000 TS - Banner
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756361586/Design_sem_nome_-_2025-08-28T030918.969_qsyx9k.png', // Power Rise 650 - Banner
      'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756361554/Design_sem_nome_-_2025-08-28T030909.601_glp1nb.png', // Power Round 550 - Banner
    ];

    return slideIds.map((id, index) => {
      const slideKey = `slides.${id}`;
      return {
        id,
        title: t(`${slideKey}.title`),
        subtitle: t(`${slideKey}.subtitle`),
        description: t(`${slideKey}.description`),
        image: images[index],
        cta: {
          primary: t(`${slideKey}.ctaPrimary`),
          secondary: t(`${slideKey}.ctaSecondary`),
        },
        equipmentUrl: `/${locale}/equipamentos/${id}`,
        stats: {
          stat1: {
            value: t(`${slideKey}.stats.stat1.value`),
            label: t(`${slideKey}.stats.stat1.label`),
          },
          stat2: {
            value: t(`${slideKey}.stats.stat2.value`),
            label: t(`${slideKey}.stats.stat2.label`),
          },
          stat3: {
            value: t(`${slideKey}.stats.stat3.value`),
            label: t(`${slideKey}.stats.stat3.label`),
          },
        },
      };
    });
  }, [t, locale]);

  // Auto-play do carrossel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // Troca a cada 6 segundos

    return () => clearInterval(interval);
  }, [slides.length]);


  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <section
      className='relative min-h-[95vh] sm:min-h-[90vh] lg:min-h-[85vh] overflow-hidden bg-black shadow-2xl'
      aria-label='Hero Carousel Section'
    >
      {/* Background Images com transição suave */}
      <div className='absolute inset-0 w-full h-full'>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <CloudinaryImage
              src={slide.image}
              alt={slide.title}
              fill
              className='object-cover min-h-full min-w-full'
              style={{
                objectPosition: '50% 30%',
                transform: 'scale(1.05)',
              }}
              priority={index === 0}
              fetchPriority={index === 0 ? 'high' : 'auto'}
              quality={85}
              sizes='100vw'
            />
          </div>
        ))}
      </div>

      {/* Overlay Gradiente Elegante com Blue Line */}
      <div className='absolute inset-0 bg-gradient-to-r from-black via-black/95 via-black/70 to-transparent'>
        <div className='absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40' />
        {/* Destaque Blue Line */}
        <div className='absolute inset-0 bg-gradient-to-r from-[#61fbfe]/5 via-transparent to-transparent' />
      </div>

      {/* Controles de Navegação - Desktop (laterais) com Blue Line */}
      <div className='hidden sm:block absolute top-1/2 left-4 transform -translate-y-1/2 z-20'>
        <button
          onClick={prevSlide}
          className='bg-white/10 hover:bg-[#61fbfe]/20 backdrop-blur-sm text-white hover:text-[#61fbfe] p-3 rounded-full transition-all duration-300 hover:scale-110 border border-transparent hover:border-[#61fbfe]/30'
          aria-label='Previous slide'
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
      </div>

      <div className='hidden sm:block absolute top-1/2 right-4 transform -translate-y-1/2 z-20'>
        <button
          onClick={nextSlide}
          className='bg-white/10 hover:bg-[#61fbfe]/20 backdrop-blur-sm text-white hover:text-[#61fbfe] p-3 rounded-full transition-all duration-300 hover:scale-110 border border-transparent hover:border-[#61fbfe]/30'
          aria-label='Next slide'
        >
          <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
          </svg>
        </button>
      </div>

      {/* Controles Mobile + Indicadores */}
      <div className='absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20'>
        <div className='flex items-center justify-center space-x-4'>
          {/* Seta esquerda - apenas mobile */}
          <button
            onClick={prevSlide}
            className='sm:hidden bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110'
            aria-label='Previous slide'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
          </button>

          {/* Indicadores - Tamanho reduzido com Blue Line */}
          <div className='flex space-x-2 sm:space-x-3'>
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`min-w-[32px] min-h-[32px] w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 flex items-center justify-center ${
                  index === currentSlide
                    ? 'bg-[#61fbfe] scale-110 shadow-lg shadow-[#61fbfe]/50'
                    : 'bg-white/30 hover:bg-[#61fbfe]/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Seta direita - apenas mobile */}
          <button
            onClick={nextSlide}
            className='sm:hidden bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110'
            aria-label='Next slide'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
            </svg>
          </button>
        </div>
      </div>

      {/* Conteúdo Premium */}
      <div className='relative z-10 min-h-[95vh] sm:min-h-[90vh] lg:min-h-[85vh] flex items-center pt-20 sm:pt-24 pb-8'>
        <div className='container mx-auto px-4 sm:px-6'>
          <div className='max-w-4xl space-y-4 sm:space-y-6 lg:space-y-8'>
            {/* Título Principal com transição */}
            <div className='space-y-3 lg:space-y-4'>
              <div key={`title-${currentSlide}`} className='animate-fade-in'>
                {/* Badge Blue Line */}
                <div className='mb-3 inline-flex items-center px-4 py-1.5 rounded-full bg-[#61fbfe]/10 border border-[#61fbfe]/30 backdrop-blur-sm'>
                  <span className='text-[#61fbfe] font-bold text-sm sm:text-base tracking-wide'>
                    BLUE LINE PREMIUM
                  </span>
                </div>
                {/* Título: Equipamento (nome) Profissional */}
                <div
                  className='text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-2 sm:mb-3'
                  style={{ fontSize: 'clamp(2rem, 8vw, 8rem)' }}
                >
                  <span
                    className='text-white font-black tracking-wide uppercase block'
                    style={{ fontFamily: 'Anton, Impact, Arial Black, sans-serif' }}
                  >
                    {currentSlideData.title}
                  </span>
                </div>
                {/* Código do equipamento */}
                <div
                  className='text-lg sm:text-2xl lg:text-3xl font-light text-white/90 tracking-wide leading-relaxed'
                  style={{ fontSize: 'clamp(1.125rem, 4vw, 3rem)' }}
                >
                  {currentSlideData.subtitle}
                </div>
              </div>
            </div>

            {/* Descrição do Produto */}
            <p
              key={`desc-${currentSlide}`}
              className='text-base sm:text-lg lg:text-xl text-white/80 font-light leading-relaxed max-w-2xl animate-fade-in'
            >
              {currentSlideData.description}
            </p>

            {/* Estatísticas Específicas do Equipamento */}
            <div
              key={`stats-${currentSlide}`}
              className='flex items-center justify-start space-x-3 sm:space-x-8 py-3 sm:py-4 animate-fade-in'
            >
              <div className='text-center'>
                <div className='text-lg sm:text-2xl lg:text-3xl font-bold text-white'>
                  {currentSlideData.stats.stat1.value}
                </div>
                <div className='text-xs sm:text-sm text-white/60 font-medium'>
                  {currentSlideData.stats.stat1.label}
                </div>
              </div>
              <div className='w-px h-6 sm:h-8 lg:h-12 bg-white/20'></div>
              <div className='text-center'>
                <div className='text-lg sm:text-2xl lg:text-3xl font-bold text-white'>
                  {currentSlideData.stats.stat2.value}
                </div>
                <div className='text-xs sm:text-sm text-white/60 font-medium'>
                  {currentSlideData.stats.stat2.label}
                </div>
              </div>
              <div className='w-px h-6 sm:h-8 lg:h-12 bg-white/20'></div>
              <div className='text-center'>
                <div className='text-lg sm:text-2xl lg:text-3xl font-bold text-white'>
                  {currentSlideData.stats.stat3.value}
                </div>
                <div className='text-xs sm:text-sm text-white/60 font-medium'>
                  {currentSlideData.stats.stat3.label}
                </div>
              </div>
            </div>

            {/* Call to Actions Premium com transição */}
            <div
              key={`cta-${currentSlide}`}
              className='flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 animate-fade-in'
            >
              <Link href={currentSlideData.equipmentUrl as any} className='w-full sm:w-auto'>
                <Button
                  size='lg'
                  className='w-full px-5 sm:px-6 lg:px-8 py-3 lg:py-4 text-sm sm:text-base lg:text-lg font-semibold bg-gradient-to-r from-white to-gray-100 text-black hover:from-gray-100 hover:to-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl'
                >
                  {currentSlideData.cta.primary}
                </Button>
              </Link>
              <a
                href={`https://wa.me/55${APP_CONFIG.contact.comercial.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Solicitar orçamento ${currentSlideData.title}`)}`}
                target='_blank'
                rel='noopener noreferrer'
                className='w-full sm:w-auto'
              >
                <Button
                  size='lg'
                  className='w-full px-5 sm:px-6 lg:px-8 py-3 lg:py-4 text-sm sm:text-base lg:text-lg font-semibold quote-button text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl'
                  style={{ backgroundColor: 'rgba(34, 197, 94, 0.8)' }}
                >
                  {currentSlideData.cta.secondary}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Efeitos de Brilho Blue Line */}
      <div className='absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-30 animate-pulse'></div>
      <div className='absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-transparent via-[#61fbfe]/5 to-transparent opacity-20 animate-pulse'></div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
