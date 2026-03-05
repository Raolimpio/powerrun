'use client';

import { useEffect } from 'react';

// Estender Window interface para TypeScript
declare global {
  interface Window {
    dataLayer?: any[];
    gtmLoaded?: boolean;
    gaLoaded?: boolean;
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Componente para carregar Google Tag Manager de forma assíncrona
 * Carrega após o primeiro paint para não bloquear renderização
 */
export function AsyncGoogleTagManager() {
  useEffect(() => {
    // Aguardar o primeiro paint antes de carregar
    if (typeof window === 'undefined') return;

    // Usar requestIdleCallback se disponível, senão usar setTimeout
    const loadGTM = () => {
      // Verificar se já foi carregado
      if (window.dataLayer && window.gtmLoaded) {
        return;
      }

      // Inicializar dataLayer se não existir
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js',
      });

      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-P962GGL7';
      script.onload = () => {
        window.gtmLoaded = true;
      };
      document.head.appendChild(script);
    };

    // Carregar após o primeiro paint ou idle
    if (window.requestIdleCallback) {
      window.requestIdleCallback(loadGTM, { timeout: 2000 });
    } else {
      // Fallback para navegadores que não suportam requestIdleCallback
      setTimeout(loadGTM, 2000);
    }
  }, []);

  return null;
}

/**
 * Componente para carregar Google Analytics de forma assíncrona
 */
export function AsyncGoogleAnalytics() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Verificar se já foi carregado
    if (window.gaLoaded) {
      return;
    }

    const loadGA = () => {
      // Inicializar dataLayer se não existir
      window.dataLayer = window.dataLayer || [];

      // Carregar gtag.js
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=G-FMWLZ52DL7';
      script.onload = () => {
        // Inicializar gtag após o script carregar
        function gtag(...args: any[]) {
          window.dataLayer!.push(args);
        }
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', 'G-FMWLZ52DL7', {
          // Configurações de performance
          send_page_view: false, // Controle manual via PageTracker
        });
        window.gaLoaded = true;
      };
      script.onerror = () => {
        // Em caso de erro, marcar como tentado para não ficar tentando
        window.gaLoaded = true;
      };
      document.head.appendChild(script);
    };

    // Carregar após o primeiro paint ou idle
    if (window.requestIdleCallback) {
      window.requestIdleCallback(loadGA, { timeout: 2000 });
    } else {
      // Fallback para navegadores que não suportam requestIdleCallback
      setTimeout(loadGA, 2000);
    }
  }, []);

  return null;
}

