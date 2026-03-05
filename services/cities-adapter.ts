/**
 * 🔄 ADAPTADOR DE SERVIÇOS DE CIDADES
 * 
 * Detecta automaticamente qual serviço usar baseado no modo configurado
 * - Modo Máximo: usa base estática (sem APIs)
 * - Modo Padrão: usa serviços com APIs
 */

import type { StaticCity } from '@/data/cities-static-max';
import type { InternationalCity } from '@/services/international-cities-full';

// Detectar modo máximo
const SEO_MAX_MODE = process.env.NEXT_PUBLIC_SEO_MAX_MODE === 'true';

// Tipo unificado
export type CityData = StaticCity | InternationalCity;

/**
 * Converte StaticCity para InternationalCity (compatibilidade)
 */
function convertStaticToInternational(city: StaticCity): InternationalCity {
  return {
    id: city.id,
    name: city.name,
    slug: city.slug,
    state: city.state,
    stateCode: city.stateCode,
    country: city.country,
    countryCode: city.countryCode as 'BR' | 'US' | 'MX' | 'AR' | 'CO' | 'CL',
    locale: city.locale,
    fullName: city.fullName,
  };
}

/**
 * Busca cidade por slug (detecta modo automaticamente)
 */
export async function getCityBySlug(slug: string): Promise<InternationalCity | null> {
  if (SEO_MAX_MODE) {
    // Modo Máximo: usar base estática
    const { findCityBySlug } = await import('@/services/cities-max-service');
    const city = findCityBySlug(slug);
    return city ? convertStaticToInternational(city) : null;
  } else {
    // Modo Padrão: usar serviço com API
    const { getCityBySlug: getCity } = await import('@/services/international-cities-full');
    return await getCity(slug);
  }
}

/**
 * Busca cidades prioritárias (detecta modo automaticamente)
 */
export async function getPriorityCities(): Promise<InternationalCity[]> {
  if (SEO_MAX_MODE) {
    // Modo Máximo: TOP 100 por população
    const { getPriorityCitiesForSSG } = await import('@/services/cities-max-service');
    const cities = getPriorityCitiesForSSG();
    return cities.map(convertStaticToInternational);
  } else {
    // Modo Padrão: cidades de fallback
    const { 
      getBrazilianCitiesExpanded,
      getUSPriorityCities,
      getLatinAmericaPriorityCities 
    } = await import('@/services/international-cities-full');
    
    const [br, us, latam] = await Promise.all([
      getBrazilianCitiesExpanded(),
      getUSPriorityCities(),
      getLatinAmericaPriorityCities(),
    ]);
    
    return [...br, ...us, ...latam];
  }
}

/**
 * Busca todas as cidades de um país
 */
export async function getCitiesByCountry(
  countryCode: 'BR' | 'US' | 'MX' | 'AR' | 'CO' | 'CL'
): Promise<InternationalCity[]> {
  if (SEO_MAX_MODE) {
    const { findCitiesByCountry } = await import('@/services/cities-max-service');
    const cities = findCitiesByCountry(countryCode as any);
    return cities.map(convertStaticToInternational);
  } else {
    const { fetchAllCitiesByCountry } = await import('@/services/international-cities-full');
    return await fetchAllCitiesByCountry(countryCode);
  }
}

/**
 * Busca todas as cidades de um locale
 */
export async function getCitiesByLocale(
  locale: 'pt-BR' | 'en' | 'es'
): Promise<InternationalCity[]> {
  if (SEO_MAX_MODE) {
    const { findCitiesByLocale } = await import('@/services/cities-max-service');
    const cities = findCitiesByLocale(locale);
    return cities.map(convertStaticToInternational);
  } else {
    const { fetchAllInternationalCities } = await import('@/services/international-cities-full');
    const allCities = await fetchAllInternationalCities();
    return allCities.filter((c) => c.locale === locale);
  }
}

/**
 * Retorna estatísticas do modo atual
 */
export async function getCurrentModeStats() {
  if (SEO_MAX_MODE) {
    const { getMaxModeStats } = await import('@/services/cities-max-service');
    return getMaxModeStats();
  } else {
    return {
      mode: 'PADRÃO',
      total: 0,
      note: 'Usando serviços com APIs',
    };
  }
}

/**
 * Valida se uma cidade existe
 */
export async function validateCityExists(slug: string): Promise<boolean> {
  const city = await getCityBySlug(slug);
  return city !== null;
}

// =============================================================================
// 📤 EXPORTS
// =============================================================================

export { SEO_MAX_MODE };

// Log do modo ativo
if (SEO_MAX_MODE) {
  console.log('🚀 [Cities Adapter] MODO MÁXIMO ativado - usando base estática');
} else {
  console.log('📊 [Cities Adapter] MODO PADRÃO ativado - usando APIs');
}

