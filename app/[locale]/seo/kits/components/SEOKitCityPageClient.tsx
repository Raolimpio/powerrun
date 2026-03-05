'use client';

import { Zap, Sparkles } from 'lucide-react';
import { useMemo } from 'react';
import { MainLayout } from '@/components/layout';
import { CloudinaryImage } from '@/components/performance/CloudinaryImage';
import { Button } from '@/components/ui';
import { APP_CONFIG } from '@/constants';
import { MOCK_EQUIPMENT } from '@/constants/equipment-data';
import { GYM_KITS } from '@/constants/gym-kits';
import { useQuoteTracking } from '@/hooks/useQuoteTracking';
import type { InternationalCity } from '@/services/international-cities-full';
import { GymKitList } from '../../../projetos-academia/components/GymKitList';
import { LineEquipmentCarousel } from '../../../projetos-academia/components/LineEquipmentCarousel';

interface SEOKitCityPageClientProps {
  line: 'red' | 'blue';
  city: InternationalCity;
  keyword: string;
}

export function SEOKitCityPageClient({ line, city, keyword }: SEOKitCityPageClientProps) {
  const decodedKeyword = keyword.replace(/-/g, ' ');

  const { kits, equipments, heroConfig } = useMemo(() => {
    const allKits = GYM_KITS;

    const kitEquipmentIds = Array.from(
      new Set(allKits.flatMap((kit) => kit.items.map((item) => item.productId)))
    );

    const equipmentsForLine = MOCK_EQUIPMENT.filter((eq) => kitEquipmentIds.includes(eq.id));

    const heroConfig =
      line === 'red'
        ? {
            badgeLabel: 'PROJETOS RED LINE PARA CONDOMÍNIOS',
            title: 'Academias compactas de alto fluxo para condomínios',
            subtitle:
              'Kits Red Line com esteiras, bikes, elíptico e musculação profissional pensados para áreas de 20 a 30 m².',
            bannerUrl:
              'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756363528/Design_sem_nome_-_2025-08-28T034501.828_wrvqwr.png',
            primaryColor: '#ef4444',
          }
        : {
            badgeLabel: 'PROJETOS BLUE LINE PARA CONDOMÍNIOS PREMIUM',
            title: 'Studios e academias premium em áreas de condomínio',
            subtitle:
              'Kits Blue Line com esteiras, escadas, elípticos e bikes premium para espaços de 20 a 40 m².',
            bannerUrl:
              'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756335223/Design_sem_nome_-_2025-08-27T195336.831_cxy6pq.png',
            primaryColor: '#61fbfe',
          };

    return { kits: allKits, equipments: equipmentsForLine, heroConfig };
  }, [line]);

  const productId = line === 'red' ? 'kits-red-line' : 'kits-blue-line';
  const productName = 'Kits de academia para condomínios';

  const { trackQuoteClick } = useQuoteTracking({
    productId,
    productName,
    citySlug: city.slug,
    cityName: city.fullName,
    keyword: decodedKeyword,
    pageType: 'seo',
    actionType: 'whatsapp',
  });

  const handleWhatsAppClick = async () => {
    await trackQuoteClick();

    const phoneNumber = APP_CONFIG.contact.comercial.whatsapp.replace(/\D/g, '');
    const message = `Olá, estou em ${city.fullName} e estou buscando ${decodedKeyword} com os ${productName}.`;
    const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <MainLayout title={productName}>
      {/* HERO SEO DE KITS POR CIDADE */}
      <section className='relative min-h-[80vh] sm:min-h-[85vh] overflow-hidden bg-black text-white'>
        <div className='absolute inset-0 w-full h-full'>
          <CloudinaryImage
            src={heroConfig.bannerUrl}
            alt={`${productName} em ${city.fullName}`}
            fill
            className='object-cover min-h-full min-w-full'
            priority
            fetchPriority='high'
            quality={85}
            sizes='100vw'
          />
          <div className='absolute inset-0 bg-gradient-to-r from-black via-black/95 to-black/70' />
          <div className='absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70' />
        </div>

        <div className='relative z-10 min-h-[80vh] sm:min-h-[85vh] flex items-center pt-24 pb-12'>
          <div className='container mx-auto px-4 sm:px-6'>
            <div className='max-w-3xl space-y-5'>
              <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/20 backdrop-blur-sm text-xs sm:text-sm font-semibold tracking-wide'>
                <span
                  className='h-2 w-2 rounded-full'
                  style={{ backgroundColor: heroConfig.primaryColor }}
                />
                <span>{heroConfig.badgeLabel}</span>
              </div>

              <h1 className='text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight'>
                {heroConfig.title}
                <br />
                <span className='text-gray-200 text-xl sm:text-2xl lg:text-3xl font-semibold'>
                  {city.fullName}
                </span>
              </h1>

              <p className='text-sm sm:text-base lg:text-lg text-white/80 leading-relaxed'>
                {heroConfig.subtitle}{' '}
                <span className='text-white'>
                  Foco em {decodedKeyword} para síndicos, construtoras e administradoras que
                  precisam comprovar resultado.
                </span>
              </p>

              <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2'>
                <Button
                  size='lg'
                  className='w-full sm:w-auto bg-white text-black hover:bg-gray-100 font-semibold rounded-full px-6'
                  onClick={() =>
                    document
                      .getElementById('kits-line')
                      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                >
                  <Zap className='w-4 h-4 mr-2' />
                  Ver kits para este condomínio
                </Button>
                <Button
                  size='lg'
                  variant='outline'
                  className='w-full sm:w-auto border-white/70 text-white hover:bg-white/10 rounded-full px-6'
                  onClick={handleWhatsAppClick}
                >
                  <Sparkles className='w-4 h-4 mr-2' />
                  Falar com especialista
                </Button>
              </div>

              <div className='grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 text-xs sm:text-sm text-white/80'>
                <div>
                  <p className='font-semibold'>Cidade alvo</p>
                  <p className='text-white/70'>{city.fullName}</p>
                </div>
                <div>
                  <p className='font-semibold'>Foco do projeto</p>
                  <p className='text-white/70 capitalize'>{decodedKeyword}</p>
                </div>
                <div className='hidden sm:block'>
                  <p className='font-semibold'>Kits</p>
                  <p className='text-white/70'>BASIC a Premium (30 a 150 m²)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CARROSSEL DE EQUIPAMENTOS DA LINHA */}
      <section className={line === 'red' ? 'bg-white' : 'bg-gray-50'}>
        <div className='container mx-auto px-4 pb-10 pt-10'>
          <LineEquipmentCarousel
            title='Equipamentos que compõem os kits'
            subtitle='Cardio e musculação Power Run presentes nas sugestões oficiais para academias de 30 a 150 m².'
            equipments={equipments}
          />
        </div>
      </section>

      {/* LISTA DE KITS PARA A LINHA */}
      <section
        id='kits-line'
        className={line === 'red' ? 'bg-white pb-16 pt-4' : 'bg-gray-50 pb-16 pt-4'}
      >
        <div className='container mx-auto px-4'>
          <div className='mb-8 text-left max-w-3xl'>
            <h2 className='text-2xl lg:text-3xl font-bold text-gray-900 mb-2'>
              Kits de academia para condomínios em {city.name}
            </h2>
            <p className='text-gray-600 text-sm md:text-base'>
              Os kits abaixo são composições sugeridas usando apenas equipamentos oficiais Power
              Run. Ajustamos modelos e quantidades de acordo com o padrão do seu condomínio, fluxo
              de moradores e especificações do projeto.
            </p>
          </div>
          <GymKitList kits={kits} />
        </div>
      </section>
    </MainLayout>
  );
}
