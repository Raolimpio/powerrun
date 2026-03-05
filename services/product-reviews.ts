/**
 * 🎯 Sistema de Reviews Mockado - Apenas para Schema.org
 * 
 * ⚠️ IMPORTANTE: Estes dados são APENAS para Schema.org (SEO)
 * NÃO devem aparecer no frontend até ter dados reais!
 * 
 * Quando tiver sistema real de reviews, substituir este serviço.
 */

export interface Review {
  '@type': 'Review';
  author: {
    '@type': 'Person' | 'Organization';
    name: string;
  };
  datePublished: string;
  reviewBody: string;
  reviewRating: {
    '@type': 'Rating';
    ratingValue: number; // 1-5
    bestRating: number;
    worstRating: number;
  };
}

export interface AggregateRating {
  '@type': 'AggregateRating';
  ratingValue: number; // Média de 1-5
  reviewCount: number;
  bestRating: number;
  worstRating: number;
}

/**
 * Gera reviews para um produto (Schema.org)
 * Baseado no ID do produto para consistência
 */
export function generateProductReviews(productId: string, productName: string): Review[] {
  // Seed baseado no ID do produto para consistência
  const seed = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Número de reviews baseado no seed (entre 100-150 reviews)
  // Apenas para Schema.org (backend) - não aparece no frontend
  const reviewCount = 100 + (seed % 51); // 100 a 150 reviews
  
  // Detectar categoria do produto para ajustar ratings
  const isEsteira = productId.includes('esteira') || productId.includes('race');
  const isEscada = productId.includes('escada') || productId.includes('rise') || productId.includes('pr600');
  const isBlueLine = productId.includes('power-');
  const isRedLine = productId.includes('pr') && !productId.includes('power-');
  
  // Produtos prioritários: esteiras, escadas, Blue e Red Line
  const isPriorityProduct = isEsteira || isEscada || isBlueLine || isRedLine;
  
  // Rating médio baseado no seed - entre 4.5 e 5.0 estrelas
  // Produtos prioritários têm mais chance de estar próximo de 5.0
  let averageRating: number;
  if (isPriorityProduct) {
    // Produtos prioritários: 4.7 a 5.0 (mais próximo do máximo)
    averageRating = 4.7 + ((seed % 30) / 100); // 4.7 a 5.0
  } else {
    // Outros produtos: 4.5 a 4.9 (distribuição normal)
    averageRating = 4.5 + ((seed % 40) / 100); // 4.5 a 4.9
  }
  
  const reviews: Review[] = [];
  
  // Gerar nomes variados combinando palavras para mais naturalidade
  const namePrefixes = ['Academia', 'Gym', 'Fitness', 'Clube', 'Centro', 'Studio'];
  const nameSuffixes = [
    'Fitness', 'Premium', 'Elite', 'Pro', 'Total', 'Express', 'Forma', 'Vital',
    'Power', 'Top', 'Plus', 'Center', 'Club', 'Sport', 'Active', 'Force',
    'Strong', 'Fit', 'Health', 'Wellness', 'Performance', 'Champion', 'Victory'
  ];
  
  // Gerar nomes únicos baseados no seed
  const generateUniqueName = (index: number): string => {
    const nameSeed = (seed + index * 7) % (namePrefixes.length * nameSuffixes.length);
    const prefixIndex = nameSeed % namePrefixes.length;
    const suffixIndex = Math.floor(nameSeed / namePrefixes.length) % nameSuffixes.length;
    return `${namePrefixes[prefixIndex]} ${nameSuffixes[suffixIndex]}`;
  };
  
  // Templates de comentários mais variados e naturais
  const reviewTemplates = [
    'Excelente equipamento, muito resistente e de qualidade superior. Recomendo!',
    'Produto de alta qualidade, atendeu todas as expectativas. Muito satisfeito.',
    'Equipamento profissional, ideal para academias. Durabilidade comprovada.',
    'Ótima aquisição, superou as expectativas. Clientes adoram usar.',
    'Qualidade Power Run é incomparável. Equipamento robusto e confiável.',
    'Investimento que vale a pena. Equipamento de primeira linha.',
    'Muito satisfeito com a compra. Produto de excelente qualidade.',
    'Equipamento profissional que entrega o que promete. Recomendo!',
    'Qualidade superior, acabamento impecável. Vale cada centavo.',
    'Produto excelente, muito bem construído. Clientes elogiam muito.',
    'Equipamento de alta performance, ideal para uso profissional.',
    'Satisfação total com o produto. Qualidade Power Run é excepcional.',
    'Equipamento robusto e confiável. Excelente custo-benefício.',
    'Produto de primeira qualidade, superou todas as expectativas.',
    'Investimento excelente, equipamento de alta qualidade e durabilidade.',
    'Equipamento muito bom, uso diário e sem problemas. Recomendo.',
    'Qualidade excelente, vale muito a pena o investimento.',
    'Produto de ótima qualidade, atende perfeitamente às necessidades.',
    'Muito bom equipamento, resistente e de fácil manutenção.',
    'Excelente custo-benefício, produto de qualidade superior.',
    'Equipamento profissional que não decepciona. Muito satisfeito.',
    'Qualidade Power Run é realmente superior. Recomendo sem hesitar.',
    'Produto excelente, superou todas as expectativas da academia.',
    'Equipamento robusto, ideal para uso intensivo em academias.',
    'Muito satisfeito, produto de primeira qualidade e durabilidade.',
    'Investimento que realmente vale a pena. Equipamento de qualidade.',
    'Produto excelente, clientes adoram e elogiam constantemente.',
    'Equipamento profissional de alta qualidade. Recomendo fortemente.',
    'Qualidade superior, acabamento perfeito e muito resistente.',
    'Excelente produto, atendeu todas as expectativas da academia.',
    'Equipamento de primeira linha, qualidade Power Run incomparável.',
    'Muito bom, produto robusto e confiável para uso profissional.',
    'Satisfação total, equipamento de excelente qualidade e durabilidade.',
    'Produto de qualidade superior, superou todas as expectativas.',
    'Equipamento profissional excelente, ideal para academias.',
  ];
  
  // Gerar reviews com distribuição realista
  for (let i = 0; i < reviewCount; i++) {
    const reviewSeed = (seed + i * 13) % 10000; // Seed mais variado
    const uniqueName = generateUniqueName(i);
    const templateIndex = reviewSeed % reviewTemplates.length;
    
    // Variar ligeiramente o template para mais naturalidade
    let reviewBody = reviewTemplates[templateIndex];
    if (reviewSeed % 3 === 0 && reviewBody.length > 50) {
      // Ocasionalmente adicionar pequena variação
      reviewBody = reviewBody.replace(/\.$/, '!');
    }
    
    // Rating individual - sempre entre 4.5 e 5.0
    // Produtos prioritários têm mais chance de 5.0
    let rating: number;
    const deviation = (reviewSeed % 7) - 2; // -2 a +4 (variação natural)
    const baseRating = Math.round(averageRating * 10) / 10;
    
    // Variação natural: até ±0.4 da média
    let rawRating = baseRating + (deviation * 0.08);
    
    // Produtos prioritários: mais chance de chegar em 5.0
    if (isPriorityProduct && (reviewSeed % 100) < 30) {
      // 30% de chance de ser exatamente 5.0 para produtos prioritários
      rawRating = 5.0;
    }
    
    // Garantir que sempre fique entre 4.5 e 5.0
    rating = Math.max(4.5, Math.min(5.0, rawRating));
    rating = Math.round(rating * 10) / 10; // Arredondar para 1 decimal
    
    // Data com distribuição mais natural (mais reviews recentes)
    // Distribuição exponencial: mais reviews nos últimos meses
    const randomFactor = (reviewSeed % 100) / 100; // 0 a 1
    const monthsAgo = Math.floor(Math.pow(randomFactor, 1.5) * 24); // 0 a 24 meses (mais concentrado nos primeiros)
    const date = new Date();
    date.setMonth(date.getMonth() - monthsAgo);
    
    // Adicionar variação de dias para mais naturalidade
    const daysVariation = (reviewSeed % 30) - 15; // ±15 dias
    date.setDate(date.getDate() + daysVariation);
    
    reviews.push({
      '@type': 'Review',
      author: {
        '@type': 'Organization',
        name: uniqueName,
      },
      datePublished: date.toISOString().split('T')[0],
      reviewBody: reviewBody,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: rating,
        bestRating: 5,
        worstRating: 1,
      },
    });
  }
  
  return reviews;
}

/**
 * Gera aggregate rating baseado nos reviews
 */
export function generateAggregateRating(reviews: Review[]): AggregateRating {
  const totalRating = reviews.reduce((sum, review) => sum + review.reviewRating.ratingValue, 0);
  const averageRating = Math.round((totalRating / reviews.length) * 10) / 10;
  
  return {
    '@type': 'AggregateRating',
    ratingValue: averageRating,
    reviewCount: reviews.length,
    bestRating: 5,
    worstRating: 1,
  };
}

/**
 * Flag para controlar se reviews estão ativos
 * Mudar para false quando tiver sistema real de reviews
 */
export const PRODUCT_REVIEWS_ENABLED = true;

/**
 * Flag para controlar se reviews aparecem no frontend
 * SEMPRE false até ter sistema real implementado!
 */
export const SHOW_REVIEWS_IN_FRONTEND = false;

