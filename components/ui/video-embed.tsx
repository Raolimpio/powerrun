'use client';

import { useState, useEffect } from 'react';
import { NoSSR } from '@/components/common';
import { YouTubeEmbed } from './youtube-facade';

interface VideoEmbedProps {
  src: string;
  title: string;
  className?: string;
  style?: React.CSSProperties;
  allow?: string;
  allowFullScreen?: boolean;
  loading?: 'lazy' | 'eager';
  posterImage?: string;
  fallbackText?: string;
}

export function VideoEmbed({
  src,
  title,
  className = '',
  style,
  allow = 'autoplay; encrypted-media',
  allowFullScreen = true,
  loading = 'lazy',
  posterImage,
  fallbackText = 'Carregando vídeo...',
}: VideoEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Detectar se é YouTube para usar facade
  const isYouTube = src.includes('youtube.com') || src.includes('youtu.be');

  useEffect(() => {
    // Preload apenas em client-side
    if (typeof window !== 'undefined') {
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 100);

      return () => clearTimeout(timer);
    }

    // Retorno necessário para todos os caminhos
    return () => {};
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    setHasError(true);
  };

  if (isYouTube) {
    return (
      <YouTubeEmbed
        src={src}
        title={title}
        className={className}
        autoplay={false}
        showTitle={false}
      />
    );
  }

  const fallbackContent = (
    <div
      className={`bg-gray-900 flex flex-col items-center justify-center text-white transition-opacity duration-300 ${className}`}
      style={style}
    >
      {posterImage && (
        <img
          src={posterImage}
          alt={title}
          className='absolute inset-0 w-full h-full object-cover opacity-30'
        />
      )}
      <div className='relative z-10 text-center p-8'>
        <div className='w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 mx-auto'>
          <div className='w-6 h-6 border-l-[6px] border-l-white ml-1' />
        </div>
        <p className='text-white/70'>{hasError ? 'Erro ao carregar vídeo' : fallbackText}</p>
        {hasError && (
          <p className='text-white/50 text-sm mt-2'>
            Verifique sua conexão ou tente recarregar a página
          </p>
        )}
      </div>
    </div>
  );

  return (
    <NoSSR fallback={fallbackContent}>
      <div className='relative w-full h-full'>
        {!isLoaded && fallbackContent}

        <iframe
          src={src}
          title={title}
          className={`${className} ${!isLoaded ? 'opacity-0 absolute inset-0' : 'opacity-100'} transition-opacity duration-500`}
          style={style}
          allow={allow}
          allowFullScreen={allowFullScreen}
          loading={loading}
          referrerPolicy='strict-origin-when-cross-origin'
          sandbox='allow-scripts allow-same-origin'
          onLoad={handleLoad}
          onError={handleError}
        />
      </div>
    </NoSSR>
  );
}
