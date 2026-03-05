export const SuportePageSkeleton = () => {
  return (
    <div className='relative min-h-screen bg-white'>
      {/* Hero Banner - MESMA estrutura */}
      <section className='relative bg-gradient-to-br from-gray-900 via-black to-gray-800 overflow-hidden pt-32 pb-20'>
        <div className='absolute inset-0 w-full h-full bg-gray-700 animate-pulse opacity-20' />

        <div className='absolute inset-0 bg-gradient-to-r from-black via-black/95 to-black/70'>
          <div className='absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60' />
        </div>

        <div className='relative z-10'>
          <div className='container mx-auto px-4'>
            {/* Breadcrumb - MESMA estrutura */}
            <nav className='flex items-center space-x-2 text-sm text-gray-300 mb-8'>
              <div className='h-4 w-12 bg-gray-600 rounded animate-pulse'></div>
              <svg
                className='w-4 h-4 text-gray-500'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5l7 7-7 7'
                />
              </svg>
              <div className='h-4 w-24 bg-gray-500 rounded animate-pulse'></div>
            </nav>

            {/* Título - MESMA estrutura */}
            <div className='max-w-4xl'>
              <div className='h-12 lg:h-16 w-1/2 bg-gray-600 rounded animate-pulse mb-6'></div>
              <div className='space-y-2 mb-8'>
                <div className='h-6 w-full bg-gray-700 rounded animate-pulse'></div>
                <div className='h-6 w-2/3 bg-gray-700 rounded animate-pulse'></div>
              </div>

              <div className='flex flex-col sm:flex-row gap-4'>
                <div className='h-14 w-40 bg-gray-300 rounded animate-pulse'></div>
                <div className='h-14 w-36 bg-gray-600 border border-gray-500 rounded animate-pulse'></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Componente Client Area */}
      <div className='container mx-auto px-4 py-12'>
        {/* Título da lista */}
        <div className='h-8 bg-gray-200 rounded w-1/3 mb-8 animate-pulse'></div>

        {/* Filtros */}
        <div className='flex flex-wrap gap-4 mb-8'>
          <div className='h-10 w-20 bg-gray-200 rounded animate-pulse'></div>
          <div className='h-10 w-28 bg-gray-200 rounded animate-pulse'></div>
          <div className='h-10 w-24 bg-gray-200 rounded animate-pulse'></div>
          <div className='h-10 w-32 bg-gray-200 rounded animate-pulse'></div>
        </div>

        {/* Grid de equipamentos - MESMA estrutura 4 colunas */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {[...Array(12)].map((_, i) => (
            <div
              key={`support-skeleton-${i}`}
              className='bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm'
            >
              <div className='h-48 bg-gray-200 animate-pulse'></div>
              <div className='p-6'>
                <div className='h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2'></div>
                <div className='h-4 w-full bg-gray-200 rounded animate-pulse mb-1'></div>
                <div className='h-4 w-2/3 bg-gray-200 rounded animate-pulse mb-4'></div>

                {/* Ícones de materiais */}
                <div className='flex items-center justify-between mb-4'>
                  <div className='flex space-x-2'>
                    <div className='w-6 h-6 bg-gray-300 rounded animate-pulse'></div>
                    <div className='w-6 h-6 bg-gray-300 rounded animate-pulse'></div>
                    <div className='w-6 h-6 bg-gray-300 rounded animate-pulse'></div>
                  </div>
                  <div className='h-4 w-12 bg-gray-300 rounded animate-pulse'></div>
                </div>

                <div className='h-8 w-full bg-gray-200 rounded animate-pulse'></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const SuporteEquipmentPageSkeleton = () => {
  return (
    <div className='relative min-h-screen bg-gray-50'>
      {/* Hero Banner - MESMA estrutura */}
      <section className='relative bg-gradient-to-br from-gray-900 via-black to-gray-800 overflow-hidden pt-24 pb-12'>
        <div className='absolute inset-0 w-full h-full bg-gray-700 animate-pulse opacity-20' />

        <div className='absolute inset-0 bg-gradient-to-r from-black via-black/95 to-black/70' />

        <div className='relative z-10'>
          <div className='container mx-auto px-4'>
            {/* Breadcrumb - MESMA estrutura */}
            <nav className='flex items-center space-x-2 text-sm text-gray-300 mb-6'>
              <div className='h-4 w-12 bg-gray-600 rounded animate-pulse'></div>
              <svg
                className='w-4 h-4 text-gray-500'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5l7 7-7 7'
                />
              </svg>
              <div className='h-4 w-16 bg-gray-600 rounded animate-pulse'></div>
              <svg
                className='w-4 h-4 text-gray-500'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5l7 7-7 7'
                />
              </svg>
              <div className='h-4 w-32 bg-gray-500 rounded animate-pulse'></div>
            </nav>

            {/* Header do equipamento - MESMA estrutura */}
            <div className='flex flex-col lg:flex-row items-start lg:items-center gap-6'>
              <div className='flex-1'>
                {/* Badge da linha */}
                <div className='h-6 w-20 bg-gray-600 rounded-full animate-pulse mb-3'></div>

                <div className='h-8 lg:h-10 w-3/4 bg-gray-600 rounded animate-pulse mb-3'></div>
                <div className='h-5 w-full bg-gray-700 rounded animate-pulse mb-4'></div>
                <div className='flex items-center gap-6'>
                  <div className='h-4 w-24 bg-gray-700 rounded animate-pulse'></div>
                  <div className='h-4 w-28 bg-gray-700 rounded animate-pulse'></div>
                </div>
              </div>

              {/* Imagem do equipamento - MESMA estrutura */}
              <div className='w-full lg:w-80 h-48 lg:h-56 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-4'>
                <div className='w-full h-full bg-gray-600 rounded-xl animate-pulse'></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navegação por tabs - MESMA estrutura */}
      <section className='bg-white border-b border-gray-200 sticky top-0 z-40'>
        <div className='container mx-auto px-4'>
          <div className='flex space-x-8'>
            {[...Array(3)].map((_, i) => (
              <div key={`tab-skeleton-${i}`} className='flex items-center px-4 py-4'>
                <div className='w-4 h-4 bg-gray-200 rounded animate-pulse mr-2'></div>
                <div className='h-4 w-16 bg-gray-200 rounded animate-pulse'></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conteúdo principal - MESMA estrutura */}
      <section className='py-8'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Conteúdo principal */}
            <div className='lg:col-span-2 space-y-6'>
              {/* Seletor de vídeos */}
              <div className='bg-white rounded-xl border border-gray-200 p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='h-6 w-32 bg-gray-200 rounded animate-pulse'></div>
                  <div className='h-4 w-24 bg-gray-200 rounded animate-pulse'></div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={`content-skeleton-${i}`}
                      className='p-4 rounded-lg border border-gray-200'
                    >
                      <div className='flex items-start gap-3'>
                        <div className='w-16 h-12 bg-gray-200 rounded-md animate-pulse'></div>
                        <div className='flex-1 space-y-2'>
                          <div className='h-4 w-3/4 bg-gray-200 rounded animate-pulse'></div>
                          <div className='h-3 w-16 bg-gray-200 rounded animate-pulse'></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Player de vídeo principal */}
              <div className='bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg'>
                <div className='aspect-video bg-gray-200 animate-pulse flex items-center justify-center'>
                  <svg className='w-16 h-16 text-gray-400' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M8 5v14l11-7z' />
                  </svg>
                </div>
                <div className='p-6'>
                  <div className='h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2'></div>
                  <div className='h-4 w-full bg-gray-200 rounded animate-pulse mb-1'></div>
                  <div className='h-4 w-2/3 bg-gray-200 rounded animate-pulse mb-4'></div>
                  <div className='flex items-center gap-4'>
                    <div className='h-6 w-20 bg-gray-200 rounded animate-pulse'></div>
                    <div className='h-4 w-16 bg-gray-200 rounded animate-pulse'></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - MESMA estrutura */}
            <div className='space-y-6'>
              {/* Quick info */}
              <div className='bg-white rounded-xl border border-gray-200 p-6'>
                <div className='h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-4'></div>
                <div className='space-y-3'>
                  <div className='flex justify-between'>
                    <div className='h-4 w-16 bg-gray-200 rounded animate-pulse'></div>
                    <div className='h-4 w-20 bg-gray-200 rounded animate-pulse'></div>
                  </div>
                  <div className='flex justify-between'>
                    <div className='h-4 w-12 bg-gray-200 rounded animate-pulse'></div>
                    <div className='h-4 w-16 bg-gray-200 rounded animate-pulse'></div>
                  </div>
                </div>
              </div>

              {/* Recursos principais */}
              <div className='bg-white rounded-xl border border-gray-200 p-6'>
                <div className='h-6 w-2/3 bg-gray-200 rounded animate-pulse mb-4'></div>
                <div className='space-y-2'>
                  {[...Array(6)].map((_, i) => (
                    <div key={`spec-skeleton-${i}`} className='flex items-start gap-2'>
                      <div className='w-4 h-4 bg-gray-200 rounded animate-pulse mt-0.5'></div>
                      <div className='h-4 w-3/4 bg-gray-200 rounded animate-pulse'></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suporte */}
              <div className='bg-gray-50 rounded-xl border border-gray-200 p-6'>
                <div className='h-6 w-1/2 bg-gray-200 rounded animate-pulse mb-4'></div>
                <div className='h-4 w-full bg-gray-200 rounded animate-pulse mb-6'></div>
                <div className='space-y-3'>
                  <div className='h-10 w-full bg-gray-200 rounded animate-pulse'></div>
                  <div className='h-10 w-full bg-gray-200 rounded animate-pulse'></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
