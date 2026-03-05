import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const ADMIN_SESSION_COOKIE = 'admin_session';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = request.cookies.get(ADMIN_SESSION_COOKIE);
    if (!session?.value) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d';
    
    const now = new Date();
    let startDate: Date;
    let endDate: Date | null = null;
    
    if (period === 'custom') {
      const startDateParam = searchParams.get('startDate');
      const endDateParam = searchParams.get('endDate');
      
      if (startDateParam) {
        startDate = new Date(startDateParam + 'T00:00:00.000Z');
      } else {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      }
      
      if (endDateParam) {
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

    const dateFilter = endDate 
      ? { gte: startDate, lte: endDate }
      : { gte: startDate };

    // 1. Páginas SEO mais visitadas
    const seoPagesViews = await prisma.pageView.groupBy({
      by: ['path'],
      where: {
        path: { contains: '/seo/' },
        timestamp: dateFilter,
      },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 20,
    });

    // 2. Keywords mais buscadas (extrair do path)
    const seoPageViews = await prisma.pageView.findMany({
      where: {
        path: { contains: '/seo/' },
        timestamp: dateFilter,
      },
      select: {
        path: true,
      },
    });

    // Extrair keywords dos paths
    const keywordMap = new Map<string, number>();
    seoPageViews.forEach((pv) => {
      const parts = pv.path.split('/');
      // Formato: /[locale]/seo/[product]/[keyword]/[city]
      if (parts.length >= 5 && parts[2] === 'seo') {
        const keyword = decodeURIComponent(parts[4] || '');
        if (keyword) {
          keywordMap.set(keyword, (keywordMap.get(keyword) || 0) + 1);
        }
      }
    });

    const topKeywords = Array.from(keywordMap.entries())
      .map(([keyword, count]) => ({ keyword, views: count }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 20);

    // 3. Conversões por keyword
    const conversionsByKeyword = await prisma.quoteClick.groupBy({
      by: ['keyword'],
      where: {
        pageType: 'seo',
        keyword: { not: null },
        timestamp: dateFilter,
      },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    // 4. Conversões por cidade (SEO)
    const conversionsByCity = await prisma.quoteClick.groupBy({
      by: ['cityName'],
      where: {
        pageType: 'seo',
        cityName: { not: null },
        timestamp: dateFilter,
      },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 20,
    });

    // 5. Taxa de conversão por keyword
    const keywordConversionRates = topKeywords.map((kw) => {
      const conversions = conversionsByKeyword.find(c => c.keyword === kw.keyword)?._count.id || 0;
      const conversionRate = kw.views > 0 ? (conversions / kw.views) * 100 : 0;
      return {
        keyword: kw.keyword,
        views: kw.views,
        conversions,
        conversionRate: Number(conversionRate.toFixed(2)),
      };
    }).sort((a, b) => b.conversionRate - a.conversionRate);

    // 6. Produtos mais convertidos via SEO
    const productsBySEO = await prisma.quoteClick.groupBy({
      by: ['productId'],
      where: {
        pageType: 'seo',
        productId: { not: null },
        timestamp: dateFilter,
      },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 20,
    });

    // 7. Total de visualizações SEO vs outras
    const totalSEOViews = await prisma.pageView.count({
      where: {
        path: { contains: '/seo/' },
        timestamp: dateFilter,
      },
    });

    const totalNormalViews = await prisma.pageView.count({
      where: {
        path: { not: { contains: '/seo/' } },
        timestamp: dateFilter,
      },
    });

    // 8. Total de conversões SEO vs outras
    const totalSEOConversions = await prisma.quoteClick.count({
      where: {
        pageType: 'seo',
        timestamp: dateFilter,
      },
    });

    const totalNormalConversions = await prisma.quoteClick.count({
      where: {
        pageType: { not: 'seo' },
        timestamp: dateFilter,
      },
    });

    // 9. Taxa de conversão SEO vs Normal
    const seoConversionRate = totalSEOViews > 0 
      ? (totalSEOConversions / totalSEOViews) * 100 
      : 0;
    const normalConversionRate = totalNormalViews > 0 
      ? (totalNormalConversions / totalNormalViews) * 100 
      : 0;

    return NextResponse.json({
      period,
      generatedAt: new Date().toISOString(),
      summary: {
        totalSEOViews,
        totalNormalViews,
        totalSEOConversions,
        totalNormalConversions,
        seoConversionRate: Number(seoConversionRate.toFixed(2)),
        normalConversionRate: Number(normalConversionRate.toFixed(2)),
      },
      topPages: seoPagesViews.map(p => ({
        path: p.path,
        views: p._count.id,
      })),
      topKeywords: topKeywords,
      keywordConversions: keywordConversionRates,
      conversionsByCity: conversionsByCity.map(c => ({
        city: c.cityName || 'unknown',
        conversions: c._count.id,
      })),
      productsBySEO: productsBySEO.map(p => ({
        productId: p.productId || 'unknown',
        conversions: p._count.id,
      })),
    });
  } catch (error) {
    console.error('Error fetching SEO stats:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas SEO' },
      { status: 500 }
    );
  }
}

