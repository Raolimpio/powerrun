'use client';

import { useEffect, useState } from 'react';

interface CriticalResourceLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  delay?: number;
  preloadResources?: string[];
}

export function CriticalResourceLoader({
  children,
  fallback,
  delay = 100,
  preloadResources = [],
}: CriticalResourceLoaderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Preload recursos críticos
    const preloadPromises = preloadResources.map((resource) => {
      return new Promise<void>((resolve) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = resource.endsWith('.css') ? 'style' : 'script';
        link.onload = () => resolve();
        link.onerror = () => resolve(); // Não falha se não conseguir preload
        document.head.appendChild(link);
      });
    });

    // Aguardar delay mínimo + preload
    const timer = setTimeout(async () => {
      await Promise.all(preloadPromises);
      setIsReady(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, preloadResources]);

  if (!isReady) {
    return (
      fallback || (
        <div className='flex items-center justify-center min-h-[200px]'>
          <div className='w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
        </div>
      )
    );
  }

  return <>{children}</>;
}

// Hook para otimizar carregamento de recursos
export function useCriticalResources() {
  const [loadedResources, setLoadedResources] = useState<Set<string>>(new Set());

  const preloadResource = (url: string, type: 'script' | 'style' | 'image' = 'script') => {
    if (loadedResources.has(url)) return Promise.resolve();

    return new Promise<void>((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      link.as = type;

      link.onload = () => {
        setLoadedResources((prev) => new Set(prev).add(url));
        resolve();
      };

      link.onerror = () => {
        // console.warn(`Failed to preload resource: ${url}`);
        reject(new Error(`Failed to preload: ${url}`));
      };

      document.head.appendChild(link);
    });
  };

  const preloadCriticalFonts = () => {
    const fonts = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    ];

    return Promise.all(fonts.map((font) => preloadResource(font, 'style')));
  };

  const preloadCriticalImages = (images: string[]) => {
    return Promise.all(images.map((image) => preloadResource(image, 'image')));
  };

  return {
    loadedResources,
    preloadResource,
    preloadCriticalFonts,
    preloadCriticalImages,
  };
}
