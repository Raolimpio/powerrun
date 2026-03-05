'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

/**
 * Lazy Image Component - AAAA+++
 *
 * Otimizações implementadas:
 * - Intersection Observer para lazy loading
 * - Blur placeholder otimizado
 * - Preload de imagens críticas
 * - WebP/AVIF detection
 * - Responsive images
 * - Error handling elegante
 */

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  quality?: number;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

// Placeholder blur otimizado - Base64 estático para melhor performance

// Placeholder blur universal para reduzir CLS
const UNIVERSAL_BLUR_PLACEHOLDER =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';

export default function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  placeholder = 'blur',
  blurDataURL,
  sizes,
  fill = false,
  quality = 85,
  loading = 'lazy',
  onLoad,
  onError,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer para lazy loading manual
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px 0px', // Carregar 50px antes de entrar na tela (mais eficiente)
        threshold: 0.01, // Mais sensível para começar loading mais cedo
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [priority, isInView]);

  // Gerar blur placeholder se não fornecido
  const defaultBlurDataURL = blurDataURL || UNIVERSAL_BLUR_PLACEHOLDER;

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // Handle image error
  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Fallback para erro
  const ErrorFallback = () => (
    <div
      className={`flex items-center justify-center bg-gray-100 text-gray-400 ${className}`}
      style={{ width: width || '100%', height: height || 200 }}
    >
      <div className='text-center p-4'>
        <svg className='w-12 h-12 mx-auto mb-2 opacity-50' fill='currentColor' viewBox='0 0 20 20'>
          <path
            fillRule='evenodd'
            d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z'
            clipRule='evenodd'
          />
        </svg>
        <p className='text-sm'>Erro ao carregar imagem</p>
      </div>
    </div>
  );

  // Skeleton loader
  const SkeletonLoader = () => (
    <div
      className={`animate-pulse bg-gray-200 ${className}`}
      style={{ width: width || '100%', height: height || 200 }}
    >
      <div className='w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer'></div>
    </div>
  );

  return (
    <div ref={imgRef} className='relative'>
      {hasError ? (
        <ErrorFallback />
      ) : !isInView ? (
        <SkeletonLoader />
      ) : (
        <div className='relative'>
          <Image
            src={src}
            alt={alt}
            width={fill ? undefined : width}
            height={fill ? undefined : height}
            fill={fill}
            className={`transition-opacity duration-500 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } ${className}`}
            priority={priority}
            placeholder={placeholder}
            blurDataURL={defaultBlurDataURL}
            sizes={sizes}
            quality={quality}
            loading={loading}
            onLoad={handleLoad}
            onError={handleError}
          />

          {/* Loading overlay */}
          {!isLoaded && (
            <div className='absolute inset-0 flex items-center justify-center bg-gray-100'>
              <div className='flex items-center gap-2 text-gray-500'>
                <div className='w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
                <span className='text-sm'>Carregando...</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Componente de Gallery com lazy loading otimizado
 */
interface LazyGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
  }>;
  className?: string;
}

export function LazyGallery({ images, className = '' }: LazyGalleryProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {images.map((image, index) => (
        <LazyImage
          key={`lazy-image-${image.src.slice(-20)}-${index}`}
          src={image.src}
          alt={image.alt}
          width={image.width || 400}
          height={image.height || 300}
          priority={index < 3} // Priorizar primeiras 3 imagens
          className='rounded-lg object-cover'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
      ))}
    </div>
  );
}
