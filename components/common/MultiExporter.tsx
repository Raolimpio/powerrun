'use client';

import { Download, FileText, Database } from 'lucide-react';
import { useState } from 'react';

// ========================================
// 🎯 COMPONENTE DE EXPORTAÇÃO MÚLTIPLA (JSON + CSV)
// ========================================

interface MultiExporterProps {
  data: Array<Record<string, any>>;
  changes?: Array<{
    row: number;
    col: string;
    oldValue: any;
    newValue: any;
  }>;
  filename?: string;
  title?: string;
  className?: string;
}

export function MultiExporter({
  data,
  changes = [],
  filename = 'export',
  title = 'Exportar',
  className = '',
}: MultiExporterProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'json' | 'csv' | null>(null);

  // Converter dados para CSV
  const convertToCSV = (data: Array<Record<string, any>>) => {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');

    const csvRows = data.map((row) =>
      headers
        .map((header) => {
          const value = row[header] || '';
          // Escapar vírgulas e aspas
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(',')
    );

    return [csvHeaders, ...csvRows].join('\n');
  };

  // Converter mudanças para CSV
  const convertChangesToCSV = (
    changes: Array<{
      row: number;
      col: string;
      oldValue: any;
      newValue: any;
    }>
  ) => {
    if (changes.length === 0) return '';

    const headers = ['Linha', 'Coluna', 'Valor Anterior', 'Valor Novo', 'Produto'];
    const csvHeaders = headers.join(',');

    const csvRows = changes.map((change) => {
      const productName = data[change.row]?.name || `Produto ${change.row + 1}`;
      return [
        change.row + 1, // Linha começa em 1
        change.col,
        `"${(change.oldValue || '').toString().replace(/"/g, '""')}"`,
        `"${(change.newValue || '').toString().replace(/"/g, '""')}"`,
        `"${productName.replace(/"/g, '""')}"`,
      ].join(',');
    });

    return [csvHeaders, ...csvRows].join('\n');
  };

  const handleExport = async (type: 'json' | 'csv') => {
    setIsExporting(true);
    setExportType(type);

    try {
      let content: string;
      let mimeType: string;
      let fileExtension: string;

      if (type === 'csv') {
        if (changes.length > 0) {
          // Exportar apenas mudanças
          content = convertChangesToCSV(changes);
          fileExtension = 'changes.csv';
        } else {
          // Exportar todos os dados
          content = convertToCSV(data);
          fileExtension = 'csv';
        }
        mimeType = 'text/csv';
      } else {
        // JSON
        if (changes.length > 0) {
          const changesData = {
            metadata: {
              exportedAt: new Date().toISOString(),
              exportedBy: 'Power Run Admin',
              totalChanges: changes.length,
              affectedRows: Array.from(new Set(changes.map((c) => c.row))).length,
            },
            changes: changes.map((change) => ({
              ...change,
              productName: data[change.row]?.name || `Produto ${change.row + 1}`,
              columnName: change.col,
            })),
          };
          content = JSON.stringify(changesData, null, 2);
          fileExtension = 'changes.json';
        } else {
          const exportData = {
            metadata: {
              exportedAt: new Date().toISOString(),
              exportedBy: 'Power Run Admin',
              version: '1.0.0',
              totalRecords: data.length,
            },
            data,
          };
          content = JSON.stringify(exportData, null, 2);
          fileExtension = 'json';
        }
        mimeType = 'application/json';
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}_${new Date().toISOString().replace(/[:.]/g, '-')}.${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      setTimeout(() => {
        setIsExporting(false);
        setExportType(null);
      }, 1000);
    } catch (error) {
      console.error('Erro ao exportar:', error);
      setIsExporting(false);
      setExportType(null);
    }
  };

  const getDataStats = () => {
    return {
      totalRecords: data.length,
      totalChanges: changes.length,
      affectedRows: Array.from(new Set(changes.map((c) => c.row))).length,
    };
  };

  const stats = getDataStats();

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Botão JSON */}
      <button
        onClick={() => handleExport('json')}
        disabled={isExporting}
        className='inline-flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
      >
        {isExporting && exportType === 'json' ? (
          <>
            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
            <span>Exportando JSON...</span>
          </>
        ) : (
          <>
            <Database className='h-4 w-4' />
            <span>JSON</span>
          </>
        )}
      </button>

      {/* Botão CSV */}
      <button
        onClick={() => handleExport('csv')}
        disabled={isExporting}
        className='inline-flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
      >
        {isExporting && exportType === 'csv' ? (
          <>
            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
            <span>Exportando CSV...</span>
          </>
        ) : (
          <>
            <FileText className='h-4 w-4' />
            <span>CSV</span>
          </>
        )}
      </button>

      {/* Info */}
      <div className='text-xs text-gray-500'>
        {changes.length > 0 ? (
          <span className='text-orange-600'>
            {stats.totalChanges} mudança{stats.totalChanges !== 1 ? 's' : ''} em{' '}
            {stats.affectedRows} linha{stats.affectedRows !== 1 ? 's' : ''}
          </span>
        ) : (
          <span className='text-gray-600'>
            {stats.totalRecords} registro{stats.totalRecords !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  );
}

// ========================================
// 🎯 COMPONENTE DE EXPORTAÇÃO RÁPIDA
// ========================================

interface QuickExporterProps {
  data: Array<Record<string, any>>;
  filename?: string;
  className?: string;
}

export function QuickExporter({ data, filename = 'export', className = '' }: QuickExporterProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleQuickCSVExport = async () => {
    setIsExporting(true);

    try {
      const csvContent = convertToCSV(data);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}_${new Date().toISOString().replace(/[:.]/g, '-')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      setTimeout(() => {
        setIsExporting(false);
      }, 1000);
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      setIsExporting(false);
    }
  };

  const convertToCSV = (data: Array<Record<string, any>>) => {
    if (data.length === 0) return '';

    // Obter todas as chaves únicas de todos os objetos
    const allKeys = new Set<string>();
    data.forEach((item) => {
      Object.keys(item).forEach((key) => allKeys.add(key));
    });

    const headers = Array.from(allKeys);
    const csvHeaders = headers.join(',');

    const csvRows = data.map((row) =>
      headers
        .map((header) => {
          const value = row[header] || '';
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(',')
    );

    return [csvHeaders, ...csvRows].join('\n');
  };

  return (
    <div className={className}>
      <button
        onClick={handleQuickCSVExport}
        disabled={isExporting || data.length === 0}
        className='inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
      >
        {isExporting ? (
          <>
            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
            <span>Exportando CSV...</span>
          </>
        ) : (
          <>
            <FileText className='h-4 w-4' />
            <span>Exportar CSV ({data.length})</span>
          </>
        )}
      </button>
    </div>
  );
}
