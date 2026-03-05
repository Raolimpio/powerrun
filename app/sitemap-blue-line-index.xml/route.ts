import { NextResponse } from 'next/server';
import {
  calculateBlueLineStats,
  generateBlueLineSitemapIndexXML,
  LOCALES,
} from '@/services/sitemap-blue-line-generator';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://powerrun.com.br';

/**
 * SITEMAP INDEX - LINHA BLUE
 * 
 * Lista todos os sitemaps da linha Blue Line organizados por região:
 * - Brasil (pt-BR)
 * - América Latina (es)
 * - Estados Unidos (en)
 */

export async function GET() {
  const startTime = process.hrtime.bigint();

  // Calcular estatísticas para cada locale
  const sitemapEntries: string[] = [];
  const lastmod = new Date().toISOString();

  for (const locale of LOCALES) {
    try {
      const stats = await calculateBlueLineStats(locale, {
        useExpandedKeywords: true,
        maxKeywordsPerProduct: 50, // Máximo de keywords por produto
      });

      const localePrefix = locale === 'pt-BR' ? 'br' : locale === 'en' ? 'us' : 'latam';

      // Adicionar cada sitemap individual
      for (let i = 0; i < stats.sitemapsNecessarios; i++) {
        sitemapEntries.push(`  <sitemap>
    <loc>${baseUrl}/sitemap-blue-line-${localePrefix}-${i}.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`);
      }

      console.log(`✅ [${locale}] ${stats.sitemapsNecessarios} sitemaps calculados`);
      console.log(`   📊 ${stats.totalUrls.toLocaleString('pt-BR')} URLs totais`);
      console.log(`   🏭 ${stats.produtos} produtos × ${stats.cidades.toLocaleString('pt-BR')} cidades × ${stats.keywordsPorProduto} keywords`);
    } catch (error) {
      console.error(`❌ Erro ao calcular stats para ${locale}:`, error);
    }
  }

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.join('\n')}
</sitemapindex>`;

  const endTime = process.hrtime.bigint();
  const durationMs = Number(endTime - startTime) / 1_000_000;

  console.log(`\n✅ Sitemap Index Blue Line gerado!`);
  console.log(`   📁 Total de sitemaps: ${sitemapEntries.length}`);
  console.log(`   ⚡ Tempo: ${durationMs.toFixed(2)}ms\n`);

  return new NextResponse(sitemapIndex, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 1 hora

