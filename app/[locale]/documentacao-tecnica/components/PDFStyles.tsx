'use client';

// Estilos CSS específicos para PDF que serão injetados no documento
export const PDFStyles = () => {
  return (
    <style jsx global>{`
      @media print {
        .page-break-before {
          page-break-before: always;
          break-before: page;
        }

        .page-break-after {
          page-break-after: always;
          break-after: page;
        }

        .no-page-break {
          page-break-inside: avoid;
          break-inside: avoid;
        }

        @page {
          size: A4;
          margin: 20mm;
        }

        body {
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }
      }

      /* Estilos específicos para o PDF */
      .pdf-container {
        width: 210mm;
        min-height: 297mm;
        padding: 20mm;
        background: white;
        font-family:
          system-ui,
          -apple-system,
          BlinkMacSystemFont,
          'Segoe UI',
          Roboto,
          sans-serif;
        font-size: 12px;
        line-height: 1.4;
        color: #1f2937;
      }

      .pdf-header {
        border-bottom: 2px solid #e2e8f0;
        padding-bottom: 16px;
        margin-bottom: 24px;
      }

      .pdf-title {
        font-size: 24px;
        font-weight: 700;
        color: #0f172a;
        text-align: center;
        margin: 24px 0 12px 0;
      }

      .pdf-subtitle {
        font-size: 16px;
        color: #64748b;
        text-align: center;
        margin-bottom: 24px;
      }

      .pdf-section {
        margin: 24px 0;
      }

      .pdf-section-title {
        font-size: 18px;
        font-weight: 600;
        color: #0f172a;
        border-bottom: 1px solid #e2e8f0;
        padding-bottom: 8px;
        margin-bottom: 16px;
      }

      .pdf-specs-table {
        width: 100%;
        border-collapse: collapse;
      }

      .pdf-specs-row {
        border-bottom: 1px solid #f1f5f9;
      }

      .pdf-specs-row:nth-child(even) {
        background-color: #f8fafc;
      }

      .pdf-specs-key {
        font-weight: 600;
        color: #0f172a;
        padding: 8px 12px;
        width: 30%;
        vertical-align: top;
      }

      .pdf-specs-value {
        color: #374151;
        padding: 8px 12px;
        width: 70%;
      }

      .pdf-feature-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .pdf-feature-item {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        padding: 4px 0;
      }

      .pdf-feature-bullet {
        width: 6px;
        height: 6px;
        background-color: #10b981;
        border-radius: 50%;
        margin-top: 8px;
        flex-shrink: 0;
      }

      .pdf-footer {
        margin-top: 32px;
        padding-top: 16px;
        border-top: 1px solid #e2e8f0;
        text-align: center;
        font-size: 10px;
        color: #6b7280;
      }

      .pdf-image-placeholder {
        width: 100%;
        height: 200px;
        background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
        border: 2px dashed #cbd5e1;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 24px 0;
      }

      .pdf-contact-box {
        background-color: #eff6ff;
        border: 1px solid #dbeafe;
        border-radius: 8px;
        padding: 16px;
        margin: 24px 0;
      }

      .pdf-contact-title {
        font-weight: 600;
        color: #1e40af;
        margin-bottom: 8px;
      }

      .pdf-contact-info {
        font-size: 11px;
        color: #1e40af;
        line-height: 1.5;
      }
    `}</style>
  );
};

// Hook para adicionar estilos CSS dinâmicos para PDF
export const usePDFStyles = () => {
  const addPDFStyles = () => {
    const styleId = 'pdf-styles';

    // Remove estilos existentes se houver
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.remove();
    }

    // Adiciona novos estilos
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .pdf-optimized {
        width: 210mm !important;
        max-width: 210mm !important;
        min-height: 297mm;
        padding: 20mm !important;
        margin: 0 auto;
        background: white !important;
        font-family: system-ui, -apple-system, sans-serif !important;
        font-size: 12px !important;
        line-height: 1.4 !important;
        color: #1f2937 !important;
        box-sizing: border-box;
      }
      
      .pdf-optimized * {
        box-sizing: border-box;
      }
      
      .pdf-page-break {
        page-break-before: always;
        break-before: page;
        margin-top: 0 !important;
        padding-top: 20mm;
      }
      
      .pdf-no-break {
        page-break-inside: avoid;
        break-inside: avoid;
      }
    `;

    document.head.appendChild(style);
  };

  const removePDFStyles = () => {
    const style = document.getElementById('pdf-styles');
    if (style) {
      style.remove();
    }
  };

  return { addPDFStyles, removePDFStyles };
};
