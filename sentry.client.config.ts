import * as Sentry from '@sentry/nextjs';

/**
 * 🛡️ CONFIGURAÇÃO SENTRY - CLIENTE
 *
 * Configuração profissional para captura de erros no lado cliente
 * Implementa monitoramento de performance e experiência do usuário
 */

// Inicializar Sentry apenas se DSN estiver configurado
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    // DSN será configurado via variável de ambiente
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Configurações de ambiente
    environment: process.env.NODE_ENV || 'development',

  // Configurações de release e versioning
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE || 'power-run@1.0.0',

  // 📊 Configurações de Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // 🔍 Configurações de Session Replay (para debugging visual)
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.01 : 0.1,
  replaysOnErrorSampleRate: 1.0,

  // 🏗️ Configurações de Debug
  debug: process.env.NODE_ENV === 'development',

  // 📱 Configurações de captura automática
  integrations: [
    // Web Vitals para métricas de performance
    Sentry.browserTracingIntegration(),

    // Session Replay para debugging visual
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // 🎯 Configurações de captura de erro
  beforeSend(event) {
    // Filtrar erros irrelevantes em produção
    if (process.env.NODE_ENV === 'production') {
      // Filtrar erros de extensões do browser
      if (event.exception?.values?.[0]?.value?.includes('Extension')) {
        return null;
      }

      // Filtrar erros de rede timeout comum
      if (event.exception?.values?.[0]?.value?.includes('NetworkError')) {
        return null;
      }
    }

    // Adicionar contexto do usuário se disponível
    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent;
      const language = navigator.language;

      event.contexts = {
        ...event.contexts,
        browser: {
          userAgent,
          language,
          platform: navigator.platform,
        },
        screen: {
          width: screen.width,
          height: screen.height,
        },
      };
    }

    return event;
  },

  // 🏷️ Tags globais para organização
  initialScope: {
    tags: {
      component: 'client',
      framework: 'next.js',
      version: '15.4.3',
    },
  },

  // 📋 Configurações de contexto automático
  attachStacktrace: true,

  // 🔒 Configurações de privacidade
  sendDefaultPii: false, // Não enviar informações pessoais por padrão

    // 📈 Configurações de sampling
    profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  });

  // 🧪 Adicionar comando de teste em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    // Adicionar função global para testar Sentry
    if (typeof window !== 'undefined') {
      (window as typeof window & { testSentry?: () => void }).testSentry = () => {
        Sentry.captureException(new Error('🧪 Teste do Sentry Error Tracking'));
        console.log('🛡️ Evento de teste enviado para Sentry');
      };

      console.log('🛡️ Sentry configurado - Digite "testSentry()" no console para testar');
    }
  }
}
