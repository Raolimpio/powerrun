'use client';

import { Download, FileText, Database, Settings } from 'lucide-react';
import { useState } from 'react';

// ========================================
// 🎯 COMPONENTE PROFISSIONAL DE EXPORTAÇÃO JSON
// ========================================

interface JsonExporterProps {
  data: any;
  filename?: string;
  title?: string;
  description?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

interface ExportOptions {
  includeMetadata: boolean;
  includeTimestamp: boolean;
  prettyPrint: boolean;
  compressData: boolean;
}

export function JsonExporter({
  data,
  filename = 'export',
  title = 'Exportar Dados',
  description = 'Baixar dados em formato JSON',
  className = '',
  variant = 'primary',
  size = 'md',
}: JsonExporterProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    includeMetadata: true,
    includeTimestamp: true,
    prettyPrint: true,
    compressData: false,
  });

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-blue-600 to-red-600 text-white hover:from-blue-700 hover:to-red-700';
      case 'secondary':
        return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
      case 'outline':
        return 'border border-gray-300 text-gray-700 hover:bg-gray-50';
      default:
        return 'bg-gradient-to-r from-blue-600 to-red-600 text-white hover:from-blue-700 hover:to-red-700';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'md':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-6 py-3 text-base';
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  const prepareExportData = () => {
    let exportData = data;

    if (exportOptions.includeMetadata) {
      exportData = {
        metadata: {
          exportedAt: new Date().toISOString(),
          exportedBy: 'Power Run Admin',
          version: '1.0.0',
          totalRecords: Array.isArray(data) ? data.length : 1,
          exportOptions,
        },
        data,
      };
    }

    if (exportOptions.includeTimestamp) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      filename = `${filename}_${timestamp}`;
    }

    return exportData;
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const exportData = prepareExportData();

      const jsonString = exportOptions.prettyPrint
        ? JSON.stringify(exportData, null, 2)
        : JSON.stringify(exportData);

      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      // Feedback visual de sucesso
      setTimeout(() => {
        setIsExporting(false);
      }, 1000);
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      setIsExporting(false);
    }
  };

  const getDataStats = () => {
    if (Array.isArray(data)) {
      return {
        type: 'Array',
        count: data.length,
        size: JSON.stringify(data).length,
      };
    } else if (typeof data === 'object') {
      return {
        type: 'Object',
        count: Object.keys(data).length,
        size: JSON.stringify(data).length,
      };
    }
    return {
      type: typeof data,
      count: 1,
      size: JSON.stringify(data).length,
    };
  };

  const stats = getDataStats();

  return (
    <div className={`relative ${className}`}>
      {/* Botão Principal */}
      <div className='flex items-center space-x-2'>
        <button
          onClick={handleExport}
          disabled={isExporting || !data}
          className={`
            inline-flex items-center space-x-2 font-medium rounded-lg transition-all duration-200
            ${getVariantStyles()}
            ${getSizeStyles()}
            ${isExporting ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {isExporting ? (
            <>
              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
              <span>Exportando...</span>
            </>
          ) : (
            <>
              <Download className='h-4 w-4' />
              <span>{title}</span>
            </>
          )}
        </button>

        {/* Botão de Opções */}
        <button
          onClick={() => setShowOptions(!showOptions)}
          className={`
            inline-flex items-center justify-center rounded-lg transition-all duration-200
            ${size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10'}
            ${variant === 'primary' ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}
          `}
          title='Opções de Exportação'
        >
          <Settings className='h-4 w-4' />
        </button>
      </div>

      {/* Painel de Opções */}
      {showOptions && (
        <div className='absolute top-full right-0 mt-2 w-80 bg-white rounded-lg border border-gray-200 shadow-lg z-50'>
          <div className='p-4'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-sm font-semibold text-gray-900'>Opções de Exportação</h3>
              <button
                onClick={() => setShowOptions(false)}
                className='text-gray-400 hover:text-gray-600'
              >
                ×
              </button>
            </div>

            {/* Informações dos Dados */}
            <div className='mb-4 p-3 bg-gray-50 rounded-lg'>
              <div className='flex items-center space-x-2 mb-2'>
                <Database className='h-4 w-4 text-gray-600' />
                <span className='text-sm font-medium text-gray-900'>Informações dos Dados</span>
              </div>
              <div className='space-y-1 text-xs text-gray-600'>
                <div>Tipo: {stats.type}</div>
                <div>Registros: {stats.count}</div>
                <div>Tamanho: {(stats.size / 1024).toFixed(2)} KB</div>
              </div>
            </div>

            {/* Opções */}
            <div className='space-y-3'>
              <label className='flex items-center space-x-3'>
                <input
                  type='checkbox'
                  checked={exportOptions.includeMetadata}
                  onChange={(e) =>
                    setExportOptions((prev) => ({ ...prev, includeMetadata: e.target.checked }))
                  }
                  className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                />
                <div>
                  <div className='text-sm font-medium text-gray-900'>Incluir Metadados</div>
                  <div className='text-xs text-gray-500'>
                    Adiciona informações sobre a exportação
                  </div>
                </div>
              </label>

              <label className='flex items-center space-x-3'>
                <input
                  type='checkbox'
                  checked={exportOptions.includeTimestamp}
                  onChange={(e) =>
                    setExportOptions((prev) => ({ ...prev, includeTimestamp: e.target.checked }))
                  }
                  className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                />
                <div>
                  <div className='text-sm font-medium text-gray-900'>Incluir Timestamp</div>
                  <div className='text-xs text-gray-500'>Adiciona data/hora no nome do arquivo</div>
                </div>
              </label>

              <label className='flex items-center space-x-3'>
                <input
                  type='checkbox'
                  checked={exportOptions.prettyPrint}
                  onChange={(e) =>
                    setExportOptions((prev) => ({ ...prev, prettyPrint: e.target.checked }))
                  }
                  className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                />
                <div>
                  <div className='text-sm font-medium text-gray-900'>Formatação Legível</div>
                  <div className='text-xs text-gray-500'>JSON formatado com indentação</div>
                </div>
              </label>

              <label className='flex items-center space-x-3'>
                <input
                  type='checkbox'
                  checked={exportOptions.compressData}
                  onChange={(e) =>
                    setExportOptions((prev) => ({ ...prev, compressData: e.target.checked }))
                  }
                  className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                />
                <div>
                  <div className='text-sm font-medium text-gray-900'>Comprimir Dados</div>
                  <div className='text-xs text-gray-500'>Remove espaços desnecessários</div>
                </div>
              </label>
            </div>

            {/* Preview do Filename */}
            <div className='mt-4 p-3 bg-blue-50 rounded-lg'>
              <div className='text-xs text-blue-800 font-medium mb-1'>Nome do arquivo:</div>
              <div className='text-sm text-blue-900 font-mono'>
                {filename}
                {exportOptions.includeTimestamp
                  ? `_${new Date().toISOString().replace(/[:.]/g, '-')}`
                  : ''}
                .json
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Descrição */}
      {description && <div className='mt-2 text-xs text-gray-600'>{description}</div>}
    </div>
  );
}

// ========================================
// 🎯 COMPONENTE DE EXPORTAÇÃO EM LOTE
// ========================================

interface BatchJsonExporterProps {
  exports: Array<{
    data: any;
    filename: string;
    title: string;
    description?: string;
  }>;
  className?: string;
}

export function BatchJsonExporter({ exports, className = '' }: BatchJsonExporterProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [currentExport, setCurrentExport] = useState<string>('');

  const handleBatchExport = async () => {
    setIsExporting(true);

    try {
      for (const exportItem of exports) {
        setCurrentExport(exportItem.title);

        const exportData = {
          metadata: {
            exportedAt: new Date().toISOString(),
            exportedBy: 'Power Run Admin',
            version: '1.0.0',
            totalRecords: Array.isArray(exportItem.data) ? exportItem.data.length : 1,
          },
          data: exportItem.data,
        };

        const jsonString = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${exportItem.filename}_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        // Pequena pausa entre downloads
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      setIsExporting(false);
      setCurrentExport('');
    } catch (error) {
      console.error('Erro ao exportar dados em lote:', error);
      setIsExporting(false);
      setCurrentExport('');
    }
  };

  return (
    <div className={className}>
      <button
        onClick={handleBatchExport}
        disabled={isExporting || exports.length === 0}
        className='inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
      >
        {isExporting ? (
          <>
            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
            <span>Exportando {currentExport}...</span>
          </>
        ) : (
          <>
            <FileText className='h-4 w-4' />
            <span>Exportar Todos ({exports.length})</span>
          </>
        )}
      </button>

      {isExporting && currentExport && (
        <div className='mt-2 text-sm text-gray-600'>Exportando: {currentExport}</div>
      )}
    </div>
  );
}
