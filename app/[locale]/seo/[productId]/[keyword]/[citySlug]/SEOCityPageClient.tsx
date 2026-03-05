'use client';

import Link from 'next/link';
import { MainLayout } from '@/components/layout';
import { Button, EquipmentCard } from '@/components/ui';
import { BenefitBadges } from '@/components/seo/BenefitBadges';
import { CTASection } from '@/components/seo/CTASection';
import { APP_CONFIG } from '@/constants';
import { getProductLineConfig } from '@/constants/product-line-mapping';
import { useQuoteTracking } from '@/hooks/useQuoteTracking';
import { Equipment } from '@/types';
import type { InternationalCity } from '@/services/international-cities-full';
import type { StaticCity } from '@/data/cities-static-max';
import RelatedCitiesLinks from '@/components/seo/RelatedCitiesLinks';

interface SEOCityPageTranslations {
  // Breadcrumb
  breadcrumbHome: string;
  equipamentos: string;
  
  // SEO Content
  titleIn: string;
  verDetalhesCompletos: string;
  solicitarOrcamento: string;
  imagemNaoDisponivel: string;
  whatsappMessage: string;
  
  // SEO Sections
  title: string;
  searchingFor: string;
  powerRunDescription: string;
  powerRunDescriptionExport: string;
  whyChooseTitle: string;
  
  // Benefits
  benefitNational: string;
  benefitNationalExport: string;
  benefitNationalDesc: string;
  benefitNationalDescExport: string;
  benefitQuality: string;
  benefitQualityExport: string;
  benefitQualityDesc: string;
  benefitQualityDescExport: string;
  benefitDelivery: string;
  benefitDeliveryExport: string;
  benefitDeliveryDesc: string;
  benefitDeliveryDescExport: string;
  benefitSupport: string;
  benefitSupportDesc: string;
  benefitWarranty: string;
  benefitWarrantyExport: string;
  benefitWarrantyDesc: string;
  benefitWarrantyDescExport: string;
  
  // Other sections
  specificationsTitle: string;
  requestQuoteTitle: string;
  requestQuoteDescription: string;
  otherEquipmentsTitle: string;
}

interface SEOCityPageClientProps {
  equipment: Equipment;
  city: InternationalCity;
  keyword: string;
  relatedEquipments: Equipment[];
  locale: string;
  translations: SEOCityPageTranslations;
  allCities: StaticCity[];
}

