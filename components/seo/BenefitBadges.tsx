'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

interface BenefitBadgesProps {
  accentColor: string;
  isExport?: boolean;
}

export function BenefitBadges({ accentColor, isExport = false }: BenefitBadgesProps) {
  const tSeo = useTranslations('seo');

  // Ícones para os badges
  const deliveryIcon = (
    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
  );
  
  const qualityIcon = (
    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
  );
  
  const supportIcon = (
    <>
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' />
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
    </>
  );
  
  const installationIcon = (
    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' />
  );

  const durabilityIcon = (
    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
  );

  const warrantyIcon = (
    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
  );

  // Badges para Brasil
  const brazilBenefits = [
    {
      icon: deliveryIcon,
      title: tSeo('badgeDeliveryTitle'),
      description: tSeo('badgeDeliveryDesc'),
    },
    {
      icon: qualityIcon,
      title: tSeo('badgeQualityTitle'),
      description: tSeo('badgeQualityDesc'),
    },
    {
      icon: supportIcon,
      title: tSeo('badgeSupportTitle'),
      description: tSeo('badgeSupportDesc'),
    },
    {
      icon: installationIcon,
      title: tSeo('badgeInstallationTitle'),
      description: tSeo('badgeInstallationDesc'),
    },
  ];

  // Badges para exportação (sem suporte técnico e instalação)
  const exportBenefits = [
    {
      icon: deliveryIcon,
      title: tSeo('badgeDeliveryTitleExport'),
      description: tSeo('badgeDeliveryDescExport'),
    },
    {
      icon: qualityIcon,
      title: tSeo('badgeQualityTitleExport'),
      description: tSeo('badgeQualityDescExport'),
    },
    {
      icon: durabilityIcon,
      title: tSeo('badgeDurabilityTitleExport'),
      description: tSeo('badgeDurabilityDescExport'),
    },
    {
      icon: warrantyIcon,
      title: tSeo('badgeWarrantyTitleExport'),
      description: tSeo('badgeWarrantyDescExport'),
    },
  ];

  const benefits = isExport ? exportBenefits : brazilBenefits;

  return (
    <section className='bg-white py-12 border-b border-gray-100'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className='flex items-start gap-4 p-6 rounded-xl bg-gray-50 hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100'
            >
              <div
                className='w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0'
                style={{ backgroundColor: `${accentColor}15` }}
              >
                <svg
                  className='w-6 h-6'
                  style={{ color: accentColor }}
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  {benefit.icon}
                </svg>
              </div>
              <div>
                <h3 className='font-semibold mb-1 text-gray-900'>{benefit.title}</h3>
                <p className='text-sm text-gray-600'>{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

