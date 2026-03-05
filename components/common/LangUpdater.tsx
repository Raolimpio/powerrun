'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';

/**
 * Componente para atualizar o atributo lang no HTML dinamicamente
 * Baseado no locale atual do next-intl
 */
export function LangUpdater() {
  const locale = useLocale();

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const htmlElement = document.documentElement;
      if (htmlElement) {
        htmlElement.setAttribute('lang', locale);
      }
    }
  }, [locale]);

  return null;
}

