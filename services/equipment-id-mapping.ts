/**
 * 🗺️ MAPEAMENTO DE IDs DE EQUIPAMENTOS
 * 
 * Normaliza IDs de equipamentos que podem vir de diferentes fontes:
 * - URLs geradas com nomes slugificados
 * - IDs diretos do banco de dados
 * - Variações de nomenclatura
 */

import { MOCK_EQUIPMENT } from '@/constants/equipment-data';

/**
 * Mapeamento de variações de nomes/IDs para IDs reais
 * Inclui nomes slugificados que podem aparecer em URLs
 */
const EQUIPMENT_ID_MAPPING: Record<string, string> = {
  // Simulador de Escada PR600 - variações comuns
  'simulador-de-escada-profissional---pr600': 'escada-pr600',
  'simulador-de-escada-profissional-pr600': 'escada-pr600',
  'simulador-de-escada-pr600': 'escada-pr600',
  'escada-profissional-pr600': 'escada-pr600',
  'simulador-escada-pr600': 'escada-pr600',
  
  // Bicicleta Spinning PR200
  'bicicleta-spinning-profissional-pr200': 'bicicleta-spinning-pr200',
  'bike-spinning-pr200': 'bicicleta-spinning-pr200',
  'bicicleta-profissional-pr200': 'bicicleta-spinning-pr200',
  
  // Outros equipamentos comuns que podem ter variações
  'esteira-profissional-pr4000': 'esteira-pr4000',
  'esteira-profissional-pr5000': 'esteira-pr5000',
  'esteira-profissional-pr6000': 'esteira-pr6000',
};

/**
 * Normaliza um ID de equipamento para o ID real
 * Tenta encontrar o equipamento por:
 * 1. ID exato
 * 2. Mapeamento de variações
 * 3. Busca por nome slugificado
 */
export function normalizeEquipmentId(idOrSlug: string): string | null {
  // Se o ID já existe exatamente, retornar
  const exactMatch = MOCK_EQUIPMENT.find((eq) => eq.id === idOrSlug);
  if (exactMatch) {
    return exactMatch.id;
  }

  // Tentar mapeamento direto
  if (EQUIPMENT_ID_MAPPING[idOrSlug]) {
    return EQUIPMENT_ID_MAPPING[idOrSlug];
  }

  // Buscar por nome slugificado (normalizar e comparar)
  const normalizedSearch = idOrSlug
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w-]+/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

  // Tentar encontrar por similaridade no nome
  for (const equipment of MOCK_EQUIPMENT) {
    const equipmentNameSlug = equipment.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w-]+/g, '-')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');

    // Se o slug normalizado contém partes do ID ou nome
    if (
      equipmentNameSlug.includes(normalizedSearch) ||
      normalizedSearch.includes(equipmentNameSlug) ||
      equipment.id.includes(normalizedSearch) ||
      normalizedSearch.includes(equipment.id)
    ) {
      return equipment.id;
    }
  }

  // Se não encontrou, retornar null
  return null;
}

/**
 * Valida se um ID de equipamento é válido
 */
export function isValidEquipmentId(id: string): boolean {
  return MOCK_EQUIPMENT.some((eq) => eq.id === id);
}

/**
 * Obtém todos os IDs válidos de equipamentos
 */
export function getAllValidEquipmentIds(): string[] {
  return MOCK_EQUIPMENT.map((eq) => eq.id);
}

