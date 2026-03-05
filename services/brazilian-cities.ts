/**
 * 🌎 Serviço de Cidades Brasileiras
 *
 * Utiliza API do IBGE para obter todas as cidades do Brasil
 * Dados utilizados para geração de páginas de SEO localizadas
 */

export interface BrazilianCity {
  id: number;
  nome: string;
  microrregiao: {
    id: number;
    nome: string;
    mesorregiao: {
      id: number;
      nome: string;
      UF: {
        id: number;
        sigla: string;
        nome: string;
        regiao: {
          id: number;
          sigla: string;
          nome: string;
        };
      };
    };
  };
}

export interface City {
  id: number;
  name: string;
  slug: string;
  state: string;
  stateCode: string;
  region: string;
  fullName: string; // "São Paulo - SP"
}

const IBGE_API = 'https://servicodados.ibge.gov.br/api/v1/localidades/municipios';

// Cache em memória para evitar múltiplas requisições
let citiesCache: City[] | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 horas

/**
 * Normaliza string para slug (remove acentos, espaços, etc)
 */
function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/[^\w-]+/g, '') // Remove caracteres não alfanuméricos
    .replace(/--+/g, '-') // Substitui múltiplos hífens por um único
    .replace(/^-+/, '') // Remove hífen do início
    .replace(/-+$/, ''); // Remove hífen do final
}

/**
 * Busca todas as cidades brasileiras da API do IBGE
 */
export async function fetchBrazilianCities(): Promise<City[]> {
  // Retorna cache se ainda válido
  const now = Date.now();
  if (citiesCache && now - lastFetchTime < CACHE_DURATION) {
    return citiesCache;
  }

  try {
    const response = await fetch(IBGE_API);
    if (!response.ok) {
      throw new Error(`Failed to fetch cities: ${response.statusText}`);
    }

    const data: BrazilianCity[] = await response.json();

    console.log(`[brazilian-cities] Total de cidades recebidas da API: ${data.length}`);

    // Filtrar e mapear apenas cidades com dados válidos
    const cities: City[] = data
      .filter((city) => {
        // Validar que todos os dados necessários existem
        return (
          city &&
          city.id &&
          city.nome &&
          city.microrregiao &&
          city.microrregiao.mesorregiao &&
          city.microrregiao.mesorregiao.UF &&
          city.microrregiao.mesorregiao.UF.sigla &&
          city.microrregiao.mesorregiao.UF.nome &&
          city.microrregiao.mesorregiao.UF.regiao &&
          city.microrregiao.mesorregiao.UF.regiao.nome
        );
      })
      .map((city) => ({
        id: city.id,
        name: city.nome,
        slug: slugify(`${city.nome}-${city.microrregiao.mesorregiao.UF.sigla}`),
        state: city.microrregiao.mesorregiao.UF.nome,
        stateCode: city.microrregiao.mesorregiao.UF.sigla,
        region: city.microrregiao.mesorregiao.UF.regiao.nome,
        fullName: `${city.nome} - ${city.microrregiao.mesorregiao.UF.sigla}`,
      }));

    console.log(`[brazilian-cities] Cidades válidas após filtro: ${cities.length}`);

    // Atualiza cache
    citiesCache = cities;
    lastFetchTime = now;

    return cities;
  } catch (error) {
    console.error('Erro ao buscar cidades brasileiras:', error);
    
    // Fallback: retornar cidades principais se API falhar
    console.warn('Usando cidades de fallback...');
    return getFallbackCities();
  }
}

/**
 * Busca uma cidade específica pelo slug
 */
export async function getCityBySlug(slug: string): Promise<City | null> {
  const cities = await fetchBrazilianCities();
  return cities.find((city) => city.slug === slug) || null;
}

/**
 * Busca cidades por estado
 */
export async function getCitiesByState(stateCode: string): Promise<City[]> {
  const cities = await fetchBrazilianCities();
  return cities.filter((city) => city.stateCode === stateCode);
}

