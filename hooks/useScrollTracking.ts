'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function useScrollTracking() {
  const pathname = usePathname();
  const maxScrollRef = useRef(0);
  const hasSentRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    maxScrollRef.current = 0;
    hasSentRef.current = false;
    
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      
      // Calcular porcentagem de scroll
      const scrollPercentage = Math.round(
        (scrollTop / (documentHeight - windowHeight)) * 100
      );
      
      maxScrollRef.current = Math.max(maxScrollRef.current, Math.min(scrollPercentage, 100));
    };

    const sendScrollDepth = () => {
      if (hasSentRef.current) return;
      if (maxScrollRef.current === 0) return;
      
      const sessionId = sessionStorage.getItem('analytics_session_id');
      if (!sessionId) return;
      
      hasSentRef.current = true;
      
      const data = JSON.stringify({
        sessionId,
        path: pathname,
        scrollDepth: maxScrollRef.current,
      });
      
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/track/scroll-depth', data);
      } else {
        fetch('/api/track/scroll-depth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: data,
          keepalive: true,
        }).catch(() => {});
      }
    };

    // Debounce do scroll
    let scrollTimeout: NodeJS.Timeout;
    const debouncedHandleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 100);
    };

    window.addEventListener('scroll', debouncedHandleScroll, { passive: true });
    window.addEventListener('beforeunload', sendScrollDepth);

    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll);
      window.removeEventListener('beforeunload', sendScrollDepth);
      clearTimeout(scrollTimeout);
      sendScrollDepth();
    };
  }, [pathname]);
}

