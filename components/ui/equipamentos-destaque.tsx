'use client';

import { useTranslations } from 'next-intl';
import { MOCK_EQUIPMENT } from '@/constants';
import type { Equipment } from '@/types';
import { EquipmentCard } from './equipment-card';

const getEquipmentById = (id: string): Equipment | undefined =>
  MOCK_EQUIPMENT.find((eq) => eq.id === id);

const isDefined = (eq: Equipment | undefined): eq is Equipment => Boolean(eq);

export function EquipamentosDestaque() {
  const t = useTranslations('home.featured');

  // Linha 1 - RED LINE: Escada, Esteira PR5000 Series, Bike
  const redLineEquipments: Equipment[] = [
    getEquipmentById('escada-pr600'),
    getEquipmentById('esteira-pr5000'),
    getEquipmentById('bike-vertical-pr300'),
  ].filter(isDefined);

  // Linha 2 - BLUE LINE: Esteira PR7000 Series, Escada, Bike Spinning
  const blueLineEquipments: Equipment[] = [
    getEquipmentById('power-race-7000'),
    getEquipmentById('power-rise-650'),
    getEquipmentById('power-rush-250'),
  ].filter(isDefined);

  // Linha 3 - MUSCULAÇÃO: MultiGym, Polia Superior, Cadeira Adutora/Abdutora
  const musculacaoEquipments: Equipment[] = [
    getEquipmentById('multi-gym-pr012'),
    getEquipmentById('pr002-polia-superior-remada'),
    getEquipmentById('pr006-cadeira-adutora-abdutora'),
  ].filter(isDefined);

  const featuredRows = [
    {
      id: 'red-line',
      title: 'Red Line',
      subtitle: 'Escada, esteira PR5000 Series e bike para cardio intenso.',
      equipments: redLineEquipments,
    },
    {
      id: 'blue-line',
      title: 'Blue Line',
      subtitle: 'Esteira PR7000 Series, escada premium e bike spinning.',
      equipments: blueLineEquipments,
    },
    {
      id: 'musculacao',
      title: 'Musculação',
      subtitle: 'Multigym, polia superior e cadeira adutora/abdutora.',
      equipments: musculacaoEquipments,
    },
  ].filter((row) => row.equipments.length > 0);

  return (
    <section
      id='equipamentos-destaque'
      className='relative bg-white pt-8 pb-12'
      style={{ scrollMarginTop: '100px' }}
    >
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

        <div className='space-y-10'>
          {featuredRows.map((row) => (
            <div key={row.id} className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-2xl lg:text-3xl font-semibold text-black'>{row.title}</h3>
                  <p className='text-sm text-gray-600'>{row.subtitle}</p>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                {row.equipments.map((equipment) => (
                  <EquipmentCard key={equipment.id} equipment={equipment} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
