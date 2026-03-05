import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Equipment } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Filtra especificações técnicas removendo campos vazios ou com valor "—"
 * @param specifications - Objeto com as especificações técnicas
 * @returns Objeto filtrado sem campos vazios
 */
export function filterEmptySpecifications(specifications: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(specifications).filter(([, value]) => {
      // Remove campos que contêm apenas "—" ou estão vazios
      return value && value.toString().trim() !== '—' && value.toString().trim() !== '';
    })
  );
}

/**
 * Agrupa esteiras em séries, mantendo apenas os representantes principais
 * Remove variantes secundárias que devem aparecer apenas quando filtrado por esteiras
 * @param equipments - Array de equipamentos
 * @returns Array filtrado com apenas os representantes das séries de esteiras
 */
export function groupTreadmillsBySeries(equipments: Equipment[]): Equipment[] {
  // IDs das esteiras que devem ser ocultadas (variantes secundárias)
  const hiddenTreadmillVariants = [
    'esteira-pr4000-18', // PR4000 1.8HP (oculta, só PR4000 Series aparece)
    'esteira-pr5000i', // PR5000i (oculta, só PR5000 Series aparece)
    'esteira-pr6000i', // PR6000i (oculta, só PR6000 Series aparece)
    'power-race-7000-ts', // Power Race 7000 TS (oculta, só Power Race 7000 Series aparece)
  ];

  return equipments.filter((equipment) => {
    // Se é uma variante secundária de esteira, ocultar
    if (hiddenTreadmillVariants.includes(equipment.id)) {
      return false;
    }
    return true;
  });
}

/**
 * Capitaliza a primeira letra de cada palavra em uma string
 * Preserva apenas a parte técnica (modelo) em maiúsculo (ex: PR 4000, PR200)
 * @param str - String a ser capitalizada
 * @returns String com primeira letra de cada palavra em maiúscula, exceto modelos técnicos
 */
export function capitalize(str: string): string {
  if (!str) return str;
  
  // Regex para detectar partes técnicas: PR seguido de números ou apenas números após PR
  const technicalPattern = /^(PR|pr)[\s-]?\d+$/i;
  const prPattern = /^PR$/i;
  const numberPattern = /^\d+$/;
  
  const words = str.split(' ');
  const result: string[] = [];
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const prevWord = i > 0 ? words[i - 1] : '';
    const nextWord = i < words.length - 1 ? words[i + 1] : '';
    
    // Se é uma parte técnica completa (PR4000, PR-5000, etc.), mantém em maiúsculo
    if (technicalPattern.test(word)) {
      // Extrai PR e números, mantém em maiúsculo
      const match = word.match(/^(PR|pr)([\s-]?)(\d+)$/i);
      if (match) {
        result.push(`PR${match[2]}${match[3]}`);
        continue;
      }
    }
    
    // Se é "PR" e a próxima palavra é um número, mantém PR em maiúsculo
    if (prPattern.test(word) && nextWord && numberPattern.test(nextWord)) {
      result.push('PR');
      continue;
    }
    
    // Se é um número e a palavra anterior é "PR", mantém o número como está
    if (numberPattern.test(word) && prevWord && prPattern.test(prevWord)) {
      result.push(word);
      continue;
    }
    
    // Caso contrário, capitaliza normalmente
    result.push(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
  }
  
  return result.join(' ');
}