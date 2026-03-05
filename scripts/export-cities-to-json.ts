/**
 * 🔄 EXPORTAR CIDADES PARA JSON
 * 
 * Script auxiliar para exportar as cidades do arquivo TypeScript
 * para JSON, facilitando o processamento pelo script de GPS.
 * 
 * Uso:
 * npx tsx scripts/export-cities-to-json.ts
 */

import fs from 'fs';
import path from 'path';
import { ALL_CITIES_MAX } from '../data/cities-static-max';

const OUTPUT_FILE = path.join(__dirname, '../data/cities-input.json');

function main() {
  console.log('\n🔄 Exportando cidades para JSON...\n');

  // Extrair apenas os campos necessários
  const citiesForExport = ALL_CITIES_MAX.map(city => ({
    name: city.name,
    state: city.state,
    stateCode: city.stateCode,
    country: city.country,
    countryCode: city.countryCode,
    population: city.population,
    // Manter latitude/longitude se já existir
    ...(city.latitude && { latitude: city.latitude }),
    ...(city.longitude && { longitude: city.longitude }),
  }));

  // Salvar arquivo
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(citiesForExport, null, 2));

  console.log(`✅ ${citiesForExport.length} cidades exportadas para: ${OUTPUT_FILE}\n`);
  
  // Estatísticas
  const withGPS = citiesForExport.filter(c => c.latitude && c.longitude);
  console.log(`📊 ESTATÍSTICAS:`);
  console.log(`   Total: ${citiesForExport.length}`);
  console.log(`   Com GPS: ${withGPS.length} (${(withGPS.length / citiesForExport.length * 100).toFixed(1)}%)`);
  console.log(`   Sem GPS: ${citiesForExport.length - withGPS.length} (${((citiesForExport.length - withGPS.length) / citiesForExport.length * 100).toFixed(1)}%)`);
  console.log('');
  console.log('🎯 Próximo passo: npm run add:gps\n');
}

main();

