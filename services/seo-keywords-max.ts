/**
 * 🚀 KEYWORDS MODO MÁXIMO - 50+ POR CATEGORIA
 * 
 * Sistema de keywords expandido para o modo máximo
 * Gera 50-60 variações de keywords por categoria de produto
 * 
 * Baseado em:
 * - Pesquisas Google Keyword Planner
 * - Análise de concorrentes
 * - Variações regionais BR + LATAM + EUA
 * - Long-tail keywords comerciais
 * - Intenções de compra específicas
 */

import { Equipment } from '@/types';

export interface MaxSEOKeyword {
  keyword: string;
  slug: string;
  locale: 'pt-BR' | 'en' | 'es';
  searchVolume: 'high' | 'medium' | 'low';
  competition: 'high' | 'medium' | 'low';
  commercialIntent: 'high' | 'medium' | 'low';
  priority: number; // 1-10
}

/**
 * Normaliza string para slug
 */
function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// =============================================================================
// 🇧🇷 KEYWORDS PORTUGUÊS - MODO MÁXIMO
// =============================================================================

export const KEYWORDS_BR_MAX = {
  // ESTEIRAS - 55 keywords
  esteira: [
    'esteira-profissional',
    'esteira-para-academia',
    'esteira-comercial',
    'esteira-ergometrica-profissional',
    'esteira-eletrica-profissional',
    'fabricante-de-esteira',
    'fabricante-de-esteira-profissional',
    'venda-de-esteira-profissional',
    'esteira-para-condominio',
    'esteira-residencial-premium',
    'esteira-para-hotel',
    'onde-comprar-esteira-profissional',
    'empresa-de-esteira',
    'distribuidor-de-esteira',
    'esteira-nacional',
    'esteira-brasileira',
    'esteira-importada',
    'esteira-industrial',
    'esteira-de-corrida-profissional',
    'esteira-ergometrica-comercial',
    'esteira-com-inclinacao',
    'esteira-motorizada-profissional',
    'esteira-atletica',
    'esteira-para-crossfit',
    'esteira-alta-performance',
    'esteira-resistente',
    'esteira-duravel',
    'esteira-silenciosa',
    'esteira-compacta-profissional',
    'esteira-dobravel-profissional',
    'esteira-para-reabilitacao',
    'esteira-fisioterapia',
    'esteira-ortopedica',
    'esteira-200kg',
    'esteira-250kg',
    'esteira-300kg',
    'esteira-grande-porte',
    'esteira-pequeno-porte',
    'esteira-medio-porte',
    'esteira-profissional-barata',
    'esteira-profissional-preco',
    'esteira-profissional-em-oferta',
    'esteira-profissional-promocao',
    'esteira-profissional-desconto',
    'esteira-profissional-parcelada',
    'esteira-profissional-financiamento',
    'esteira-com-garantia',
    'esteira-assistencia-tecnica',
    'esteira-manutencao',
    'pecas-para-esteira',
    'conserto-de-esteira',
    'revisao-de-esteira',
    'esteira-power-run',
    'melhor-esteira-profissional',
    'esteira-mais-vendida',
  ],

  // BICICLETAS - 55 keywords
  bicicleta: [
    'bicicleta-spinning-profissional',
    'bike-spinning-profissional',
    'bicicleta-ergometrica-profissional',
    'bike-ergometrica-profissional',
    'bicicleta-para-academia',
    'bike-para-academia',
    'bicicleta-vertical-profissional',
    'bike-vertical-profissional',
    'bicicleta-horizontal-profissional',
    'bike-horizontal-profissional',
    'fabricante-de-bicicleta-ergometrica',
    'fabricante-de-bike-spinning',
    'venda-de-bicicleta-profissional',
    'bicicleta-comercial',
    'bike-comercial',
    'bicicleta-para-condominio',
    'bike-para-condominio',
    'bicicleta-para-hotel',
    'bike-para-hotel',
    'onde-comprar-bike-spinning',
    'distribuidor-de-bike',
    'bicicleta-nacional',
    'bike-nacional',
    'bicicleta-brasileira',
    'bike-brasileira',
    'bicicleta-importada',
    'bike-importada',
    'bicicleta-spinning-comercial',
    'bike-spinning-comercial',
    'bicicleta-spinning-resistente',
    'bike-spinning-resistente',
    'bicicleta-alta-performance',
    'bike-alta-performance',
    'bicicleta-para-crossfit',
    'bike-para-crossfit',
    'bicicleta-para-spinning-class',
    'bike-para-spinning-class',
    'bicicleta-silenciosa',
    'bike-silenciosa',
    'bicicleta-compacta',
    'bike-compacta',
    'bicicleta-ajustavel',
    'bike-ajustavel',
    'bicicleta-150kg',
    'bike-150kg',
    'bicicleta-200kg',
    'bike-200kg',
    'bicicleta-profissional-barata',
    'bike-profissional-barata',
    'bicicleta-profissional-preco',
    'bike-profissional-preco',
    'bicicleta-com-garantia',
    'bike-com-garantia',
    'pecas-para-bicicleta',
    'pecas-para-bike',
    'manutencao-de-bike',
  ],

  // ELÍPTICOS - 50 keywords
  eliptico: [
    'eliptico-profissional',
    'eliptico-para-academia',
    'eliptico-comercial',
    'fabricante-de-eliptico',
    'venda-de-eliptico',
    'eliptico-para-condominio',
    'eliptico-residencial-premium',
    'eliptico-para-hotel',
    'onde-comprar-eliptico',
    'distribuidor-de-eliptico',
    'eliptico-nacional',
    'eliptico-brasileiro',
    'eliptico-importado',
    'eliptico-ergometrico',
    'eliptico-alta-performance',
    'eliptico-resistente',
    'eliptico-duravel',
    'eliptico-silencioso',
    'eliptico-compacto',
    'eliptico-grande-porte',
    'eliptico-medio-porte',
    'eliptico-pequeno-porte',
    'transport-eliptico',
    'transport-eliptico-profissional',
    'eliptico-crosstrainer',
    'eliptico-para-reabilitacao',
    'eliptico-fisioterapia',
    'eliptico-ortopedico',
    'eliptico-150kg',
    'eliptico-180kg',
    'eliptico-200kg',
    'eliptico-profissional-barato',
    'eliptico-profissional-preco',
    'eliptico-em-oferta',
    'eliptico-promocao',
    'eliptico-desconto',
    'eliptico-parcelado',
    'eliptico-financiamento',
    'eliptico-com-garantia',
    'eliptico-assistencia-tecnica',
    'eliptico-manutencao',
    'pecas-para-eliptico',
    'conserto-de-eliptico',
    'revisao-de-eliptico',
    'eliptico-power-run',
    'melhor-eliptico-profissional',
    'eliptico-mais-vendido',
    'eliptico-para-crossfit',
    'eliptico-cardio',
    'eliptico-fitness',
  ],

  // ESCADAS - 45 keywords
  escada: [
    'escada-ergometrica-profissional',
    'escada-ergometrica-para-academia',
    'escada-ergometrica-comercial',
    'stair-climber-profissional',
    'escada-simulador',
    'fabricante-de-escada-ergometrica',
    'venda-de-escada-ergometrica',
    'escada-para-condominio',
    'escada-para-hotel',
    'onde-comprar-escada-ergometrica',
    'distribuidor-de-escada',
    'escada-nacional',
    'escada-brasileira',
    'escada-importada',
    'escada-alta-performance',
    'escada-resistente',
    'escada-duravel',
    'escada-silenciosa',
    'escada-compacta',
    'escada-grande-porte',
    'escada-para-reabilitacao',
    'escada-fisioterapia',
    'escada-ortopedica',
    'escada-150kg',
    'escada-180kg',
    'escada-200kg',
    'escada-profissional-barata',
    'escada-profissional-preco',
    'escada-em-oferta',
    'escada-promocao',
    'escada-parcelada',
    'escada-financiamento',
    'escada-com-garantia',
    'escada-assistencia-tecnica',
    'escada-manutencao',
    'pecas-para-escada',
    'conserto-de-escada',
    'revisao-de-escada',
    'escada-power-run',
    'melhor-escada-profissional',
    'escada-mais-vendida',
    'escada-para-crossfit',
    'escada-cardio',
    'escada-fitness',
    'simulador-de-escada',
  ],

  // MUSCULAÇÃO - 50 keywords
  musculacao: [
    'equipamento-de-musculacao-profissional',
    'aparelho-de-musculacao-profissional',
    'equipamento-para-academia',
    'aparelho-para-academia',
    'multi-gym-profissional',
    'estacao-de-musculacao',
    'fabricante-de-equipamento-academia',
    'venda-de-equipamento-academia',
    'equipamento-comercial',
    'aparelho-comercial',
    'equipamento-para-condominio',
    'aparelho-para-condominio',
    'equipamento-para-hotel',
    'onde-comprar-equipamento-academia',
    'distribuidor-de-equipamento',
    'equipamento-nacional',
    'equipamento-brasileiro',
    'equipamento-importado',
    'equipamento-alta-qualidade',
    'equipamento-resistente',
    'equipamento-duravel',
    'linha-completa-musculacao',
    'kit-academia-completa',
    'montagem-de-academia',
    'projeto-de-academia',
    'equipamento-crossfit',
    'equipamento-funcional',
    'equipamento-treino-funcional',
    'leg-press-profissional',
    'supino-profissional',
    'cadeira-extensora',
    'cadeira-flexora',
    'puxada-frontal',
    'remada-baixa',
    'crucifixo-profissional',
    'desenvolvimento-profissional',
    'hack-machine',
    'smith-machine',
    'barra-fixa-profissional',
    'paralela-profissional',
    'banco-supino-profissional',
    'rack-agachamento',
    'plataforma-leg-press',
    'equipamento-livre',
    'equipamento-guiado',
    'peso-livre-profissional',
    'halteres-profissionais',
    'anilhas-profissionais',
    'barras-profissionais',
    'acessorios-musculacao',
  ],
};

