/**
 * 🌎 Serviço de Cidades Internacionais
 * 
 * Suporta múltiplos países:
 * - Brasil (pt-BR)
 * - Estados Unidos (en)
 * - México (es)
 * - Argentina (es)
 * - Colômbia (es)
 * - Chile (es)
 */

export interface InternationalCity {
  id: string;
  name: string;
  slug: string;
  state: string;
  stateCode: string;
  country: string;
  countryCode: 'BR' | 'US' | 'MX' | 'AR' | 'CO' | 'CL';
  locale: 'pt-BR' | 'en' | 'es';
  fullName: string;
  latitude?: number;
  longitude?: number;
}

// Cache por país
const citiesCache: Record<string, InternationalCity[]> = {};
const lastFetchTime: Record<string, number> = {};
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 horas

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

/**
 * Busca cidades do Brasil (API IBGE)
 */
async function fetchBrazilianCities(): Promise<InternationalCity[]> {
  const API_IBGE = 'https://servicodados.ibge.gov.br/api/v1/localidades/municipios';
  
  try {
    const response = await fetch(API_IBGE);
    if (!response.ok) throw new Error(`IBGE API error: ${response.statusText}`);

    const data = await response.json();

    return data
      .filter((city: any) => city?.nome && city?.microrregiao?.mesorregiao?.UF)
      .map((city: any) => ({
        id: `br-${city.id}`,
        name: city.nome,
        slug: slugify(`${city.nome}-${city.microrregiao.mesorregiao.UF.sigla}-brasil`),
        state: city.microrregiao.mesorregiao.UF.nome,
        stateCode: city.microrregiao.mesorregiao.UF.sigla,
        country: 'Brasil',
        countryCode: 'BR' as const,
        locale: 'pt-BR' as const,
        fullName: `${city.nome} - ${city.microrregiao.mesorregiao.UF.sigla}, Brasil`,
      }));
  } catch (error) {
    console.error('Erro ao buscar cidades do Brasil:', error);
    return [];
  }
}

/**
 * Busca cidades dos Estados Unidos
 * Usando API gratuita: https://github.com/dr5hn/countries-states-cities-database
 */
async function fetchUSCities(): Promise<InternationalCity[]> {
  // Cidades principais dos EUA (você pode expandir ou usar uma API)
  const majorUSCities = [
    { name: 'New York', state: 'New York', code: 'NY' },
    { name: 'Los Angeles', state: 'California', code: 'CA' },
    { name: 'Chicago', state: 'Illinois', code: 'IL' },
    { name: 'Houston', state: 'Texas', code: 'TX' },
    { name: 'Phoenix', state: 'Arizona', code: 'AZ' },
    { name: 'Philadelphia', state: 'Pennsylvania', code: 'PA' },
    { name: 'San Antonio', state: 'Texas', code: 'TX' },
    { name: 'San Diego', state: 'California', code: 'CA' },
    { name: 'Dallas', state: 'Texas', code: 'TX' },
    { name: 'San Jose', state: 'California', code: 'CA' },
    { name: 'Austin', state: 'Texas', code: 'TX' },
    { name: 'Jacksonville', state: 'Florida', code: 'FL' },
    { name: 'Fort Worth', state: 'Texas', code: 'TX' },
    { name: 'Columbus', state: 'Ohio', code: 'OH' },
    { name: 'San Francisco', state: 'California', code: 'CA' },
    { name: 'Charlotte', state: 'North Carolina', code: 'NC' },
    { name: 'Indianapolis', state: 'Indiana', code: 'IN' },
    { name: 'Seattle', state: 'Washington', code: 'WA' },
    { name: 'Denver', state: 'Colorado', code: 'CO' },
    { name: 'Boston', state: 'Massachusetts', code: 'MA' },
    { name: 'Miami', state: 'Florida', code: 'FL' },
    { name: 'Las Vegas', state: 'Nevada', code: 'NV' },
    { name: 'Portland', state: 'Oregon', code: 'OR' },
    { name: 'Nashville', state: 'Tennessee', code: 'TN' },
    { name: 'Atlanta', state: 'Georgia', code: 'GA' },
  ];

  return majorUSCities.map((city, index) => ({
    id: `us-${index + 1}`,
    name: city.name,
    slug: slugify(`${city.name}-${city.code}-usa`),
    state: city.state,
    stateCode: city.code,
    country: 'United States',
    countryCode: 'US' as const,
    locale: 'en' as const,
    fullName: `${city.name}, ${city.code}, USA`,
  }));
}

/**
 * Busca cidades do México
 */
