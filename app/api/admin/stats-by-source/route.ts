import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const ADMIN_SESSION_COOKIE = 'admin_session';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get(ADMIN_SESSION_COOKIE);
    if (!session?.value) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d';
    
    const now = new Date();
    let startDate: Date;
    let endDate: Date | null = null;
    
    if (period === 'custom') {
      const startDateParam = searchParams.get('startDate');
      const endDateParam = searchParams.get('endDate');
      
      if (startDateParam) {
        startDate = new Date(startDateParam + 'T00:00:00.000Z');
      } else {
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
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

    // Helper: Obter sessionIds por origem
    const getSessionsBySource = async (sourceType: 'seo' | 'organic' | 'paid') => {
      let trafficFilter: any = {};
      
      if (sourceType === 'seo') {
        // SEO: páginas que contêm /seo/ no path
        const seoSessions = await prisma.pageView.findMany({
          where: {
            path: { contains: '/seo/' },
            timestamp: dateFilter,
          },
          select: { sessionId: true },
          distinct: ['sessionId'],
        });
        return seoSessions.map(s => s.sessionId).filter(Boolean) as string[];
      } else if (sourceType === 'paid') {
        // Pago: medium = 'cpc' ou 'cpm'
        const paidSessions = await prisma.trafficSource.findMany({
          where: {
            timestamp: dateFilter,
            medium: { in: ['cpc', 'cpm', 'paid'] },
          },
          select: { sessionId: true },
          distinct: ['sessionId'],
        });
        return paidSessions.map(s => s.sessionId).filter(Boolean) as string[];
      } else {
        // Orgânico: source = 'organic'
        const organicSessions = await prisma.trafficSource.findMany({
          where: {
            timestamp: dateFilter,
            source: 'organic',
          },
          select: { sessionId: true },
          distinct: ['sessionId'],
        });
        return organicSessions.map(s => s.sessionId).filter(Boolean) as string[];
      }
    };

    // Obter sessões por origem
    const [seoSessions, organicSessions, paidSessions] = await Promise.all([
      getSessionsBySource('seo'),
      getSessionsBySource('organic'),
      getSessionsBySource('paid'),
    ]);

    // 1. Visualizações por origem
    const viewsBySource = {
      seo: await prisma.pageView.count({
        where: {
          path: { contains: '/seo/' },
          timestamp: dateFilter,
        },
      }),
      organic: await prisma.pageView.count({
        where: {
          sessionId: { in: organicSessions },
          timestamp: dateFilter,
        },
      }),
      paid: await prisma.pageView.count({
        where: {
          sessionId: { in: paidSessions },
          timestamp: dateFilter,
        },
      }),
    };

    // 2. Conversões por origem
    const conversionsBySource = {
      seo: await prisma.quoteClick.count({
        where: {
          pageType: 'seo',
          timestamp: dateFilter,
        },
      }),
      organic: await prisma.quoteClick.count({
        where: {
          sessionId: { in: organicSessions },
          timestamp: dateFilter,
        },
      }),
      paid: await prisma.quoteClick.count({
        where: {
          sessionId: { in: paidSessions },
          timestamp: dateFilter,
        },
      }),
    };

    // 3. Produtos mais acessados por origem
    const productsBySource = {
      seo: await prisma.quoteClick.groupBy({
        by: ['productId'],
        where: {
          pageType: 'seo',
          productId: { not: null },
          timestamp: dateFilter,
        },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 20,
      }),
      organic: await prisma.quoteClick.groupBy({
        by: ['productId'],
        where: {
          sessionId: { in: organicSessions },
          productId: { not: null },
          timestamp: dateFilter,
        },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 20,
      }),
      paid: await prisma.quoteClick.groupBy({
        by: ['productId'],
        where: {
          sessionId: { in: paidSessions },
          productId: { not: null },
          timestamp: dateFilter,
        },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 20,
      }),
    };

    // 4. Cidades mais convertidas por origem
    const citiesBySource = {
      seo: await prisma.quoteClick.groupBy({
        by: ['cityName'],
        where: {
          pageType: 'seo',
          cityName: { not: null },
          timestamp: dateFilter,
        },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 20,
      }),
      organic: await prisma.quoteClick.groupBy({
        by: ['cityName'],
        where: {
          sessionId: { in: organicSessions },
          cityName: { not: null },
          timestamp: dateFilter,
        },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 20,
      }),
      paid: await prisma.quoteClick.groupBy({
        by: ['cityName'],
        where: {
          sessionId: { in: paidSessions },
          cityName: { not: null },
          timestamp: dateFilter,
        },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 20,
      }),
    };

    // 5. Taxa de conversão por origem
    const conversionRates = {
      seo: viewsBySource.seo > 0 
        ? (conversionsBySource.seo / viewsBySource.seo) * 100 
        : 0,
      organic: viewsBySource.organic > 0 
        ? (conversionsBySource.organic / viewsBySource.organic) * 100 
        : 0,
      paid: viewsBySource.paid > 0 
        ? (conversionsBySource.paid / viewsBySource.paid) * 100 
        : 0,
    };

    return NextResponse.json({
      period,
      generatedAt: new Date().toISOString(),
      views: viewsBySource,
      conversions: conversionsBySource,
      conversionRates: {
        seo: Number(conversionRates.seo.toFixed(2)),
        organic: Number(conversionRates.organic.toFixed(2)),
        paid: Number(conversionRates.paid.toFixed(2)),
      },
      products: {
        seo: productsBySource.seo.map(p => ({ productId: p.productId || 'unknown', count: p._count.id })),
        organic: productsBySource.organic.map(p => ({ productId: p.productId || 'unknown', count: p._count.id })),
        paid: productsBySource.paid.map(p => ({ productId: p.productId || 'unknown', count: p._count.id })),
      },
      cities: {
        seo: citiesBySource.seo.map(c => ({ city: c.cityName || 'unknown', count: c._count.id })),
        organic: citiesBySource.organic.map(c => ({ city: c.cityName || 'unknown', count: c._count.id })),
        paid: citiesBySource.paid.map(c => ({ city: c.cityName || 'unknown', count: c._count.id })),
      },
    });
  } catch (error) {
    console.error('Error fetching stats by source:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas por origem' },
      { status: 500 }
    );
  }
}

