import { NextResponse } from 'next/server';
import {
  generateBlueLineUrlsChunk,
  generateSitemapXML,
  MAX_URLS_PER_SITEMAP,
} from '@/services/sitemap-blue-line-generator';

/**
 * SITEMAP BLUE LINE - ROTA CATCH-ALL
 * 
 * Processa todas as variações:
 * - /sitemap-blue-line/br/0.xml
 * - /sitemap-blue-line/us/1.xml
 * - /sitemap-blue-line/latam/0.xml
 * 
 * E também:
 * - /sitemap-blue-line-br-0.xml (via rewrite no next.config)
 */

interface RouteParams {
  params: Promise<{
    params: string[];
  }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const pathSegments = resolvedParams?.params || [];
    
    // Formato esperado: ['br', '0'] ou ['us', '1'] ou ['latam', '0']
    if (pathSegments.length < 2) {
      return new NextResponse('Invalid sitemap path', { status: 400 });
    }

    const region = pathSegments[0]; // br, us, latam
    const indexStr = pathSegments[1]?.replace('.xml', '') || '0'; // Remove .xml se presente
    const chunkIndex = parseInt(indexStr, 10);

    if (isNaN(chunkIndex) || chunkIndex < 0) {
      console.error(`❌ Índice inválido: ${indexStr}`);
      return new NextResponse('Invalid sitemap index', { status: 400 });
    }

    // Mapear região para locale
    const regionMap: Record<string, 'pt-BR' | 'en' | 'es'> = {
      br: 'pt-BR',
      us: 'en',
      latam: 'es',
    };

    const locale = regionMap[region] || 'pt-BR';
    const startTime = process.hrtime.bigint();

    const urls = await generateBlueLineUrlsChunk(
      locale,
      chunkIndex,
      MAX_URLS_PER_SITEMAP,
      {
        useExpandedKeywords: true,
        maxKeywordsPerProduct: 50,
        maxCities: region === 'br' ? undefined : 1000,
      }
    );

    const endTime = process.hrtime.bigint();
    const durationMs = Number(endTime - startTime) / 1_000_000;

    const regionName = region === 'br' ? '🇧🇷 Brasil' : region === 'us' ? '🇺🇸 EUA' : '🇲🇽🇦🇷🇨🇴🇨🇱 América Latina';

    console.log(`✅ Sitemap Blue Line gerado!`);
    console.log(`   ${regionName} (${locale})`);
    console.log(`   📊 URLs: ${urls.length.toLocaleString('pt-BR')}`);
    console.log(`   📄 Chunk: ${chunkIndex}`);
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
    console.error(`❌ Erro ao gerar sitemap Blue Line:`, error);
    return new NextResponse('Erro ao gerar sitemap', { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 3600;

