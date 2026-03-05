/**
 * 🌎 Keywords Internacionais para SEO
 * 
 * Suporta múltiplos idiomas:
 * - Português (pt-BR) - Brasil
 * - Inglês (en) - Estados Unidos
 * - Espanhol (es) - América Latina
 */

import { Equipment } from '@/types';
import { SEOKeyword, generateProductKeywords } from './seo-keywords';

/**
 * Keywords em INGLÊS (Estados Unidos)
 */
export const ENGLISH_KEYWORDS = {
  treadmill: [
    'professional treadmill',
    'commercial treadmill',
    'treadmill for gym',
    'treadmill manufacturer',
    'gym equipment treadmill',
    'commercial grade treadmill',
    'professional gym treadmill',
    'treadmill for fitness center',
    'buy commercial treadmill',
    'treadmill supplier',
    'heavy duty treadmill',
    'industrial treadmill',
    'treadmill for hotel',
    'treadmill price',
    'best commercial treadmill',
    'fitness treadmill professional',
    'cardio treadmill commercial',
    'treadmill for sale',
    'gym treadmill equipment',
    'professional fitness treadmill',
  ],

  bike: [
    'spin bike professional',
    'commercial exercise bike',
    'gym bike equipment',
    'spinning bike for gym',
    'bike manufacturer',
    'stationary bike commercial',
    'indoor cycling bike',
    'professional spin bike',
    'commercial spin bike',
    'gym bike supplier',
    'recumbent bike commercial',
    'upright bike professional',
    'exercise bike for gym',
    'spin bike price',
    'best spin bike',
    'commercial cycling bike',
    'fitness bike professional',
    'bike for fitness center',
    'professional exercise bike',
    'gym bike for sale',
  ],

  elliptical: [
    'commercial elliptical',
    'professional elliptical',
    'elliptical for gym',
    'elliptical manufacturer',
    'gym elliptical equipment',
    'commercial elliptical machine',
    'professional gym elliptical',
    'elliptical for fitness center',
    'buy commercial elliptical',
    'elliptical supplier',
    'heavy duty elliptical',
    'elliptical trainer commercial',
    'elliptical for hotel',
    'elliptical price',
    'best commercial elliptical',
    'fitness elliptical professional',
    'cardio elliptical commercial',
    'elliptical for sale',
    'gym elliptical trainer',
    'professional fitness elliptical',
  ],

  stairclimber: [
    'stair climber commercial',
    'professional stair climber',
    'stair stepper for gym',
    'stair climber manufacturer',
    'gym stair climber equipment',
    'commercial stair stepper',
    'professional stair stepper',
    'stair climber for fitness center',
    'buy commercial stair climber',
    'stair climber supplier',
    'stair climber machine',
    'vertical climber commercial',
    'stair climber for hotel',
    'stair climber price',
    'best stair climber',
    'fitness stair climber',
    'cardio stair climber',
    'stair climber for sale',
    'gym stair stepper',
    'professional stair machine',
  ],

  strength: [
    'gym equipment commercial',
    'strength training equipment',
    'weight equipment for gym',
    'gym equipment manufacturer',
    'commercial gym equipment',
    'professional gym equipment',
    'strength equipment supplier',
    'weight training equipment',
    'multi gym equipment',
    'gym machine commercial',
    'strength equipment for gym',
    'buy gym equipment',
    'gym equipment supplier',
    'gym equipment price',
    'best gym equipment',
    'commercial strength equipment',
    'fitness gym equipment',
    'gym equipment for sale',
    'professional weight equipment',
    'complete gym equipment',
  ],
};

/**
 * Keywords em ESPANHOL (América Latina)
 */
