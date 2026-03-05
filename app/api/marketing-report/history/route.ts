import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação via cookie de admin
    const adminSession = request.cookies.get('admin_session');
    if (!adminSession?.value) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    const logs = await prisma.marketingReportLog.findMany({
      orderBy: { sentAt: 'desc' },
      take: limit,
    });

    // Estatísticas resumidas
    const totalLogs = await prisma.marketingReportLog.count();
    const successCount = await prisma.marketingReportLog.count({
      where: { status: 'success' },
    });
    const failedCount = await prisma.marketingReportLog.count({
      where: { status: 'failed' },
    });

    // Últimas falhas
    const recentFailures = await prisma.marketingReportLog.findMany({
      where: { status: 'failed' },
      orderBy: { sentAt: 'desc' },
      take: 5,
    });

    return NextResponse.json({
      logs,
      stats: {
        total: totalLogs,
        success: successCount,
        failed: failedCount,
        successRate: totalLogs > 0 ? Number(((successCount / totalLogs) * 100).toFixed(2)) : 0,
      },
      recentFailures,
    });
  } catch (error: any) {
    console.error('Erro ao buscar histórico de relatórios:', error);
    return NextResponse.json(
      {
        error: 'Erro ao buscar histórico',
        message: error.message || 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}

