'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { APP_CONFIG } from '@/constants';
import { useEquipmentTranslations } from '@/hooks/useEquipmentTranslations';
import { useQuoteTracking } from '@/hooks/useQuoteTracking';
import { Button } from './button';

interface ProductCardProps {
  id: string | number;
  name: string;
  category?: string;
  brand?: string;
  image: string;
  description?: string;
  href: string;
  ctaText?: string;
  className?: string;
  onQuoteClick?: () => void;
  productId?: string;
  pageType?: 'normal' | 'seo' | 'landing';
}

export function ProductCard({
  name,
  category,
  image,
  description,
  href,
  ctaText,
  className,
  onQuoteClick,
  productId,
  pageType = 'normal',
}: ProductCardProps) {
  const t = useTranslations('common');
  const { translateCategory } = useEquipmentTranslations();
  const { trackQuoteClick } = useQuoteTracking({
    productId,
    productName: name,
    pageType,
    actionType: 'whatsapp', // Clique em WhatsApp
  });

  const translatedCategory = category ? translateCategory(category) : t('equipment');

  // Função para abrir WhatsApp com mensagem personalizada
  const handleWhatsAppClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Trackar clique
    await trackQuoteClick();

    const phoneNumber = APP_CONFIG.contact.comercial.whatsapp.replace(/\D/g, '');
    const message = `${t('solicitarOrcamento')} *${name}*${category ? ` (${translatedCategory})` : ''}.`;
    const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Link
      href={href as any}
      className={`group block relative bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 transition-all duration-500 h-[420px] flex flex-col ${className}`}
    >
      {/* Imagem do Produto - ajuste profissional para não cortar */}
      <div className='relative h-56 bg-white overflow-hidden flex-shrink-0'>
        <div className='absolute inset-0 p-4 sm:p-6'>
          <div className='relative w-full h-full transition-transform duration-700 ease-out group-hover:scale-105'>
            <Image
              src={image}
              alt={name}
              fill
              className='object-contain'
              sizes='(min-width: 1024px) 320px, 100vw'
            />
          </div>
        </div>
        {/* Badge da Categoria */}
        <div className='absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full border border-gray-200/50'>
          <span className='text-gray-600 text-xs font-light'>{translatedCategory}</span>
        </div>
      </div>

      {/* Conteúdo do Card */}
      <div className='p-4 flex flex-col flex-1 cursor-pointer'>
        {/* Linha Divisória */}
        <div className='w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-2'></div>

        {/* Nome do Produto */}
        <div className='space-y-1 flex-1'>
          {(() => {
            // Função para capitalizar primeira letra de cada palavra
            const capitalize = (str: string) => {
              if (!str) return str;
              return str
                .split(' ')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
            };
            
            const nameParts = name.split(' - ');
            
            // Extrair o modelo do nome
            let productName = '';
            let technicalName = '';
            
            if (nameParts.length === 2) {
              productName = nameParts[0];
              technicalName = nameParts[1];
            } else {
              // Se não tem separador, tentar extrair modelo do nome
              productName = name;
              // Tentar encontrar padrão de modelo (PR014, PR012, etc.) no nome
              const modelMatch = name.match(/\b(PR\d+[A-Z]*)\b/i);
              if (modelMatch) {
                technicalName = modelMatch[1].toUpperCase();
                // Remover o modelo do nome do produto (com ou sem hífen antes)
                productName = name.replace(/\s*-\s*PR\d+[A-Z]*|\s+PR\d+[A-Z]*/i, '').trim();
              }
            }
            
            return (
              <>
                <h3 className='text-lg font-semibold text-gray-800 group-hover:text-gray-900 transition-colors line-clamp-2'>
                  {capitalize(productName)}
                </h3>
                {technicalName && (
                  <p className='text-sm font-medium text-gray-500 group-hover:text-gray-600 transition-colors'>
                    {technicalName}
                  </p>
                )}
              </>
            );
          })()}
          <p className='text-gray-600 text-base line-clamp-2 min-h-[1.5rem] mt-2'>{description || ''}</p>
        </div>

        {/* Botões de Ação */}
        <div className='flex space-x-3 pt-3 mt-auto'>
          <Button
            size='sm'
            className='flex-1 bg-gray-400 text-white hover:bg-gray-500 transition-all duration-300'
          >
            {ctaText || t('verDetalhes')}
          </Button>
          {/* Botão WhatsApp como elemento separado para evitar conflitos */}
          <button
            type='button'
            className='h-8 w-8 px-0 border border-green-300 text-green-600 hover:bg-green-50 hover:border-green-400 hover:text-green-700 transition-all duration-300 rounded-md inline-flex items-center justify-center text-sm font-medium'
            onClick={onQuoteClick || handleWhatsAppClick}
            aria-label={`Solicitar orçamento via WhatsApp: ${name}`}
            title='Solicitar orçamento via WhatsApp'
          >
            {/* Ícone do WhatsApp */}
            <svg className='w-3.5 h-3.5' fill='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
              <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488' />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
}

export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-2xl overflow-hidden animate-pulse h-[420px] ${className}`}
    >
      <div className='h-56 bg-gray-200 relative'>
        <div className='absolute top-2 right-2 bg-white/80 rounded-full w-12 h-5 border border-gray-200'></div>
      </div>
      <div className='p-4 space-y-3'>
        <div className='w-full h-px bg-gray-200 my-2'></div>
        <div className='space-y-1'>
          <div className='h-4 bg-gray-200 rounded' />
          <div className='h-3 bg-gray-200 rounded w-3/4' />
        </div>
        <div className='flex space-x-3 mt-auto'>
          <div className='h-10 bg-gray-200 rounded flex-1' />
          <div className='h-10 bg-gray-200 rounded w-12' />
        </div>
      </div>
    </div>
  );
}
