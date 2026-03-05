import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { APP_CONFIG } from '@/constants';
import { fetchEquipments } from '@/services/equipments';
import { Equipment } from '@/types';
import { SuporteClientFinal } from './components/SuporteClientFinal';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  try {
    const { locale } = await params;
    const tSup = await getTranslations({ locale, namespace: 'support' });
    const tNav = await getTranslations({ locale, namespace: 'nav' });

    return {
      title: `${tNav('suporte')} - Power Run`,
      description: tSup('subtitle'),
      keywords: 'Power Run, suporte, manuais, vídeos, especificações técnicas, equipamentos',
      openGraph: {
        title: `${tNav('suporte')} - Power Run`,
        description: tSup('subtitle'),
        type: 'website',
      },
    };
  } catch {
    return {
      title: 'Suporte - Power Run',
      description: 'Suporte técnico, manuais e materiais para equipamentos Power Run',
      keywords: 'Power Run, suporte, manuais, vídeos, especificações técnicas, equipamentos',
    };
  }
}

export default async function SuportePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tNav = await getTranslations({ locale, namespace: 'nav' });
  const tSup = await getTranslations({ locale, namespace: 'support' });

  // Carregamento inicial dos dados no servidor
  let initialEquipments: Equipment[] = [];

  try {
    const equipmentsResponse = await fetchEquipments({ locale, forSupport: true });

    initialEquipments = equipmentsResponse.data || [];
  } catch (error) {
    console.error('Erro ao carregar dados iniciais:', error);
  }

  return (
    <MainLayout title={`${tNav('suporte')} - Power Run`}>
      <div className='relative min-h-screen bg-white'>
        {/* Hero Banner com Breadcrumb */}
        <section className='relative bg-gradient-to-br from-gray-900 via-black to-gray-800 overflow-hidden pt-32 pb-20 carousel-card-text no-border'>
          <div className='absolute inset-0 w-full h-full'>
            <img
              src='https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1920&h=1080&fit=crop'
              alt='Suporte e Materiais'
              className='w-full h-full object-cover opacity-20'
              loading='eager'
            />
          </div>

          <div className='absolute inset-0 bg-gradient-to-r from-black via-black/95 to-black/70'>
            <div className='absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60' />
          </div>

          <div className='relative z-10'>
            <div className='container mx-auto px-4'>
              {/* Breadcrumb */}
              <nav className='flex items-center space-x-2 text-sm text-gray-300 mb-8 no-border'>
                <Link
                  href='/'
                  className='hover:text-white transition-colors btn-exception no-border'
                >
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
                <span className='text-white font-medium'>{tNav('suporte')}</span>
              </nav>

              {/* Título */}
              <div className='max-w-4xl'>
                <h1 className='text-4xl lg:text-6xl font-bold text-white mb-6'>{tSup('title')}</h1>
                <p className='text-white/80 text-xl leading-relaxed mb-8'>{tSup('subtitle')}</p>

                <div className='flex flex-col sm:flex-row gap-4'>
                  <a
                    href={`https://wa.me/55${APP_CONFIG.contact.posVenda.whatsapp.replace(/\D/g, '')}?text=Olá! Preciso de ajuda com suporte técnico para equipamentos Power Run.`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Button
                      className='btn-exception no-border hero-btn-primary'
                      style={{
                        padding: '16px 32px !important',
                        fontSize: '16px !important',
                        fontWeight: '500 !important',
                        backgroundColor: '#ffffff !important',
                        color: '#000000 !important',
                        border: 'none !important',
                        borderRadius: '8px !important',
                        transition: 'all 0.3s ease !important',
                        cursor: 'pointer !important',
                      }}
                    >
                      {tSup('centralAtendimento')}
                    </Button>
                  </a>
                  <a
                    href={`https://wa.me/55${APP_CONFIG.contact.suporte.whatsapp.replace(/\D/g, '')}?text=Olá! Preciso de contato técnico para equipamentos Power Run.`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Button
                      className='btn-exception no-border hero-btn-outline'
                      style={{
                        padding: '16px 32px !important',
                        fontSize: '16px !important',
                        fontWeight: '500 !important',
                        backgroundColor: 'transparent !important',
                        color: '#ffffff !important',
                        border: '1px solid rgba(255, 255, 255, 0.7) !important',
                        borderRadius: '8px !important',
                        backdropFilter: 'blur(8px) !important',
                        transition: 'all 0.3s ease !important',
                        cursor: 'pointer !important',
                      }}
                    >
                      {tSup('contatoTecnico')}
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Componente Client com dados iniciais */}
        <Suspense
          fallback={
            <div className='container mx-auto px-4 py-12'>
              <div className='animate-pulse'>
                <div className='h-8 bg-gray-200 rounded w-1/3 mb-8'></div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className='h-96 bg-gray-200 rounded'></div>
                  ))}
                </div>
              </div>
            </div>
          }
        >
          <SuporteClientFinal
            initialEquipments={initialEquipments}
            translations={{
              listTitle: tSup('listTitle', { count: '{count}' }),
              emptyTitle: tSup('emptyTitle'),
              emptySubtitle: tSup('emptySubtitle'),
              materiaisDisponiveis: tSup('materiaisDisponiveis'),
              downloads: tSup('downloads'),
              videos: tSup('videos'),
              especificacoes: tSup('especificacoes'),
            }}
            locale={locale}
          />
        </Suspense>
      </div>
    </MainLayout>
  );
}
