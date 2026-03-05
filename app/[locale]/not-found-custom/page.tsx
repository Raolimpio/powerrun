'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { MainLayout } from '@/components/layout';

export default function NotFoundCustom() {
  const t = useTranslations('notFound');
  const locale = useLocale();
  return (
    <MainLayout>
      <div className='min-h-screen flex items-center justify-center relative'>
        {/* Background simples - BRANCO SÓLIDO */}
        <div className='absolute inset-0 bg-white'></div>

        {/* Container principal */}
        <div className='relative z-10 max-w-2xl mx-auto text-center px-6'>
          {/* Número 404 estilizado - PRETO E VERMELHO SÓLIDO */}
          <div className='mb-8'>
            <h1 className='text-9xl md:text-[12rem] font-bold leading-none'>
              <span className='text-[#9c1006]'>4</span>
              <span className='text-black'>0</span>
              <span className='text-[#9c1006]'>4</span>
            </h1>
          </div>

          {/* Conteúdo principal */}
          <div className='space-y-6'>
            <h2 className='text-3xl md:text-4xl font-bold text-black'>{t('title')}</h2>

            <p className='text-lg md:text-xl text-black max-w-lg mx-auto leading-relaxed'>
              {t('description')}
            </p>

            {/* Botões de ação */}
            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mt-10'>
              <Link href={`/${locale}`}>
                <button className='bg-[#9c1006] hover:bg-red-800 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 text-lg'>
                  {t('goHome')}
                </button>
              </Link>

              <Link href={`/${locale}/equipamentos`}>
                <button className='border-2 border-black bg-white text-black hover:bg-black hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 text-lg'>
                  {t('viewEquipments')}
                </button>
              </Link>
            </div>

            {/* Links adicionais */}
            <div className='pt-8 border-t border-gray-300 mt-12'>
              <p className='text-black mb-4'>{t('helpText')}</p>
              <div className='flex flex-wrap justify-center gap-6 text-sm'>
                <Link
                  href={`/${locale}/empresa`}
                  className='text-black hover:text-[#9c1006] transition-colors duration-200 font-medium'
                >
                  {t('aboutCompany')}
                </Link>
                <Link
                  href={`/${locale}/suporte`}
                  className='text-black hover:text-[#9c1006] transition-colors duration-200 font-medium'
                >
                  {t('support')}
                </Link>
                <Link
                  href={`/${locale}/suporte/contato`}
                  className='text-black hover:text-[#9c1006] transition-colors duration-200 font-medium'
                >
                  {t('contact')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
