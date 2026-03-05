'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui';
import { YouTubeFacade, extractYouTubeId } from '@/components/ui/youtube-facade';
import { APP_CONFIG } from '@/constants';
import { Equipment } from '@/types';

interface ProductVideoSectionProps {
  equipment: Equipment;
}

export function ProductVideoSection({ equipment }: ProductVideoSectionProps) {
  const t = useTranslations('product.video');
  const tCommon = useTranslations('common');

  return (
    <div className='relative h-[60vh] mb-20 w-full overflow-hidden'>
      {/* Vídeo/Imagem de fundo */}
      <div className='absolute inset-0'>
        {equipment.videos && equipment.videos.length > 0 ? (
          <YouTubeFacade
            videoId={extractYouTubeId(equipment.videos[0])}
            title={`${equipment.name} - Vídeo Demonstrativo`}
            className='w-full h-full'
            autoplay={true}
            showTitle={false}
            customThumbnail={equipment.images[0]}
          />
        ) : (
          <Image src={equipment.images[0]} alt={equipment.name} fill className='object-cover' />
        )}
      </div>

      {/* Glassmorphism overlay */}
      <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent backdrop-blur-[1px]' />

      {/* Conteúdo central como hero */}
      <div className='relative z-10 flex items-center justify-center h-full text-center'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto'>
            {/* Badge glassmorphism */}
            <div className='inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8'>
              <span className='text-white/90 text-sm font-medium'>
                {t('badge')} • {equipment.brand}
              </span>
            </div>

            <h2 className='text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight'>
              {t('title1')}
              <br />
              <span className='bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent'>
                {equipment.name}
              </span>
              <br />
              {t('title2')}
            </h2>

            <p className='text-xl lg:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto mb-10'>
              {t('subtitle')}
            </p>

            {/* Botões glassmorphism */}
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <a
                href={`https://wa.me/55${APP_CONFIG.contact.suporte.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(tCommon('agendarDemonstracao'))}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                <Button className='bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 hover:scale-105 transition-all duration-300 px-8 py-3 text-lg font-semibold shadow-2xl'>
                  {t('ctaDemo')}
                </Button>
              </a>

              <a
                href={`https://wa.me/55${APP_CONFIG.contact.comercial.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(tCommon('saberMaisEquipamentos'))}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                <Button
                  variant='outline'
                  className='bg-transparent backdrop-blur-md border-2 border-white/40 text-white hover:bg-white hover:text-black hover:scale-105 transition-all duration-300 px-8 py-3 text-lg font-semibold'
                >
                  {t('ctaContact')}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2'>
        <div className='w-6 h-10 border-2 border-white/30 rounded-full flex justify-center'>
          <div className='w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce'></div>
        </div>
      </div>
    </div>
  );
}
