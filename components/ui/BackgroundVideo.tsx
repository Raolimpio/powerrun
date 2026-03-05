'use client';

import { useState, useRef, useEffect } from 'react';

interface BackgroundVideoProps {
  src: string;
  fallbackImage?: string;
  className?: string;
  opacity?: number;
}

export function BackgroundVideo({
  src,
  fallbackImage = '/Logo PowerRun.png',
  className = '',
  opacity = 0.3,
}: BackgroundVideoProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Timeout mais longo para Vercel (10s)
    const fallbackTimer = setTimeout(() => {
      if (!isLoaded && !hasError) {
        console.warn('Video timeout - using fallback image');
        setShowFallback(true);
      }
    }, 10000);

    const handleCanPlay = () => {
      console.log('Video can play');
      setIsLoaded(true);
      clearTimeout(fallbackTimer);

      // Delay antes de tentar reproduzir (importante para Vercel)
      setTimeout(() => {
        video.play().catch((error) => {
          console.warn('Autoplay falhou:', error);
          // Não marcar como erro se for só autoplay
          if (error.name !== 'NotAllowedError') {
            setHasError(true);
          }
        });
      }, 100);
    };

    const handleError = (e: Event) => {
      const videoElement = e.target as HTMLVideoElement;
      const error = videoElement.error;

      console.error('Video error:', {
        code: error?.code,
        message: error?.message,
        src: video.src,
      });

      setHasError(true);
      setShowFallback(true);
      clearTimeout(fallbackTimer);
    };

    const handleLoadedData = () => {
      console.log('Video data loaded');
      setIsLoaded(true);
      clearTimeout(fallbackTimer);
    };

    const handleLoadStart = () => {
      console.log('Video load started');
    };

    // Múltiplos eventos para detectar carregamento
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('loadstart', handleLoadStart);

    // Forçar load do vídeo
    video.load();

    return () => {
      clearTimeout(fallbackTimer);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('loadstart', handleLoadStart);
    };
  }, [src]);

  // Se há erro ou timeout, mostrar fallback
  if (hasError || showFallback) {
    return (
      <div
        className={`absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat ${className}`}
        style={{
          backgroundImage: `url(${fallbackImage})`,
          opacity,
        }}
      >
        <div className='absolute inset-0 bg-black/20' />
      </div>
    );
  }

  return (
    <div className='absolute inset-0 w-full h-full'>
      <video
        ref={videoRef}
        className={`absolute top-1/2 left-1/2 w-full h-full object-cover -translate-x-1/2 -translate-y-1/2 ${className}`}
        style={{
          minWidth: '100%',
          minHeight: '100%',
          opacity: isLoaded ? opacity : 0,
          transition: 'opacity 0.5s ease-in-out',
        }}
        autoPlay
        muted
        loop
        playsInline
        preload='auto'
        crossOrigin='anonymous'
        controls={false}
      >
        <source src={src} type='video/mp4' />
        <source src={src.replace('.mp4', '.webm')} type='video/webm' />
        Seu navegador não suporta vídeos HTML5.
      </video>

      {/* Loading fallback durante carregamento */}
      {!isLoaded && (
        <div
          className={`absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat ${className}`}
          style={{
            backgroundImage: `url(${fallbackImage})`,
            opacity: opacity * 0.5,
          }}
        >
          <div className='absolute inset-0 bg-black/40' />
        </div>
      )}
    </div>
  );
}
