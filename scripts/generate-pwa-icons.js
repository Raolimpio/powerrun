/**
 * Script para gerar ícones PWA - AAAA+++
 *
 * Gera automaticamente todos os ícones necessários para PWA
 * a partir de um ícone base usando sharp (se disponível) ou placeholders
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tamanhos necessários para PWA
const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const SHORTCUT_SIZE = 192;

// Configurações de cores
const COLORS = {
  primary: '#9c1006',
  secondary: '#61fbfe',
  background: '#ffffff',
  text: '#1f2937',
};

/**
 * Gerar ícone SVG simples como placeholder
 */
function generateIconSVG(size, text = 'PR') {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background circle -->
  <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${COLORS.primary}"/>
  <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 4}" fill="${COLORS.secondary}"/>
  
  <!-- Text -->
  <text x="${size / 2}" y="${size / 2}" 
        font-family="Arial, sans-serif" 
        font-size="${size / 4}" 
        font-weight="bold" 
        text-anchor="middle" 
        dominant-baseline="middle" 
        fill="${COLORS.background}">
    ${text}
  </text>
  
  <!-- Gear icon overlay -->
  <g transform="translate(${size * 0.7}, ${size * 0.7}) scale(${size / 800})">
    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L19 6.7C18.8 6.1 18.5 5.6 18.1 5.1L19 3.4L17.6 2L16 3C15.5 2.6 14.9 2.3 14.3 2.1L14 0H10L9.7 2.1C9.1 2.3 8.5 2.6 8 3L6.4 2L5 3.4L6 5.1C5.6 5.6 5.3 6.1 5.1 6.7L3 7V9L5.1 9.3C5.3 9.9 5.6 10.4 6 10.9L5 12.6L6.4 14L8 13C8.5 13.4 9.1 13.7 9.7 13.9L10 16H14L14.3 13.9C14.9 13.7 15.5 13.4 16 13L17.6 14L19 12.6L18 10.9C18.4 10.4 18.7 9.9 18.9 9.3L21 9ZM12 13.5C10.1 13.5 8.5 11.9 8.5 10S10.1 6.5 12 6.5S15.5 8.1 15.5 10S13.9 13.5 12 13.5Z" 
          fill="${COLORS.background}" 
          opacity="0.8"/>
  </g>
</svg>`;
}

/**
 * Gerar ícone de atalho SVG
 */
function generateShortcutIcon(type, size = 192) {
  const icons = {
    equipment: `<path d="M3,6V8H21V6H3M3,11H21V9H3V11M3,16H21V14H3V16Z" fill="${COLORS.background}"/>`,
    support: `<path d="M12,3C7.46,3 4,6.46 4,11C4,13.75 5.69,16.04 8.08,17.28L7,22H17L15.92,17.28C18.31,16.04 20,13.75 20,11C20,6.46 16.54,3 12,3M12,5C15.31,5 18,7.69 18,11C18,13.37 16.91,15.48 15,16.58V17H9V16.58C7.09,15.48 6,13.37 6,11C6,7.69 8.69,5 12,5M12,7A2,2 0 0,0 10,9A2,2 0 0,0 12,11A2,2 0 0,0 14,9A2,2 0 0,0 12,7Z" fill="${COLORS.background}"/>`,
    company: `<path d="M2,3H22V21H2V3M4,5V19H20V5H4M6,7H18V9H6V7M6,11H18V13H6V11M6,15H18V17H6V15Z" fill="${COLORS.background}"/>`,
  };

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${COLORS.primary}"/>
  <g transform="translate(${size / 2 - 12}, ${size / 2 - 12}) scale(1)">
    ${icons[type] || icons.equipment}
  </g>
</svg>`;
}

/**
 * Converter SVG para PNG usando canvas (Node.js)
 */
async function svgToPng(svgString, outputPath, size) {
  try {
    // Verificar se sharp está disponível
    const sharp = await import('sharp').then((m) => m.default).catch(() => null);
    if (!sharp) throw new Error('Sharp not available');

    const buffer = Buffer.from(svgString);
    await sharp(buffer).resize(size, size).png().toFile(outputPath);
    return true;
  } catch {
    // Fallback: salvar como SVG se sharp não estiver disponível
    fs.writeFileSync(outputPath.replace('.png', '.svg'), svgString);
    console.log(`⚠️  Sharp não disponível. Ícone salvo como SVG: ${outputPath}`);
    return false;
  }
}

/**
 * Gerar todos os ícones PWA
 */
