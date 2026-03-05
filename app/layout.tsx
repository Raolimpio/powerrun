import { headers } from 'next/headers';
import React from 'react';
import './globals.css';
import { locales, defaultLocale } from '@/i18n/routing';

const LOCALES_SET = new Set<string>(locales);

// Layout raiz - estrutura HTML com configurações globais
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const localeHeader = headersList.get('x-next-intl-locale');
  const resolvedLang = localeHeader && LOCALES_SET.has(localeHeader) ? localeHeader : defaultLocale;

  return (
    <html suppressHydrationWarning lang={resolvedLang}>
      <head>
        {/* Performance Critical Preloads - Fontes otimizadas */}
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        {/* Carregar fontes de forma assíncrona para não bloquear renderização */}
        <link
          rel='preload'
          href='https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap'
          as='style'
        />
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap'
          media='print'
          suppressHydrationWarning
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var link = document.querySelector('link[href*="fonts.googleapis.com/css2"][media="print"]');
                if (link) {
                  link.media = 'all';
                }
              })();
            `,
          }}
        />
        <noscript>
          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap'
          />
        </noscript>

        {/* Favicon - MÍNIMO ABSOLUTO */}
        <link rel='icon' href='/favicon.ico' />

        {/* Meta tags críticas */}
        <meta name='viewport' content='width=device-width, initial-scale=1, viewport-fit=cover' />
        <meta name='theme-color' content='#9c1006' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='black-translucent' />
        <meta name='apple-mobile-web-app-title' content='Power Run' />

        {/* Preload CSS crítico inline */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            html{line-height:1.15;-webkit-text-size-adjust:100%}
            body{margin:0;font-family:var(--font-geist-sans),system-ui,-apple-system,sans-serif}
            *{box-sizing:border-box}
            img{max-width:100%;height:auto}
            .animate-pulse{animation:pulse 2s cubic-bezier(0.4,0,0.6,1) infinite}
            @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
          `,
          }}
        />
        {/* Google Search Console Verification */}
        <meta
          name='google-site-verification'
          content='yh4FXgkL8nKRKMiVYxN7mCR6PVUszIYA-B4sgPjbUjw'
        />

        {/* Preconnect hints para performance - apenas DNS, sem carregar scripts ainda */}
        <link rel='dns-prefetch' href='https://www.googletagmanager.com' />
        <link rel='preconnect' href='https://www.youtube.com' />
        <link rel='preconnect' href='https://www.youtube-nocookie.com' />
        <link rel='preconnect' href='https://img.youtube.com' />
        <link rel='preconnect' href='https://res.cloudinary.com' />

        {/* Preconnect para origens críticas - Performance */}
        <link rel='preconnect' href='https://res.cloudinary.com' crossOrigin='anonymous' />
        <link rel='dns-prefetch' href='https://res.cloudinary.com' />

        {/* DNS prefetch para outros domínios */}
        <link rel='dns-prefetch' href='//fonts.googleapis.com' />
        <link rel='dns-prefetch' href='//fonts.gstatic.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link rel='dns-prefetch' href='//i.ibb.co' />
        <link rel='dns-prefetch' href='//www.youtube-nocookie.com' />

        {/* Google Analytics e Tag Manager serão carregados de forma assíncrona via componentes */}
      </head>
      <body className='antialiased min-h-screen' suppressHydrationWarning={true}>
        {/* Google Tag Manager (noscript) - apenas para usuários sem JS */}
        <noscript>
          <iframe
            src='https://www.googletagmanager.com/ns.html?id=GTM-P962GGL7'
            height='0'
            width='0'
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        {/* Inicializar dataLayer vazio - será preenchido pelos componentes assíncronos */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
