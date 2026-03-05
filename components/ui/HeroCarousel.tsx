'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState, useEffect, useCallback } from 'react';
import { Button } from './button';
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
}

export function HeroCarousel() {
  const t = useTranslations('home.hero');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slides do carrossel com os banners dos equipamentos
  const slides: CarouselSlide[] = [
    {
      id: 'power-race-7000-ts',
      title: 'Esteira ergométrica profissional PR7000 TS',
      subtitle: 'Esteira Premium com Touch HD',
      description: 'Tecnologia avançada com tela touch de 23.8" e Wi-Fi integrado',
      image:
        'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756335223/Design_sem_nome_-_2025-08-27T195336.831_cxy6pq.png',
      cta: {
        primary: 'Ver Detalhes',
        secondary: 'Solicitar Orçamento',
      },
      equipmentUrl: '/pt-BR/equipamentos/power-race-7000-ts',
    },
    {
      id: 'escada-pr600',
      title: 'Simulador de escada profissional PR600',
      subtitle: 'Red Line - Cardio Intenso',
      description: 'Treino cardiovascular completo com 15 graus de inclinação',
      image: 'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756366275/9_itrub3.png',
      cta: {
        primary: 'Ver Detalhes',
        secondary: 'Solicitar Orçamento',
      },
      equipmentUrl: '/pt-BR/equipamentos/escada-pr600',
    },
    {
      id: 'multi-gym-pr012',
      title: 'Multigym PR012',
      subtitle: 'Equipamento Multifuncional',
      description: 'Treino completo para até 3 usuários simultaneamente',
      image: 'https://res.cloudinary.com/dq0bovaz5/image/upload/v1755203716/13_kvflks.png',
      cta: {
        primary: 'Ver Detalhes',
        secondary: 'Solicitar Orçamento',
      },
      equipmentUrl: '/pt-BR/equipamentos/multi-gym-pr012',
    },
  ];

  // Auto-play do carrossel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // Troca a cada 6 segundos

    return () => clearInterval(interval);
  }, [slides.length]);

  const scrollToEquipamentos = useCallback(() => {
    console.log('🔄 Tentando fazer scroll para equipamentos...');

    const scrollToSection = () => {
      const element = document.getElementById('equipamentos-destaque');
      console.log('📍 Elemento encontrado:', element);

      if (element) {
        console.log('✅ Fazendo scroll para o elemento');
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      } else {
        console.log('❌ Elemento não encontrado!');
      }
    };

    scrollToSection();
    setTimeout(scrollToSection, 100);
  }, []);

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
      className='relative min-h-[80vh] lg:min-h-[90vh] overflow-hidden bg-black shadow-2xl'
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
            <img
              src={slide.image}
              alt={slide.title}
              className='w-full h-full object-cover'
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>

      {/* Overlay Gradiente Elegante */}
      <div className='absolute inset-0 bg-gradient-to-r from-black via-black/95 via-black/70 to-transparent'>
        <div className='absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40' />
      </div>

      {/* Controles de Navegação */}
      <div className='absolute top-1/2 left-4 transform -translate-y-1/2 z-20'>
        <button
          onClick={prevSlide}
          className='bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110'
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
      </div>

      <div className='absolute top-1/2 right-4 transform -translate-y-1/2 z-20'>
        <button
          onClick={nextSlide}
          className='bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110'
          aria-label='Próximo slide'
        >
          <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
          </svg>
        </button>
      </div>

      {/* Indicadores */}
      <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20'>
        <div className='flex space-x-3'>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white scale-110' : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Conteúdo Premium */}
      <div className='relative z-10 min-h-[80vh] lg:min-h-[90vh] flex items-center pt-24 pb-8'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl space-y-6 lg:space-y-8'>
            {/* Título Principal com transição */}
            <div className='space-y-3 lg:space-y-4'>
              <div key={`title-${currentSlide}`} className='animate-fade-in'>
                <div className='text-2xl sm:text-3xl lg:text-4xl font-light text-white/90 italic tracking-wide leading-relaxed'>
                  {currentSlideData.subtitle}
                </div>
                <div className='text-4xl sm:text-5xl lg:text-6xl xl:text-7xl tracking-tight mt-4'>
                  <span
                    className='text-white font-black tracking-wide uppercase'
                    style={{ fontFamily: 'Anton, Impact, Arial Black, sans-serif' }}
                  >
                    {currentSlideData.title}
                  </span>
                </div>
              </div>
            </div>

            {/* Descrição do Produto */}
            <p
              key={`desc-${currentSlide}`}
              className='text-lg sm:text-xl text-white/80 font-light leading-relaxed max-w-2xl animate-fade-in'
            >
              {currentSlideData.description}
            </p>

            {/* Estatísticas Premium */}
            <div className='flex items-center justify-start space-x-4 sm:space-x-8 py-4'>
              <div className='text-center'>
                <div className='text-2xl sm:text-3xl font-bold text-white'>500+</div>
                <div className='text-xs sm:text-sm text-white/60 font-medium'>
                  {t('statsAcademias')}
                </div>
              </div>
              <div className='w-px h-8 sm:h-12 bg-white/20'></div>
              <div className='text-center'>
                <div className='text-2xl sm:text-3xl font-bold text-white'>15+</div>
                <div className='text-xs sm:text-sm text-white/60 font-medium'>{t('statsAnos')}</div>
              </div>
              <div className='w-px h-8 sm:h-12 bg-white/20'></div>
              <div className='text-center'>
                <div className='text-2xl sm:text-3xl font-bold text-white'>98%</div>
                <div className='text-xs sm:text-sm text-white/60 font-medium'>
                  {t('statsSatisfacao')}
                </div>
              </div>
            </div>

            {/* Call to Actions Premium com transição */}
            <div
              key={`cta-${currentSlide}`}
              className='flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 animate-fade-in'
            >
              <Link href={currentSlideData.equipmentUrl as any} className='w-full sm:w-auto'>
                <Button
                  size='lg'
                  className='w-full px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg font-semibold bg-gradient-to-r from-white to-gray-100 text-black hover:from-gray-100 hover:to-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl'
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
                  className='w-full sm:w-auto px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg font-semibold quote-button text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl'
                  style={{ backgroundColor: 'rgba(34, 197, 94, 0.8)' }}
                >
                  {currentSlideData.cta.secondary}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Efeitos de Brilho */}
      <div className='absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-30 animate-pulse'></div>

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
