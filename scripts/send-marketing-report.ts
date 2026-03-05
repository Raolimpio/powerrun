#!/usr/bin/env ts-node
/**
 * Script para enviar relatórios de marketing manualmente
 * 
 * Uso:
 *   npm run send-report weekly
 *   npm run send-report biweekly
 *   npm run send-report monthly
 */

import { generateMarketingReport, ReportPeriod } from '../lib/marketing-report';
import { generateMarketingReportEmail } from '../lib/email-templates';
import { emailService } from '../services/email';

const RECIPIENTS = [
  'rogerio@vibromak.com.br',
  'comercial@powerrun.com.br',
  'vendas@powerrun.com.br',
  'export@vibromak.com.br',
];

async function sendReport(period: ReportPeriod) {
  try {
    console.log(`📊 Gerando relatório ${period}...`);
    
    const reportData = await generateMarketingReport(period);
    console.log('✅ Relatório gerado com sucesso');

    const emailHtml = generateMarketingReportEmail(reportData);
    const subject = `Relatório de Marketing ${reportData.periodLabel} - Power Run`;

    console.log(`📧 Enviando e-mail para ${RECIPIENTS.length} destinatários...`);
    
    await emailService.sendBulkEmail({
      to: RECIPIENTS,
      subject,
      html: emailHtml,
    });

    console.log('✅ E-mail enviado com sucesso!');
    console.log(`📈 Estatísticas:`);
    console.log(`   - Visualizações: ${reportData.views.total.toLocaleString('pt-BR')}`);
    console.log(`   - Solicitações: ${reportData.quotes.total.toLocaleString('pt-BR')}`);
    console.log(`   - Taxa de Conversão: ${reportData.conversion.rate.toFixed(2)}%`);
    console.log(`   - Sessões: ${reportData.sessions.total.toLocaleString('pt-BR')}`);
  } catch (error: any) {
    console.error('❌ Erro ao enviar relatório:', error);
    process.exit(1);
  }
}

const period = process.argv[2] as ReportPeriod;

if (!period || !['weekly', 'biweekly', 'monthly'].includes(period)) {
  console.error('Uso: npm run send-report [weekly|biweekly|monthly]');
  process.exit(1);
}

sendReport(period);

