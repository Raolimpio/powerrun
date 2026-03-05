import { NextResponse } from 'next/server';
import { generateSEOUrlsForLocale, type SitemapURL } from '@/services/sitemap-generator-max';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://powerrun.com.br';

/**
 * SITEMAP SEO - LATAM (es)
 * 
 * Contém até 15.000 URLs da América Latina
 * - Top cidades (México, Argentina, Colômbia, Chile, etc)
 * - 31 produtos profissionais
 * - Top keywords em espanhol
 */

function generateSitemapXML(
  urls: Array<{
    url: string;
    lastModified: Date;
    changeFrequency: string;
    priority: number;
  }>
): string {
  const urlsXML = urls
    .map(
      (item) => `
  <url>
    <loc>${item.url}</loc>
    <lastmod>${item.lastModified.toISOString()}</lastmod>
    <changefreq>${item.changeFrequency}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXML}
</urlset>`;
}

export async function GET() {
  const startTime = process.hrtime.bigint();

  // Gerar URLs apenas da América Latina (es) usando a função nativa
  const latamUrls: SitemapURL[] = [];
  let count = 0;
  
  for (const url of generateSEOUrlsForLocale('es')) {
    latamUrls.push(url);
    count++;
    
    // Limitar a 15.000 URLs
    if (count >= 15000) {
      break;
    }
  }

  const endTime = process.hrtime.bigint();
  const durationMs = Number(endTime - startTime) / 1_000_000;

  console.log('✅ Sitemap SEO LATAM gerado!');
  console.log(`   🌎 Região: América Latina`);
  console.log(`   📊 Total de URLs: ${latamUrls.length.toLocaleString('es')}`);
  console.log(`   ⚡ Tempo: ${durationMs.toFixed(2)}ms`);

  const sitemapXML = generateSitemapXML(latamUrls);

  return new NextResponse(sitemapXML, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 1 hora