/**
 * Busca cidades prioritárias (capitais + grandes cidades)
 * Útil para pré-renderização estática
 */
export async function getPriorityCities(): Promise<City[]> {
  try {
    const cities = await fetchBrazilianCities();

    // Lista de cidades prioritárias (capitais + grandes cidades)
    const priorityCityNames = [
      'São Paulo',
      'Rio de Janeiro',
      'Brasília',
      'Salvador',
      'Fortaleza',
      'Belo Horizonte',
      'Manaus',
      'Curitiba',
      'Recife',
      'Goiânia',
      'Belém',
      'Porto Alegre',
      'Guarulhos',
      'Campinas',
      'São Luís',
      'São Gonçalo',
      'Maceió',
      'Duque de Caxias',
      'Natal',
      'Teresina',
      'Campo Grande',
      'Nova Iguaçu',
      'São Bernardo do Campo',
      'João Pessoa',
      'Santo André',
      'Osasco',
      'Jaboatão dos Guararapes',
      'Ribeirão Preto',
      'Uberlândia',
      'Sorocaba',
      'Cuiabá',
      'Aracaju',
      'Feira de Santana',
      'Joinville',
      'Juiz de Fora',
      'Londrina',
      'Aparecida de Goiânia',
      'Niterói',
      'Belford Roxo',
      'Ananindeua',
      'Campos dos Goytacazes',
      'Marília',
      'Santos',
      'Bauru',
      'Jundiaí',
      'Piracicaba',
    ];

    return cities.filter((city) => priorityCityNames.includes(city.name));
  } catch (error) {
    console.error('Erro ao buscar cidades prioritárias:', error);
    // Retornar pelo menos as cidades de fallback
    return getFallbackCities();
  }
}

/**
 * Cidades de fallback caso API do IBGE falhe
 */
function getFallbackCities(): City[] {
  return [
    {
      id: 3550308,
      name: 'São Paulo',
      slug: 'sao-paulo-sp',
      state: 'São Paulo',
      stateCode: 'SP',
      region: 'Sudeste',
      fullName: 'São Paulo - SP',
    },
    {
      id: 3304557,
      name: 'Rio de Janeiro',
      slug: 'rio-de-janeiro-rj',
      state: 'Rio de Janeiro',
      stateCode: 'RJ',
      region: 'Sudeste',
      fullName: 'Rio de Janeiro - RJ',
    },
    {
      id: 5300108,
      name: 'Brasília',
      slug: 'brasilia-df',
      state: 'Distrito Federal',
      stateCode: 'DF',
      region: 'Centro-Oeste',
      fullName: 'Brasília - DF',
    },
    {
      id: 3106200,
      name: 'Belo Horizonte',
      slug: 'belo-horizonte-mg',
      state: 'Minas Gerais',
      stateCode: 'MG',
      region: 'Sudeste',
      fullName: 'Belo Horizonte - MG',
    },
    {
      id: 4106902,
      name: 'Curitiba',
      slug: 'curitiba-pr',
      state: 'Paraná',
      stateCode: 'PR',
      region: 'Sul',
      fullName: 'Curitiba - PR',
    },
    {
      id: 3534401,
      name: 'Marília',
      slug: 'marilia-sp',
      state: 'São Paulo',
      stateCode: 'SP',
      region: 'Sudeste',
      fullName: 'Marília - SP',
    },
  ];
}

/**
 * Obtém estatísticas de cidades
 */
export async function getCitiesStats(): Promise<{
  total: number;
  byState: Record<string, number>;
  byRegion: Record<string, number>;
}> {
  const cities = await fetchBrazilianCities();

  const byState: Record<string, number> = {};
  const byRegion: Record<string, number> = {};

  cities.forEach((city) => {
    byState[city.stateCode] = (byState[city.stateCode] || 0) + 1;
    byRegion[city.region] = (byRegion[city.region] || 0) + 1;
  });

  return {
    total: cities.length,
    byState,
    byRegion,
  };
}
