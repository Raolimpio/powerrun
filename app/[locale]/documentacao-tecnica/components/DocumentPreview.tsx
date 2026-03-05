'use client';

import { CheckCircle, FileText, Settings, Info } from 'lucide-react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface Product {
  name: string;
  commercialDescription: string;
  commercialDescriptionEN?: string;
  commercialDescriptionES?: string;
  commercialDescriptionZH?: string;
  category: string;
  features: string[];
  specifications: Record<string, string>;
}

interface DocumentPreviewProps {
  product: any;
  productId: string;
}

export function DocumentPreview({ product }: DocumentPreviewProps) {
  const t = useTranslations('documentacao-tecnica');
  const locale = useLocale();

  // Função para obter a descrição no idioma correto
  const getLocalizedDescription = (product: Product) => {
    switch (locale) {
      case 'en':
        return product.commercialDescriptionEN || product.commercialDescription;
      case 'es':
        return product.commercialDescriptionES || product.commercialDescription;
      case 'zh-CN':
        return product.commercialDescriptionZH || product.commercialDescription;
      default:
        return product.commercialDescription;
    }
  };

  return (
    <ScrollArea className='h-[600px]'>
      <div className='p-8 bg-white'>
        {/* Header with Logo */}
        <div className='flex items-center justify-between mb-8 pb-6 border-b border-slate-200'>
          <div className='flex items-center gap-4'>
            <Image
              src='/Logo PowerRun.png'
              alt='Power Run'
              width={120}
              height={40}
              className='h-10 w-auto'
            />
            <div className='h-8 w-px bg-slate-300' />
            <div>
              <h1 className='text-sm font-medium text-slate-600 uppercase tracking-wide'>
                {t('document.title')}
              </h1>
              <p className='text-xs text-slate-500' suppressHydrationWarning>
                {t('document.version')} 1.0 | {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
          <Badge variant='outline' className='bg-blue-50 text-blue-700 border-blue-200'>
            <FileText className='h-3 w-3 mr-1' />
            {t('document.technical')}
          </Badge>
        </div>

        {/* Product Title */}
        <div className='mb-8'>
          <h2 className='text-3xl font-bold text-slate-900 mb-3'>{product.name}</h2>
          <p className='text-lg text-slate-600 leading-relaxed'>
            {getLocalizedDescription(product)}
          </p>
        </div>

        {/* Product Image Placeholder */}
        <div className='mb-8 rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200'>
          <div className='aspect-video flex items-center justify-center'>
            <div className='text-center'>
              <div className='w-16 h-16 bg-slate-300 rounded-lg flex items-center justify-center mx-auto mb-3'>
                <Settings className='h-8 w-8 text-slate-500' />
              </div>
              <p className='text-slate-500 font-medium'>{t('document.imageComingSoon')}</p>
              <p className='text-xs text-slate-400'>{product.name}</p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className='mb-8'>
          <div className='flex items-center gap-2 mb-4'>
            <CheckCircle className='h-5 w-5 text-green-600' />
            <h3 className='text-xl font-semibold text-slate-900'>{t('document.features')}</h3>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            {product.features.map((feature: string, index: number) => (
              <div key={index} className='flex items-start gap-2 p-3 bg-slate-50 rounded-lg'>
                <CheckCircle className='h-4 w-4 text-green-600 flex-shrink-0 mt-0.5' />
                <span className='text-sm text-slate-700'>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator className='my-8' />

        {/* Technical Specifications */}
        <div>
          <div className='flex items-center gap-2 mb-6'>
            <Info className='h-5 w-5 text-blue-600' />
            <h3 className='text-xl font-semibold text-slate-900'>{t('document.specifications')}</h3>
          </div>
          <div className='space-y-1'>
            {Object.entries(product.specifications).map(([key, value], index) => (
              <div
                key={index}
                className={`grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg ${
                  index % 2 === 0 ? 'bg-slate-50' : 'bg-white'
                }`}
              >
                <div className='md:col-span-1'>
                  <dt className='font-medium text-slate-900'>{key}</dt>
                </div>
                <div className='md:col-span-2'>
                  <dd className='text-slate-700'>{String(value)}</dd>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className='mt-12 pt-6 border-t border-slate-200 text-center'>
          <p className='text-xs text-slate-500' suppressHydrationWarning>
            {t('document.footer.generated')} {new Date().toLocaleString()} |
            {t('document.footer.copyright')} Power Run
          </p>
        </div>
      </div>
    </ScrollArea>
  );
}
