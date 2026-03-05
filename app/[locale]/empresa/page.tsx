import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { MainLayout } from '@/components/layout';
import { BackgroundVideo } from '@/components/ui';
import { APP_CONFIG } from '@/constants';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  try {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'empresa' });

    return {
      title: t('pageTitle'),
      description: t('hero.subtitle'),
      keywords: 'Power Run, academia, equipamentos fitness, empresa, sobre nós',
      openGraph: {
        title: t('pageTitle'),
        description: t('hero.subtitle'),
        type: 'website',
      },
    };
  } catch {
    return {
      title: 'Empresa - Power Run',
      description:
        'Na Power Run, nós nos dedicamos a elevar a experiência de fitness com equipamentos inovadores e de alta qualidade.',
      keywords: 'Power Run, academia, equipamentos fitness, empresa, sobre nós',
    };
  }
}

export default async function EmpresaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'empresa' });

  const stats = [
    { number: '15+', label: t('stats.experience') },
    { number: '500+', label: t('stats.gyms') },
    { number: '98%', label: t('stats.satisfaction') },
  ];

  return (
    <MainLayout title={t('pageTitle')}>
      <div className='bg-white min-h-screen'>
        {/* Hero Section - PRETO com vídeo do Cloudinary */}
        <section className='relative bg-black overflow-hidden'>
          <BackgroundVideo
            src='https://res.cloudinary.com/dq0bovaz5/video/upload/f_auto,q_auto:good,c_fill,w_1920,h_1080/v1756387809/1E1e1e_wvmoz1.mp4'
            fallbackImage='/Logo PowerRun.png'
            opacity={0.3}
          />

          <div className='absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 via-black/30 to-transparent'>
            <div className='absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20' />
          </div>

          <div className='relative z-10 pt-32 pb-20'>
            <div className='container mx-auto px-4 text-center'>
              <h1 className='text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6'>
                {t('hero.title1')}
                <span className='block bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent'>
                  {t('hero.title2')}
                </span>
              </h1>
              <p className='text-xl lg:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed mb-12'>
                {t('hero.subtitle')}
              </p>

              {/* Estatísticas */}
              <div className='flex items-center justify-center space-x-4 sm:space-x-8 py-4'>
                {stats.map((stat, index) => (
                  <div key={index} className='text-center relative'>
                    <div className='text-2xl sm:text-3xl font-bold text-white'>{stat.number}</div>
                    <div className='text-xs sm:text-sm text-white/60 font-medium'>{stat.label}</div>
                    {index < stats.length - 1 && (
                      <div className='hidden sm:block w-px h-8 bg-white/20 absolute -right-4 top-0'></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Nossa Essência - PRETO */}
        <section className='py-20 bg-black relative overflow-hidden'>
          <div className='absolute inset-0 bg-gradient-to-b from-gray-900/20 via-transparent to-gray-900/20' />

          <div className='container mx-auto px-4 relative z-10'>
            <div className='text-center mb-16'>
              <h2 className='text-4xl lg:text-5xl font-bold text-white mb-6'>
                {t('essence.title1')}
                <span className='block bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent'>
                  {t('essence.title2')}
                </span>
              </h2>
              <p className='text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed'>
                {t('essence.subtitle')}
              </p>
            </div>

            {/* Missão, Visão e Valores em Grid Moderno */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20'>
              {/* Missão */}
              <div className='backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl hover:bg-white/10 transition-all duration-500 group'>
                <div className='w-16 h-16 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
                  <svg
                    className='w-8 h-8 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M13 10V3L4 14h7v7l9-11h-7z'
                    />
                  </svg>
                </div>
                <h3 className='text-2xl font-bold text-white mb-4'>{t('mission.title')}</h3>
                <p className='text-gray-300 leading-relaxed'>{t('mission.description')}</p>
              </div>

              {/* Visão */}
              <div className='backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl hover:bg-white/10 transition-all duration-500 group'>
                <div className='w-16 h-16 bg-gradient-to-r from-gray-300/20 to-gray-400/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
                  <svg
                    className='w-8 h-8 text-gray-300'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15 12a3 3 0 11-6 0 3 3 0 616 0z'
                    />
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                    />
                  </svg>
                </div>
                <h3 className='text-2xl font-bold text-white mb-4'>{t('vision.title')}</h3>
                <p className='text-gray-300 leading-relaxed'>{t('vision.description')}</p>
              </div>

              {/* Valores */}
              <div className='backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl hover:bg-white/10 transition-all duration-500 group'>
                <div className='w-16 h-16 bg-gradient-to-r from-gray-200/20 to-gray-300/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
                  <svg
                    className='w-8 h-8 text-gray-200'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                    />
                  </svg>
                </div>
                <h3 className='text-2xl font-bold text-white mb-4'>{t('purpose.title')}</h3>
                <p className='text-gray-300 leading-relaxed'>{t('purpose.description')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Política de Qualidade - PRETO com estilo glassmorphism */}
        <section className='py-20 bg-black relative overflow-hidden'>
          <div className='absolute inset-0 bg-gradient-to-b from-gray-900/20 via-transparent to-gray-900/20' />

          <div className='container mx-auto px-4 relative z-10'>
            <div className='text-center mb-16'>
              <h2 className='text-4xl lg:text-5xl font-bold text-white mb-6'>
                {t('qualityPolicy.title1')}
                <span className='block bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent'>
                  {t('qualityPolicy.title2')}
                </span>
              </h2>
              <p className='text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed'>
                {t('qualityPolicy.subtitle')}
              </p>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
              {/* Compromisso */}
              <div className='backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl hover:bg-white/10 transition-all duration-500 group'>
                <div className='w-16 h-16 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
                  <svg
                    className='w-8 h-8 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
                <h3 className='text-2xl font-bold text-white mb-4'>
                  {t('qualityPolicy.commitment.title')}
                </h3>
                <p className='text-gray-300 leading-relaxed'>
                  {t('qualityPolicy.commitment.description')}
                </p>
              </div>

              {/* Requisitos Legais */}
              <div className='backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl hover:bg-white/10 transition-all duration-500 group'>
                <div className='w-16 h-16 bg-gradient-to-r from-gray-300/20 to-gray-400/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
                  <svg
                    className='w-8 h-8 text-gray-300'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'
                    />
                  </svg>
                </div>
                <h3 className='text-2xl font-bold text-white mb-4'>
                  {t('qualityPolicy.legal.title')}
                </h3>
                <p className='text-gray-300 leading-relaxed'>
                  {t('qualityPolicy.legal.description')}
                </p>
              </div>

              {/* Melhoria Contínua */}
              <div className='backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl hover:bg-white/10 transition-all duration-500 group'>
                <div className='w-16 h-16 bg-gradient-to-r from-gray-200/20 to-gray-300/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
                  <svg
                    className='w-8 h-8 text-gray-200'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                    />
                  </svg>
                </div>
                <h3 className='text-2xl font-bold text-white mb-4'>
                  {t('qualityPolicy.improvement.title')}
                </h3>
                <p className='text-gray-300 leading-relaxed'>
                  {t('qualityPolicy.improvement.description')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - CINZA CLARO */}
        <section className='py-20 bg-gray-50'>
          <div className='container mx-auto px-4 text-center'>
            <h2 className='text-3xl lg:text-4xl font-bold text-gray-900 mb-6'>{t('cta.title')}</h2>
            <p className='text-xl text-gray-700 mb-8 max-w-2xl mx-auto'>{t('cta.subtitle')}</p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
              <a
                href={`https://wa.me/55${APP_CONFIG.contact.comercial.whatsapp.replace(/\D/g, '')}?text=Olá! Gostaria de saber mais sobre como a Power Run pode transformar meu espaço fitness.`}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-900 to-black 
                         hover:from-gray-800 hover:to-gray-900 text-white font-semibold rounded-full 
                         transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl'
              >
                <svg className='w-5 h-5 mr-2' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488' />
                </svg>
                {t('cta.contactButton')}
              </a>

              <Link
                href='/equipamentos'
                className='inline-flex items-center px-8 py-4 border-2 border-gray-300 hover:border-gray-400 
                         text-gray-700 hover:text-gray-900 font-semibold rounded-full 
                         transition-all duration-300 transform hover:scale-105'
              >
                <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                  />
                </svg>
                {t('cta.catalogButton')}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
