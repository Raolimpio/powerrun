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

    // 1. Tráfego Pago vs Orgânico
    const paidTraffic = await prisma.trafficSource.count({
      where: {
        timestamp: dateFilter,
        medium: { in: ['cpc', 'cpm', 'paid'] },
      },
    });

    const organicTraffic = await prisma.trafficSource.count({
      where: {
        timestamp: dateFilter,
        source: 'organic',
      },
    });

    // 2. Google Ads específico (medium = 'cpc' ou tem gclid)
    const googleAdsTraffic = await prisma.trafficSource.count({
      where: {
        timestamp: dateFilter,
        OR: [
          { medium: 'cpc', source: 'google' },
          { medium: 'cpc', source: { contains: 'google', mode: 'insensitive' } },
        ],
      },
    });

    // 3. Campanhas do Google Ads (por nome de campanha)
    const campaigns = await prisma.trafficSource.groupBy({
      by: ['campaign'],
      where: {
        timestamp: dateFilter,
        medium: { in: ['cpc', 'cpm'] },
        campaign: { not: null },
      },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 20,
    });

    // 4. Conversões por campanha (via sessionId)
    const campaignSessions = await prisma.trafficSource.findMany({
      where: {
        timestamp: dateFilter,
        medium: { in: ['cpc', 'cpm'] },
        campaign: { not: null },
      },
      select: {
        campaign: true,
        sessionId: true,
      },
      distinct: ['sessionId'],
    });

    // Contar conversões por campanha
    const conversionsByCampaign = new Map<string, number>();
    for (const traffic of campaignSessions) {
      if (!traffic.campaign) continue;
      
      const conversions = await prisma.quoteClick.count({
        where: {
          sessionId: traffic.sessionId,
          timestamp: dateFilter,
        },
      });
      
      const current = conversionsByCampaign.get(traffic.campaign) || 0;
      conversionsByCampaign.set(traffic.campaign, current + conversions);
    }

    // 5. Taxa de conversão por campanha
    const campaignStats = campaigns.map((camp) => {
      const visits = camp._count.id;
      const conversions = conversionsByCampaign.get(camp.campaign || '') || 0;
      const conversionRate = visits > 0 ? (conversions / visits) * 100 : 0;
      
      return {
        campaign: camp.campaign || 'Sem nome',
        visits,
        conversions,
        conversionRate: Number(conversionRate.toFixed(2)),
      };
    }).sort((a, b) => b.conversions - a.conversions);

    // 6. Tráfego por fonte paga
    const paidSources = await prisma.trafficSource.groupBy({
      by: ['source'],
      where: {
        timestamp: dateFilter,
        medium: { in: ['cpc', 'cpm', 'paid'] },
      },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    // 7. Comparação Google Ads vs Orgânico
    const googleOrganic = await prisma.trafficSource.count({
      where: {
        timestamp: dateFilter,
        source: 'organic',
        medium: 'google',
      },
    });

    return NextResponse.json({
      period,
      generatedAt: new Date().toISOString(),
      summary: {
        paidTraffic,
        organicTraffic,
        googleAdsTraffic,
        googleOrganic,
        totalTraffic: paidTraffic + organicTraffic,
      },
      campaigns: campaignStats,
      paidSources: paidSources.map(s => ({
        source: s.source,
        visits: s._count.id,
      })),
      comparison: {
        googleAds: {
          visits: googleAdsTraffic,
          conversions: campaignStats.reduce((sum, c) => sum + c.conversions, 0),
        },
        googleOrganic: {
          visits: googleOrganic,
          conversions: 0, // Seria necessário calcular
        },
      },
    });
  } catch (error) {
    console.error('Error fetching campaign stats:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas de campanhas' },
      { status: 500 }
    );
  }
}

