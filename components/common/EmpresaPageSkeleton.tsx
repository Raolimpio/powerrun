import { SectionSkeleton, GridSkeleton, TimelineSkeleton, VideoSkeleton } from './LoadingSkeleton';

export const EmpresaPageSkeleton = () => {
  return (
    <div className='bg-white min-h-screen'>
      {/* Hero Section - PRETO com vídeo de fundo */}
      <section className='relative bg-black overflow-hidden'>
        <div className='absolute inset-0 w-full h-full bg-gray-700 animate-pulse opacity-20' />

        <div className='absolute inset-0 bg-gradient-to-r from-black via-black/95 via-black/70 to-transparent'>
          <div className='absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40' />
        </div>

        <div className='relative z-10 pt-32 pb-20'>
          <div className='container mx-auto px-4 text-center'>
            <div className='space-y-6'>
              <div className='h-16 lg:h-20 w-2/3 mx-auto bg-gray-600 rounded animate-pulse mb-2'></div>
              <div className='h-16 lg:h-20 w-1/2 mx-auto bg-gray-500 rounded animate-pulse mb-6'></div>
            </div>

            <div className='h-6 w-3/4 mx-auto bg-gray-700 rounded animate-pulse mb-2'></div>
            <div className='h-6 w-1/2 mx-auto bg-gray-700 rounded animate-pulse mb-12'></div>

            {/* Estatísticas - MESMA estrutura */}
            <div className='flex items-center justify-center space-x-4 sm:space-x-8 py-4'>
              {[...Array(4)].map((_, i) => (
                <div key={`nav-skeleton-${i}`} className='text-center'>
                  <div className='h-8 w-16 bg-gray-600 rounded animate-pulse mb-2'></div>
                  <div className='h-4 w-20 bg-gray-700 rounded animate-pulse'></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Galeria de Imagens - BRANCO/CINZA */}
      <SectionSkeleton background='gray' title subtitle>
        <GridSkeleton
          columns={3}
          items={6}
          itemHeight='h-64 lg:h-80'
          className='grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        />
      </SectionSkeleton>

      {/* Nossa Essência - PRETO */}
      <section className='py-20 bg-black relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-b from-gray-900/20 via-transparent to-gray-900/20' />

        <div className='container mx-auto px-4 relative z-10'>
          <div className='text-center mb-16'>
            <div className='h-12 w-1/3 mx-auto bg-gray-600 rounded animate-pulse mb-2'></div>
            <div className='h-12 w-1/4 mx-auto bg-gray-500 rounded animate-pulse mb-6'></div>
            <div className='h-6 w-3/4 mx-auto bg-gray-700 rounded animate-pulse mb-2'></div>
            <div className='h-6 w-1/2 mx-auto bg-gray-700 rounded animate-pulse'></div>
          </div>

          {/* Missão, Visão e Valores em Grid Moderno */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20'>
            {[...Array(3)].map((_, i) => (
              <div
                key={`timeline-skeleton-${i}`}
                className='backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl'
              >
                <div className='w-16 h-16 bg-gray-600 rounded-2xl animate-pulse mb-6'></div>
                <div className='h-6 w-3/4 bg-gray-600 rounded animate-pulse mb-4'></div>
                <div className='space-y-2'>
                  <div className='h-4 w-full bg-gray-700 rounded animate-pulse'></div>
                  <div className='h-4 w-5/6 bg-gray-700 rounded animate-pulse'></div>
                  <div className='h-4 w-2/3 bg-gray-700 rounded animate-pulse'></div>
                </div>
              </div>
            ))}
          </div>

          {/* Valores com Layout Moderno */}
          <div className='space-y-8'>
            <div className='text-center mb-12'>
              <div className='h-8 w-1/4 mx-auto bg-gray-600 rounded animate-pulse mb-4'></div>
              <div className='w-24 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto'></div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              {[...Array(4)].map((_, i) => (
                <div
                  key={`video-skeleton-${i}`}
                  className='backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl'
                >
                  <div className='flex flex-col lg:flex-row'>
                    <div className='lg:w-1/2 h-48 lg:h-auto bg-gray-600 animate-pulse'></div>
                    <div className='lg:w-1/2 p-6 lg:p-8 flex flex-col justify-center space-y-4'>
                      <div className='h-6 w-3/4 bg-gray-600 rounded animate-pulse'></div>
                      <div className='space-y-2'>
                        <div className='h-4 w-full bg-gray-700 rounded animate-pulse'></div>
                        <div className='h-4 w-5/6 bg-gray-700 rounded animate-pulse'></div>
                        <div className='h-4 w-2/3 bg-gray-700 rounded animate-pulse'></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video Institucional - PRETO com vídeo */}
      <SectionSkeleton background='black' title subtitle>
        <div className='max-w-4xl mx-auto'>
          <VideoSkeleton className='h-96 rounded-2xl overflow-hidden shadow-2xl' />
        </div>
      </SectionSkeleton>

      {/* Timeline da História - BRANCO/CINZA */}
      <SectionSkeleton background='white' title subtitle>
        <TimelineSkeleton items={5} />
      </SectionSkeleton>

      {/* CTA Section - CINZA CLARO */}
      <SectionSkeleton background='gray' title subtitle>
        <div className='text-center'>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <div className='h-14 w-40 bg-gray-200 rounded animate-pulse'></div>
            <div className='h-14 w-32 bg-gray-200 rounded animate-pulse'></div>
          </div>
        </div>
      </SectionSkeleton>
    </div>
  );
};
