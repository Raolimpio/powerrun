'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function usePerformanceTracking(): void {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('PerformanceObserver' in window)) return;

    const sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) return;

    // Função para enviar métrica
    const sendMetric = (metricName: string, value: number, rating: string) => {
      fetch('/api/track/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          pagePath: pathname,
          metricName,
          value,
          rating,
        }),
      }).catch(() => {});
    };

    // Função para determinar rating
    const getRating = (metricName: string, value: number): string => {
      const thresholds: Record<string, { good: number; needsImprovement: number }> = {
        LCP: { good: 2500, needsImprovement: 4000 },
        FID: { good: 100, needsImprovement: 300 },
        CLS: { good: 0.1, needsImprovement: 0.25 },
        TTFB: { good: 800, needsImprovement: 1800 },
        FCP: { good: 1800, needsImprovement: 3000 },
      };

      const threshold = thresholds[metricName];
      if (!threshold) return 'unknown';

      if (value <= threshold.good) return 'good';
      if (value <= threshold.needsImprovement) return 'needs-improvement';
      return 'poor';
    };

    // Observer para LCP (Largest Contentful Paint)
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        if (lastEntry) {
          const value = lastEntry.renderTime || lastEntry.loadTime;
          sendMetric('LCP', value, getRating('LCP', value));
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {}

    // Observer para FID (First Input Delay)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          const value = entry.processingStart - entry.startTime;
          sendMetric('FID', value, getRating('FID', value));
        });
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
    } catch (e) {}

    // Observer para CLS (Cumulative Layout Shift)
    let clsObserver: PerformanceObserver | null = null;
    let clsValue = 0;

    try {
      clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      clsObserver = null;
    }

    // Enviar CLS ao sair da página
    const sendCLS = () => {
      if (clsValue > 0) {
        sendMetric('CLS', clsValue, getRating('CLS', clsValue));
      }
    };
    window.addEventListener('beforeunload', sendCLS);

    // Métricas de navegação (TTFB, FCP)
    const handleLoad = () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as any;
        if (navigation) {
          // TTFB (Time to First Byte)
          const ttfb = navigation.responseStart - navigation.requestStart;
          sendMetric('TTFB', ttfb, getRating('TTFB', ttfb));
        }

        // FCP (First Contentful Paint)
        const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0] as any;
        if (fcpEntry) {
          sendMetric('FCP', fcpEntry.startTime, getRating('FCP', fcpEntry.startTime));
        }
      }, 0);
    };

    if ('performance' in window && 'getEntriesByType' in performance) {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      window.removeEventListener('beforeunload', sendCLS);
      window.removeEventListener('load', handleLoad);
      if (clsObserver) {
        clsObserver.disconnect();
      }
    };
  }, [pathname]);
}

