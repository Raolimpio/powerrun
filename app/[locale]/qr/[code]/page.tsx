'use client';

// ========================================
// 📱 PÁGINA DE DESTINO QR CODE - LOCALIZADA
// ========================================
// Página profissional mobile-first para downloads e contato

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { MOCK_EQUIPMENT } from '@/constants/equipment-data';
import { getPDFsForEquipment } from '@/constants/pdf-links';
import { getProductLineConfig } from '@/constants/product-line-mapping';
import { getEquipmentIdByQRCode, CONTACT_INFO } from '@/constants/qr-equipment-mapping';
import { getManualByQRCode } from '@/constants/qr-redirects';

interface QRPageProps {
  params: Promise<{
    locale: string;
    code: string;
  }>;
}

export default function QRLandingPage({ params }: QRPageProps) {
  const router = useRouter();
  const [pageParams, setPageParams] = React.useState<{ code: string; locale: string } | null>(null);

  // ✅ HOOK 1: Sempre executado - carrega params
  React.useEffect(() => {
    params.then(setPageParams);
  }, [params]);

  // ✅ HOOK 2: Sempre executado - redireciona se necessário
  useEffect(() => {
    if (pageParams) {
      const { code, locale } = pageParams;
      const fullQRCode = `qr-${code}`;
      const equipmentId = getEquipmentIdByQRCode(fullQRCode);
      const equipment = equipmentId ? MOCK_EQUIPMENT.find((eq) => eq.id === equipmentId) : null;

      if (!equipment) {
        router.push(`/${locale}/suporte`);
      }
    }
  }, [pageParams, router]);

  // Se ainda não carregou os parâmetros, mostra loading
  if (!pageParams) {
    return (
      <div className='min-h-screen bg-black text-white flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  const { code, locale } = pageParams;

  // Busca equipamento e documentos pelo código QR
  const fullQRCode = `qr-${code}`; // Adiciona prefixo "qr-" ao código capturado
  const equipmentId = getEquipmentIdByQRCode(fullQRCode);
  const equipment = equipmentId ? MOCK_EQUIPMENT.find((eq) => eq.id === equipmentId) : null;

  // Busca todos os PDFs disponíveis (manual + ficha técnica)
  const pdfs = equipment ? getPDFsForEquipment(equipment.id) : { manual: '', ficha: '' };
  const manualUrl = pdfs.manual || getManualByQRCode(fullQRCode); // Fallback para QR redirect
  const fichaUrl = pdfs.ficha;

  // Se não tem equipamento, mostra loading enquanto redireciona
  if (!equipment) {
    return (
      <div className='min-h-screen bg-black text-white flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p>Redirecionando...</p>
        </div>
      </div>
    );
  }

  // Obter configuração de cores do produto
  const productConfig = getProductLineConfig(equipment.id);
  const colors = productConfig.colors;

  // Função para compartilhar
  const handleShare = async () => {
    const shareData = {
      title: `${equipment.name} - Power Run`,
      text: `Confira este equipamento da Power Run: ${equipment.name}`,
      url: `https://powerrun.com.br/qr-${code}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Erro ao compartilhar:', err);
        // Fallback: copiar para clipboard
        fallbackShare(shareData.url);
      }
    } else {
      // Fallback para browsers que não suportam Web Share API
      fallbackShare(shareData.url);
    }
  };

  const fallbackShare = (url: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      alert('Link copiado para a área de transferência!');
    } else {
      // Fallback mais antigo
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Link copiado para a área de transferência!');
    }
  };

  return (
    <div className='min-h-screen bg-black text-white p-4'>
      <div className='max-w-md mx-auto bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-800'>
        {/* Header com Logo Power Run */}
        <div className='bg-black border-b border-gray-800 p-6 text-center'>
          <div className='w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center p-2'>
            <Image
              src='/Logo PowerRun.png'
              alt='Power Run Logo'
              width={60}
              height={60}
              className='w-full h-full object-contain'
            />
          </div>
          <h1 className='text-xl font-bold mb-1'>Power Run</h1>
          <p className='text-gray-400 text-sm'>Equipamentos Fitness Profissionais</p>
        </div>

        {/* Produto */}
        <div className='p-6'>
          <div className='aspect-square bg-gray-800 rounded-xl mb-4 overflow-hidden border border-gray-700'>
            <Image
              src={equipment.images[0]}
              alt={equipment.name}
              width={300}
              height={300}
              className='w-full h-full object-cover'
            />
          </div>

          <h2 className='text-xl font-bold text-center mb-2'>{equipment.name}</h2>
          <p className='text-gray-400 text-sm text-center mb-6'>{equipment.shortDescription}</p>

          {/* Downloads */}
          <div className='space-y-3 mb-6'>
            {manualUrl && (
              <a
                href={manualUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center justify-center w-full py-4 px-6 rounded-xl font-semibold transition-colors border-2'
                style={{
                  backgroundColor: colors.solid,
                  borderColor: colors.solid,
                  color: productConfig.line === 'blue' ? 'black' : 'white',
                }}
              >
                <svg className='w-5 h-5 mr-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                  />
                </svg>
                Download Manual
              </a>
            )}

            <button
              onClick={handleShare}
              className='flex items-center justify-center w-full bg-gray-700 hover:bg-gray-600 text-white py-4 px-6 rounded-xl font-semibold transition-colors border border-gray-600'
            >
              <svg className='w-5 h-5 mr-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z'
                />
              </svg>
              Compartilhar
            </button>

            {fichaUrl ? (
              <a
                href={fichaUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center justify-center w-full bg-gray-800 hover:bg-gray-700 text-white py-4 px-6 rounded-xl font-semibold transition-colors border border-gray-700'
              >
                <svg className='w-5 h-5 mr-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                  />
                </svg>
                Download Ficha Técnica
              </a>
            ) : (
              <a
                href={`/${locale}/equipamentos/${equipment.id}#downloads`}
                className='flex items-center justify-center w-full bg-gray-800 hover:bg-gray-700 text-white py-4 px-6 rounded-xl font-semibold transition-colors border border-gray-700'
              >
                <svg className='w-5 h-5 mr-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                  />
                </svg>
                Ver Produto Completo
              </a>
            )}
          </div>

          {/* Contatos */}
          <div className='border-t border-gray-800 pt-6'>
            <h3 className='text-lg font-semibold text-center mb-4'>Precisa de Ajuda?</h3>

            <div className='grid grid-cols-2 gap-3'>
              <a
                href={CONTACT_INFO.commercial.whatsapp}
                target='_blank'
                rel='noopener noreferrer'
                className='flex flex-col items-center justify-center bg-green-600 hover:bg-green-700 text-white py-4 px-3 rounded-xl font-semibold transition-colors text-sm border border-green-500'
              >
                <svg className='w-6 h-6 mb-2' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488' />
                </svg>
                Comercial
              </a>

              <a
                href={CONTACT_INFO.support.whatsapp}
                target='_blank'
                rel='noopener noreferrer'
                className='flex flex-col items-center justify-center bg-gray-700 hover:bg-gray-600 text-white py-4 px-3 rounded-xl font-semibold transition-colors text-sm border border-gray-600'
              >
                <svg className='w-6 h-6 mb-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z'
                  />
                </svg>
                Suporte
              </a>
            </div>
          </div>

          {/* Ver Produto Completo */}
          <div className='mt-6'>
            <a
              href={`/${locale}/equipamentos/${equipment.id}`}
              className='flex items-center justify-center w-full bg-gray-800 hover:bg-gray-700 text-white py-3 px-6 rounded-xl font-medium transition-colors border border-gray-700'
            >
              Ver Produto Completo
              <svg className='w-4 h-4 ml-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5l7 7-7 7'
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Metadata será definida dinamicamente via document.title se necessário
