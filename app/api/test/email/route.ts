import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/services/email';

export async function GET(request: NextRequest) {
  try {
    // Verificar variáveis de ambiente
    const envCheck = {
      SMTP_HOST: !!process.env.SMTP_HOST,
      SMTP_PORT: !!process.env.SMTP_PORT,
      SMTP_SECURE: !!process.env.SMTP_SECURE,
      SMTP_USER: !!process.env.SMTP_USER,
      SMTP_PASSWORD: !!process.env.SMTP_PASSWORD,
      SMTP_FROM: !!process.env.SMTP_FROM,
      NODE_ENV: process.env.NODE_ENV,
    };

    // Tentar verificar conexão
    let connectionStatus = false;
    let connectionError = null;
    try {
      connectionStatus = await emailService.verifyConnection();
    } catch (error: any) {
      connectionError = error.message;
    }

    // Processar lista de emails de notificação
    const notificationEmails = process.env.NOTIFICATION_EMAILS
      ? process.env.NOTIFICATION_EMAILS.split(',').map(email => email.trim()).filter(email => email.length > 0)
      : ['rogerio@vibromak.com.br'];

    // Tentar enviar email de teste para todos os destinatários
    let emailSent = false;
    let emailError = null;
    let emailsProcessed: Array<{ email: string; sent: boolean; error?: string }> = [];

    try {
      await emailService.sendBulkEmail({
        to: notificationEmails,
        subject: '🧪 Teste de Email - Power Run',
        html: `
          <h1>Teste de Email</h1>
          <p>Este é um email de teste enviado do sistema Power Run.</p>
          <p><strong>Ambiente:</strong> ${process.env.NODE_ENV}</p>
          <p><strong>Data/Hora:</strong> ${new Date().toISOString()}</p>
          <p><strong>Total de destinatários:</strong> ${notificationEmails.length}</p>
          <p>Se você recebeu este email, o sistema de envio está funcionando corretamente! ✅</p>
        `,
      });
      emailSent = true;
      emailsProcessed = notificationEmails.map(email => ({ email, sent: true }));
    } catch (error: any) {
      emailError = error.message;
      emailsProcessed = notificationEmails.map(email => ({ email, sent: false, error: error.message }));
    }

    return NextResponse.json({
      success: emailSent,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
      },
      envVariables: envCheck,
      connection: {
        status: connectionStatus,
        error: connectionError,
      },
      emailTest: {
        sent: emailSent,
        error: emailError,
        notificationEmails: notificationEmails,
        emailsProcessed: emailsProcessed,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

