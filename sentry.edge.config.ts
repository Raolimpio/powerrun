import * as Sentry from '@sentry/nextjs';

/**
 * 🛡️ CONFIGURAÇÃO SENTRY - EDGE RUNTIME
 *
 * Configuração profissional para captura de erros no Edge Runtime
 * Otimizada para Middleware e Edge Functions (Vercel)
 */

Sentry.init({
  // DSN será configurado via variável de ambiente
  dsn: process.env.SENTRY_DSN,

  // Configurações de ambiente
  environment: process.env.NODE_ENV || 'development',

  // Configurações de release e versioning
  release: process.env.SENTRY_RELEASE || 'power-run@1.0.0',

  // 📊 Configurações de Performance Monitoring (reduzidas para Edge)
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.05 : 0.5,

  // 🏗️ Configurações de Debug
  debug: process.env.NODE_ENV === 'development',

  // 📱 Configurações específicas do Edge Runtime
  integrations: [
    // Integração básica para Edge - sem features pesadas
    Sentry.httpIntegration(),
  ],

  // 🎯 Configurações de captura de erro otimizadas
  beforeSend(event) {
    // Contexto mínimo para Edge Runtime
    event.contexts = {
      ...event.contexts,
      runtime: {
        name: 'edge',
        version: 'vercel',
      },
    };

    // Filtros específicos para Edge
    if (process.env.NODE_ENV === 'production') {
      // Filtrar erros muito comuns de middleware
      if (event.exception?.values?.[0]?.value?.includes('redirect')) {
        return null;
      }
    }

    return event;
  },

  // 🏷️ Tags específicas do Edge
  initialScope: {
    tags: {
      component: 'edge',
      runtime: 'edge',
      framework: 'next.js',
    },
  },

  // 📋 Configurações otimizadas para Edge
  attachStacktrace: true,

  // 🔒 Configurações de privacidade
  sendDefaultPii: false,

  // 📈 Sampling reduzido para Edge (performance)
  profilesSampleRate: 0, // Desabilitado no Edge

  // 🚀 Configurações específicas do Edge
  maxBreadcrumbs: 20, // Limite reduzido

  // ⚡ Features pesadas desabilitadas automaticamente no Edge
});

// 🧪 Log apenas em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  console.log('🛡️ Sentry Edge Runtime configurado');
}
