import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const LOGO_URL = 'https://www.opendreams.com.br/logo.svg';
const LOGO_BG_COLOR = '#18191B';

interface NotificationData {
  type: 'whatsapp' | 'quote';
  productName?: string;
  productId?: string;
  cityName?: string;
  pagePath: string;
  pageType?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
  referer?: string;
  trafficChannel?: 'seo' | 'organic' | 'paid' | 'direct' | 'other';
  timestamp: Date;
}

export function generateNotificationEmail(data: NotificationData): string {
  const timestamp = format(data.timestamp, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
  const typeLabel = data.type === 'whatsapp' ? 'WhatsApp' : 'Solicitação de Orçamento';
  
  // Determinar label e cor do canal de tráfego
  let trafficChannelLabel = 'Não identificado';
  let trafficChannelColor = '#666';
  let trafficChannelBg = '#f0f0f0';
  
  if (data.trafficChannel === 'seo') {
    trafficChannelLabel = 'SEO';
    trafficChannelColor = '#06b6d4';
    trafficChannelBg = '#cffafe';
  } else if (data.trafficChannel === 'paid') {
    trafficChannelLabel = 'Tráfego Pago';
    trafficChannelColor = '#ef4444';
    trafficChannelBg = '#fee2e2';
  } else if (data.trafficChannel === 'organic') {
    trafficChannelLabel = 'Tráfego Orgânico';
    trafficChannelColor = '#10b981';
    trafficChannelBg = '#d1fae5';
  } else if (data.trafficChannel === 'direct') {
    trafficChannelLabel = 'Acesso Direto';
    trafficChannelColor = '#6366f1';
    trafficChannelBg = '#e0e7ff';
  }
  
  const icon = data.type === 'whatsapp' 
    ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"></path>
        <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"></path>
      </svg>`
    : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>`;

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nova ${typeLabel} - Power Run</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f5f5f5;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background-color: ${LOGO_BG_COLOR};
      padding: 30px;
      text-align: center;
    }
    .header img {
      max-width: 180px;
      height: auto;
    }
    .content {
      padding: 30px;
    }
    .alert-badge {
      display: inline-block;
      background: linear-gradient(135deg, #08ded8 0%, #2ce185 100%);
      color: white;
      padding: 10px 20px;
      border-radius: 25px;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 20px;
    }
    .title {
      font-size: 24px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .title svg {
      color: #08ded8;
    }
    .info-box {
      background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
      border: 1px solid #e9ecef;
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e9ecef;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      font-weight: 600;
      color: #666;
      font-size: 14px;
    }
    .info-value {
      color: #1a1a1a;
      font-size: 14px;
      text-align: right;
      max-width: 60%;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #08ded8 0%, #2ce185 100%);
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      margin-top: 20px;
      transition: transform 0.2s;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 20px;
      text-align: center;
      border-top: 1px solid #e9ecef;
    }
    .footer-text {
      font-size: 12px;
      color: #666;
    }
    .highlight {
      color: #08ded8;
      font-weight: 600;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 20px 15px;
      }
      .info-row {
        flex-direction: column;
      }
      .info-value {
        text-align: left;
        max-width: 100%;
        margin-top: 5px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <img src="${LOGO_URL}" alt="Open Dreams" />
    </div>
    
    <div class="content">
      <div class="alert-badge">Nova ${typeLabel}</div>
      <h1 class="title">
        ${icon}
        Cliente interessado em ${data.productName || 'produto'}
      </h1>
      
      <div class="info-box">
        <div class="info-row">
          <span class="info-label">Tipo de Ação:</span>
          <span class="info-value">${typeLabel}</span>
        </div>
        ${data.productName ? `
        <div class="info-row">
          <span class="info-label">Produto:</span>
          <span class="info-value">${data.productName}</span>
        </div>
        ` : ''}
        ${data.cityName ? `
        <div class="info-row">
          <span class="info-label">Cidade:</span>
          <span class="info-value">${data.cityName}</span>
        </div>
        ` : ''}
        <div class="info-row">
          <span class="info-label">Página:</span>
          <span class="info-value">${data.pagePath}</span>
        </div>
        ${data.pageType ? `
        <div class="info-row">
          <span class="info-label">Tipo de Página:</span>
          <span class="info-value">${data.pageType === 'seo' ? 'SEO' : data.pageType === 'landing' ? 'Landing Page' : 'Normal'}</span>
        </div>
        ` : ''}
        ${data.trafficChannel ? `
        <div class="info-row">
          <span class="info-label">Canal de Tráfego:</span>
          <span class="info-value">
            <span style="display: inline-block; padding: 4px 12px; border-radius: 12px; font-weight: 600; font-size: 12px; background-color: ${trafficChannelBg}; color: ${trafficChannelColor};">
              ${trafficChannelLabel}
            </span>
          </span>
        </div>
        ` : ''}
        <div class="info-row">
          <span class="info-label">Dispositivo:</span>
          <span class="info-value">${data.deviceType === 'mobile' ? 'Mobile' : data.deviceType === 'tablet' ? 'Tablet' : 'Desktop'}</span>
        </div>
        ${data.browser ? `
        <div class="info-row">
          <span class="info-label">Navegador:</span>
          <span class="info-value">${data.browser}</span>
        </div>
        ` : ''}
        ${data.referer ? `
        <div class="info-row">
          <span class="info-label">Origem:</span>
          <span class="info-value" style="word-break: break-all;">${data.referer}</span>
        </div>
        ` : ''}
        <div class="info-row">
          <span class="info-label">Data/Hora:</span>
          <span class="info-value">${timestamp}</span>
        </div>
      </div>

      <p style="color: #666; margin-top: 20px; font-size: 14px;">
        Um cliente demonstrou interesse através de ${data.type === 'whatsapp' ? 'WhatsApp' : 'solicitação de orçamento'}.
        ${data.type === 'whatsapp' ? 'Verifique o WhatsApp para responder ao cliente.' : 'Acesse o painel administrativo para mais detalhes.'}
      </p>

      ${data.pagePath ? `
      <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.powerrun.com.br'}${data.pagePath}" class="cta-button">
        Ver Página do Produto
      </a>
      ` : ''}
    </div>

    <div class="footer">
      <p class="footer-text">
        Notificação automática gerada em ${timestamp}
      </p>
      <p class="footer-text" style="margin-top: 5px;">
        Open Dreams - Sistema de Notificações Power Run
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

