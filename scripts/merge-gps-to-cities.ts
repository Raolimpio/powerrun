/**
 * 🔄 MERGE GPS COORDINATES TO cities-static-max.ts
 * 
 * Atualiza automaticamente o arquivo cities-static-max.ts
 * com as coordenadas GPS do cities-with-gps.json
 * 
 * Uso:
 * npm run merge:gps
 */

import fs from 'fs';
import path from 'path';

const GPS_FILE = path.join(__dirname, '../data/cities-with-gps.json');
const CITIES_FILE = path.join(__dirname, '../data/cities-static-max.ts');
const BACKUP_FILE = path.join(__dirname, '../data/cities-static-max.backup.ts');

interface CityWithGPS {
  name: string;
  stateCode: string;
  countryCode: string;
  latitude?: number;
  longitude?: number;
}

function main() {
  console.log('\n🔄 ATUALIZANDO cities-static-max.ts COM COORDENADAS GPS\n');

  // 1. Verificar se arquivo GPS existe
  if (!fs.existsSync(GPS_FILE)) {
    console.error('❌ Arquivo cities-with-gps.json não encontrado!');
    console.log('   Execute primeiro: npm run add:gps\n');
    process.exit(1);
  }

  // 2. Carregar coordenadas
  const citiesWithGPS: CityWithGPS[] = JSON.parse(fs.readFileSync(GPS_FILE, 'utf-8'));
  console.log(`✅ ${citiesWithGPS.length} cidades carregadas\n`);

  // Criar mapa de coordenadas
  const gpsMap = new Map<string, { lat: number; lon: number }>();
  
  let withGPS = 0;
  citiesWithGPS.forEach(city => {
    if (city.latitude && city.longitude) {
      const key = `${city.name}|${city.stateCode}|${city.countryCode}`;
      gpsMap.set(key, { lat: city.latitude, lon: city.longitude });
      withGPS++;
    }
  });

  console.log(`📊 ESTATÍSTICAS:`);
  console.log(`   Total: ${citiesWithGPS.length}`);
  console.log(`   Com GPS: ${withGPS} (${(withGPS / citiesWithGPS.length * 100).toFixed(1)}%)`);
  console.log(`   Sem GPS: ${citiesWithGPS.length - withGPS}\n`);

  // 3. Backup do arquivo original
  console.log('💾 Criando backup...');
  fs.copyFileSync(CITIES_FILE, BACKUP_FILE);
  console.log(`   ✅ Backup salvo: ${BACKUP_FILE}\n`);

  // 4. Ler arquivo TypeScript
  let content = fs.readFileSync(CITIES_FILE, 'utf-8');

  // 5. Adicionar coordenadas nas definições de cidades
  let updatedCount = 0;
  let notFoundCount = 0;

  // Regex para encontrar objetos de cidade
  // { name: 'São Paulo', state: 'São Paulo', stateCode: 'SP', population: 12300000 },
  const cityRegex = /\{\s*name:\s*'([^']+)',\s*state:\s*'([^']+)',\s*stateCode:\s*'([^']+)',(?:\s*population:\s*(\d+),?)?\s*\}/g;

  content = content.replace(cityRegex, (match, name, state, stateCode, population) => {
    // Tentar encontrar coordenadas (precisa deduzir o countryCode pela seção do arquivo)
    let found = false;
    let coords = null;

    // Tentar com BR primeiro, depois US, depois outros
    for (const countryCode of ['BR', 'US', 'MX', 'AR', 'CO', 'CL', 'PE', 'VE', 'EC', 'BO']) {
      const key = `${name}|${stateCode}|${countryCode}`;
      if (gpsMap.has(key)) {
        coords = gpsMap.get(key)!;
        found = true;
        break;
      }
    }

    if (found && coords) {
      updatedCount++;
      const lat = coords.lat.toFixed(6);
      const lon = coords.lon.toFixed(6);
      
      if (population) {
        return `{ name: '${name}', state: '${state}', stateCode: '${stateCode}', population: ${population}, latitude: ${lat}, longitude: ${lon} }`;
      } else {
        return `{ name: '${name}', state: '${state}', stateCode: '${stateCode}', latitude: ${lat}, longitude: ${lon} }`;
      }
    } else {
      notFoundCount++;
      return match; // Manter original
    }
  });

  // 6. Salvar arquivo atualizado
  fs.writeFileSync(CITIES_FILE, content);

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('✅ ARQUIVO ATUALIZADO COM SUCESSO!');
  console.log('═══════════════════════════════════════════════════════════════\n');
  console.log(`📊 RESULTADO:`);
  console.log(`   Cidades atualizadas: ${updatedCount}`);
  console.log(`   Coordenadas não encontradas: ${notFoundCount}`);
  console.log(`   Taxa de sucesso: ${(updatedCount / (updatedCount + notFoundCount) * 100).toFixed(1)}%\n`);
  console.log(`💾 Arquivo: ${CITIES_FILE}`);
  console.log(`💾 Backup: ${BACKUP_FILE}\n`);
  console.log('🎯 PRÓXIMOS PASSOS:');
  console.log('   1. Verificar o arquivo atualizado');
  console.log('   2. npm run build (para testar localmente)');
  console.log('   3. git add .');
  console.log('   4. git commit -m "feat: adiciona GPS para SEO proximidade"');
  console.log('   5. git push');
  console.log('   6. Vercel vai fazer deploy automaticamente! 🚀\n');
}

main();

