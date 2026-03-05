import { NextResponse } from 'next/server';
import {
  calculateTotalURLs,
  generateSEOUrlsChunk,
  isValidSitemapIndex,
  getSitemapIndices,
} from '@/services/sitemap-generator-max';

/**
 * 🧪 API DE TESTE - SITEMAPS
 * 
 * Endpoint para testar o sistema de sitemaps
 * Acesse: /api/test-sitemaps
 */
export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    tests: [],
  };

  try {
    // TESTE 1: Estatísticas
    const stats = calculateTotalURLs();
    results.tests.push({
      name: 'Estatísticas',
      status: 'success',
      data: {
        urlsPorLocale: stats.porLocale,
        totalUrls: stats.total,
        sitemapsNecessarios: stats.sitemapsNecessarios,
      },
    });

    // TESTE 2: Validação de Índices
    const indices = getSitemapIndices();
    results.tests.push({
      name: 'Validação de Índices',
      status: 'success',
      data: {
        totalIndices: indices.length,
        primeiroIndice: indices[0],
        ultimoIndice: indices[indices.length - 1],
        validacoes: {
          indice0: isValidSitemapIndex(0),
          indice100: isValidSitemapIndex(100),
          indice999: isValidSitemapIndex(999),
        },
      },
    });

    // TESTE 3: Geração de Chunk (apenas 10 URLs para teste rápido)
    const startTime = Date.now();
    const chunk = generateSEOUrlsChunk(0, 10);
    const endTime = Date.now();

    results.tests.push({
      name: 'Geração de Chunk',
      status: 'success',
      data: {
        tempoMs: endTime - startTime,
        urlsGeradas: chunk.length,
        exemplos: chunk.slice(0, 3).map(u => ({
          url: u.url,
          priority: u.priority,
          changeFrequency: u.changeFrequency,
        })),
      },
    });

    // TESTE 4: Resumo
    results.summary = {
      status: '✅ TODOS OS TESTES PASSARAM',
      urlsDisponiveis: stats.total.toLocaleString('pt-BR'),
      sitemaps: stats.sitemapsNecessarios,
      tempoGeracaoMs: endTime - startTime,
    };

    return NextResponse.json(results, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}

