'use client';

import { useEffect, useState, useRef } from 'react';

interface LazyThirdPartyScriptProps {
  src: string;
  strategy?: 'afterInteractive' | 'lazyOnload' | 'beforeInteractive';
  onLoad?: () => void;
  onError?: (_error: Error) => void;
  delay?: number;
  condition?: () => boolean;
}

export function LazyThirdPartyScript({
  src,
  strategy = 'lazyOnload',
  onLoad,
  onError,
  delay = 0,
  condition = () => true,
}: LazyThirdPartyScriptProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [_hasError, setHasError] = useState(false);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Verificar condição antes de carregar
    if (!condition()) return;

    const loadScript = () => {
      // Evitar carregar múltiplas vezes
      if (scriptRef.current || isLoaded) return;

      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.defer = strategy === 'lazyOnload';

      script.onload = () => {
        setIsLoaded(true);
        onLoad?.();
      };

      script.onerror = (_error) => {
        setHasError(true);
        onError?.(new Error(`Failed to load script: ${src}`));
      };

      document.head.appendChild(script);
      scriptRef.current = script;
    };

    // Estratégias de carregamento
    switch (strategy) {
      case 'beforeInteractive':
        loadScript();
        break;

      case 'afterInteractive':
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', loadScript);
        } else {
          loadScript();
        }
        break;

      case 'lazyOnload':
      default:
        const handleLoad = () => {
          if (delay > 0) {
            timeoutRef.current = setTimeout(loadScript, delay);
          } else {
            loadScript();
          }
        };

        if (document.readyState === 'complete') {
          handleLoad();
        } else {
          window.addEventListener('load', handleLoad);
        }
        break;
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (scriptRef.current) {
        scriptRef.current.remove();
      }
      window.removeEventListener('load', loadScript);
      document.removeEventListener('DOMContentLoaded', loadScript);
    };
  }, [src, strategy, delay, condition, isLoaded, onLoad, onError]);

  return null; // Componente não renderiza nada
}

// Hook para carregar scripts condicionalmente
export function useLazyScript(
  src: string,
  options: {
    strategy?: 'afterInteractive' | 'lazyOnload' | 'beforeInteractive';
    delay?: number;
    condition?: () => boolean;
  } = {}
) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');

  useEffect(() => {
    const { strategy = 'lazyOnload', delay = 0, condition = () => true } = options;

    if (!condition()) return;

    setStatus('loading');

    const loadScript = () => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.defer = strategy === 'lazyOnload';

      script.onload = () => setStatus('ready');
      script.onerror = () => setStatus('error');

      document.head.appendChild(script);
    };

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    switch (strategy) {
      case 'beforeInteractive':
        loadScript();
        break;

      case 'afterInteractive':
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', loadScript);
        } else {
          loadScript();
        }
        break;

      case 'lazyOnload':
      default: {
        const handleLoad = () => {
          if (delay > 0) {
            timeoutId = setTimeout(loadScript, delay);
          } else {
            loadScript();
          }
        };

        if (document.readyState === 'complete') {
          handleLoad();
        } else {
          window.addEventListener('load', handleLoad);
        }
        break;
      }
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('load', loadScript);
      document.removeEventListener('DOMContentLoaded', loadScript);
    };
  }, [src, options]);

  return status;
}
