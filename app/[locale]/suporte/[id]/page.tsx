'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout';
import { SupportProductDetails } from '@/components/product-lines';
import { Button } from '@/components/ui';
import { APP_CONFIG } from '@/constants';
import { getProductLineConfig, type ProductLineConfig } from '@/constants/product-line-mapping';
import { useEquipmentTranslations } from '@/hooks/useEquipmentTranslations';
import { fetchEquipmentById } from '@/services/equipments';
import { Equipment } from '@/types';

// 🛡️ FUNÇÃO PARA ESTILOS INDESTRUTÍVEIS
const setImportantStyle = (element: HTMLElement, styles: Record<string, string>) => {
  Object.entries(styles).forEach(([property, value]) => {
    element.style.setProperty(property, value, 'important');
  });
};

export default function SuporteEquipmentPage() {
  const params = useParams();
  const locale = useLocale();
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const tSup = useTranslations('support');
  const { translateEquipment } = useEquipmentTranslations();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [translatedEquipment, setTranslatedEquipment] = useState<Equipment | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      if (!params.id) return;
      const [{ data: eq }] = await Promise.all([fetchEquipmentById(params.id as string, locale)]);
      if (!isMounted) return;
      setEquipment(eq || null);
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [params.id, locale]);

  // Traduzir equipamento sempre que equipment ou locale mudar
  useEffect(() => {
    if (equipment) {
      setTranslatedEquipment(translateEquipment(equipment));
    }
  }, [equipment, locale]);

  // 🛡️ FORÇA ESTILOS CORRETOS APÓS HIDRATAÇÃO - NUNCA MAIS VAI SUMIR!
  useEffect(() => {
    const timer = setTimeout(() => {
      // Força estilos nos botões do hero
      const heroButtons = document.querySelectorAll('.hero-btn-primary');
      heroButtons.forEach((btn) => {
        if (btn instanceof HTMLElement) {
          setImportantStyle(btn, {
            'background-color': '#ffffff',
            color: '#000000',
            border: 'none',
            padding: '16px 32px',
            'font-size': '16px',
            'font-weight': '500',
            'border-radius': '8px',
            cursor: 'pointer',
          });
        }
      });

      const heroButtonsOutline = document.querySelectorAll('.hero-btn-outline');
      heroButtonsOutline.forEach((btn) => {
        if (btn instanceof HTMLElement) {
          setImportantStyle(btn, {
            'background-color': 'transparent',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.7)',
            padding: '16px 32px',
            'font-size': '16px',
            'font-weight': '500',
            'border-radius': '8px',
            'backdrop-filter': 'blur(8px)',
            cursor: 'pointer',
          });
        }
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [translatedEquipment]);

  // Configurações do produto usando sistema modular
  const productLineConfig: ProductLineConfig = equipment
    ? getProductLineConfig(equipment.id)
    : getProductLineConfig('default');

  // Usar as cores do sistema profissional
  const colors = productLineConfig.colors;

  if (!equipment || !translatedEquipment) {
    return (
      <MainLayout title={`${tCommon('notFoundEquipmentTitle')} - Power Run`}>
        <div className='relative min-h-screen bg-white flex items-center justify-center'>
          <div className='text-center'>
            <div className='bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-2xl p-12 shadow-lg max-w-md mx-auto'>
              <div className='w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center'>
                <svg
                  className='w-10 h-10 text-gray-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                  />
                </svg>
              </div>
              <h1 className='text-3xl font-bold text-black mb-4'>
                {tCommon('notFoundEquipmentTitle')}
              </h1>
              <p className='text-gray-600 mb-8'>{tCommon('notFoundEquipmentDesc')}</p>
              <Link href='/suporte'>
                <Button className='bg-black text-white hover:bg-gray-800 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300'>
                  ← {tNav('suporte')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={`Suporte - ${translatedEquipment.name} - Power Run`}>
      <div className='relative min-h-screen bg-gray-50'>
        {/* Hero Banner */}
        <section className='relative bg-gradient-to-br from-gray-900 via-black to-gray-800 overflow-hidden pt-32 pb-20 carousel-card-text no-border'>
          <div className='absolute inset-0 w-full h-full'>
            <img
              src={translatedEquipment.images[0]}
              alt={translatedEquipment.name}
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
                <Link
                  href='/suporte'
                  className='hover:text-white transition-colors btn-exception no-border'
                >
                  {tNav('suporte')}
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
                <span className='text-white font-medium'>{translatedEquipment.name}</span>
              </nav>

              {/* Header do equipamento */}
              <div className='flex flex-col lg:flex-row items-start lg:items-center gap-6'>
                <div className='flex-1'>
                  {/* Badge da linha */}
                  <div className='mb-3'>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold carousel-card-text no-border ${colors.tag}`}
                      style={{
                        backgroundColor:
                          productLineConfig.line === 'red'
                            ? '#dc2626'
                            : productLineConfig.line === 'blue'
                              ? '#0ea5e9'
                              : '#6366f1',
                        color: '#ffffff',
                      }}
                    >
                      {productLineConfig.line === 'red'
                        ? 'Red Line'
                        : productLineConfig.line === 'blue'
                          ? 'Blue Line'
                          : 'Musculação'}
                    </span>
                  </div>

                  <h1 className='text-4xl lg:text-6xl font-bold text-white mb-6'>
                    {translatedEquipment.name}
                  </h1>
                  <p className='text-white/80 text-xl leading-relaxed mb-8'>
                    {translatedEquipment.shortDescription}
                  </p>
                  <div className='flex flex-col sm:flex-row gap-4 mb-6 no-border'>
                    <a
                      href={`https://wa.me/55${APP_CONFIG.contact.suporte.whatsapp.replace(/\D/g, '')}?text=Olá! Preciso de contato técnico para o equipamento ${translatedEquipment.name}.`}
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
                        onMouseEnter={(e) => {
                          setImportantStyle(e.currentTarget, {
                            'background-color': '#f3f4f6',
                            color: '#000000',
                          });
                        }}
                        onMouseLeave={(e) => {
                          setImportantStyle(e.currentTarget, {
                            'background-color': '#ffffff',
                            color: '#000000',
                          });
                        }}
                      >
                        {tSup('contatoTecnico')}
                      </Button>
                    </a>
                    <a
                      href={`https://wa.me/55${APP_CONFIG.contact.suporte.whatsapp.replace(/\D/g, '')}?text=Olá! Preciso de suporte via WhatsApp para o equipamento ${translatedEquipment.name}.`}
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
                        onMouseEnter={(e) => {
                          setImportantStyle(e.currentTarget, {
                            'background-color': 'rgba(255, 255, 255, 0.2)',
                            'border-color': 'rgba(255, 255, 255, 0.9)',
                            color: '#ffffff',
                          });
                        }}
                        onMouseLeave={(e) => {
                          setImportantStyle(e.currentTarget, {
                            'background-color': 'transparent',
                            'border-color': 'rgba(255, 255, 255, 0.7)',
                            color: '#ffffff',
                          });
                        }}
                      >
                        {tSup('whatsappSuporte')}
                      </Button>
                    </a>
                  </div>

                  <div className='flex items-center gap-6 text-sm text-white/60'>
                    <span>
                      <strong>{tCommon('brand', { default: 'Marca' })}:</strong>{' '}
                      {translatedEquipment.brand}
                    </span>
                    <span>
                      <strong>{tCommon('model', { default: 'Modelo' })}:</strong>{' '}
                      {translatedEquipment.model}
                    </span>
                  </div>
                </div>

                {/* Imagem do equipamento */}
                <div className='w-full lg:w-96 h-56 lg:h-72 rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center'>
                  <div className='w-full h-full bg-white p-6 rounded-xl flex items-center justify-center'>
                    <img
                      src={translatedEquipment.images[0]}
                      alt={translatedEquipment.name}
                      className='max-w-full max-h-full object-contain'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ✅ COMPONENTE MODULAR - Substitui 600+ linhas inline */}
        <SupportProductDetails equipment={equipment} translatedEquipment={translatedEquipment} />
      </div>
    </MainLayout>
  );
}
