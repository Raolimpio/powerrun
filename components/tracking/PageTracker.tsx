'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useSessionTracking } from '@/hooks/useSessionTracking';
import { usePageDuration } from '@/hooks/usePageDuration';
import { useScrollTracking } from '@/hooks/useScrollTracking';
import { usePerformanceTracking } from '@/hooks/usePerformanceTracking';

export function PageTracker() {
  const pathname = usePathname();
  const locale = useLocale();
  
  // Hooks de tracking avançado
  useSessionTracking();
  usePageDuration();
  useScrollTracking();
  usePerformanceTracking();

  useEffect(() => {
    if (!pathname) return;

    const trackPageView = async () => {
      try {
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const userAgent = navigator.userAgent;
        const sessionId = sessionStorage.getItem('analytics_session_id');
        
        // Detectar dispositivo
        const deviceType = /Mobile|Android|iPhone|iPad/.test(userAgent) ? 'mobile' : 'desktop';
        
        // Detectar navegador
        let browser = 'unknown';
        if (userAgent.includes('Chrome')) browser = 'chrome';
        else if (userAgent.includes('Firefox')) browser = 'firefox';
        else if (userAgent.includes('Safari')) browser = 'safari';
        else if (userAgent.includes('Edge')) browser = 'edge';
        
        // Detectar OS
        let os = 'unknown';
        if (userAgent.includes('Windows')) os = 'windows';
        else if (userAgent.includes('Mac')) os = 'macos';
        else if (userAgent.includes('Linux')) os = 'linux';
        else if (userAgent.includes('Android')) os = 'android';
        else if (userAgent.includes('iOS')) os = 'ios';

        await fetch('/api/track/pageview', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path: pathname,
            locale,
            referer: document.referrer || null,
            userAgent,
            deviceType,
            browser,
            os,
            screenWidth,
            screenHeight,
            sessionId, // Adicionar sessionId
          }),
        });
      } catch (error) {
        // Silenciar erros de tracking
        console.error('Page tracking error:', error);
      }
    };

    // Pequeno delay para garantir que a página carregou
    const timeoutId = setTimeout(trackPageView, 500);

    return () => clearTimeout(timeoutId);
  }, [pathname, locale]);

  return null;
}

