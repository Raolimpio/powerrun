/**
 * 🌍 SCRIPT PARA ADICIONAR COORDENADAS GPS ÀS CIDADES
 * 
 * Usa OpenStreetMap Nominatim API (gratuita, sem necessidade de API key)
 * 
 * Funciona para TODOS os países:
 * - Brasil (500 cidades)
 * - EUA (1000 cidades)
 * - México, Argentina, Colômbia, Chile, Peru, Venezuela, Equador, Bolívia
 * 
 * Total: ~2700 cidades
 * 
 * Rate limit: 1 requisição/segundo (respeitado automaticamente)
 * 
 * Uso:
 * npm run add:gps
 * ou
 * npx tsx scripts/add-gps-coordinates.ts
 */

import fs from 'fs';
import path from 'path';

// =============================================================================
// CONFIGURAÇÕES
// =============================================================================

const NOMINATIM_API = 'https://nominatim.openstreetmap.org/search';
const USER_AGENT = 'PowerRunApp/1.0 (contact@powerrun.com.br)'; // Obrigatório pela política do Nominatim
const RATE_LIMIT_DELAY = 1100; // 1.1 segundos entre requisições (respeitando política de 1 req/s)
const CACHE_FILE = path.join(__dirname, '../data/gps-cache.json');
const OUTPUT_FILE = path.join(__dirname, '../data/cities-with-gps.json');

// =============================================================================
// TIPOS
// =============================================================================

interface CityInput {
  name: string;
  state: string;
  stateCode: string;
  country: string;
  countryCode: string;
  population?: number;
}

interface CityWithGPS extends CityInput {
  latitude?: number;
  longitude?: number;
}

interface GPSCache {
  [key: string]: {
    latitude: number;
    longitude: number;
    timestamp: number;
  };
}

interface NominatimResponse {
  lat: string;
  lon: string;
  display_name: string;
}

// =============================================================================
// CACHE PARA EVITAR REQUISIÇÕES REPETIDAS
// =============================================================================

let gpsCache: GPSCache = {};

function loadCache(): void {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = fs.readFileSync(CACHE_FILE, 'utf-8');
      gpsCache = JSON.parse(data);
      console.log(`✅ Cache carregado: ${Object.keys(gpsCache).length} cidades`);
    }
  } catch (error) {
    console.warn('⚠️  Erro ao carregar cache, iniciando novo cache');
    gpsCache = {};
  }
}

function saveCache(): void {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(gpsCache, null, 2));
    console.log(`💾 Cache salvo: ${Object.keys(gpsCache).length} cidades`);
  } catch (error) {
    console.error('❌ Erro ao salvar cache:', error);
  }
}

function getCacheKey(city: CityInput): string {
  return `${city.name}|${city.stateCode}|${city.countryCode}`;
}

// =============================================================================
// BUSCAR COORDENADAS GPS
// =============================================================================

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchGPSCoordinates(city: CityInput): Promise<{ latitude: number; longitude: number } | null> {
  const cacheKey = getCacheKey(city);
  
  // Verificar cache primeiro
  if (gpsCache[cacheKey]) {
    const cached = gpsCache[cacheKey];
    // Cache válido por 90 dias
    if (Date.now() - cached.timestamp < 90 * 24 * 60 * 60 * 1000) {
      return { latitude: cached.latitude, longitude: cached.longitude };
    }
  }

  try {
    // Construir query para Nominatim
    const query = `${city.name}, ${city.state}, ${city.country}`;
    const url = new URL(NOMINATIM_API);
    url.searchParams.append('q', query);
    url.searchParams.append('format', 'json');
    url.searchParams.append('limit', '1');
    url.searchParams.append('countrycodes', city.countryCode.toLowerCase());

    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept-Language': city.countryCode === 'BR' ? 'pt-BR' : city.countryCode === 'US' ? 'en' : 'es',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as NominatimResponse[];

    if (data && data.length > 0) {
      const latitude = parseFloat(data[0].lat);
      const longitude = parseFloat(data[0].lon);

      // Salvar no cache
      gpsCache[cacheKey] = {
        latitude,
        longitude,
        timestamp: Date.now(),
      };

      return { latitude, longitude };
    }

    return null;
  } catch (error) {
    console.error(`❌ Erro ao buscar GPS para ${city.name}:`, error);
    return null;
  }
}

// =============================================================================
// PROCESSAR TODAS AS CIDADES
// =============================================================================

async function processCity(city: CityInput, index: number, total: number): Promise<CityWithGPS> {
  const progressPercent = ((index + 1) / total * 100).toFixed(1);
  
  console.log(`\n[${index + 1}/${total}] ${progressPercent}% - Processando: ${city.name}, ${city.stateCode} (${city.countryCode})`);

  const gps = await fetchGPSCoordinates(city);

  if (gps) {
    console.log(`  ✅ GPS encontrado: ${gps.latitude.toFixed(4)}, ${gps.longitude.toFixed(4)}`);
    return { ...city, latitude: gps.latitude, longitude: gps.longitude };
  } else {
    console.log(`  ⚠️  GPS não encontrado`);
    return city;
  }
}

async function processCitiesBatch(cities: CityInput[]): Promise<CityWithGPS[]> {
  const results: CityWithGPS[] = [];
  const total = cities.length;
  
  console.log(`\n🌍 Processando ${total} cidades...\n`);

  for (let i = 0; i < cities.length; i++) {
    const cityWithGPS = await processCity(cities[i], i, total);
    results.push(cityWithGPS);

    // Salvar cache a cada 50 cidades
    if ((i + 1) % 50 === 0) {
      saveCache();
      console.log(`\n💾 Progresso salvo (${i + 1}/${total})\n`);
    }

    // Respeitar rate limit (1 req/s)
    if (i < cities.length - 1) {
      await sleep(RATE_LIMIT_DELAY);
    }
  }

  return results;
}

