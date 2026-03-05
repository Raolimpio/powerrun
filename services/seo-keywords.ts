/**
 * 🎯 Gerador de Keywords Long-Tail para SEO
 *
 * Gera variações de palavras-chave otimizadas para cada produto
 * Baseado em pesquisas reais e intenção de busca
 */

import { Equipment } from '@/types';

export interface SEOKeyword {
  keyword: string;
  type: 'primary' | 'secondary' | 'long-tail';
  searchIntent: 'informational' | 'commercial' | 'transactional' | 'navigational';
  priority: number; // 1-10
}

/**
 * Templates de keywords por categoria de produto
 */
const KEYWORD_TEMPLATES = {
  esteira: [
    {
      template: 'esteira profissional',
      type: 'primary' as const,
      intent: 'commercial' as const,
      priority: 10,
    },
    {
      template: 'esteira para academia',
      type: 'primary' as const,
      intent: 'commercial' as const,
      priority: 9,
    },
    {
      template: 'esteira comercial',
      type: 'primary' as const,
      intent: 'commercial' as const,
      priority: 9,
    },
    {
      template: 'esteira ergométrica profissional',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 8,
    },
    {
      template: 'esteira elétrica profissional',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 8,
    },
    {
      template: 'fabricante de esteira',
      type: 'primary' as const,
      intent: 'transactional' as const,
      priority: 9,
    },
    {
      template: 'preciso de esteira',
      type: 'long-tail' as const,
      intent: 'transactional' as const,
      priority: 8,
    },
    {
      template: 'quero comprar esteira',
      type: 'long-tail' as const,
      intent: 'transactional' as const,
      priority: 8,
    },
    {
      template: 'melhor esteira',
      type: 'long-tail' as const,
      intent: 'commercial' as const,
      priority: 8,
    },
    {
      template: 'esteira mais barata',
      type: 'long-tail' as const,
      intent: 'transactional' as const,
      priority: 7,
    },
    {
      template: 'instalação de esteira',
      type: 'long-tail' as const,
      intent: 'transactional' as const,
      priority: 7,
    },
    {
      template: 'como escolher esteira',
      type: 'long-tail' as const,
      intent: 'informational' as const,
      priority: 7,
    },
    {
      template: 'fabricante de esteiras',
      type: 'primary' as const,
      intent: 'transactional' as const,
      priority: 9,
    },
    {
      template: 'fabricante de máquinas de esteira',
      type: 'primary' as const,
      intent: 'transactional' as const,
      priority: 8,
    },
    {
      template: 'fábrica de esteiras',
      type: 'secondary' as const,
      intent: 'transactional' as const,
      priority: 8,
    },
    {
      template: 'máquina de esteira',
      type: 'primary' as const,
      intent: 'commercial' as const,
      priority: 8,
    },
    {
      template: 'aparelho de esteira',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 7,
    },
    {
      template: 'onde comprar esteira',
      type: 'long-tail' as const,
      intent: 'transactional' as const,
      priority: 8,
    },
    {
      template: 'esteira em promoção',
      type: 'long-tail' as const,
      intent: 'transactional' as const,
      priority: 7,
    },
    {
      template: 'revenda de esteiras',
      type: 'secondary' as const,
      intent: 'transactional' as const,
      priority: 7,
    },
    {
      template: 'venda de esteira profissional',
      type: 'secondary' as const,
      intent: 'transactional' as const,
      priority: 8,
    },
    {
      template: 'esteira para condomínio',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 7,
    },
    {
      template: 'esteira para montar academia',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 8,
    },
    {
      template: 'esteira para academia de condomínio',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 7,
    },
    {
      template: 'esteira para síndico',
      type: 'long-tail' as const,
      intent: 'commercial' as const,
      priority: 6,
    },
    {
      template: 'esteira para construtora',
      type: 'long-tail' as const,
      intent: 'commercial' as const,
      priority: 6,
    },
    {
      template: 'esteira residencial premium',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 6,
    },
    {
      template: 'esteira para hotel',
      type: 'long-tail' as const,
      intent: 'commercial' as const,
      priority: 6,
    },
    {
      template: 'onde comprar esteira profissional',
      type: 'long-tail' as const,
      intent: 'transactional' as const,
      priority: 7,
    },
    {
      template: 'empresa de esteira',
      type: 'secondary' as const,
      intent: 'informational' as const,
      priority: 6,
    },
    {
      template: 'distribuidor de esteira',
      type: 'secondary' as const,
      intent: 'transactional' as const,
      priority: 7,
    },
    {
      template: 'esteira preço',
      type: 'long-tail' as const,
      intent: 'transactional' as const,
      priority: 8,
    },
    {
      template: 'esteira academia preço',
      type: 'long-tail' as const,
      intent: 'transactional' as const,
      priority: 7,
    },
    {
      template: 'esteira alta performance',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 6,
    },
    {
      template: 'melhor esteira profissional',
      type: 'long-tail' as const,
      intent: 'commercial' as const,
      priority: 7,
    },
    {
      template: 'esteira fitness profissional',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 6,
    },
    {
      template: 'esteira para fisioterapia',
      type: 'long-tail' as const,
      intent: 'commercial' as const,
      priority: 5,
    },
    {
      template: 'esteira industrial',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 5,
    },
  ],

  bicicleta: [
    {
      template: 'bicicleta ergométrica profissional',
      type: 'primary' as const,
      intent: 'commercial' as const,
      priority: 10,
    },
    {
      template: 'bike spinning profissional',
      type: 'primary' as const,
      intent: 'commercial' as const,
      priority: 10,
    },
    {
      template: 'bicicleta para academia',
      type: 'primary' as const,
      intent: 'commercial' as const,
      priority: 9,
    },
    {
      template: 'bike vertical profissional',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 8,
    },
    {
      template: 'bike horizontal profissional',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 8,
    },
    {
      template: 'fabricante de bicicleta ergométrica',
      type: 'primary' as const,
      intent: 'transactional' as const,
      priority: 9,
    },
    {
      template: 'fabricante de bicicletas ergométricas',
      type: 'primary' as const,
      intent: 'transactional' as const,
      priority: 9,
    },
    {
      template: 'fabricante de bikes spinning',
      type: 'primary' as const,
      intent: 'transactional' as const,
      priority: 9,
    },
    {
      template: 'fábrica de bicicletas ergométricas',
      type: 'secondary' as const,
      intent: 'transactional' as const,
      priority: 8,
    },
    {
      template: 'máquina de bicicleta',
      type: 'primary' as const,
      intent: 'commercial' as const,
      priority: 8,
    },
    {
      template: 'aparelho de bicicleta ergométrica',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 7,
    },
    {
      template: 'onde comprar bicicleta ergométrica',
      type: 'long-tail' as const,
      intent: 'transactional' as const,
      priority: 8,
    },
    {
      template: 'bicicleta ergométrica em promoção',
      type: 'long-tail' as const,
      intent: 'transactional' as const,
      priority: 7,
    },
    {
      template: 'venda de bike spinning',
      type: 'secondary' as const,
      intent: 'transactional' as const,
      priority: 8,
    },
    {
      template: 'bicicleta spinning para condomínio',
      type: 'long-tail' as const,
      intent: 'commercial' as const,
      priority: 7,
    },
    {
      template: 'bicicleta para montar academia',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 8,
    },
    {
      template: 'bicicleta para academia de condomínio',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 7,
    },
    {
      template: 'bicicleta para síndico',
      type: 'long-tail' as const,
      intent: 'commercial' as const,
      priority: 6,
    },
    {
      template: 'bicicleta para construtora',
      type: 'long-tail' as const,
      intent: 'commercial' as const,
      priority: 6,
    },
    {
      template: 'bike ergométrica comercial',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 7,
    },
    {
      template: 'bicicleta fitness profissional',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 6,
    },
    {
      template: 'onde comprar bike spinning',
      type: 'long-tail' as const,
      intent: 'transactional' as const,
      priority: 7,
    },
    {
      template: 'empresa de bike profissional',
      type: 'secondary' as const,
      intent: 'informational' as const,
      priority: 6,
    },
    {
      template: 'distribuidor bike ergométrica',
      type: 'secondary' as const,
      intent: 'transactional' as const,
      priority: 7,
    },
    {
      template: 'bike spinning preço',
      type: 'long-tail' as const,
      intent: 'transactional' as const,
      priority: 8,
    },
    {
      template: 'bicicleta academia preço',
      type: 'long-tail' as const,
      intent: 'transactional' as const,
      priority: 7,
    },
    {
      template: 'bike alta performance',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 6,
    },
    {
      template: 'melhor bike spinning',
      type: 'long-tail' as const,
      intent: 'commercial' as const,
      priority: 7,
    },
    {
      template: 'bike profissional indoor',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 6,
    },
    {
      template: 'bike para fisioterapia',
      type: 'long-tail' as const,
      intent: 'commercial' as const,
      priority: 5,
    },
    {
      template: 'bicicleta spinning comercial',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 6,
    },
  ],

  eliptico: [
    {
      template: 'elíptico profissional',
      type: 'primary' as const,
      intent: 'commercial' as const,
      priority: 10,
    },
    {
      template: 'elíptico para academia',
      type: 'primary' as const,
      intent: 'commercial' as const,
      priority: 9,
    },
    {
      template: 'fabricante de elípticos',
      type: 'primary' as const,
      intent: 'transactional' as const,
      priority: 9,
    },
    {
      template: 'fábrica de elípticos',
      type: 'secondary' as const,
      intent: 'transactional' as const,
      priority: 8,
    },
    {
      template: 'máquina elíptica',
      type: 'primary' as const,
      intent: 'commercial' as const,
      priority: 8,
    },
    {
      template: 'aparelho elíptico',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 7,
    },
    {
      template: 'onde comprar elíptico',
      type: 'long-tail' as const,
      intent: 'transactional' as const,
      priority: 8,
    },
    {
      template: 'elíptico para montar academia',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 8,
    },
    {
      template: 'elíptico para academia de condomínio',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 7,
    },
    {
      template: 'elíptico para síndico',
      type: 'long-tail' as const,
      intent: 'commercial' as const,
      priority: 6,
    },
    {
      template: 'elíptico para construtora',
      type: 'long-tail' as const,
      intent: 'commercial' as const,
      priority: 6,
    },
    {
      template: 'transport elíptico profissional',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 8,
    },
    {
      template: 'elíptico comercial',
      type: 'primary' as const,
      intent: 'commercial' as const,
      priority: 9,
    },
    {
      template: 'fabricante de elíptico',
      type: 'primary' as const,
      intent: 'transactional' as const,
      priority: 9,
    },
    {
      template: 'venda de elíptico profissional',
      type: 'secondary' as const,
      intent: 'transactional' as const,
      priority: 8,
    },
    {
      template: 'elíptico para condomínio',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 7,
    },
    {
      template: 'elíptico residencial premium',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 6,
    },
    {
      template: 'elíptico para hotel',
      type: 'long-tail' as const,
      intent: 'commercial' as const,
      priority: 6,
    },
    {
      template: 'onde comprar elíptico',
      type: 'long-tail' as const,
      intent: 'transactional' as const,
      priority: 7,
    },
    {
      template: 'empresa de elíptico',
      type: 'secondary' as const,
      intent: 'informational' as const,
      priority: 6,
    },
    {
      template: 'distribuidor elíptico',
      type: 'secondary' as const,
      intent: 'transactional' as const,
      priority: 7,
    },
    {
      template: 'elíptico preço',
      type: 'long-tail' as const,
      intent: 'transactional' as const,
      priority: 8,
    },
    {
      template: 'elíptico academia preço',
      type: 'long-tail' as const,
      intent: 'transactional' as const,
      priority: 7,
    },
    {
      template: 'elíptico alta performance',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 6,
    },
    {
      template: 'melhor elíptico profissional',
      type: 'long-tail' as const,
      intent: 'commercial' as const,
      priority: 7,
    },
    {
      template: 'elíptico fitness',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 6,
    },
    {
      template: 'simulador elíptico profissional',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 6,
    },
    {
      template: 'elíptico para reabilitação',
      type: 'long-tail' as const,
      intent: 'commercial' as const,
      priority: 5,
    },
    {
      template: 'transport profissional academia',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 6,
    },
  ],

  escada: [
    {
      template: 'simulador de escada profissional',
      type: 'primary' as const,
      intent: 'commercial' as const,
      priority: 10,
    },
    {
      template: 'escada ergométrica profissional',
      type: 'primary' as const,
      intent: 'commercial' as const,
      priority: 9,
    },
    {
      template: 'simulador de escada para academia',
      type: 'primary' as const,
      intent: 'commercial' as const,
      priority: 9,
    },
    {
      template: 'escada para montar academia',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 8,
    },
    {
      template: 'escada para academia de condomínio',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 7,
    },
    {
      template: 'escada para síndico',
      type: 'long-tail' as const,
      intent: 'commercial' as const,
      priority: 6,
    },
    {
      template: 'escada para construtora',
      type: 'long-tail' as const,
      intent: 'commercial' as const,
      priority: 6,
    },
    {
      template: 'stair climber profissional',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 8,
    },
    {
      template: 'fabricante simulador de escada',
      type: 'primary' as const,
      intent: 'transactional' as const,
      priority: 9,
    },
    {
      template: 'fabricante de escadas ergométricas',
      type: 'primary' as const,
      intent: 'transactional' as const,
      priority: 9,
    },
    {
      template: 'fábrica de escadas ergométricas',
      type: 'secondary' as const,
      intent: 'transactional' as const,
      priority: 8,
    },
    {
      template: 'máquina de escada',
      type: 'primary' as const,
      intent: 'commercial' as const,
      priority: 8,
    },
    {
      template: 'aparelho de escada',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 7,
    },
    {
      template: 'onde comprar escada ergométrica',
      type: 'long-tail' as const,
      intent: 'transactional' as const,
      priority: 8,
    },
    {
      template: 'venda simulador escada',
      type: 'secondary' as const,
      intent: 'transactional' as const,
      priority: 8,
    },
    {
      template: 'escada profissional academia',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 7,
    },
    {
      template: 'simulador escada comercial',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 7,
    },
    {
      template: 'onde comprar simulador escada',
      type: 'long-tail' as const,
      intent: 'transactional' as const,
      priority: 7,
    },
    {
      template: 'empresa simulador escada',
      type: 'secondary' as const,
      intent: 'informational' as const,
      priority: 6,
    },
    {
      template: 'distribuidor simulador escada',
      type: 'secondary' as const,
      intent: 'transactional' as const,
      priority: 7,
    },
    {
      template: 'simulador escada preço',
      type: 'long-tail' as const,
      intent: 'transactional' as const,
      priority: 8,
    },
    {
      template: 'escada ergométrica preço',
      type: 'long-tail' as const,
      intent: 'transactional' as const,
      priority: 7,
    },
    {
      template: 'melhor simulador escada',
      type: 'long-tail' as const,
      intent: 'commercial' as const,
      priority: 7,
    },
    {
      template: 'simulador escada alta performance',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 6,
    },
    {
      template: 'stair climber comercial',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 6,
    },
    {
      template: 'simulador escada para condomínio',
      type: 'long-tail' as const,
      intent: 'commercial' as const,
      priority: 6,
    },
    {
      template: 'simulador escada fitness',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 6,
    },
    {
      template: 'escada profissional cardio',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 5,
    },
    {
      template: 'simulador escada para hotel',
      type: 'long-tail' as const,
      intent: 'commercial' as const,
      priority: 5,
    },
  ],

  musculacao: [
    {
      template: 'equipamento de musculação profissional',
      type: 'primary' as const,
      intent: 'commercial' as const,
      priority: 10,
    },
    {
      template: 'aparelho de musculação para academia',
      type: 'primary' as const,
      intent: 'commercial' as const,
      priority: 9,
    },
    {
      template: 'equipamento de musculação comercial',
      type: 'primary' as const,
      intent: 'commercial' as const,
      priority: 9,
    },
    {
      template: 'fabricante equipamento musculação',
      type: 'primary' as const,
      intent: 'transactional' as const,
      priority: 9,
    },
    {
      template: 'fabricante de máquinas de academia',
      type: 'primary' as const,
      intent: 'transactional' as const,
      priority: 10,
    },
    {
      template: 'fabricante de equipamentos de academia',
      type: 'primary' as const,
      intent: 'transactional' as const,
      priority: 10,
    },
    {
      template: 'fabricante de aparelhos de academia',
      type: 'primary' as const,
      intent: 'transactional' as const,
      priority: 9,
    },
    {
      template: 'fábrica de máquinas de academia',
      type: 'secondary' as const,
      intent: 'transactional' as const,
      priority: 9,
    },
    {
      template: 'fábrica de equipamentos de academia',
      type: 'secondary' as const,
      intent: 'transactional' as const,
      priority: 9,
    },
    {
      template: 'empresa que fabrica máquinas de academia',
      type: 'secondary' as const,
      intent: 'transactional' as const,
      priority: 8,
    },
    {
      template: 'empresa que vende máquinas de academia',
      type: 'secondary' as const,
      intent: 'transactional' as const,
      priority: 8,
    },
    {
      template: 'máquinas de academia',
      type: 'primary' as const,
      intent: 'commercial' as const,
      priority: 9,
    },
    {
      template: 'aparelhos de academia',
      type: 'primary' as const,
      intent: 'commercial' as const,
      priority: 9,
    },
    {
      template: 'onde comprar máquinas de academia',
      type: 'long-tail' as const,
      intent: 'transactional' as const,
      priority: 8,
    },
    {
      template: 'máquinas de academia em promoção',
      type: 'long-tail' as const,
      intent: 'transactional' as const,
      priority: 7,
    },
    {
      template: 'revenda de máquinas de academia',
      type: 'secondary' as const,
      intent: 'transactional' as const,
      priority: 7,
    },
    {
      template: 'distribuidor de máquinas de academia',
      type: 'secondary' as const,
      intent: 'transactional' as const,
      priority: 7,
    },
    {
      template: 'venda equipamento musculação',
      type: 'secondary' as const,
      intent: 'transactional' as const,
      priority: 8,
    },
    {
      template: 'aparelho academia profissional',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 8,
    },
    {
      template: 'equipamento musculação condomínio',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 7,
    },
    {
      template: 'equipamento para montar academia',
      type: 'primary' as const,
      intent: 'commercial' as const,
      priority: 9,
    },
    {
      template: 'preciso montar academia',
      type: 'long-tail' as const,
      intent: 'transactional' as const,
      priority: 9,
    },
    {
      template: 'quero abrir academia',
      type: 'long-tail' as const,
      intent: 'transactional' as const,
      priority: 9,
    },
    {
      template: 'kit completo de academia',
      type: 'primary' as const,
      intent: 'commercial' as const,
      priority: 8,
    },
    {
      template: 'projeto de academia',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 8,
    },
    {
      template: 'instalação completa de academia',
      type: 'secondary' as const,
      intent: 'transactional' as const,
      priority: 7,
    },
    {
      template: 'como montar academia',
      type: 'long-tail' as const,
      intent: 'informational' as const,
      priority: 7,
    },
    {
      template: 'melhor kit academia',
      type: 'long-tail' as const,
      intent: 'commercial' as const,
      priority: 7,
    },
    {
      template: 'equipamento para abrir academia',
      type: 'primary' as const,
      intent: 'commercial' as const,
      priority: 9,
    },
    {
      template: 'kit academia completa',
      type: 'primary' as const,
      intent: 'commercial' as const,
      priority: 8,
    },
    {
      template: 'equipamento para academia de condomínio',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 8,
    },
    {
      template: 'equipamento para síndico',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 7,
    },
    {
      template: 'equipamento para construtora',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 7,
    },
    {
      template: 'equipamento para academia de prédio',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 7,
    },
    // Keywords com nomes específicos dos equipamentos de musculação
    {
      template: 'multi gym pr012',
      type: 'primary' as const,
      intent: 'commercial' as const,
      priority: 10,
    },
    {
      template: 'multi gym pr012 preço',
      type: 'long-tail' as const,
      intent: 'transactional' as const,
      priority: 9,
    },
    {
      template: 'multi gym pr012 para academia',
      type: 'primary' as const,
      intent: 'commercial' as const,
      priority: 9,
    },
    {
      template: 'leg press pr005',
      type: 'primary' as const,
      intent: 'commercial' as const,
      priority: 10,
    },
    {
      template: 'leg press pr005 preço',
      type: 'long-tail' as const,
      intent: 'transactional' as const,
      priority: 9,
    },
    {
      template: 'hack squat pr008',
      type: 'primary' as const,
      intent: 'commercial' as const,
      priority: 9,
    },
    {
      template: 'cross over pr009',
      type: 'primary' as const,
      intent: 'commercial' as const,
      priority: 9,
    },
    {
      template: 'cross over angular pr009',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 8,
    },
    {
      template: 'multi station pr010',
      type: 'primary' as const,
      intent: 'commercial' as const,
      priority: 9,
    },
    {
      template: 'peitoral dorsal pr001',
      type: 'primary' as const,
      intent: 'commercial' as const,
      priority: 8,
    },
    {
      template: 'polia superior pr002',
      type: 'primary' as const,
      intent: 'commercial' as const,
      priority: 8,
    },
    {
      template: 'multi press pr003',
      type: 'primary' as const,
      intent: 'commercial' as const,
      priority: 8,
    },
    {
      template: 'bíceps tríceps pr004',
      type: 'primary' as const,
      intent: 'commercial' as const,
      priority: 8,
    },
    {
      template: 'adutora abdutora pr006',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 7,
    },
    {
      template: 'extensora flexora pr015',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 7,
    },
    {
      template: 'banco uni inclinável pr013',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 7,
    },
    {
      template: 'banco bi inclinável pr014',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 7,
    },
    {
      template: 'máquina de musculação profissional',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 7,
    },
    {
      template: 'estação de musculação completa',
      type: 'long-tail' as const,
      intent: 'commercial' as const,
      priority: 7,
    },
    {
      template: 'onde comprar equipamento musculação',
      type: 'long-tail' as const,
      intent: 'transactional' as const,
      priority: 7,
    },
    {
      template: 'empresa equipamento musculação',
      type: 'secondary' as const,
      intent: 'informational' as const,
      priority: 6,
    },
    {
      template: 'distribuidor aparelho musculação',
      type: 'secondary' as const,
      intent: 'transactional' as const,
      priority: 7,
    },
    {
      template: 'equipamento musculação preço',
      type: 'long-tail' as const,
      intent: 'transactional' as const,
      priority: 8,
    },
    {
      template: 'aparelho academia preço',
      type: 'long-tail' as const,
      intent: 'transactional' as const,
      priority: 7,
    },
    {
      template: 'equipamento musculação alta qualidade',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 6,
    },
    {
      template: 'melhor equipamento musculação',
      type: 'long-tail' as const,
      intent: 'commercial' as const,
      priority: 7,
    },
    {
      template: 'linha completa musculação',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 6,
    },
    {
      template: 'equipamento musculação hotel',
      type: 'long-tail' as const,
      intent: 'commercial' as const,
      priority: 5,
    },
    {
      template: 'aparelho musculação condomínio',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 6,
    },
    {
      template: 'máquina musculação comercial',
      type: 'secondary' as const,
      intent: 'commercial' as const,
      priority: 6,
    },
  ],
};

