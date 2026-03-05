// i18n routing configuration for next-intl (App Router)
// Centraliza locales e opções de roteamento
export const locales = ['pt-BR', 'en', 'es', 'zh-CN'] as const;
export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = 'pt-BR';

// "always" força prefixo /pt-BR, /en, etc. Facilita SEO e troca de idioma
export const localePrefix = 'always' as const;

// Opcional: quando formos traduzir slugs, podemos completar pathnames aqui
export const pathnames = {} as const;

// Export default exigido por next-intl/config (utilizado pelo plugin)
export default {
  locales,
  defaultLocale,
  localePrefix,
  pathnames,
};
