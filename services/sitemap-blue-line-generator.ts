/**
 * 🔵 GERADOR DE SITEMAPS - LINHA BLUE (PREMIUM)
 * 
 * Sistema profissional de geração de sitemaps específico para produtos Blue Line
 * - Filtra apenas produtos da linha blue (7 produtos premium)
 * - Gera URLs para páginas SEO: /[locale]/seo/[productId]/[keyword]/[citySlug]
 * - Suporta múltiplos sitemaps (limite de 40k URLs por sitemap)
 * - Cobertura: Brasil, América Latina e EUA
 * 
 * Produtos Blue Line:
 * - power-rise-650 (Simulador de Escada)
 * - power-race-7000 (Esteira)
 * - power-race-7000-ts (Esteira Touch Screen)
 * - power-round-550 (Elíptico)
 * - power-rush-350 (Bicicleta Vertical)
 * - power-rush-450 (Bicicleta Horizontal)
 * - power-rush-250 (Bicicleta Spinning)
 */

import { MOCK_EQUIPMENT } from '@/constants/equipment-data';
import { 
  getBrazilianCitiesWithPopulation,
  getUSPriorityCities,
  getLatinAmericaPriorityCities,
  type InternationalCity
} from '@/services/international-cities-full';
import { 
  generateInternationalKeywords,
  generateExpandedInternationalKeywords
} from '@/services/international-seo-keywords';
import { generateExpandedKeywords } from '@/services/seo-keywords-expanded';
import { fetchEquipmentById } from '@/services/equipments';
import type { SEOKeyword } from '@/services/seo-keywords';

// =============================================================================
// ⚙️ CONFIGURAÇÕES
// =============================================================================

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://powerrun.com.br';
const MAX_URLS_PER_SITEMAP = 15000; // Limite seguro do Google: 15.000 URLs por sitemap (evita problemas de tamanho de arquivo)
const LOCALES: Array<'pt-BR' | 'en' | 'es'> = ['pt-BR', 'en', 'es'];

// IDs dos produtos da linha Blue (premium)
const BLUE_LINE_PRODUCT_IDS = [
  'power-rise-650',
  'power-race-7000',
  'power-race-7000-ts',
  'power-round-550',
  'power-rush-350',
  'power-rush-450',
  'power-rush-250',
] as const;

