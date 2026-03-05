import { MOCK_EQUIPMENT, EQUIPMENT_CATEGORIES } from '@/constants/equipment-data';
import { getProductLineConfig } from '@/constants/product-line-mapping';
import { ApiResponse, Equipment, EquipmentCategory } from '@/types';
import { normalizeEquipmentId } from './equipment-id-mapping';

export interface FetchEquipmentsParams {
  locale: string;
  search?: string;
  category?: string;
  line?: 'red-line' | 'blue-line' | 'musculacao';
  target?: string;
  featured?: boolean;
  forSupport?: boolean; // Quando true, mostra TODAS as variantes (inclusive ocultas)
}

// REMOVIDO: Sistema antigo de mapeamento substituído pelo sistema profissional em product-line-mapping.ts

export async function fetchEquipments(
  params: FetchEquipmentsParams
): Promise<ApiResponse<Equipment[]>> {
  // Removido delay para evitar problemas no build/prerendering

  const filteredEquipments = MOCK_EQUIPMENT.filter((equipment) => {
    // Filtro específico: para suporte, mostrar TODAS as variantes individuais
    // Para equipamentos, ocultar variantes secundárias (mas manter as principais)
    const hiddenInEquipments = [
      'esteira-pr4000-18', // PR4000 1.8 (só PR4000 Series aparece em equipamentos)
      'esteira-pr5000i', // PR5000i (só PR5000 Series aparece em equipamentos)
      'esteira-pr6000i', // PR6000i (só PR6000 Series aparece em equipamentos)
      'power-race-7000-ts', // Power Race 7000 TS (só Power Race 7000 Series aparece em equipamentos)
      'pr008-leg-press-hack-squat', // PR008 Leg Press Hack Squat (inativo)
    ];

    // Se é consulta para suporte, mostrar TODAS as variantes (inclusive as ocultas)
    const isForSupport = params.forSupport === true;

    if (!isForSupport && hiddenInEquipments.includes(equipment.id)) {
      return false;
    }

    // Obter configuração profissional do produto
    const productConfig = getProductLineConfig(equipment.id);

    // Filtro por categoria (cardio, musculacao)
    if (params.category === 'cardio' && productConfig.type !== 'cardio') {
      return false;
    }
    if (params.category === 'musculacao' && productConfig.type !== 'musculacao') {
      return false;
    }

    // Filtro por subcategoria de musculação
    if (params.category === 'superiores' && productConfig.subcategory !== 'superiores') {
      return false;
    }
    if (params.category === 'inferiores' && productConfig.subcategory !== 'inferiores') {
      return false;
    }
    if (
      params.category === 'multifuncionais-musculacao' &&
      productConfig.subcategory !== 'multifuncionais-musculacao'
    ) {
      return false;
    }
    if (params.category === 'bancos' && productConfig.subcategory !== 'bancos') {
      return false;
    }

    if (
      params.category &&
      ![
        'cardio',
        'musculacao',
        'superiores',
        'inferiores',
        'multifuncionais-musculacao',
        'bancos',
      ].includes(params.category) &&
      equipment.category !== params.category
    ) {
      return false;
    }

    // Filtro por linha usando sistema profissional
    if (params.line === 'red-line' && productConfig.line !== 'red') {
      return false;
    }
    if (params.line === 'blue-line' && productConfig.line !== 'blue') {
      return false;
    }
    if (params.line === 'musculacao' && productConfig.line !== 'musculacao') {
      return false;
    }

    // Filtro por destaque
    if (typeof params.featured === 'boolean' && equipment.featured !== params.featured) {
      return false;
    }

    // Filtro por busca
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      const searchableText =
        `${equipment.name} ${equipment.description} ${equipment.brand} ${equipment.features.join(' ')}`.toLowerCase();
      if (!searchableText.includes(searchTerm)) {
        return false;
      }
    }

    // Filtro por público alvo
    if (params.target && equipment.targets) {
      const normalizedTarget = params.target.toLowerCase();
      const targetMapping: Record<string, string> = {
        academias: 'academia',
        academia: 'academia',
        condominios: 'condominio',
        condominio: 'condominio',
        residencias: 'residencia',
        residencia: 'residencia',
      };

      const mappedTarget = targetMapping[normalizedTarget];
      if (
        mappedTarget &&
        !equipment.targets.includes(mappedTarget as 'academia' | 'condominio' | 'residencia')
      ) {
        return false;
      }
    }

    return true;
  });

  // Ordenação customizada para equipamentos de musculação
  const sortedEquipments = sortEquipmentsByCategory(filteredEquipments, params.category);

  return {
    data: sortedEquipments,
    message: 'Equipamentos carregados com sucesso',
    success: true,
  };
}