async function generatePWAIcons() {
  console.log('🚀 Gerando ícones PWA...\n');

  const publicDir = path.join(path.dirname(__dirname), 'public');

  // Criar diretório public se não existir
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  let iconsGenerated = 0;

  // Gerar ícones principais
  for (const size of ICON_SIZES) {
    const svgContent = generateIconSVG(size);
    const outputPath = path.join(publicDir, `icon-${size}x${size}.png`);

    try {
      const success = await svgToPng(svgContent, outputPath, size);
      if (success) {
        console.log(`✅ Gerado: icon-${size}x${size}.png`);
      } else {
        console.log(`📄 Gerado: icon-${size}x${size}.svg (fallback)`);
      }
      iconsGenerated++;
    } catch (error) {
      console.error(`❌ Erro ao gerar icon-${size}x${size}.png:`, error.message);
    }
  }

  // Gerar ícones de atalhos
  const shortcuts = ['equipment', 'support', 'company'];
  for (const shortcut of shortcuts) {
    const svgContent = generateShortcutIcon(shortcut, SHORTCUT_SIZE);
    const outputPath = path.join(publicDir, `shortcut-${shortcut}.png`);

    try {
      const success = await svgToPng(svgContent, outputPath, SHORTCUT_SIZE);
      if (success) {
        console.log(`✅ Gerado: shortcut-${shortcut}.png`);
      } else {
        console.log(`📄 Gerado: shortcut-${shortcut}.svg (fallback)`);
      }
      iconsGenerated++;
    } catch (error) {
      console.error(`❌ Erro ao gerar shortcut-${shortcut}.png:`, error.message);
    }
  }

  // Gerar badge icon
  const badgeSvg = generateIconSVG(72, 'P');
  const badgePath = path.join(publicDir, 'badge-72x72.png');
  try {
    const success = await svgToPng(badgeSvg, badgePath, 72);
    if (success) {
      console.log('✅ Gerado: badge-72x72.png');
    } else {
      console.log('📄 Gerado: badge-72x72.svg (fallback)');
    }
    iconsGenerated++;
  } catch (error) {
    console.error('❌ Erro ao gerar badge-72x72.png:', error.message);
  }

  // Gerar favicon
  const faviconSvg = generateIconSVG(32);
  const faviconPath = path.join(publicDir, 'favicon-32x32.png');
  try {
    const success = await svgToPng(faviconSvg, faviconPath, 32);
    if (success) {
      console.log('✅ Gerado: favicon-32x32.png');
    } else {
      console.log('📄 Gerado: favicon-32x32.svg (fallback)');
    }
    iconsGenerated++;
  } catch (error) {
    console.error('❌ Erro ao gerar favicon-32x32.png:', error.message);
  }

  // Gerar screenshots placeholder
  await generateScreenshots(publicDir);

  console.log(`\n🎉 PWA Icons gerados com sucesso!`);
  console.log(`📊 Total: ${iconsGenerated} ícones`);

  if (iconsGenerated < ICON_SIZES.length + shortcuts.length + 2) {
    console.log('\n💡 Para melhor qualidade, instale sharp:');
    console.log('npm install sharp');
  }
}

/**
 * Gerar screenshots placeholder
 */
async function generateScreenshots(publicDir) {
  // Screenshot wide (desktop)
  const wideScreenshot = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
  <rect width="1280" height="720" fill="#0f172a"/>
  <rect width="1280" height="80" fill="${COLORS.primary}"/>
  <text x="640" y="50" font-family="Arial" font-size="32" font-weight="bold" text-anchor="middle" fill="white">Power Run</text>
  <rect x="80" y="120" width="1120" height="500" rx="8" fill="#1e293b"/>
  <text x="640" y="200" font-family="Arial" font-size="24" text-anchor="middle" fill="#94a3b8">Equipamentos Profissionais</text>
  <text x="640" y="400" font-family="Arial" font-size="18" text-anchor="middle" fill="#64748b">Tela principal da aplicação Power Run</text>
</svg>`;

  // Screenshot mobile
  const mobileScreenshot = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="390" height="844" viewBox="0 0 390 844" xmlns="http://www.w3.org/2000/svg">
  <rect width="390" height="844" fill="#0f172a"/>
  <rect width="390" height="80" fill="${COLORS.primary}"/>
  <text x="195" y="50" font-family="Arial" font-size="20" font-weight="bold" text-anchor="middle" fill="white">Power Run</text>
  <rect x="20" y="120" width="350" height="600" rx="8" fill="#1e293b"/>
  <text x="195" y="200" font-family="Arial" font-size="16" text-anchor="middle" fill="#94a3b8">Versão Mobile</text>
  <text x="195" y="400" font-family="Arial" font-size="14" text-anchor="middle" fill="#64748b">Interface otimizada para dispositivos móveis</text>
</svg>`;

  try {
    await svgToPng(wideScreenshot, path.join(publicDir, 'screenshot-wide.png'), {
      width: 1280,
      height: 720,
    });
    console.log('✅ Gerado: screenshot-wide.png (placeholder)');
  } catch {
    fs.writeFileSync(path.join(publicDir, 'screenshot-wide.svg'), wideScreenshot);
    console.log('📄 Gerado: screenshot-wide.svg (placeholder)');
  }

  try {
    await svgToPng(mobileScreenshot, path.join(publicDir, 'screenshot-mobile.png'), {
      width: 390,
      height: 844,
    });
    console.log('✅ Gerado: screenshot-mobile.png (placeholder)');
  } catch {
    fs.writeFileSync(path.join(publicDir, 'screenshot-mobile.svg'), mobileScreenshot);
    console.log('📄 Gerado: screenshot-mobile.svg (placeholder)');
  }
}

// Executar se chamado diretamente
const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);
if (isMainModule) {
  generatePWAIcons().catch(console.error);
}

export { generatePWAIcons };
