'use client';

import { useCallback } from 'react';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';

interface UseQuoteTrackingProps {
  productId?: string;
  productName?: string;
  citySlug?: string;
  cityName?: string;
  keyword?: string;
  pageType?: 'normal' | 'seo' | 'landing';
  actionType?: 'whatsapp' | 'quote'; // Tipo de ação: WhatsApp ou Orçamento
}

export function useQuoteTracking({
  productId,
  productName,
  citySlug,
  cityName,
  keyword,
  pageType = 'normal',
  actionType = 'quote', // Padrão é 'quote', mas pode ser 'whatsapp'
}: UseQuoteTrackingProps = {}) {
  const pathname = usePathname();
  const locale = useLocale();

  const trackQuoteClick = useCallback(async () => {
    try {
      console.log('🔵 [TRACKING] Iniciando tracking de clique WhatsApp/Orçamento', {
        actionType,
        productId,
        productName,
        cityName,
        pagePath: pathname,
        pageType,
      });

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

      // Incrementar conversões na sessão
      if (sessionId) {
        fetch('/api/track/session/conversion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        }).catch(() => {});
      }

      const trackingData = {
        pagePath: pathname,
        pageType,
        locale,
        productId,
        productName,
        citySlug,
        cityName,
        keyword,
        referer: document.referrer || null,
        userAgent,
        deviceType,
        browser,
        os,
        sessionId,
        actionType,
      };

      console.log('🔵 [TRACKING] Enviando dados para API:', trackingData);

      const response = await fetch('/api/track/quote-click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trackingData),
      });

      const result = await response.json();
      console.log('🔵 [TRACKING] Resposta da API:', result);
    } catch (error) {
      console.error('❌ [TRACKING] Erro no tracking:', error);
    }
  }, [pathname, locale, productId, productName, citySlug, cityName, keyword, pageType, actionType]);

  return { trackQuoteClick };
}

