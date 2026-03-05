/**
 * 🗺️ GERADOR DE SITEMAPS - MODO MÁXIMO
 *
 * Sistema de geração de sitemaps para MILHÕES de URLs
 * - Suporta múltiplos arquivos de sitemap (50k URLs cada)
 * - Gera sitemap index automaticamente
 * - Usa base de dados estática (sem APIs)
 * - Otimizado para performance
 */

import { MOCK_EQUIPMENT } from '@/constants/equipment-data';
import { findCitiesByLocale } from './cities-max-service';
import { getKitKeywords } from './kit-seo-keywords';
import { getMaxKeywordsByProduct } from './seo-keywords-max';

// =============================================================================
// ⚙️ CONFIGURAÇÕES
// =============================================================================

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://powerrun.com.br';
const MAX_URLS_PER_SITEMAP = 50000; // Limite do Google
const LOCALES: Array<'pt-BR' | 'en' | 'es'> = ['pt-BR', 'en', 'es'];

export interface SitemapURL {
  url: string;
  lastModified: Date;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

// =============================================================================
// 📊 ESTATÍSTICAS E CÁLCULOS
// =============================================================================

/**
 * Calcula o total de URLs possíveis
 */
export function calculateTotalURLs(): {
  porLocale: Record<string, number>;
  total: number;
  sitemapsNecessarios: number;
} {
  const stats: Record<string, number> = {};
  let total = 0;

  for (const locale of LOCALES) {
    const cities = findCitiesByLocale(locale);
    const products = MOCK_EQUIPMENT;

    // Estimar keywords médias por produto (varia por categoria)
    const avgKeywordsPerProduct = 50; // Média de 50 keywords por produto

    const urlsForLocale = cities.length * products.length * avgKeywordsPerProduct;
    stats[locale] = urlsForLocale;
    total += urlsForLocale;
  }

  return {
    porLocale: stats,
    total,
    sitemapsNecessarios: Math.ceil(total / MAX_URLS_PER_SITEMAP),
  };
}

/**
 * Mostra estatísticas no console
 */
export function logSitemapStats() {
  const stats = calculateTotalURLs();

  console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║           🗺️  ESTATÍSTICAS DE SITEMAPS - MODO MÁXIMO            ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

  console.log('📊 URLs por Locale:');
  Object.entries(stats.porLocale).forEach(([locale, count]) => {
    console.log(`   ${locale}: ${count.toLocaleString('pt-BR')} URLs`);
  });

  console.log(`\n🌍 Total de URLs: ${stats.total.toLocaleString('pt-BR')}`);
  console.log(`📁 Sitemaps necessários: ${stats.sitemapsNecessarios}`);
  console.log(`📄 URLs por sitemap: ${MAX_URLS_PER_SITEMAP.toLocaleString('pt-BR')}\n`);
}

// =============================================================================
// 🏗️ GERAÇÃO DE URLs
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
 * Gera todas as URLs de SEO para um locale específico
 */
export function* generateSEOUrlsForLocale(locale: 'pt-BR' | 'en' | 'es'): Generator<SitemapURL> {
  const cities = findCitiesByLocale(locale);
  const products = MOCK_EQUIPMENT;

  console.log(
    `🌍 Gerando URLs para ${locale}: ${cities.length} cidades × ${products.length} produtos`
  );

  for (const product of products) {
    // Identificar categoria correta baseada no ID do produto (não usar product.category que é a linha)
    const productId = product.id.toLowerCase();
    let productCategory = '';

    if (productId.includes('esteira')) {
      productCategory = 'esteira';
    } else if (
      productId.includes('bicicleta') ||
      productId.includes('bike') ||
      productId.includes('spinning')
    ) {
      productCategory = 'bicicleta';
    } else if (productId.includes('eliptico')) {
      productCategory = 'eliptico';
    } else if (
      productId.includes('escada') ||
      productId.includes('stair') ||
      productId.includes('climber')
    ) {
      productCategory = 'escada';
    } else {
      productCategory = 'musculacao';
    }

    // Obter keywords para este produto usando a categoria correta
    const keywords = getMaxKeywordsByProduct(productCategory, locale);

    for (const city of cities) {
      for (const keyword of keywords) {
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
  }

  // === URLs SEO específicas para KITS (Red Line / Blue Line) ===
  const kitLines: Array<'red' | 'blue'> = ['red', 'blue'];

  for (const line of kitLines) {
    const kitKeywords = getKitKeywords(line, locale);

    for (const city of cities) {
      for (const keyword of kitKeywords) {
        const keywordSlug = generateSEOSlug(keyword);
        const kitPath = line === 'red' ? 'kits-red-line' : 'kits-blue-line';

        const url = `${BASE_URL}/${locale}/seo/${kitPath}/${keywordSlug}/${city.slug}`;

        yield {
          url,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        };
      }
    }
  }
}

/**
 * Gera todas as URLs de SEO (todos os locales)
 */
export function* generateAllSEOUrls(): Generator<SitemapURL> {
  for (const locale of LOCALES) {
    yield* generateSEOUrlsForLocale(locale);
  }
}

/**
 * Gera URLs em chunks (para dividir em múltiplos sitemaps)
 */
export function* generateSEOUrlsInChunks(
  chunkSize: number = MAX_URLS_PER_SITEMAP
): Generator<SitemapURL[]> {
  let chunk: SitemapURL[] = [];

  for (const url of generateAllSEOUrls()) {
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
 * Gera chunk específico de URLs (para sitemap-seo-[index].xml)
 */
export function generateSEOUrlsChunk(
  chunkIndex: number,
  chunkSize: number = MAX_URLS_PER_SITEMAP
): SitemapURL[] {
  const urls: SitemapURL[] = [];
  const startIndex = chunkIndex * chunkSize;
  const endIndex = startIndex + chunkSize;

  let currentIndex = 0;

  for (const url of generateAllSEOUrls()) {
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
 * Gera sitemap index XML
 */
export function generateSitemapIndexXML(totalSitemaps: number): string {
  const sitemaps: string[] = [];
  const lastmod = new Date().toISOString();

  for (let i = 0; i < totalSitemaps; i++) {
    sitemaps.push(`  <sitemap>
    <loc>${BASE_URL}/sitemap-seo-${i}.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.join('\n')}
</sitemapindex>`;
}

// =============================================================================
// 🚀 FUNÇÕES DE ALTO NÍVEL
// =============================================================================

/**
 * Gera array com todos os índices de sitemaps disponíveis
 */
export function getSitemapIndices(): number[] {
  const stats = calculateTotalURLs();
  return Array.from({ length: stats.sitemapsNecessarios }, (_, i) => i);
}

/**
 * Verifica se um índice de sitemap é válido
 */
export function isValidSitemapIndex(index: number): boolean {
  const stats = calculateTotalURLs();
  return index >= 0 && index < stats.sitemapsNecessarios;
}

// =============================================================================
// 📊 EXPORTS
// =============================================================================

export { MAX_URLS_PER_SITEMAP, LOCALES, BASE_URL };
