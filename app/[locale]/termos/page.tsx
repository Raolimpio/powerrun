import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { MainLayout } from '@/components/layout';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  try {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'terms' });

    return {
      title: t('pageTitle'),
      description: t('description'),
      keywords: 'termos de uso, condições, Power Run',
    };
  } catch {
    return {
      title: 'Termos de Uso - Power Run',
      description: 'Termos e condições de uso dos serviços da Power Run',
      keywords: 'termos de uso, condições, Power Run',
    };
  }
}

export default async function TermosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tNav = await getTranslations({ locale, namespace: 'nav' });
  const t = await getTranslations({ locale, namespace: 'terms' });

  return (
    <MainLayout title={t('title')}>
      <div className='bg-white min-h-screen'>
        {/* Hero Banner com padrão da aplicação */}
        <section className='relative bg-gradient-to-br from-gray-900 via-black to-gray-800 overflow-hidden pt-32 pb-20'>
          <div className='absolute inset-0 w-full h-full'>
            <div className='absolute inset-0 bg-gradient-to-r from-black via-black/95 to-black/70'>
              <div className='absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60' />
            </div>
          </div>

          <div className='relative z-10'>
            <div className='container mx-auto px-4'>
              {/* Breadcrumb */}
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
                <span className='text-white font-medium'>{t('title')}</span>
              </nav>

              {/* Título */}
              <div className='max-w-4xl'>
                <h1 className='text-4xl lg:text-6xl font-bold text-white mb-6'>{t('title')}</h1>
                <p className='text-white/80 text-xl leading-relaxed mb-8'>
                  {t('lastUpdate')}: {new Date().toLocaleDateString(locale)}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Conteúdo */}
        <section className='py-16'>
          <div className='container mx-auto px-4 max-w-4xl'>
            <div className='prose prose-lg max-w-none'>
              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                {t('sections.acceptance.title')}
              </h2>
              <p className='mb-6 text-gray-700'>{t('sections.acceptance.content')}</p>

              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                {t('sections.siteUse.title')}
              </h2>
              <p className='mb-4 text-gray-700'>{t('sections.siteUse.intro')}</p>
              <ul className='list-disc pl-6 mb-6 text-gray-700'>
                <li>{t('sections.siteUse.items.view')}</li>
                <li>{t('sections.siteUse.items.contact')}</li>
                <li>{t('sections.siteUse.items.download')}</li>
                <li>{t('sections.siteUse.items.navigate')}</li>
              </ul>

              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                {t('sections.restrictions.title')}
              </h2>
              <p className='mb-4 text-gray-700'>{t('sections.restrictions.intro')}</p>
              <ul className='list-disc pl-6 mb-6 text-gray-700'>
                <li>{t('sections.restrictions.items.illegal')}</li>
                <li>{t('sections.restrictions.items.virus')}</li>
                <li>{t('sections.restrictions.items.interfere')}</li>
                <li>{t('sections.restrictions.items.unauthorized')}</li>
                <li>{t('sections.restrictions.items.reproduce')}</li>
              </ul>

              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                {t('sections.intellectual.title')}
              </h2>
              <p className='mb-6 text-gray-700'>{t('sections.intellectual.content')}</p>

              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                {t('sections.products.title')}
              </h2>
              <p className='mb-6 text-gray-700'>{t('sections.products.content')}</p>

              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                {t('sections.liability.title')}
              </h2>
              <p className='mb-6 text-gray-700'>{t('sections.liability.content')}</p>

              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                {t('sections.externalLinks.title')}
              </h2>
              <p className='mb-6 text-gray-700'>{t('sections.externalLinks.content')}</p>

              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                {t('sections.communications.title')}
              </h2>
              <p className='mb-6 text-gray-700'>{t('sections.communications.content')}</p>

              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                {t('sections.modifications.title')}
              </h2>
              <p className='mb-6 text-gray-700'>{t('sections.modifications.content')}</p>

              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                {t('sections.applicableLaw.title')}
              </h2>
              <p className='mb-6 text-gray-700'>{t('sections.applicableLaw.content')}</p>

              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                {t('sections.contact.title')}
              </h2>
              <p className='mb-4 text-gray-700'>{t('sections.contact.intro')}</p>
              <ul className='list-none mb-6 text-gray-700'>
                <li>
                  <strong>{t('sections.contact.email')}:</strong> contato@powerrun.com.br
                </li>
                <li>
                  <strong>{t('sections.contact.phone')}:</strong> (14) 3415-4493
                </li>
                <li>
                  <strong>{t('sections.contact.whatsapp')}:</strong> (14) 98219-1126
                </li>
                <li>
                  <strong>{t('sections.contact.address')}:</strong> R. Esmeraldina Pinheiro Barbosa,
                  360 - Jardim Santa Antonieta, Marília - SP, 17512-320
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
