import { NextResponse } from 'next/server';
import { MOCK_EQUIPMENT } from '@/constants/equipment-data';
import { locales, defaultLocale } from '@/i18n/routing';

const baseUrl = 'https://powerrun.com.br';

const supportPages = [
  '/suporte/contato',
  '/suporte/manuais',
  '/suporte/garantia',
  '/suporte/instalacao',
  '/suporte/manutencao',
  '/suporte/treinamento',
  '/suporte/atendimento',
];

export async function GET() {
  const supportSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${supportPages
    .map((page) =>
      locales
        .map((locale) => {
          const url = locale === defaultLocale ? page : `/${locale}${page}`;

          return `
  <url>
    <loc>${baseUrl}${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
        })
        .join('')
    )
    .join('')}
  ${MOCK_EQUIPMENT.map((equipment) =>
    locales
      .map((locale) => {
        const url =
          locale === defaultLocale
            ? `/suporte/${equipment.id}`
            : `/${locale}/suporte/${equipment.id}`;

        return `
  <url>
    <loc>${baseUrl}${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
      })
      .join('')
  ).join('')}
</urlset>`;

  return new NextResponse(supportSitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
