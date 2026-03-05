import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout';
import { fetchEquipments } from '@/services/equipments';
import { Equipment } from '@/types';
import { EquipamentosClient } from './components/EquipamentosClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  try {
    const { locale } = await params;
    const tEq = await getTranslations({ locale, namespace: 'equipments' });
    const tNav = await getTranslations({ locale, namespace: 'nav' });

    return {
      title: `${tNav('equipamentos')} - Power Run`,
      description: tEq('subtitle'),
      keywords: 'Power Run, equipamentos, academia, fitness, cardio, musculação',
      openGraph: {
        title: `${tNav('equipamentos')} - Power Run`,
        description: tEq('subtitle'),
        type: 'website',
      },
    };
  } catch {
    // Fallback metadata if translations fail
    return {
      title: 'Equipamentos - Power Run',
      description:
        'Descubra nossa linha completa de equipamentos profissionais para academias e espaços de exercício',
      keywords: 'Power Run, equipamentos, academia, fitness, cardio, musculação',
    };
  }
}

export default async function EquipamentosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tNav = await getTranslations({ locale, namespace: 'nav' });
  const tEq = await getTranslations({ locale, namespace: 'equipments' });

  // Carregamento inicial dos dados no servidor
  let initialEquipments: Equipment[] = [];

  try {
    const equipmentsResponse = await fetchEquipments({ locale, forSupport: true }); // forSupport: true para incluir TODOS os equipamentos

    initialEquipments = equipmentsResponse?.data || [];
  } catch (error) {
    console.error('Erro ao carregar dados iniciais:', error);
    initialEquipments = []; // Garantir que seja sempre um array
  }

  return (
    <MainLayout title={`${tNav('equipamentos')} - Power Run`}>
      <div className='relative min-h-screen bg-white pb-20'>
        {/* Hero Banner - COMENTADO TEMPORARIAMENTE */}
        {/* 
        <section className='relative bg-gradient-to-br from-gray-900 via-black to-gray-800 overflow-hidden pt-32 pb-20'>
          <div className='absolute inset-0 w-full h-full'>
            <img
              src='https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=1080&fit=crop'
              alt='Equipamentos de Academia'
              className='w-full h-full object-cover opacity-20'
            />
          </div>

          <div className='absolute inset-0 bg-gradient-to-r from-black via-black/95 to-black/70'>
            <div className='absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60' />
          </div>

          <div className='relative z-10'>
            <div className='container mx-auto px-4'>
              <nav className='flex items-center space-x-2 text-sm text-gray-300 mb-8'>
                <Link href='/' className='hover:text-white transition-colors'>
                  {tNav('inicio')}
                </Link>
                <svg
                  className='w-4 h-4 text-gray-500'
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
                <span className='text-white font-medium'>{tNav('equipamentos')}</span>
              </nav>

              <div className='max-w-4xl'>
                <h1 className='text-4xl lg:text-6xl font-bold text-white mb-6'>{tEq('title')}</h1>
                <p className='text-white/80 text-xl leading-relaxed mb-8'>{tEq('subtitle')}</p>

                <div className='flex flex-col sm:flex-row gap-4'>
                  <a href='#lista-equipamentos'>
                    <Button className='bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg font-semibold'>
                      {tCommon('verTodos')}
                    </Button>
                  </a>
                  <a
                    href={`https://wa.me/55${APP_CONFIG.contact.comercial.whatsapp.replace(/\D/g, '')}?text=Solicitar orçamento Power Run.`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Button
                      variant='outline'
                      className='border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold'
                    >
                      {tCommon('solicitarOrcamento')}
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        */}

        {/* Componente Client com dados iniciais */}
        <Suspense
          fallback={
            <div className='container mx-auto px-4 py-12'>
              <div className='animate-pulse'>
                <div className='h-8 bg-gray-200 rounded w-1/3 mb-8'></div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className='h-96 bg-gray-200 rounded'></div>
                  ))}
                </div>
              </div>
            </div>
          }
        >
          <EquipamentosClient
            initialEquipments={initialEquipments}
            translations={{
              listTitle: tEq('listTitle', { count: '{count}' }),
              emptyTitle: tEq('emptyTitle'),
              emptySubtitle: tEq('emptySubtitle'),
            }}
            locale={locale}
          />
        </Suspense>
      </div>
    </MainLayout>
  );
}
