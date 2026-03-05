export const EquipamentosPageSkeleton = () => {
  return (
    <div className='relative min-h-screen bg-white pb-20'>
      {/* Hero Banner - EXATO como o real */}
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
              <div className='h-12 lg:h-16 w-3/4 bg-gray-600 rounded animate-pulse mb-6'></div>
              <div className='space-y-2 mb-8'>
                <div className='h-6 w-full bg-gray-700 rounded animate-pulse'></div>
                <div className='h-6 w-2/3 bg-gray-700 rounded animate-pulse'></div>
              </div>

              <div className='flex flex-col sm:flex-row gap-4'>
                <div className='h-14 w-32 bg-gray-300 rounded animate-pulse'></div>
                <div className='h-14 w-40 bg-gray-600 border border-gray-500 rounded animate-pulse'></div>
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
          <div className='h-10 w-24 bg-gray-200 rounded animate-pulse'></div>
          <div className='h-10 w-32 bg-gray-200 rounded animate-pulse'></div>
          <div className='h-10 w-28 bg-gray-200 rounded animate-pulse'></div>
          <div className='h-10 w-36 bg-gray-200 rounded animate-pulse'></div>
          <div className='h-10 w-32 bg-gray-200 rounded animate-pulse'></div>
        </div>

        {/* Grid de equipamentos - MESMA estrutura */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className='bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm'
            >
              <div className='h-48 bg-gray-200 animate-pulse'></div>
              <div className='p-6'>
                <div className='h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2'></div>
                <div className='h-4 w-full bg-gray-200 rounded animate-pulse mb-1'></div>
                <div className='h-4 w-2/3 bg-gray-200 rounded animate-pulse mb-4'></div>
                <div className='flex items-center justify-between'>
                  <div className='h-5 w-20 bg-gray-300 rounded animate-pulse'></div>
                  <div className='h-8 w-24 bg-gray-200 rounded animate-pulse'></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Paginação */}
        <div className='flex justify-center mt-12'>
          <div className='flex space-x-2'>
            {[...Array(5)].map((_, i) => (
              <div key={i} className='h-10 w-10 bg-gray-200 rounded animate-pulse'></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
