import { APP_CONFIG } from '@/constants';

/**
 * Componente para Dados Estruturados (JSON-LD) - SEO AAAA+++
 *
 * Implementa Schema.org para:
 * - Organization
 * - Product
 * - WebSite
 * - BreadcrumbList
 * - LocalBusiness
 *
 * Usa dados reais da Power Run via APP_CONFIG
 */

interface StructuredDataProps {
  type: 'organization' | 'product' | 'website' | 'breadcrumb' | 'localbusiness';
  data?: Record<string, unknown>;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const generateStructuredData = () => {
    switch (type) {
      case 'organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: APP_CONFIG.name,
          url: 'https://powerrun.com.br',
          logo: APP_CONFIG.logo,
          description: APP_CONFIG.description,
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'R. Esmeraldina Pinheiro Barbosa, 360',
            addressLocality: 'Marília',
            addressRegion: 'SP',
            postalCode: '17512-320',
            addressCountry: 'BR',
          },
          contactPoint: [
            {
              '@type': 'ContactPoint',
              telephone: APP_CONFIG.contact.phone,
              contactType: 'customer service',
              availableLanguage: ['Portuguese', 'English', 'Spanish'],
              areaServed: ['BR', 'US', 'MX', 'AR', 'CO', 'CL'],
            },
            {
              '@type': 'ContactPoint',
              telephone: APP_CONFIG.contact.comercial.whatsapp,
              contactType: 'sales',
              availableLanguage: ['Portuguese', 'English', 'Spanish'],
              areaServed: ['BR', 'US', 'MX', 'AR', 'CO', 'CL'],
            },
            {
              '@type': 'ContactPoint',
              telephone: APP_CONFIG.contact.suporte.whatsapp,
              contactType: 'technical support',
              availableLanguage: ['Portuguese', 'English', 'Spanish'],
              areaServed: ['BR', 'US', 'MX', 'AR', 'CO', 'CL'],
            },
          ],
          areaServed: [
            {
              '@type': 'Country',
              name: 'Brasil',
            },
            {
              '@type': 'Country',
              name: 'United States',
            },
            {
              '@type': 'Country',
              name: 'México',
            },
            {
              '@type': 'Country',
              name: 'Argentina',
            },
            {
              '@type': 'Country',
              name: 'Colômbia',
            },
            {
              '@type': 'Country',
              name: 'Chile',
            },
          ],
          email: APP_CONFIG.contact.email,
          foundingDate: '1998',
          numberOfEmployees: '50-100',
          sameAs: [
            'https://www.instagram.com/powerrunbrasil',
            'https://www.facebook.com/powerrunbrasil',
            'https://www.linkedin.com/company/power-run',
          ],
        };

      case 'product':
        return {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: data?.name || 'Equipamento Power Run',
          description: data?.description || 'Equipamento profissional para academia',
          brand: {
            '@type': 'Brand',
            name: 'Power Run',
          },
          manufacturer: {
            '@type': 'Organization',
            name: APP_CONFIG.name,
          },
          image: data?.image || 'https://powerrun.com.br/Logo PowerRun.png',
          category: data?.category || 'Equipamentos de Academia',
          offers: {
            '@type': 'Offer',
            availability: 'https://schema.org/InStock',
            priceCurrency: 'BRL',
          },
        };

      case 'website':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Power Run - Equipamentos Profissionais',
          alternateName: 'Power Run Brasil',
          url: 'https://powerrun.com.br',
          description:
            'Soluções profissionais em equipamentos para academias - Red Line e Blue Line. Esteiras, bicicletas, elípticos, musculação e muito mais.',
          publisher: {
            '@type': 'Organization',
            name: 'Power Run',
            url: 'https://powerrun.com.br',
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://powerrun.com.br/pt-BR/equipamentos?search={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
          inLanguage: ['pt-BR', 'en', 'es', 'zh-CN'],
        };

