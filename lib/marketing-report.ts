import { prisma } from '@/lib/prisma';
import { format, subDays, startOfDay, endOfDay, startOfYear } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export type ReportPeriod = 'weekly' | 'biweekly' | 'monthly';

interface ComparisonData {
  value: number;
  previousValue: number;
  variation: number;
  variationPercentage: number;
}

export interface MarketingReportData {
  period: ReportPeriod;
  startDate: Date;
  endDate: Date;
  previousStartDate: Date;
  previousEndDate: Date;
  periodLabel: string;
  yearStartDate: Date;
  views: {
    total: number;
    totalComparison: ComparisonData;
    totalYear: number;
    byDevice: Array<{ device: string; count: number; percentage: number }>;
    byLocale: Array<{ locale: string; count: number; percentage: number }>;
    byHour: Array<{ hour: number; count: number }>;
    topPages: Array<{ path: string; count: number }>;
  };
  quotes: {
    total: number;
    totalComparison: ComparisonData;
    totalYear: number;
    byPage: Array<{ path: string; count: number }>;
    byProduct: Array<{ productId: string; productName: string | null; count: number }>;
    byCity: Array<{ city: string; count: number }>;
    byType: Array<{ type: string; count: number }>;
  };
  conversion: {
    rate: number;
    rateComparison: ComparisonData;
    rateYear: number;
    views: number;
    clicks: number;
  };
  sessions: {
    total: number;
    totalComparison: ComparisonData;
    totalYear: number;
    avgDuration: number;
    avgPageViews: number;
    withConversions: number;
    conversionRate: number;
    conversionRateComparison: ComparisonData;
  };
  traffic: {
    bySources: Array<{ source: string; count: number; percentage: number }>;
    byMedium: Array<{ medium: string; count: number; percentage: number }>;
    byType: {
      paid: { views: number; conversions: number; conversionRate: number; percentage: number };
      organic: { views: number; conversions: number; conversionRate: number; percentage: number };
      seo: { views: number; conversions: number; conversionRate: number; percentage: number };
      direct: { views: number; conversions: number; conversionRate: number; percentage: number };
      social: { views: number; conversions: number; conversionRate: number; percentage: number };
    };
  };
  engagement: {
    avgPageDuration: number;
    avgScrollDepth: number;
  };
  timeline: Array<{ date: string; views: number; conversions: number }>;
}

function calculateVariation(current: number, previous: number): ComparisonData {
  const variation = current - previous;
  const variationPercentage = previous > 0 ? ((variation / previous) * 100) : (current > 0 ? 100 : 0);
  
  return {
    value: current,
    previousValue: previous,
    variation,
    variationPercentage: Number(variationPercentage.toFixed(2)),
  };
}

async function getBasicStats(dateFilter: { gte: Date; lte: Date }) {
  const totalViews = await prisma.pageView.count({
    where: { timestamp: dateFilter },
  });

  const totalQuoteClicks = await prisma.quoteClick.count({
    where: { timestamp: dateFilter },
  });

  const conversionRate = totalViews > 0 ? (totalQuoteClicks / totalViews) * 100 : 0;

  let totalSessions = 0;
  let sessionsWithConversions = 0;
  let sessionConversionRate = 0;

  try {
    totalSessions = await prisma.session.count({
      where: { startTime: dateFilter },
    });

    sessionsWithConversions = await prisma.session.count({
      where: {
        startTime: dateFilter,
        conversions: { gt: 0 },
      },
    });

    sessionConversionRate = totalSessions > 0 ? (sessionsWithConversions / totalSessions) * 100 : 0;
  } catch (error) {
    // Ignore
  }

  return {
    totalViews,
    totalQuoteClicks,
    conversionRate,
    totalSessions,
    sessionsWithConversions,
    sessionConversionRate,
  };
}

