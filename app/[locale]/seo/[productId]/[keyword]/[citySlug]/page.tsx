import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { 
  getCityBySlug, 
  getPriorityCitiesForCountry,
  getBrazilianCitiesWithPopulation,
  getBrazilianCitiesExpanded,
  getUSPriorityCities,
  getLatinAmericaPriorityCities,
  type InternationalCity
} from '@/services/international-cities-full';
import { getAllCities } from '@/services/cities-max-service';
import { fetchEquipmentById, fetchEquipments } from '@/services/equipments';
import { MOCK_EQUIPMENT } from '@/constants/equipment-data';
import {
  generateInternationalKeywords,
  generateSEOSlug,
  generateInternationalSEOTitle,
  generateInternationalSEODescription,
} from '@/services/international-seo-keywords';
import {
  generateExpandedKeywords,
  generateExpandedInternationalKeywords,
} from '@/services/seo-keywords-expanded';
import type { SEOKeyword } from '@/services/seo-keywords';
import { ProductStructuredData, BreadcrumbStructuredData, FAQStructuredData, ServiceStructuredData } from '@/components/seo/StructuredData';
import { locales } from '@/i18n/routing';
import { translateEquipmentOnServer } from '@/lib/server-equipment-translations';
import SEOCityPageClient from './SEOCityPageClient';

// Locales suportados para páginas SEO (excluir zh-CN se não tiver traduções completas)
const SUPPORTED_SEO_LOCALES: Array<'pt-BR' | 'en' | 'es'> = ['pt-BR', 'en', 'es'];

interface Props {
  params: Promise<{
    locale: string;
    productId: string;
    keyword: string;
    citySlug: string;
  }>;
}

/**
 * Gera metadados SEO otimizados para cada combinação produto+keyword+cidade
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, productId, keyword, citySlug } = await params;

  // Validar locale suportado
  if (!SUPPORTED_SEO_LOCALES.includes(locale as 'pt-BR' | 'en' | 'es')) {
    return {
      title: 'Página não encontrada - Power Run',
      description: 'A página que você procura não existe.',
    };
  }

  try {
    const [{ data: equipment }, city] = await Promise.all([
      fetchEquipmentById(productId, locale).catch((error) => {
        console.error('[SEO Metadata] Erro ao buscar equipamento:', error);
        return { data: null };
      }),
      getCityBySlug(citySlug),
    ]);

    if (!equipment || !city) {
      return {
        title: 'Página não encontrada - Power Run',
        description: 'A página que você procura não existe.',
      };
    }

    // ✅ TRADUZIR EQUIPAMENTO NO SERVIDOR para metadata também
    const translatedEquipment = await translateEquipmentOnServer(equipment, locale);

    // Decodificar keyword do slug
    const decodedKeyword = keyword.replace(/-/g, ' ');

    // Título e descrição internacionais otimizados (SEO 2025)
    const title = generateInternationalSEOTitle(
      decodedKeyword,
      city.name,
      city.stateCode,
      translatedEquipment.name,
      locale as 'pt-BR' | 'en' | 'es'
    );
    
    const description = generateInternationalSEODescription(
      decodedKeyword,
      city.name,
      city.stateCode,
      translatedEquipment.name,
      locale as 'pt-BR' | 'en' | 'es'
    );

    // Keywords expandidas (SEO 2025)
    const keywords = [
      decodedKeyword,
      `${decodedKeyword} ${city.name}`,
      `${decodedKeyword} ${city.stateCode}`,
      `${decodedKeyword} ${city.fullName}`,
      translatedEquipment.name.toLowerCase(),
      `${translatedEquipment.name.toLowerCase()} ${city.name}`,
      `power run ${city.name}`,
      `power run ${city.stateCode}`,
      'equipamento profissional',
      'academia',
      'fitness',
      city.fullName,
      city.country,
    ];

    const canonicalUrl = `https://powerrun.com.br/${locale}/seo/${productId}/${keyword}/${citySlug}`;

    // Gerar URLs alternativas (hreflang) para todas as versões de idioma
    const alternateUrls: Record<string, string> = {};
    locales.forEach((loc) => {
      alternateUrls[loc] = `https://powerrun.com.br/${loc}/seo/${productId}/${keyword}/${citySlug}`;
    });

    return {
      title,
      description,
      keywords: keywords.join(', '),
      openGraph: {
        title,
        description,
        images: equipment.images?.[0] ? [equipment.images[0]] : [],
        type: 'website',
        url: canonicalUrl,
        siteName: 'Power Run',
        locale: locale === 'pt-BR' ? 'pt_BR' : locale === 'es' ? 'es_ES' : 'en_US',
        alternateLocale: locales.filter(l => l !== locale),
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: equipment.images?.[0] ? [equipment.images[0]] : [],
        creator: '@powerrunbrasil',
        site: '@powerrunbrasil',
      },
      alternates: {
        canonical: canonicalUrl,
        languages: alternateUrls,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      other: {
        'geo.region': city.countryCode,
        'geo.placename': city.fullName,
        ...(city.latitude && city.longitude ? {
          'geo.position': `${city.latitude};${city.longitude}`,
          'ICBM': `${city.latitude}, ${city.longitude}`,
        } : {}),
      },
    };
  } catch (error) {
    console.error('Erro ao gerar metadata SEO:', error);
    return {
      title: 'Equipamentos Power Run',
      description: 'Equipamentos profissionais Power Run com tecnologia de ponta.',
    };
  }
}

/**
 * Gera paths estáticos para as páginas prioritárias
 * LIMITADO para evitar stack overflow - resto será gerado via ISR
 * 
 * Estratégia:
 * - Pré-renderizar apenas: top 50 cidades × top 5 keywords × todos produtos
 * - Resto será gerado sob demanda via ISR (dynamicParams = true)
 */
