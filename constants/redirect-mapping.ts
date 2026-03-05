// ========================================
// 🔄 MAPEAMENTO DE REDIRECTS ANTIGOS
// ========================================
// Sistema centralizado de redirecionamento para URLs antigas

export interface RedirectMapping {
  oldUrl: string;
  newUrl: string;
  type: 'product' | 'category' | 'catalog';
  description: string;
}

// === 🎯 MAPEAMENTO DE PRODUTOS ANTIGOS ===
export const OLD_PRODUCT_REDIRECTS: Record<string, string> = {
  // Bicicletas Spinning
  'bike-spinning-profissional': 'bicicleta-spinning-pr200',

  // Esteiras Profissionais
  'esteira-profissional-power-run-pr-6000': 'esteira-pr6000',
  'esteira-profissional-power-run-pr-5000': 'esteira-pr5000',
  'esteira-profissional-power-run-pr-4000-1-8': 'esteira-pr4000-18',

  // Multigym/Musculação
  'multi-estacao': 'pr010-multi-station',
};

// === 🎯 MAPEAMENTO DE CATEGORIAS ANTIGAS ===
export const OLD_CATEGORY_REDIRECTS: Record<string, string> = {
  'bike-spinning': 'bicicletas-spinning',
  musculacao: 'musculacao',
  'red-line': 'red-line',
  'blue-line': 'blue-line',
};

// === 🎯 MAPEAMENTO DE CATÁLOGOS ANTIGOS ===
export const OLD_CATALOG_REDIRECTS: Record<string, string> = {
  catalogo: '',
  'catalogo-red-line': '?line=red-line',
  'catalogo-blue-line': '?line=blue-line',
  'catalogo-musculacao': '?categoria=musculacao',
};

// === 🔧 FUNÇÕES HELPER ===

/**
 * Obtém o redirect para um produto antigo
 */
export function getProductRedirect(oldSlug: string): string | null {
  return OLD_PRODUCT_REDIRECTS[oldSlug] || null;
}

/**
 * Obtém o redirect para uma categoria antiga
 */
export function getCategoryRedirect(oldSlug: string): string | null {
  return OLD_CATEGORY_REDIRECTS[oldSlug] || null;
}

/**
 * Obtém o redirect para um catálogo antigo
 */
export function getCatalogRedirect(oldSlug: string): string | null {
  return OLD_CATALOG_REDIRECTS[oldSlug] || null;
}

/**
 * Constrói a URL completa de redirect para um produto
 */
export function buildProductRedirectUrl(oldSlug: string, baseUrl: string): string {
  const equipmentId = getProductRedirect(oldSlug);
  const url = new URL(baseUrl);
  if (!equipmentId) {
    return `${url.origin}/pt-BR/equipamentos`;
  }
  return `${url.origin}/pt-BR/equipamentos/${equipmentId}`;
}

/**
 * Constrói a URL completa de redirect para uma categoria
 */
export function buildCategoryRedirectUrl(oldSlug: string, baseUrl: string): string {
  const categoryFilter = getCategoryRedirect(oldSlug);
  const url = new URL(baseUrl);
  if (!categoryFilter) {
    return `${url.origin}/pt-BR/equipamentos`;
  }
  return `${url.origin}/pt-BR/equipamentos?categoria=${categoryFilter}`;
}

/**
 * Constrói a URL completa de redirect para um catálogo
 */
export function buildCatalogRedirectUrl(oldSlug: string, baseUrl: string): string {
  const catalogFilter = getCatalogRedirect(oldSlug);
  const url = new URL(baseUrl);
  return `${url.origin}/pt-BR/equipamentos${catalogFilter}`;
}

// === 📋 LISTA COMPLETA DE REDIRECTS ===
export const ALL_REDIRECT_MAPPINGS: RedirectMapping[] = [
  // Produtos
  {
    oldUrl: '/produto/bike-spinning-profissional',
    newUrl: '/pt-BR/equipamentos/bicicleta-spinning-pr200',
    type: 'product',
    description: 'Bicicleta Spinning Profissional → Bicicleta Spinning PR200',
  },
  {
    oldUrl: '/produto/esteira-profissional-power-run-pr-6000',
    newUrl: '/pt-BR/equipamentos/esteira-pr6000',
    type: 'product',
    description: 'Esteira PR6000 → Esteira PR6000',
  },
  {
    oldUrl: '/produto/esteira-profissional-power-run-pr-5000',
    newUrl: '/pt-BR/equipamentos/esteira-pr5000',
    type: 'product',
    description: 'Esteira PR5000 → Esteira PR5000',
  },
  {
    oldUrl: '/produto/esteira-profissional-power-run-pr-4000-1-8',
    newUrl: '/pt-BR/equipamentos/esteira-pr4000-18',
    type: 'product',
    description: 'Esteira PR4000 1.8HP → Esteira PR4000 1.8HP',
  },
  {
    oldUrl: '/produto/multi-estacao',
    newUrl: '/pt-BR/equipamentos/pr010-multi-station',
    type: 'product',
    description: 'Multi Estação → PR010 Multi Station',
  },

  // Categorias
  {
    oldUrl: '/product-category/bike-spinning',
    newUrl: '/pt-BR/equipamentos?categoria=bicicletas-spinning',
    type: 'category',
    description: 'Categoria Bike Spinning → Filtro Bicicletas Spinning',
  },

  // Catálogos
  {
    oldUrl: '/catalogo',
    newUrl: '/pt-BR/equipamentos',
    type: 'catalog',
    description: 'Catálogo Geral → Página de Equipamentos',
  },
  {
    oldUrl: '/catalogo-red-line',
    newUrl: '/pt-BR/equipamentos?line=red-line',
    type: 'catalog',
    description: 'Catálogo Red Line → Filtro Red Line',
  },
  {
    oldUrl: '/catalogo-blue-line',
    newUrl: '/pt-BR/equipamentos?line=blue-line',
    type: 'catalog',
    description: 'Catálogo Blue Line → Filtro Blue Line',
  },
  {
    oldUrl: '/catalogo-musculacao',
    newUrl: '/pt-BR/equipamentos?categoria=musculacao',
    type: 'catalog',
    description: 'Catálogo Musculação → Filtro Musculação',
  },
];