export default function SEOCityPageClient({
  equipment,
  city,
  keyword,
  relatedEquipments,
  locale,
  translations,
  allCities,
}: SEOCityPageClientProps) {
  // ✅ EQUIPAMENTO JÁ VEM TRADUZIDO DO SERVIDOR
  // ✅ TRADUÇÕES JÁ VÊM DO SERVIDOR
  // Não usar useTranslations ou useLocale para evitar hydration mismatch
  const translatedEquipment = equipment;

  // Decodificar keyword
  const decodedKeyword = keyword.replace(/-/g, ' ');

  // Configuração da linha de produto
  const productLineConfig = getProductLineConfig(equipment.id);
  const colors = productLineConfig.colors;

  // Verificar se é exportação (não é Brasil)
  const isExport = city.countryCode !== 'BR';

  // Tracking de cliques em orçamentos
  const { trackQuoteClick } = useQuoteTracking({
    productId: equipment.id,
    productName: translatedEquipment.name,
    citySlug: city.slug,
    cityName: city.name,
    keyword: decodedKeyword,
    pageType: 'seo',
    actionType: 'whatsapp', // Clique em WhatsApp
  });

  const handleQuoteClick = async () => {
    await trackQuoteClick();
  };

  // Breadcrumb items - usando valores traduzidos do servidor
  const breadcrumbItems: Array<{ name: string; url: string }> = [
    { name: translations.breadcrumbHome, url: `/${locale}` },
    { name: translations.equipamentos, url: `/${locale}/equipamentos` },
    { name: translatedEquipment.name, url: `/${locale}/equipamentos/${equipment.id}` },
    { name: `${city.name} - ${city.stateCode}`, url: '#' },
  ];

  return (
    <MainLayout>

      <div className='bg-gray-50'>
        {/* Hero Section com Banner - Otimizado para Mobile */}
        <section className='relative min-h-[60vh] sm:min-h-[65vh] md:min-h-[75vh] overflow-hidden bg-black shadow-2xl'>
          {/* Imagem de Fundo */}
          <div className='absolute inset-0 w-full h-full'>
            {equipment.images?.[0] ? (
              <img
                src={translatedEquipment.images[0]}
                alt={`${translatedEquipment.name} ${translations.titleIn} ${city.fullName}`}
                className='w-full h-full object-cover opacity-50'
                style={{
                  objectPosition: '50% 50%',
                  transform: 'scale(1.05)',
                }}
                onError={(e) => {
                  console.error('[SEO Page] Erro ao carregar imagem de fundo:', translatedEquipment.images[0]);
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className='w-full h-full bg-gradient-to-br from-gray-900 to-black' />
            )}
          </div>

          {/* Overlay Gradiente Forte - Garante fundo escuro para texto branco */}
          <div className='absolute inset-0 bg-gradient-to-r from-black from-40% via-black/85 to-black/50'>
            <div className='absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60' />
          </div>

          {/* Conteúdo Premium - Otimizado para Mobile */}
          <div className='relative z-10 min-h-[60vh] sm:min-h-[65vh] md:min-h-[75vh] flex items-center pt-20 sm:pt-24 md:pt-32 pb-8 sm:pb-12 md:pb-16'>
            <div className='container mx-auto px-4 sm:px-6'>
              {/* Breadcrumb - Compacto para Mobile */}
              <nav className='mb-4 sm:mb-6 md:mb-8 flex items-center text-xs sm:text-sm overflow-x-auto scrollbar-hide'>
                <div className='flex items-center min-w-max'>
                  {breadcrumbItems.map((item, index) => {
                    const isLast = index === breadcrumbItems.length - 1;
                    const isHash = item.url === '#';
                    
                    return (
                      <div key={index} className='flex items-center text-gray-300 whitespace-nowrap'>
                        {index > 0 && <span className='mx-1 sm:mx-2 text-gray-500'>/</span>}
                        {isLast || isHash ? (
                          <span className='font-medium text-white text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none'>
                            {item.name}
                          </span>
                        ) : (
                          <Link 
                            href={item.url as any} 
                            className='hover:text-white transition-colors text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none'
                          >
                            {item.name}
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              </nav>

              <div className='grid md:grid-cols-2 gap-6 md:gap-12 items-center'>
                {/* Informações Principais */}
                <div className='w-full'>
                  <div 
                    className='inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4 backdrop-blur-sm'
                    style={{ 
                      backgroundColor: `${colors.solid}20`,
                      color: colors.solid,
                      border: `1px solid ${colors.solid}40`
                    }}
                  >
                    {city.fullName}
                  </div>

                  <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight text-white drop-shadow-2xl'>
                    {translatedEquipment.name}
                    <br />
                    <span style={{ color: colors.solid }} className='text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl'>
                      {translations.titleIn} {city.name} - {city.stateCode}
                    </span>
                  </h1>

                  {/* Imagem do produto em mobile - Mostrar acima da descrição */}
                  <div className='relative mb-4 sm:mb-6 md:hidden w-full max-w-xs mx-auto'>
                    <div className='aspect-square rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl'>
                      {translatedEquipment.images?.[0] ? (
                        <img
                          src={translatedEquipment.images[0]}
                          alt={`${translatedEquipment.name} ${translations.titleIn} ${city.fullName}`}
                          className='w-full h-full object-contain p-4'
                          onError={(e) => {
                            console.error('[SEO Page] Erro ao carregar imagem do produto:', translatedEquipment.images[0]);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className='w-full h-full flex items-center justify-center bg-white/5'>
                          <div className='text-white/40 text-center'>
                            <svg className='w-12 h-12 mx-auto mb-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                            </svg>
                            <p className='text-xs'>{translations.imagemNaoDisponivel}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className='text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-gray-100 leading-relaxed drop-shadow-lg'>
                    {translatedEquipment.shortDescription || translatedEquipment.description}
                  </p>

                  {/* Botões - Stack vertical em mobile */}
                  <div className='flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4'>
                    <Link href={`/${locale}/equipamentos/${equipment.id}`} className='w-full sm:w-auto'>
                      <Button 
                        size='lg' 
                        style={{ 
                          backgroundColor: colors.solid,
                        }}
                        className='w-full sm:w-auto hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-xl text-white font-semibold text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3'
                      >
                        {translations.verDetalhesCompletos}
                      </Button>
                    </Link>
                    <a
                      href={`https://wa.me/${APP_CONFIG.contact.comercial.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(translations.whatsappMessage)}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='w-full sm:w-auto'
                      onClick={handleQuoteClick}
                    >
                      <Button 
                        size='lg' 
                        variant='outline'
                        className='w-full sm:w-auto border-none text-white hover:bg-[rgba(34,197,94,0.9)] backdrop-blur-sm transition-all duration-300 hover:scale-105 shadow-xl font-semibold text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3 quote-button'
                        style={{ backgroundColor: 'rgba(34, 197, 94, 0.8)' }}
                      >
                        {translations.solicitarOrcamento}
                      </Button>
                    </a>
                  </div>
                </div>

                {/* Espaço para imagem do produto - Oculto em mobile */}
                <div className='relative hidden md:block'>
                  <div className='aspect-square rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl'>
                    {translatedEquipment.images?.[0] ? (
                      <img
                        src={translatedEquipment.images[0]}
                        alt={`${translatedEquipment.name} ${translations.titleIn} ${city.fullName}`}
                        className='w-full h-full object-contain p-4'
                        onError={(e) => {
                          console.error('[SEO Page] Erro ao carregar imagem do produto:', translatedEquipment.images[0]);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center bg-white/5'>
                        <div className='text-white/40 text-center'>
                          <svg className='w-16 h-16 mx-auto mb-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                          </svg>
                          <p className='text-sm'>{translations.imagemNaoDisponivel}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Badges de Benefícios */}
        <BenefitBadges accentColor={colors.solid} isExport={isExport} />

        {/* Conteúdo SEO - Otimizado para Mobile */}
        <section className='bg-white py-8 sm:py-12 md:py-16 border-b border-gray-100'>
          <div className='container mx-auto px-4 sm:px-6'>
            <div className='max-w-4xl mx-auto'>
              <h2 className='text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900'>
                {translations.title}
              </h2>

              <p className='text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 text-gray-700'>
                {translations.searchingFor}{' '}
                {isExport 
                  ? translations.powerRunDescriptionExport
                  : translations.powerRunDescription
                }
              </p>

              <h3 className='text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900'>
                {translations.whyChooseTitle}
              </h3>

              <div className='space-y-3 sm:space-y-4 mb-8 sm:mb-12'>
                <div className='flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200'>
                  <div 
                    className='w-2 h-2 rounded-full mt-1.5 sm:mt-2 flex-shrink-0'
                    style={{ backgroundColor: colors.solid }}
                  ></div>
                  <div className='flex-1 min-w-0'>
                    <strong className='text-gray-900 text-sm sm:text-base block mb-1'>
                      {isExport ? translations.benefitNationalExport : translations.benefitNational}
                    </strong>
                    <span className='text-gray-700 text-sm sm:text-base leading-relaxed'>
                      {isExport ? translations.benefitNationalDescExport : translations.benefitNationalDesc}
                    </span>
                  </div>
                </div>

                <div className='flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200'>
                  <div 
                    className='w-2 h-2 rounded-full mt-1.5 sm:mt-2 flex-shrink-0'
                    style={{ backgroundColor: colors.solid }}
                  ></div>
                  <div className='flex-1 min-w-0'>
                    <strong className='text-gray-900 text-sm sm:text-base block mb-1'>
                      {isExport ? translations.benefitQualityExport : translations.benefitQuality}
                    </strong>
                    <span className='text-gray-700 text-sm sm:text-base leading-relaxed'>
                      {isExport ? translations.benefitQualityDescExport : translations.benefitQualityDesc}
                    </span>
                  </div>
                </div>

                <div className='flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200'>
                  <div 
                    className='w-2 h-2 rounded-full mt-1.5 sm:mt-2 flex-shrink-0'
                    style={{ backgroundColor: colors.solid }}
                  ></div>
                  <div className='flex-1 min-w-0'>
                    <strong className='text-gray-900 text-sm sm:text-base block mb-1'>
                      {isExport 
                        ? translations.benefitDeliveryExport
                        : translations.benefitDelivery
                      }
                    </strong>
                    <span className='text-gray-700 text-sm sm:text-base leading-relaxed'>
                      {isExport ? translations.benefitDeliveryDescExport : translations.benefitDeliveryDesc}
                    </span>
                  </div>
                </div>

                {/* Suporte Técnico - apenas para Brasil */}
                {!isExport && (
                  <div className='flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200'>
                    <div 
                      className='w-2 h-2 rounded-full mt-1.5 sm:mt-2 flex-shrink-0'
                      style={{ backgroundColor: colors.solid }}
                    ></div>
                    <div className='flex-1 min-w-0'>
                      <strong className='text-gray-900 text-sm sm:text-base block mb-1'>{translations.benefitSupport}</strong>
                      <span className='text-gray-700 text-sm sm:text-base leading-relaxed'>{translations.benefitSupportDesc}</span>
                    </div>
                  </div>
                )}

                <div className='flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200'>
                  <div 
                    className='w-2 h-2 rounded-full mt-1.5 sm:mt-2 flex-shrink-0'
                    style={{ backgroundColor: colors.solid }}
                  ></div>
                  <div className='flex-1 min-w-0'>
                    <strong className='text-gray-900 text-sm sm:text-base block mb-1'>
                      {isExport ? translations.benefitWarrantyExport : translations.benefitWarranty}
                    </strong>
                    <span className='text-gray-700 text-sm sm:text-base leading-relaxed'>
                      {isExport ? translations.benefitWarrantyDescExport : translations.benefitWarrantyDesc}
                    </span>
                  </div>
                </div>
              </div>

              {translatedEquipment.features && translatedEquipment.features.length > 0 && (
                <>
                  <h3 className='text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900'>
                    {translations.specificationsTitle}
                  </h3>

                  <div className='bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 sm:p-6 md:p-8 mb-8 sm:mb-12 border border-gray-200 shadow-sm'>
                    <div className='grid sm:grid-cols-2 gap-3 sm:gap-4'>
                      {translatedEquipment.features.map((feature, index) => (
                        <div key={index} className='flex items-start gap-2 sm:gap-3'>
                          <svg 
                            className='w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0' 
                            style={{ color: colors.solid }}
                            fill='none' 
                            stroke='currentColor' 
                            viewBox='0 0 24 24'
                          >
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                          </svg>
                          <span className='text-gray-700 text-sm sm:text-base leading-relaxed'>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <h3 className='text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900'>
                {translations.requestQuoteTitle}
              </h3>

              <p className='text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 text-gray-700'>
                {translations.requestQuoteDescription}
              </p>

              <CTASection
                cityFullName={city.fullName}
                equipmentName={translatedEquipment.name}
                accentColor={colors.solid}
                hoverColor={colors.hover}
                productId={equipment.id}
                citySlug={city.slug}
                cityName={city.name}
                keyword={decodedKeyword}
                pageType="seo"
              />
            </div>
          </div>
        </section>

        {/* Equipamentos Relacionados - Otimizado para Mobile */}
        {relatedEquipments.length > 0 && (
          <section className='bg-gradient-to-b from-gray-50 to-white py-8 sm:py-12 md:py-16'>
            <div className='container mx-auto px-4 sm:px-6'>
              <h2 className='text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-900'>
                {translations.otherEquipmentsTitle}
              </h2>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6'>
                {relatedEquipments.map((eq) => (
                  <EquipmentCard key={eq.id} equipment={eq} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Botão WhatsApp Flutuante - "Solicitar Orçamento" com texto visível */}
        <a
          href={`https://wa.me/${APP_CONFIG.contact.comercial.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(translations.whatsappMessage)}`}
          target='_blank'
          rel='noopener noreferrer'
          className='fixed bottom-6 right-4 sm:right-6 z-50 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full sm:rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 group'
          aria-label={translations.solicitarOrcamento}
          title={translations.solicitarOrcamento}
          onClick={handleQuoteClick}
        >
          {/* Ícone WhatsApp */}
          <svg 
            className='w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0' 
            fill='currentColor' 
            viewBox='0 0 24 24'
            aria-hidden='true'
          >
            <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488' />
          </svg>
          
          {/* Texto do botão - Visível em todas as telas */}
          <span className='font-semibold text-sm sm:text-base whitespace-nowrap'>
            {translations.solicitarOrcamento}
          </span>
          
          {/* Efeito de pulso sutil */}
          <span className='absolute inset-0 rounded-full sm:rounded-2xl bg-[#25D366] animate-ping opacity-10'></span>
        </a>
      </div>

      {/* Links Internos para Cidades Relacionadas - SEO 2025 */}
      <div className="container mx-auto px-4 py-8">
        <RelatedCitiesLinks
          currentCity={city as StaticCity}
          productId={equipment.id}
          keyword={keyword}
          locale={locale as 'pt-BR' | 'en' | 'es'}
          allCities={allCities}
        />
      </div>
    </MainLayout>
  );
}

