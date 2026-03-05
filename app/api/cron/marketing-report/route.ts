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

// Função para determinar qual relatório enviar baseado no dia da semana
function getReportPeriodForToday(): ReportPeriod | null {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Domingo, 1 = Segunda, etc.
  const dayOfMonth = today.getDate();

  // Semanal: toda segunda-feira (dia 1)
  if (dayOfWeek === 1) {
    return 'weekly';
  }

  // Quinzenal: dias 1 e 16 do mês
  if (dayOfMonth === 1 || dayOfMonth === 16) {
    return 'biweekly';
  }

  // Mensal: dia 1 do mês
  if (dayOfMonth === 1) {
    return 'monthly';
  }

  return null;
}

export async function GET(request: NextRequest) {
  try {
    // Verificar se é uma requisição do Vercel Cron
    const vercelCron = request.headers.get('x-vercel-cron');
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // No Vercel, os cron jobs enviam o header 'x-vercel-cron'
    // Se não for do Vercel, verificar o Bearer token
    const isVercelCron = vercelCron === '1';
    const isAuthorized = !cronSecret || authHeader === `Bearer ${cronSecret}`;

    if (!isVercelCron && !isAuthorized) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Determinar qual relatório enviar
    const period = getReportPeriodForToday();

    if (!period) {
      return NextResponse.json({
        success: true,
        message: 'Nenhum relatório agendado para hoje',
        period: null,
      });
    }

    // Gerar relatório
    const reportData = await generateMarketingReport(period);
    const recipients = getReportRecipients();

    if (recipients.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Nenhum destinatário configurado. Defina MARKETING_REPORT_RECIPIENTS no ambiente.',
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
          triggeredBy: 'cron',
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
          triggeredBy: 'cron',
        },
      });

      // Enviar e-mail de alerta sobre a falha
      try {
        const alertHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .alert { background-color: #fee; border-left: 4px solid #f00; padding: 15px; margin: 20px 0; }
              .details { background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>⚠️ Falha no Envio de Relatório de Marketing</h2>
              <div class="alert">
                <strong>O relatório automático ${reportData.periodLabel} falhou ao ser enviado.</strong>
              </div>
              <div class="details">
                <p><strong>Período:</strong> ${reportData.periodLabel}</p>
                <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
                <p><strong>Erro:</strong> ${emailError.message || 'Erro desconhecido'}</p>
                <p><strong>Destinatários:</strong> ${recipients.join(', ')}</p>
              </div>
              <p>Por favor, verifique as configurações de e-mail e tente enviar manualmente pelo painel administrativo.</p>
            </div>
          </body>
          </html>
        `;

        await emailService.sendEmail({
          to: 'dev@opendreams.com.br', // E-mail de alerta para desenvolvedores
          subject: `⚠️ Falha: Relatório ${reportData.periodLabel} - Power Run`,
          html: alertHtml,
        });
      } catch (alertError) {
        console.error('Erro ao enviar e-mail de alerta:', alertError);
      }

      throw emailError;
    }
  } catch (error: any) {
    console.error('Erro ao enviar relatório de marketing via cron:', error);
    
    // Se ainda não foi registrado, registrar como falha
    try {
      const period = getReportPeriodForToday();
      if (period) {
        await prisma.marketingReportLog.create({
          data: {
            period,
            periodLabel: period === 'weekly' ? 'Semanal' : period === 'biweekly' ? 'Quinzenal' : 'Mensal',
            status: 'failed',
            errorMessage: error.message || 'Erro desconhecido',
            recipients: getReportRecipients(),
            triggeredBy: 'cron',
          },
        });
      }
    } catch (dbError) {
      console.error('Erro ao registrar falha no banco:', dbError);
    }

    return NextResponse.json(
      {
        error: 'Erro ao enviar relatório',
        message: error.message || 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}

