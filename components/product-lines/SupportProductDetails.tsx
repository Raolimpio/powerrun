'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { APP_CONFIG } from '@/constants';
import { getPDFsForEquipment } from '@/constants/pdf-links';
import { getFullProductConfig } from '@/constants/product-manager';
import { useEquipmentTranslations } from '@/hooks/useEquipmentTranslations';
import { Equipment } from '@/types';
import { printTechnicalSheet } from '@/utils/pdf-generator';

interface SupportProductDetailsProps {
  equipment: Equipment;
  translatedEquipment: Equipment;
}

/**
 * 🛠️ COMPONENTE UNIFICADO DE SUPORTE
 *
 * Mantém EXATAMENTE o mesmo layout da página atual,
 * mas organizando o código de forma modular.
 */
export function SupportProductDetails({
  equipment,
  translatedEquipment,
}: SupportProductDetailsProps) {
  const tSup = useTranslations('support');
  const tCommon = useTranslations('common');
  const [activeTab, setActiveTab] = useState<'videos' | 'downloads' | 'specs'>('videos');
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);

  const config = getFullProductConfig(equipment.id);
  const colors = {
    solid: config.line.colors.primary,
    bg: config.line.colors.bg,
    text: config.line.colors.text,
  };

  // Usar cores do sistema atual (mantém exatamente igual)
  const lineColor = colors.solid;
  const isRedLine = config.line.line === 'red' || config.line.line === 'musculacao';

  // Dados de vídeos (mantém lógica atual)
  const getVideoDetails = (equipment: Equipment) => {
    if (!equipment.videos || equipment.videos.length === 0) return [];

    return equipment.videos.map((video, index) => ({
      url: video,
      title:
        index === 0
          ? tSup('videoTitles.instalacao')
          : index === 1
            ? tSup('videoTitles.manutencao')
            : index === 2
              ? tSup('videoTitles.treinamento')
              : index === 3
                ? tSup('videoTitles.suporte')
                : `${tSup('videos')} ${index + 1}`,
      description:
        index === 0
          ? tSup('videoDescriptions.instalacao')
          : index === 1
            ? tSup('videoDescriptions.manutencao')
            : index === 2
              ? tSup('videoDescriptions.treinamento')
              : index === 3
                ? tSup('videoDescriptions.suporte')
                : `Tutorial detalhado sobre funcionalidades específicas do equipamento.`,
      duration:
        index === 0
          ? '12:30'
          : index === 1
            ? '8:45'
            : index === 2
              ? '15:20'
              : index === 3
                ? '6:15'
                : `${Math.floor(Math.random() * 15) + 5}:${Math.floor(Math.random() * 60)
                    .toString()
                    .padStart(2, '0')}`,
      category:
        index === 0
          ? tSup('categorias.instalacao')
          : index === 1
            ? tSup('categorias.manutencao')
            : index === 2
              ? tSup('categorias.treinamento')
              : index === 3
                ? tSup('categorias.suporte')
                : tSup('categorias.tutorial'),
    }));
  };

  const videoDetails = getVideoDetails(translatedEquipment);

  return (
    <>
      {/* Navegação por tabs - MANTÉM LAYOUT EXATO */}
      <section className='bg-white border-b border-gray-200 sticky top-0 z-40'>
        <div className='container mx-auto px-4'>
          <div className='flex space-x-8'>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-4 py-4 text-sm font-semibold border-b-2 transition-colors btn-exception no-border ${
                activeTab === 'videos'
                  ? `text-[${lineColor}]`
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              style={{
                borderBottomColor: activeTab === 'videos' ? lineColor : 'transparent',
                color: activeTab === 'videos' ? lineColor : undefined,
              }}
            >
              <svg
                className='w-4 h-4 mr-2 inline'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10V9a2 2 0 012-2h2a2 2 0 012 2v1M9 10v5a2 2 0 002 2h2a2 2 0 002-2v-5'
                />
              </svg>
              {tSup('videos')} ({videoDetails.length})
            </button>
            <button
              onClick={() => setActiveTab('downloads')}
              className={`px-4 py-4 text-sm font-semibold border-b-2 transition-colors btn-exception no-border ${
                activeTab === 'downloads'
                  ? `text-[${lineColor}]`
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              style={{
                borderBottomColor: activeTab === 'downloads' ? lineColor : 'transparent',
                color: activeTab === 'downloads' ? lineColor : undefined,
              }}
            >
              <svg
                className='w-4 h-4 mr-2 inline'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
              {tSup('downloads')} (
              {(() => {
                const pdfs = getPDFsForEquipment(equipment.id);
                return (pdfs?.manual ? 1 : 0) + (pdfs?.ficha ? 1 : 0);
              })()}
              )
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-4 py-4 text-sm font-semibold border-b-2 transition-colors btn-exception no-border ${
                activeTab === 'specs'
                  ? `text-[${lineColor}]`
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              style={{
                borderBottomColor: activeTab === 'specs' ? lineColor : 'transparent',
                color: activeTab === 'specs' ? lineColor : undefined,
              }}
            >
              <svg
                className='w-4 h-4 mr-2 inline'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
              {tSup('especificacoes')}
            </button>
          </div>
        </div>
      </section>

      {/* Conteúdo principal - MANTÉM LAYOUT EXATO */}
      <section className='py-8'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Conteúdo principal */}
            <div className='lg:col-span-2'>
              {/* ABA VÍDEOS - MANTÉM CÓDIGO EXATO */}
              {activeTab === 'videos' && (
                <div className='space-y-6'>
                  {videoDetails.length > 0 ? (
                    <>
                      {/* Seletor de vídeos */}
                      {videoDetails.length > 1 && (
                        <div className='bg-white rounded-xl border border-gray-200 p-6'>
                          <div className='flex items-center justify-between mb-4'>
                            <h3 className='text-lg font-bold text-black'>{tSup('escolhaVideo')}</h3>
                            <span className='text-sm text-gray-500'>
                              {tSup('videosDisponiveis', { count: videoDetails.length })}
                            </span>
                          </div>

                          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                            {videoDetails.map((video, index) => (
                              <button
                                key={index}
                                onClick={() => setSelectedVideoIndex(index)}
                                className={`text-left p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-md btn-exception no-border ${
                                  selectedVideoIndex === index
                                    ? 'shadow-lg'
                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                                }`}
                                style={{
                                  borderColor: selectedVideoIndex === index ? lineColor : undefined,
                                  backgroundColor:
                                    selectedVideoIndex === index
                                      ? isRedLine
                                        ? '#9c100610'
                                        : '#61fbfe10'
                                      : undefined,
                                }}
                              >
                                <div className='flex items-start gap-3'>
                                  <div className='relative flex-shrink-0'>
                                    <div
                                      className='w-16 h-12 rounded-md flex items-center justify-center'
                                      style={{
                                        backgroundColor:
                                          selectedVideoIndex === index
                                            ? isRedLine
                                              ? '#9c100620'
                                              : '#61fbfe20'
                                            : '#f3f4f6',
                                      }}
                                    >
                                      <svg
                                        className='w-6 h-6'
                                        style={{
                                          color:
                                            selectedVideoIndex === index ? lineColor : '#9ca3af',
                                        }}
                                        fill='currentColor'
                                        viewBox='0 0 24 24'
                                      >
                                        <path d='M8 5v14l11-7z' />
                                      </svg>
                                    </div>
                                    <div className='absolute -bottom-1 -right-1 bg-black/70 text-white text-xs px-1 rounded'>
                                      {video.duration}
                                    </div>
                                  </div>
                                  <div className='flex-1 min-w-0'>
                                    <h4
                                      className='font-semibold text-sm mb-1 line-clamp-2'
                                      style={{
                                        color: selectedVideoIndex === index ? lineColor : '#111827',
                                      }}
                                    >
                                      {video.title}
                                    </h4>
                                    <span
                                      className='inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium'
                                      style={{
                                        backgroundColor:
                                          selectedVideoIndex === index
                                            ? isRedLine
                                              ? '#9c100620'
                                              : '#61fbfe20'
                                            : '#f3f4f6',
                                        color: selectedVideoIndex === index ? lineColor : '#374151',
                                      }}
                                    >
                                      {video.category}
                                    </span>
                                  </div>
                                  {selectedVideoIndex === index && (
                                    <div
                                      className='w-2 h-2 rounded-full'
                                      style={{ backgroundColor: lineColor }}
                                    />
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Player de vídeo principal */}
                      <div className='bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg'>
                        <div className='aspect-video'>
                          <iframe
                            src={videoDetails[selectedVideoIndex]?.url}
                            title={videoDetails[selectedVideoIndex]?.title}
                            className='w-full h-full'
                            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                            allowFullScreen
                          />
                        </div>
                        <div className='p-6'>
                          <div className='flex items-start justify-between mb-4'>
                            <div className='flex-1'>
                              <h2 className='text-xl font-bold text-black mb-2'>
                                {videoDetails[selectedVideoIndex]?.title}
                              </h2>
                              <p className='text-gray-600 mb-3 leading-relaxed'>
                                {videoDetails[selectedVideoIndex]?.description}
                              </p>
                              <div className='flex items-center gap-4 text-sm text-gray-500'>
                                <span
                                  className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium'
                                  style={{
                                    backgroundColor: lineColor,
                                    color: isRedLine ? 'white' : '#1f2937',
                                  }}
                                >
                                  {videoDetails[selectedVideoIndex]?.category}
                                </span>
                                <span className='flex items-center'>
                                  <svg
                                    className='w-4 h-4 mr-1'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                  >
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      strokeWidth={2}
                                      d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                                    />
                                  </svg>
                                  {videoDetails[selectedVideoIndex]?.duration}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className='bg-white rounded-xl border border-gray-200 p-12 text-center'>
                      <svg
                        className='w-16 h-16 mx-auto mb-4 text-gray-400'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10V9a2 2 0 012-2h2a2 2 0 012 2v1M9 10v5a2 2 0 002 2h2a2 2 0 002-2v-5'
                        />
                      </svg>
                      <h3 className='text-lg font-semibold text-gray-700 mb-2'>
                        {tSup('nenhumVideoDisponivel')}
                      </h3>
                      <p className='text-gray-600'>{tSup('nenhumVideoDesc')}</p>
                    </div>
                  )}
                </div>
              )}

              {/* ABA DOWNLOADS - USA COMPONENTE CENTRALIZADO */}
              {activeTab === 'downloads' && (
                <PDFDownloadsSection equipment={equipment} lineConfig={config.line} tSup={tSup} />
              )}

              {/* ABA ESPECIFICAÇÕES - USA DADOS CENTRALIZADOS OU FALLBACK */}
              {activeTab === 'specs' && (
                <SpecificationsSection
                  equipment={translatedEquipment}
                  productConfig={config.product}
                  tSup={tSup}
                />
              )}
            </div>

            {/* Sidebar - MANTÉM LAYOUT EXATO */}
            <SupportSidebar
              equipment={equipment}
              translatedEquipment={translatedEquipment}
              lineConfig={config.line}
              tSup={tSup}
              tCommon={tCommon}
            />
          </div>
        </div>
      </section>
    </>
  );
}

// === COMPONENTES AUXILIARES ===

function PDFDownloadsSection({
  equipment,
  lineConfig,
  tSup,
}: {
  equipment: Equipment;
  lineConfig: any;
  tSup: any;
}) {
  const pdfs = getPDFsForEquipment(equipment.id);

  const handleDownload = (url: string, type: string) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      alert(`${type} não disponível no momento`);
    }
  };

  // GERAR FICHA TÉCNICA PROFISSIONAL (mesma lógica do SimplePDFGenerator)
  const generateTechnicalSheet = () => {
    printTechnicalSheet(equipment);
  };

  if (!pdfs || (!pdfs.manual && !pdfs.ficha)) {
    return (
      <div className='bg-white rounded-xl border border-gray-200 p-12 text-center'>
        <svg
          className='w-16 h-16 mx-auto mb-4 text-gray-400'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
          />
        </svg>
        <h3 className='text-lg font-semibold text-gray-700 mb-2'>
          {tSup('nenhumDownloadDisponivel')}
        </h3>
        <p className='text-gray-600'>{tSup('nenhumDownloadDesc')}</p>
      </div>
    );
  }

  return (
    <div className='space-y-3'>
      {/* Manual do Produto - só mostra se existe */}
      {pdfs.manual && (
        <div
          className={`group flex items-center justify-between py-4 px-5 ${
            lineConfig.line === 'red'
              ? 'hover:bg-red-50'
              : lineConfig.line === 'blue'
                ? 'hover:bg-blue-50'
                : 'hover:bg-purple-50'
          } transition-colors duration-200 rounded-lg cursor-pointer border border-gray-200`}
        >
          <div className='flex items-center gap-4'>
            <div className='w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-200'>
              <svg
                className='w-5 h-5 text-gray-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
            </div>
            <div>
              <h3 className='font-semibold text-black'>{tSup('manual')}</h3>
              <p className='text-sm text-gray-500'>PDF • Manual de instruções</p>
            </div>
          </div>
          <button
            className='text-sm font-medium text-gray-700 hover:text-black transition-colors duration-200 px-3 py-1.5 rounded-md hover:bg-black/5 btn-exception no-border'
            onClick={() => handleDownload(pdfs.manual || '', 'Manual')}
          >
            {tSup('baixar')}
          </button>
        </div>
      )}

      {/* Ficha Técnica - só mostra se existe */}
      {pdfs.ficha && (
        <div
          className={`group flex items-center justify-between py-4 px-5 ${
            lineConfig.line === 'red'
              ? 'hover:bg-red-50'
              : lineConfig.line === 'blue'
                ? 'hover:bg-blue-50'
                : 'hover:bg-purple-50'
          } transition-colors duration-200 rounded-lg cursor-pointer border border-gray-200`}
        >
          <div className='flex items-center gap-4'>
            <div className='w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-200'>
              <svg
                className='w-5 h-5 text-gray-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
            </div>
            <div>
              <h3 className='font-semibold text-black'>{tSup('specSheet')}</h3>
              <p className='text-sm text-gray-500'>PDF • Especificações técnicas</p>
            </div>
          </div>
          <button
            className='text-sm font-medium text-gray-700 hover:text-black transition-colors duration-200 px-3 py-1.5 rounded-md hover:bg-black/5 btn-exception no-border'
            onClick={generateTechnicalSheet}
          >
            {tSup('baixar')}
          </button>
        </div>
      )}
    </div>
  );
}

function SpecificationsSection({
  equipment,
  productConfig,
  tSup,
}: {
  equipment: Equipment;
  productConfig: any;
  tSup: any;
}) {
  const { translateSpecification } = useEquipmentTranslations();

  // Função utilitária para filtrar especificações vazias
  const filterEmptySpecifications = (specifications: Record<string, any>) => {
    return Object.fromEntries(
      Object.entries(specifications).filter(([, value]) => {
        // Remove campos que contêm apenas "—" ou estão vazios
        return value && value.toString().trim() !== '—' && value.toString().trim() !== '';
      })
    );
  };

  // Se tem configuração centralizada, usa ela; senão usa dados do equipment
  const specifications = productConfig?.specifications || equipment.specifications;
  const filteredSpecifications = filterEmptySpecifications(specifications);

  return (
    <div className='bg-white rounded-xl border border-gray-200 p-4 sm:p-6 w-full overflow-x-hidden'>
      <h3 className='font-bold text-black text-lg mb-4 sm:mb-6'>{tSup('especificacoesTecnicas')}</h3>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full'>
        {Object.entries(filteredSpecifications).map(([key, value]) => (
          <div key={key} className='border-b border-gray-100 pb-3 sm:pb-4 w-full min-w-0'>
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 w-full'>
              <span className='text-gray-600 text-sm font-medium break-words w-full sm:w-auto sm:flex-1 sm:pr-4'>
                {translateSpecification(key)}:
              </span>
              <span 
                className='font-semibold text-black text-sm text-left sm:text-right break-words sm:flex-1 sm:min-w-0' 
                style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
              >
                {value as string}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SupportSidebar({
  equipment,
  translatedEquipment,
  lineConfig,
  tSup,
  tCommon,
}: {
  equipment: Equipment;
  translatedEquipment: Equipment;
  lineConfig: any;
  tSup: any;
  tCommon: any;
}) {
  const lineColor = lineConfig.colors.primary;

  return (
    <div className='space-y-6'>
      {/* Quick info */}
      <div className='bg-white rounded-xl border border-gray-200 p-6'>
        <h3 className='font-bold text-black text-lg mb-4'>{tSup('informacoesRapidas')}</h3>
        <div className='space-y-3'>
          <div className='flex justify-between'>
            <span className='text-gray-600'>{tCommon('category', { default: 'Categoria' })}:</span>
            <span className='font-medium text-black'>
              {lineConfig.type === 'cardio' ? 'Cardio' : 'Musculação'}
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-600'>{tCommon('line', { default: 'Linha' })}:</span>
            <span className='font-medium' style={{ color: lineColor }}>
              {lineConfig.line === 'red'
                ? 'Red Line'
                : lineConfig.line === 'blue'
                  ? 'Blue Line'
                  : 'Musculação'}
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-600'>Modelo:</span>
            <span className='font-medium text-black'>{translatedEquipment.model}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-600'>Marca:</span>
            <span className='font-medium text-black'>{translatedEquipment.brand}</span>
          </div>
        </div>
      </div>

      {/* Recursos principais */}
      <div className='bg-white rounded-xl border border-gray-200 p-6'>
        <h3 className='font-bold text-black text-lg mb-4'>
          {tCommon('mainFeatures', { default: 'Recursos Principais' })}
        </h3>
        <div className='space-y-2'>
          {translatedEquipment.features.slice(0, 6).map((feature, index) => (
            <div key={index} className='flex items-start gap-2'>
              <svg
                className='w-4 h-4 mt-0.5 flex-shrink-0'
                style={{ color: lineColor }}
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                  clipRule='evenodd'
                />
              </svg>
              <span className='text-gray-700 text-sm'>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Outras especificações */}
      <div className='bg-white rounded-xl border border-gray-200 p-6'>
        <h3 className='font-bold text-black text-lg mb-4'>
          {tCommon('additionalInfo', { default: 'Informações Adicionais' })}
        </h3>
        <div className='space-y-3'>
          <div className='flex justify-between'>
            <span className='text-gray-600'>Disponibilidade:</span>
            <span className='font-medium text-green-600'>
              {translatedEquipment.inStock ? 'Em Estoque' : 'Sob Consulta'}
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-600'>Produto Destacado:</span>
            <span className='font-medium text-black'>
              {translatedEquipment.featured ? 'Sim' : 'Não'}
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-600'>Público-Alvo:</span>
            <span className='font-medium text-black'>
              {translatedEquipment.targets
                .map((target) =>
                  target === 'academia'
                    ? 'Academia'
                    : target === 'condominio'
                      ? 'Condomínio'
                      : 'Residência'
                )
                .join(', ')}
            </span>
          </div>
        </div>
      </div>

      {/* Suporte */}
      <div
        className='rounded-xl p-6 border'
        style={{
          background: `linear-gradient(135deg, ${lineConfig.line === 'red' ? '#9c100610' : lineConfig.line === 'blue' ? '#61fbfe10' : '#64748b10'} 0%, ${lineConfig.line === 'red' ? '#9c100620' : lineConfig.line === 'blue' ? '#61fbfe20' : '#64748b20'} 100%)`,
          borderColor:
            lineConfig.line === 'red'
              ? '#9c100640'
              : lineConfig.line === 'blue'
                ? '#61fbfe40'
                : '#64748b40',
        }}
      >
        <h3 className='font-bold text-black text-lg mb-4'>{tSup('precisaAjuda')}</h3>
        <p className='text-gray-700 text-sm mb-6'>{tSup('equipeAjuda')}</p>
        <div className='space-y-3'>
          <a
            href={`https://wa.me/55${APP_CONFIG.contact.suporte.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`${tCommon('contatoTecnicoEquipamento')} ${equipment?.name || 'Power Run'}.`)}`}
            target='_blank'
            rel='noopener noreferrer'
            className='block w-full'
          >
            <Button
              className='w-full hover:opacity-90 btn-exception no-border'
              style={{
                backgroundColor: lineConfig.colors.primary,
                color:
                  lineConfig.line === 'red' || lineConfig.line === 'musculacao'
                    ? 'white'
                    : '#1f2937',
              }}
            >
              {tSup('contatoTecnico')}
            </Button>
          </a>
          <a
            href={`https://wa.me/55${APP_CONFIG.contact.suporte.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`${tCommon('suporteWhatsAppEquipamento')} ${equipment?.name || 'Power Run'}.`)}`}
            target='_blank'
            rel='noopener noreferrer'
            className='block w-full'
          >
            <Button variant='outline' className='w-full btn-exception no-border'>
              {tSup('whatsappSuporte')}
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
