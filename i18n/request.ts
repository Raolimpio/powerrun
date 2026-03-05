import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from './routing';

export default getRequestConfig(async ({ requestLocale }): Promise<{
  locale: string;
  messages: Record<string, any>;
  onError?: (error: Error) => void;
}> => {
  // Na versão 4.x, requestLocale é uma Promise que vem no parâmetro
  const locale = await requestLocale;
  const resolvedLocale =
    locale && (locales as readonly string[]).includes(locale as any) ? locale : defaultLocale;
  const messages = (await import(`../messages/${resolvedLocale}.json`)).default;

  return {
    locale: resolvedLocale,
    messages,
    // Silenciar warnings de features (sistema de fallback funcionando)
    // Quando uma feature não é encontrada, o hook retorna o texto original
    onError: (error) => {
      // Silenciar completamente erros relacionados a features
      // Isso acontece quando:
      // 1. Uma feature não está traduzida (fallback retorna original)
      // 2. Uma feature já traduzida é passada como chave (fallback retorna ela mesma)
      if (error.message.includes('features.') || error.message.includes('MISSING_MESSAGE')) {
        // Silenciar completamente - o hook já trata o fallback
        return;
      }
      // Para outros erros, pode logar em desenvolvimento se necessário
      if (process.env.NODE_ENV === 'development') {
        // console.warn('Translation warning:', error.message);
      }
    },
  };
});