/**
 * Função para ordenar equipamentos por categoria / linha
 */
function sortEquipmentsByCategory(equipments: Equipment[], category?: string): Equipment[] {
  // Ordem explícita de musculação (compartilhada entre listagem geral e filtro de musculação)
  const musculacaoOrder = [
    'pr009-cross-over-angular', // 1. Cross Over
    'pr005-leg-press-hack', // 2. Leg Press Horizontal
    'pr001-peitoral-dorsal', // 3. Peitoral Dorsal
    'pr002-polia-superior-remada', // 4. Polia Superior
    'pr003-multi-press', // 5. Multi Press
    'pr004-biceps-triceps', // 6. Bíceps/Tríceps
    'pr006-cadeira-adutora-abdutora', // 7. Adutora/Abdutora
    'pr008-leg-press-hack-squat', // 8. Hack Squat
    'pr015-cadeira-extensora-flexora', // 9. Extensora/Flexora
    'pr010-multi-station', // 10. Multi Station
    'multi-gym-pr012', // 11. Multi Gym (antes dos bancos)
    'pr013-banco-uni-inclinavel', // 12. Banco Uni
    'banco-bi-inclinavel-pr014', // 13. Banco Bi
  ];

  // Ordenação customizada quando filtrado por musculação
  if (category === 'musculacao') {
    return equipments.sort((a, b) => {
      const indexA = musculacaoOrder.indexOf(a.id);
      const indexB = musculacaoOrder.indexOf(b.id);

      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;

      return 0;
    });
  }

  // Ordenação geral por linha quando não há filtro específico de categoria
  // Ordem: Blue Line primeiro, depois Red Line, depois Musculação
  return equipments.sort((a, b) => {
    const configA = getProductLineConfig(a.id);
    const configB = getProductLineConfig(b.id);

    const getLineOrder = (line: 'blue' | 'red' | 'musculacao'): number => {
      if (line === 'blue') return 1;
      if (line === 'red') return 2;
      return 3; // musculacao
    };

    const orderA = getLineOrder(configA.line);
    const orderB = getLineOrder(configB.line);

    // Se são de linhas diferentes, ordenar por linha
    if (orderA !== orderB) {
      return orderA - orderB;
    }

    // Se são da mesma linha de musculação, aplicar a mesma ordem de musculação
    if (configA.line === 'musculacao' && configB.line === 'musculacao') {
      const indexA = musculacaoOrder.indexOf(a.id);
      const indexB = musculacaoOrder.indexOf(b.id);

      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
    }

    // Mesma linha (red ou blue) ou musculação fora da lista explícita → manter ordem original
    return 0;
  });
}

export async function fetchEquipmentById(
  id: string,
  _locale: string
): Promise<ApiResponse<Equipment>> {
  // Parâmetro locale reservado para futuras implementações de filtragem por idioma
  // Removido delay para evitar problemas no build/prerendering

  // Evita warning de variável não utilizada mantendo compatibilidade futura com locale
  void _locale;

  // Normalizar ID (pode vir de URL com nome slugificado)
  const normalizedId = normalizeEquipmentId(id);

  if (!normalizedId) {
    throw new Error(`Equipment with id ${id} not found`);
  }

  const equipment = MOCK_EQUIPMENT.find((eq) => eq.id === normalizedId);

  if (!equipment) {
    throw new Error(`Equipment with id ${id} (normalized: ${normalizedId}) not found`);
  }

  return {
    data: equipment,
    message: 'Equipamento carregado com sucesso',
    success: true,
  };
}

export async function fetchEquipmentCategories(
  _locale: string
): Promise<ApiResponse<EquipmentCategory[]>> {
  // Parâmetro locale reservado para futuras implementações de filtragem por idioma
  // Removido delay para evitar problemas no build/prerendering

  // Evita warning de variável não utilizada mantendo compatibilidade futura com locale
  void _locale;

  return {
    data: EQUIPMENT_CATEGORIES,
    message: 'Categorias carregadas com sucesso',
    success: true,
  };
}