// =============================================================================
// 🇺🇸 KEYWORDS INGLÊS - MODO MÁXIMO
// =============================================================================

export const KEYWORDS_EN_MAX = {
  // TREADMILLS - 55 keywords
  treadmill: [
    'professional-treadmill',
    'commercial-treadmill',
    'gym-treadmill',
    'fitness-treadmill',
    'treadmill-for-gym',
    'treadmill-for-fitness-center',
    'treadmill-manufacturer',
    'treadmill-supplier',
    'treadmill-distributor',
    'buy-commercial-treadmill',
    'where-to-buy-treadmill',
    'treadmill-for-sale',
    'professional-running-machine',
    'commercial-running-machine',
    'heavy-duty-treadmill',
    'industrial-treadmill',
    'athletic-treadmill',
    'performance-treadmill',
    'high-end-treadmill',
    'premium-treadmill',
    'durable-treadmill',
    'reliable-treadmill',
    'quiet-treadmill',
    'silent-treadmill',
    'motorized-treadmill',
    'electric-treadmill',
    'incline-treadmill',
    'folding-treadmill-commercial',
    'compact-treadmill-commercial',
    'space-saving-treadmill',
    'treadmill-for-hotel',
    'treadmill-for-condo',
    'treadmill-for-apartment',
    'treadmill-for-rehab',
    'medical-treadmill',
    'physical-therapy-treadmill',
    'orthopedic-treadmill',
    'treadmill-300lb-capacity',
    'treadmill-350lb-capacity',
    'treadmill-400lb-capacity',
    'treadmill-500lb-capacity',
    'best-commercial-treadmill',
    'top-rated-treadmill',
    'treadmill-reviews',
    'treadmill-comparison',
    'treadmill-price',
    'affordable-commercial-treadmill',
    'budget-commercial-treadmill',
    'treadmill-financing',
    'treadmill-lease',
    'treadmill-warranty',
    'treadmill-service',
    'treadmill-maintenance',
    'treadmill-repair',
    'treadmill-parts',
  ],

  // BIKES - 55 keywords
  bike: [
    'professional-spin-bike',
    'commercial-spin-bike',
    'gym-spin-bike',
    'fitness-spin-bike',
    'indoor-cycling-bike',
    'studio-cycling-bike',
    'spin-bike-manufacturer',
    'spin-bike-supplier',
    'spin-bike-distributor',
    'buy-commercial-bike',
    'where-to-buy-spin-bike',
    'spin-bike-for-sale',
    'exercise-bike-commercial',
    'stationary-bike-commercial',
    'upright-bike-commercial',
    'recumbent-bike-commercial',
    'vertical-bike-commercial',
    'horizontal-bike-commercial',
    'heavy-duty-spin-bike',
    'heavy-duty-exercise-bike',
    'performance-spin-bike',
    'high-end-spin-bike',
    'premium-spin-bike',
    'durable-spin-bike',
    'reliable-spin-bike',
    'quiet-spin-bike',
    'silent-spin-bike',
    'belt-drive-spin-bike',
    'chain-drive-spin-bike',
    'magnetic-resistance-bike',
    'friction-resistance-bike',
    'spin-bike-for-hotel',
    'spin-bike-for-condo',
    'spin-bike-for-apartment',
    'spin-bike-for-studio',
    'spin-bike-for-gym',
    'spin-bike-300lb-capacity',
    'spin-bike-350lb-capacity',
    'adjustable-spin-bike',
    'fully-adjustable-bike',
    'best-commercial-spin-bike',
    'top-rated-spin-bike',
    'spin-bike-reviews',
    'spin-bike-comparison',
    'spin-bike-price',
    'affordable-commercial-bike',
    'budget-commercial-bike',
    'spin-bike-financing',
    'spin-bike-lease',
    'spin-bike-warranty',
    'spin-bike-service',
    'spin-bike-maintenance',
    'spin-bike-repair',
    'spin-bike-parts',
    'spinning-bike-accessories',
  ],

  // ELLIPTICALS - 50 keywords
  elliptical: [
    'professional-elliptical',
    'commercial-elliptical',
    'gym-elliptical',
    'fitness-elliptical',
    'elliptical-machine-commercial',
    'elliptical-trainer-commercial',
    'elliptical-manufacturer',
    'elliptical-supplier',
    'elliptical-distributor',
    'buy-commercial-elliptical',
    'where-to-buy-elliptical',
    'elliptical-for-sale',
    'cross-trainer-commercial',
    'heavy-duty-elliptical',
    'performance-elliptical',
    'high-end-elliptical',
    'premium-elliptical',
    'durable-elliptical',
    'reliable-elliptical',
    'quiet-elliptical',
    'silent-elliptical',
    'front-drive-elliptical',
    'rear-drive-elliptical',
    'center-drive-elliptical',
    'elliptical-for-hotel',
    'elliptical-for-condo',
    'elliptical-for-apartment',
    'elliptical-for-rehab',
    'medical-elliptical',
    'physical-therapy-elliptical',
    'elliptical-300lb-capacity',
    'elliptical-350lb-capacity',
    'elliptical-400lb-capacity',
    'best-commercial-elliptical',
    'top-rated-elliptical',
    'elliptical-reviews',
    'elliptical-comparison',
    'elliptical-price',
    'affordable-commercial-elliptical',
    'budget-commercial-elliptical',
    'elliptical-financing',
    'elliptical-lease',
    'elliptical-warranty',
    'elliptical-service',
    'elliptical-maintenance',
    'elliptical-repair',
    'elliptical-parts',
    'elliptical-accessories',
    'elliptical-cardio',
    'elliptical-low-impact',
  ],

  // STEPPERS - 45 keywords
  stepper: [
    'professional-stair-stepper',
    'commercial-stair-stepper',
    'gym-stair-stepper',
    'fitness-stair-stepper',
    'stair-climber-commercial',
    'step-machine-commercial',
    'stepper-manufacturer',
    'stepper-supplier',
    'stepper-distributor',
    'buy-commercial-stepper',
    'where-to-buy-stepper',
    'stepper-for-sale',
    'heavy-duty-stepper',
    'performance-stepper',
    'high-end-stepper',
    'premium-stepper',
    'durable-stepper',
    'reliable-stepper',
    'quiet-stepper',
    'silent-stepper',
    'stepper-for-hotel',
    'stepper-for-condo',
    'stepper-for-apartment',
    'stepper-for-rehab',
    'medical-stepper',
    'stepper-300lb-capacity',
    'stepper-350lb-capacity',
    'best-commercial-stepper',
    'top-rated-stepper',
    'stepper-reviews',
    'stepper-comparison',
    'stepper-price',
    'affordable-commercial-stepper',
    'budget-commercial-stepper',
    'stepper-financing',
    'stepper-lease',
    'stepper-warranty',
    'stepper-service',
    'stepper-maintenance',
    'stepper-repair',
    'stepper-parts',
    'stepper-accessories',
    'stair-climbing-machine',
    'vertical-climber',
    'cardio-stepper',
  ],

  // STRENGTH - 50 keywords
  strength: [
    'professional-gym-equipment',
    'commercial-gym-equipment',
    'strength-training-equipment',
    'weight-training-equipment',
    'gym-equipment-manufacturer',
    'gym-equipment-supplier',
    'gym-equipment-distributor',
    'buy-gym-equipment',
    'gym-equipment-for-sale',
    'multi-gym-commercial',
    'home-gym-commercial',
    'cable-machine-commercial',
    'weight-machine-commercial',
    'free-weight-equipment',
    'plate-loaded-equipment',
    'selectorized-equipment',
    'leg-press-commercial',
    'bench-press-commercial',
    'squat-rack-commercial',
    'power-rack-commercial',
    'smith-machine-commercial',
    'cable-crossover',
    'lat-pulldown-commercial',
    'seated-row-commercial',
    'leg-curl-commercial',
    'leg-extension-commercial',
    'chest-press-commercial',
    'shoulder-press-commercial',
    'functional-trainer',
    'cable-station',
    'weight-bench-commercial',
    'adjustable-bench',
    'flat-bench-commercial',
    'incline-bench-commercial',
    'decline-bench-commercial',
    'dumbbell-rack',
    'barbell-rack',
    'weight-plate-storage',
    'gym-flooring',
    'rubber-flooring',
    'complete-gym-package',
    'gym-setup',
    'gym-design',
    'turnkey-gym-solution',
    'best-gym-equipment',
    'gym-equipment-price',
    'gym-equipment-financing',
    'gym-equipment-warranty',
    'gym-equipment-service',
    'gym-equipment-parts',
  ],
};

