// App Configuration
export const APP_CONFIG = {
  name: 'Power Run',
  logo: 'https://i.ibb.co/RpD5tcr4/Design-sem-nome-2025-07-18-T171931-883.png',
  version: '1.0.0',
  description: 'Soluções profissionais em equipamentos e tecnologia de alta performance',
  contact: {
    comercial: {
      email: 'vendas@powerrun.com.br',
      whatsapp: '(14) 9 8202-4824',
    },
    posVenda: {
      email: 'contato@powerrun.com.br',
      whatsapp: '(14) 98219-1126',
    },
    suporte: {
      email: 'producao@powerrun.com.br',
      whatsapp: '(14) 98202-4827',
      phone: '(14) 3415-4493',
    },
    pecasReposicao: {
      whatsapp: '(14) 98219-1126',
    },
    address:
      'R. Esmeraldina Pinheiro Barbosa, 360 - Jardim Santa Antonieta, Marília - SP, 17512-320',
    phone: '(14) 3415-4493',
    // Para manter compatibilidade com código existente
    email: 'contato@powerrun.com.br',
  },
};

// API Configuration
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.powerrun.com.br',
  timeout: 10000, // 10 segundos
};

// A i18n agora é gerenciada por next-intl. NAV_TEXTS foi removido.

// Re-export equipment data
export * from './equipment-data';
