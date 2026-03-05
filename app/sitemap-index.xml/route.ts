import { NextResponse } from 'next/server';
import { locales } from '@/i18n/routing';
import { calculateBlueLineStats, LOCALES } from '@/services/sitemap-blue-line-generator';

const baseUrl = 'https://powerrun.com.br';

export async function GET() {
  const lastmod = new Date().toISOString();
  
  // Sitemaps principais
  const mainSitemaps = [
    { loc: `${baseUrl}/sitemap.xml` },
    ...locales.map((locale) => ({ loc: `${baseUrl}/sitemap-${locale}.xml` })),
    { loc: `${baseUrl}/sitemap-equipamentos.xml` },
    { loc: `${baseUrl}/sitemap-suporte.xml` },
    { loc: `${baseUrl}/sitemap-seo.xml` },
  ];

  // Calcular e adicionar todos os sitemaps Blue Line diretamente
  const blueLineSitemaps: string[] = [];
  
  for (const locale of LOCALES) {
    try {
      const stats = await calculateBlueLineStats(locale, {
        useExpandedKeywords: true,
        maxKeywordsPerProduct: 50,
      });

      const localePrefix = locale === 'pt-BR' ? 'br' : locale === 'en' ? 'us' : 'latam';

      // Adicionar cada sitemap Blue Line individual diretamente
      for (let i = 0; i < stats.sitemapsNecessarios; i++) {
        blueLineSitemaps.push(`  <sitemap>
    <loc>${baseUrl}/sitemap-blue-line-${localePrefix}-${i}.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`);
      }
    } catch (error) {
      console.error(`❌ Erro ao calcular stats Blue Line para ${locale}:`, error);
    }
  }

  // Combinar todos os sitemaps
  const allSitemaps = [
    ...mainSitemaps.map(
      (sitemap) => `  <sitemap>
    <loc>${sitemap.loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`
    ),
    ...blueLineSitemaps,
  ];

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allSitemaps.join('\n')}
</sitemapindex>`;

  console.log(`✅ Sitemap Index gerado com ${allSitemaps.length} sitemaps (${blueLineSitemaps.length} Blue Line)`);

  return new NextResponse(sitemapIndex, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