// =============================================================================
// 🇪🇸 KEYWORDS ESPANHOL - MODO MÁXIMO
// =============================================================================

export const KEYWORDS_ES_MAX = {
  // CAMINADORAS - 55 keywords
  caminadora: [
    'caminadora-profesional',
    'caminadora-comercial',
    'caminadora-para-gimnasio',
    'caminadora-para-gym',
    'cinta-de-correr-profesional',
    'cinta-de-correr-comercial',
    'fabricante-de-caminadora',
    'proveedor-de-caminadora',
    'distribuidor-de-caminadora',
    'comprar-caminadora-profesional',
    'donde-comprar-caminadora',
    'caminadora-en-venta',
    'caminadora-electrica-profesional',
    'caminadora-motorizada',
    'caminadora-industrial',
    'caminadora-resistente',
    'caminadora-duradera',
    'caminadora-silenciosa',
    'caminadora-con-inclinacion',
    'caminadora-plegable-comercial',
    'caminadora-compacta-comercial',
    'caminadora-para-hotel',
    'caminadora-para-condominio',
    'caminadora-para-rehabilitacion',
    'caminadora-medica',
    'caminadora-fisioterapia',
    'caminadora-ortopedica',
    'caminadora-200kg',
    'caminadora-250kg',
    'mejor-caminadora-profesional',
    'caminadora-mas-vendida',
    'caminadora-precio',
    'caminadora-barata',
    'caminadora-en-oferta',
    'caminadora-promocion',
    'caminadora-descuento',
    'caminadora-financiamiento',
    'caminadora-con-garantia',
    'caminadora-servicio-tecnico',
    'caminadora-mantenimiento',
    'caminadora-reparacion',
    'partes-para-caminadora',
    'repuestos-caminadora',
    'caminadora-alta-gama',
    'caminadora-premium',
    'caminadora-crossfit',
    'caminadora-fitness',
    'caminadora-cardio',
    'equipo-cardio-profesional',
    'maquina-correr-profesional',
    'trotadora-profesional',
    'banda-caminadora',
    'treadmill-comercial',
    'running-machine-profesional',
    'equipo-gimnasio-cardio',
  ],

  // BICICLETAS - 55 keywords
  bicicleta: [
    'bicicleta-spinning-profesional',
    'bicicleta-spinning-comercial',
    'bicicleta-para-gimnasio',
    'bicicleta-para-gym',
    'bicicleta-estatica-profesional',
    'bicicleta-ergometrica-profesional',
    'bike-spinning-profesional',
    'bike-spinning-comercial',
    'fabricante-de-bicicleta',
    'proveedor-de-bicicleta',
    'distribuidor-de-bicicleta',
    'comprar-bicicleta-spinning',
    'donde-comprar-bicicleta-spinning',
    'bicicleta-en-venta',
    'bicicleta-vertical-profesional',
    'bicicleta-horizontal-profesional',
    'bicicleta-reclinada-profesional',
    'bicicleta-resistente',
    'bicicleta-duradera',
    'bicicleta-silenciosa',
    'bicicleta-ajustable',
    'bicicleta-spinning-studio',
    'bicicleta-para-hotel',
    'bicicleta-para-condominio',
    'bicicleta-para-apartamento',
    'bicicleta-150kg',
    'bicicleta-200kg',
    'mejor-bicicleta-spinning',
    'bicicleta-mas-vendida',
    'bicicleta-precio',
    'bicicleta-barata',
    'bicicleta-en-oferta',
    'bicicleta-promocion',
    'bicicleta-descuento',
    'bicicleta-financiamiento',
    'bicicleta-con-garantia',
    'bicicleta-servicio-tecnico',
    'bicicleta-mantenimiento',
    'bicicleta-reparacion',
    'partes-para-bicicleta',
    'repuestos-bicicleta',
    'bicicleta-alta-gama',
    'bicicleta-premium',
    'bicicleta-crossfit',
    'bicicleta-fitness',
    'bicicleta-cardio',
    'bicicleta-indoor',
    'bicicleta-ciclo-indoor',
    'spin-bike-profesional',
    'indoor-cycling-profesional',
    'clase-spinning-bicicleta',
    'equipo-spinning',
    'maquina-spinning',
    'bicicleta-freno-magnetico',
    'bicicleta-transmision-correa',
    'bicicleta-transmision-cadena',
  ],

  // ELÍPTICAS - 50 keywords
  eliptica: [
    'eliptica-profesional',
    'eliptica-comercial',
    'eliptica-para-gimnasio',
    'eliptica-para-gym',
    'maquina-eliptica-profesional',
    'cross-trainer-profesional',
    'fabricante-de-eliptica',
    'proveedor-de-eliptica',
    'distribuidor-de-eliptica',
    'comprar-eliptica-profesional',
    'donde-comprar-eliptica',
    'eliptica-en-venta',
    'eliptica-resistente',
    'eliptica-duradera',
    'eliptica-silenciosa',
    'eliptica-para-hotel',
    'eliptica-para-condominio',
    'eliptica-para-rehabilitacion',
    'eliptica-medica',
    'eliptica-fisioterapia',
    'eliptica-150kg',
    'eliptica-180kg',
    'eliptica-200kg',
    'mejor-eliptica-profesional',
    'eliptica-mas-vendida',
    'eliptica-precio',
    'eliptica-barata',
    'eliptica-en-oferta',
    'eliptica-promocion',
    'eliptica-descuento',
    'eliptica-financiamiento',
    'eliptica-con-garantia',
    'eliptica-servicio-tecnico',
    'eliptica-mantenimiento',
    'eliptica-reparacion',
    'partes-para-eliptica',
    'repuestos-eliptica',
    'eliptica-alta-gama',
    'eliptica-premium',
    'eliptica-crossfit',
    'eliptica-fitness',
    'eliptica-cardio',
    'eliptica-bajo-impacto',
    'eliptica-traccion-frontal',
    'eliptica-traccion-trasera',
    'eliptica-traccion-central',
    'transport-eliptico',
    'elliptical-comercial',
    'equipo-cardio-eliptica',
    'maquina-cardio-profesional',
  ],

  // ESCALERAS - 45 keywords
  escalera: [
    'escaladora-profesional',
    'escaladora-comercial',
    'escaladora-para-gimnasio',
    'maquina-escalera-profesional',
    'simulador-escalera-profesional',
    'stair-climber-profesional',
    'fabricante-de-escaladora',
    'proveedor-de-escaladora',
    'distribuidor-de-escaladora',
    'comprar-escaladora-profesional',
    'donde-comprar-escaladora',
    'escaladora-en-venta',
    'escaladora-resistente',
    'escaladora-duradera',
    'escaladora-silenciosa',
    'escaladora-para-hotel',
    'escaladora-para-condominio',
    'escaladora-para-rehabilitacion',
    'escaladora-150kg',
    'escaladora-180kg',
    'escaladora-200kg',
    'mejor-escaladora-profesional',
    'escaladora-mas-vendida',
    'escaladora-precio',
    'escaladora-barata',
    'escaladora-en-oferta',
    'escaladora-promocion',
    'escaladora-financiamiento',
    'escaladora-con-garantia',
    'escaladora-servicio-tecnico',
    'escaladora-mantenimiento',
    'escaladora-reparacion',
    'partes-para-escaladora',
    'repuestos-escaladora',
    'escaladora-alta-gama',
    'escaladora-premium',
    'escaladora-crossfit',
    'escaladora-fitness',
    'escaladora-cardio',
    'escaladora-vertical',
    'step-machine-profesional',
    'stepper-profesional',
    'equipo-cardio-escalera',
    'maquina-subir-escaleras',
    'simulador-subida',
  ],

  // MUSCULACIÓN - 50 keywords
  musculacion: [
    'equipo-gimnasio-profesional',
    'equipo-gimnasio-comercial',
    'maquinas-gimnasio-profesional',
    'aparatos-gimnasio-profesional',
    'equipo-musculacion-profesional',
    'equipo-fuerza-profesional',
    'fabricante-equipo-gimnasio',
    'proveedor-equipo-gimnasio',
    'distribuidor-equipo-gimnasio',
    'comprar-equipo-gimnasio',
    'equipo-gimnasio-en-venta',
    'multi-gym-profesional',
    'estacion-musculacion',
    'equipo-peso-libre',
    'equipo-placas-cargadas',
    'equipo-selectorizaddo',
    'prensa-piernas-profesional',
    'banco-press-profesional',
    'rack-sentadillas-profesional',
    'power-rack-profesional',
    'smith-machine-profesional',
    'crossover-cables',
    'jalon-frontal-profesional',
    'remo-sentado-profesional',
    'curl-piernas-profesional',
    'extension-piernas-profesional',
    'press-pecho-profesional',
    'press-hombros-profesional',
    'entrenador-funcional',
    'estacion-cables',
    'banco-pesas-profesional',
    'banco-ajustable',
    'banco-plano-profesional',
    'banco-inclinado-profesional',
    'rack-mancuernas',
    'rack-barras',
    'almacenamiento-discos',
    'piso-gimnasio',
    'paquete-gimnasio-completo',
    'montaje-gimnasio',
    'diseno-gimnasio',
    'proyecto-gimnasio-completo',
    'mejor-equipo-gimnasio',
    'equipo-gimnasio-precio',
    'equipo-gimnasio-financiamiento',
    'equipo-gimnasio-garantia',
    'equipo-gimnasio-servicio',
    'equipo-gimnasio-partes',
    'equipo-crossfit',
    'equipo-funcional',
  ],
};

