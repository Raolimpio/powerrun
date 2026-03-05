'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { useEffect } from 'react';

/**
 * Web Vitals Tracking Component - AAAA+++
 *
 * Monitora métricas de performance em tempo real:
 * - FCP (First Contentful Paint)
 * - LCP (Largest Contentful Paint)
 * - CLS (Cumulative Layout Shift)
 * - FID (First Input Delay)
 * - TTFB (Time to First Byte)
 * - INP (Interaction to Next Paint)
 */

interface WebVitalMetric {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  entries?: PerformanceEntry[];
  navigationType?: string;
}

const WEB_VITALS_THRESHOLDS = {
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  CLS: { good: 0.1, poor: 0.25 },
  FID: { good: 100, poor: 300 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
};

const getRating = (name: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
  const thresholds = WEB_VITALS_THRESHOLDS[name as keyof typeof WEB_VITALS_THRESHOLDS];
  if (!thresholds) return 'good';

  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
};

const logMetric = (metric: WebVitalMetric) => {
  const { name, value, rating, id, delta } = metric;

  // Log detalhado no desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.group(`🚀 Web Vital: ${name}`);
    console.log(`Value: ${Math.round(value)}ms`);
    console.log(
      `Rating: ${rating} ${rating === 'good' ? '✅' : rating === 'needs-improvement' ? '⚠️' : '❌'}`
    );
    console.log(`ID: ${id}`);
    console.log(`Delta: ${Math.round(delta)}ms`);
    console.groupEnd();
  }

  // Enviar para analytics em produção
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, {
      event_category: 'Web Vitals',
      value: Math.round(value),
      custom_parameter_rating: rating,
      custom_parameter_delta: Math.round(delta),
      non_interaction: true,
    });
  }

  // Enviar para Sentry performance monitoring
  if (typeof window !== 'undefined' && window.Sentry) {
    window.Sentry.addBreadcrumb({
      category: 'performance',
      message: `Web Vital: ${name}`,
      data: {
        value: Math.round(value),
        rating,
        delta: Math.round(delta),
      },
      level: rating === 'poor' ? 'error' : rating === 'needs-improvement' ? 'warning' : 'info',
    });
  }
};

const sendAnalytics = (metric: WebVitalMetric) => {
  // Implementação personalizada para envio de métricas
  const data = {
    metric_name: metric.name,
    metric_value: metric.value,
    metric_rating: metric.rating,
    metric_delta: metric.delta,
    page_url: window.location.href,
    timestamp: Date.now(),
  };

  // Enviar para endpoint interno ou serviço externo
  if (process.env.NODE_ENV === 'production') {
    fetch('/api/analytics/web-vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      // Usar sendBeacon se disponível para melhor performance
    }).catch(() => {
      // Fallback para sendBeacon
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics/web-vitals', JSON.stringify(data));
      }
    });
  }
};

export default function WebVitals() {
  useReportWebVitals((metric) => {
    const enhancedMetric: WebVitalMetric = {
      ...metric,
      rating: getRating(metric.name, metric.value),
    };

    logMetric(enhancedMetric);
    sendAnalytics(enhancedMetric);
  });

  // Performance Observer para métricas customizadas
  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    // Observar Navigation Timing
    const navObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;

          // Métricas customizadas
          const metrics = {
            domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.fetchStart,
            domComplete: navEntry.domComplete - navEntry.fetchStart,
            loadComplete: navEntry.loadEventEnd - navEntry.fetchStart,
          };

          console.log('📊 Navigation Metrics:', metrics);
        }
      });
    });

    navObserver.observe({ entryTypes: ['navigation'] });

    // Observar Resource Timing
    const resourceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const slowResources = entries.filter((entry) => entry.duration > 1000);

      if (slowResources.length > 0) {
        console.warn(
          '⚠️ Slow Resources Detected:',
          slowResources.map((r) => ({
            name: r.name,
            duration: Math.round(r.duration),
            size: (r as PerformanceResourceTiming).transferSize || 0,
          }))
        );
      }
    });

    resourceObserver.observe({ entryTypes: ['resource'] });

    return () => {
      navObserver.disconnect();
      resourceObserver.disconnect();
    };
  }, []);

  return null; // Componente invisível apenas para tracking
}

// Tipos globais para TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    Sentry?: {
      addBreadcrumb: (breadcrumb: {
        category: string;
        message: string;
        data: Record<string, any>;
        level: 'error' | 'warning' | 'info';
      }) => void;
    };
  }
}