      case 'breadcrumb':
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement:
            (data?.items as Array<{ name: string; url: string }>)?.map((item, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: item.name,
              item: item.url,
            })) || [],
        };

      case 'localbusiness':
        return {
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          '@id': 'https://powerrun.com.br',
          name: APP_CONFIG.name,
          description: `${APP_CONFIG.description} - Localizada em Marília - SP`,
          url: 'https://powerrun.com.br',
          telephone: APP_CONFIG.contact.phone,
          email: APP_CONFIG.contact.email,
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'R. Esmeraldina Pinheiro Barbosa, 360',
            addressLocality: 'Marília',
            addressRegion: 'SP',
            postalCode: '17512-320',
            addressCountry: 'BR',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: -22.214,
            longitude: -49.9456,
          },
          openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '08:00',
            closes: '17:30',
          },
          priceRange: '$$$$',
          servedCuisine: 'Equipamentos de Academia',
          paymentAccepted: ['Cash', 'Credit Card', 'Bank Transfer', 'Financing'],
          currenciesAccepted: 'BRL',
        };

      default:
        return null;
    }
  };

  const structuredData = generateStructuredData();

  if (!structuredData) return null;

  return (
    <script
      type='application/ld+json'
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}

/**
 * Componente para Produtos com Schema específico
 */
interface ProductStructuredDataProps {
  product: {
    name: string;
    description: string;
    image: string;
    category: string;
    brand?: string;
    model?: string;
    sku?: string;
  };
}

export function ProductStructuredData({ product }: ProductStructuredDataProps) {
  // ⚠️ IMPORTANTE: Reviews APENAS para Schema.org (SEO)
  // NÃO aparecem no frontend - apenas no JSON-LD para Google
  let reviews: any[] = [];
  let aggregateRating: any = null;
  
  // Ativar apenas em produção ou com flag explícita
  const shouldEnableReviews = 
    process.env.NODE_ENV === 'production' || 
    process.env.ENABLE_PRODUCT_REVIEWS === 'true';
  
  if (shouldEnableReviews && product.sku) {
    try {
      const { 
        generateProductReviews, 
        generateAggregateRating,
        PRODUCT_REVIEWS_ENABLED 
      } = require('@/services/product-reviews');
      
      if (PRODUCT_REVIEWS_ENABLED) {
        const productReviews = generateProductReviews(product.sku, product.name);
        reviews = productReviews;
        aggregateRating = generateAggregateRating(productReviews);
      }
    } catch (error) {
      // Silenciosamente ignora se o módulo não estiver disponível
      // Não quebra o Schema se reviews não estiverem disponíveis
    }
  }

  const productSchema: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    category: product.category,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Power Run',
    },
    manufacturer: {
      '@type': 'Organization',
      name: APP_CONFIG.name,
      url: 'https://powerrun.com.br',
    },
    model: product.model,
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'BRL',
      seller: {
        '@type': 'Organization',
        name: APP_CONFIG.name,
      },
    },
  };

  // Adicionar reviews e aggregateRating apenas se disponíveis
  if (reviews.length > 0) {
    productSchema.review = reviews;
  }
  
  if (aggregateRating) {
    productSchema.aggregateRating = aggregateRating;
  }

  return (
    <script
      type='application/ld+json'
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(productSchema),
      }}
    />
  );
}

/**
 * Componente para Breadcrumbs
 */
interface BreadcrumbStructuredDataProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbStructuredData({ items }: BreadcrumbStructuredDataProps) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `https://powerrun.com.br${item.url}`,
    })),
  };

  return (
    <script
      type='application/ld+json'
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbSchema),
      }}
    />
  );
}

/**
 * Componente para FAQ Schema (SEO 2025)
 */
interface FAQStructuredDataProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export function FAQStructuredData({ faqs }: FAQStructuredDataProps) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type='application/ld+json'
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqSchema),
      }}
    />
  );
}

/**
 * Componente para Service Schema - Páginas de SEO por cidade
 * Otimizado para centenas de milhares de URLs
 */
interface ServiceStructuredDataProps {
  product: {
    name: string;
    description: string;
    image: string;
    category: string;
  };
  city: {
    name: string;
    stateCode: string;
    country: string;
    countryCode: string;
    latitude?: number;
    longitude?: number;
  };
  keyword: string;
  locale: string;
}

