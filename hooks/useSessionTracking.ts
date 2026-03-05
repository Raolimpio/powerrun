'use client';

import { useEffect, useCallback } from 'react';

// Função para gerar UUID v4 no cliente sem dependências Node.js
function uuidv4(): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    // Usar crypto API do browser
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (window.crypto.getRandomValues(new Uint8Array(1))[0] % 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  // Fallback simples se crypto não estiver disponível
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function useSessionTracking() {
  const getOrCreateSessionId = useCallback(() => {
    if (typeof window === 'undefined') return null;
    
    let sessionId = sessionStorage.getItem('analytics_session_id');
    
    if (!sessionId) {
      sessionId = uuidv4();
      sessionStorage.setItem('analytics_session_id', sessionId);
      sessionStorage.setItem('session_start_time', Date.now().toString());
    }
    
    return sessionId;
  }, []);

  useEffect(() => {
    const sessionId = getOrCreateSessionId();
    if (!sessionId) return;
    
    // Iniciar sessão
    const startSession = async () => {
      try {
        // Capturar URL completa (incluindo parâmetros) para detectar Google Ads
        const currentUrl = window.location.href;
        
        await fetch('/api/track/session/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            landingPage: window.location.pathname,
            userAgent: navigator.userAgent,
            referrer: document.referrer || null,
            currentUrl: currentUrl, // URL completa com parâmetros
          }),
        });
      } catch (error) {
        console.error('Session start error:', error);
      }
    };

    startSession();

    // Atualizar sessão ao fechar
    const handleBeforeUnload = () => {
      const startTime = sessionStorage.getItem('session_start_time');
      const duration = startTime ? Math.floor((Date.now() - parseInt(startTime)) / 1000) : 0;
      
      const data = JSON.stringify({
        sessionId,
        duration,
        exitPage: window.location.pathname,
      });
      
      // Usar sendBeacon para garantir que envia mesmo ao fechar
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/track/session/end', data);
      } else {
        fetch('/api/track/session/end', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: data,
          keepalive: true,
        }).catch(() => {});
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Também atualizar a cada 30 segundos
    const heartbeatInterval = setInterval(() => {
      const startTime = sessionStorage.getItem('session_start_time');
      const duration = startTime ? Math.floor((Date.now() - parseInt(startTime)) / 1000) : 0;
      
      fetch('/api/track/session/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, duration }),
      }).catch(() => {});
    }, 30000); // 30 segundos

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(heartbeatInterval);
    };
  }, [getOrCreateSessionId]);

  return { getSessionId: getOrCreateSessionId };
}

