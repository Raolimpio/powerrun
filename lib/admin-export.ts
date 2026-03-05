/**
 * Utilitário de Exportação para Painel Admin
 * 
 * Exporta dados do painel admin em formato CSV
 */

export interface ExportData {
  views?: {
    total: number;
    byPath: Array<{ path: string; count: number }>;
    byLocale: Array<{ locale: string; count: number }>;
    byDevice: Array<{ device: string; count: number }>;
  };
  quotes?: {
    total: number;
    byPage: Array<{ path: string; count: number }>;
    byType: Array<{ type: string; count: number }>;
    byProduct: Array<{ productId: string; count: number }>;
    byCity: Array<{ city: string; count: number }>;
  };
  conversion?: {
    rate: number;
    views: number;
    clicks: number;
  };
  period?: string;
  generatedAt?: string;
}

/**
 * Converte dados para CSV
 */
function convertToCSV(data: Array<Record<string, any>>): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvHeaders = headers.map(h => `"${h}"`).join(',');

  const csvRows = data.map((row) =>
    headers
      .map((header) => {
        const value = row[header] ?? '';
        const stringValue = String(value);
        // Escapar vírgulas, aspas e quebras de linha
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      })
      .join(',')
  );

  return [csvHeaders, ...csvRows].join('\n');
}

/**
 * Exporta dados do admin para CSV
 */
export function exportAdminDataToCSV(data: ExportData, period: string): void {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  const filename = `powerrun-admin-${period}-${timestamp}.csv`;

  // Preparar dados para exportação
  const exportRows: Array<Record<string, any>> = [];

  // Adicionar resumo geral
  exportRows.push({
    'Tipo': 'Resumo Geral',
    'Período': period,
    'Data de Geração': data.generatedAt ? new Date(data.generatedAt).toLocaleString('pt-BR') : new Date().toLocaleString('pt-BR'),
    'Visualizações Totais': data.views?.total ?? 0,
    'Conversões Totais': data.quotes?.total ?? 0,
    'Taxa de Conversão (%)': data.conversion?.rate.toFixed(2) ?? '0.00',
  });

  // Adicionar linha em branco
  exportRows.push({});

  // Páginas mais acessadas
  if (data.views?.byPath && data.views.byPath.length > 0) {
    exportRows.push({ 'Tipo': '=== PÁGINAS MAIS ACESSADAS ===' });
    data.views.byPath.forEach((item, idx) => {
      exportRows.push({
        'Rank': idx + 1,
        'Página': item.path,
        'Visualizações': item.count,
      });
    });
    exportRows.push({});
  }

  // Conversões por tipo
  if (data.quotes?.byType && data.quotes.byType.length > 0) {
    exportRows.push({ 'Tipo': '=== CONVERSÕES POR TIPO ===' });
    data.quotes.byType.forEach((item) => {
      exportRows.push({
        'Tipo de Página': item.type,
        'Conversões': item.count,
      });
    });
    exportRows.push({});
  }

  // Produtos mais convertidos
  if (data.quotes?.byProduct && data.quotes.byProduct.length > 0) {
    exportRows.push({ 'Tipo': '=== PRODUTOS MAIS CONVERTIDOS ===' });
    data.quotes.byProduct.forEach((item, idx) => {
      exportRows.push({
        'Rank': idx + 1,
        'Produto': item.productId,
        'Conversões': item.count,
      });
    });
    exportRows.push({});
  }

  // Cidades mais convertidas
  if (data.quotes?.byCity && data.quotes.byCity.length > 0) {
    exportRows.push({ 'Tipo': '=== CIDADES MAIS CONVERTIDAS ===' });
    data.quotes.byCity.forEach((item, idx) => {
      exportRows.push({
        'Rank': idx + 1,
        'Cidade': item.city,
        'Conversões': item.count,
      });
    });
    exportRows.push({});
  }

  // Dispositivos
  if (data.views?.byDevice && data.views.byDevice.length > 0) {
    exportRows.push({ 'Tipo': '=== VISUALIZAÇÕES POR DISPOSITIVO ===' });
    data.views.byDevice.forEach((item) => {
      exportRows.push({
        'Dispositivo': item.device,
        'Visualizações': item.count,
      });
    });
  }

  // Converter para CSV
  const csvContent = convertToCSV(exportRows);

  // Criar e baixar arquivo
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' }); // BOM para Excel
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