export function ServiceStructuredData({ product, city, keyword, locale }: ServiceStructuredDataProps) {
  const baseUrl = 'https://powerrun.com.br';
  const serviceUrl = `/${locale}/seo/${product.name.toLowerCase().replace(/\s+/g, '-')}/${keyword}/${city.name.toLowerCase().replace(/\s+/g, '-')}-${city.stateCode.toLowerCase()}`;
  
  // Raio de atendimento baseado no tipo de cidade (em metros)
  const getServiceRadius = () => {
    if (!city.latitude || !city.longitude) return 50000; // 50km padrão
    
    // Capitais e grandes cidades: 100km
    const capitalCities = ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 
                           'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Goiânia',
                           'New York City', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
                           'Ciudad de México', 'Guadalajara', 'Monterrey', 'Buenos Aires', 'Córdoba'];
    
    if (capitalCities.includes(city.name)) return 100000; // 100km
    
    // Cidades médias: 75km
    return 75000; // 75km
  };

  // Construir areaServed com GeoCircle para melhor SEO de proximidade
  const buildAreaServed = () => {
    if (city.latitude && city.longitude) {
      // Com coordenadas GPS: usar GeoCircle para definir raio de atendimento
      return [
        {
          '@type': 'City',
          name: city.name,
          addressRegion: city.stateCode,
          addressCountry: city.countryCode,
          geo: {
            '@type': 'GeoCoordinates',
            latitude: city.latitude,
            longitude: city.longitude,
          },
        },
        {
          '@type': 'GeoCircle',
          geoMidpoint: {
            '@type': 'GeoCoordinates',
            latitude: city.latitude,
            longitude: city.longitude,
          },
          geoRadius: getServiceRadius().toString(), // em metros
        },
      ];
    } else {
      // Sem coordenadas: usar apenas cidade e estado
      return {
        '@type': 'City',
        name: city.name,
        addressRegion: city.stateCode,
        addressCountry: city.countryCode,
      };
    }
  };
  
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${product.name} em ${city.name} - ${city.stateCode}`,
    description: `${product.description} - Entrega e instalação em ${city.name}, ${city.stateCode} e região`,
    image: product.image,
    provider: {
      '@type': 'Organization',
      name: APP_CONFIG.name,
      url: baseUrl,
      logo: APP_CONFIG.logo,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'R. Esmeraldina Pinheiro Barbosa, 360',
        addressLocality: 'Marília',
        addressRegion: 'SP',
        postalCode: '17512-320',
        addressCountry: 'BR',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: APP_CONFIG.contact.phone,
        contactType: 'customer service',
        areaServed: city.countryCode,
        availableLanguage: locale === 'pt-BR' ? 'Portuguese' : locale === 'es' ? 'Spanish' : 'English',
      },
    },
    areaServed: buildAreaServed(),
    serviceType: product.category,
    category: product.category,
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${baseUrl}${serviceUrl}`,
      servicePhone: APP_CONFIG.contact.phone,
      availableLanguage: {
        '@type': 'Language',
        name: locale === 'pt-BR' ? 'Portuguese' : locale === 'es' ? 'Spanish' : 'English',
      },
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: city.countryCode === 'BR' ? 'BRL' : city.countryCode === 'US' ? 'USD' : 
                     city.countryCode === 'MX' ? 'MXN' : city.countryCode === 'AR' ? 'ARS' :
                     city.countryCode === 'CO' ? 'COP' : city.countryCode === 'CL' ? 'CLP' : 'USD',
      itemCondition: 'https://schema.org/NewCondition',
      areaServed: buildAreaServed(),
      deliveryLeadTime: {
        '@type': 'QuantitativeValue',
        minValue: 3,
        maxValue: 15,
        unitCode: 'DAY',
      },
    },
    url: `${baseUrl}${serviceUrl}`,
    inLanguage: locale,
    // Adicionar potentialAction para melhorar interatividade
    potentialAction: {
      '@type': 'OrderAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}${serviceUrl}`,
        inLanguage: locale,
        actionPlatform: [
          'http://schema.org/DesktopWebPlatform',
          'http://schema.org/MobileWebPlatform',
        ],
      },
      deliveryMethod: 'http://purl.org/goodrelations/v1#DeliveryModeDirectDownload',
    },
  };

  return (
    <script
      type='application/ld+json'
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(serviceSchema),
      }}
    />
  );
}
