// ========================================
// 🏢 CONFIGURAÇÃO DE KITS DE ACADEMIA
// ========================================

export interface GymKitItem {
  productId: string;
  quantity: number;
  description?: string;
}

export interface GymKit {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  area: string;
  description: string;
  idealFor: string[];
  items: GymKitItem[];
  accessories?: string[];
  highlight: boolean;
  line: 'red' | 'blue';
}

export const GYM_KITS: GymKit[] = [
  // ========================
  // KIT BASIC - até 30m² (RED LINE)
  // ========================
  {
    id: 'kit-basic-30',
    slug: 'basic-30m2',
    title: 'Kit BASIC 30m²',
    subtitle: 'Sugestão para espaços de até 30m² (BASIC)',
    area: '30m²',
    description:
      'Solução completa e otimizada para espaços compactos. Equipamentos Red Line com excelente custo-benefício: esteiras PR4000 3.0, bike horizontal, elíptico, mult estação, cadeira extensora/flexora e banco regulável.',
    idealFor: ['Condomínios', 'Studios compactos', 'Academias de pequeno porte'],
    highlight: true,
    line: 'red',
    items: [
      { productId: 'esteira-pr4000-30', quantity: 2, description: 'PR4000 3.0' },
      { productId: 'bike-horizontal-pr400', quantity: 1 },
      { productId: 'eliptico-pr500', quantity: 1 },
      { productId: 'multi-gym-pr012', quantity: 1, description: 'Mult Estação Multgym' },
      { productId: 'pr015-cadeira-extensora-flexora', quantity: 1 },
      { productId: 'banco-bi-inclinavel-pr014', quantity: 1 },
      {
        productId: 'pr009-cross-over-angular',
        quantity: 1,
        description: 'Kit acessórios Cross Smith',
      },
    ],
    accessories: [
      '01 Kit halteres de 1kg a 10kg',
      '01 Suporte para halteres',
      '01 Kit de 100kg anilhas emborrachadas',
      '01 Suporte para anilhas',
      '02 Colchonetes',
      '01 Espaldar',
    ],
  },
  // ========================
  // KIT PLUS - até 50m² (RED LINE)
  // ========================
  {
    id: 'kit-plus-50',
    slug: 'plus-50m2',
    title: 'Kit PLUS 50m²',
    subtitle: 'Sugestão para espaços de até 50m² (PLUS)',
    area: '50m²',
    description:
      'Kit completo para espaços de até 50m². Esteiras PR5000, bikes vertical e horizontal, mult estação, cadeira extensora/flexora, polia alta/baixa e banco regulável.',
    idealFor: ['Condomínios médios', 'Academias de bairro', 'Studios ampliados'],
    highlight: true,
    line: 'red',
    items: [
      { productId: 'esteira-pr5000', quantity: 2 },
      { productId: 'bike-vertical-pr300', quantity: 1 },
      { productId: 'bike-horizontal-pr400', quantity: 1 },
      { productId: 'multi-gym-pr012', quantity: 1 },
      { productId: 'pr015-cadeira-extensora-flexora', quantity: 1 },
      { productId: 'pr002-polia-superior-remada', quantity: 1, description: 'Polia Alta/Baixa' },
      { productId: 'banco-bi-inclinavel-pr014', quantity: 1 },
      {
        productId: 'pr009-cross-over-angular',
        quantity: 1,
        description: 'Kit acessórios Cross Smith',
      },
    ],
    accessories: [
      '01 Espaldar',
      '02 Colchonetes',
      '01 Kit 100kg de anilhas plastificadas',
      '01 Suporte para anilhas',
      '01 Kit halteres de 1kg a 10kg',
      '01 Suporte para halteres',
    ],
  },
  // ========================
  // KIT GOLD - até 90m² (RED LINE)
  // ========================
  {
    id: 'kit-gold-90',
    slug: 'gold-90m2',
    title: 'Kit Gold 90m²',
    subtitle: 'Sugestão para espaços de até 90m² (Gold)',
    area: '90m²',
    description:
      'Solução profissional para academias de médio porte. Esteiras PR5000i, cardio completo, leg press 45º, cadeira extensora/flexora, polia, adutor/abdutor, mult press e mult estação.',
    idealFor: ['Academias comerciais', 'Condomínios de alto padrão', 'Studios premium'],
    highlight: true,
    line: 'red',
    items: [
      { productId: 'esteira-pr5000i', quantity: 3 },
      { productId: 'bike-horizontal-pr400', quantity: 1 },
      { productId: 'bike-vertical-pr300', quantity: 1 },
      { productId: 'eliptico-pr500', quantity: 1 },
      { productId: 'pr008-leg-press-hack-squat', quantity: 1, description: 'Leg press 45º' },
      { productId: 'pr015-cadeira-extensora-flexora', quantity: 1 },
      { productId: 'pr002-polia-superior-remada', quantity: 1 },
      { productId: 'pr006-cadeira-adutora-abdutora', quantity: 1 },
      {
        productId: 'pr003-multi-press',
        quantity: 1,
        description: 'Mult Press Supino / Desenv Ombros',
      },
      { productId: 'multi-gym-pr012', quantity: 1 },
      { productId: 'banco-bi-inclinavel-pr014', quantity: 1 },
      {
        productId: 'pr009-cross-over-angular',
        quantity: 1,
        description: 'Kit acessórios Cross Smith',
      },
    ],
    accessories: [
      '01 Espaldar',
      '04 Colchonetes',
      '01 Kit 100kg de anilhas plastificadas',
      '01 Suporte para anilhas',
      '01 Kit halteres de 1kg a 10kg',
      '01 Suporte para halteres',
    ],
  },
  // ========================
  // KIT MASTER - até 150m² (RED LINE)
  // ========================
  {
    id: 'kit-master-150',
    slug: 'master-150m2',
    title: 'Kit Master 150m²',
    subtitle: 'Sugestão para espaços de até 150m² (Master)',
    area: '150m²',
    description:
      'Kit completo e profissional para academias de grande porte. Cardio em quantidade (esteiras PR5000i, bikes, elíptico, simulador de escada), musculação completa com peitoral/dorsal, bíceps/tríceps, leg press, polia, adutor/abdutor e mult press.',
    idealFor: ['Academias comerciais grandes', 'Condomínios premium', 'Redes de academias'],
    highlight: true,
    line: 'red',
    items: [
      { productId: 'esteira-pr5000i', quantity: 4 },
      { productId: 'bike-horizontal-pr400', quantity: 2 },
      { productId: 'eliptico-pr500', quantity: 1 },
      { productId: 'bike-vertical-pr300', quantity: 1 },
      { productId: 'escada-pr600', quantity: 1 },
      { productId: 'pr008-leg-press-hack-squat', quantity: 1, description: 'Leg press 45º' },
      { productId: 'pr015-cadeira-extensora-flexora', quantity: 1 },
      { productId: 'pr002-polia-superior-remada', quantity: 1 },
      { productId: 'pr006-cadeira-adutora-abdutora', quantity: 1 },
      { productId: 'pr003-multi-press', quantity: 1 },
      { productId: 'multi-gym-pr012', quantity: 1 },
      { productId: 'banco-bi-inclinavel-pr014', quantity: 1 },
      { productId: 'pr001-peitoral-dorsal', quantity: 1 },
      { productId: 'pr004-biceps-triceps', quantity: 1 },
      {
        productId: 'pr009-cross-over-angular',
        quantity: 1,
        description: 'Kit acessórios Cross Smith',
      },
    ],
    accessories: [
      '01 Espaldar',
      '06 Colchonetes',
      '01 Kit 100kg de anilhas plastificadas',
      '01 Suporte para anilhas',
      '01 Kit halteres de 1kg a 10kg',
      '01 Suporte para halteres',
    ],
  },
  // ========================
  // KIT PREMIUM - até 150m² (BLUE LINE)
  // ========================
  {
    id: 'kit-premium-150',
    slug: 'premium-150m2',
    title: 'Kit Premium 150m²',
    subtitle: 'Sugestão para espaços de até 150m² (Premium)',
    area: '150m²',
    description:
      'Experiência premium com equipamentos Blue Line: esteiras PR7000, bikes PR450/PR350, elíptico PR550, simulador de escada PR650 e mesma musculação completa do kit Master para academias de alto padrão.',
    idealFor: ['Academias premium', 'Studios de luxo', 'Condomínios de alto padrão'],
    highlight: true,
    line: 'blue',
    items: [
      { productId: 'power-race-7000', quantity: 4, description: 'Esteira PR7000' },
      { productId: 'power-rush-450', quantity: 2, description: 'Bike horizontal PR450' },
      { productId: 'power-round-550', quantity: 1, description: 'Elíptico PR550' },
      { productId: 'power-rush-350', quantity: 1, description: 'Bike vertical PR350' },
      { productId: 'power-rise-650', quantity: 1, description: 'Simulador de escada PR650' },
      { productId: 'pr008-leg-press-hack-squat', quantity: 1, description: 'Leg press 45º' },
      { productId: 'pr015-cadeira-extensora-flexora', quantity: 1 },
      { productId: 'pr002-polia-superior-remada', quantity: 1 },
      { productId: 'pr006-cadeira-adutora-abdutora', quantity: 1 },
      { productId: 'pr003-multi-press', quantity: 1 },
      { productId: 'multi-gym-pr012', quantity: 1 },
      { productId: 'banco-bi-inclinavel-pr014', quantity: 1 },
      { productId: 'pr001-peitoral-dorsal', quantity: 1 },
      { productId: 'pr004-biceps-triceps', quantity: 1 },
      {
        productId: 'pr009-cross-over-angular',
        quantity: 1,
        description: 'Kit acessórios Cross Smith',
      },
    ],
    accessories: [
      '01 Espaldar',
      '06 Colchonetes',
      '01 Kit 100kg de anilhas plastificadas',
      '01 Suporte para anilhas',
      '01 Kit halteres de 1kg a 10kg',
      '01 Suporte para halteres',
    ],
  },
];
