import { ProductLineType } from '@/constants/product-manager';

export interface ProjectKitItem {
  productId: string;
  quantity: number;
}

export interface ProjectKit {
  id: string;
  title: string;
  description: string;
  area: string; // ex: "30m²"
  line: ProductLineType; // 'red' | 'blue'
  items: ProjectKitItem[];
  features: string[];
}

export const PROJECT_KITS: ProjectKit[] = [
  // === RED LINE KITS ===
  {
    id: 'red-performance-30',
    title: 'Studio Performance Red',
    description:
      'Kit completo focado em alta performance e durabilidade para academias de fluxo médio.',
    area: '30m²',
    line: 'red',
    features: [
      'Área Cardio Completa',
      'Musculação Multifuncional',
      'Otimização de Espaço',
      'Alta Durabilidade',
    ],
    items: [
      { productId: 'esteira-pr4000-30', quantity: 2 },
      { productId: 'eliptico-pr500', quantity: 1 },
      { productId: 'bike-horizontal-pr400', quantity: 1 },
      { productId: 'bike-vertical-pr300', quantity: 1 },
      { productId: 'pr009-cross-over-angular', quantity: 1 },
      { productId: 'multi-gym-pr012', quantity: 1 },
      { productId: 'banco-bi-inclinavel-pr014', quantity: 2 },
    ],
  },
  {
    id: 'red-compact-20',
    title: 'Studio Compact Red',
    description:
      'Solução inteligente para condomínios e estúdios compactos, sem abrir mão da qualidade profissional.',
    area: '20m²',
    line: 'red',
    features: [
      'Essenciais do Cardio',
      'Estação Multifuncional',
      'Ideal para Condomínios',
      'Baixa Manutenção',
    ],
    items: [
      { productId: 'esteira-pr4000-18', quantity: 1 },
      { productId: 'bike-horizontal-pr400', quantity: 1 },
      { productId: 'bike-vertical-pr300', quantity: 1 },
      { productId: 'multi-gym-pr012', quantity: 1 },
      { productId: 'banco-bi-inclinavel-pr014', quantity: 1 },
    ],
  },

  // === BLUE LINE KITS ===
  {
    id: 'blue-premium-40',
    title: 'Academia Premium Blue',
    description: 'Experiência de luxo com equipamentos de última geração e design futurista.',
    area: '40m²',
    line: 'blue',
    features: [
      'Tecnologia de Ponta',
      'Design Futurista',
      'Conectividade Total',
      'Acabamento Premium',
    ],
    items: [
      { productId: 'power-race-7000', quantity: 2 },
      { productId: 'power-rise-650', quantity: 1 },
      { productId: 'power-round-550', quantity: 1 },
      { productId: 'power-rush-450', quantity: 1 },
      { productId: 'pr009-cross-over-angular', quantity: 1 },
      { productId: 'multi-gym-pr012', quantity: 1 },
      { productId: 'banco-bi-inclinavel-pr014', quantity: 2 },
    ],
  },
  {
    id: 'blue-studio-25',
    title: 'Personal Studio Blue',
    description: 'O requinte da linha Blue em um formato otimizado para atendimento personalizado.',
    area: '25m²',
    line: 'blue',
    features: ['Exclusividade', 'Conforto Superior', 'Biomecânica Precisa', 'Visual Impactante'],
    items: [
      { productId: 'power-race-7000', quantity: 1 },
      { productId: 'power-round-550', quantity: 1 },
      { productId: 'power-rush-350', quantity: 1 },
      { productId: 'multi-gym-pr012', quantity: 1 },
      { productId: 'banco-bi-inclinavel-pr014', quantity: 1 },
    ],
  },
];
