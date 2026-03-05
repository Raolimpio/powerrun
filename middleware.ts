import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import {
  getProductRedirect,
  getCategoryRedirect,
  getCatalogRedirect,
} from './constants/redirect-mapping';
import { defaultLocale, locales, localePrefix } from './i18n/routing';

// Configuração de segurança empresarial
const securityHeaders = {
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googletagmanager.com *.google-analytics.com *.google.com *.googleadservices.com *.doubleclick.net *.youtube.com *.gstatic.com",
    "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
    "img-src 'self' data: https: *.unsplash.com *.ibb.co *.cloudinary.com *.googleusercontent.com",
    "font-src 'self' fonts.gstatic.com",
    "connect-src 'self' *.google-analytics.com *.analytics.google.com *.googletagmanager.com *.google.com *.googleadservices.com *.doubleclick.net *.sentry.io *.ingest.sentry.io",
    "media-src 'self' *.youtube.com *.youtu.be",
    "frame-src 'self' *.youtube.com *.youtu.be *.googletagmanager.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    'upgrade-insecure-requests',
  ].join('; '),

  // HSTS - HTTP Strict Transport Security
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

  // Prevenir clickjacking
  'X-Frame-Options': 'DENY',

  // Prevenir MIME type sniffing
  'X-Content-Type-Options': 'nosniff',

  // XSS Protection
  'X-XSS-Protection': '1; mode=block',

  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Permissions Policy (Feature Policy)
  'Permissions-Policy': ['camera=()', 'microphone=()', 'geolocation=()', 'interest-cohort=()'].join(
    ', '
  ),

  // Remove server info
  'X-Powered-By': '',
  Server: '',

  // DNS Prefetch Control
  'X-DNS-Prefetch-Control': 'on',
};

