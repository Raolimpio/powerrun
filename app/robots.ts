import { MetadataRoute } from 'next';

/**
 * robots.txt - SEO 2025 Best Practices
 * 
 * Permite indexação de todas as páginas SEO
 * Bloqueia apenas arquivos administrativos e APIs
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://powerrun.com.br';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/pt-BR/',
          '/en/',
          '/es/',
          '/pt-BR/seo/',
          '/en/seo/',
          '/es/seo/',
          '/pt-BR/equipamentos/',
          '/en/equipamentos/',
          '/es/equipamentos/',
          '/pt-BR/suporte/',
          '/en/suporte/',
          '/es/suporte/',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/private/',
          '*.json',
          '/scripts/',
        ],
        crawlDelay: 0, // Sem delay para crawlers
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'],
        crawlDelay: 0,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'],
        crawlDelay: 0,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
