import { NextResponse } from 'next/server';
import {
  generateSEOUrlsChunk,
  generateSitemapXML,
} from '@/services/sitemap-generator-max';

/**
 * 🗺️ SITEMAP SEO ÚNICO - OTIMIZADO PARA RESULTADOS RÁPIDOS
 * 
 * Estratégia 2025:
 * - Foco em qualidade > quantidade
 * - Top cidades por população (melhor conversão)
 * - Keywords com maior volume de busca
 * - Geração rápida e eficiente
 * 
 * Total estimado: ~46.500 URLs (dentro do limite de 50k do Google)
 */

export async function GET() {
  try {
    console.log('🗺️ Gerando sitemap SEO otimizado...');
    
    const startTime = Date.now();
    
    // Gerar apenas as URLs mais importantes (otimizado para tamanho)
    // Google tem limite de 50MB por sitemap
    // 10k URLs = ~2-3MB (ideal para performance e aceitação do Google)
    const urls = generateSEOUrlsChunk(0, 10000);
    
    if (urls.length === 0) {
      console.warn('⚠️ Nenhuma URL gerada para o sitemap');
      return new NextResponse(
        `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`,
        {
          headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
          },
        }
      );
    }

    // Gerar XML do sitemap
    const sitemapXML = generateSitemapXML(urls);
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log(`✅ Sitemap SEO gerado com sucesso!`);
    console.log(`   📊 Total de URLs: ${urls.length.toLocaleString('pt-BR')}`);
    console.log(`   ⚡ Tempo de geração: ${duration}s`);
    console.log(`   🎯 Pronto para indexação no Google`);

    return new NextResponse(sitemapXML, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('❌ Erro ao gerar sitemap SEO:', error);
    
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`,
      {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=60, s-maxage=60',
        },
        status: 500,
      }
    );
  }
}

// Geração dinâmica para sempre ter dados atualizados
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidar a cada 1 hora
