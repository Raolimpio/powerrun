import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const ADMIN_SESSION_COOKIE = 'admin_session';

// Desabilitar cache completamente para garantir dados em tempo real
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação diretamente via request cookies
    const session = request.cookies.get(ADMIN_SESSION_COOKIE);
    if (!session?.value) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d'; // 7d, 30d, 90d, all, custom
    
    const now = new Date();
    let startDate: Date;
    let endDate: Date | null = null;
    
    if (period === 'custom') {
      // Período personalizado
      const startDateParam = searchParams.get('startDate');
      const endDateParam = searchParams.get('endDate');
      
      if (startDateParam) {
        startDate = new Date(startDateParam + 'T00:00:00.000Z');
      } else {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      }
      
      if (endDateParam) {
        // Adicionar 23:59:59 para incluir todo o dia final
        endDate = new Date(endDateParam + 'T23:59:59.999Z');
      }
    } else {
      switch (period) {
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(0);
      }
    }

    // Criar filtro de data dinâmico
    const dateFilter = endDate 
      ? { gte: startDate, lte: endDate }
      : { gte: startDate };

    // Estatísticas de visualizações
    const totalViews = await prisma.pageView.count({
      where: { timestamp: dateFilter },
    });

    const viewsByPath = await prisma.pageView.groupBy({
      by: ['path'],
      where: { timestamp: dateFilter },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 20,
    } as any);

    const viewsByLocale = await prisma.pageView.groupBy({
      by: ['locale'],
      where: { timestamp: dateFilter },
      _count: { id: true },
    } as any);

    const viewsByDevice = await prisma.pageView.groupBy({
      by: ['deviceType'],
      where: { timestamp: dateFilter },
      _count: { id: true },
    } as any);

    // Estatísticas de cliques em orçamentos
    const totalQuoteClicks = await prisma.quoteClick.count({
      where: { timestamp: dateFilter },
    });

    const quoteClicksByPage = await prisma.quoteClick.groupBy({
      by: ['pagePath'],
      where: { timestamp: dateFilter },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 20,
    } as any);

    const quoteClicksByType = await prisma.quoteClick.groupBy({
      by: ['pageType'],
      where: { timestamp: dateFilter },
      _count: { id: true },
    } as any);

    const quoteClicksByProduct = await prisma.quoteClick.groupBy({
      by: ['productId'],
      where: { 
        timestamp: dateFilter,
        productId: { not: null },
      },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 20,
    } as any);

    const quoteClicksByCity = await prisma.quoteClick.groupBy({
      by: ['cityName'],
      where: { 
        timestamp: dateFilter,
        cityName: { not: null },
      },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 20,
    } as any);

    // Agrupar cidades por estado - Opcional, não bloqueia a API se falhar ou demorar
    let quotesByState: Array<{ state: string; cityCount: number; totalConversions: number }> = [];
    
    try {
      // Tentar processar estados com timeout de 5 segundos
      const processStatesPromise = (async () => {
        // Importar função
        const { getStateByCityName } = await import('@/data/cities-static-max');
        const stateMap = new Map<string, { cities: Set<string>; conversions: number }>();
        
        // Usar apenas as top 50 cidades para agrupamento (mais rápido)
        const topQuoteClicksByCity = await prisma.quoteClick.groupBy({
          by: ['cityName'],
          where: { 
            timestamp: dateFilter,
            cityName: { not: null },
          },
          _count: { id: true },
          orderBy: { _count: { id: 'desc' } },
          take: 50, // Limitar para não travar
        } as any);
        
        // @ts-ignore
        topQuoteClicksByCity.forEach((cityData: any) => {
          const cityName = cityData.cityName;
          if (!cityName) return;
          
          const state = getStateByCityName(cityName);
          if (!state) return;
          
          if (!stateMap.has(state)) {
            stateMap.set(state, { cities: new Set(), conversions: 0 });
          }
          
          const stateData = stateMap.get(state)!;
          stateData.cities.add(cityName);
          stateData.conversions += cityData._count.id;
        });
        
        return Array.from(stateMap.entries())
          .map(([state, data]) => ({
            state,
            cityCount: data.cities.size,
            totalConversions: data.conversions,
          }))
          .sort((a, b) => b.cityCount - a.cityCount)
          .slice(0, 5);
      })();
      
      // Aguardar com timeout de 5 segundos
      quotesByState = await Promise.race([
        processStatesPromise,
        new Promise<Array<{ state: string; cityCount: number; totalConversions: number }>>((resolve) => 
          setTimeout(() => resolve([]), 5000)
        )
      ]);
    } catch (e) {
      // Continuar sem dados de estado - não é crítico
      console.warn('State grouping failed, continuing without it:', e);
      quotesByState = [];
    }

    // Estatísticas de conversão
    const conversionRate = totalViews > 0 ? (totalQuoteClicks / totalViews) * 100 : 0;

    // Estatísticas por hora do dia
    const viewsByHour = endDate 
      ? await prisma.$queryRaw<Array<{ hour: number; count: bigint }>>`
          SELECT EXTRACT(HOUR FROM timestamp) as hour, COUNT(*)::bigint as count
          FROM "PageView"
          WHERE timestamp >= ${startDate} AND timestamp <= ${endDate}
          GROUP BY hour
          ORDER BY hour
        `
      : await prisma.$queryRaw<Array<{ hour: number; count: bigint }>>`
          SELECT EXTRACT(HOUR FROM timestamp) as hour, COUNT(*)::bigint as count
          FROM "PageView"
          WHERE timestamp >= ${startDate}
          GROUP BY hour
          ORDER BY hour
        `;

    // NOVAS ESTATÍSTICAS AVANÇADAS - com try-catch para dados ainda não coletados
    let totalSessions = 0;
    let avgSessionDuration: any = { _avg: { duration: 0 } };
    let avgPageViewsPerSession: any = { _avg: { pageViews: 0 } };
    let sessionsWithConversions = 0;
    let trafficSources: any[] = [];
    let trafficByMedium: any[] = [];
    let avgPageDuration: any = { _avg: { duration: 0 } };
    let avgScrollDepth: any = { _avg: { scrollDepth: 0 } };
    let performanceMetrics: any[] = [];
    let exitPages: any[] = [];

    try {
      // Estatísticas de sessões
      const sessionDateFilter = endDate 
        ? { gte: startDate, lte: endDate }
        : { gte: startDate };

      totalSessions = await prisma.session.count({
        where: { startTime: sessionDateFilter },
      });

      avgSessionDuration = await prisma.session.aggregate({
        where: { 
          startTime: sessionDateFilter,
          duration: { not: null },
        },
        _avg: { duration: true },
      });

      avgPageViewsPerSession = await prisma.session.aggregate({
        where: { startTime: sessionDateFilter },
        _avg: { pageViews: true },
      });

      sessionsWithConversions = await prisma.session.count({
        where: {
          startTime: sessionDateFilter,
          conversions: { gt: 0 },
        },
      });
    } catch (e) {
      console.log('Session stats not available yet');
    }

    try {
      // Origem de tráfego
      trafficSources = await prisma.trafficSource.groupBy({
        by: ['source'],
        where: { timestamp: dateFilter },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
      } as any);

      trafficByMedium = await prisma.trafficSource.groupBy({
        by: ['medium'],
        where: {
          timestamp: dateFilter,
          medium: { not: null },
        },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      } as any);
    } catch (e) {
      console.log('Traffic stats not available yet');
    }

    try {
      // Tempo médio na página
      avgPageDuration = await prisma.pageView.aggregate({
        where: {
          timestamp: dateFilter,
          duration: { not: null },
        },
        _avg: { duration: true },
      });

      // Scroll médio
      avgScrollDepth = await prisma.pageView.aggregate({
        where: {
          timestamp: dateFilter,
          scrollDepth: { not: null },
        },
        _avg: { scrollDepth: true },
      });

      // Páginas de saída (bounce)
      exitPages = await prisma.pageView.groupBy({
        by: ['path'],
        where: {
          timestamp: dateFilter,
          exitPage: true,
        },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      } as any);
    } catch (e) {
      console.log('Engagement stats not available yet');
    }

    try {
      // Performance (Core Web Vitals)
      performanceMetrics = await prisma.performanceMetric.groupBy({
        by: ['metricName', 'rating'],
        where: { timestamp: dateFilter },
        _count: { id: true },
        _avg: { value: true },
      } as any);
    } catch (e) {
      console.log('Performance stats not available yet');
    }

    // Evolução temporal (últimos 30 dias)
    let dailyStats: Array<{ date: string; views: bigint }> = [];
    try {
      dailyStats = endDate
        ? await prisma.$queryRaw<Array<{ date: string; views: bigint }>>`
            SELECT 
              DATE("PageView".timestamp) as date,
              COUNT(DISTINCT "PageView".id)::bigint as views
            FROM "PageView"
            WHERE "PageView".timestamp >= ${startDate} AND "PageView".timestamp <= ${endDate}
            GROUP BY DATE("PageView".timestamp)
            ORDER BY date
            LIMIT 30
          `
        : await prisma.$queryRaw<Array<{ date: string; views: bigint }>>`
            SELECT 
              DATE("PageView".timestamp) as date,
              COUNT(DISTINCT "PageView".id)::bigint as views
            FROM "PageView"
            WHERE "PageView".timestamp >= ${startDate}
            GROUP BY DATE("PageView".timestamp)
            ORDER BY date
            LIMIT 30
          `;
    } catch (e) {
      console.log('Timeline stats not available yet');
    }

    const response = NextResponse.json({
      period,
      generatedAt: new Date().toISOString(),
      views: {
        total: totalViews,
        // @ts-ignore
        byPath: viewsByPath.map(v => ({ path: v.path, count: v._count.id })),
        // @ts-ignore
        byLocale: viewsByLocale.map(v => ({ locale: v.locale || 'unknown', count: v._count.id })),
        // @ts-ignore
        byDevice: viewsByDevice.map(v => ({ device: v.deviceType || 'unknown', count: v._count.id })),
        byHour: viewsByHour.map(v => ({ hour: Number(v.hour), count: Number(v.count) })),
      },
      quotes: {
        total: totalQuoteClicks,
        // @ts-ignore
        byPage: quoteClicksByPage.map(q => ({ path: q.pagePath, count: q._count.id })),
        // @ts-ignore
        byType: quoteClicksByType.map(q => ({ type: q.pageType, count: q._count.id })),
        // @ts-ignore
        byProduct: quoteClicksByProduct.map(q => ({ productId: q.productId || 'unknown', count: q._count.id })),
        // @ts-ignore
        byCity: quoteClicksByCity.map(q => ({ city: q.cityName || 'unknown', count: q._count.id })),
        byState: quotesByState,
      },
      conversion: {
        rate: Number(conversionRate.toFixed(2)),
        views: totalViews,
        clicks: totalQuoteClicks,
      },
      // NOVAS MÉTRICAS
      sessions: {
        total: totalSessions,
        avgDuration: Math.round(avgSessionDuration._avg.duration || 0),
        avgPageViews: Number((avgPageViewsPerSession._avg.pageViews || 0).toFixed(1)),
        withConversions: sessionsWithConversions,
        conversionRate: totalSessions > 0 ? Number(((sessionsWithConversions / totalSessions) * 100).toFixed(2)) : 0,
      },
      traffic: {
        bySources: trafficSources.map(t => ({ source: t.source, count: t._count.id })),
        byMedium: trafficByMedium.map(t => ({ medium: t.medium || 'unknown', count: t._count.id })),
      },
      engagement: {
        avgPageDuration: Math.round(avgPageDuration._avg.duration || 0),
        avgScrollDepth: Math.round(avgScrollDepth._avg.scrollDepth || 0),
        exitPages: exitPages.map(e => ({ path: e.path, count: e._count.id })),
      },
      performance: performanceMetrics.map(p => ({
        metric: p.metricName,
        rating: p.rating,
        count: p._count.id,
        avgValue: Number(p._avg.value?.toFixed(2) || 0),
      })),
      timeline: dailyStats.map(d => ({
        date: d.date,
        views: Number(d.views),
        conversions: 0, // Simplificado por enquanto
      })),
    });

    // Headers para prevenir cache no navegador
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Erro ao buscar estatísticas' }, { status: 500 });
  }
}

