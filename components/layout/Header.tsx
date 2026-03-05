'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { APP_CONFIG } from '@/constants';
import { MegaMenu } from './MegaMenu';
import { SearchMegaMenu } from './SearchMegaMenu';

export function Header() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMegaMenuAnimating, setIsMegaMenuAnimating] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false); // Estado inicial
  const [megaMenuCloseTimeout, setMegaMenuCloseTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    setIsClient(true);
  }, []);

  // Limpar timeout ao desmontar
  useEffect(() => {
    return () => {
      if (megaMenuCloseTimeout) {
        clearTimeout(megaMenuCloseTimeout);
      }
    };
  }, [megaMenuCloseTimeout]);

  // Funções para controlar o mega menu com delay e animações
  const handleMegaMenuOpen = () => {
    // Não abrir mega menu em telas pequenas (mobile/tablet)
    if (isSmallScreen) return;

    if (megaMenuCloseTimeout) {
      clearTimeout(megaMenuCloseTimeout);
      setMegaMenuCloseTimeout(null);
    }
    setIsMegaMenuAnimating(true);
    setIsMegaMenuOpen(true);
  };

  const handleMegaMenuClose = () => {
    const timeout = setTimeout(() => {
      setIsMegaMenuAnimating(false);
      // Delay adicional para permitir que a animação de saída termine
      setTimeout(() => {
        setIsMegaMenuOpen(false);
      }, 150);
    }, 800); // 800ms de delay antes de fechar - tempo generoso para navegação
    setMegaMenuCloseTimeout(timeout);
  };

  const cancelMegaMenuClose = () => {
    if (megaMenuCloseTimeout) {
      clearTimeout(megaMenuCloseTimeout);
      setMegaMenuCloseTimeout(null);
    }
    setIsMegaMenuAnimating(true); // Manter animação ativa quando hover volta
  };

  // Detectar quando a tela é mobile/tablet para usar fundo branco completo
  useEffect(() => {
    const checkScreenSize = () => {
      const isMobile = window.innerWidth < 1024;
      // console.log('Screen size check:', window.innerWidth, 'isMobile:', isMobile);
      setIsSmallScreen(isMobile);
    };

    if (typeof window !== 'undefined') {
      // Verificar tamanho inicial
      checkScreenSize();

      // Listener para redimensionamento com debounce
      let timeoutId: ReturnType<typeof setTimeout>;
      const debouncedResize = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(checkScreenSize, 10); // Debounce muito rápido para responsividade
      };

      window.addEventListener('resize', debouncedResize, { passive: true });

      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('resize', debouncedResize);
      };
    }

    return () => {}; // Return cleanup function even when window is undefined
  }, []);

  // Efeito para controlar scroll do body quando menu mobile está aberto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup quando componente desmonta
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Fechar menu mobile com tecla ESC e ao redimensionar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
      // Atualizar estado de tela pequena também
      const isMobile = window.innerWidth < 1024;
      setIsSmallScreen(isMobile);

      // Fechar mega menu se mudou para mobile
      if (isMobile && isMegaMenuOpen) {
        setIsMegaMenuOpen(false);
        setIsMegaMenuAnimating(false);
        if (megaMenuCloseTimeout) {
          clearTimeout(megaMenuCloseTimeout);
          setMegaMenuCloseTimeout(null);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMounted) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMounted]);

  // Calcula o gradiente baseado na posição do mouse
  const getGradientStyle = () => {
    if (!isMounted || !isClient || typeof window === 'undefined') {
      return {
        background: 'linear-gradient(90deg, #61fbfe 0%, #9c1006 100%)',
      };
    }

    const windowWidth = window.innerWidth;
    const percentage = (mousePosition.x / windowWidth) * 100;

    return {
      background: `linear-gradient(90deg, #61fbfe ${Math.max(0, percentage - 20)}%, #9c1006 ${Math.min(100, percentage + 20)}%)`,
    };
  };

  // Prevent hydration mismatch by not rendering interactive elements until mounted
  if (!isMounted) {
    return (
      <header className='relative z-50 w-full'>
        <div className='bg-white backdrop-blur-2xl border-b border-gray-200'>
          <div className='w-full px-4'>
            <div className='flex items-center justify-between h-16'>
              <div className='flex items-center'>
                <Link href='/' className='flex items-center'>
                  <Image
                    src='/Logo PowerRun.png'
                    alt={APP_CONFIG.name}
                    width={120}
                    height={40}
                    className='h-10 w-auto'
                  />
                </Link>
              </div>
              <div className='hidden lg:flex items-center space-x-8'>
                <div className='h-6 w-20 bg-gray-200 animate-pulse rounded'></div>
                <div className='h-6 w-20 bg-gray-200 animate-pulse rounded'></div>
                <div className='h-6 w-16 bg-gray-200 animate-pulse rounded'></div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  const languages = [
    { code: 'pt-BR', name: tCommon('portuguese'), flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
  ];

  return (
    <>
      {/* Linha gradiente interativa no topo */}
      <div
        className='fixed top-0 left-0 right-0 h-0.5 w-full transition-all duration-300 z-50'
        style={getGradientStyle()}
      />

      {/* Header principal com design dividido */}
      <header className='fixed top-0.5 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/10 shadow-2xl'>
        {/* Fundo dividido - UMA diagonal limpa - Responsivo */}
        <div className='absolute inset-0'>
          {/* Fallback CSS para mobile/tablet - sempre ativo em telas pequenas */}
          <div className='lg:hidden absolute inset-0 bg-white shadow-sm'></div>

          {/* Design dividido para desktop - só aparece quando JS confirma tela grande */}
          {!isSmallScreen && isMounted && (
            <>
              {/* Seção esquerda branca - Mais restrita em mobile */}
              <div
                className='hidden lg:block absolute left-0 top-0 bottom-0 bg-white
                  w-[170px] sm:w-[190px] md:w-[230px] lg:w-[270px] xl:w-[310px]'
                style={{
                  clipPath: 'polygon(0 0, 100% 0, calc(100% - 25px) 100%, 0 100%)',
                }}
              ></div>
              {/* Seção direita escura - Começa mais cedo */}
              <div
                className='hidden lg:block absolute top-0 bottom-0 right-0 bg-black/90 backdrop-blur-md
                  left-[145px] sm:left-[165px] md:left-[205px] lg:left-[245px] xl:left-[285px]'
                style={{
                  clipPath: 'polygon(25px 0, 100% 0, 100% 100%, 0 100%)',
                }}
              ></div>
            </>
          )}

          {/* Fundo branco controlado por JS para casos especiais */}
          {isSmallScreen && isMounted && (
            <div className='absolute inset-0 bg-white shadow-sm'></div>
          )}
        </div>

        <div className='relative w-full px-4 py-4 flex justify-between items-center'>
          {/* Logo à esquerda */}
          <Link href='/' className='flex items-center space-x-3 relative z-10'>
            <div className='relative w-56 sm:w-60 md:w-68 h-12 md:h-14'>
              <Image
                src='/Logo PowerRun.png'
                alt={APP_CONFIG.name}
                fill
                className='object-contain drop-shadow-sm'
                priority
              />
            </div>
          </Link>

          {/* Navigation - garantindo que fique na área escura */}
          <nav
            className='hidden md:flex space-x-6 lg:space-x-8 xl:space-x-10 relative z-10 
              ml-auto mr-4 md:mr-6 lg:mr-8'
            onMouseLeave={handleMegaMenuClose}
          >
            <Link
              href='/empresa'
              className={`transition-all duration-200 font-medium px-4 py-2 relative group ${
                isSmallScreen
                  ? 'text-gray-700 hover:text-gray-900'
                  : 'text-white/70 hover:text-white'
              }`}
              onMouseEnter={() => {
                if (megaMenuCloseTimeout) {
                  clearTimeout(megaMenuCloseTimeout);
                  setMegaMenuCloseTimeout(null);
                }
                setIsMegaMenuOpen(false);
              }}
            >
              {t('empresa')}
              <span
                className='absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px transition-all duration-300 ease-out group-hover:w-3/4'
                style={{
                  background: isSmallScreen
                    ? 'radial-gradient(ellipse at center, rgba(55, 65, 81, 0.7) 0%, rgba(55, 65, 81, 0.5) 30%, rgba(55, 65, 81, 0.2) 80%, transparent 100%)'
                    : 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.4) 30%, rgba(255, 255, 255, 0.1) 80%, transparent 100%)',
                  height: '1.5px',
                  borderRadius: '50%',
                }}
              />
            </Link>
            <div
              className='relative'
              onMouseEnter={handleMegaMenuOpen}
              onMouseLeave={handleMegaMenuClose}
            >
              {/* Área expandida de hover para facilitar navegação */}
              <div className='absolute -bottom-2 left-0 right-0 h-4 z-50' />

              <Link
                href='/equipamentos'
                className={`transition-all duration-200 font-medium px-4 py-2 relative group inline-block ${
                  isSmallScreen
                    ? 'text-gray-700 hover:text-gray-900'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {t('equipamentos')}
                <span
                  className='absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px transition-all duration-300 ease-out group-hover:w-3/4'
                  style={{
                    background: isSmallScreen
                      ? 'radial-gradient(ellipse at center, rgba(55, 65, 81, 0.7) 0%, rgba(55, 65, 81, 0.5) 30%, rgba(55, 65, 81, 0.2) 80%, transparent 100%)'
                      : 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.4) 30%, rgba(255, 255, 255, 0.1) 80%, transparent 100%)',
                    height: '1.5px',
                    borderRadius: '50%',
                  }}
                />
              </Link>
              {isMegaMenuOpen && (
                <MegaMenu
                  onClose={() => setIsMegaMenuOpen(false)}
                  onMouseEnter={cancelMegaMenuClose}
                  onMouseLeave={handleMegaMenuClose}
                  isAnimating={isMegaMenuAnimating}
                />
              )}
            </div>
            <Link
              href='/suporte'
              className={`transition-all duration-200 font-medium px-4 py-2 relative group ${
                isSmallScreen
                  ? 'text-gray-700 hover:text-gray-900'
                  : 'text-white/70 hover:text-white'
              }`}
              onMouseEnter={() => {
                if (megaMenuCloseTimeout) {
                  clearTimeout(megaMenuCloseTimeout);
                  setMegaMenuCloseTimeout(null);
                }
                setIsMegaMenuOpen(false);
              }}
            >
              {t('suporte')}
              <span
                className='absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px transition-all duration-300 ease-out group-hover:w-3/4'
                style={{
                  background: isSmallScreen
                    ? 'radial-gradient(ellipse at center, rgba(55, 65, 81, 0.7) 0%, rgba(55, 65, 81, 0.5) 30%, rgba(55, 65, 81, 0.2) 80%, transparent 100%)'
                    : 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.4) 30%, rgba(255, 255, 255, 0.1) 80%, transparent 100%)',
                  height: '1.5px',
                  borderRadius: '50%',
                }}
              />
            </Link>
          </nav>

          {/* Ícones à direita - garantindo que fiquem na área escura */}
          <div className='hidden md:flex items-center space-x-3 lg:space-x-4 relative z-10 no-border'>
            {/* Ícone de pesquisa */}
            <button
              type='button'
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`transition-colors duration-300 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center btn-exception ${
                isSmallScreen
                  ? 'text-gray-700 hover:text-gray-900'
                  : 'text-white/90 hover:text-[#61fbfe]'
              }`}
              aria-label='Abrir busca'
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
            </button>

            {/* Seletor de idiomas */}
            <div className='relative'>
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className={`transition-colors duration-300 p-2 flex items-center space-x-1 min-h-[44px] min-w-[44px] btn-exception ${
                  isSmallScreen
                    ? 'text-gray-700 hover:text-gray-900'
                    : 'text-white/90 hover:text-[#61fbfe]'
                }`}
                aria-label='Selecionar idioma'
                aria-expanded={isLanguageOpen}
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129'
                  />
                </svg>
                <span className='text-sm'>{languages.find((l) => l.code === locale)?.flag}</span>
              </button>

              {/* Dropdown de idiomas */}
              {isLanguageOpen && (
                <div className='absolute top-full right-0 mt-1 bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl py-2 min-w-[140px]'>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setIsLanguageOpen(false);
                        const segments = pathname?.split('/') ?? [];
                        segments[1] = lang.code; // troca o segmento do locale
                        router.push((segments.join('/') || '/') as any);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-white/10 transition-colors flex items-center space-x-3 btn-exception ${
                        locale === lang.code ? 'text-[#61fbfe]' : 'text-white/90'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span className='text-sm'>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className='md:hidden relative z-10 no-border'>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`transition-colors duration-300 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center btn-exception ${
                isSmallScreen
                  ? 'text-gray-700 hover:text-gray-900'
                  : 'text-white/90 hover:text-white'
              }`}
              aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              ) : (
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Efeito de brilho sutil no glassmorphism */}
        <div className='absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent pointer-events-none'></div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className='fixed inset-0 top-[73px] bg-black/95 backdrop-blur-xl z-40 md:hidden transition-opacity duration-300'>
          <div className='w-full px-4 py-6'>
            {/* Campo de busca mobile */}
            <div className='mb-6'>
              <div className='relative'>
                <svg
                  className='absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                  />
                </svg>
                <input
                  type='text'
                  placeholder='Buscar equipamentos...'
                  className='w-full pl-12 pr-4 py-3 text-base text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all placeholder:text-gray-500'
                  onClick={() => {
                    setIsSearchOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  readOnly
                />
              </div>
            </div>

            {/* Navegação principal */}
            <nav className='space-y-4 mb-8'>
              <Link
                href='/empresa'
                onClick={() => setIsMobileMenuOpen(false)}
                className='block text-white/90 hover:text-white text-lg font-medium py-3 px-4 rounded-lg hover:bg-white/10 transition-all'
              >
                {t('empresa')}
              </Link>
              <Link
                href='/equipamentos'
                onClick={() => setIsMobileMenuOpen(false)}
                className='block text-white/90 hover:text-white text-lg font-medium py-3 px-4 rounded-lg hover:bg-white/10 transition-all'
              >
                {t('equipamentos')}
              </Link>
              <Link
                href='/suporte'
                onClick={() => setIsMobileMenuOpen(false)}
                className='block text-white/90 hover:text-white text-lg font-medium py-3 px-4 rounded-lg hover:bg-white/10 transition-all'
              >
                {t('suporte')}
              </Link>
            </nav>

            {/* Separador */}
            <hr className='border-white/20 mb-6' />

            {/* Seletor de idiomas mobile */}
            <div className='space-y-3'>
              <h3 className='text-white/70 text-sm font-medium uppercase tracking-wider mb-4'>
                Idioma
              </h3>
              <div className='grid grid-cols-2 gap-3'>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      const segments = pathname?.split('/') ?? [];
                      segments[1] = lang.code;
                      router.push((segments.join('/') || '/') as any);
                    }}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all btn-exception ${
                      locale === lang.code
                        ? 'bg-white/10 text-white'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className='text-lg'>{lang.flag}</span>
                    <span className='text-sm font-medium'>{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Botão de fechar */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className='fixed top-4 right-4 text-white/90 hover:text-white p-2 btn-exception'
            >
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Search MegaMenu */}
      <SearchMegaMenu isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
