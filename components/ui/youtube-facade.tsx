'use client';

import { Play, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { useState, useCallback, useRef, useEffect } from 'react';

interface YouTubeFacadeProps {
  videoId: string;
  title: string;
  className?: string;
  thumbnailQuality?: 'default' | 'mqdefault' | 'hqdefault' | 'sddefault' | 'maxresdefault';
  autoplay?: boolean;
  showTitle?: boolean;
  customThumbnail?: string;
  mute?: boolean;
  loop?: boolean;
  controls?: boolean;
  autoLoad?: boolean; // Nova prop para auto-carregar o vídeo
}

// Função para extrair ID do YouTube de diferentes formatos de URL
export function extractYouTubeId(url: string): string {
  const regex =
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : url;
}

export function YouTubeFacade({
  videoId,
  title,
  className = '',
  autoplay = false,
  showTitle = true,
  customThumbnail,
  mute = false,
  loop = false,
  controls = true,
  autoLoad = false,
}: YouTubeFacadeProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Limpar videoId para garantir que seja apenas o ID
  const cleanVideoId = extractYouTubeId(videoId);

  // URLs da thumbnail em ordem de qualidade (fallback)
  const thumbnailUrls = [
    customThumbnail,
    `https://img.youtube.com/vi/${cleanVideoId}/maxresdefault.jpg`,
    `https://img.youtube.com/vi/${cleanVideoId}/hqdefault.jpg`,
    `https://img.youtube.com/vi/${cleanVideoId}/mqdefault.jpg`,
    `https://img.youtube.com/vi/${cleanVideoId}/default.jpg`,
  ].filter(Boolean);

  // Intersection Observer para lazy loading ou auto-load
  useEffect(() => {
    if (autoLoad) {
      // Auto-carregar vídeo para hero
      setIsInView(true);
      setTimeout(() => {
        setIsLoaded(true);
      }, 1000); // Pequeno delay para melhor UX
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [autoLoad]);

  const handleActivate = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleThumbnailError = useCallback(() => {
    setThumbnailError(true);
  }, []);

  if (isLoaded) {
    // URL do iframe com parâmetros otimizados
    const embedUrl = `https://www.youtube-nocookie.com/embed/${cleanVideoId}?${new URLSearchParams({
      autoplay: autoplay ? '1' : '0',
      mute: mute ? '1' : '0',
      loop: loop ? '1' : '0',
      playlist: loop ? cleanVideoId : '',
      rel: '0',
      modestbranding: '1',
      iv_load_policy: '3',
      color: 'white',
      controls: controls ? '1' : '0',
      disablekb: '0',
      fs: '1',
      playsinline: '1',
    }).toString()}`;

    return (
      <div className={`relative w-full h-full ${className}`}>
        <iframe
          src={embedUrl}
          title={title}
          className='w-full h-full border-0'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
          allowFullScreen
          referrerPolicy='strict-origin-when-cross-origin'
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative w-full h-full group cursor-pointer ${className}`}>
      {/* Thumbnail - só carrega quando inView */}
      {isInView && (
        <div className='relative w-full h-full bg-gray-900 overflow-hidden'>
          {!thumbnailError ? (
            <Image
              src={thumbnailUrls[0] || thumbnailUrls[1] || ''}
              alt={title}
              fill
              className='object-cover transition-transform duration-300 group-hover:scale-105'
              onError={handleThumbnailError}
              priority={true}
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              quality={85}
              fetchPriority='high'
            />
          ) : (
            // Fallback case quando thumbnail falha
            <div className='w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center'>
              <div className='text-center text-white/80'>
                <ExternalLink className='w-12 h-12 mx-auto mb-3 opacity-60' />
                <p className='text-sm'>Vídeo do YouTube</p>
              </div>
            </div>
          )}

          {/* Overlay gradiente */}
          <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

          {/* Botão de play */}
          <button
            onClick={handleActivate}
            className='absolute inset-0 flex items-center justify-center min-h-[44px] min-w-[44px]'
            aria-label={`Reproduzir vídeo: ${title}`}
            type='button'
          >
            <div className='flex items-center justify-center w-20 h-20 bg-red-600 hover:bg-red-700 rounded-full shadow-2xl transition-all duration-300 transform group-hover:scale-110 border-4 border-white/90'>
              <Play className='w-8 h-8 text-white ml-1' fill='currentColor' />
            </div>
          </button>

          {/* Badge YouTube */}
          <div className='absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold opacity-90'>
            YouTube
          </div>

          {/* Título (se habilitado) */}
          {showTitle && (
            <div className='absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent'>
              <h3 className='text-white text-sm md:text-base font-medium line-clamp-2'>{title}</h3>
            </div>
          )}
        </div>
      )}

      {/* Loading placeholder quando não está inView */}
      {!isInView && (
        <div className='w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center'>
          <div className='text-center text-white/80'>
            <div className='w-12 h-12 mx-auto mb-3 bg-white/10 rounded-full flex items-center justify-center'>
              <ExternalLink className='w-6 h-6 opacity-60' />
            </div>
            <p className='text-sm'>Carregando vídeo...</p>
          </div>
        </div>
      )}

      {/* Indicador de carregamento sob demanda */}
      <div className='absolute top-4 left-4 bg-black/70 backdrop-blur text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
        Clique para carregar
      </div>
    </div>
  );
}

// Hook para facilitar o uso
export function useYouTubeFacade() {
  return {
    extractYouTubeId,
    YouTubeFacade,
  };
}

// Componente wrapper para casos específicos
interface YouTubeEmbedProps {
  src: string;
  title: string;
  className?: string;
  autoplay?: boolean;
  showTitle?: boolean;
}

export function YouTubeEmbed({ src, title, className, autoplay, showTitle }: YouTubeEmbedProps) {
  const videoId = extractYouTubeId(src);

  return (
    <YouTubeFacade
      videoId={videoId}
      title={title}
      className={className}
      autoplay={autoplay}
      showTitle={showTitle}
    />
  );
}
