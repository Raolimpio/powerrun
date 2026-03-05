import { NextRequest, NextResponse } from 'next/server';
import { generateMarketingReport, ReportPeriod } from '@/lib/marketing-report';
import { generateMarketingReportEmail } from '@/lib/email-templates';
import { emailService } from '@/services/email';
import { prisma } from '@/lib/prisma';

function getReportRecipients(): string[] {
  const raw = process.env.MARKETING_REPORT_RECIPIENTS;
  if (raw && raw.trim()) {
    return raw.split(',').map((e) => e.trim()).filter(Boolean);
  }
  return [
    'rogerio@vibromak.com.br',
    'comercial@powerrun.com.br',
    'vendas@powerrun.com.br',
    'export@vibromak.com.br',
  ];
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const period = (body.period || 'weekly') as ReportPeriod;
    const forceSend = body.forceSend === true;

    // Verificar autenticação via cookie de admin
    const adminSession = request.cookies.get('admin_session');
    if (!adminSession?.value) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Gerar relatório
    const reportData = await generateMarketingReport(period);
    const recipients = getReportRecipients();

    if (recipients.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Nenhum destinatário configurado. Defina MARKETING_REPORT_RECIPIENTS no .env.local ou no ambiente.',
      }, { status: 400 });
    }

    // Gerar HTML do e-mail
    const emailHtml = generateMarketingReportEmail(reportData);

    // Enviar e-mail
    const subject = `Relatório de Marketing ${reportData.periodLabel} - Power Run`;
    
    try {
      await emailService.sendBulkEmail({
        to: recipients,
        subject,
        html: emailHtml,
      });

      // Registrar sucesso no banco
      await prisma.marketingReportLog.create({
        data: {
          period: reportData.period,
          periodLabel: reportData.periodLabel,
          status: 'success',
          recipients,
          triggeredBy: 'manual',
        },
      });

      return NextResponse.json({
        success: true,
        message: `Relatório ${reportData.periodLabel} enviado com sucesso`,
        period: reportData.period,
        recipients,
        sentAt: new Date().toISOString(),
      });
    } catch (emailError: any) {
      // Registrar falha no banco
      await prisma.marketingReportLog.create({
        data: {
          period: reportData.period,
          periodLabel: reportData.periodLabel,
          status: 'failed',
          errorMessage: emailError.message || 'Erro ao enviar e-mail',
          recipients,
          triggeredBy: 'manual',
        },
      });

      throw emailError;
    }
  } catch (error: any) {
    console.error('Erro ao enviar relatório de marketing:', error);
    return NextResponse.json(
      {
        error: 'Erro ao enviar relatório',
        message: error.message || 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = (searchParams.get('period') || 'weekly') as ReportPeriod;
    const preview = searchParams.get('preview') === 'true';

    // Gerar relatório
    const reportData = await generateMarketingReport(period);

    if (preview) {
      // Retornar HTML para preview
      const emailHtml = generateMarketingReportEmail(reportData);
      return new NextResponse(emailHtml, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    }

    // Retornar dados JSON
    return NextResponse.json({
      success: true,
      period: reportData.period,
      data: reportData,
    });
  } catch (error: any) {
    console.error('Erro ao gerar relatório de marketing:', error);
    return NextResponse.json(
      {
        error: 'Erro ao gerar relatório',
        message: error.message || 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}