/**
 * Identifica a categoria base do produto
 */
function getProductCategory(equipment: Equipment): keyof typeof KEYWORD_TEMPLATES {
  const id = equipment.id.toLowerCase();
  const name = equipment.name.toLowerCase();

  if (id.includes('esteira') || name.includes('esteira')) return 'esteira';
  if (
    id.includes('bicicleta') ||
    id.includes('bike') ||
    name.includes('bike') ||
    name.includes('bicicleta') ||
    id.includes('spinning')
  )
    return 'bicicleta';
  if (id.includes('eliptico') || name.includes('elíptico')) return 'eliptico';
  if (id.includes('escada') || name.includes('escada') || name.includes('climber')) return 'escada';

  return 'musculacao'; // Default
}

/**
 * Gera keywords SEO para um produto
 */
export function generateProductKeywords(equipment: Equipment): SEOKeyword[] {
  const category = getProductCategory(equipment);
  const templates = KEYWORD_TEMPLATES[category];

  const keywords: SEOKeyword[] = templates.map((template) => ({
    keyword: template.template,
    type: template.type,
    searchIntent: template.intent,
    priority: template.priority,
  }));

  // Adicionar variações com o nome do produto
  const productNameKeywords: SEOKeyword[] = [
    {
      keyword: equipment.name.toLowerCase(),
      type: 'primary',
      searchIntent: 'navigational',
      priority: 10,
    },
    {
      keyword: `${equipment.name.toLowerCase()} preço`,
      type: 'long-tail',
      searchIntent: 'transactional',
      priority: 8,
    },
    {
      keyword: `onde comprar ${equipment.name.toLowerCase()}`,
      type: 'long-tail',
      searchIntent: 'transactional',
      priority: 7,
    },
  ];

  return [...keywords, ...productNameKeywords];
}

/**
 * Gera título SEO otimizado para produto + cidade
 */
export function generateSEOTitle(
  keyword: string,
  cityName: string,
  stateCode: string,
  productName: string
): string {
  // Capitalizar primeira letra de cada palavra
  const capitalize = (str: string) =>
    str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  return `${capitalize(keyword)} em ${cityName} ${stateCode} | ${productName} Power Run`;
}

/**
 * Gera meta description SEO otimizada
 */
export function generateSEODescription(
  keyword: string,
  cityName: string,
  stateCode: string,
  productName: string
): string {
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(0);

  return `${capitalize(keyword)} em ${cityName} - ${stateCode}. ${productName} Power Run com qualidade profissional. Fabricante nacional com entrega para todo o Brasil. Solicite orçamento!`;
}

/**
 * Gera URL slug SEO-friendly
 */
export function generateSEOSlug(keyword: string): string {
  return keyword
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}
