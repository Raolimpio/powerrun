'use client';

import { Copy, Check, Clipboard } from 'lucide-react';
import { useState } from 'react';

// ========================================
// 🎯 COMPONENTE DE COPIAR PARA CLIPBOARD
// ========================================

interface CopyToClipboardProps {
  data: Array<Record<string, any>>;
  format?: 'csv' | 'tsv' | 'table';
  filename?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
}

export function CopyToClipboard({
  data,
  format = 'csv',
  filename: _filename = 'data',
  className = '',
  size = 'md',
  variant = 'primary',
}: CopyToClipboardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

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

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 text-white hover:bg-blue-700';
      case 'secondary':
        return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
      case 'outline':
        return 'border border-gray-300 text-gray-700 hover:bg-gray-50';
      default:
        return 'bg-blue-600 text-white hover:bg-blue-700';
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
    console.log('Headers encontrados:', headers);

    const csvHeaders = headers.join(',');

    const csvRows = data.map((row, index) => {
      console.log(`Linha ${index}:`, row);
      return headers
        .map((header) => {
          const value = row[header] || '';
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(',');
    });

    const result = [csvHeaders, ...csvRows].join('\n');
    console.log('CSV final:', result);
    return result;
  };

  const convertToTSV = (data: Array<Record<string, any>>) => {
    if (data.length === 0) return '';

    // Obter todas as chaves únicas de todos os objetos
    const allKeys = new Set<string>();
    data.forEach((item) => {
      Object.keys(item).forEach((key) => allKeys.add(key));
    });

    const headers = Array.from(allKeys);
    const tsvHeaders = headers.join('\t');

    const tsvRows = data.map((row) =>
      headers
        .map((header) => {
          const value = row[header] || '';
          return value.toString().replace(/\t/g, ' '); // Substituir tabs por espaços
        })
        .join('\t')
    );

    return [tsvHeaders, ...tsvRows].join('\n');
  };

  const convertToTable = (data: Array<Record<string, any>>) => {
    if (data.length === 0) return '';

    // Obter todas as chaves únicas de todos os objetos
    const allKeys = new Set<string>();
    data.forEach((item) => {
      Object.keys(item).forEach((key) => allKeys.add(key));
    });

    const headers = Array.from(allKeys);

    // Criar tabela HTML
    const tableHTML = `
<table>
  <thead>
    <tr>
      ${headers.map((header) => `<th>${header}</th>`).join('')}
    </tr>
  </thead>
  <tbody>
    ${data
      .map(
        (row) => `
      <tr>
        ${headers.map((header) => `<td>${row[header] || ''}</td>`).join('')}
      </tr>
    `
      )
      .join('')}
  </tbody>
</table>`;

    return tableHTML;
  };

  const handleCopy = async () => {
    if (data.length === 0) return;

    setIsCopying(true);

    try {
      // Debug: verificar estrutura dos dados
      console.log('Dados para copiar:', data);
      console.log('Primeiro item:', data[0]);
      console.log('Chaves disponíveis:', Object.keys(data[0] || {}));

      let content: string;

      switch (format) {
        case 'csv':
          content = convertToCSV(data);
          break;
        case 'tsv':
          content = convertToTSV(data);
          break;
        case 'table':
          content = convertToTable(data);
          break;
        default:
          content = convertToCSV(data);
      }

      console.log('Conteúdo gerado:', content);

      // Tentar usar a API moderna do Clipboard
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(content);
      } else {
        // Fallback para navegadores mais antigos
        const textArea = document.createElement('textarea');
        textArea.value = content;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }

      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Erro ao copiar para clipboard:', error);
    } finally {
      setIsCopying(false);
    }
  };

  const getButtonText = () => {
    if (isCopied) return 'Copiado!';
    if (isCopying) return 'Copiando...';

    switch (format) {
      case 'csv':
        return 'Copiar CSV';
      case 'tsv':
        return 'Copiar TSV';
      case 'table':
        return 'Copiar Tabela';
      default:
        return 'Copiar';
    }
  };

  const getIcon = () => {
    if (isCopied) return <Check className='h-4 w-4' />;
    if (isCopying)
      return <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-current'></div>;
    return <Copy className='h-4 w-4' />;
  };

  return (
    <div className={className}>
      <button
        onClick={handleCopy}
        disabled={isCopying || data.length === 0}
        className={`
          inline-flex items-center space-x-2 font-medium rounded-md transition-all duration-200
          ${getVariantStyles()}
          ${getSizeStyles()}
          ${isCopied ? 'bg-green-600 hover:bg-green-700' : ''}
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        title={`Copiar ${data.length} registros em formato ${format.toUpperCase()}`}
      >
        {getIcon()}
        <span>{getButtonText()}</span>
      </button>

      {isCopied && (
        <div className='mt-1 text-xs text-green-600 text-center'>
          ✓ Copiado para área de transferência
        </div>
      )}
    </div>
  );
}

// ========================================
// 🎯 COMPONENTE DE COPIAR MUDANÇAS
// ========================================

interface CopyChangesProps {
  changes: Array<{
    row: number;
    col: string;
    oldValue: any;
    newValue: any;
  }>;
  originalData: Array<Record<string, any>>;
  format?: 'csv' | 'tsv';
  className?: string;
}

export function CopyChanges({
  changes,
  originalData,
  format = 'csv',
  className = '',
}: CopyChangesProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const convertChangesToCSV = () => {
    if (changes.length === 0) return '';

    const headers = ['Linha', 'Coluna', 'Valor Anterior', 'Valor Novo', 'Produto'];
    const csvHeaders = headers.join(',');

    const csvRows = changes.map((change) => {
      const productName = originalData[change.row]?.name || `Produto ${change.row + 1}`;
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

  const convertChangesToTSV = () => {
    if (changes.length === 0) return '';

    const headers = ['Linha', 'Coluna', 'Valor Anterior', 'Valor Novo', 'Produto'];
    const tsvHeaders = headers.join('\t');

    const tsvRows = changes.map((change) => {
      const productName = originalData[change.row]?.name || `Produto ${change.row + 1}`;
      return [
        change.row + 1,
        change.col,
        (change.oldValue || '').toString().replace(/\t/g, ' '),
        (change.newValue || '').toString().replace(/\t/g, ' '),
        productName.replace(/\t/g, ' '),
      ].join('\t');
    });

    return [tsvHeaders, ...tsvRows].join('\n');
  };

  const handleCopy = async () => {
    if (changes.length === 0) return;

    setIsCopying(true);

    try {
      const content = format === 'csv' ? convertChangesToCSV() : convertChangesToTSV();

      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(content);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = content;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }

      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Erro ao copiar mudanças:', error);
    } finally {
      setIsCopying(false);
    }
  };

  if (changes.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <button
        onClick={handleCopy}
        disabled={isCopying}
        className='inline-flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
        title={`Copiar ${changes.length} mudança${changes.length !== 1 ? 's' : ''} em formato ${format.toUpperCase()}`}
      >
        {isCopied ? (
          <>
            <Check className='h-4 w-4' />
            <span>Copiado!</span>
          </>
        ) : isCopying ? (
          <>
            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
            <span>Copiando...</span>
          </>
        ) : (
          <>
            <Clipboard className='h-4 w-4' />
            <span>Copiar Mudanças ({changes.length})</span>
          </>
        )}
      </button>

      {isCopied && (
        <div className='mt-1 text-xs text-green-600 text-center'>
          ✓ Mudanças copiadas para área de transferência
        </div>
      )}
    </div>
  );
}
