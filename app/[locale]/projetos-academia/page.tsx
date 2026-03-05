'use client';

import Link from 'next/link';
import { MainLayout } from '@/components/layout';
import { CloudinaryImage } from '@/components/performance/CloudinaryImage';
import { Button } from '@/components/ui';
import { MOCK_EQUIPMENT } from '@/constants/equipment-data';
import { GYM_KITS } from '@/constants/gym-kits';
import { GymKitList } from './components/GymKitList';
import { LineEquipmentCarousel } from './components/LineEquipmentCarousel';

export default function ProjetosAcademiaPage() {
  const allKits = GYM_KITS;

  const allKitEquipmentIds = Array.from(
    new Set(allKits.flatMap((kit) => kit.items.map((item) => item.productId)))
  );
  const equipments = MOCK_EQUIPMENT.filter((eq) => allKitEquipmentIds.includes(eq.id));

  return (
    <MainLayout title='Kits de Academia'>
      {/* HERO ÚNICO - PROJETOS DE ACADEMIA / KITS POWER RUN */}
      <section className='relative min-h-[95vh] sm:min-h-[90vh] lg:min-h-[85vh] overflow-hidden bg-black shadow-2xl text-white'>
        <div className='absolute inset-0 w-full h-full'>
          <CloudinaryImage
            src='https://res.cloudinary.com/dq0bovaz5/image/upload/v1756363528/Design_sem_nome_-_2025-08-28T034501.828_wrvqwr.png'
            alt='Projetos de academia Power Run'
            fill
            className='object-cover min-h-full min-w-full'
            priority
            fetchPriority='high'
            quality={85}
            sizes='100vw'
          />
        </div>
        <div className='absolute inset-0 bg-gradient-to-r from-black via-black/95 via-black/70 to-transparent'>
          <div className='absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40' />
        </div>

        <div className='relative z-10 min-h-[95vh] sm:min-h-[90vh] lg:min-h-[85vh] flex items-center pt-20 sm:pt-24 pb-8'>
          <div className='container mx-auto px-4 sm:px-6'>
            <div className='max-w-4xl space-y-4 sm:space-y-6 lg:space-y-8'>
              <div className='space-y-3 lg:space-y-4'>
                <div>
                  <div className='mb-3 inline-flex items-center px-4 py-1.5 rounded-full bg-primary/15 border border-primary/40 backdrop-blur-sm'>
                    <span className='text-white font-bold text-sm sm:text-base tracking-wide'>
                      KITS DE ACADEMIA
                    </span>
                  </div>
                  <div
                    className='text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-2 sm:mb-3'
                    style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
                  >
                    <span
                      className='text-white font-black tracking-wide uppercase block'
                      style={{ fontFamily: 'Anton, Impact, Arial Black, sans-serif' }}
                    >
                      Sugestões oficiais por tamanho de espaço
                    </span>
                  </div>
                  <div
                    className='text-lg sm:text-2xl lg:text-3xl font-light text-white/90 tracking-wide leading-relaxed'
                    style={{ fontSize: 'clamp(1.125rem, 3vw, 1.8rem)' }}
                  >
                    Do BASIC ao Premium: kits com equipamentos Power Run para espaços de 30 m² até
                    150 m².
                  </div>
                </div>
              </div>

              <p className='text-base sm:text-lg lg:text-xl text-white/80 font-light leading-relaxed max-w-2xl'>
                Cinco níveis de composição (BASIC, PLUS, Gold, Master e Premium) pensados para
                condomínios, academias comerciais e studios. Todos com equipamentos oficiais Power
                Run.
              </p>

              <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6'>
                <Button
                  size='lg'
                  className='w-full sm:w-auto px-5 sm:px-6 lg:px-8 py-3 lg:py-4 text-sm sm:text-base lg:text-lg font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl'
                  onClick={() =>
                    document
                      .getElementById('kits')
                      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                >
                  Ver todos os kits
                </Button>
                <Button
                  size='lg'
                  variant='outline'
                  className='w-full sm:w-auto px-5 sm:px-6 lg:px-8 py-3 lg:py-4 text-sm sm:text-base lg:text-lg font-medium border-2 border-white/40 text-white bg-transparent hover:bg-white/10 hover:border-white/70 backdrop-blur-sm rounded-xl transition-all duration-300'
                  asChild
                >
                  <Link href='/equipamentos'>Ver catálogo de equipamentos</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CARROSSEL DE EQUIPAMENTOS DOS KITS */}
      <section className='container mx-auto px-4 pt-12 pb-4'>
        <LineEquipmentCarousel
          title='Equipamentos que compõem os kits'
          subtitle='Cardio e musculação Power Run presentes nas sugestões oficiais para academias de 30 a 150 m².'
          equipments={equipments}
        />
      </section>

      {/* LISTA DE TODOS OS 5 KITS */}
      <section id='kits' className='container mx-auto px-4 pb-16 pt-10'>
        <div className='mb-8 text-center max-w-2xl mx-auto'>
          <h2 className='text-3xl font-bold text-gray-900 mb-2'>Kits de 30 m² a 150 m²</h2>
          <p className='text-gray-600'>
            Sugestões oficiais de equipamentos e acessórios. Os kits abaixo são composições
            sugeridas usando apenas equipamentos Power Run; podemos ajustar conforme o perfil do seu
            público.
          </p>
        </div>

        <GymKitList kits={allKits} />
      </section>
    </MainLayout>
  );
}
