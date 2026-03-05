import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import {
  generateBlueLineUrlsChunk,
  generateSitemapXML,
  MAX_URLS_PER_SITEMAP,
} from '@/services/sitemap-blue-line-generator';

/**
 * SITEMAP BLUE LINE - AMÉRICA LATINA (es)
 * 
 * Rota: /sitemap-blue-line-latam-0.xml, /sitemap-blue-line-latam-1.xml, etc.
 */

interface RouteParams {
  params: Promise<{
    index: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const index = resolvedParams?.index || '0';
    const chunkIndex = parseInt(index, 10);

    if (isNaN(chunkIndex) || chunkIndex < 0) {
      console.error(`❌ Índice inválido: ${index}`);
      return new NextResponse('Invalid sitemap index', { status: 400 });
    }

    const startTime = process.hrtime.bigint();

    const urls = await generateBlueLineUrlsChunk(
      'es',
      chunkIndex,
      MAX_URLS_PER_SITEMAP,
      {
        useExpandedKeywords: true,
        maxKeywordsPerProduct: 50,
        maxCities: 1000,
      }
    );

    const endTime = process.hrtime.bigint();
    const durationMs = Number(endTime - startTime) / 1_000_000;

    console.log(`✅ Sitemap Blue Line LATAM #${chunkIndex} gerado!`);
    console.log(`   🇲🇽🇦🇷🇨🇴🇨🇱 América Latina (es)`);
    console.log(`   📊 URLs: ${urls.length.toLocaleString('pt-BR')}`);
    console.log(`   ⚡ Tempo: ${durationMs.toFixed(2)}ms`);

    if (urls.length === 0) {
      console.warn(`⚠️ Nenhuma URL gerada para chunk ${chunkIndex}`);
      return new NextResponse('Sitemap vazio', { status: 404 });
    }

    return new NextResponse(generateSitemapXML(urls), {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error(`❌ Erro ao gerar sitemap Blue Line LATAM:`, error);
    return new NextResponse('Erro ao gerar sitemap', { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const dynamicParams = true; // Permite qualquer índice
export const revalidate = 3600;

