#!/usr/bin/env node

/**
 * Script completo para verificar página por página
 * Garante traduções em TODOS os idiomas para TODAS as páginas
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const APP_DIR = path.join(__dirname, '..', 'app', '[locale]');
const MESSAGES_DIR = path.join(__dirname, '..', 'messages');
const LOCALES = ['pt-BR', 'en', 'es', 'zh-CN'];

function readJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function getAllKeys(obj, prefix = '') {
  const keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...getAllKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function extractTranslationKeys(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const keys = new Set();

  // Padrões para encontrar chaves de tradução
  const patterns = [
    // useTranslations('namespace')
    /useTranslations\(['"]([^'"]+)['"]\)/g,
    // getTranslations({ namespace: '...' })
    /getTranslations\([^)]*namespace:\s*['"]([^'"]+)['"]/g,
    // t('key') ou t("key")
    /\.t\(['"]([^'"]+)['"]\)/g,
    // tNav('key'), tEq('key'), etc
    /t\w+\(['"]([^'"]+)['"]\)/g,
    // useTranslations({ locale, namespace: '...' })
    /namespace:\s*['"]([^'"]+)['"]/g,
  ];

  patterns.forEach((pattern) => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const key = match[1];
      if (key && !key.includes('${') && !key.includes('`')) {
        keys.add(key);
      }
    }
  });

  // Extrair chaves compostas como t('nav.equipamentos')
  const compoundPattern = /['"]([\w]+\.[\w.]+)['"]/g;
  let match;
  while ((match = compoundPattern.exec(content)) !== null) {
    keys.add(match[1]);
  }

  return Array.from(keys);
}

async function getAllPageFiles() {
  const files = await glob('**/*.{tsx,ts}', {
    cwd: APP_DIR,
    absolute: true,
    ignore: ['**/node_modules/**', '**/*.test.*', '**/*.spec.*'],
  });
  return files;
}

function findKeyInMessages(key, messages) {
  const parts = key.split('.');
  let current = messages;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return null;
    }
  }

  return typeof current === 'string' ? current : null;
}

