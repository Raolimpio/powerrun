'use client';

// Hook legado mantido apenas para compatibilidade temporária.
// Nova implementação usa next-intl (useTranslations/useLocale).
export function useLanguage() {
  return {
    language: 'pt-BR',
    setLanguage: () => {},
    t: (key: string) => key,
  } as any;
}