async function fetchMexicoCities(): Promise<InternationalCity[]> {
  const majorMexicoCities = [
    { name: 'Ciudad de México', state: 'Ciudad de México', code: 'CDMX' },
    { name: 'Guadalajara', state: 'Jalisco', code: 'JAL' },
    { name: 'Monterrey', state: 'Nuevo León', code: 'NL' },
    { name: 'Puebla', state: 'Puebla', code: 'PUE' },
    { name: 'Tijuana', state: 'Baja California', code: 'BC' },
    { name: 'León', state: 'Guanajuato', code: 'GTO' },
    { name: 'Juárez', state: 'Chihuahua', code: 'CHH' },
    { name: 'Zapopan', state: 'Jalisco', code: 'JAL' },
    { name: 'Mérida', state: 'Yucatán', code: 'YUC' },
    { name: 'Cancún', state: 'Quintana Roo', code: 'QR' },
    { name: 'Aguascalientes', state: 'Aguascalientes', code: 'AGS' },
    { name: 'Querétaro', state: 'Querétaro', code: 'QRO' },
    { name: 'Hermosillo', state: 'Sonora', code: 'SON' },
    { name: 'Saltillo', state: 'Coahuila', code: 'COAH' },
    { name: 'Mexicali', state: 'Baja California', code: 'BC' },
  ];

  return majorMexicoCities.map((city, index) => ({
    id: `mx-${index + 1}`,
    name: city.name,
    slug: slugify(`${city.name}-${city.code}-mexico`),
    state: city.state,
    stateCode: city.code,
    country: 'México',
    countryCode: 'MX' as const,
    locale: 'es' as const,
    fullName: `${city.name}, ${city.state}, México`,
  }));
}

/**
 * Busca cidades da Argentina
 */
async function fetchArgentinaCities(): Promise<InternationalCity[]> {
  const majorArgentinaCities = [
    { name: 'Buenos Aires', state: 'Buenos Aires', code: 'BA' },
    { name: 'Córdoba', state: 'Córdoba', code: 'CBA' },
    { name: 'Rosario', state: 'Santa Fe', code: 'SF' },
    { name: 'Mendoza', state: 'Mendoza', code: 'MZA' },
    { name: 'La Plata', state: 'Buenos Aires', code: 'BA' },
    { name: 'San Miguel de Tucumán', state: 'Tucumán', code: 'TUC' },
    { name: 'Mar del Plata', state: 'Buenos Aires', code: 'BA' },
    { name: 'Salta', state: 'Salta', code: 'SAL' },
    { name: 'Santa Fe', state: 'Santa Fe', code: 'SF' },
    { name: 'San Juan', state: 'San Juan', code: 'SJ' },
  ];

  return majorArgentinaCities.map((city, index) => ({
    id: `ar-${index + 1}`,
    name: city.name,
    slug: slugify(`${city.name}-${city.code}-argentina`),
    state: city.state,
    stateCode: city.code,
    country: 'Argentina',
    countryCode: 'AR' as const,
    locale: 'es' as const,
    fullName: `${city.name}, ${city.state}, Argentina`,
  }));
}

/**
 * Busca cidades da Colômbia
 */
async function fetchColombiaCities(): Promise<InternationalCity[]> {
  const majorColombiaCities = [
    { name: 'Bogotá', state: 'Cundinamarca', code: 'DC' },
    { name: 'Medellín', state: 'Antioquia', code: 'ANT' },
    { name: 'Cali', state: 'Valle del Cauca', code: 'VAC' },
    { name: 'Barranquilla', state: 'Atlántico', code: 'ATL' },
    { name: 'Cartagena', state: 'Bolívar', code: 'BOL' },
    { name: 'Cúcuta', state: 'Norte de Santander', code: 'NSA' },
    { name: 'Bucaramanga', state: 'Santander', code: 'SAN' },
    { name: 'Pereira', state: 'Risaralda', code: 'RIS' },
    { name: 'Santa Marta', state: 'Magdalena', code: 'MAG' },
    { name: 'Ibagué', state: 'Tolima', code: 'TOL' },
  ];

  return majorColombiaCities.map((city, index) => ({
    id: `co-${index + 1}`,
    name: city.name,
    slug: slugify(`${city.name}-${city.code}-colombia`),
    state: city.state,
    stateCode: city.code,
    country: 'Colombia',
    countryCode: 'CO' as const,
    locale: 'es' as const,
    fullName: `${city.name}, ${city.state}, Colombia`,
  }));
}

/**
 * Busca cidades do Chile
 */
