/**
 * Sistema profissional de mapeamento de produtos por linha
 * Baseado na documentação oficial do arquivo Produtos.md
 *
 * Lógica de categorização:
 * - Red Line: Produtos básicos e intermediários (PR series)
 * - Blue Line: Produtos premium (Power series)
 * - Musculação: Equipamentos de força e musculação
 */

export interface ProductLineConfig {
  line: 'red' | 'blue' | 'musculacao';
  type: 'cardio' | 'musculacao';
  category: 'red-line' | 'blue-line' | 'musculacao';
  subcategory?: string;
  colors: {
    accent: string;
    border: string;
    ring: string;
    text: string;
    bg: string;
    hover: string;
    gradient: string;
    solid: string;
    tag: string;
  };
}

/**
 * Mapeamento detalhado por ID do produto
 * Baseado na documentação oficial - cada produto tem sua linha E tipo definidos
 */
export const PRODUCT_DETAILED_MAPPING: Record<
  string,
  { line: ProductLineConfig['line']; type: ProductLineConfig['type']; subcategory?: string }
> = {
  // RED LINE - CARDIO
  'bicicleta-spinning-pr200': { line: 'red', type: 'cardio', subcategory: 'bicicletas-spinning' },
  'esteira-pr4000-18': { line: 'red', type: 'cardio', subcategory: 'esteiras' },
  'esteira-pr4000-30': { line: 'red', type: 'cardio', subcategory: 'esteiras' },
  'esteira-pr5000': { line: 'red', type: 'cardio', subcategory: 'esteiras' },
  'esteira-pr5000i': { line: 'red', type: 'cardio', subcategory: 'esteiras' },
  'esteira-pr6000': { line: 'red', type: 'cardio', subcategory: 'esteiras' },
  'esteira-pr6000i': { line: 'red', type: 'cardio', subcategory: 'esteiras' },
  'bike-vertical-pr300': { line: 'red', type: 'cardio', subcategory: 'bicicletas-vertical' },
  'bike-horizontal-pr400': { line: 'red', type: 'cardio', subcategory: 'bicicletas-horizontal' },
  'eliptico-pr500': { line: 'red', type: 'cardio', subcategory: 'eliptico' },
  'escada-pr600': { line: 'red', type: 'cardio', subcategory: 'simulador-escada' },

  // BLUE LINE - CARDIO (Power series)
  'power-rise-650': { line: 'blue', type: 'cardio', subcategory: 'simulador-escada' },
  'power-race-7000': { line: 'blue', type: 'cardio', subcategory: 'esteiras' },
  'power-race-7000-ts': { line: 'blue', type: 'cardio', subcategory: 'esteiras' },
  'power-round-550': { line: 'blue', type: 'cardio', subcategory: 'eliptico' },
  'power-rush-350': { line: 'blue', type: 'cardio', subcategory: 'bicicletas-vertical' },
  'power-rush-450': { line: 'blue', type: 'cardio', subcategory: 'bicicletas-horizontal' },
  'power-rush-250': { line: 'blue', type: 'cardio', subcategory: 'bicicletas-spinning' },

  // MUSCULAÇÃO PURA - Equipamentos de força (PR001-PR015)
  'pr001-peitoral-dorsal': { line: 'musculacao', type: 'musculacao', subcategory: 'superiores' },
  'pr002-polia-superior-remada': {
    line: 'musculacao',
    type: 'musculacao',
    subcategory: 'superiores',
  },
  'pr003-multi-press': { line: 'musculacao', type: 'musculacao', subcategory: 'superiores' },
  'pr004-biceps-triceps': { line: 'musculacao', type: 'musculacao', subcategory: 'superiores' },
  'pr005-leg-press-hack': { line: 'musculacao', type: 'musculacao', subcategory: 'inferiores' },
  'pr006-cadeira-adutora-abdutora': {
    line: 'musculacao',
    type: 'musculacao',
    subcategory: 'inferiores',
  },
  'pr008-leg-press-hack-squat': {
    line: 'musculacao',
    type: 'musculacao',
    subcategory: 'inferiores',
  },
  'pr009-cross-over-angular': {
    line: 'musculacao',
    type: 'musculacao',
    subcategory: 'multifuncionais-musculacao',
  },
  'pr010-multi-station': {
    line: 'musculacao',
    type: 'musculacao',
    subcategory: 'multifuncionais-musculacao',
  },
  'multi-gym-pr012': {
    line: 'musculacao',
    type: 'musculacao',
    subcategory: 'multifuncionais-musculacao',
  },
  'pr013-banco-uni-inclinavel': { line: 'musculacao', type: 'musculacao', subcategory: 'bancos' },
  'banco-bi-inclinavel-pr014': { line: 'musculacao', type: 'musculacao', subcategory: 'bancos' },
  'pr015-cadeira-extensora-flexora': {
    line: 'musculacao',
    type: 'musculacao',
    subcategory: 'inferiores',
  },
};

