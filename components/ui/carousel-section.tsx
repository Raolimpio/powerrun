'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Carousel } from './carousel';

export function CarouselSection() {
  const t = useTranslations('home.carousel');
  const router = useRouter();

  const carouselItems = [
    {
      id: 1,
      name: t('esteiras.name'),
      description: t('esteiras.description'),
      image:
        'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756370716/Design_sem_nome_-_2025-08-28T054416.290_ynmnv5.png', // Esteiras
      url: '/equipamentos?search=esteira',
    },
    {
      id: 2,
      name: t('bicicletas.name'),
      description: t('bicicletas.description'),
      image:
        'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756370762/Design_sem_nome_-_2025-08-28T054406.646_l3nxiw.png', // Bicicletas
      url: '/equipamentos?search=bicicleta',
    },
    {
      id: 3,
      name: t('elipticos.name'),
      description: t('elipticos.description'),
      image: 'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756370302/14_tcwyh3.png', // Power Round 550 - imagem de detalhe masonry
      url: '/equipamentos?search=elíptico',
    },
    {
      id: 4,
      name: t('simulador-escada.name'),
      description: t('simulador-escada.description'),
      image: 'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756367750/36_gdmnf8.png', // Escada PR600 - imagem masonry
      url: '/equipamentos?search=escada',
    },
    {
      id: 5,
      name: t('musculacao.name'),
      description: t('musculacao.description'),
      image:
        'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756370861/Design_sem_nome_-_2025-08-28T054712.498_idvjzy.png', // Musculação
      url: '/equipamentos?categoria=musculacao',
    },
  ];
  return (
    <section className='bg-white pt-20 pb-8 w-full overflow-hidden'>
      {/* Full Width - sem container limitado */}
      <div
        className='w-full px-4 sm:px-6 lg:px-8'
        style={{
          backgroundColor: 'white',
          margin: 0,
        }}
      >
        <Carousel items={carouselItems} onCardClick={(url) => router.push(url as any)} />
      </div>
    </section>
  );
}
