'use client';

/**
 * Página Offline - AAAA+++
 *
 * Exibida quando o Service Worker detecta ausência de conexão
 * Oferece funcionalidades offline limitadas e informações úteis
 */

export default function OfflinePage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4'>
      <div className='max-w-md w-full'>
        {/* Ícone offline animado */}
        <div className='text-center mb-8'>
          <div className='relative inline-block'>
            <div className='w-24 h-24 mx-auto mb-4 relative'>
              <div className='absolute inset-0 border-4 border-gray-300 rounded-full'></div>
              <div className='absolute inset-2 bg-white rounded-full flex items-center justify-center'>
                <svg
                  className='w-8 h-8 text-gray-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M18.364 5.636l-12.728 12.728m0-12.728l12.728 12.728'
                  />
                </svg>
              </div>
              {/* Ondas de sinal cortadas */}
              <div className='absolute -top-2 -right-2 w-6 h-6'>
                <div className='absolute inset-0 border-2 border-red-400 rounded-full opacity-75'></div>
                <div className='absolute inset-0 border-2 border-red-400 rounded-full animate-ping'></div>
              </div>
            </div>
            <div className='text-2xl text-red-400 animate-pulse'>📴</div>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className='bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20'>
          <h1 className='text-3xl font-bold text-white text-center mb-4'>Você está Offline</h1>

          <p className='text-blue-100 text-center mb-6 leading-relaxed'>
            Sua conexão com a internet foi perdida. Algumas funcionalidades podem estar limitadas,
            mas você ainda pode navegar pelo conteúdo já carregado.
          </p>

          {/* Status de conexão */}
          <div className='bg-amber-500/20 border border-amber-500/30 rounded-lg p-4 mb-6'>
            <div className='flex items-center gap-3'>
              <div className='w-3 h-3 bg-amber-500 rounded-full animate-pulse'></div>
              <span className='text-amber-200 font-medium'>
                Tentando reconectar automaticamente...
              </span>
            </div>
          </div>

          {/* Funcionalidades offline */}
          <div className='space-y-4 mb-6'>
            <h3 className='text-lg font-semibold text-white mb-3'>Disponível Offline:</h3>

            <div className='space-y-2'>
              <div className='flex items-center gap-3 text-green-300'>
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
                <span>Conteúdo já visitado</span>
              </div>

              <div className='flex items-center gap-3 text-green-300'>
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
                <span>Imagens em cache</span>
              </div>

              <div className='flex items-center gap-3 text-green-300'>
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
                <span>Navegação básica</span>
              </div>
            </div>
          </div>

          {/* Funcionalidades limitadas */}
          <div className='space-y-4 mb-8'>
            <h3 className='text-lg font-semibold text-white mb-3'>Limitado sem Internet:</h3>

            <div className='space-y-2'>
              <div className='flex items-center gap-3 text-amber-300'>
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  />
                </svg>
                <span>Dados dinâmicos</span>
              </div>

              <div className='flex items-center gap-3 text-amber-300'>
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  />
                </svg>
                <span>Formulários de contato</span>
              </div>

              <div className='flex items-center gap-3 text-amber-300'>
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  />
                </svg>
                <span>Atualizações em tempo real</span>
              </div>
            </div>
          </div>

          {/* Botões de ação */}
          <div className='space-y-3'>
            <button
              onClick={() => window.location.reload()}
              className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                />
              </svg>
              Tentar Novamente
            </button>

            <button
              onClick={() => window.history.back()}
              className='w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M10 19l-7-7m0 0l7-7m-7 7h18'
                />
              </svg>
              Voltar
            </button>
          </div>
        </div>

        {/* Informações adicionais */}
        <div className='text-center mt-6 text-blue-200 text-sm'>
          <p>Power Run funciona melhor com conexão de internet.</p>
          <p className='mt-1'>Verifique sua conexão e tente novamente.</p>
        </div>
      </div>

      {/* Background decorativo */}
      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl'></div>
        <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl'></div>
      </div>
    </div>
  );
}
