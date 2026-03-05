'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { MainLayout } from '@/components/layout';
import { Button } from '@/components/ui';

export default function NotFound() {
  const t = useTranslations('notFound');
  const locale = useLocale();
  return (
    <MainLayout>
      <div className='min-h-screen flex items-center justify-center relative overflow-hidden'>
        {/* Background com gradiente sutil */}
        <div className='absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100'></div>

        {/* Elementos decorativos de fundo */}
        <div className='absolute inset-0 overflow-hidden'>
          {/* Círculo grande com cor da marca */}
          <div className='absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-[#9c1006]/10 to-[#9c1006]/5 rounded-full blur-3xl'></div>
          {/* Círculo médio com cor ciano */}
          <div className='absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-tr from-[#61fbfe]/10 to-[#61fbfe]/5 rounded-full blur-2xl'></div>
        </div>

        {/* Container principal */}
        <div className='relative z-10 max-w-2xl mx-auto text-center px-6'>
          {/* Número 404 estilizado */}
          <div className='mb-8'>
            <h1 className='text-9xl md:text-[12rem] font-bold leading-none'>
              <span className='bg-gradient-to-r from-[#9c1006] to-[#61fbfe] bg-clip-text text-transparent'>
                404
              </span>
            </h1>
          </div>

          {/* Conteúdo principal */}
          <div className='space-y-6'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900'>{t('title')}</h2>

            <p className='text-lg md:text-xl text-gray-600 max-w-lg mx-auto leading-relaxed'>
              {t('description')}
            </p>

            {/* Botões de ação */}
            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mt-10'>
              <Link href={`/${locale}`}>
                <Button
                  size='lg'
                  className='bg-[#9c1006] hover:bg-[#9c1006]/90 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl'
                >
                  {t('goHome')}
                </Button>
              </Link>

              <Link href={`/${locale}/equipamentos`}>
                <Button
                  variant='outline'
                  size='lg'
                  className='border-2 border-[#61fbfe] text-[#61fbfe] hover:bg-[#61fbfe] hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300'
                >
                  {t('viewEquipments')}
                </Button>
              </Link>
            </div>

            {/* Links adicionais */}
            <div className='pt-8 border-t border-gray-200 mt-12'>
              <p className='text-gray-500 mb-4'>{t('helpText')}</p>
              <div className='flex flex-wrap justify-center gap-6 text-sm'>
                <Link
                  href={`/${locale}/empresa`}
                  className='text-gray-600 hover:text-[#9c1006] transition-colors duration-300 font-medium'
                >
                  {t('aboutCompany')}
                </Link>
                <Link
                  href={`/${locale}/suporte`}
                  className='text-gray-600 hover:text-[#9c1006] transition-colors duration-300 font-medium'
                >
                  {t('support')}
                </Link>
                <Link
                  href={`/${locale}/suporte/contato`}
                  className='text-gray-600 hover:text-[#9c1006] transition-colors duration-300 font-medium'
                >
                  {t('contact')}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Animação sutil de partículas */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className='absolute w-1 h-1 bg-[#9c1006]/20 rounded-full animate-pulse'
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${2 + i * 0.5}s`,
              }}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
