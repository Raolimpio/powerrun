// ========================================
// 🎯 GERENCIADOR CENTRAL DE PRODUTOS
// ========================================
// Sistema modular por linha de produto

import { BLUE_LINE_PRODUCTS, BLUE_LINE_CONFIG } from './product-lines/blue-line-config';
import { MUSCULACAO_PRODUCTS, MUSCULACAO_CONFIG } from './product-lines/musculacao-config';
import { RED_LINE_PRODUCTS, RED_LINE_CONFIG } from './product-lines/red-line-config';

// === TIPOS ===
export type ProductLineType = 'red' | 'blue' | 'musculacao';
export type ProductCategoryType = 'cardio' | 'musculacao';

export interface ProductConfig {
  name: string;
  category: string;
  features: readonly string[];
  specifications: Record<string, string>;
}

export interface LineConfig {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    text: string;
    bg: string;
    border: string;
  };
  type: ProductCategoryType;
  line: ProductLineType;
}

// === UNIÃO DE TODOS OS PRODUTOS ===
export const ALL_PRODUCTS = {
  ...RED_LINE_PRODUCTS,
  ...BLUE_LINE_PRODUCTS,
  ...MUSCULACAO_PRODUCTS,
} as const;

export const LINE_CONFIGS = {
  red: RED_LINE_CONFIG,
  blue: BLUE_LINE_CONFIG,
  musculacao: MUSCULACAO_CONFIG,
} as const;

// === MAPEAMENTO AUTOMÁTICO POR ID ===
const PRODUCT_TO_LINE_MAP: Record<string, ProductLineType> = {
  // Red Line
  'bicicleta-spinning-pr200': 'red',
  'esteira-pr4000-18': 'red',
  'esteira-pr4000-30': 'red',
  'esteira-pr5000': 'red',
  'esteira-pr5000i': 'red',
  'esteira-pr6000': 'red',
  'esteira-pr6000i': 'red',
  'bike-vertical-pr300': 'red',
  'bike-horizontal-pr400': 'red',
  'eliptico-pr500': 'red',
  'escada-pr600': 'red',

  // Blue Line
  'power-rise-650': 'blue',
  'power-race-7000': 'blue',
  'power-race-7000-ts': 'blue',
  'power-round-550': 'blue',
  'power-rush-350': 'blue',
  'power-rush-450': 'blue',
  'power-rush-250': 'blue',

  // Musculação
  'pr001-peitoral-dorsal': 'musculacao',
  'pr002-polia-superior-remada': 'musculacao',
  'pr003-multi-press': 'musculacao',
  'pr004-biceps-triceps': 'musculacao',
  'pr005-leg-press-hack': 'musculacao',
  'pr006-cadeira-adutora-abdutora': 'musculacao',
  'pr008-leg-press-hack-squat': 'musculacao',
  'pr009-cross-over-angular': 'musculacao',
  'pr010-multi-station': 'musculacao',
  'multi-gym-pr012': 'musculacao',
  'pr013-banco-uni-inclinavel': 'musculacao',
  'banco-bi-inclinavel-pr014': 'musculacao',
  'pr015-cadeira-extensora-flexora': 'musculacao',
};

// === FUNÇÕES UTILITÁRIAS ===

/**
 * Obtém a configuração do produto pelo ID
 */
export function getProductConfig(productId: string): ProductConfig | null {
  return ALL_PRODUCTS[productId as keyof typeof ALL_PRODUCTS] || null;
}

/**
 * Obtém a linha do produto pelo ID
 */
export function getProductLine(productId: string): ProductLineType {
  return PRODUCT_TO_LINE_MAP[productId] || 'red';
}

/**
 * Obtém a configuração da linha pelo ID do produto
 */
export function getLineConfig(productId: string): LineConfig {
  const line = getProductLine(productId);
  return LINE_CONFIGS[line];
}

/**
 * Obtém a configuração completa do produto (dados + linha)
 */
export function getFullProductConfig(productId: string) {
  const productConfig = getProductConfig(productId);
  const lineConfig = getLineConfig(productId);

  return {
    product: productConfig,
    line: lineConfig,
    hasConfig: !!productConfig,
  };
}

/**
 * Lista produtos por linha
 */
export function getProductsByLine(line: ProductLineType): string[] {
  return Object.keys(PRODUCT_TO_LINE_MAP).filter((id) => PRODUCT_TO_LINE_MAP[id] === line);
}

/**
 * Verifica se um produto tem configuração
 */
export function hasProductConfig(productId: string): boolean {
  return productId in ALL_PRODUCTS;
}

/**
 * Lista todas as linhas disponíveis
 */
export function getAllLines(): ProductLineType[] {
  return Object.keys(LINE_CONFIGS) as ProductLineType[];
}

/**
 * Obtém estatísticas dos produtos
 */
export function getProductStats() {
  const totalProducts = Object.keys(ALL_PRODUCTS).length;
  const redLineCount = getProductsByLine('red').length;
  const blueLineCount = getProductsByLine('blue').length;
  const musculacaoCount = getProductsByLine('musculacao').length;

  return {
    total: totalProducts,
    byLine: {
      red: redLineCount,
      blue: blueLineCount,
      musculacao: musculacaoCount,
    },
  };
}
