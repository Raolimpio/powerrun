export interface ProductData {
  id: string;
  name: string;
  category: string;
  line: 'red' | 'blue' | 'musculacao';
  lineConfig: any;
  specifications: Record<string, string>;
  features: string[];
  equipmentData?: any;
}

export interface ExcelExportOptions {
  filename?: string;
  includeFeatures?: boolean;
}

/**
 * Exporta dados de produtos para CSV com estrutura de comparação
 * O arquivo CSV pode ser aberto diretamente no Excel
 */
export function exportProductsToCSV(
  products: ProductData[],
  specifications: string[],
  options: ExcelExportOptions = {}
): void {
  const { filename = 'fichas-tecnicas-comparacao.csv', includeFeatures = true } = options;

  // Função para escapar valores CSV
  const escapeCSV = (value: string): string => {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  // Preparar dados para o CSV
  const csvRows: string[] = [];

  // Header com nomes dos produtos
  const headerRow = ['Especificação', ...products.map((p) => escapeCSV(p.name))];
  csvRows.push(headerRow.join(','));

  // Segunda linha com informações da linha
  const lineRow = ['Linha', ...products.map((p) => escapeCSV(p.lineConfig.name))];
  csvRows.push(lineRow.join(','));

  // Linha vazia para separação
  csvRows.push(['', ...products.map(() => '')].join(','));

  // Especificações
  specifications.forEach((spec) => {
    const specRow = [
      escapeCSV(spec),
      ...products.map((p) => escapeCSV(p.specifications[spec] || '')),
    ];
    csvRows.push(specRow.join(','));
  });

  // Seção de Features (se habilitada)
  if (includeFeatures && products.some((p) => p.features.length > 0)) {
    // Linha vazia
    csvRows.push(['', ...products.map(() => '')].join(','));

    // Título da seção
    csvRows.push(['RECURSOS PRINCIPAIS', ...products.map(() => '')].join(','));

    // Linha vazia
    csvRows.push(['', ...products.map(() => '')].join(','));

    // Encontrar o número máximo de features
    const maxFeatures = Math.max(...products.map((p) => p.features.length));

    for (let i = 0; i < maxFeatures; i++) {
      const featureRow = [
        escapeCSV(`Recurso ${i + 1}`),
        ...products.map((p) => escapeCSV(p.features[i] || '')),
      ];
      csvRows.push(featureRow.join(','));
    }
  }

  // Criar conteúdo CSV
  const csvContent = csvRows.join('\n');

  // Adicionar BOM para UTF-8 (para compatibilidade com Excel)
  const BOM = '\uFEFF';
  const csvWithBOM = BOM + csvContent;

  // Criar blob e fazer download
  const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Exporta dados de produtos para CSV com estrutura de tabela simples
 */
export function exportProductsToCSVSimple(
  products: ProductData[],
  specifications: string[],
  options: ExcelExportOptions = {}
): void {
  const { filename = 'fichas-tecnicas-tabela.csv', includeFeatures: _includeFeatures = false } =
    options;

  // Função para escapar valores CSV
  const escapeCSV = (value: string): string => {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  // Preparar dados para o CSV
  const csvRows: string[] = [];

  // Header com todas as colunas
  const headerRow = [
    'Nome',
    'Categoria',
    'Linha',
    ...specifications.map((spec) => escapeCSV(spec)),
  ];
  csvRows.push(headerRow.join(','));

  // Dados dos produtos
  products.forEach((product) => {
    const dataRow = [
      escapeCSV(product.name),
      escapeCSV(product.category),
      escapeCSV(product.lineConfig.name),
      ...specifications.map((spec) => escapeCSV(product.specifications[spec] || '')),
    ];
    csvRows.push(dataRow.join(','));
  });

  // Criar conteúdo CSV
  const csvContent = csvRows.join('\n');

  // Adicionar BOM para UTF-8 (para compatibilidade com Excel)
  const BOM = '\uFEFF';
  const csvWithBOM = BOM + csvContent;

  // Criar blob e fazer download
  const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

// Alias para manter compatibilidade com o código existente
export const exportProductsToExcel = exportProductsToCSV;
export const exportProductsToExcelSimple = exportProductsToCSVSimple;