// =============================================================================
// CARREGAR CIDADES DO ARQUIVO
// =============================================================================

function loadCitiesFromFile(): CityInput[] {
  const citiesFilePath = path.join(__dirname, '../data/cities-static-max.ts');
  
  if (!fs.existsSync(citiesFilePath)) {
    throw new Error(`Arquivo de cidades não encontrado: ${citiesFilePath}`);
  }

  // Para este script, vamos extrair as cidades do arquivo TypeScript
  // Em produção, você pode importar diretamente se usar um bundler
  
  console.log('⚠️  ATENÇÃO: Este script precisa que você exporte as cidades em JSON primeiro.');
  console.log('Por favor, execute: npm run export:cities:json');
  console.log('Ou forneça um arquivo cities-input.json na pasta data/');
  
  // Verificar se existe arquivo JSON de entrada
  const jsonInputPath = path.join(__dirname, '../data/cities-input.json');
  if (fs.existsSync(jsonInputPath)) {
    const data = fs.readFileSync(jsonInputPath, 'utf-8');
    const cities = JSON.parse(data) as CityInput[];
    console.log(`✅ ${cities.length} cidades carregadas do arquivo JSON`);
    return cities;
  }

  throw new Error('Arquivo cities-input.json não encontrado em data/');
}

// =============================================================================
// EXPORTAR CIDADES PARA JSON (HELPER)
// =============================================================================

function exportCitiesHelper(): void {
  console.log('\n📋 COMO EXPORTAR AS CIDADES PARA JSON:\n');
  console.log('1. Abra o arquivo data/cities-static-max.ts');
  console.log('2. No final do arquivo, adicione:');
  console.log('');
  console.log('   export const CITIES_FOR_GPS = ALL_CITIES_MAX.map(city => ({');
  console.log('     name: city.name,');
  console.log('     state: city.state,');
  console.log('     stateCode: city.stateCode,');
  console.log('     country: city.country,');
  console.log('     countryCode: city.countryCode,');
  console.log('     population: city.population,');
  console.log('   }));');
  console.log('');
  console.log('3. Depois crie um script temporário para exportar:');
  console.log('');
  console.log('   import { CITIES_FOR_GPS } from "./data/cities-static-max";');
  console.log('   import fs from "fs";');
  console.log('   fs.writeFileSync("data/cities-input.json", JSON.stringify(CITIES_FOR_GPS, null, 2));');
  console.log('');
}

// =============================================================================
// FUNÇÃO PRINCIPAL
// =============================================================================

async function main() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🌍 ADICIONANDO COORDENADAS GPS ÀS CIDADES - POWER RUN');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  // Carregar cache existente
  loadCache();

  try {
    // Carregar cidades
    const cities = loadCitiesFromFile();

    console.log(`\n📊 ESTATÍSTICAS:`);
    console.log(`   Total de cidades: ${cities.length}`);
    
    const citiesWithCache = cities.filter(city => gpsCache[getCacheKey(city)]);
    console.log(`   Já em cache: ${citiesWithCache.length}`);
    console.log(`   A processar: ${cities.length - citiesWithCache.length}`);
    
    const estimatedTime = Math.ceil((cities.length - citiesWithCache.length) * RATE_LIMIT_DELAY / 1000 / 60);
    console.log(`   Tempo estimado: ~${estimatedTime} minutos`);
    console.log('');

    // Confirmar
    console.log('⏳ Iniciando em 3 segundos... (Ctrl+C para cancelar)');
    await sleep(3000);

    // Processar cidades
    const citiesWithGPS = await processCitiesBatch(cities);

    // Salvar cache final
    saveCache();

    // Salvar resultado
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(citiesWithGPS, null, 2));
    
    // Estatísticas finais
    const withGPS = citiesWithGPS.filter(c => c.latitude && c.longitude);
    const withoutGPS = citiesWithGPS.filter(c => !c.latitude || !c.longitude);

    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('✅ PROCESSAMENTO CONCLUÍDO!');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('');
    console.log(`📊 RESULTADO FINAL:`);
    console.log(`   Total processado: ${citiesWithGPS.length}`);
    console.log(`   Com GPS: ${withGPS.length} (${(withGPS.length / citiesWithGPS.length * 100).toFixed(1)}%)`);
    console.log(`   Sem GPS: ${withoutGPS.length} (${(withoutGPS.length / citiesWithGPS.length * 100).toFixed(1)}%)`);
    console.log('');
    console.log(`💾 Arquivo salvo: ${OUTPUT_FILE}`);
    console.log(`💾 Cache salvo: ${CACHE_FILE}`);
    console.log('');
    console.log('🎯 PRÓXIMOS PASSOS:');
    console.log('   1. Copie os dados de cities-with-gps.json');
    console.log('   2. Atualize data/cities-static-max.ts com as coordenadas');
    console.log('   3. Execute npm run build para regenerar');
    console.log('');

  } catch (error) {
    if (error instanceof Error && error.message.includes('cities-input.json não encontrado')) {
      exportCitiesHelper();
    } else {
      console.error('❌ Erro:', error);
    }
    
    // Salvar cache mesmo em caso de erro
    saveCache();
    process.exit(1);
  }
}

// Executar
main().catch(console.error);

