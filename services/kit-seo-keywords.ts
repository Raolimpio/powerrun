/**
 * Keywords específicas para páginas SEO de KITS (Red Line / Blue Line)
 * focadas em condomínios e ambientes similares, em múltiplos idiomas.
 *
 * Obs.: aqui não usamos nenhum dado de produto/banco de dados, apenas
 * variações textuais de palavras‑chave para SEO.
 */

export type KitLineType = 'red' | 'blue';
export type KitSEOLocale = 'pt-BR' | 'en' | 'es';

/**
 * Retorna uma lista de palavras‑chave base para um tipo de kit e idioma.
 * Essas keywords serão convertidas em slug na camada de página.
 */
export function getKitKeywords(line: KitLineType, locale: KitSEOLocale): string[] {
  if (locale === 'en') {
    if (line === 'red') {
      return [
        // Condo gym / fitness room
        'condominium gym project',
        'condominium fitness room equipment',
        'gym equipment for condos',
        'compact gym for residential buildings',
        'condo gym layout',
        'small condo gym design',
        'complete condo gym setup',

        // Kits / packages
        'gym equipment package for condominiums',
        'condominium gym kit',
        'cardio and strength kit for condo gyms',

        // Manufacturer / supplier for condos
        'commercial gym equipment for condos',
        'professional gym equipment for condos',
        'gym equipment manufacturer for condominiums',
        'gym equipment supplier for residential buildings',
        'fitness equipment for apartment buildings',
        'gym equipment for hotel and condominium gyms',
      ];
    }

    return [
      'premium condominium gym',
      'luxury condo fitness center',
      'high end gym equipment for condos',
      'condominium gym with cardio and strength',
      'condo fitness room design',
      'luxury fitness room for condominiums',
      'premium gym equipment package for condos',
    ];
  }

  if (locale === 'es') {
    if (line === 'red') {
      return [
        // Gimnasio en condominio
        'gimnasio para condominio',
        'gimnasio profesional para condominio',
        'gimnasio compacto para edificios residenciales',
        'gimnasio para edificio de apartamentos',
        'sala fitness condominio',

        // Kits / paquetes
        'kit de gimnasio para condominio',
        'kit de equipos para gimnasio de condominio',
        'paquete de equipos de gimnasio para condominios',

        // Equipos para condominio
        'equipos de gimnasio para condominios',
        'equipo de gimnasio para condominio',
        'equipos de cardio y musculacion para condominio',

        // Fabricante / proveedor
        'fabricante de equipos de gimnasio para condominios',
        'proveedor de equipos de gimnasio para condominio',
        'equipos de gimnasio comerciales para condominios',
      ];
    }

    return [
      'gimnasio premium para condominio',
      'centro fitness de lujo en condominio',
      'equipos de gimnasio de alta gama para condominios',
      'gimnasio condominio cardio y musculacion',
      'diseno gimnasio condominio',
      'paquete premium de gimnasio para condominio',
    ];
  }

  // pt-BR (padrão)
  if (line === 'red') {
    return [
      // Foco direto em academia de condomínio
      'academia de condomínio',
      'academia de condomínio pequena',
      'academia de condomínio completa',
      'academia profissional para condomínio',
      'academia de condomínio com esteiras e musculação',
      'academia para síndico equipar condomínio',
      'academia para construtora entregar equipada',

      // Sala fitness / espaço fitness
      'sala fitness em condomínio',
      'sala fitness de luxo para condomínio',
      'espaço fitness para condomínio',

      // Kits de academia para condomínio
      'kit academia para condomínio',
      'kit academia completa para condomínio',
      'kit de equipamentos para academia de condomínio',
      'kit de equipamentos profissionais para academia de condomínio',

      // Equipamentos para academia de condomínio
      'equipamentos para academia de condomínio',
      'equipamento para academia de condomínio',
      'equipamento musculação condomínio',
      'aparelho musculação condomínio',
      'equipamentos para academia de prédio',
      'equipamento para montar academia em condomínio',

      // Esteiras para condomínio
      'esteira para condomínio',
      'esteira para academia de condomínio',

      // Bicicletas para condomínio
      'bicicleta para academia de condomínio',
      'bicicleta spinning para condomínio',

      // Elípticos para condomínio
      'elíptico para condomínio',
      'elíptico para academia de condomínio',

      // Escadas / simuladores para condomínio
      'escada para academia de condomínio',
      'simulador de escada para condomínio',
      'simulador escada para condomínio',

      // Fabricantes / empresa de equipamentos
      'fabricante de equipamentos para academia',
      'fabricante de equipamentos profissionais para academia',
      'fabricante de esteiras',
      'fabricante de esteira profissional',
      'fabricante de bicicletas ergométricas',
      'fabricante de bikes spinning',
      'fabricante de elípticos',
      'fabricante simulador de escada',
      'fabricante de escadas ergométricas',
      'fabricante de máquinas de academia',
      'fabricante de equipamentos de academia',
      'fabricante de aparelhos de academia',
      'empresa que fabrica máquinas de academia',
      'empresa que vende máquinas de academia',

      // Projetos de academia em condomínio
      'projeto de academia em condomínio',
      'projeto de academia de condomínio para construtora',
      'projeto academia condomínio alto padrão',
    ];
  }

  return [
    'academia premium em condomínio',
    'academia de alto padrão para condomínio',
    'projeto academia condomínio alto padrão',
    'academia de condomínio com esteiras e musculação',
    'sala fitness de luxo para condomínio',
  ];
}
