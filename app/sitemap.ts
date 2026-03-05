import { MetadataRoute } from 'next';
import { MOCK_EQUIPMENT } from '@/constants/equipment-data';
import { locales, defaultLocale } from '@/i18n/routing';

// URLs base do site
const baseUrl = 'https://powerrun.com.br';

/**
 * Sitemap Index - Lista todos os sitemaps do site
 * 
 * Estrutura:
 * - sitemap.xml (principal): Páginas estáticas, produtos, suporte
 * - sitemap-seo.xml: URLs de SEO por cidade (milhares de URLs)
 */

// Páginas estáticas principais
const staticPages = ['', '/empresa', '/equipamentos', '/suporte', '/termos', '/privacidade'];

// Páginas de documentação técnica
const documentationPages = ['/documentacao-tecnica'];

// Páginas de suporte específicas
const supportPages = [
  '/suporte/contato',
  '/suporte/manuais',
  '/suporte/garantia',
  '/suporte/instalacao',
  '/suporte/manutencao',
  '/suporte/treinamento',
  '/suporte/atendimento',
];

// Função para gerar URLs de equipamentos
function generateEquipmentUrls() {
  return MOCK_EQUIPMENT.map((equipment) => ({
    url: `/equipamentos/${equipment.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
}

// Função para gerar URLs de QR codes
function generateQRUrls() {
  return MOCK_EQUIPMENT.map((equipment) => ({
    url: `/qr/${equipment.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
}

// Função para gerar URLs de suporte por equipamento
function generateSupportUrls() {
  return MOCK_EQUIPMENT.map((equipment) => ({
    url: `/suporte/${equipment.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
}

// Função para gerar sitemap com todas as URLs
function generateSitemapUrls() {
  const urls: MetadataRoute.Sitemap = [];

  // Páginas estáticas principais
  staticPages.forEach((page) => {
    locales.forEach((locale) => {
      const url = locale === defaultLocale ? page : `/${locale}${page}`;
      urls.push({
        url: `${baseUrl}${url}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1.0 : 0.9,
      });
    });
  });

  // Páginas de documentação técnica
  documentationPages.forEach((page) => {
    locales.forEach((locale) => {
      const url = locale === defaultLocale ? page : `/${locale}${page}`;
      urls.push({
        url: `${baseUrl}${url}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      });
    });
  });

  // Páginas de suporte
  supportPages.forEach((page) => {
    locales.forEach((locale) => {
      const url = locale === defaultLocale ? page : `/${locale}${page}`;
      urls.push({
        url: `${baseUrl}${url}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      });
    });
  });

  // URLs de equipamentos
  generateEquipmentUrls().forEach((equipment) => {
    locales.forEach((locale) => {
      const url = locale === defaultLocale ? equipment.url : `/${locale}${equipment.url}`;
      urls.push({
        url: `${baseUrl}${url}`,
        lastModified: equipment.lastModified,
        changeFrequency: equipment.changeFrequency,
        priority: equipment.priority,
      });
    });
  });

  // URLs de QR codes
  generateQRUrls().forEach((qr) => {
    locales.forEach((locale) => {
      const url = locale === defaultLocale ? qr.url : `/${locale}${qr.url}`;
      urls.push({
        url: `${baseUrl}${url}`,
        lastModified: qr.lastModified,
        changeFrequency: qr.changeFrequency,
        priority: qr.priority,
      });
    });
  });

  // URLs de suporte por equipamento
  generateSupportUrls().forEach((support) => {
    locales.forEach((locale) => {
      const url = locale === defaultLocale ? support.url : `/${locale}${support.url}`;
      urls.push({
        url: `${baseUrl}${url}`,
        lastModified: support.lastModified,
        changeFrequency: support.changeFrequency,
        priority: support.priority,
      });
    });
  });

  // Sitemaps de SEO por região (otimizado para evitar HTTP 413)
  // Cada sitemap contém até 15k URLs estratégicas por país/região
  
  // Brasil (pt-BR)
  urls.push({
    url: `${baseUrl}/sitemap-seo-br.xml`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  });

  // USA (en)
  urls.push({
    url: `${baseUrl}/sitemap-seo-us.xml`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  });

  // América Latina (es)
  urls.push({
    url: `${baseUrl}/sitemap-seo-latam.xml`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  });

  return urls;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return generateSitemapUrls();
}
