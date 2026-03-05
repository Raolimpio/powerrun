/**
 * 🌎 GERA ARQUIVO ESTÁTICO COM TODAS AS CIDADES
 * 
 * Solução PROFISSIONAL:
 * - Busca APIs UMA VEZ
 * - Salva JSON estático
 * - Código usa JSON (rápido, sem dependência)
 * 
 * Execute: node scripts/generate-static-cities.cjs
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// ============================================
// SLUGIFY
// ============================================
function slugify(text) {
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

// ============================================
// FETCH HELPER
// ============================================
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// ============================================
// 1. BRASIL - API IBGE
// ============================================
async function fetchBrazilCities() {
  console.log('🇧🇷 Buscando cidades do Brasil via API IBGE...');
  
  try {
    const data = await fetchJson('https://servicodados.ibge.gov.br/api/v1/localidades/municipios');
    
    const cities = data
      .filter((city) => {
        // Filtrar apenas cidades com estrutura completa
        return (
          city &&
          city.id &&
          city.nome &&
          city.microrregiao &&
          city.microrregiao.mesorregiao &&
          city.microrregiao.mesorregiao.UF &&
          city.microrregiao.mesorregiao.UF.sigla
        );
      })
      .map((city) => ({
        id: `br-${city.id}`,
        name: city.nome,
        slug: slugify(`${city.nome}-${city.microrregiao.mesorregiao.UF.sigla}-brasil`),
        state: city.microrregiao.mesorregiao.UF.nome,
        stateCode: city.microrregiao.mesorregiao.UF.sigla,
        country: 'Brasil',
        countryCode: 'BR',
        locale: 'pt-BR',
        fullName: `${city.nome} - ${city.microrregiao.mesorregiao.UF.sigla}, Brasil`,
      }));
    
    console.log(`✅ ${cities.length} cidades do Brasil carregadas`);
    return cities;
  } catch (error) {
    console.error('❌ Erro ao buscar cidades do Brasil:', error);
    return [];
  }
}

// ============================================
// 2. EUA - DADOS ESTÁTICOS
// ============================================
function generateUSCities() {
  console.log('🇺🇸 Gerando cidades dos EUA...');
  
  const usStates = [
    { name: 'Alabama', code: 'AL', cities: ['Birmingham', 'Montgomery', 'Mobile', 'Huntsville'] },
    { name: 'Alaska', code: 'AK', cities: ['Anchorage', 'Fairbanks', 'Juneau'] },
    { name: 'Arizona', code: 'AZ', cities: ['Phoenix', 'Tucson', 'Mesa', 'Scottsdale', 'Chandler'] },
    { name: 'Arkansas', code: 'AR', cities: ['Little Rock', 'Fort Smith', 'Fayetteville'] },
    { name: 'California', code: 'CA', cities: ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose', 'Sacramento', 'Oakland', 'Fresno', 'Long Beach', 'Anaheim', 'Santa Ana'] },
    { name: 'Colorado', code: 'CO', cities: ['Denver', 'Colorado Springs', 'Aurora', 'Boulder'] },
    { name: 'Connecticut', code: 'CT', cities: ['Hartford', 'New Haven', 'Stamford', 'Bridgeport'] },
    { name: 'Delaware', code: 'DE', cities: ['Wilmington', 'Dover'] },
    { name: 'Florida', code: 'FL', cities: ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale', 'St Petersburg', 'Tallahassee', 'Naples', 'Sarasota'] },
    { name: 'Georgia', code: 'GA', cities: ['Atlanta', 'Augusta', 'Columbus', 'Savannah', 'Macon'] },
    { name: 'Hawaii', code: 'HI', cities: ['Honolulu', 'Pearl City', 'Hilo'] },
    { name: 'Idaho', code: 'ID', cities: ['Boise', 'Meridian', 'Nampa'] },
    { name: 'Illinois', code: 'IL', cities: ['Chicago', 'Aurora', 'Naperville', 'Rockford', 'Springfield'] },
    { name: 'Indiana', code: 'IN', cities: ['Indianapolis', 'Fort Wayne', 'Evansville', 'South Bend'] },
    { name: 'Iowa', code: 'IA', cities: ['Des Moines', 'Cedar Rapids', 'Davenport'] },
    { name: 'Kansas', code: 'KS', cities: ['Wichita', 'Overland Park', 'Kansas City', 'Topeka'] },
    { name: 'Kentucky', code: 'KY', cities: ['Louisville', 'Lexington', 'Bowling Green'] },
    { name: 'Louisiana', code: 'LA', cities: ['New Orleans', 'Baton Rouge', 'Shreveport', 'Lafayette'] },
    { name: 'Maine', code: 'ME', cities: ['Portland', 'Lewiston', 'Bangor'] },
    { name: 'Maryland', code: 'MD', cities: ['Baltimore', 'Columbia', 'Silver Spring', 'Annapolis'] },
    { name: 'Massachusetts', code: 'MA', cities: ['Boston', 'Worcester', 'Springfield', 'Cambridge', 'Lowell'] },
    { name: 'Michigan', code: 'MI', cities: ['Detroit', 'Grand Rapids', 'Warren', 'Sterling Heights', 'Ann Arbor'] },
    { name: 'Minnesota', code: 'MN', cities: ['Minneapolis', 'St Paul', 'Rochester', 'Duluth'] },
    { name: 'Mississippi', code: 'MS', cities: ['Jackson', 'Gulfport', 'Southaven'] },
    { name: 'Missouri', code: 'MO', cities: ['Kansas City', 'St Louis', 'Springfield', 'Columbia'] },
    { name: 'Montana', code: 'MT', cities: ['Billings', 'Missoula', 'Great Falls'] },
    { name: 'Nebraska', code: 'NE', cities: ['Omaha', 'Lincoln', 'Bellevue'] },
    { name: 'Nevada', code: 'NV', cities: ['Las Vegas', 'Henderson', 'Reno', 'North Las Vegas'] },
    { name: 'New Hampshire', code: 'NH', cities: ['Manchester', 'Nashua', 'Concord'] },
    { name: 'New Jersey', code: 'NJ', cities: ['Newark', 'Jersey City', 'Paterson', 'Elizabeth', 'Trenton'] },
    { name: 'New Mexico', code: 'NM', cities: ['Albuquerque', 'Las Cruces', 'Rio Rancho', 'Santa Fe'] },
    { name: 'New York', code: 'NY', cities: ['New York', 'Buffalo', 'Rochester', 'Syracuse', 'Albany', 'Yonkers'] },
    { name: 'North Carolina', code: 'NC', cities: ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem'] },
    { name: 'North Dakota', code: 'ND', cities: ['Fargo', 'Bismarck', 'Grand Forks'] },
    { name: 'Ohio', code: 'OH', cities: ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron', 'Dayton'] },
    { name: 'Oklahoma', code: 'OK', cities: ['Oklahoma City', 'Tulsa', 'Norman'] },
    { name: 'Oregon', code: 'OR', cities: ['Portland', 'Eugene', 'Salem', 'Gresham'] },
    { name: 'Pennsylvania', code: 'PA', cities: ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Reading'] },
    { name: 'Rhode Island', code: 'RI', cities: ['Providence', 'Warwick', 'Cranston'] },
    { name: 'South Carolina', code: 'SC', cities: ['Columbia', 'Charleston', 'North Charleston', 'Greenville'] },
    { name: 'South Dakota', code: 'SD', cities: ['Sioux Falls', 'Rapid City', 'Aberdeen'] },
    { name: 'Tennessee', code: 'TN', cities: ['Nashville', 'Memphis', 'Knoxville', 'Chattanooga'] },
    { name: 'Texas', code: 'TX', cities: ['Houston', 'San Antonio', 'Dallas', 'Austin', 'Fort Worth', 'El Paso', 'Arlington', 'Corpus Christi', 'Plano', 'Laredo'] },
    { name: 'Utah', code: 'UT', cities: ['Salt Lake City', 'West Valley City', 'Provo', 'West Jordan'] },
    { name: 'Vermont', code: 'VT', cities: ['Burlington', 'South Burlington', 'Rutland'] },
    { name: 'Virginia', code: 'VA', cities: ['Virginia Beach', 'Norfolk', 'Chesapeake', 'Richmond', 'Arlington'] },
    { name: 'Washington', code: 'WA', cities: ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue'] },
    { name: 'West Virginia', code: 'WV', cities: ['Charleston', 'Huntington', 'Morgantown'] },
    { name: 'Wisconsin', code: 'WI', cities: ['Milwaukee', 'Madison', 'Green Bay', 'Kenosha'] },
    { name: 'Wyoming', code: 'WY', cities: ['Cheyenne', 'Casper', 'Laramie'] },
  ];

  const cities = [];
  let id = 1;

  usStates.forEach((state) => {
    state.cities.forEach((cityName) => {
      cities.push({
        id: `us-${id++}`,
        name: cityName,
        slug: slugify(`${cityName}-${state.code}-usa`),
        state: state.name,
        stateCode: state.code,
        country: 'United States',
        countryCode: 'US',
        locale: 'en',
        fullName: `${cityName}, ${state.code}, USA`,
      });
    });
  });

  console.log(`✅ ${cities.length} cidades dos EUA geradas`);
  return cities;
}

// ============================================
// 3. MÉXICO
// ============================================
function generateMexicoCities() {
  console.log('🇲🇽 Gerando cidades do México...');
  
  const mexicoStates = [
    { name: 'Aguascalientes', code: 'AGS', cities: ['Aguascalientes', 'Calvillo'] },
    { name: 'Baja California', code: 'BC', cities: ['Tijuana', 'Mexicali', 'Ensenada', 'Tecate'] },
    { name: 'Baja California Sur', code: 'BCS', cities: ['La Paz', 'Cabo San Lucas', 'San José del Cabo'] },
    { name: 'Campeche', code: 'CAM', cities: ['Campeche', 'Ciudad del Carmen'] },
    { name: 'Chiapas', code: 'CHIS', cities: ['Tuxtla Gutiérrez', 'San Cristóbal de las Casas', 'Tapachula'] },
    { name: 'Chihuahua', code: 'CHIH', cities: ['Chihuahua', 'Ciudad Juárez', 'Delicias'] },
    { name: 'Ciudad de México', code: 'CDMX', cities: ['Ciudad de México'] },
    { name: 'Coahuila', code: 'COAH', cities: ['Saltillo', 'Torreón', 'Monclova'] },
    { name: 'Colima', code: 'COL', cities: ['Colima', 'Manzanillo'] },
    { name: 'Durango', code: 'DGO', cities: ['Durango', 'Gómez Palacio'] },
    { name: 'Guanajuato', code: 'GTO', cities: ['León', 'Guanajuato', 'Celaya', 'Irapuato', 'Salamanca'] },
    { name: 'Guerrero', code: 'GRO', cities: ['Acapulco', 'Chilpancingo', 'Zihuatanejo'] },
    { name: 'Hidalgo', code: 'HGO', cities: ['Pachuca', 'Tulancingo'] },
    { name: 'Jalisco', code: 'JAL', cities: ['Guadalajara', 'Zapopan', 'Tlaquepaque', 'Puerto Vallarta'] },
    { name: 'México', code: 'MEX', cities: ['Toluca', 'Ecatepec', 'Naucalpan', 'Nezahualcóyotl'] },
    { name: 'Michoacán', code: 'MICH', cities: ['Morelia', 'Uruapan', 'Zamora'] },
    { name: 'Morelos', code: 'MOR', cities: ['Cuernavaca', 'Cuautla'] },
    { name: 'Nayarit', code: 'NAY', cities: ['Tepic', 'Bahía de Banderas'] },
    { name: 'Nuevo León', code: 'NL', cities: ['Monterrey', 'Guadalupe', 'San Nicolás de los Garza', 'Apodaca'] },
    { name: 'Oaxaca', code: 'OAX', cities: ['Oaxaca de Juárez', 'Salina Cruz', 'Juchitán'] },
    { name: 'Puebla', code: 'PUE', cities: ['Puebla', 'Tehuacán', 'Cholula'] },
    { name: 'Querétaro', code: 'QRO', cities: ['Querétaro', 'San Juan del Río'] },
    { name: 'Quintana Roo', code: 'QR', cities: ['Cancún', 'Playa del Carmen', 'Chetumal', 'Tulum'] },
    { name: 'San Luis Potosí', code: 'SLP', cities: ['San Luis Potosí', 'Soledad de Graciano Sánchez'] },
    { name: 'Sinaloa', code: 'SIN', cities: ['Culiacán', 'Mazatlán', 'Los Mochis'] },
    { name: 'Sonora', code: 'SON', cities: ['Hermosillo', 'Ciudad Obregón', 'Nogales'] },
    { name: 'Tabasco', code: 'TAB', cities: ['Villahermosa', 'Cárdenas'] },
    { name: 'Tamaulipas', code: 'TAMPS', cities: ['Reynosa', 'Matamoros', 'Nuevo Laredo', 'Tampico'] },
    { name: 'Tlaxcala', code: 'TLAX', cities: ['Tlaxcala', 'Apizaco'] },
    { name: 'Veracruz', code: 'VER', cities: ['Veracruz', 'Xalapa', 'Coatzacoalcos', 'Córdoba'] },
    { name: 'Yucatán', code: 'YUC', cities: ['Mérida', 'Valladolid', 'Progreso'] },
    { name: 'Zacatecas', code: 'ZAC', cities: ['Zacatecas', 'Fresnillo'] },
  ];

  const cities = [];
  let id = 1;

  mexicoStates.forEach((state) => {
    state.cities.forEach((cityName) => {
      cities.push({
        id: `mx-${id++}`,
        name: cityName,
        slug: slugify(`${cityName}-${state.code}-mexico`),
        state: state.name,
        stateCode: state.code,
        country: 'México',
        countryCode: 'MX',
        locale: 'es',
        fullName: `${cityName}, ${state.code}, México`,
      });
    });
  });

  console.log(`✅ ${cities.length} cidades do México geradas`);
  return cities;
}

// ============================================
// 4. AMÉRICA LATINA
// ============================================
function generateOtherLatamCities() {
  console.log('🌎 Gerando cidades da América Latina...');
  
  const cities = [];
  let id = 1;

  // ARGENTINA
  const argentinaProvinces = [
    { name: 'Buenos Aires', code: 'BA', cities: ['Buenos Aires', 'La Plata', 'Mar del Plata'] },
    { name: 'Córdoba', code: 'CBA', cities: ['Córdoba', 'Villa María'] },
    { name: 'Santa Fe', code: 'SF', cities: ['Rosario', 'Santa Fe'] },
    { name: 'Mendoza', code: 'MZA', cities: ['Mendoza', 'San Rafael'] },
  ];

  argentinaProvinces.forEach((prov) => {
    prov.cities.forEach((cityName) => {
      cities.push({
        id: `ar-${id++}`,
        name: cityName,
        slug: slugify(`${cityName}-${prov.code}-argentina`),
        state: prov.name,
        stateCode: prov.code,
        country: 'Argentina',
        countryCode: 'AR',
        locale: 'es',
        fullName: `${cityName}, ${prov.code}, Argentina`,
      });
    });
  });

  // COLÔMBIA
  const colombiaDepts = [
    { name: 'Bogotá D.C.', code: 'DC', cities: ['Bogotá'] },
    { name: 'Antioquia', code: 'ANT', cities: ['Medellín', 'Bello'] },
    { name: 'Valle del Cauca', code: 'VAC', cities: ['Cali', 'Palmira'] },
    { name: 'Atlántico', code: 'ATL', cities: ['Barranquilla', 'Soledad'] },
  ];

  colombiaDepts.forEach((dept) => {
    dept.cities.forEach((cityName) => {
      cities.push({
        id: `co-${id++}`,
        name: cityName,
        slug: slugify(`${cityName}-${dept.code}-colombia`),
        state: dept.name,
        stateCode: dept.code,
        country: 'Colombia',
        countryCode: 'CO',
        locale: 'es',
        fullName: `${cityName}, ${dept.code}, Colombia`,
      });
    });
  });

  // CHILE
  const chileRegions = [
    { name: 'Región Metropolitana', code: 'RM', cities: ['Santiago', 'Puente Alto', 'Maipú'] },
    { name: 'Valparaíso', code: 'VA', cities: ['Valparaíso', 'Viña del Mar'] },
    { name: 'Biobío', code: 'BI', cities: ['Concepción', 'Talcahuano'] },
  ];

  chileRegions.forEach((region) => {
    region.cities.forEach((cityName) => {
      cities.push({
        id: `cl-${id++}`,
        name: cityName,
        slug: slugify(`${cityName}-${region.code}-chile`),
        state: region.name,
        stateCode: region.code,
        country: 'Chile',
        countryCode: 'CL',
        locale: 'es',
        fullName: `${cityName}, ${region.code}, Chile`,
      });
    });
  });

  console.log(`✅ ${cities.length} cidades da América Latina geradas`);
  return cities;
}

// ============================================
// FUNÇÃO PRINCIPAL
// ============================================
async function generateAllCities() {
  console.log('\n🌍 GERANDO ARQUIVO ESTÁTICO DE CIDADES...\n');

  const brazil = await fetchBrazilCities();
  const usa = generateUSCities();
  const mexico = generateMexicoCities();
  const latam = generateOtherLatamCities();

  const allCities = [...brazil, ...usa, ...mexico, ...latam];

  console.log('\n📊 RESUMO:');
  console.log(`🇧🇷 Brasil: ${brazil.length}`);
  console.log(`🇺🇸 EUA: ${usa.length}`);
  console.log(`🇲🇽 México: ${mexico.length}`);
  console.log(`🌎 Outros: ${latam.length}`);
  console.log(`\n✅ TOTAL: ${allCities.length} cidades\n`);

  // Criar diretório data
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Salvar arquivo JSON
  const outputPath = path.join(dataDir, 'all-cities-static.json');
  fs.writeFileSync(outputPath, JSON.stringify(allCities, null, 2));

  console.log(`💾 Arquivo salvo: ${outputPath}`);
  console.log('🎉 Concluído! Agora o código usa arquivo estático (super rápido).\n');
}

// Executar
generateAllCities().catch(console.error);