export async function generateStaticParams() {
  const locales: Array<'pt-BR' | 'en' | 'es'> = ['pt-BR', 'en', 'es'];

  // TODOS os produtos (31 produtos) - INCLUINDO VARIANTES
  const allProductIds = MOCK_EQUIPMENT.map(eq => eq.id);

  console.log(`📦 Total de produtos para SEO: ${allProductIds.length} (incluindo todas as variantes)`);

  const paths: Array<{
    locale: string;
    productId: string;
    keyword: string;
    citySlug: string;
  }> = [];

  // MODO MÁXIMO ATIVADO - Limites otimizados para build
  // Pré-renderizar páginas prioritárias, resto via ISR sob demanda
  const MAX_CITIES_FOR_PRERENDER = 50; // TOP 50 cidades por locale (mais importantes)
  const MAX_KEYWORDS_FOR_PRERENDER = 5; // TOP 5 keywords por produto (alto volume)

  // Gerar paths para cada locale
  for (const locale of locales) {
    let cities: InternationalCity[] = [];

    // MODO MÁXIMO: Pré-renderizar TOP cidades (resto via ISR)
    if (locale === 'pt-BR') {
      // Brasil: TOP 50 cidades mais importantes (São Paulo, Rio, etc)
      cities = await getBrazilianCitiesWithPopulation(100000, MAX_CITIES_FOR_PRERENDER);
      console.log(`🇧🇷 [${locale}] ${cities.length} cidades brasileiras TOP para pré-renderização`);
    } else if (locale === 'en') {
      // EUA: TOP 50 cidades (NY, LA, Chicago, etc)
      cities = await getUSPriorityCities(MAX_CITIES_FOR_PRERENDER);
      console.log(`🇺🇸 [${locale}] ${cities.length} cidades dos EUA TOP para pré-renderização`);
    } else if (locale === 'es') {
      // América Latina: TOP 50 cidades (CDMX, Buenos Aires, etc)
      cities = await getLatinAmericaPriorityCities(MAX_CITIES_FOR_PRERENDER);
      console.log(`🇲🇽🇦🇷🇨🇴🇨🇱 [${locale}] ${cities.length} cidades da América Latina TOP para pré-renderização`);
    }

    // Gerar paths para TODOS os produtos
    for (const productId of allProductIds) {
      try {
        const { data: equipment } = await fetchEquipmentById(productId, locale);
        if (!equipment) {
          console.warn(`⚠️ Equipamento ${productId} não encontrado para locale ${locale}`);
          continue;
        }

        // Usar keywords expandidas para SEO máximo (30-50 keywords por produto)
        const useExpandedKeywords = process.env.NEXT_PUBLIC_SEO_MAX_MODE === 'true';
        
        let keywords: SEOKeyword[];
        try {
          if (useExpandedKeywords) {
            // Modo expandido: 30-50 keywords por produto
            keywords = locale === 'pt-BR'
              ? generateExpandedKeywords(equipment)
              : generateExpandedInternationalKeywords(equipment, locale as 'en' | 'es');
          } else {
            // Modo padrão: usar sistema atual
            keywords = generateInternationalKeywords(equipment, locale);
          }
        } catch (error) {
          console.error(`❌ Erro ao gerar keywords para ${productId} em ${locale}:`, error);
          // Fallback: usar sistema padrão
          keywords = generateInternationalKeywords(equipment, locale);
        }

        // MODO MÁXIMO: Top 5 keywords de maior prioridade para pré-renderização
        // Keywords com maior volume de busca e intenção comercial
        const topKeywords = keywords
          .sort((a, b) => b.priority - a.priority) // Ordenar por prioridade
          .slice(0, MAX_KEYWORDS_FOR_PRERENDER) // Top 5 keywords mais importantes
          .map((k) => generateSEOSlug(k.keyword));

        if (topKeywords.length === 0) {
          console.warn(`⚠️ Nenhuma keyword encontrada para ${productId} em ${locale}`);
          continue;
        }

        for (const city of cities) {
          for (const keyword of topKeywords) {
            paths.push({
              locale,
              productId,
              keyword,
              citySlug: city.slug,
            });
          }
        }
      } catch (error) {
        console.error(`❌ Erro ao gerar paths para ${productId}:`, error);
      }
    }
  }

  console.log(`\n✅ ${paths.length.toLocaleString('pt-BR')} páginas SEO serão pré-renderizadas (build-time)`);
  console.log(`📊 Detalhamento:`);
  console.log(`   - Produtos: ${allProductIds.length}`);
  console.log(`   - Locales: ${locales.length}`);
  console.log(`   - Cidades por locale: ${MAX_CITIES_FOR_PRERENDER} (TOP mais importantes)`);
  console.log(`   - Keywords por produto: ${MAX_KEYWORDS_FOR_PRERENDER} (maior volume)`);
  console.log(`\n🚀 MODO MÁXIMO ATIVADO!`);
  console.log(`   📈 1.3M+ páginas disponíveis via ISR (geradas sob demanda)`);
  console.log(`   🗺️ Todas as 1.3M+ URLs nos sitemaps para crawlers descobrirem`);
  console.log(`   ⚡ Build otimizado - sem stack overflow`);
  
  return paths;
}