export const SPANISH_KEYWORDS = {
  caminadora: [
    'caminadora profesional',
    'caminadora comercial',
    'caminadora para gimnasio',
    'fabricante de caminadora',
    'equipo de gimnasio caminadora',
    'caminadora grado comercial',
    'caminadora profesional gimnasio',
    'caminadora para centro fitness',
    'comprar caminadora comercial',
    'proveedor caminadora',
    'caminadora industrial',
    'caminadora para hotel',
    'precio caminadora',
    'mejor caminadora comercial',
    'caminadora fitness profesional',
    'caminadora cardio comercial',
    'venta de caminadora',
    'equipo caminadora gimnasio',
    'caminadora profesional fitness',
    'caminadora de alta calidad',
  ],

  bicicleta: [
    'bicicleta spinning profesional',
    'bicicleta comercial gimnasio',
    'equipo de bicicleta gimnasio',
    'bicicleta spinning para gimnasio',
    'fabricante de bicicleta',
    'bicicleta estacionaria comercial',
    'bicicleta indoor cycling',
    'bicicleta profesional spin',
    'bicicleta comercial spin',
    'proveedor bicicleta gimnasio',
    'bicicleta reclinada comercial',
    'bicicleta vertical profesional',
    'bicicleta ejercicio gimnasio',
    'precio bicicleta spinning',
    'mejor bicicleta spinning',
    'bicicleta cycling comercial',
    'bicicleta fitness profesional',
    'bicicleta para centro fitness',
    'bicicleta ejercicio profesional',
    'venta bicicleta gimnasio',
  ],

  eliptica: [
    'elíptica comercial',
    'elíptica profesional',
    'elíptica para gimnasio',
    'fabricante de elíptica',
    'equipo elíptica gimnasio',
    'máquina elíptica comercial',
    'elíptica profesional gimnasio',
    'elíptica para centro fitness',
    'comprar elíptica comercial',
    'proveedor elíptica',
    'elíptica industrial',
    'entrenador elíptico comercial',
    'elíptica para hotel',
    'precio elíptica',
    'mejor elíptica comercial',
    'elíptica fitness profesional',
    'elíptica cardio comercial',
    'venta de elíptica',
    'entrenador elíptico gimnasio',
    'elíptica profesional fitness',
  ],

  escaladora: [
    'escaladora comercial',
    'escaladora profesional',
    'escaladora para gimnasio',
    'fabricante de escaladora',
    'equipo escaladora gimnasio',
    'escaladora comercial gimnasio',
    'escaladora profesional fitness',
    'escaladora para centro fitness',
    'comprar escaladora comercial',
    'proveedor escaladora',
    'máquina escaladora',
    'escaladora vertical comercial',
    'escaladora para hotel',
    'precio escaladora',
    'mejor escaladora',
    'escaladora fitness',
    'escaladora cardio',
    'venta de escaladora',
    'escaladora gimnasio',
    'máquina escaladora profesional',
  ],

  musculacion: [
    'equipo de gimnasio comercial',
    'equipo de musculación',
    'equipo de pesas para gimnasio',
    'fabricante equipo gimnasio',
    'equipo comercial gimnasio',
    'equipo profesional gimnasio',
    'proveedor equipo musculación',
    'equipo entrenamiento pesas',
    'equipo multi gimnasio',
    'máquina gimnasio comercial',
    'equipo fuerza para gimnasio',
    'comprar equipo gimnasio',
    'proveedor equipo gimnasio',
    'precio equipo gimnasio',
    'mejor equipo gimnasio',
    'equipo fuerza comercial',
    'equipo fitness gimnasio',
    'venta equipo gimnasio',
    'equipo pesas profesional',
    'equipo completo gimnasio',
  ],
};

/**
 * Gera keywords internacionais baseado no idioma
 */
export function generateInternationalKeywords(
  equipment: Equipment,
  locale: 'pt-BR' | 'en' | 'es'
): SEOKeyword[] {
  const category = getProductCategory(equipment);

  // pt-BR usa o sistema completo de keywords em português
  if (locale === 'pt-BR') {
    return generateProductKeywords(equipment);
  }

  let templates: string[] = [];

  if (locale === 'en') {
    templates = ENGLISH_KEYWORDS[getCategoryKeyEn(category)] || [];
  } else if (locale === 'es') {
    templates = SPANISH_KEYWORDS[getCategoryKeyEs(category)] || [];
  } else {
    return [];
  }

  return templates.map((template, index) => ({
    keyword: template,
    type: index < 5 ? ('primary' as const) : index < 10 ? ('secondary' as const) : ('long-tail' as const),
    searchIntent: template.includes('buy') || template.includes('price') || template.includes('comprar') || template.includes('precio')
      ? ('transactional' as const)
      : template.includes('manufacturer') || template.includes('fabricante')
        ? ('commercial' as const)
        : ('informational' as const),
    priority: index < 3 ? 10 : index < 7 ? 8 : 6,
  }));
}