// =============================================================================
// 🎯 FUNÇÃO DE GERAÇÃO DE KEYWORDS POR PRODUTO
// =============================================================================

export function getMaxKeywordsByProduct(
  productCategory: string,
  locale: 'pt-BR' | 'en' | 'es'
): MaxSEOKeyword[] {
  let keywords: string[] = [];
  
  // Selecionar keywords baseado na categoria e locale
  if (locale === 'pt-BR') {
    if (productCategory.includes('esteira')) {
      keywords = KEYWORDS_BR_MAX.esteira;
    } else if (productCategory.includes('bicicleta') || productCategory.includes('bike')) {
      keywords = KEYWORDS_BR_MAX.bicicleta;
    } else if (productCategory.includes('eliptico')) {
      keywords = KEYWORDS_BR_MAX.eliptico;
    } else if (productCategory.includes('escada')) {
      keywords = KEYWORDS_BR_MAX.escada;
    } else {
      keywords = KEYWORDS_BR_MAX.musculacao;
    }
  } else if (locale === 'en') {
    if (productCategory.includes('treadmill') || productCategory.includes('esteira')) {
      keywords = KEYWORDS_EN_MAX.treadmill;
    } else if (productCategory.includes('bike') || productCategory.includes('bicicleta')) {
      keywords = KEYWORDS_EN_MAX.bike;
    } else if (productCategory.includes('elliptical') || productCategory.includes('eliptico')) {
      keywords = KEYWORDS_EN_MAX.elliptical;
    } else if (productCategory.includes('stepper') || productCategory.includes('escada')) {
      keywords = KEYWORDS_EN_MAX.stepper;
    } else {
      keywords = KEYWORDS_EN_MAX.strength;
    }
  } else { // es
    if (productCategory.includes('esteira') || productCategory.includes('caminadora')) {
      keywords = KEYWORDS_ES_MAX.caminadora;
    } else if (productCategory.includes('bicicleta') || productCategory.includes('bike')) {
      keywords = KEYWORDS_ES_MAX.bicicleta;
    } else if (productCategory.includes('eliptico') || productCategory.includes('eliptica')) {
      keywords = KEYWORDS_ES_MAX.eliptica;
    } else if (productCategory.includes('escada') || productCategory.includes('escalera')) {
      keywords = KEYWORDS_ES_MAX.escalera;
    } else {
      keywords = KEYWORDS_ES_MAX.musculacion;
    }
  }
  
  // Converter para objetos MaxSEOKeyword
  return keywords.map((keyword, index) => ({
    keyword: keyword.replace(/-/g, ' '),
    slug: keyword,
    locale,
    searchVolume: index < 15 ? 'high' : index < 35 ? 'medium' : 'low',
    competition: index < 10 ? 'high' : index < 30 ? 'medium' : 'low',
    commercialIntent: keyword.includes('comprar') || keyword.includes('buy') || keyword.includes('venda') || keyword.includes('sale') 
      ? 'high' 
      : keyword.includes('preco') || keyword.includes('price') || keyword.includes('barato') || keyword.includes('cheap')
      ? 'medium'
      : 'low',
    priority: Math.max(1, Math.ceil(10 - (index / 5))),
  }));
}

