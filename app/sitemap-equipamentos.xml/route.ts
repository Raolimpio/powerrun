import { NextResponse } from 'next/server';
import { MOCK_EQUIPMENT } from '@/constants/equipment-data';
import { locales, defaultLocale } from '@/i18n/routing';

const baseUrl = 'https://powerrun.com.br';

export async function GET() {
  const equipmentsSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${MOCK_EQUIPMENT.map((equipment) =>
    locales
      .map((locale) => {
        const url =
          locale === defaultLocale
            ? `/equipamentos/${equipment.id}`
            : `/${locale}/equipamentos/${equipment.id}`;

        return `
  <url>
    <loc>${baseUrl}${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    ${equipment.images
      .map(
        (image) => `
    <image:image>
      <image:loc>${image}</image:loc>
      <image:title>${equipment.name}</image:title>
      <image:caption>${equipment.shortDescription}</image:caption>
    </image:image>`
      )
      .join('')}
  </url>`;
      })
      .join('')
  ).join('')}
</urlset>`;

  return new NextResponse(equipmentsSitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