/**
 * Versão expandida internacional (alias para generateInternationalKeywords)
 * Mantida para compatibilidade com geradores de sitemap Blue Line
 */
export function generateExpandedInternationalKeywords(
  equipment: Equipment,
  locale: 'pt-BR' | 'en' | 'es'
): SEOKeyword[] {
  return generateInternationalKeywords(equipment, locale);
}

/**
 * Identifica categoria do produto
 */
function getProductCategory(equipment: Equipment): string {
  const id = equipment.id.toLowerCase();
  const name = equipment.name.toLowerCase();

  if (id.includes('esteira') || name.includes('esteira') || name.includes('treadmill')) return 'esteira';
  if (id.includes('bicicleta') || id.includes('bike') || name.includes('bike')) return 'bicicleta';
  if (id.includes('eliptico') || name.includes('elíptico') || name.includes('elliptical')) return 'eliptico';
  if (id.includes('escada') || name.includes('escada') || name.includes('stair')) return 'escada';

  return 'musculacao';
}

/**
 * Mapeia categoria para chave em inglês
 */
function getCategoryKeyEn(category: string): keyof typeof ENGLISH_KEYWORDS {
  const map: Record<string, keyof typeof ENGLISH_KEYWORDS> = {
    esteira: 'treadmill',
    bicicleta: 'bike',
    eliptico: 'elliptical',
    escada: 'stairclimber',
    musculacao: 'strength',
  };
  return map[category] || 'strength';
}

/**
 * Mapeia categoria para chave em espanhol
 */
function getCategoryKeyEs(category: string): keyof typeof SPANISH_KEYWORDS {
  const map: Record<string, keyof typeof SPANISH_KEYWORDS> = {
    esteira: 'caminadora',
    bicicleta: 'bicicleta',
    eliptico: 'eliptica',
    escada: 'escaladora',
    musculacao: 'musculacion',
  };
  return map[category] || 'musculacion';
}

/**
 * Gera título SEO internacional
 */
export function generateInternationalSEOTitle(
  keyword: string,
  cityName: string,
  countryCode: string,
  productName: string,
  locale: 'pt-BR' | 'en' | 'es'
): string {
  const capitalize = (str: string) =>
    str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  if (locale === 'en') {
    return `${capitalize(keyword)} in ${cityName}, ${countryCode} | ${productName} Power Run`;
  } else if (locale === 'es') {
    return `${capitalize(keyword)} en ${cityName}, ${countryCode} | ${productName} Power Run`;
  }

  // pt-BR
  return `${capitalize(keyword)} em ${cityName} ${countryCode} | ${productName} Power Run`;
}

/**
 * Gera meta description internacional
 */
export function generateInternationalSEODescription(
  keyword: string,
  cityName: string,
  countryCode: string,
  productName: string,
  locale: 'pt-BR' | 'en' | 'es'
): string {
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  if (locale === 'en') {
    return `${capitalize(keyword)} in ${cityName}, ${countryCode}. ${productName} Power Run with professional quality. National manufacturer with delivery throughout the region. Request a quote!`;
  } else if (locale === 'es') {
    return `${capitalize(keyword)} en ${cityName}, ${countryCode}. ${productName} Power Run con calidad profesional. Fabricante con entrega en toda la región. ¡Solicite cotización!`;
  }

  // pt-BR
  return `${capitalize(keyword)} em ${cityName} - ${countryCode}. ${productName} Power Run com qualidade profissional. Fabricante nacional com entrega para todo o Brasil. Solicite orçamento!`;
}

/**
 * Gera slug SEO (converte texto para URL amigável)
 */
export function generateSEOSlug(text: string): string {
  return text
    .toString()
    .normalize('NFD') // Normaliza acentos
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Espaços para hífens
    .replace(/[^\w-]+/g, '') // Remove caracteres especiais
    .replace(/--+/g, '-') // Remove hífens duplos
    .replace(/^-+/, '') // Remove hífen do início
    .replace(/-+$/, ''); // Remove hífen do final
}