// Configuração: Gerar páginas sob demanda (evita stack overflow)
export const dynamic = 'force-dynamic'; // Gerar sob demanda
export const dynamicParams = true; // Permite todas as combinações
export const revalidate = 86400; // Cache por 24 horas

export default async function SEOCityPage({ params }: Props) {
  const { locale, productId, keyword, citySlug } = await params;

  // Validar locale suportado - retornar 404 para locales não suportados
  if (!SUPPORTED_SEO_LOCALES.includes(locale as 'pt-BR' | 'en' | 'es')) {
    console.error('[SEO Page] Locale não suportado:', locale);
    notFound();
  }

  try {
    // Buscar dados no servidor com tratamento de erros individual
    const [equipmentResult, city] = await Promise.all([
      fetchEquipmentById(productId, locale).catch((error) => {
        console.error('[SEO Page] Erro ao buscar equipamento:', {
          productId,
          error: error.message,
        });
        return { data: null };
      }),
      getCityBySlug(citySlug),
    ]);

    const equipment = equipmentResult?.data;

    // Log para debug (apenas em desenvolvimento)
    if (process.env.NODE_ENV === 'development') {
      console.log('[SEO Page] Debug:', {
        productId,
        citySlug,
        locale,
        equipmentFound: !!equipment,
        cityFound: !!city,
      });
    }

    // Se não encontrar equipamento ou cidade, retornar 404
    if (!equipment) {
      console.error('[SEO Page] Equipamento não encontrado:', productId);
      notFound();
    }

    if (!city) {
      console.error('[SEO Page] Cidade não encontrada:', citySlug);
      notFound();
    }

    // Validar se equipment tem propriedades necessárias
    if (!equipment.name || !equipment.id) {
      console.error('[SEO Page] Equipamento com dados incompletos:', equipment);
      notFound();
    }

    // ✅ TRADUZIR EQUIPAMENTO NO SERVIDOR antes de passar para o cliente
    const translatedEquipment = await translateEquipmentOnServer(equipment, locale);

    // Buscar equipamentos relacionados e traduzir
    const { data: allEquipments } = await fetchEquipments({ locale, category: '', line: undefined });
    const filteredRelated = allEquipments
      .filter((eq) => eq.category === equipment.category && eq.id !== productId)
      .slice(0, 3);
    
    // Traduzir todos os equipamentos relacionados em paralelo
    const translatedRelatedEquipments = await Promise.all(
      filteredRelated.map((eq) => translateEquipmentOnServer(eq, locale))
    );

    // Breadcrumb items para structured data (traduzidos no servidor)
    // Usar fallback para pt-BR se tradução não estiver disponível
    let tSeoServer, tNavServer;
    try {
      tSeoServer = await getTranslations({ locale, namespace: 'seo' });
      tNavServer = await getTranslations({ locale, namespace: 'nav' });
    } catch (error) {
      console.warn('[SEO Page] Erro ao carregar traduções, usando fallback pt-BR:', error);
      // Fallback para pt-BR se tradução não estiver disponível
      tSeoServer = await getTranslations({ locale: 'pt-BR', namespace: 'seo' });
      tNavServer = await getTranslations({ locale: 'pt-BR', namespace: 'nav' });
    }
    const breadcrumbItems = [
      { name: tSeoServer('breadcrumbHome'), url: `/${locale}` },
      { name: tNavServer('equipamentos'), url: `/${locale}/equipamentos` },
      { name: translatedEquipment.name, url: `/${locale}/equipamentos/${equipment.id}` },
      { name: `${city.name} - ${city.stateCode}`, url: '#' },
    ];

    // Verificar se é exportação (não é Brasil)
    const isExport = city.countryCode !== 'BR';

    // Decodificar keyword para usar nas traduções
    const decodedKeyword = keyword.replace(/-/g, ' ');

    // Preparar todas as traduções necessárias para evitar hydration mismatch
    // Garantir que todas as traduções são resolvidas no servidor com o locale correto
    const translations = {
      // Breadcrumb
      breadcrumbHome: tSeoServer('breadcrumbHome'),
      equipamentos: tNavServer('equipamentos'),
      
      // SEO Content
      titleIn: tSeoServer('titleIn'),
      verDetalhesCompletos: tSeoServer('verDetalhesCompletos'),
      solicitarOrcamento: tSeoServer('solicitarOrcamento'),
      imagemNaoDisponivel: tSeoServer('imagemNaoDisponivel'),
      whatsappMessage: tSeoServer('whatsappMessage', { 
        equipmentName: translatedEquipment.name, 
        cityFullName: city.fullName 
      }),
      
      // SEO Sections
      title: tSeoServer('title', { 
        equipmentName: translatedEquipment.name, 
        cityFullName: city.fullName 
      }),
      searchingFor: tSeoServer('searchingFor', { 
        keyword: decodedKeyword, 
        cityName: city.name, 
        stateCode: city.stateCode 
      }),
      powerRunDescription: tSeoServer('powerRunDescription', { 
        cityFullName: city.fullName, 
        stateName: city.state 
      }),
      powerRunDescriptionExport: tSeoServer('powerRunDescriptionExport', { 
        cityFullName: city.fullName, 
        stateName: city.state 
      }),
      whyChooseTitle: tSeoServer('whyChooseTitle', { cityName: city.name }),
      
      // Benefits
      benefitNational: tSeoServer('benefitNational'),
      benefitNationalExport: tSeoServer('benefitNationalExport'),
      benefitNationalDesc: tSeoServer('benefitNationalDesc'),
      benefitNationalDescExport: tSeoServer('benefitNationalDescExport'),
      benefitQuality: tSeoServer('benefitQuality'),
      benefitQualityExport: tSeoServer('benefitQualityExport'),
      benefitQualityDesc: tSeoServer('benefitQualityDesc'),
      benefitQualityDescExport: tSeoServer('benefitQualityDescExport'),
      benefitDelivery: tSeoServer('benefitDelivery', { cityFullName: city.fullName }),
      benefitDeliveryExport: tSeoServer('benefitDeliveryExport', { cityFullName: city.fullName }),
      benefitDeliveryDesc: tSeoServer('benefitDeliveryDesc'),
      benefitDeliveryDescExport: tSeoServer('benefitDeliveryDescExport'),
      benefitSupport: tSeoServer('benefitSupport'),
      benefitSupportDesc: tSeoServer('benefitSupportDesc'),
      benefitWarranty: tSeoServer('benefitWarranty'),
      benefitWarrantyExport: tSeoServer('benefitWarrantyExport'),
      benefitWarrantyDesc: tSeoServer('benefitWarrantyDesc'),
      benefitWarrantyDescExport: tSeoServer('benefitWarrantyDescExport'),
      
      // Other sections
      specificationsTitle: tSeoServer('specificationsTitle', { 
        equipmentName: translatedEquipment.name 
      }),
      requestQuoteTitle: tSeoServer('requestQuoteTitle', { cityName: city.name }),
      requestQuoteDescription: tSeoServer('requestQuoteDescription', { 
        equipmentName: translatedEquipment.name, 
        cityFullName: city.fullName, 
        stateName: city.state 
      }),
      otherEquipmentsTitle: tSeoServer('otherEquipmentsTitle', { cityName: city.name }),
    };

    // FAQ para SEO (melhores práticas 2025) - conteúdo diferenciado para exportação
    const faqs = [
      {
        question: locale === 'pt-BR' 
          ? `Onde comprar ${translatedEquipment.name} em ${city.fullName}?`
          : locale === 'en'
          ? `Where to buy ${translatedEquipment.name} in ${city.fullName}?`
          : `¿Dónde comprar ${translatedEquipment.name} en ${city.fullName}?`,
        answer: locale === 'pt-BR'
          ? `A Power Run oferece entrega de ${translatedEquipment.name} para ${city.fullName} e toda a região de ${city.state}. Entre em contato conosco para solicitar um orçamento personalizado.`
          : locale === 'en'
          ? `Power Run offers delivery of ${translatedEquipment.name} to ${city.fullName} and throughout the ${city.state} region. Contact us to request a personalized quote.`
          : `Power Run ofrece entrega de ${translatedEquipment.name} a ${city.fullName} y toda la región de ${city.state}. Contáctenos para solicitar una cotización personalizada.`,
      },
      {
        question: locale === 'pt-BR'
          ? `Qual o preço do ${translatedEquipment.name}?`
          : locale === 'en'
          ? `What is the price of ${translatedEquipment.name}?`
          : `¿Cuál es el precio de ${translatedEquipment.name}?`,
        answer: locale === 'pt-BR'
          ? `Entre em contato com nossa equipe comercial para receber um orçamento personalizado do ${translatedEquipment.name} com condições especiais de pagamento e entrega para ${city.fullName}.`
          : locale === 'en'
          ? `Contact our commercial team to receive a personalized quote for ${translatedEquipment.name} with special payment and delivery conditions for ${city.fullName}.`
          : `Contacte a nuestro equipo comercial para recibir una cotización personalizada de ${translatedEquipment.name} con condiciones especiales de pago y entrega para ${city.fullName}.`,
      },
      {
        question: locale === 'pt-BR'
          ? `A Power Run entrega ${translatedEquipment.name} em ${city.name}?`
          : locale === 'en'
          ? `Does Power Run deliver ${translatedEquipment.name} to ${city.name}?`
          : `¿Power Run entrega ${translatedEquipment.name} en ${city.name}?`,
        answer: isExport
          ? (locale === 'pt-BR'
            ? `Sim! A Power Run realiza envio internacional de ${translatedEquipment.name} para ${city.fullName} e em toda a região de ${city.state}. Oferecemos logística internacional confiável com prazos competitivos.`
            : locale === 'en'
            ? `Yes! Power Run ships ${translatedEquipment.name} internationally to ${city.fullName} and throughout ${city.state}. We offer reliable international logistics with competitive delivery times.`
            : `¡Sí! Power Run realiza envío internacional de ${translatedEquipment.name} a ${city.fullName} y en toda la región de ${city.state}. Ofrecemos logística internacional confiable con plazos competitivos.`)
          : (locale === 'pt-BR'
            ? `Sim! A Power Run realiza entrega de ${translatedEquipment.name} em ${city.fullName} e em todo o ${city.state}. Oferecemos logística nacional com prazos competitivos.`
            : locale === 'en'
            ? `Yes! Power Run delivers ${translatedEquipment.name} to ${city.fullName} and throughout ${city.state}. We offer national logistics with competitive deadlines.`
            : `¡Sí! Power Run realiza entrega de ${translatedEquipment.name} a ${city.fullName} y en todo ${city.state}. Ofrecemos logística nacional con plazos competitivos.`),
      },
      {
        question: locale === 'pt-BR'
          ? `Quais as garantias do ${translatedEquipment.name}?`
          : locale === 'en'
          ? `What are the warranties for ${translatedEquipment.name}?`
          : `¿Cuáles son las garantías de ${translatedEquipment.name}?`,
        answer: isExport
          ? (locale === 'pt-BR'
            ? `Todos os equipamentos Power Run possuem garantia de fábrica. O ${translatedEquipment.name} é projetado para durar anos de uso intensivo com qualidade profissional.`
            : locale === 'en'
            ? `All Power Run equipment has factory warranty. ${translatedEquipment.name} is designed to last for years of intensive use with professional quality.`
            : `Todos los equipos Power Run tienen garantía de fábrica. ${translatedEquipment.name} está diseñado para durar años de uso intensivo con calidad profesional.`)
          : (locale === 'pt-BR'
            ? `Todos os equipamentos Power Run possuem garantia de fábrica. O ${translatedEquipment.name} conta com assistência técnica especializada e suporte pós-venda em ${city.fullName}.`
            : locale === 'en'
            ? `All Power Run equipment has factory warranty. ${translatedEquipment.name} includes specialized technical assistance and after-sales support in ${city.fullName}.`
            : `Todos los equipos Power Run tienen garantía de fábrica. ${translatedEquipment.name} cuenta con asistencia técnica especializada y soporte postventa en ${city.fullName}.`),
      },
    ];

    return (
      <>
        {/* Structured Data para SEO - Renderizado no servidor (SEO 2025) */}
        <ProductStructuredData
          product={{
            name: `${translatedEquipment.name} - ${city.fullName}`,
            description: translatedEquipment.shortDescription || translatedEquipment.description,
            image: translatedEquipment.images?.[0] || '',
            category: translatedEquipment.category,
            brand: translatedEquipment.brand || 'Power Run',
            model: translatedEquipment.id,
            sku: translatedEquipment.id,
          }}
        />
        <ServiceStructuredData
          product={{
            name: translatedEquipment.name,
            description: translatedEquipment.shortDescription || translatedEquipment.description,
            image: translatedEquipment.images?.[0] || '',
            category: translatedEquipment.category,
          }}
          city={{
            name: city.name,
            stateCode: city.stateCode,
            country: city.country,
            countryCode: city.countryCode,
            latitude: city.latitude,
            longitude: city.longitude,
          }}
          keyword={keyword}
          locale={locale}
        />
        <BreadcrumbStructuredData items={breadcrumbItems} />
        <FAQStructuredData faqs={faqs} />
        <SEOCityPageClient
          equipment={translatedEquipment}
          city={city}
          keyword={keyword}
          relatedEquipments={translatedRelatedEquipments}
          locale={locale}
          translations={translations}
          allCities={getAllCities()}
        />
      </>
    );
  } catch (error) {
    // Log detalhado do erro para debug
    console.error('[SEO Page] Erro ao carregar página SEO:', {
      productId,
      keyword,
      citySlug,
      locale,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    // Retornar 404 imediatamente
    notFound();
  }
}
