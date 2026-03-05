import * as Sentry from '@sentry/nextjs';

/**
 * 🛡️ CONFIGURAÇÃO SENTRY - SERVIDOR
 *
 * Configuração profissional para captura de erros no lado servidor
 * Implementa monitoramento de APIs e processos server-side
 */

// Inicializar Sentry apenas se DSN estiver configurado
if (process.env.SENTRY_DSN) {
  Sentry.init({
    // DSN será configurado via variável de ambiente
    dsn: process.env.SENTRY_DSN,

    // Configurações de ambiente
    environment: process.env.NODE_ENV || 'development',

  // Configurações de release e versioning
  release: process.env.SENTRY_RELEASE || 'power-run@1.0.0',

  // 📊 Configurações de Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // 🏗️ Configurações de Debug
  debug: process.env.NODE_ENV === 'development',

  // 📱 Configurações específicas do servidor
  integrations: [
    // HTTP integration para APIs
    Sentry.httpIntegration(),
  ],

  // 🎯 Configurações de captura de erro
  beforeSend(event) {
    // Adicionar contexto do servidor
    event.contexts = {
      ...event.contexts,
      runtime: {
        name: 'node',
        version: process.version,
      },
      os: {
        name: process.platform,
        version: process.arch,
      },
      app: {
        name: 'Power Run',
        version: '1.0.0',
      },
    };

    // Filtrar erros irrelevantes em produção
    if (process.env.NODE_ENV === 'production') {
      // Filtrar warnings desnecessários
      if (event.level === 'warning' && event.logger === 'next.js') {
        return null;
      }
    }

    // Log do erro no servidor para debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('🛡️ Sentry Server Error:', event.exception || event.message);
    }

    return event;
  },

  // 🏷️ Tags globais para organização
  initialScope: {
    tags: {
      component: 'server',
      framework: 'next.js',
      version: '15.4.3',
    },
  },

  // 📋 Configurações de contexto automático
  attachStacktrace: true,

  // 🔒 Configurações de privacidade
  sendDefaultPii: false,

  // 📈 Configurações de sampling
  profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // 🔧 Configurações avançadas para servidor
  serverName: process.env.VERCEL_REGION || 'local',

    // 📊 Configurações de cron jobs se necessário
    // cronJobs: {
    //   '0 0 * * *': 'daily-cleanup', // Exemplo de cron job
    // },
  });

  // 🧪 Função de teste para desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.log('🛡️ Sentry Server configurado');

    // Teste automático de funcionalidade
    setTimeout(() => {
      Sentry.addBreadcrumb({
        message: '🚀 Sentry Server inicializado com sucesso',
        level: 'info',
      });
    }, 1000);
  }
}
