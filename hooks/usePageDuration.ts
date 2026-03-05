'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function usePageDuration() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const startTime = Date.now();
    const sessionId = sessionStorage.getItem('analytics_session_id');
    
    return () => {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      
      // Só registra se ficou mais de 3 segundos
      if (duration >= 3 && sessionId) {
        const data = JSON.stringify({
          sessionId,
          path: pathname,
          duration,
        });
        
        // Usar sendBeacon para garantir envio
        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/track/page-duration', data);
        } else {
          fetch('/api/track/page-duration', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: data,
            keepalive: true,
          }).catch(() => {});
        }
      }
    };
  }, [pathname]);
}

