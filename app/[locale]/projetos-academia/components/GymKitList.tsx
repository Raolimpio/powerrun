'use client';

import { Activity, Building2, Users, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { CloudinaryImage } from '@/components/performance/CloudinaryImage';
import { Button } from '@/components/ui';
import { APP_CONFIG } from '@/constants';
import { MOCK_EQUIPMENT } from '@/constants/equipment-data';
import type { GymKit } from '@/constants/gym-kits';

interface GymKitListProps {
  kits: GymKit[];
}

export function GymKitList({ kits }: GymKitListProps) {
  return (
    <div className='space-y-10 py-4'>
      {kits.map((kit) => {
        const enrichedItems = kit.items.map((item) => {
          const equipment = MOCK_EQUIPMENT.find((eq) => eq.id === item.productId);
          return { item, equipment };
        });

        const totalEquip = enrichedItems.reduce(
          (acc, { item, equipment }) => (equipment ? acc + item.quantity : acc),
          0
        );

        const cardioEquip = enrichedItems.filter(
          ({ equipment }) => equipment && equipment.category !== 'musculacao'
        );
        const musculacaoEquip = enrichedItems.filter(
          ({ equipment }) => equipment && equipment.category === 'musculacao'
        );

        const cardioCount = cardioEquip.reduce((acc, { item }) => acc + item.quantity, 0);
        const musculacaoCount = musculacaoEquip.reduce((acc, { item }) => acc + item.quantity, 0);

        const destaqueNomes = enrichedItems
          .filter(({ equipment }) => equipment)
          .slice(0, 2)
          .map(({ item, equipment }) => `${item.quantity}x ${equipment!.name}`);

        return (
          <section
            key={kit.id}
            id={kit.slug}
            className='bg-white rounded-3xl border border-gray-100 p-6 md:p-8 space-y-5'
          >
            {/* Topo: texto à esquerda, CTA à direita */}
            <div className='flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
              <div className='space-y-3 max-w-2xl'>
                <div className='flex items-center gap-3'>
                  <span className='bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold border border-primary/20'>
                    {kit.area}
                  </span>
                  {kit.highlight && (
                    <span className='bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold border border-amber-200 flex items-center gap-1'>
                      <Activity className='w-3 h-3' /> Recomendado
                    </span>
                  )}
                </div>
                <div>
                  <h3 className='text-xl md:text-2xl font-bold text-gray-900'>{kit.title}</h3>
                  <p className='text-sm md:text-base text-primary font-medium mt-1'>
                    {kit.subtitle}
                  </p>
                </div>
                <p className='text-sm md:text-base text-gray-600 leading-relaxed'>
                  {kit.description}
                </p>

                {/* Bloco de ambiente e benefícios em colunas com ícones */}
                <div className='grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 text-xs md:text-sm text-gray-700'>
                  <div className='flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 h-full'>
                    <div className='mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900 text-white flex-shrink-0'>
                      <Building2 className='w-4 h-4' />
                    </div>
                    <div className='space-y-1'>
                      <p className='font-semibold text-gray-900'>Ambiente ideal</p>
                      <p className='text-[11px] md:text-xs text-gray-600 leading-relaxed'>
                        Pensado para <span className='font-medium'>{kit.idealFor.join(', ')}</span>{' '}
                        em áreas de {kit.area}.
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 h-full'>
                    <div className='mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900 text-white flex-shrink-0'>
                      <Users className='w-4 h-4' />
                    </div>
                    <div className='space-y-1'>
                      <p className='font-semibold text-gray-900'>Composição e fluxo</p>
                      <p className='text-[11px] md:text-xs text-gray-600 leading-relaxed'>
                        {totalEquip} equipamentos no total, combinando{' '}
                        {cardioCount > 0 && musculacaoCount > 0
                          ? `${cardioCount} de cardio e ${musculacaoCount} de musculação`
                          : `${totalEquip} posições de treino`}{' '}
                        para atender diferentes perfis de usuários.
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 h-full'>
                    <div className='mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900 text-white flex-shrink-0'>
                      <ShieldCheck className='w-4 h-4' />
                    </div>
                    <div className='space-y-1'>
                      <p className='font-semibold text-gray-900'>Destaques do kit</p>
                      <p className='text-[11px] md:text-xs text-gray-600 leading-relaxed'>
                        {destaqueNomes.length
                          ? `Inclui ${destaqueNomes.join(' e ')} entre outros equipamentos Power Run.`
                          : 'Composição configurada apenas com equipamentos oficiais Power Run.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex flex-col gap-3 items-stretch md:items-end'>
                <div className='bg-gray-50 rounded-xl border border-gray-100 px-4 py-3 text-xs md:text-sm max-w-xs space-y-1.5'>
                  <div>
                    <p className='font-semibold text-gray-900 mb-0.5'>Ideal para:</p>
                    <p className='text-gray-700'>{kit.idealFor.join(' • ')}</p>
                  </div>
                  <p className='text-[11px] text-emerald-700 font-medium'>
                    Disponível para <span className='font-semibold'>venda</span> e{' '}
                    <span className='font-semibold'>locação</span>.
                  </p>
                </div>
                <Button
                  size='sm'
                  className='bg-green-600 hover:bg-green-700 text-white px-4 h-9 text-xs md:text-sm'
                  asChild
                >
                  <a
                    href={`https://wa.me/55${APP_CONFIG.contact.comercial.whatsapp.replace(/\D/g, '')}?text=Olá, gostaria de uma proposta de *venda ou locação* para o kit *${kit.title}* (${kit.area}).`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    Solicitar proposta (venda / locação)
                  </a>
                </Button>
              </div>
            </div>

            {/* Abaixo de tudo: cards de produtos do kit */}
            <div className='border-t border-gray-100 pt-4 space-y-2'>
              <p className='font-semibold text-gray-900 mb-1 text-xs md:text-sm'>
                Composição do kit
              </p>
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
                {enrichedItems.map(({ item, equipment }) => {
                  if (!equipment) return null;

                  const name = equipment.name;
                  const secondary = equipment.model || equipment.category || equipment.id;

                  return (
                    <Link
                      key={`${kit.id}-${item.productId}`}
                      href={`/equipamentos/${equipment.id}` as any}
                      className='rounded-xl border border-gray-200 bg-gray-50 px-2 py-2 text-[11px] leading-snug hover:border-gray-300 hover:bg-gray-100 transition-colors'
                    >
                      <div className='flex items-center gap-2'>
                        <div className='relative w-14 h-12 rounded-lg overflow-hidden bg-white border border-gray-200 flex-shrink-0'>
                          <CloudinaryImage
                            src={equipment.images[0]}
                            alt={name}
                            fill
                            className='object-contain'
                            sizes='80px'
                          />
                        </div>
                        <div className='min-w-0 flex-1'>
                          <p className='font-semibold text-gray-900 line-clamp-2'>
                            {item.quantity}x {name}
                          </p>
                          <p className='text-gray-500 mt-0.5 text-[10px] line-clamp-1'>
                            {secondary}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
              {kit.accessories && kit.accessories.length > 0 && (
                <div className='border-t border-gray-100 pt-4 mt-4 space-y-2'>
                  <p className='font-semibold text-gray-900 mb-1 text-xs md:text-sm'>
                    Acessórios incluídos
                  </p>
                  <ul className='list-disc list-inside text-xs md:text-sm text-gray-700 space-y-1'>
                    {kit.accessories.map((acc, i) => (
                      <li key={i}>{acc}</li>
                    ))}
                  </ul>
                </div>
              )}
              <p className='text-[11px] text-gray-500 mt-1'>
                *Composição sugerida. Podemos substituir modelos e ajustar quantidades conforme o
                perfil do seu público.
              </p>
            </div>
          </section>
        );
      })}
    </div>
  );
}
