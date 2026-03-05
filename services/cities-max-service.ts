/**
 * 🚀 SERVIÇO DE CIDADES - MODO MÁXIMO
 * 
 * Serviço otimizado que usa base de dados estática
 * Não depende de APIs externas
 * Pronto para milhões de URLs de SEO
 */

import {
  ALL_CITIES_MAX,
  BRAZIL_CITIES_MAX,
  US_CITIES_MAX,
  LATAM_CITIES_MAX,
  StaticCity,
  getCitiesStats,
  getCityBySlug,
  getCitiesByCountry,
  getCitiesByLocale,
  getTopCitiesByPopulation,
  getCitiesByState,
} from '@/data/cities-static-max';

// =============================================================================
// 🎯 CONFIGURAÇÕES DO MODO MÁXIMO
// =============================================================================

const SEO_MAX_MODE = process.env.NEXT_PUBLIC_SEO_MAX_MODE === 'true';

export const MAX_MODE_CONFIG = {
  enabled: SEO_MAX_MODE,
  totalCities: ALL_CITIES_MAX.length,
  priorityCitiesForSSG: 100, // Cidades a pré-renderizar (SSG)
  citiesPerSitemap: 50000, // Limite do Google
  cacheTime: 60 * 60 * 24 * 7, // 7 dias
};

// =============================================================================
// 📊 ESTATÍSTICAS
// =============================================================================

export function getMaxModeStats() {
  const stats = getCitiesStats();
  
  return {
    ...stats,
    mode: SEO_MAX_MODE ? 'MÁXIMO' : 'PADRÃO',
    urlsPotenciais: {
      comKeywordsBasicas: stats.total * 9 * 20, // 9 produtos × 20 keywords
      comKeywordsExpandidas: stats.total * 31 * 55, // 31 produtos × 55 keywords
    },
  };
}

// =============================================================================
// 🌍 FUNÇÕES DE BUSCA DE CIDADES
// =============================================================================

/**
 * Retorna todas as cidades disponíveis
 */
export function getAllCities(): StaticCity[] {
  return ALL_CITIES_MAX;
}

/**
 * Retorna cidades prioritárias para pré-renderização (SSG)
 * Top 100 cidades por população
 */
export function getPriorityCitiesForSSG(): StaticCity[] {
  return getTopCitiesByPopulation(MAX_MODE_CONFIG.priorityCitiesForSSG);
}

/**
 * Busca cidade por slug
 */
export function findCityBySlug(slug: string): StaticCity | null {
  return getCityBySlug(slug);
}

/**
 * Busca cidades por país
 */
export function findCitiesByCountry(
  countryCode: 'BR' | 'US' | 'MX' | 'AR' | 'CO' | 'CL' | 'PE' | 'VE' | 'EC' | 'BO'
): StaticCity[] {
  return getCitiesByCountry(countryCode);
}

/**
 * Busca cidades por idioma
 */
export function findCitiesByLocale(locale: 'pt-BR' | 'en' | 'es'): StaticCity[] {
  return getCitiesByLocale(locale);
}

/**
 * Busca cidades por estado
 */
export function findCitiesByState(stateCode: string): StaticCity[] {
  return getCitiesByState(stateCode);
}

/**
 * Busca cidades para um locale específico com paginação
 */