// Middleware do next-intl
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix,
});

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ===== IGNORAR ROTAS DE API =====
  // Rotas de API não devem passar pelo middleware de internacionalização
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // ===== IGNORAR SITEMAPS =====
  // Sitemaps devem ser servidos diretamente sem middleware
  if (pathname.endsWith('.xml') || pathname.includes('/sitemap')) {
    return NextResponse.next();
  }

  // ===== REDIRECT DIRETO DE DOMÍNIO RAIZ =====
  // Evita múltiplos redirects - redirect direto para /pt-BR
  if (pathname === '/') {
    const redirectUrl = new URL('/pt-BR', req.url);
    const response = NextResponse.redirect(redirectUrl, 301); // 301 = Permanent Redirect para melhor SEO
    response.headers.set('Cache-Control', 'public, max-age=3600'); // Cache por 1 hora
    return response;
  }

  // ===== REDIRECT QR CODES AUTOMÁTICO =====
  // Redireciona /qr-CÓDIGO para /pt-BR/qr/CÓDIGO automaticamente
  if (pathname.startsWith('/qr-') && !pathname.startsWith('/pt-BR/')) {
    const qrCode = pathname.substring(4); // Remove '/qr-' para pegar só o código
    const redirectUrl = new URL(`/pt-BR/qr/${qrCode}`, req.url);
    const response = NextResponse.redirect(redirectUrl, 301); // 301 para SEO
    response.headers.set('Cache-Control', 'public, max-age=86400'); // Cache por 24h
    return response;
  }

  // ===== REDIRECT CATÁLOGO AUTOMÁTICO =====
  // Redireciona URLs de catálogo para páginas de equipamentos com filtros
  if (pathname.startsWith('/catalogo') && !pathname.startsWith('/pt-BR/')) {
    const catalogSlug = pathname.replace('/catalogo', '') || '/catalogo';

    // Construir URL de redirect diretamente
    const catalogFilter = getCatalogRedirect(catalogSlug);
    const redirectPath = `/pt-BR/equipamentos${catalogFilter}`;

    const redirectUrl = new URL(redirectPath, req.url);
    const response = NextResponse.redirect(redirectUrl, 301); // 301 para SEO
    response.headers.set('Cache-Control', 'public, max-age=86400'); // Cache por 24h
    return response;
  }

  // ===== REDIRECT PRODUTOS ANTIGOS =====
  // Redireciona URLs antigas de produtos para as novas páginas de equipamentos
  if (pathname.startsWith('/produto/') && !pathname.startsWith('/pt-BR/')) {
    const productSlug = pathname.replace('/produto/', '');

    // Verificar se não é um loop infinito
    if (productSlug.includes('/pt-BR/equipamentos')) {
      // Se já contém o path de destino, redirecionar para equipamentos geral
      const redirectUrl = new URL('/pt-BR/equipamentos', req.url);
      const response = NextResponse.redirect(redirectUrl, 301);
      response.headers.set('Cache-Control', 'public, max-age=86400');
      return response;
    }

    // Construir URL de redirect diretamente
    const equipmentId = getProductRedirect(productSlug);
    let redirectPath;

    if (!equipmentId) {
      redirectPath = '/pt-BR/equipamentos';
    } else {
      redirectPath = `/pt-BR/equipamentos/${equipmentId}`;
    }

    const redirectUrl = new URL(redirectPath, req.url);
    const response = NextResponse.redirect(redirectUrl, 301); // 301 para SEO
    response.headers.set('Cache-Control', 'public, max-age=86400');
    return response;
  }

  // ===== REDIRECT CATEGORIAS ANTIGAS =====
  // Redireciona categorias antigas para filtros de equipamentos
  if (pathname.startsWith('/product-category/') && !pathname.startsWith('/pt-BR/')) {
    const categorySlug = pathname.replace('/product-category/', '');

    // Construir URL de redirect diretamente
    const categoryFilter = getCategoryRedirect(categorySlug);
    let redirectPath;

    if (!categoryFilter) {
      redirectPath = '/pt-BR/equipamentos';
    } else {
      redirectPath = `/pt-BR/equipamentos?categoria=${categoryFilter}`;
    }

    const redirectUrl = new URL(redirectPath, req.url);
    const response = NextResponse.redirect(redirectUrl, 301); // 301 para SEO
    response.headers.set('Cache-Control', 'public, max-age=86400');
    return response;
  }

  // Query strings são mantidas como estão para funcionalidade

  // Helper: resolve locale from pathname and build response with x-next-intl-locale for root layout <html lang>
  const resolveLocaleAndNext = (intlResponse: NextResponse): NextResponse => {
    const segment = pathname.replace(/^\/+/, '').split('/')[0] ?? '';
    const validLocale = (locales as readonly string[]).includes(segment) ? segment : defaultLocale;
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-next-intl-locale', validLocale);
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    intlResponse.headers.getSetCookie?.().forEach((cookie) => response.headers.append('Set-Cookie', cookie));
    return response;
  };

  // ===== CONFIGURAÇÃO ESPECÍFICA PARA ROTAS ADMINISTRATIVAS =====
  // Aplica headers de no-cache para páginas administrativas
  if (pathname.includes('/admin/fichas-tecnicas')) {
    const intlResponse = intlMiddleware(req);
    const response = resolveLocaleAndNext(intlResponse);
    response.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0'
    );
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
    return response;
  }

  // ===== APLICAR MIDDLEWARE DE INTERNACIONALIZAÇÃO =====
  // Para outras rotas que precisam de localização
  const intlResponse = intlMiddleware(req);

  // Se next-intl fez um redirect, retorna imediatamente
  if (intlResponse.status === 307 || intlResponse.status === 302) {
    return intlResponse;
  }

  const response = resolveLocaleAndNext(intlResponse);

  // Aplicar headers de segurança apenas em produção e staging
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'preview') {
    Object.entries(securityHeaders).forEach(([key, value]) => {
      if (value) {
        response.headers.set(key, value);
      } else {
        response.headers.delete(key);
      }
    });
  }

  // Rate limiting simples por IP (básico)
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'anonymous';

  // Headers informativos para debugging (apenas dev)
  if (process.env.NODE_ENV === 'development') {
    response.headers.set('X-Debug-IP', ip);
    response.headers.set('X-Debug-Path', req.nextUrl.pathname);
  }

  return response;
}

export const config = {
  matcher: [
    // Incluir TODAS as rotas, incluindo a rota raiz, QR codes e catálogos
    '/((?!_next|_vercel|.*\\..*|favicon.ico).*)',
    // Incluir explicitamente a rota raiz
    '/',
    // Incluir rotas de catálogo específicas
    '/catalogo/:path*',
    // Include API routes
    '/api/(.*)',
  ],
};
