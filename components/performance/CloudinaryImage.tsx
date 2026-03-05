'use client';

import Image from 'next/image';
import { useState } from 'react';

interface CloudinaryImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fetchPriority?: 'auto' | 'high' | 'low';
  quality?: number;
  sizes?: string;
  fill?: boolean;
  style?: React.CSSProperties;
}

/**
 * Componente otimizado para imagens do Cloudinary
 * Aplica transformações automáticas para WebP, compressão e responsividade
 */
export function CloudinaryImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fetchPriority,
  quality = 80,
  sizes,
  fill = false,
  style,
}: CloudinaryImageProps) {
  const [hasError, setHasError] = useState(false);

  // Otimizar apenas URLs do Cloudinary
  const optimizeCloudinaryUrl = (
    url: string,
    targetWidth?: number,
    isFullWidth?: boolean
  ): string => {
    if (!url.includes('res.cloudinary.com')) {
      return url;
    }

    // Extrair parts da URL
    const urlParts = url.split('/upload/');
    if (urlParts.length !== 2) return url;

    const [baseUrl, imagePath] = urlParts;

    // Verificar se já tem transformações na URL
    const hasExistingTransformations = imagePath.includes(',') || imagePath.match(/\/v\d+\//);

    // Transformações para performance otimizada
    const transformations = [];

    // Formato moderno: AVIF primeiro, depois WebP, depois original
    transformations.push('f_auto');

    // Qualidade otimizada (reduzir para melhor compressão)
    const optimizedQuality = Math.max(75, Math.min(quality, 90));
    transformations.push(`q_${optimizedQuality}`);

    // Redimensionamento inteligente baseado no contexto
    if (isFullWidth) {
      // Para imagens full-width, usar width automático baseado no viewport
      // O Cloudinary irá servir a imagem no tamanho necessário
      transformations.push('w_1920');
      transformations.push('c_scale');
      transformations.push('q_auto:good'); // Qualidade automática otimizada
    } else if (targetWidth) {
      // Usar width específico se fornecido
      const maxWidth = Math.min(targetWidth, 1920); // Limite máximo
      transformations.push(`w_${maxWidth}`);
      transformations.push('c_scale');
    } else {
      // Para outras imagens, aplicar limite máximo de 1200px
      transformations.push('w_1200');
      transformations.push('c_scale');
    }

    // DPR automático para retina displays
    transformations.push('dpr_auto');

    // Compressão inteligente (progressive para JPEG)
    transformations.push('fl_progressive');

    // Otimização adicional: strip de metadados
    transformations.push('fl_strip_profile');

    // Se já tem transformações, inserir antes do path
    if (hasExistingTransformations) {
      const pathMatch = imagePath.match(/(.*?)(\/v\d+\/.*)/);
      if (pathMatch) {
        const [, prefix, versionPath] = pathMatch;
        return `${baseUrl}/upload/${transformations.join(',')}${versionPath}`;
      }
    }

    return `${baseUrl}/upload/${transformations.join(',')}/${imagePath}`;
  };

  // Gerar URL otimizada - detectar se é full width baseado no sizes
  const isFullWidth = sizes?.includes('100vw') || fill;
  const optimizedSrc = optimizeCloudinaryUrl(src, width, isFullWidth);

  // Fallback em caso de erro
  if (hasError) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={style}
        role='img'
        aria-label='Erro ao carregar imagem'
      >
        <span className='text-gray-500 text-sm'>Erro ao carregar imagem</span>
      </div>
    );
  }

  const imageProps: any = {
    src: optimizedSrc,
    alt,
    className,
    priority,
    quality,
    onError: () => setHasError(true),
    style,
  };

  // Adicionar fetchPriority se fornecido (para LCP optimization)
  // Next.js Image pode não suportar fetchPriority diretamente, então usamos unoptimized e img nativo se necessário
  // Mas vamos tentar passar como prop primeiro (Next.js 15 pode suportar)
  if (fetchPriority && priority) {
    // Para imagens prioritárias, usar fetchPriority via atributo HTML
    // O Next.js Image com priority já otimiza, mas fetchPriority ajuda ainda mais
    imageProps.fetchPriority = fetchPriority;
  }

  if (fill) {
    return (
      <Image
        {...imageProps}
        fill
        sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
      />
    );
  }

  return <Image {...imageProps} width={width} height={height} sizes={sizes} />;
}

/**
 * Hook para gerar URLs otimizadas do Cloudinary
 */
export function useCloudinaryUrl(
  url: string,
  options?: {
    width?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'avif';
  }
) {
  const { width, quality = 80, format = 'auto' } = options || {};

  if (!url.includes('res.cloudinary.com')) {
    return url;
  }

  const urlParts = url.split('/upload/');
  if (urlParts.length !== 2) return url;

  const [baseUrl, imagePath] = urlParts;

  const transformations = [`f_${format}`, `q_${quality}`, 'dpr_auto', 'fl_progressive'];

  if (width) {
    transformations.push(`w_${width}`, 'c_scale');
  }

  return `${baseUrl}/upload/${transformations.join(',')}/${imagePath}`;
}