export function findCitiesWithPagination(
  locale: 'pt-BR' | 'en' | 'es',
  page: number = 1,
  perPage: number = 100
): {
  cities: StaticCity[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
} {
  const allCitiesForLocale = getCitiesByLocale(locale);
  const total = allCitiesForLocale.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const cities = allCitiesForLocale.slice(start, end);
  
  return {
    cities,
    total,
    page,
    perPage,
    totalPages,
  };
}

// =============================================================================
// 🎯 FUNÇÕES PARA GERAÇÃO DE SITEMAPS
// =============================================================================

/**
 * Gera lista de todas as URLs de SEO possíveis
 * Usado para geração de sitemaps
 */
export function generateAllSEOUrls(
  products: string[],
  keywords: string[],
  locale: 'pt-BR' | 'en' | 'es'
): string[] {
  const cities = getCitiesByLocale(locale);
  const urls: string[] = [];
  
  products.forEach((productId) => {
    keywords.forEach((keyword) => {
      cities.forEach((city) => {
        urls.push(`/${locale}/seo/${productId}/${keyword}/${city.slug}`);
      });
    });
  });
  
  return urls;
}

/**
 * Gera URLs de SEO em chunks (para sitemaps divididos)
 */
export function* generateSEOUrlsInChunks(
  products: string[],
  keywords: string[],
  locale: 'pt-BR' | 'en' | 'es',
  chunkSize: number = 50000
): Generator<string[]> {
  const cities = getCitiesByLocale(locale);
  let chunk: string[] = [];
  
  for (const productId of products) {
    for (const keyword of keywords) {
      for (const city of cities) {
        chunk.push(`/${locale}/seo/${productId}/${keyword}/${city.slug}`);
        
        if (chunk.length >= chunkSize) {
          yield chunk;
          chunk = [];
        }
      }
    }
  }
  
  if (chunk.length > 0) {
    yield chunk;
  }
}

/**
 * Calcula quantos sitemaps serão necessários
 */
export function calculateRequiredSitemaps(
  totalProducts: number,
  totalKeywords: number,
  totalCities: number,
  urlsPerSitemap: number = 50000
): number {
  const totalUrls = totalProducts * totalKeywords * totalCities;
  return Math.ceil(totalUrls / urlsPerSitemap);
}

// =============================================================================
// 🔍 FUNÇÕES DE VALIDAÇÃO
// =============================================================================

/**
 * Valida se uma cidade existe
 */
export function validateCity(slug: string): boolean {
  return getCityBySlug(slug) !== null;
}

/**
 * Valida se uma combinação de parâmetros é válida
 */
export function validateSEOParams(params: {
  productId: string;
  keyword: string;
  citySlug: string;
}): {
  valid: boolean;
  city: StaticCity | null;
  error?: string;
} {
  const city = getCityBySlug(params.citySlug);
  
  if (!city) {
    return {
      valid: false,
      city: null,
      error: 'Cidade não encontrada',
    };
  }
  
  return {
    valid: true,
    city,
  };
}

// =============================================================================
// 📈 FUNÇÕES DE ANÁLISE
// =============================================================================

/**
 * Retorna distribuição de cidades por país
 */
export function getCitiesDistribution() {
  const stats = getCitiesStats();
  
  return {
    total: stats.total,
    porPais: stats.byCountry,
    porIdioma: stats.byLocale,
    brasil: stats.brasil,
    eua: stats.usa,
    latinoamerica: stats.latam,
  };
}

/**
 * Retorna estimativa de URLs totais que podem ser geradas
 */
export function estimateTotalURLs(
  totalProducts: number,
  totalKeywords: number
): {
  porIdioma: Record<string, number>;
  total: number;
  detalhado: {
    'pt-BR': { cidades: number; urls: number };
    'en': { cidades: number; urls: number };
    'es': { cidades: number; urls: number };
  };
} {
  const ptBRCities = getCitiesByLocale('pt-BR').length;
  const enCities = getCitiesByLocale('en').length;
  const esCities = getCitiesByLocale('es').length;
  
  const ptBRUrls = ptBRCities * totalProducts * totalKeywords;
  const enUrls = enCities * totalProducts * totalKeywords;
  const esUrls = esCities * totalProducts * totalKeywords;
  
  return {
    porIdioma: {
      'pt-BR': ptBRUrls,
      'en': enUrls,
      'es': esUrls,
    },
    total: ptBRUrls + enUrls + esUrls,
    detalhado: {
      'pt-BR': { cidades: ptBRCities, urls: ptBRUrls },
      'en': { cidades: enCities, urls: enUrls },
      'es': { cidades: esCities, urls: esUrls },
    },
  };
}

// =============================================================================
// 🎨 FUNÇÕES AUXILIARES
// =============================================================================

/**
 * Retorna cidade formatada para exibição
 */
export function formatCityForDisplay(city: StaticCity): {
  nome: string;
  nomeCompleto: string;
  estado: string;
  pais: string;
  idioma: string;
} {
  return {
    nome: city.name,
    nomeCompleto: city.fullName,
    estado: city.state,
    pais: city.country,
    idioma: city.locale,
  };
}

/**
 * Busca cidades similares (mesmo estado ou região)
 */
export function findSimilarCities(citySlug: string, limit: number = 5): StaticCity[] {
  const city = getCityBySlug(citySlug);
  if (!city) return [];
  
  const sameStateCities = getCitiesByState(city.stateCode)
    .filter((c) => c.slug !== citySlug);
  
  return sameStateCities.slice(0, limit);
}

/**
 * Retorna cidades próximas (mesmo país)
 */
export function findNearbyCities(citySlug: string, limit: number = 10): StaticCity[] {
  const city = getCityBySlug(citySlug);
  if (!city) return [];
  
  const sameCountryCities = getCitiesByCountry(city.countryCode)
    .filter((c) => c.slug !== citySlug);
  
  // Ordenar por população (cidades maiores primeiro)
  return sameCountryCities
    .sort((a, b) => (b.population || 0) - (a.population || 0))
    .slice(0, limit);
}

// =============================================================================
// 📝 LOG DE INICIALIZAÇÃO
// =============================================================================

if (SEO_MAX_MODE) {
  const stats = getMaxModeStats();
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('🚀 MODO MÁXIMO ATIVADO');
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('');
  console.log(`✅ Total de Cidades: ${stats.total.toLocaleString()}`);
  console.log(`✅ URLs Potenciais (Básico): ${stats.urlsPotenciais.comKeywordsBasicas.toLocaleString()}`);
  console.log(`✅ URLs Potenciais (Máximo): ${stats.urlsPotenciais.comKeywordsExpandidas.toLocaleString()}`);
  console.log('');
  console.log('Distribuição:');
  console.log(`   🇧🇷 Brasil: ${stats.brasil.toLocaleString()} cidades`);
  console.log(`   🇺🇸 EUA: ${stats.usa.toLocaleString()} cidades`);
  console.log(`   🌎 América Latina: ${stats.latam.toLocaleString()} cidades`);
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('');
}

// =============================================================================
// 📤 EXPORTS
// =============================================================================

export {
  ALL_CITIES_MAX as ALL_CITIES,
  BRAZIL_CITIES_MAX as BRAZIL_CITIES,
  US_CITIES_MAX as US_CITIES,
  LATAM_CITIES_MAX as LATAM_CITIES,
};

export type { StaticCity };