async function main() {
  console.log('🔍 Verificando traduções página por página\n');
  console.log('━'.repeat(70) + '\n');

  // 1. Ler todos os arquivos de mensagens
  console.log('📚 Carregando arquivos de mensagens...');
  const messagesByLocale = {};
  for (const locale of LOCALES) {
    const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
    const messages = readJSON(filePath);
    if (messages) {
      messagesByLocale[locale] = messages;
      const allKeys = getAllKeys(messages);
      console.log(`   ✓ ${locale}: ${allKeys.length} chaves`);
    }
  }
  console.log('');

  // 2. Encontrar todas as páginas
  console.log('📄 Escaneando páginas...');
  const pageFiles = await getAllPageFiles();
  console.log(`   ✓ Encontradas ${pageFiles.length} páginas/componentes\n`);

  // 3. Extrair chaves de tradução de cada página
  console.log('🔑 Extraindo chaves de tradução...\n');
  const pageTranslations = {};

  for (const filePath of pageFiles) {
    const relativePath = path.relative(APP_DIR, filePath);
    const keys = extractTranslationKeys(filePath);

    if (keys.length > 0) {
      pageTranslations[relativePath] = keys;
    }
  }

  // 4. Verificar cada página
  console.log('━'.repeat(70));
  console.log('📋 VERIFICAÇÃO POR PÁGINA\n');
  console.log('━'.repeat(70) + '\n');

  const ptBRMessages = messagesByLocale['pt-BR'] || {};
  const ptBRKeys = new Set(getAllKeys(ptBRMessages));

  const report = {
    pages: {},
    summary: {
      totalPages: Object.keys(pageTranslations).length,
      totalKeys: 0,
      missingByLocale: {},
    },
  };

  for (const [pagePath, keys] of Object.entries(pageTranslations)) {
    console.log(`📄 ${pagePath}`);
    console.log(`   Chaves encontradas: ${keys.length}`);

    const pageReport = {
      keys: [],
      missing: {},
    };

    for (const key of keys) {
      report.summary.totalKeys++;
      const keyReport = { key, found: {} };

      for (const locale of LOCALES) {
        const messages = messagesByLocale[locale];
        const value = findKeyInMessages(key, messages);

        if (value) {
          keyReport.found[locale] = true;
        } else {
          keyReport.found[locale] = false;
          if (!pageReport.missing[locale]) {
            pageReport.missing[locale] = [];
          }
          pageReport.missing[locale].push(key);

          if (!report.summary.missingByLocale[locale]) {
            report.summary.missingByLocale[locale] = new Set();
          }
          report.summary.missingByLocale[locale].add(key);
        }
      }

      pageReport.keys.push(keyReport);
    }

    // Mostrar faltantes
    const hasMissing = Object.keys(pageReport.missing).length > 0;
    if (hasMissing) {
      console.log(`   ⚠️  Faltantes:`);
      for (const [locale, missingKeys] of Object.entries(pageReport.missing)) {
        console.log(`      ${locale}: ${missingKeys.length} chaves`);
        if (missingKeys.length <= 5) {
          missingKeys.forEach((k) => console.log(`         - ${k}`));
        }
      }
    } else {
      console.log(`   ✅ Todas as traduções presentes`);
    }

    report.pages[pagePath] = pageReport;
    console.log('');
  }

  // 5. Resumo final
  console.log('━'.repeat(70));
  console.log('📊 RESUMO GERAL\n');
  console.log(`Total de páginas verificadas: ${report.summary.totalPages}`);
  console.log(`Total de chaves encontradas: ${report.summary.totalKeys}\n`);

  for (const locale of LOCALES) {
    const missing = report.summary.missingByLocale[locale] || new Set();
    const missingCount = missing.size;
    const totalKeys = ptBRKeys.size;
    const percentage = (((totalKeys - missingCount) / totalKeys) * 100).toFixed(1);

    const status = missingCount === 0 ? '✅' : '⚠️';
    console.log(`${status} ${locale}:`);
    console.log(`   Traduzidas: ${totalKeys - missingCount}/${totalKeys} (${percentage}%)`);
    console.log(`   Faltantes: ${missingCount}`);

    if (missingCount > 0 && missingCount <= 10) {
      console.log(`   Exemplos:`);
      Array.from(missing)
        .slice(0, 5)
        .forEach((k) => {
          console.log(`      - ${k}`);
        });
    }
    console.log('');
  }

  // 6. Sincronizar chaves faltantes
  console.log('━'.repeat(70));
  console.log('🔄 SINCRONIZANDO CHAVES FALTANTES\n');

  const otherLocales = LOCALES.filter((l) => l !== 'pt-BR');
  let totalSynced = 0;

  for (const locale of otherLocales) {
    const messages = messagesByLocale[locale];
    if (!messages) continue;

    const missing = report.summary.missingByLocale[locale] || new Set();
    if (missing.size === 0) {
      console.log(`✅ ${locale}: Já está completo\n`);
      continue;
    }

    console.log(`🔍 Sincronizando ${locale}...`);
    let synced = 0;

    missing.forEach((key) => {
      const ptBRValue = findKeyInMessages(key, ptBRMessages);
      if (ptBRValue) {
        // Adicionar chave faltante usando valor do pt-BR como placeholder
        const parts = key.split('.');
        let current = messages;

        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) {
            current[parts[i]] = {};
          }
          current = current[parts[i]];
        }

        current[parts[parts.length - 1]] = ptBRValue;
        synced++;
      }
    });

    if (synced > 0) {
      const localePath = path.join(MESSAGES_DIR, `${locale}.json`);
      writeJSON(localePath, messages);
      console.log(`   ✅ Sincronizadas ${synced} chaves\n`);
      totalSynced += synced;
    }
  }

  // 7. Salvar relatório
  const reportPath = path.join(__dirname, '..', 'RELATORIO_TRADUCOES_PAGINAS.md');
  let reportContent = '# 📋 Relatório de Traduções por Página\n\n';
  reportContent += `Gerado em: ${new Date().toLocaleString('pt-BR')}\n\n`;
  reportContent += `## Resumo\n\n`;
  reportContent += `- Total de páginas: ${report.summary.totalPages}\n`;
  reportContent += `- Total de chaves: ${report.summary.totalKeys}\n\n`;

  reportContent += `## Status por Idioma\n\n`;
  for (const locale of LOCALES) {
    const missing = report.summary.missingByLocale[locale] || new Set();
    const totalKeys = ptBRKeys.size;
    const percentage = (((totalKeys - missing.size) / totalKeys) * 100).toFixed(1);
    reportContent += `### ${locale}\n`;
    reportContent += `- Traduzidas: ${totalKeys - missing.size}/${totalKeys} (${percentage}%)\n`;
    reportContent += `- Faltantes: ${missing.size}\n\n`;
  }

  reportContent += `## Detalhes por Página\n\n`;
  for (const [pagePath, pageReport] of Object.entries(report.pages)) {
    reportContent += `### ${pagePath}\n\n`;
    reportContent += `Chaves encontradas: ${pageReport.keys.length}\n\n`;

    const hasMissing = Object.keys(pageReport.missing).length > 0;
    if (hasMissing) {
      reportContent += `**Faltantes:**\n`;
      for (const [locale, missingKeys] of Object.entries(pageReport.missing)) {
        reportContent += `- ${locale}: ${missingKeys.length} chaves\n`;
        missingKeys.forEach((k) => {
          reportContent += `  - \`${k}\`\n`;
        });
      }
    } else {
      reportContent += `✅ Todas as traduções presentes\n`;
    }
    reportContent += `\n`;
  }

  fs.writeFileSync(reportPath, reportContent, 'utf8');

  console.log('━'.repeat(70));
  console.log('✅ Verificação concluída!\n');
  console.log(`📝 Relatório salvo em: ${reportPath}\n`);
  console.log(`📊 Total sincronizado: ${totalSynced} chaves\n`);
}

main().catch(console.error);
