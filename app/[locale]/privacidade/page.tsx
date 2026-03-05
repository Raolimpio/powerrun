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
    const t = await getTranslations({ locale, namespace: 'privacy' });

    return {
      title: t('pageTitle'),
      description: t('description'),
      keywords: 'privacidade, proteção de dados, LGPD, Power Run',
    };
  } catch {
    return {
      title: 'Política de Privacidade - Power Run',
      description: 'Política de privacidade e proteção de dados da Power Run',
      keywords: 'privacidade, proteção de dados, LGPD, Power Run',
    };
  }
}

export default async function PrivacidadePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tNav = await getTranslations({ locale, namespace: 'nav' });
  const t = await getTranslations({ locale, namespace: 'privacy' });

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
                {t('sections.general.title')}
              </h2>
              <p className='mb-6 text-gray-700'>{t('sections.general.content')}</p>

              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                {t('sections.dataCollected.title')}
              </h2>
              <p className='mb-4 text-gray-700'>{t('sections.dataCollected.intro')}</p>
              <ul className='list-disc pl-6 mb-6 text-gray-700'>
                <li>{t('sections.dataCollected.items.personal')}</li>
                <li>{t('sections.dataCollected.items.company')}</li>
                <li>{t('sections.dataCollected.items.navigation')}</li>
                <li>{t('sections.dataCollected.items.forms')}</li>
                <li>{t('sections.dataCollected.items.communication')}</li>
              </ul>

              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                {t('sections.purpose.title')}
              </h2>
              <p className='mb-4 text-gray-700'>{t('sections.purpose.intro')}</p>
              <ul className='list-disc pl-6 mb-6 text-gray-700'>
                <li>{t('sections.purpose.items.provide')}</li>
                <li>{t('sections.purpose.items.process')}</li>
                <li>{t('sections.purpose.items.support')}</li>
                <li>{t('sections.purpose.items.marketing')}</li>
                <li>{t('sections.purpose.items.improve')}</li>
                <li>{t('sections.purpose.items.legal')}</li>
              </ul>

              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                {t('sections.sharing.title')}
              </h2>
              <p className='mb-6 text-gray-700'>{t('sections.sharing.content')}</p>

              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                {t('sections.security.title')}
              </h2>
              <p className='mb-6 text-gray-700'>{t('sections.security.content')}</p>

              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                {t('sections.rights.title')}
              </h2>
              <p className='mb-4 text-gray-700'>{t('sections.rights.intro')}</p>
              <ul className='list-disc pl-6 mb-6 text-gray-700'>
                <li>{t('sections.rights.items.access')}</li>
                <li>{t('sections.rights.items.correct')}</li>
                <li>{t('sections.rights.items.delete')}</li>
                <li>{t('sections.rights.items.revoke')}</li>
                <li>{t('sections.rights.items.portability')}</li>
                <li>{t('sections.rights.items.oppose')}</li>
              </ul>

              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                {t('sections.cookies.title')}
              </h2>
              <p className='mb-6 text-gray-700'>{t('sections.cookies.content')}</p>

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

              <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                {t('sections.changes.title')}
              </h2>
              <p className='mb-6 text-gray-700'>{t('sections.changes.content')}</p>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
