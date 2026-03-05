# Arquitetura

## Stack

| Componente   | Versão / detalhe     |
| ------------ | -------------------- |
| Next.js      | 15 (App Router)      |
| React        | 18                   |
| TypeScript   | 5.x                  |
| Prisma       | 6.x                  |
| next-intl    | 4.x                  |
| Tailwind CSS | 3.x                  |
| Radix UI     | ShadUI (componentes) |
| Sentry       | @sentry/nextjs       |
| Deploy       | Vercel               |

## Estrutura de pastas

| Pasta                                               | Uso                                                                                 |
| --------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `app/[locale]/`                                     | Rotas por idioma (page.tsx, layout, equipamentos, admin, seo, etc.)                 |
| `app/api/`                                          | API routes (track, admin, cron, marketing-report, etc.)                             |
| `app/sitemap*.ts`, `app/robots.ts`, `app/llms.txt/` | Sitemaps, robots, llms.txt                                                          |
| `components/`                                       | Componentes reutilizáveis (common, forms, layout, ui, product)                      |
| `constants/`                                        | Fonte de verdade: equipment-data, product-lines, pdf-links, redirect-mapping, qr-\* |
| `lib/`                                              | prisma.ts (singleton client), auth.ts, marketing-report.ts                          |
| `i18n/`                                             | request.ts, routing.ts (locales, defaultLocale, localePrefix)                       |
| `messages/`                                         | Ficheiros JSON por locale (pt-BR, en, es, zh-CN)                                    |
| `hooks/`                                            | useQuoteTracking, useSessionTracking, usePerformanceTracking, etc.                  |
| `services/`                                         | brazilian-cities, international-cities (dados para sitemaps/SEO)                    |

## Fluxo de request

1. **Middleware** (`middleware.ts`): aplicado a todas as rotas exceto `/api/*` e
   rotas que contenham `sitemap` ou terminem em `.xml`. Faz: next-intl (locale),
   security headers (CSP, HSTS, X-Frame-Options, etc.), redirect de raiz para
   locale default, redirects de catálogo antigo via `getProductRedirect` /
   `getCategoryRedirect` / `getCatalogRedirect`
   (`constants/redirect-mapping.ts`).
2. **App Router:** rotas sob `app/[locale]/` são servidas com locale resolvido;
   Server Components leem `constants` e Prisma conforme necessário.
3. **API routes:** chamadas a `/api/*` não passam pelo middleware de i18n; usam
   Prisma e env diretamente.

## Roteamento

- **Locale:** prefixo sempre presente (`localePrefix: 'always'`). Locales: pt-BR
  (default), en, es, zh-CN. Config em `i18n/routing.ts`.
- **Rotas estáticas:** página inicial, empresa, termos, privacidade,
  documentação técnica, etc.
- **Rotas dinâmicas SEO:** `app/[locale]/seo/[productId]/[keyword]/[citySlug]`,
  kits blue-line/red-line por keyword e citySlug. Geram milhares de URLs para
  SEO local.
- **Redirects:** mapeamento em `constants/redirect-mapping.ts`; aplicados no
  middleware.

## Sitemaps e SEO

- **Sitemap principal:** `app/sitemap.ts` — páginas estáticas, equipamentos,
  suporte, QR, e referências a sitemaps filhos.
- **Sitemap index:** `app/sitemap-index.xml/route.ts` (ou equivalente) lista
  todos os sitemaps.
- **Sitemaps por região:** `sitemap-seo-br.xml`, `sitemap-seo-us.xml`,
  `sitemap-seo-latam.xml` — URLs SEO por região.
- **Blue Line:** `app/sitemap-blue-line/[...params]/route.ts` e rewrites em
  `next.config.ts` para formato legado (ex.: `sitemap-blue-line-br-:index.xml`).
- **Outros:** `sitemap-equipamentos.xml`, `sitemap-suporte.xml`.
- **Robots:** `app/robots.ts` — regras e referência ao sitemap index.
- **llms.txt:** `app/llms.txt/route.ts` — recurso para LLMs/crawlers.
- Cidades para SEO vêm de scripts (`generate:cities`, `export:cities:json`,
  `add:gps`, `merge:gps`) e de `services/brazilian-cities.ts`,
  `international-cities*.ts`.

## Imagens

- Next.js `Image` com `remotePatterns` em `next.config.ts`:
  `res.cloudinary.com`, `i.ibb.co`, `images.unsplash.com`. Formatos: webp, avif.
  Sem BD de media; URLs definidas em constants/componentes.
