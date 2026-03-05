import { CardSkeleton } from './LoadingSkeleton';

export const HomePageSkeleton = () => {
  return (
    <div>
      {/* Hero Section - EXATO como o real */}
      <section className='relative min-h-[80vh] lg:min-h-[90vh] overflow-hidden bg-black shadow-2xl'>
        {/* Vídeo de Fundo placeholder */}
        <div className='absolute inset-0 w-full h-full overflow-hidden bg-gray-700 animate-pulse opacity-30' />

        {/* Overlay Gradiente Elegante - MESMOS gradientes */}
        <div className='absolute inset-0 bg-gradient-to-r from-black via-black/95 via-black/70 to-transparent'>
          <div className='absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40' />
        </div>

        {/* Conteúdo Premium */}
        <div className='relative z-10 min-h-[80vh] lg:min-h-[90vh] flex items-center pt-24 pb-8'>
          <div className='container mx-auto px-4'>
            <div className='max-w-3xl space-y-6 lg:space-y-8'>
              {/* Título Principal - MESMA estrutura */}
              <div>
                <div className='h-12 sm:h-16 lg:h-20 w-3/4 bg-gray-600 rounded animate-pulse mb-2'></div>
                <div className='h-12 sm:h-16 lg:h-20 w-2/3 bg-gray-500 rounded animate-pulse mb-2'></div>
                <div className='h-8 sm:h-10 lg:h-12 w-1/2 bg-gray-600 rounded animate-pulse'></div>
              </div>

              {/* Subtítulo Elegante */}
              <div className='max-w-2xl space-y-2'>
                <div className='h-6 w-full bg-gray-700 rounded animate-pulse'></div>
                <div className='h-6 w-3/4 bg-gray-700 rounded animate-pulse'></div>
              </div>

              {/* Estatísticas Premium - MESMA estrutura */}
              <div className='flex items-center justify-start space-x-4 sm:space-x-8 py-4'>
                <div className='text-center'>
                  <div className='h-8 sm:h-10 w-16 bg-gray-600 rounded animate-pulse mb-2'></div>
                  <div className='h-4 w-20 bg-gray-700 rounded animate-pulse'></div>
                </div>
                <div className='w-px h-8 sm:h-12 bg-white/20'></div>
                <div className='text-center'>
                  <div className='h-8 sm:h-10 w-16 bg-gray-600 rounded animate-pulse mb-2'></div>
                  <div className='h-4 w-16 bg-gray-700 rounded animate-pulse'></div>
                </div>
                <div className='w-px h-8 sm:h-12 bg-white/20'></div>
                <div className='text-center'>
                  <div className='h-8 sm:h-10 w-16 bg-gray-600 rounded animate-pulse mb-2'></div>
                  <div className='h-4 w-24 bg-gray-700 rounded animate-pulse'></div>
                </div>
              </div>

              {/* Call to Actions Premium */}
              <div className='flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4'>
                <div className='h-14 w-full sm:w-40 bg-gray-300 rounded-xl animate-pulse'></div>
                <div className='h-14 w-full sm:w-32 bg-gray-600 border border-gray-500 rounded-xl animate-pulse'></div>
              </div>
            </div>

            {/* Indicador de Scroll */}
            <div className='absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center space-y-2'>
              <div className='h-4 w-20 bg-gray-700 rounded animate-pulse'></div>
              <div className='w-6 h-10 border-2 border-white/30 rounded-full flex justify-center'>
                <div className='w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce'></div>
              </div>
            </div>
          </div>
        </div>

        {/* Efeitos de Brilho */}
        <div className='absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-30 animate-pulse'></div>
      </section>

      {/* Carousel Section - MESMO background e estrutura */}
      <section className='bg-white pt-20 pb-8 w-full overflow-hidden'>
        <div className='w-full px-4 sm:px-6 lg:px-8'>
          {/* Título do carousel */}
          <div className='text-center mb-12'>
            <div className='h-8 w-1/3 mx-auto bg-gray-200 rounded animate-pulse mb-4'></div>
            <div className='h-6 w-1/2 mx-auto bg-gray-200 rounded animate-pulse'></div>
          </div>

          {/* Carousel mockup */}
          <div className='relative'>
            <div className='flex space-x-4 overflow-hidden'>
              {[...Array(6)].map((_, i) => (
                <div
                  key={`carousel-skeleton-${i}`}
                  className='flex-none w-80 h-96 bg-gray-200 rounded-2xl animate-pulse'
                ></div>
              ))}
            </div>

            {/* Navegação */}
            <div className='absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-gray-300 rounded-full animate-pulse'></div>
            <div className='absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-gray-300 rounded-full animate-pulse'></div>
          </div>
        </div>
      </section>

      {/* Equipamentos Destaque - MESMA estrutura */}
      <section className='relative bg-white pt-8 pb-12'>
        {/* Divisor elegante com gradiente - EXATO */}
        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent'></div>

        <div className='container mx-auto px-4'>
          <div className='text-center mb-10'>
            <div className='h-10 w-2/5 mx-auto bg-gray-200 rounded animate-pulse mb-2'></div>
            <div className='h-10 w-1/3 mx-auto bg-gray-200 rounded animate-pulse mb-3'></div>
            <div className='h-6 w-1/2 mx-auto bg-gray-200 rounded animate-pulse'></div>
          </div>

          {/* Grid 4 colunas - MESMA estrutura */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {[...Array(8)].map((_, i) => (
              <CardSkeleton key={`card-skeleton-${i}`} className='h-80' imageHeight='h-48' />
            ))}
          </div>
        </div>
      </section>

      {/* Soluções Segmentos - MESMA estrutura */}
      <section className='relative bg-white pt-8 pb-12'>
        {/* Divisor elegante com gradiente - EXATO */}
        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent'></div>

        <div className='container mx-auto px-4'>
          <div className='text-center mb-10'>
            <div className='h-10 w-2/5 mx-auto bg-gray-200 rounded animate-pulse mb-2'></div>
            <div className='h-10 w-1/3 mx-auto bg-gray-200 rounded animate-pulse mb-3'></div>
            <div className='h-6 w-1/2 mx-auto bg-gray-200 rounded animate-pulse'></div>
          </div>
        </div>

        {/* Grid de 4 cards - 2x2 - MESMA estrutura */}
        <div className='w-full mb-12'>
          <div className='container mx-auto px-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              {[...Array(4)].map((_, i) => (
                <div
                  key={`segment-skeleton-${i}`}
                  className='relative h-[400px] bg-gray-200 rounded-2xl animate-pulse overflow-hidden'
                >
                  <div className='absolute inset-0 bg-gradient-to-t from-gray-400/50 to-transparent' />
                  <div className='absolute bottom-6 left-6 right-6 space-y-3'>
                    <div className='h-8 w-3/4 bg-gray-600 rounded animate-pulse'></div>
                    <div className='h-4 w-full bg-gray-700 rounded animate-pulse'></div>
                    <div className='h-4 w-2/3 bg-gray-700 rounded animate-pulse'></div>
                    <div className='h-8 w-24 bg-gray-500 rounded-full animate-pulse mt-4'></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Clientes - MESMA estrutura */}
        <div className='container mx-auto px-4 py-12'>
          <div className='text-center mb-16'>
            <div className='h-10 w-1/3 mx-auto bg-gray-200 rounded animate-pulse mb-3'></div>
            <div className='h-6 w-1/2 mx-auto bg-gray-200 rounded animate-pulse'></div>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center'>
            {[...Array(6)].map((_, i) => (
              <div
                key={`client-skeleton-${i}`}
                className='aspect-video bg-gray-200 rounded-xl border border-gray-200 animate-pulse'
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