/**
 * Configurações de cores para cada linha
 */
export const LINE_COLORS: Record<ProductLineConfig['line'], ProductLineConfig['colors']> = {
  red: {
    accent: 'from-[#9c1006]/10 to-[#9c1006]/5',
    border: 'border-[#9c1006]/20',
    ring: 'ring-[#9c1006]/30',
    text: 'text-[#9c1006]',
    bg: 'bg-[#9c1006]/5',
    hover: 'hover:bg-[#9c1006]/10',
    gradient: 'bg-gradient-to-r from-[#9c1006]/20 to-transparent',
    solid: '#9c1006',
    tag: 'bg-red-100 text-red-800 border-red-200',
  },
  blue: {
    accent: 'from-[#61fbfe]/10 to-[#61fbfe]/5',
    border: 'border-[#61fbfe]/20',
    ring: 'ring-[#61fbfe]/30',
    text: 'text-[#61fbfe]',
    bg: 'bg-[#61fbfe]/5',
    hover: 'hover:bg-[#61fbfe]/10',
    gradient: 'bg-gradient-to-r from-[#61fbfe]/20 to-transparent',
    solid: '#61fbfe',
    tag: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  musculacao: {
    accent: 'from-slate-500/10 to-slate-500/5',
    border: 'border-slate-500/20',
    ring: 'ring-slate-500/30',
    text: 'text-slate-700',
    bg: 'bg-slate-500/5',
    hover: 'hover:bg-slate-500/10',
    gradient: 'bg-gradient-to-r from-slate-500/20 to-transparent',
    solid: '#64748b',
    tag: 'bg-slate-100 text-slate-700 border-slate-300',
  },
};

/**
 * Função para obter dados detalhados do produto baseada no ID
 */
export function getProductDetails(productId: string): {
  line: ProductLineConfig['line'];
  type: ProductLineConfig['type'];
  subcategory?: string;
} {
  return PRODUCT_DETAILED_MAPPING[productId] || { line: 'red', type: 'cardio' };
}

/**
 * Função para obter a categoria baseada na linha e tipo
 */
export function getCategoryByLineAndType(
  line: ProductLineConfig['line']
): ProductLineConfig['category'] {
  // Red Line + Musculação = ainda é red-line (mas com cores diferentes)
  if (line === 'red') {
    return 'red-line';
  }
  // Blue Line = sempre blue-line
  if (line === 'blue') {
    return 'blue-line';
  }
  // Musculação pura = musculacao
  return 'musculacao';
}

/**
 * Função para obter cores baseadas na linha e tipo
 */
export function getColorsForProduct(
  line: ProductLineConfig['line'],
  type: ProductLineConfig['type']
): ProductLineConfig['colors'] {
  // QUALQUER produto de musculação usa cores cinza (incluindo Red Line + Musculação)
  if (type === 'musculacao') {
    return LINE_COLORS.musculacao;
  }

  // Red Line + Cardio usa cores vermelhas
  if (line === 'red' && type === 'cardio') {
    return LINE_COLORS.red;
  }

  // Blue Line + Cardio usa cores azuis
  if (line === 'blue' && type === 'cardio') {
    return LINE_COLORS.blue;
  }

  // Fallback para Red Line
  return LINE_COLORS.red;
}

/**
 * Função para obter configuração completa do produto
 */
export function getProductLineConfig(productId: string): ProductLineConfig {
  const { line, type, subcategory } = getProductDetails(productId);
  const category = getCategoryByLineAndType(line);
  const colors = getColorsForProduct(line, type);

  return {
    line,
    type,
    category,
    subcategory,
    colors,
  };
}

/**
 * Validação: verificar se um produto pertence a uma categoria específica
 */
export function validateProductCategory(productId: string, expectedCategory: string): boolean {
  const config = getProductLineConfig(productId);
  return config.category === expectedCategory;
}
