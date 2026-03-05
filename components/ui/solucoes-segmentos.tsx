'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from './button';

export function SolucoesSegmentos() {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const t = useTranslations('home.solutions');

  const segmentos = [
    {
      id: 'condominios',
      title: t('condos.title'),
      description: t('condos.description'),
      image:
        'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop&crop=center&q=80',
      features: [
        t('condos.features.design'),
        t('condos.features.noise'),
        t('condos.features.maintenance'),
      ],
      buttonText: t('condos.button'),
    },
    {
      id: 'academias',
      title: t('gyms.title'),
      description: t('gyms.description'),
      image:
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop&crop=center&q=80',
      features: [
        t('gyms.features.capacity'),
        t('gyms.features.technology'),
        t('gyms.features.support'),
      ],
      buttonText: t('gyms.button'),
    },
    {
      id: 'franquias',
      title: t('franchises.title'),
      description: t('franchises.description'),
      image:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center&q=80',
      features: [
        t('franchises.features.standard'),
        t('franchises.features.support'),
        t('franchises.features.training'),
      ],
      buttonText: t('franchises.button'),
    },
    {
      id: 'residencial',
      title: t('residential.title'),
      description: t('residential.description'),
      image:
        'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop&crop=center&q=80',
      features: [
        t('residential.features.design'),
        t('residential.features.silent'),
        t('residential.features.installation'),
      ],
      buttonText: t('residential.button'),
    },
  ];

  return (
    <section className='relative bg-white pt-8 pb-12'>
      {/* Divisor elegante com gradiente */}
      <div className='absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent'></div>

      <div className='container mx-auto px-4'>
        <div className='text-center mb-10'>
          <h2 className='text-3xl lg:text-4xl font-bold text-black mb-3'>
            {t('title1')}
            <span className='block bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent'>
              {t('title2')}
            </span>
          </h2>
          <p className='text-gray-600 max-w-2xl mx-auto'>{t('subtitle')}</p>
        </div>
      </div>

      {/* Grid de 4 cards - 2x2 */}
      <div className='w-full mb-12'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {segmentos.map((segmento) => (
              <div
                key={segmento.id}
                className='relative cursor-pointer transition-all duration-700 overflow-hidden group rounded-2xl h-[400px]'
                onClick={() => setActiveCard(activeCard === segmento.id ? null : segmento.id)}
                onMouseEnter={() => setActiveCard(segmento.id)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <img
                  src={segmento.image}
                  alt={segmento.title}
                  className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
                />

                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent'>
                  <div className='absolute inset-0 backdrop-blur-[1px]'></div>
                </div>

                <div className='absolute inset-0 flex items-end'>
                  <div className='w-full p-6'>
                    <div className='max-w-full'>
                      <h3 className='text-2xl lg:text-3xl font-bold text-white mb-3'>
                        {segmento.title}
                      </h3>
                      <p className='text-white/90 text-base mb-4 leading-relaxed'>
                        {segmento.description}
                      </p>

                      {activeCard === segmento.id && (
                        <div className='space-y-2 mb-5 animate-fadeIn'>
                          {segmento.features.map((feature, index) => (
                            <div
                              key={`segment-feature-${feature}-${index}`}
                              className='flex items-center space-x-3'
                            >
                              <div className='w-2 h-2 bg-white/80 rounded-full flex-shrink-0'></div>
                              <span className='text-white/90 text-sm'>{feature}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <Button
                        className='bg-white/15 hover:bg-white/25 text-white border-white/20 backdrop-blur-md transition-all duration-300 rounded-full px-5 py-2 text-sm font-medium shadow-lg'
                        variant='outline'
                        size='sm'
                      >
                        {segmento.buttonText}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Clientes */}
      <div className='container mx-auto px-4 py-12'>
        <div className='text-center mb-16'>
          <h3 className='text-3xl lg:text-4xl font-bold text-black mb-3'>{t('clients.title')}</h3>
          <p className='text-gray-600'>{t('clients.subtitle')}</p>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center'>
          {[
            { name: 'SmartFit', color: 'bg-green-100 text-green-700' },
            { name: 'Bio Ritmo', color: 'bg-gray-100 text-gray-700' },
            { name: 'Bluefit', color: 'bg-gray-100 text-gray-800' },
            { name: 'Formula', color: 'bg-orange-100 text-orange-700' },
            { name: 'Runner', color: 'bg-red-100 text-red-700' },
            { name: 'Fitness', color: 'bg-purple-100 text-purple-700' },
          ].map((client) => (
            <div
              key={client.name}
              className={`aspect-video ${client.color} rounded-xl border border-gray-200 flex items-center justify-center hover:opacity-80 transition-all duration-300 cursor-pointer group p-4`}
            >
              <span className='font-semibold text-sm text-center leading-tight'>{client.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