export interface SitemapURL {
  url: string;
  lastModified: Date;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

// =============================================================================
// 🏗️ FUNÇÕES AUXILIARES
// =============================================================================

/**
 * Gera slug SEO-friendly
 */
function generateSEOSlug(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Filtra apenas produtos da linha Blue
 */
function getBlueLineProducts() {
  return MOCK_EQUIPMENT.filter(equipment => 
    BLUE_LINE_PRODUCT_IDS.includes(equipment.id as any)
  );
}

/**
 * Obtém cidades para um locale específico
 */
async function getCitiesForLocale(
  locale: 'pt-BR' | 'en' | 'es',
  limit?: number
): Promise<InternationalCity[]> {
  if (locale === 'pt-BR') {
    // Brasil: Todas as cidades disponíveis (ou limitadas)
    if (limit) {
      return await getBrazilianCitiesWithPopulation(0, limit);
    }
    // Sem limite: buscar todas (pode ser muitas, então vamos limitar a 10k para performance)
    return await getBrazilianCitiesWithPopulation(0, 10000);
  } else if (locale === 'en') {
    // EUA: Cidades principais
    return await getUSPriorityCities(limit || 1000);
  } else if (locale === 'es') {
    // América Latina: Cidades principais
    return await getLatinAmericaPriorityCities(limit || 1000);
  }
  
  return [];
}

// =============================================================================
// 🎯 GERAÇÃO DE URLs
// =============================================================================

/**
 * Gera todas as URLs de SEO para produtos Blue Line de um locale específico
 */
export async function* generateBlueLineSEOUrls(
  locale: 'pt-BR' | 'en' | 'es',
  options?: {
    maxCities?: number;
    useExpandedKeywords?: boolean;
    maxKeywordsPerProduct?: number;
  }
): AsyncGenerator<SitemapURL> {
  const blueLineProducts = getBlueLineProducts();
  const cities = await getCitiesForLocale(locale, options?.maxCities);
  
  console.log(`🔵 [${locale}] Gerando URLs Blue Line: ${blueLineProducts.length} produtos × ${cities.length} cidades`);

  const useExpandedKeywords = options?.useExpandedKeywords ?? true;
  const maxKeywords = options?.maxKeywordsPerProduct;

  for (const product of blueLineProducts) {
    try {
      const { data: equipment } = await fetchEquipmentById(product.id, locale);
      if (!equipment) {
        console.warn(`⚠️ Equipamento ${product.id} não encontrado para locale ${locale}`);
        continue;
      }

      // Gerar keywords (expandidas ou padrão)
      let keywords: SEOKeyword[];
      try {
        if (useExpandedKeywords) {
          // Modo expandido: 30-50 keywords por produto
          keywords = locale === 'pt-BR'
            ? generateExpandedKeywords(equipment)
            : generateExpandedInternationalKeywords(equipment, locale as 'en' | 'es');
        } else {
          // Modo padrão: 20 keywords por produto
          keywords = generateInternationalKeywords(equipment, locale);
        }
      } catch (error) {
        console.error(`❌ Erro ao gerar keywords para ${product.id} em ${locale}:`, error);
        // Fallback: usar sistema padrão
        keywords = generateInternationalKeywords(equipment, locale);
      }

      // Limitar keywords se especificado
      const finalKeywords = maxKeywords 
        ? keywords.slice(0, maxKeywords)
        : keywords;

      // Ordenar por prioridade (mais importantes primeiro)
      const sortedKeywords = finalKeywords.sort((a, b) => b.priority - a.priority);

      for (const city of cities) {
        for (const keyword of sortedKeywords) {
          const keywordSlug = generateSEOSlug(keyword.keyword);
          const url = `${BASE_URL}/${locale}/seo/${product.id}/${keywordSlug}/${city.slug}`;
          
          yield {
            url,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: keyword.priority >= 8 ? 0.9 : 0.7,
          };
        }
      }
    } catch (error) {
      console.error(`❌ Erro ao gerar URLs para ${product.id}:`, error);
    }
  }
}

/**
 * Gera URLs em chunks (para dividir em múltiplos sitemaps)
 */
export async function* generateBlueLineUrlsInChunks(
  locale: 'pt-BR' | 'en' | 'es',
  chunkSize: number = MAX_URLS_PER_SITEMAP,
  options?: {
    maxCities?: number;
    useExpandedKeywords?: boolean;
    maxKeywordsPerProduct?: number;
  }
): AsyncGenerator<SitemapURL[]> {
  let chunk: SitemapURL[] = [];
  
  for await (const url of generateBlueLineSEOUrls(locale, options)) {
    chunk.push(url);
    
    if (chunk.length >= chunkSize) {
      yield chunk;
      chunk = [];
    }
  }
  
  // Yield último chunk se tiver URLs restantes
  if (chunk.length > 0) {
    yield chunk;
  }
}

/**
 * Gera chunk específico de URLs (para sitemap-blue-line-[locale]-[index].xml)
 */
export async function generateBlueLineUrlsChunk(
  locale: 'pt-BR' | 'en' | 'es',
  chunkIndex: number,
  chunkSize: number = MAX_URLS_PER_SITEMAP,
  options?: {
    maxCities?: number;
    useExpandedKeywords?: boolean;
    maxKeywordsPerProduct?: number;
  }
): Promise<SitemapURL[]> {
  const urls: SitemapURL[] = [];
  const startIndex = chunkIndex * chunkSize;
  const endIndex = startIndex + chunkSize;
  
  let currentIndex = 0;
  
  for await (const url of generateBlueLineSEOUrls(locale, options)) {
    if (currentIndex >= startIndex && currentIndex < endIndex) {
      urls.push(url);
    }
    
    currentIndex++;
    
    // Otimização: parar quando passar do chunk desejado
    if (currentIndex >= endIndex) {
      break;
    }
  }
  
  return urls;
}

/**
 * Calcula estatísticas de URLs para a linha Blue
 */
export async function calculateBlueLineStats(
  locale: 'pt-BR' | 'en' | 'es',
  options?: {
    maxCities?: number;
    useExpandedKeywords?: boolean;
    maxKeywordsPerProduct?: number;
  }
): Promise<{
  totalUrls: number;
  sitemapsNecessarios: number;
  produtos: number;
  cidades: number;
  keywordsPorProduto: number;
}> {
  const blueLineProducts = getBlueLineProducts();
  const cities = await getCitiesForLocale(locale, options?.maxCities);
  
  // Estimar keywords por produto
  let avgKeywordsPerProduct = 20; // Padrão
  if (options?.useExpandedKeywords) {
    avgKeywordsPerProduct = options?.maxKeywordsPerProduct || 50;
  }
  
  const totalUrls = blueLineProducts.length * cities.length * avgKeywordsPerProduct;
  const sitemapsNecessarios = Math.ceil(totalUrls / MAX_URLS_PER_SITEMAP);
  
  return {
    totalUrls,
    sitemapsNecessarios,
    produtos: blueLineProducts.length,
    cidades: cities.length,
    keywordsPorProduto: avgKeywordsPerProduct,
  };
}

// =============================================================================
// 📝 GERAÇÃO DE XML
// =============================================================================

/**
 * Converte URLs para formato XML de sitemap
 */
export function generateSitemapXML(urls: SitemapURL[]): string {
  const urlsXML = urls
    .map(
      (item) => `  <url>
    <loc>${item.url}</loc>
    <lastmod>${item.lastModified.toISOString()}</lastmod>
    <changefreq>${item.changeFrequency}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXML}
</urlset>`;
}

/**
 * Gera sitemap index XML para linha Blue
 */
export function generateBlueLineSitemapIndexXML(
  locale: 'pt-BR' | 'en' | 'es',
  totalSitemaps: number
): string {
  const sitemaps: string[] = [];
  const lastmod = new Date().toISOString();
  const localePrefix = locale === 'pt-BR' ? 'br' : locale === 'en' ? 'us' : 'latam';

  for (let i = 0; i < totalSitemaps; i++) {
    sitemaps.push(`  <sitemap>
    <loc>${BASE_URL}/sitemap-blue-line-${localePrefix}-${i}.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.join('\n')}
</sitemapindex>`;
}

// =============================================================================
// 📊 EXPORTS
// =============================================================================

export {
  MAX_URLS_PER_SITEMAP,
  LOCALES,
  BASE_URL,
  BLUE_LINE_PRODUCT_IDS,
};

