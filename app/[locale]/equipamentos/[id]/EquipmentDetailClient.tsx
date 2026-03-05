'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout';
import {
  ProductInfo,
  ProductFeatureBlocks,
  ProductMasonry,
  ProductSpecsModal,
  ProductImageModal,
  ProductVariantSelector,
} from '@/components/product';
import { Button, EquipmentCard } from '@/components/ui';
import { APP_CONFIG } from '@/constants';
import { getProductLineConfig, type ProductLineConfig } from '@/constants/product-line-mapping';
import { useEquipmentTranslations } from '@/hooks/useEquipmentTranslations';
import { useQuoteTracking } from '@/hooks/useQuoteTracking';
import { fetchEquipmentById, fetchEquipments } from '@/services/equipments';
import { Equipment } from '@/types';

// 🛡️ FUNÇÃO PARA ESTILOS INDESTRUTÍVEIS
const setImportantStyle = (element: HTMLElement, styles: Record<string, string>) => {
  Object.entries(styles).forEach(([property, value]) => {
    element.style.setProperty(property, value, 'important');
  });
};

export default function EquipmentDetailClient() {
  const params = useParams();
  const locale = useLocale();
  const router = useRouter();
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const { translateEquipment } = useEquipmentTranslations();

  // Removed unused selectedImageIndex state
  const [showSpecsModal, setShowSpecsModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [relatedEquipment, setRelatedEquipment] = useState<Equipment[]>([]);
  const [translatedEquipment, setTranslatedEquipment] = useState<Equipment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [bannerImageLoaded, setBannerImageLoaded] = useState(false);

  const { trackQuoteClick } = useQuoteTracking({
    productId: equipment?.id,
    productName: translatedEquipment?.name,
    pageType: 'normal',
    actionType: 'whatsapp', // Clique em WhatsApp
  });

  // Handler para tracking e abertura do WhatsApp
  const handleWhatsAppClick = (e: React.MouseEvent<HTMLAnchorElement>, message: string) => {
    e.preventDefault();
    trackQuoteClick();
    const phoneNumber = APP_CONFIG.contact.comercial.whatsapp.replace(/\D/g, '');
    window.open(`https://wa.me/55${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Função para encontrar produtos realmente relacionados
  const findRelatedProducts = (
    currentProduct: Equipment,
    allProducts: Equipment[]
  ): Equipment[] => {
    if (!allProducts.length) return [];

    try {
      const currentConfig = getProductLineConfig(currentProduct.id);
      const scored: Array<{ product: Equipment; score: number }> = [];

      allProducts
        .filter((product) => product.id !== currentProduct.id) // Excluir o próprio produto
        .forEach((product) => {
          let score = 0;

          try {
            const productConfig = getProductLineConfig(product.id);

            // Pontuação por linha de produto (peso alto)
            if (productConfig.line === currentConfig.line) {
              score += 50; // Mesma linha (Red/Blue/Musculação)
            }

            // Pontuação por tipo (peso médio-alto)
            if (productConfig.type === currentConfig.type) {
              score += 40; // Mesmo tipo (cardio/musculação)
            }

            // Pontuação por categoria específica (peso médio)
            if (productConfig.category === currentConfig.category) {
              score += 30;
            }

            // Pontuação por subcategoria (peso médio)
            if (
              productConfig.subcategory &&
              currentConfig.subcategory &&
              productConfig.subcategory === currentConfig.subcategory
            ) {
              score += 25;
            }

            // Bonus para produtos da mesma família (mesmo prefixo)
            if (product.id.split('-')[0] === currentProduct.id.split('-')[0]) {
              score += 20;
            }

            // Bonus se contém palavras similares no nome
            const currentName = currentProduct.name.toLowerCase();
            const productName = product.name.toLowerCase();
            const currentWords = currentName.split(' ');
            const productWords = productName.split(' ');
            const commonWords = currentWords.filter((word) =>
              productWords.some((pw) => pw.includes(word) || word.includes(pw))
            );
            score += commonWords.length * 5;

            scored.push({ product, score });
          } catch {
            // Se não conseguir obter configuração, dar pontuação baixa baseada apenas na categoria
            if (product.category === currentProduct.category) {
              score += 15;
            }
            if (product.brand === currentProduct.brand) {
              score += 10;
            }
            scored.push({ product, score });
          }
        });

      // Ordenar por pontuação (maior para menor) e retornar top 3
      return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((item) => item.product);
    } catch {
      // Fallback para lógica simples se algo der errado
      return allProducts
        .filter(
          (product) =>
            product.id !== currentProduct.id && product.category === currentProduct.category
        )
        .slice(0, 3);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function load() {
      if (!params?.id) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setNotFound(false);

      try {
        const { data } = await fetchEquipmentById(params.id as string, locale);
        if (!isMounted) return;

        if (data) {
          setEquipment(data);
          setTranslatedEquipment(translateEquipment(data));

          // Carregar equipamentos relacionados com lógica inteligente
          const { data: allEquipments } = await fetchEquipments({ locale });
          if (!isMounted) return;

          if (allEquipments && allEquipments.length > 0) {
            const related = findRelatedProducts(data, allEquipments);
            setRelatedEquipment(related);
          }
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Erro ao carregar equipamento:', error);
        if (isMounted) {
          setNotFound(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [params?.id, locale, translateEquipment]);

  // Atualizar tradução quando o equipamento ou locale mudar
  useEffect(() => {
    if (equipment) {
      setTranslatedEquipment(translateEquipment(equipment));
    }
  }, [equipment, translateEquipment]); // translateEquipment agora é estável com useCallback

  // 🛡️ FORÇA ESTILOS CORRETOS APÓS HIDRATAÇÃO - NUNCA MAIS VAI SUMIR!
  useEffect(() => {
    const timer = setTimeout(() => {
      // Força estilos nos botões do hero - botão primário
      const heroButtons = document.querySelectorAll('.hero-btn-primary');
      heroButtons.forEach((btn) => {
        if (btn instanceof HTMLElement) {
          const isDarkBanner =
            translatedEquipment && getProductBanner(translatedEquipment) === 'dark-banner';
          setImportantStyle(btn, {
            'background-color': isDarkBanner ? '#ffffff' : '#ffffff',
            color: isDarkBanner ? '#000000' : '#000000',
            border: 'none',
            padding: '16px 32px',
            'font-size': '16px',
            'font-weight': '500',
            'border-radius': '8px',
            cursor: 'pointer',
          });
        }
      });

      // Força estilos nos botões do hero - botão outline
      const heroButtonsOutline = document.querySelectorAll('.hero-btn-outline');
      heroButtonsOutline.forEach((btn) => {
        if (btn instanceof HTMLElement) {
          const isDarkBanner =
            translatedEquipment && getProductBanner(translatedEquipment) === 'dark-banner';
          // Se for botão de solicitar orçamento (verde fosco)
          if (btn.classList.contains('quote-button')) {
            setImportantStyle(btn, {
              'background-color': 'rgba(34, 197, 94, 0.8)', // Verde fosco (green-500 com opacidade)
              color: '#ffffff',
              border: 'none',
              padding: '16px 32px',
              'font-size': '16px',
              'font-weight': '500',
              'border-radius': '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            });
          } else {
            setImportantStyle(btn, {
              'background-color': 'transparent',
              color: '#ffffff',
              border: isDarkBanner
                ? '1px solid rgba(255, 255, 255, 0.5)'
                : '1px solid rgba(255, 255, 255, 0.7)',
              padding: '16px 32px',
              'font-size': '16px',
              'font-weight': '500',
              'border-radius': '8px',
              'backdrop-filter': 'blur(8px)',
              cursor: 'pointer',
            });
          }
        }
      });

      // Estilos específicos para botões de solicitar orçamento (incluindo sticky)
      const quoteButtons = document.querySelectorAll('.quote-button');
      quoteButtons.forEach((btn) => {
        if (btn instanceof HTMLElement) {
          setImportantStyle(btn, {
            'background-color': 'rgba(34, 197, 94, 0.8)', // Verde fosco
            color: '#ffffff',
            border: 'none',
            padding: '16px 32px',
            'font-size': '16px',
            'font-weight': '500',
            'border-radius': '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          });

          // Efeito hover para verde fosco
          btn.addEventListener('mouseenter', function () {
            if (this instanceof HTMLElement) {
              setImportantStyle(this, {
                'background-color': 'rgba(34, 197, 94, 0.9)', // Verde mais intenso no hover
              });
            }
          });

          btn.addEventListener('mouseleave', function () {
            if (this instanceof HTMLElement) {
              setImportantStyle(this, {
                'background-color': 'rgba(34, 197, 94, 0.8)', // Volta ao verde fosco
              });
            }
          });
        }
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [translatedEquipment]);

  // Função para abrir modal de imagens
  const openImageModal = (index: number) => {
    setModalImageIndex(index);
    setShowImageModal(true);
  };

  // Função para lidar com mudança de variante PR4000
  const handleVariantChange = (variantId: string) => {
    // Navegar para a nova variante
    router.push(`/${locale}/equipamentos/${variantId}`);
  };

  // Reset banner loaded state quando trocar de equipamento
  useEffect(() => {
    setBannerImageLoaded(false);
  }, [translatedEquipment?.id]);

  // Função para obter banner específico por produto (só exibido após onLoad, sem fallback visível)
  const getProductBanner = (equipment: Equipment): string | 'dark-banner' => {
    const productBanners: Record<string, string> = {
      'power-race-7000':
        'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756334905/Design_sem_nome_-_2025-08-27T191245.756_at3sj6.png',
      'power-race-7000-ts':
        'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756335223/Design_sem_nome_-_2025-08-27T195336.831_cxy6pq.png',
      'power-rise-650':
        'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756361586/Design_sem_nome_-_2025-08-28T030918.969_qsyx9k.png',
      'power-round-550':
        'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756361554/Design_sem_nome_-_2025-08-28T030909.601_glp1nb.png',
      'power-rush-250':
        'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756361493/Design_sem_nome_-_2025-08-28T030842.523_tjiry1.png',
      'power-rush-450':
        'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756361457/Design_sem_nome_-_2025-08-28T030847.647_shh2ip.png',
      'esteira-pr4000-18':
        'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756363528/Design_sem_nome_-_2025-08-28T034501.828_wrvqwr.png',
      'esteira-pr4000-30':
        'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756363517/Design_sem_nome_-_2025-08-28T034501.828_tfrdbv.png',
      'esteira-pr5000':
        'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756363022/12_ovocts.png',
      'esteira-pr5000i':
        'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756367844/13_ouwbsd.png',
      'esteira-pr6000':
        'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756363278/Design_sem_nome_-_2025-08-28T034100.412_btsu4z.png',
      'esteira-pr6000i':
        'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756367844/13_ouwbsd.png',
      'bicicleta-spinning-pr200':
        'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756363006/7_t5vk0x.png',
      'bike-vertical-pr300':
        'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756366293/8_j16ir0.png',
      'bike-horizontal-pr400':
        'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756366334/8_mfiwwp.png',
      'eliptico-pr500':
        'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756366247/10_dbavyj.png',
      'escada-pr600': 'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756366275/9_itrub3.png',
    };
    const equipamentosSemBanner = [
      'multi-gym-pr012',
      'banco-bi-inclinavel-pr014',
      'pr001-peitoral-dorsal',
      'pr002-polia-superior-remada',
      'pr003-multi-press',
      'pr004-biceps-triceps',
      'pr005-leg-press-hack',
      'pr006-cadeira-adutora-abdutora',
      'pr008-leg-press-hack-squat',
      'pr009-cross-over-angular',
      'pr010-multi-station',
      'pr013-banco-uni-inclinavel',
      'pr015-cadeira-extensora-flexora',
      'power-rush-350',
    ];
    if (equipamentosSemBanner.includes(equipment.id)) return 'dark-banner';
    if (productBanners[equipment.id]) return productBanners[equipment.id];
    if (equipment.images?.length) return equipment.images[0];
    const categoryBanners: Record<string, string> = {
      'blue-line':
        'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756334905/Design_sem_nome_-_2025-08-27T191245.756_at3sj6.png',
      'red-line':
        'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756332878/Design_sem_nome_-_2025-08-27T191245.756_at3sj6.png',
      musculacao:
        'https://res.cloudinary.com/dq0bovaz5/image/upload/v1756332878/Design_sem_nome_-_2025-08-27T191245.756_at3sj6.png',
    };
    return categoryBanners[equipment.category] ?? categoryBanners['blue-line'];
  };

  // Função para formatar título
  const formatEquipmentTitle = (equipment: Equipment) => {
    const nameParts = equipment.name.split(' - ');

    if (nameParts.length === 2) {
      return {
        mainTitle: nameParts[1], // Nome técnico (embaixo, menor)
        subTitle: nameParts[0], // Nome do equipamento profissional (em cima, maior)
      };
    }

    return {
      mainTitle: equipment.name,
      subTitle: null,
    };
  };

  const getProductLineConfigForEquipment = (equipment: Equipment): ProductLineConfig => {
    return getProductLineConfig(equipment.id);
  };

  const productLineConfig: ProductLineConfig = equipment
    ? getProductLineConfigForEquipment(equipment)
    : getProductLineConfig('default');

  const colors = productLineConfig.colors;

  // Loading state
  if (isLoading) {
    return (
      <MainLayout title='Carregando... - Power Run'>
        <div className='relative min-h-screen bg-white overflow-hidden'>
          <section className='relative overflow-hidden pt-32 pb-32'>
            <div className='absolute inset-0 w-full h-full overflow-hidden'>
              <div className='w-full h-full bg-black'>
                <div className='absolute inset-0 bg-gradient-to-t from-black to-black/95'></div>
              </div>
            </div>
            <div className='relative z-10'>
              <div className='container mx-auto px-4'>
                <nav className='flex items-center space-x-2 text-sm text-gray-300 mb-8 no-border'>
                  <div className='h-4 w-12 bg-gray-600 rounded animate-pulse'></div>
                  <div className='h-4 w-24 bg-gray-600 rounded animate-pulse'></div>
                  <div className='h-4 w-32 bg-gray-500 rounded animate-pulse'></div>
                </nav>
                <div className='max-w-4xl text-left bg-black/30 backdrop-blur-sm rounded-xl p-8'>
                  <div className='h-12 lg:h-16 w-3/4 bg-gray-600 rounded animate-pulse mb-8'></div>
                  <div className='space-y-2 mb-12 max-w-2xl'>
                    <div className='h-6 w-full bg-gray-700 rounded animate-pulse'></div>
                    <div className='h-6 w-2/3 bg-gray-700 rounded animate-pulse'></div>
                  </div>
                  <div className='flex flex-col sm:flex-row gap-4'>
                    <div className='h-14 w-32 bg-gray-300 rounded animate-pulse'></div>
                    <div className='h-14 w-40 bg-gray-600 border border-gray-500 rounded animate-pulse'></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </MainLayout>
    );
  }

  // Not found state
  if (notFound || !equipment || !translatedEquipment) {
    return (
      <MainLayout title={`${tCommon('notFoundEquipmentTitle')} - Power Run`}>
        <div className='relative min-h-screen bg-white flex items-center justify-center'>
          <div className='text-center'>
            <div className='bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-2xl p-12 shadow-lg max-w-md mx-auto'>
              <h1 className='text-3xl font-bold text-black mb-4'>
                {tCommon('notFoundEquipmentTitle')}
              </h1>
              <p className='text-gray-600 mb-8'>{tCommon('notFoundEquipmentDesc')}</p>
              <Link href='/equipamentos'>
                <Button className='bg-black text-white hover:bg-gray-800 transition-all duration-300'>
                  {tCommon('backToEquipments')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={`${translatedEquipment.name} - Power Run`}>
      <div className='relative min-h-screen bg-white overflow-hidden'>
        <section className='relative overflow-hidden pt-32 pb-32'>
          <div className='absolute inset-0 w-full h-full overflow-hidden bg-black'>
            <div className='absolute inset-0 bg-gradient-to-t from-black to-black/95' />
            {getProductBanner(translatedEquipment) !== 'dark-banner' && (
              <img
                src={getProductBanner(translatedEquipment) as string}
                alt=''
                role='presentation'
                className={`absolute inset-0 w-full h-[120%] object-cover -translate-y-8 transition-opacity duration-300 ${
                  bannerImageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setBannerImageLoaded(true)}
              />
            )}
          </div>

          <div className='relative z-10'>
            <div className='container mx-auto px-4'>
              <nav className='flex items-center space-x-2 text-sm text-gray-300 mb-8 no-border'>
                <Link
                  href='/'
                  className='hover:text-white transition-colors btn-exception no-border'
                >
                  {tNav('inicio')}
                </Link>
                <span className='text-gray-500'>/</span>
                <Link
                  href='/equipamentos'
                  className='hover:text-white transition-colors btn-exception no-border'
                >
                  {tNav('equipamentos')}
                </Link>
                <span className='text-gray-500'>/</span>
                <span className='text-white font-medium'>{translatedEquipment.name}</span>
              </nav>

              <div className='max-w-4xl text-left bg-black/30 backdrop-blur-sm rounded-xl p-8 carousel-card-text no-border'>
                {(() => {
                  const titleFormat = formatEquipmentTitle(translatedEquipment);
                  const getSubTitleColor = () => {
                    if (translatedEquipment.category === 'red-line') {
                      return 'text-[#9c1006]';
                    } else if (translatedEquipment.category === 'blue-line') {
                      return 'text-[#61fbfe]';
                    } else {
                      return 'text-white/90';
                    }
                  };

                  // Função para capitalizar primeira letra de cada palavra
                  const capitalize = (str: string) => {
                    if (!str) return str;
                    return str
                      .split(' ')
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                      .join(' ');
                  };

                  return (
                    <h1 className='text-5xl lg:text-7xl font-bold text-white mb-8'>
                      {titleFormat.subTitle && (
                        <>
                          <span className={`${getSubTitleColor()}`}>
                            {capitalize(titleFormat.subTitle)}
                          </span>
                          <br />
                        </>
                      )}
                      <span className='text-2xl lg:text-3xl font-medium text-white/80'>
                        {titleFormat.mainTitle}
                      </span>
                    </h1>
                  );
                })()}

                <div className='flex flex-col sm:flex-row gap-4 mb-8'>
                  <Button
                    className='btn-exception no-border hero-btn-primary'
                    onClick={() => {
                      const element = document.getElementById('detalhes-produto');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {tCommon('verDetalhes')}
                  </Button>
                  <a
                    href='#'
                    onClick={(e) =>
                      handleWhatsAppClick(
                        e,
                        `${tCommon('solicitarOrcamento')} ${equipment?.name || 'Power Run'}.`
                      )
                    }
                  >
                    <Button className='btn-exception no-border hero-btn-outline quote-button'>
                      {tCommon('solicitarOrcamento')}
                    </Button>
                  </a>
                </div>

                <ProductVariantSelector
                  currentEquipment={translatedEquipment}
                  onVariantChange={handleVariantChange}
                />
              </div>
            </div>
          </div>
        </section>

        <section id='detalhes-produto' className='bg-white py-20'>
          <div className='container mx-auto px-4'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-20 items-start'>
              <ProductInfo
                equipment={translatedEquipment}
                productLine={productLineConfig.line}
                colors={colors}
                onShowSpecs={() => setShowSpecsModal(true)}
              />

              <div className='w-full h-full flex items-center justify-center'>
                <div
                  className='relative w-full h-full max-h-[650px] rounded-2xl overflow-hidden cursor-pointer transform hover:scale-[1.02] transition-transform duration-300'
                  onClick={() => openImageModal(0)}
                >
                  <img
                    src={translatedEquipment.images[0]}
                    alt={`${translatedEquipment.name} - Imagem Principal`}
                    className='w-full h-full object-cover'
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {![
          'esteira-pr4000-18',
          'esteira-pr4000-30',
          'bicicleta-spinning-pr200',
          'esteira-pr5000',
          'esteira-pr5000i',
          'esteira-pr6000',
          'esteira-pr6000i',
          'bike-vertical-pr300',
          'bike-horizontal-pr400',
          'eliptico-pr500',
          'escada-pr600',
          'multi-gym-pr012',
          'banco-bi-inclinavel-pr014',
          'pr001-peitoral-dorsal',
          'pr002-polia-superior-remada',
          'pr003-multi-press',
          'pr004-biceps-triceps',
          'pr005-leg-press-hack',
          'pr006-cadeira-adutora-abdutora',
          'pr008-leg-press-hack-squat',
          'pr009-cross-over-angular',
          'pr010-multi-station',
          'pr013-banco-uni-inclinavel',
          'pr015-cadeira-extensora-flexora',
          'power-rise-650',
          'power-round-550',
          'power-rush-250',
          'power-rush-350',
          'power-rush-450',
        ].includes(translatedEquipment.id) && (
          <>
            <ProductMasonry equipment={translatedEquipment} />
            <ProductFeatureBlocks equipment={translatedEquipment} />
          </>
        )}

        {[
          'bicicleta-spinning-pr200',
          'esteira-pr5000',
          'esteira-pr5000i',
          'esteira-pr6000',
          'esteira-pr6000i',
          'bike-vertical-pr300',
          'bike-horizontal-pr400',
          'escada-pr600',
          'power-round-550',
          'power-rush-250',
        ].includes(translatedEquipment.id) && <ProductMasonry equipment={translatedEquipment} />}

        <div className='container mx-auto px-4 pb-32'>
          <div className='mb-20'>
            <div className='text-center mb-12'>
              <h2 className='text-4xl font-bold text-black mb-4'>
                {tCommon('produtosRelacionados')}
              </h2>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
              {relatedEquipment.slice(0, 4).map((relatedEq) => (
                <EquipmentCard key={relatedEq.id} equipment={relatedEq} />
              ))}
            </div>
          </div>
        </div>

        <ProductImageModal
          equipment={translatedEquipment}
          isOpen={showImageModal}
          onClose={() => setShowImageModal(false)}
          initialIndex={modalImageIndex}
        />

        <ProductSpecsModal
          equipment={translatedEquipment}
          isOpen={showSpecsModal}
          onClose={() => setShowSpecsModal(false)}
          productLine={productLineConfig.line}
          colors={colors}
        />

        <div className='fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl text-white border-t border-white/10 shadow-2xl z-50 carousel-card-text no-border product-sticky-bar'>
          <div className='container mx-auto px-4 py-4'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='font-bold text-lg'>{translatedEquipment.name}</h3>
              </div>
              <div className='flex gap-3 no-border'>
                <a
                  href='#'
                  className='btn-exception no-border'
                  onClick={(e) =>
                    handleWhatsAppClick(e, `Solicitar orçamento ${equipment?.name || 'Power Run'}.`)
                  }
                >
                  <Button className='btn-exception no-border sticky-button hero-btn-primary quote-button'>
                    {tCommon('solicitarOrcamento')}
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