// =============================================================================
// 📊 ESTATÍSTICAS
// =============================================================================

export function getKeywordsStats() {
  const totalBR = Object.values(KEYWORDS_BR_MAX).reduce((sum, arr) => sum + arr.length, 0);
  const totalEN = Object.values(KEYWORDS_EN_MAX).reduce((sum, arr) => sum + arr.length, 0);
  const totalES = Object.values(KEYWORDS_ES_MAX).reduce((sum, arr) => sum + arr.length, 0);
  
  return {
    porIdioma: {
      'pt-BR': totalBR,
      'en': totalEN,
      'es': totalES,
    },
    total: totalBR + totalEN + totalES,
    porCategoria: {
      esteira: KEYWORDS_BR_MAX.esteira.length,
      bicicleta: KEYWORDS_BR_MAX.bicicleta.length,
      eliptico: KEYWORDS_BR_MAX.eliptico.length,
      escada: KEYWORDS_BR_MAX.escada.length,
      musculacao: KEYWORDS_BR_MAX.musculacao.length,
    },
  };
}

// Log de estatísticas
const stats = getKeywordsStats();
console.log('');
console.log('═══════════════════════════════════════════════════════════════════');
console.log('🎯 KEYWORDS MODO MÁXIMO');
console.log('═══════════════════════════════════════════════════════════════════');
console.log('');
console.log(`✅ TOTAL: ${stats.total} keywords`);
console.log('');
console.log('Por Idioma:');
console.log(`   🇧🇷 Português: ${stats.porIdioma['pt-BR']} keywords`);
console.log(`   🇺🇸 Inglês: ${stats.porIdioma['en']} keywords`);
console.log(`   🇪🇸 Espanhol: ${stats.porIdioma['es']} keywords`);
console.log('');
console.log('Por Categoria (PT-BR):');
console.log(`   Esteiras: ${stats.porCategoria.esteira} keywords`);
console.log(`   Bicicletas: ${stats.porCategoria.bicicleta} keywords`);
console.log(`   Elípticos: ${stats.porCategoria.eliptico} keywords`);
console.log(`   Escadas: ${stats.porCategoria.escada} keywords`);
console.log(`   Musculação: ${stats.porCategoria.musculacao} keywords`);
console.log('');
console.log('═══════════════════════════════════════════════════════════════════');
console.log('');

