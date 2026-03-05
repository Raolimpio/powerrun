import { MarketingReportData } from './marketing-report';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const LOGO_URL = 'https://www.opendreams.com.br/logo.svg';
const LOGO_BG_COLOR = '#18191B';

// Ícones SVG inline
const ICONS = {
  chart: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M3 3v18h18"></path>
    <path d="M7 16l4-4 4 4 6-6"></path>
  </svg>`,
  users: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>`,
  mouse: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <rect x="5" y="2" width="14" height="20" rx="7"></rect>
    <path d="M12 6v4"></path>
  </svg>`,
  target: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="6"></circle>
    <circle cx="12" cy="12" r="2"></circle>
  </svg>`,
  globe: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>`,
  clock: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>`,
  trending: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>`,
  activity: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>`,
};

function formatNumber(num: number): string {
  return new Intl.NumberFormat('pt-BR').format(num);
}

function formatPercentage(num: number): string {
  return `${num.toFixed(1)}%`;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}m ${secs}s`;
}

function formatComparison(comparison: { variation: number; variationPercentage: number }): string {
  const isPositive = comparison.variation >= 0;
  const sign = isPositive ? '+' : '';
  const color = isPositive ? '#2ce185' : '#e74c3c';
  const icon = isPositive ? '↑' : '↓';
  
  return `<span style="color: ${color}; font-weight: 600;">${icon} ${sign}${formatPercentage(Math.abs(comparison.variationPercentage))}</span>`;
}

function formatComparisonBadge(comparison: { variation: number; variationPercentage: number }): string {
  const isPositive = comparison.variation >= 0;
  const color = isPositive ? '#2ce185' : '#e74c3c';
  const bgColor = isPositive ? '#d4edda' : '#f8d7da';
  const sign = isPositive ? '+' : '';
  const icon = isPositive ? '↑' : '↓';
  
  return `<span class="badge" style="background-color: ${bgColor}; color: ${color};">
    ${icon} ${sign}${formatPercentage(Math.abs(comparison.variationPercentage))}
  </span>`;
}

export function generateMarketingReportEmail(data: MarketingReportData): string {
  const startDateFormatted = format(data.startDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const endDateFormatted = format(data.endDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const previousStartDateFormatted = format(data.previousStartDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const previousEndDateFormatted = format(data.previousEndDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const yearStartDateFormatted = format(data.yearStartDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const generatedAt = format(new Date(), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório de Marketing - ${data.periodLabel}</title>
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
      max-width: 800px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background-color: ${LOGO_BG_COLOR};
      padding: 40px 30px;
      text-align: center;
    }
    .header img {
      max-width: 200px;
      height: auto;
    }
    .content {
      padding: 40px 30px;
    }
    .period-badge {
      display: inline-block;
      background: linear-gradient(135deg, #08ded8 0%, #2ce185 100%);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 20px;
    }
    .title {
      font-size: 28px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 10px;
    }
    .subtitle {
      font-size: 16px;
      color: #666;
      margin-bottom: 30px;
    }
    .section {
      margin-bottom: 40px;
    }
    .section-title {
      font-size: 20px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .section-title svg {
      color: #08ded8;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
      border: 1px solid #e9ecef;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      transition: transform 0.2s;
    }
      .stat-value {
      font-size: 32px;
      font-weight: 700;
      color: #08ded8;
      margin-bottom: 5px;
    }
    .stat-label {
      font-size: 14px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .stat-comparison {
      font-size: 12px;
      margin-top: 5px;
    }
    .stat-year {
      font-size: 11px;
      color: #999;
      margin-top: 3px;
    }
    .table-container {
      overflow-x: auto;
      margin-bottom: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    thead {
      background: linear-gradient(135deg, #08ded8 0%, #2ce185 100%);
      color: white;
    }
    th {
      padding: 12px 15px;
      text-align: left;
      font-weight: 600;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    td {
      padding: 12px 15px;
      border-bottom: 1px solid #e9ecef;
      font-size: 14px;
    }
    tbody tr:hover {
      background-color: #f8f9fa;
    }
    tbody tr:last-child td {
      border-bottom: none;
    }
    .progress-bar {
      width: 100%;
      height: 8px;
      background-color: #e9ecef;
      border-radius: 4px;
      overflow: hidden;
      margin-top: 5px;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #08ded8 0%, #2ce185 100%);
      border-radius: 4px;
      transition: width 0.3s ease;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e9ecef;
    }
    .footer-text {
      font-size: 12px;
      color: #666;
      margin-bottom: 10px;
    }
    .footer-company {
      font-size: 14px;
      color: #1a1a1a;
      font-weight: 600;
    }
    .highlight {
      color: #08ded8;
      font-weight: 600;
    }
    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
    }
    .badge-success {
      background-color: #d4edda;
      color: #155724;
    }
    .badge-info {
      background-color: #d1ecf1;
      color: #0c5460;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 20px 15px;
      }
      .stats-grid {
        grid-template-columns: 1fr;
      }
      .title {
        font-size: 24px;
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
      <div class="period-badge">Relatório ${data.periodLabel}</div>
      <h1 class="title">Relatório de Marketing</h1>
      <p class="subtitle">
        Período: ${startDateFormatted} até ${endDateFormatted}
      </p>
      <p style="font-size: 14px; color: #666; margin-bottom: 30px;">
        Comparação: ${previousStartDateFormatted} até ${previousEndDateFormatted} | 
        Acumulado do Ano: ${yearStartDateFormatted} até ${endDateFormatted}
      </p>

      <!-- Métricas Principais -->
      <div class="section">
        <h2 class="section-title">
          ${ICONS.chart}
          Métricas Principais
        </h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${formatNumber(data.views.total)}</div>
            <div class="stat-label">Visualizações</div>
            <div class="stat-comparison">${formatComparison(data.views.totalComparison)} vs período anterior</div>
            <div class="stat-year">Acumulado do ano: ${formatNumber(data.views.totalYear)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${formatNumber(data.quotes.total)}</div>
            <div class="stat-label">Solicitações de Orçamento</div>
            <div class="stat-comparison">${formatComparison(data.quotes.totalComparison)} vs período anterior</div>
            <div class="stat-year">Acumulado do ano: ${formatNumber(data.quotes.totalYear)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${formatPercentage(data.conversion.rate)}</div>
            <div class="stat-label">Taxa de Conversão</div>
            <div class="stat-comparison">${formatComparison(data.conversion.rateComparison)} vs período anterior</div>
            <div class="stat-year">Acumulado do ano: ${formatPercentage(data.conversion.rateYear)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${formatNumber(data.sessions.total)}</div>
            <div class="stat-label">Sessões</div>
            <div class="stat-comparison">${formatComparison(data.sessions.totalComparison)} vs período anterior</div>
            <div class="stat-year">Acumulado do ano: ${formatNumber(data.sessions.totalYear)}</div>
          </div>
        </div>
      </div>

      <!-- Engajamento -->
      <div class="section">
        <h2 class="section-title">
          ${ICONS.clock}
          Engajamento
        </h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${formatDuration(data.engagement.avgPageDuration)}</div>
            <div class="stat-label">Tempo Médio na Página</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${formatPercentage(data.engagement.avgScrollDepth)}</div>
            <div class="stat-label">Profundidade de Scroll</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${formatDuration(data.sessions.avgDuration)}</div>
            <div class="stat-label">Duração Média da Sessão</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${data.sessions.avgPageViews.toFixed(1)}</div>
            <div class="stat-label">Páginas por Sessão</div>
          </div>
        </div>
      </div>

      <!-- Top Páginas -->
      <div class="section">
        <h2 class="section-title">
          ${ICONS.activity}
          Páginas Mais Visitadas
        </h2>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Página</th>
                <th style="text-align: right;">Visualizações</th>
              </tr>
            </thead>
            <tbody>
              ${data.views.topPages.slice(0, 10).map(page => `
                <tr>
                  <td>${page.path}</td>
                  <td style="text-align: right; font-weight: 600;">${formatNumber(page.count)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Produtos Mais Solicitados -->
      ${data.quotes.byProduct.length > 0 ? `
      <div class="section">
        <h2 class="section-title">
          ${ICONS.target}
          Produtos Mais Solicitados
        </h2>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th style="text-align: right;">Solicitações</th>
              </tr>
            </thead>
            <tbody>
              ${data.quotes.byProduct.slice(0, 10).map(product => `
                <tr>
                  <td>${product.productName || product.productId}</td>
                  <td style="text-align: right; font-weight: 600;">${formatNumber(product.count)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
      ` : ''}

      <!-- Cidades com Mais Conversões -->
      ${data.quotes.byCity.length > 0 ? `
      <div class="section">
        <h2 class="section-title">
          ${ICONS.globe}
          Cidades com Mais Conversões
        </h2>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Cidade</th>
                <th style="text-align: right;">Solicitações</th>
              </tr>
            </thead>
            <tbody>
              ${data.quotes.byCity.slice(0, 10).map(city => `
                <tr>
                  <td>${city.city}</td>
                  <td style="text-align: right; font-weight: 600;">${formatNumber(city.count)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
      ` : ''}

      <!-- Dispositivos -->
      ${data.views.byDevice.length > 0 ? `
      <div class="section">
        <h2 class="section-title">
          ${ICONS.mouse}
          Visualizações por Dispositivo
        </h2>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Dispositivo</th>
                <th style="text-align: right;">Visualizações</th>
                <th style="text-align: right;">Percentual</th>
              </tr>
            </thead>
            <tbody>
              ${data.views.byDevice.map(device => `
                <tr>
                  <td>${device.device}</td>
                  <td style="text-align: right; font-weight: 600;">${formatNumber(device.count)}</td>
                  <td style="text-align: right;">
                    <span class="badge badge-info">${formatPercentage(device.percentage)}</span>
                    <div class="progress-bar">
                      <div class="progress-fill" style="width: ${device.percentage}%"></div>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
      ` : ''}

      <!-- Análise Detalhada: Tráfego Pago vs Orgânico vs SEO -->
      <div class="section">
        <h2 class="section-title">
          ${ICONS.trending}
          Análise de Canais de Marketing
        </h2>
        <div style="background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); border: 1px solid #e9ecef; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <p style="font-size: 14px; color: #666; margin-bottom: 20px; line-height: 1.6;">
            <strong>Como interpretar os resultados:</strong><br>
            <strong>Tráfego Pago:</strong> Visitantes que chegaram através de anúncios pagos (Google Ads, Facebook Ads, etc). 
            Representa investimento em publicidade e tem custo por clique.<br>
            <strong>Tráfego Orgânico:</strong> Visitantes que encontraram o site através de buscas naturais no Google, Bing, etc. 
            Não tem custo direto, mas requer trabalho de SEO.<br>
            <strong>Resultado de SEO:</strong> Visitantes que acessaram páginas otimizadas de SEO (páginas /seo/). 
            Representa o retorno do investimento em otimização técnica e conteúdo.
          </p>
        </div>
        <div class="stats-grid">
          <div class="stat-card" style="border-left: 4px solid #e74c3c;">
            <div class="stat-value" style="color: #e74c3c;">${formatNumber(data.traffic.byType.paid.views)}</div>
            <div class="stat-label">Tráfego Pago</div>
            <div class="stat-comparison" style="margin-top: 8px;">
              <div style="font-size: 12px; color: #666; margin-bottom: 4px;">
                ${formatNumber(data.traffic.byType.paid.conversions)} conversões
              </div>
              <div style="font-size: 12px; color: #666;">
                Taxa: ${formatPercentage(data.traffic.byType.paid.conversionRate)}
              </div>
              <div style="font-size: 11px; color: #999; margin-top: 4px;">
                ${formatPercentage(data.traffic.byType.paid.percentage)} do total
              </div>
            </div>
          </div>
          <div class="stat-card" style="border-left: 4px solid #2ce185;">
            <div class="stat-value" style="color: #2ce185;">${formatNumber(data.traffic.byType.organic.views)}</div>
            <div class="stat-label">Tráfego Orgânico</div>
            <div class="stat-comparison" style="margin-top: 8px;">
              <div style="font-size: 12px; color: #666; margin-bottom: 4px;">
                ${formatNumber(data.traffic.byType.organic.conversions)} conversões
              </div>
              <div style="font-size: 12px; color: #666;">
                Taxa: ${formatPercentage(data.traffic.byType.organic.conversionRate)}
              </div>
              <div style="font-size: 11px; color: #999; margin-top: 4px;">
                ${formatPercentage(data.traffic.byType.organic.percentage)} do total
              </div>
            </div>
          </div>
          <div class="stat-card" style="border-left: 4px solid #08ded8;">
            <div class="stat-value" style="color: #08ded8;">${formatNumber(data.traffic.byType.seo.views)}</div>
            <div class="stat-label">Resultado de SEO</div>
            <div class="stat-comparison" style="margin-top: 8px;">
              <div style="font-size: 12px; color: #666; margin-bottom: 4px;">
                ${formatNumber(data.traffic.byType.seo.conversions)} conversões
              </div>
              <div style="font-size: 12px; color: #666;">
                Taxa: ${formatPercentage(data.traffic.byType.seo.conversionRate)}
              </div>
              <div style="font-size: 11px; color: #999; margin-top: 4px;">
                ${formatPercentage(data.traffic.byType.seo.percentage)} do total
              </div>
            </div>
          </div>
          <div class="stat-card" style="border-left: 4px solid #6c757d;">
            <div class="stat-value" style="color: #6c757d;">${formatNumber(data.traffic.byType.direct.views)}</div>
            <div class="stat-label">Acesso Direto</div>
            <div class="stat-comparison" style="margin-top: 8px;">
              <div style="font-size: 12px; color: #666; margin-bottom: 4px;">
                ${formatNumber(data.traffic.byType.direct.conversions)} conversões
              </div>
              <div style="font-size: 12px; color: #666;">
                Taxa: ${formatPercentage(data.traffic.byType.direct.conversionRate)}
              </div>
              <div style="font-size: 11px; color: #999; margin-top: 4px;">
                ${formatPercentage(data.traffic.byType.direct.percentage)} do total
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Origem de Tráfego Detalhada -->
      ${data.traffic.bySources.length > 0 ? `
      <div class="section">
        <h2 class="section-title">
          ${ICONS.globe}
          Origem de Tráfego (Detalhado)
        </h2>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Origem</th>
                <th style="text-align: right;">Sessões</th>
                <th style="text-align: right;">Percentual</th>
              </tr>
            </thead>
            <tbody>
              ${data.traffic.bySources.map(source => `
                <tr>
                  <td>${source.source}</td>
                  <td style="text-align: right; font-weight: 600;">${formatNumber(source.count)}</td>
                  <td style="text-align: right;">
                    <span class="badge badge-success">${formatPercentage(source.percentage)}</span>
                    <div class="progress-bar">
                      <div class="progress-fill" style="width: ${source.percentage}%"></div>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
      ` : ''}

      <!-- Resumo de Conversões -->
      <div class="section">
        <h2 class="section-title">
          ${ICONS.target}
          Resumo de Conversões
        </h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${formatNumber(data.conversion.views)}</div>
            <div class="stat-label">Total de Visualizações</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${formatNumber(data.conversion.clicks)}</div>
            <div class="stat-label">Total de Cliques</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${formatPercentage(data.conversion.rate)}</div>
            <div class="stat-label">Taxa de Conversão Geral</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${formatPercentage(data.sessions.conversionRate)}</div>
            <div class="stat-label">Taxa de Conversão por Sessão</div>
            <div class="stat-comparison">${formatComparison(data.sessions.conversionRateComparison)} vs período anterior</div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <p class="footer-text">
        Relatório gerado automaticamente em ${generatedAt}
      </p>
      <p class="footer-company">Open Dreams</p>
      <p class="footer-text">Soluções em Tecnologia e Marketing Digital</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

