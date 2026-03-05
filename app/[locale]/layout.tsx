import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { ErrorBoundary, LangUpdater } from '@/components/common';
import WebVitals from '@/components/performance/WebVitals';
import PWAHandler from '@/components/pwa/PWAHandler';
import StructuredData from '@/components/seo/StructuredData';
import { PageTracker } from '@/components/tracking/PageTracker';
import {
  AsyncGoogleTagManager,
  AsyncGoogleAnalytics,
} from '@/components/tracking/AsyncGoogleTagManager';
import { AppLocale, locales } from '@/i18n/routing';

function ogLocaleFromRouteLocale(locale: string): string {
  switch (locale) {
    case 'pt-BR':
      return 'pt_BR';
    case 'en':
      return 'en_US';
    case 'es':
      return 'es_ES';
    case 'zh-CN':
      return 'zh_CN';
    default:
      return 'pt_BR';
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const ogLocale = ogLocaleFromRouteLocale(locale);
  const alternateLocales = (locales as readonly string[])
    .filter((l) => l !== locale)
    .map(ogLocaleFromRouteLocale);

  return {
    title: 'Power Run - Equipamentos Profissionais',
    description: 'Aplicação profissional para gestão de equipamentos com tecnologia de ponta',
    generator: 'Next.js',
    applicationName: 'Power Run',
    referrer: 'origin-when-cross-origin',
    keywords: ['equipamentos', 'profissional', 'gestão', 'power run', 'maquinário'],
    authors: [{ name: 'Power Run Team' }],
    creator: 'Power Run Team',
    publisher: 'Power Run',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://powerrun.com'),
    alternates: {
      canonical: '/',
      languages: {
        'pt-BR': '/pt-BR',
        en: '/en',
        es: '/es',
        'zh-CN': '/zh-CN',
      },
    },
    openGraph: {
      title: 'Power Run - Equipamentos Profissionais',
      description: 'Aplicação profissional para gestão de equipamentos com tecnologia de ponta',
      url: 'https://powerrun.com',
      siteName: 'Power Run',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'Power Run - Equipamentos Profissionais',
        },
      ],
      locale: ogLocale,
      alternateLocale: alternateLocales,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Power Run - Equipamentos Profissionais',
      description: 'Aplicação profissional para gestão de equipamentos com tecnologia de ponta',
      images: ['/twitter-image.png'],
      creator: '@powerrun',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: [
        { url: '/icon-152x152.png', sizes: '152x152', type: 'image/png' },
        { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      ],
      other: [
        { rel: 'mask-icon', url: '/favicon.svg', color: '#9c1006' },
        { rel: 'apple-touch-icon', url: '/icon-152x152.png' },
      ],
    },
    manifest: '/manifest.json',
    category: 'business',
  };
}

async function loadMessages(locale: AppLocale) {
  switch (locale) {
    case 'pt-BR':
      return (await import('../../messages/pt-BR.json')).default;
    case 'en':
      return (await import('../../messages/en.json')).default;
    case 'es':
      return (await import('../../messages/es.json')).default;
    case 'zh-CN':
      return (await import('../../messages/zh-CN.json')).default;
    default:
      return (await import('../../messages/pt-BR.json')).default;
  }
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: 'pt-BR' | 'en' | 'es' | 'zh-CN' }>;
}>) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();

  const messages = await loadMessages(locale as AppLocale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ErrorBoundary>
        {/* Dados estruturados para SEO */}
        <StructuredData type='organization' />
        <StructuredData type='website' />
        <StructuredData type='localbusiness' />

        {/* Componentes de performance e monitoramento */}
        <WebVitals />
        <PWAHandler />
        <PageTracker />
        
        {/* Google Analytics e Tag Manager - carregamento assíncrono */}
        <AsyncGoogleAnalytics />
        <AsyncGoogleTagManager />
        
        {/* Atualizar atributo lang dinamicamente */}
        <LangUpdater />
        
        {children}
      </ErrorBoundary>
    </NextIntlClientProvider>
  );
}