async function fetchChileCities(): Promise<InternationalCity[]> {
  const majorChileCities = [
    { name: 'Santiago', state: 'Región Metropolitana', code: 'RM' },
    { name: 'Valparaíso', state: 'Valparaíso', code: 'VAL' },
    { name: 'Concepción', state: 'Biobío', code: 'BIO' },
    { name: 'La Serena', state: 'Coquimbo', code: 'COQ' },
    { name: 'Antofagasta', state: 'Antofagasta', code: 'ANT' },
    { name: 'Temuco', state: 'La Araucanía', code: 'ARA' },
    { name: 'Rancagua', state: "O'Higgins", code: 'LBO' },
    { name: 'Talca', state: 'Maule', code: 'MAU' },
    { name: 'Arica', state: 'Arica y Parinacota', code: 'AYP' },
    { name: 'Iquique', state: 'Tarapacá', code: 'TAR' },
  ];

  return majorChileCities.map((city, index) => ({
    id: `cl-${index + 1}`,
    name: city.name,
    slug: slugify(`${city.name}-${city.code}-chile`),
    state: city.state,
    stateCode: city.code,
    country: 'Chile',
    countryCode: 'CL' as const,
    locale: 'es' as const,
    fullName: `${city.name}, ${city.state}, Chile`,
  }));
}

/**
 * Busca cidades de um país específico
 */
export async function fetchCitiesByCountry(
  countryCode: 'BR' | 'US' | 'MX' | 'AR' | 'CO' | 'CL'
): Promise<InternationalCity[]> {
  // Verifica cache
  const now = Date.now();
  if (citiesCache[countryCode] && now - lastFetchTime[countryCode] < CACHE_DURATION) {
    return citiesCache[countryCode];
  }

  let cities: InternationalCity[] = [];

  try {
    switch (countryCode) {
      case 'BR':
        cities = await fetchBrazilianCities();
        break;
      case 'US':
        cities = await fetchUSCities();
        break;
      case 'MX':
        cities = await fetchMexicoCities();
        break;
      case 'AR':
        cities = await fetchArgentinaCities();
        break;
      case 'CO':
        cities = await fetchColombiaCities();
        break;
      case 'CL':
        cities = await fetchChileCities();
        break;
    }

    // Atualiza cache
    citiesCache[countryCode] = cities;
    lastFetchTime[countryCode] = now;

    console.log(`[international-cities] ${countryCode}: ${cities.length} cidades carregadas`);

    return cities;
  } catch (error) {
    console.error(`Erro ao buscar cidades de ${countryCode}:`, error);
    return [];
  }
}

/**
 * Busca todas as cidades de todos os países
 */
export async function fetchAllInternationalCities(): Promise<InternationalCity[]> {
  const countries: Array<'BR' | 'US' | 'MX' | 'AR' | 'CO' | 'CL'> = [
    'BR',
    'US',
    'MX',
    'AR',
    'CO',
    'CL',
  ];

  const allCities = await Promise.all(countries.map((country) => fetchCitiesByCountry(country)));

  return allCities.flat();
}

/**
 * Busca cidade por slug
 */
export async function getInternationalCityBySlug(
  slug: string
): Promise<InternationalCity | null> {
  const allCities = await fetchAllInternationalCities();
  return allCities.find((city) => city.slug === slug) || null;
}

/**
 * Busca cidades prioritárias por país
 */
export async function getPriorityCitiesByCountry(
  countryCode: 'BR' | 'US' | 'MX' | 'AR' | 'CO' | 'CL'
): Promise<InternationalCity[]> {
  const cities = await fetchCitiesByCountry(countryCode);

  // Para países com lista fixa, retornar todas
  if (countryCode !== 'BR') {
    return cities;
  }

  // Para Brasil, filtrar cidades prioritárias
  const priorityNames = [
    'São Paulo',
    'Rio de Janeiro',
    'Brasília',
    'Salvador',
    'Fortaleza',
    'Belo Horizonte',
    'Curitiba',
    'Recife',
    'Porto Alegre',
    'Manaus',
    'Belém',
    'Goiânia',
    'Guarulhos',
    'Campinas',
    'Marília',
  ];

  return cities.filter((city) => priorityNames.includes(city.name));
}

/**
 * Estatísticas globais
 */
export async function getInternationalStats() {
  const allCities = await fetchAllInternationalCities();

  const byCountry = allCities.reduce(
    (acc, city) => {
      acc[city.countryCode] = (acc[city.countryCode] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const byLocale = allCities.reduce(
    (acc, city) => {
      acc[city.locale] = (acc[city.locale] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    total: allCities.length,
    byCountry,
    byLocale,
  };
}

