'use client';

import { FileText, Download, Printer } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BLUE_LINE_PRODUCTS } from '@/constants/product-lines/blue-line-config';
import { MUSCULACAO_PRODUCTS } from '@/constants/product-lines/musculacao-config';
import { RED_LINE_PRODUCTS } from '@/constants/product-lines/red-line-config';
import { DocumentPreview } from './DocumentPreview';
import { ProductSelector } from './ProductSelector';
import { SimplePDFGenerator } from './SimplePDFGenerator';

// Importar configurações dos produtos

// Combinar todos os produtos
const ALL_PRODUCTS = {
  ...RED_LINE_PRODUCTS,
  ...BLUE_LINE_PRODUCTS,
  ...MUSCULACAO_PRODUCTS,
};

export function DocumentacaoTecnicaClient() {
  const t = useTranslations('documentacao-tecnica');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'preview' | 'pdf'>('preview');

  const selectedProduct = selectedProductId
    ? ALL_PRODUCTS[selectedProductId as keyof typeof ALL_PRODUCTS]
    : null;

  const handleGeneratePDF = () => {
    if (!selectedProduct || !selectedProductId) return;

    // Implementar geração de PDF
    console.log('Generating PDF for:', selectedProductId);
  };

  return (
    <div className='min-h-screen bg-white'>
      <div className='container mx-auto px-6 py-12'>
        {/* Header Minimalista */}
        <div className='mb-16'>
          <div className='flex items-center gap-4 mb-6'>
            <div className='w-8 h-8 border border-gray-300 rounded flex items-center justify-center'>
              <FileText className='h-4 w-4 text-gray-600' />
            </div>
            <div>
              <h1 className='text-3xl font-light text-black tracking-tight'>{t('title')}</h1>
              <p className='text-sm text-gray-600 mt-1'>{t('subtitle')}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* Left Sidebar - Product Selection */}
          <div className='lg:col-span-1'>
            <Card className='border border-gray-200 bg-white'>
              <CardHeader className='pb-4'>
                <CardTitle className='text-sm font-medium text-black uppercase tracking-wide'>
                  {t('selection.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className='p-6 pt-0'>
                <ProductSelector
                  products={ALL_PRODUCTS}
                  selectedProductId={selectedProductId}
                  onProductSelect={setSelectedProductId}
                />

                {selectedProduct && (
                  <div className='mt-8 pt-6 border-t border-gray-200'>
                    <div className='flex items-center justify-between mb-4'>
                      <h3 className='text-sm font-medium text-black'>{t('actions.title')}</h3>
                      <Badge variant='secondary' className='bg-gray-100 text-gray-700 text-xs'>
                        {t('status.ready')}
                      </Badge>
                    </div>

                    <div className='space-y-3'>
                      <Select
                        value={viewMode}
                        onValueChange={(value: 'preview' | 'pdf') => setViewMode(value)}
                      >
                        <SelectTrigger className='w-full border-gray-300'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='preview'>{t('actions.preview')}</SelectItem>
                          <SelectItem value='pdf'>
                            <div className='flex items-center gap-2'>
                              <span>Gerar PDF Profissional</span>
                              <Badge
                                variant='secondary'
                                className='text-xs bg-green-100 text-green-700'
                              >
                                Funciona
                              </Badge>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        onClick={handleGeneratePDF}
                        className='w-full bg-black hover:bg-gray-800 text-white'
                      >
                        <Download className='h-4 w-4 mr-2' />
                        {t('actions.download')}
                      </Button>

                      <Button variant='outline' className='w-full border-gray-300 hover:bg-gray-50'>
                        <Printer className='h-4 w-4 mr-2' />
                        {t('actions.print')}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Content - Preview/PDF */}
          <div className='lg:col-span-3'>
            <Card className='border border-gray-200 bg-white min-h-[700px]'>
              <CardContent className='p-0'>
                {selectedProduct && selectedProductId ? (
                  <>
                    {viewMode === 'preview' ? (
                      <DocumentPreview product={selectedProduct} productId={selectedProductId} />
                    ) : (
                      <SimplePDFGenerator product={selectedProduct} productId={selectedProductId} />
                    )}
                  </>
                ) : (
                  <div className='flex items-center justify-center h-96 text-center'>
                    <div className='max-w-md'>
                      <div className='w-16 h-16 border-2 border-dashed border-gray-300 rounded mx-auto mb-4 flex items-center justify-center'>
                        <FileText className='h-8 w-8 text-gray-400' />
                      </div>
                      <h3 className='text-lg font-light text-black mb-2'>{t('empty.title')}</h3>
                      <p className='text-sm text-gray-600'>{t('empty.description')}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
