import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { emailService } from '@/services/email';
import { generateNotificationEmail } from '@/lib/notification-templates';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('🟢 [API] Recebida requisição de tracking:', {
      actionType: body.actionType,
      productId: body.productId,
      productName: body.productName,
      cityName: body.cityName,
      pagePath: body.pagePath,
      pageType: body.pageType,
    });

    const {
      pagePath,
      pageType = 'normal',
      locale,
      productId,
      productName,
      citySlug,
      cityName,
      keyword,
      referer,
      userAgent,
      ip,
      country,
      city: cityNameFromIp,
      deviceType,
      browser,
      os,
      sessionId, // Novo campo
    } = body;

    // Obter IP real do cliente
    const clientIp = ip || request.headers.get('x-forwarded-for')?.split(',')[0] || 
                     request.headers.get('x-real-ip') || 'unknown';

    const quoteClick = await prisma.quoteClick.create({
      data: {
        pagePath,
        pageType,
        locale,
        productId,
        productName,
        citySlug,
        cityName,
        keyword,
        referer,
        userAgent,
        ip: clientIp,
        country,
        city: cityNameFromIp,
        deviceType,
        browser,
        os,
        sessionId, // Adicionar sessionId
      },
    });

    console.log('🟢 [API] QuoteClick salvo no banco:', quoteClick.id);

    // Determinar canal de tráfego (SEO, Orgânico ou Pago)
    let trafficChannel: 'seo' | 'organic' | 'paid' | 'direct' | 'other' = 'other';
    
    if (sessionId) {
      try {
        // Verificar se é página SEO
        if (pagePath?.includes('/seo/') || pageType === 'seo') {
          trafficChannel = 'seo';
        } else {
          // Buscar origem de tráfego da sessão
          const trafficSource = await prisma.trafficSource.findFirst({
            where: { sessionId },
            orderBy: { timestamp: 'asc' }, // Primeira origem da sessão
          });

          if (trafficSource) {
            // Verificar se é tráfego pago
            if (
              trafficSource.medium === 'cpc' ||
              trafficSource.medium === 'cpm' ||
              trafficSource.medium === 'paid' ||
              trafficSource.campaign?.toLowerCase().includes('gclid') ||
              trafficSource.campaign?.toLowerCase().includes('ads')
            ) {
              trafficChannel = 'paid';
            } 
            // Verificar se é orgânico
            else if (trafficSource.source === 'organic') {
              trafficChannel = 'organic';
            }
            // Verificar se é direto
            else if (trafficSource.source === 'direct') {
              trafficChannel = 'direct';
            }
          }
        }
      } catch (error) {
        console.error('Erro ao buscar origem de tráfego:', error);
        // Se falhar, tenta determinar pelo pagePath
        if (pagePath?.includes('/seo/')) {
          trafficChannel = 'seo';
        }
      }
    } else {
      // Se não tem sessionId, tenta determinar pelo pagePath
      if (pagePath?.includes('/seo/')) {
        trafficChannel = 'seo';
      }
    }

    // Enviar notificação por e-mail (em background, não bloqueia a resposta)
    const notificationEmails = process.env.NOTIFICATION_EMAILS
      ? process.env.NOTIFICATION_EMAILS.split(',').map(email => email.trim()).filter(email => email.length > 0)
      : [
          'rogerio@vibromak.com.br',
          'comercial@powerrun.com.br',
          'vendas@powerrun.com.br',
          'export@vibromak.com.br',
        ];
    
    console.log('🟢 [API] Lista de emails de notificação processada:', {
      raw: process.env.NOTIFICATION_EMAILS,
      processed: notificationEmails,
      count: notificationEmails.length,
    });

    // Determinar tipo de ação (whatsapp ou quote)
    const actionType = body.actionType || 'quote'; // 'whatsapp' ou 'quote'

    console.log('🟢 [API] Preparando envio de email:', {
      actionType,
      notificationEmails,
      productName,
      cityName,
    });

    try {
      const emailHtml = generateNotificationEmail({
        type: actionType as 'whatsapp' | 'quote',
        productName: productName || undefined,
        productId: productId || undefined,
        cityName: cityName || cityNameFromIp || undefined,
        pagePath,
        pageType,
        deviceType: deviceType || undefined,
        browser: browser || undefined,
        os: os || undefined,
        referer: referer || undefined,
        trafficChannel,
        timestamp: quoteClick.timestamp,
      });

      const subject = actionType === 'whatsapp' 
        ? `Nova Mensagem WhatsApp - ${productName || 'Cliente Interessado'} - Power Run`
        : `Nova Solicitação de Orçamento - ${productName || 'Cliente Interessado'} - Power Run`;

      console.log('🟢 [API] Email HTML gerado, assunto:', subject);
      console.log('🟢 [API] Enviando email para:', notificationEmails);

      // Enviar e-mail em background (não espera resposta)
      emailService.sendBulkEmail({
        to: notificationEmails,
        subject,
        html: emailHtml,
      })
      .then(() => {
        console.log('✅ [API] Email enviado com sucesso para todos os destinatários');
      })
      .catch((error: any) => {
        console.error('❌ [API] Erro ao enviar notificação por e-mail:', {
          message: error?.message || 'Erro desconhecido',
          code: error?.code,
          stack: error?.stack,
          env: process.env.NODE_ENV,
          hasSmtpConfig: {
            host: !!process.env.SMTP_HOST,
            port: !!process.env.SMTP_PORT,
            user: !!process.env.SMTP_USER,
            password: !!process.env.SMTP_PASSWORD,
          },
        });
        // Não falha o tracking se o e-mail falhar
      });
    } catch (emailError) {
      console.error('❌ [API] Erro ao gerar/enviar notificação:', emailError);
      // Não falha o tracking se o e-mail falhar
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking quote click:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