export async function generateMarketingReport(period: ReportPeriod): Promise<MarketingReportData> {
  const now = new Date();
  let startDate: Date;
  let endDate: Date;
  let previousStartDate: Date;
  let previousEndDate: Date;
  let periodLabel: string;
  let daysDiff: number;

  switch (period) {
    case 'weekly':
      daysDiff = 7;
      startDate = startOfDay(subDays(now, daysDiff));
      endDate = endOfDay(now);
      previousEndDate = startOfDay(subDays(now, daysDiff));
      previousStartDate = startOfDay(subDays(now, daysDiff * 2));
      periodLabel = 'Semanal';
      break;
    case 'biweekly':
      daysDiff = 15;
      startDate = startOfDay(subDays(now, daysDiff));
      endDate = endOfDay(now);
      previousEndDate = startOfDay(subDays(now, daysDiff));
      previousStartDate = startOfDay(subDays(now, daysDiff * 2));
      periodLabel = 'Quinzenal';
      break;
    case 'monthly':
      daysDiff = 30;
      startDate = startOfDay(subDays(now, daysDiff));
      endDate = endOfDay(now);
      previousEndDate = startOfDay(subDays(now, daysDiff));
      previousStartDate = startOfDay(subDays(now, daysDiff * 2));
      periodLabel = 'Mensal';
      break;
  }

  const yearStartDate = startOfYear(now);

  const dateFilter = {
    gte: startDate,
    lte: endDate,
  };

  const previousDateFilter = {
    gte: previousStartDate,
    lte: previousEndDate,
  };

  const yearDateFilter = {
    gte: yearStartDate,
    lte: endDate,
  };

  // Buscar dados do período atual, anterior e acumulado do ano
  const [currentStats, previousStats, yearStats] = await Promise.all([
    getBasicStats(dateFilter),
    getBasicStats(previousDateFilter),
    getBasicStats(yearDateFilter),
  ]);

  // Total de visualizações (já buscado acima)
  const totalViews = currentStats.totalViews;

  // Visualizações por dispositivo
  const viewsByDevice = await prisma.pageView.groupBy({
    by: ['deviceType'],
    where: { timestamp: dateFilter },
    _count: { id: true },
  });

  // Visualizações por idioma
  const viewsByLocale = await prisma.pageView.groupBy({
    by: ['locale'],
    where: { timestamp: dateFilter },
    _count: { id: true },
  });

  // Top páginas
  const topPages = await prisma.pageView.groupBy({
    by: ['path'],
    where: { timestamp: dateFilter },
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 10,
  });

  // Visualizações por hora
  const viewsByHourRaw = await prisma.$queryRaw<Array<{ hour: number; count: bigint }>>`
    SELECT EXTRACT(HOUR FROM timestamp)::int as hour, COUNT(*)::bigint as count
    FROM "PageView"
    WHERE timestamp >= ${startDate} AND timestamp <= ${endDate}
    GROUP BY hour
    ORDER BY hour
  `;

  // Total de cliques em orçamentos (já buscado acima)
  const totalQuoteClicks = currentStats.totalQuoteClicks;

  // Cliques por página
  const quoteClicksByPage = await prisma.quoteClick.groupBy({
    by: ['pagePath'],
    where: { timestamp: dateFilter },
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 10,
  });

  // Cliques por produto
  const quoteClicksByProduct = await prisma.quoteClick.groupBy({
    by: ['productId', 'productName'],
    where: {
      timestamp: dateFilter,
      productId: { not: null },
    },
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 10,
  });

  // Cliques por cidade
  const quoteClicksByCity = await prisma.quoteClick.groupBy({
    by: ['cityName'],
    where: {
      timestamp: dateFilter,
      cityName: { not: null },
    },
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 10,
  });

  // Cliques por tipo de página
  const quoteClicksByType = await prisma.quoteClick.groupBy({
    by: ['pageType'],
    where: { timestamp: dateFilter },
    _count: { id: true },
  });

  // Taxa de conversão (já calculada acima)
  const conversionRate = currentStats.conversionRate;

  // Estatísticas de sessões
  let totalSessions = currentStats.totalSessions;
  let avgSessionDuration = 0;
  let avgPageViewsPerSession = 0;
  let sessionsWithConversions = currentStats.sessionsWithConversions;

  try {

    const avgSessionDurationResult = await prisma.session.aggregate({
      where: {
        startTime: dateFilter,
        duration: { not: null },
      },
      _avg: { duration: true },
    });

    const avgPageViewsResult = await prisma.session.aggregate({
      where: { startTime: dateFilter },
      _avg: { pageViews: true },
    });

    avgSessionDuration = Math.round(avgSessionDurationResult._avg.duration || 0);
    avgPageViewsPerSession = Number((avgPageViewsResult._avg.pageViews || 0).toFixed(1));

  } catch (error) {
    console.log('Session stats not available');
  }

  // Origem de tráfego
  let trafficSources: Array<{ source: string; count: number }> = [];
  let trafficByMedium: Array<{ medium: string; count: number }> = [];
  let trafficByType: any = {
    paid: { views: 0, conversions: 0, conversionRate: 0, percentage: 0 },
    organic: { views: 0, conversions: 0, conversionRate: 0, percentage: 0 },
    seo: { views: 0, conversions: 0, conversionRate: 0, percentage: 0 },
    direct: { views: 0, conversions: 0, conversionRate: 0, percentage: 0 },
    social: { views: 0, conversions: 0, conversionRate: 0, percentage: 0 },
  };

  try {
    const trafficSourcesRaw = await prisma.trafficSource.groupBy({
      by: ['source'],
      where: { timestamp: dateFilter },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    const trafficByMediumRaw = await prisma.trafficSource.groupBy({
      by: ['medium'],
      where: {
        timestamp: dateFilter,
        medium: { not: null },
      },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    });

    trafficSources = trafficSourcesRaw.map((t: any) => ({
      source: t.source,
      count: t._count.id,
    }));

    trafficByMedium = trafficByMediumRaw.map((t: any) => ({
      medium: t.medium || 'unknown',
      count: t._count.id,
    }));

    // Análise detalhada por tipo de tráfego
    // 1. Tráfego Pago (medium = 'cpc' ou 'cpm', ou tem gclid)
    const paidTraffic = await prisma.trafficSource.count({
      where: {
        timestamp: dateFilter,
        OR: [
          { medium: { in: ['cpc', 'cpm', 'paid'] } },
          { referrer: { contains: 'gclid' } },
        ],
      },
    });

    const paidConversionsRaw = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*)::bigint as count
      FROM "QuoteClick"
      WHERE timestamp >= ${startDate} AND timestamp <= ${endDate}
      AND (referer LIKE '%gclid%' OR referer LIKE '%utm_medium=cpc%' OR referer LIKE '%utm_medium=cpm%')
    `;
    const paidConversions = Number(paidConversionsRaw[0]?.count || 0);

    // 2. Tráfego Orgânico (source = 'organic')
    const organicTraffic = await prisma.trafficSource.count({
      where: {
        timestamp: dateFilter,
        source: 'organic',
      },
    });

    // Conversões orgânicas (sem gclid)
    const organicConversionsRaw = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*)::bigint as count
      FROM "QuoteClick"
      WHERE timestamp >= ${startDate} AND timestamp <= ${endDate}
      AND (referer LIKE '%google%' OR referer LIKE '%bing%')
      AND referer NOT LIKE '%gclid%'
    `;
    const organicConversions = Number(organicConversionsRaw[0]?.count || 0);

    // 3. Resultado de SEO (páginas com pageType = 'seo')
    const seoViews = await prisma.pageView.count({
      where: {
        timestamp: dateFilter,
        path: { contains: '/seo/' },
      },
    });

    const seoConversions = await prisma.quoteClick.count({
      where: {
        timestamp: dateFilter,
        pageType: 'seo',
      },
    });

    // 4. Tráfego Direto
    const directTraffic = await prisma.trafficSource.count({
      where: {
        timestamp: dateFilter,
        source: 'direct',
      },
    });

    const directConversions = await prisma.quoteClick.count({
      where: {
        timestamp: dateFilter,
        referer: null,
      },
    });

    // 5. Tráfego Social
    const socialTraffic = await prisma.trafficSource.count({
      where: {
        timestamp: dateFilter,
        source: 'social',
      },
    });

    const socialConversionsRaw = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*)::bigint as count
      FROM "QuoteClick"
      WHERE timestamp >= ${startDate} AND timestamp <= ${endDate}
      AND (
        referer LIKE '%facebook%' OR 
        referer LIKE '%instagram%' OR 
        referer LIKE '%twitter%' OR 
        referer LIKE '%linkedin%'
      )
    `;
    const socialConversions = Number(socialConversionsRaw[0]?.count || 0);

    // Calcular taxas de conversão e percentuais
    const totalTrafficForType = paidTraffic + organicTraffic + seoViews + directTraffic + socialTraffic;

    trafficByType = {
      paid: {
        views: paidTraffic,
        conversions: paidConversions,
        conversionRate: paidTraffic > 0 ? Number(((paidConversions / paidTraffic) * 100).toFixed(2)) : 0,
        percentage: totalTrafficForType > 0 ? Number(((paidTraffic / totalTrafficForType) * 100).toFixed(1)) : 0,
      },
      organic: {
        views: organicTraffic,
        conversions: organicConversions,
        conversionRate: organicTraffic > 0 ? Number(((organicConversions / organicTraffic) * 100).toFixed(2)) : 0,
        percentage: totalTrafficForType > 0 ? Number(((organicTraffic / totalTrafficForType) * 100).toFixed(1)) : 0,
      },
      seo: {
        views: seoViews,
        conversions: seoConversions,
        conversionRate: seoViews > 0 ? Number(((seoConversions / seoViews) * 100).toFixed(2)) : 0,
        percentage: totalTrafficForType > 0 ? Number(((seoViews / totalTrafficForType) * 100).toFixed(1)) : 0,
      },
      direct: {
        views: directTraffic,
        conversions: directConversions,
        conversionRate: directTraffic > 0 ? Number(((directConversions / directTraffic) * 100).toFixed(2)) : 0,
        percentage: totalTrafficForType > 0 ? Number(((directTraffic / totalTrafficForType) * 100).toFixed(1)) : 0,
      },
      social: {
        views: socialTraffic,
        conversions: socialConversions,
        conversionRate: socialTraffic > 0 ? Number(((socialConversions / socialTraffic) * 100).toFixed(2)) : 0,
        percentage: totalTrafficForType > 0 ? Number(((socialTraffic / totalTrafficForType) * 100).toFixed(1)) : 0,
      },
    };
  } catch (error) {
    console.log('Traffic stats not available');
  }

  // Engajamento
  let avgPageDuration = 0;
  let avgScrollDepth = 0;

  try {
    const avgPageDurationResult = await prisma.pageView.aggregate({
      where: {
        timestamp: dateFilter,
        duration: { not: null },
      },
      _avg: { duration: true },
    });

    const avgScrollDepthResult = await prisma.pageView.aggregate({
      where: {
        timestamp: dateFilter,
        scrollDepth: { not: null },
      },
      _avg: { scrollDepth: true },
    });

    avgPageDuration = Math.round(avgPageDurationResult._avg.duration || 0);
    avgScrollDepth = Math.round(avgScrollDepthResult._avg.scrollDepth || 0);
  } catch (error) {
    console.log('Engagement stats not available');
  }

  // Timeline (evolução diária)
  let timeline: Array<{ date: string; views: number; conversions: number }> = [];

  try {
    const dailyStats = await prisma.$queryRaw<Array<{ date: string; views: bigint; conversions: bigint }>>`
      SELECT 
        DATE("PageView".timestamp)::text as date,
        COUNT(DISTINCT "PageView".id)::bigint as views,
        COUNT(DISTINCT CASE WHEN "QuoteClick".id IS NOT NULL THEN "QuoteClick".id END)::bigint as conversions
      FROM "PageView"
      LEFT JOIN "QuoteClick" ON DATE("QuoteClick".timestamp) = DATE("PageView".timestamp)
      WHERE "PageView".timestamp >= ${startDate} AND "PageView".timestamp <= ${endDate}
      GROUP BY DATE("PageView".timestamp)
      ORDER BY date
    `;

    timeline = dailyStats.map((d) => ({
      date: d.date,
      views: Number(d.views),
      conversions: Number(d.conversions),
    }));
  } catch (error) {
    console.log('Timeline stats not available');
  }

  // Calcular percentuais
  const totalTraffic = trafficSources.reduce((sum, t) => sum + t.count, 0);
  const totalMedium = trafficByMedium.reduce((sum, t) => sum + t.count, 0);

  // Calcular comparações
  const viewsComparison = calculateVariation(currentStats.totalViews, previousStats.totalViews);
  const quotesComparison = calculateVariation(currentStats.totalQuoteClicks, previousStats.totalQuoteClicks);
  const conversionComparison = calculateVariation(currentStats.conversionRate, previousStats.conversionRate);
  const sessionsComparison = calculateVariation(currentStats.totalSessions, previousStats.totalSessions);
  const sessionConversionComparison = calculateVariation(
    currentStats.sessionConversionRate,
    previousStats.sessionConversionRate
  );

  return {
    period,
    startDate,
    endDate,
    previousStartDate,
    previousEndDate,
    periodLabel,
    yearStartDate,
    views: {
      total: totalViews,
      totalComparison: viewsComparison,
      totalYear: yearStats.totalViews,
      byDevice: viewsByDevice.map((v: any) => ({
        device: v.deviceType || 'Desconhecido',
        count: v._count.id,
        percentage: totalViews > 0 ? Number(((v._count.id / totalViews) * 100).toFixed(1)) : 0,
      })),
      byLocale: viewsByLocale.map((v: any) => ({
        locale: v.locale || 'Desconhecido',
        count: v._count.id,
        percentage: totalViews > 0 ? Number(((v._count.id / totalViews) * 100).toFixed(1)) : 0,
      })),
      byHour: viewsByHourRaw.map((v) => ({
        hour: v.hour,
        count: Number(v.count),
      })),
      topPages: topPages.map((p: any) => ({
        path: p.path,
        count: p._count.id,
      })),
    },
    quotes: {
      total: totalQuoteClicks,
      totalComparison: quotesComparison,
      totalYear: yearStats.totalQuoteClicks,
      byPage: quoteClicksByPage.map((q: any) => ({
        path: q.pagePath,
        count: q._count.id,
      })),
      byProduct: quoteClicksByProduct.map((q: any) => ({
        productId: q.productId || 'unknown',
        productName: q.productName,
        count: q._count.id,
      })),
      byCity: quoteClicksByCity.map((q: any) => ({
        city: q.cityName || 'unknown',
        count: q._count.id,
      })),
      byType: quoteClicksByType.map((q: any) => ({
        type: q.pageType,
        count: q._count.id,
      })),
    },
    conversion: {
      rate: Number(conversionRate.toFixed(2)),
      rateComparison: conversionComparison,
      rateYear: Number(yearStats.conversionRate.toFixed(2)),
      views: totalViews,
      clicks: totalQuoteClicks,
    },
    sessions: {
      total: totalSessions,
      totalComparison: sessionsComparison,
      totalYear: yearStats.totalSessions,
      avgDuration: avgSessionDuration,
      avgPageViews: avgPageViewsPerSession,
      withConversions: sessionsWithConversions,
      conversionRate: Number(currentStats.sessionConversionRate.toFixed(2)),
      conversionRateComparison: sessionConversionComparison,
    },
    traffic: {
      bySources: trafficSources.map((t) => ({
        source: t.source,
        count: t.count,
        percentage: totalTraffic > 0 ? Number(((t.count / totalTraffic) * 100).toFixed(1)) : 0,
      })),
      byMedium: trafficByMedium.map((t) => ({
        medium: t.medium,
        count: t.count,
        percentage: totalMedium > 0 ? Number(((t.count / totalMedium) * 100).toFixed(1)) : 0,
      })),
      byType: trafficByType,
    },
    engagement: {
      avgPageDuration,
      avgScrollDepth,
    },
    timeline,
  };
}

