#!/usr/bin/env node

/**
 * Script para validar se todas as traduções estão corretas conforme o idioma
 * Verifica se as features estão traduzidas (não são apenas placeholders)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MESSAGES_DIR = path.join(__dirname, '..', 'messages');
const LOCALES = ['pt-BR', 'en', 'es', 'zh-CN'];

function readJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

function normalizeKey(key) {
  return key.replace(/\./g, '_');
}

function detectLanguage(text) {
  // Detectar idioma básico do texto
  const ptBRPatterns = /[áàâãéêíóôõúç]/i;
  const esPatterns = /[ñáéíóúü]/i;
  const zhPatterns = /[\u4e00-\u9fff]/;

  if (zhPatterns.test(text)) return 'zh-CN';
  if (ptBRPatterns.test(text)) return 'pt-BR';
  if (esPatterns.test(text)) return 'es';
  return 'en';
}

function isTranslated(key, value, targetLocale) {
  // Se a chave e o valor são iguais, pode ser que não esteja traduzido
  if (key === value) {
    // Mas se for pt-BR, isso é OK (texto original)
    if (targetLocale === 'pt-BR') return true;
    // Para outros idiomas, verificar se o texto parece estar no idioma correto
    const detectedLang = detectLanguage(value);
    return detectedLang === targetLocale;
  }

  // Se são diferentes, verificar se o valor está no idioma correto
  const detectedLang = detectLanguage(value);
  return detectedLang === targetLocale || detectedLang === 'pt-BR';
}

async function main() {
  console.log('🔍 Validando traduções em todos os idiomas\n');
  console.log('━'.repeat(70) + '\n');

  // Ler pt-BR como base
  const ptBRPath = path.join(MESSAGES_DIR, 'pt-BR.json');
  const ptBRMessages = readJSON(ptBRPath);

  if (!ptBRMessages || !ptBRMessages.features) {
    console.log('❌ Erro: pt-BR.json não encontrado ou inválido');
    return;
  }

  const ptBRFeatures = ptBRMessages.features;
  const ptBRKeys = Object.keys(ptBRFeatures);

  console.log(`📊 Base (pt-BR): ${ptBRKeys.length} features\n`);

  // Validar cada idioma
  const otherLocales = LOCALES.filter((l) => l !== 'pt-BR');
  const report = {};

  for (const locale of otherLocales) {
    const localePath = path.join(MESSAGES_DIR, `${locale}.json`);
    const localeMessages = readJSON(localePath);

    if (!localeMessages || !localeMessages.features) {
      console.log(`⚠️  ${locale}: Arquivo não encontrado ou inválido\n`);
      continue;
    }

    const localeFeatures = localeMessages.features;
    const missing = [];
    const notTranslated = [];
    const ok = [];

    ptBRKeys.forEach((key) => {
      if (!localeFeatures[key]) {
        missing.push(key);
      } else {
        const value = localeFeatures[key];
        if (isTranslated(key, value, locale)) {
          ok.push(key);
        } else {
          notTranslated.push({ key, value });
        }
      }
    });

    report[locale] = { missing, notTranslated, ok, total: ptBRKeys.length };

    console.log(`📋 ${locale}:`);
    console.log(`   ✅ Traduzidas: ${ok.length}`);
    console.log(`   ⚠️  Não traduzidas: ${notTranslated.length}`);
    console.log(`   ❌ Faltantes: ${missing.length}`);

    if (notTranslated.length > 0 && notTranslated.length <= 5) {
      console.log(`\n   Exemplos de não traduzidas:`);
      notTranslated.slice(0, 3).forEach(({ key, value }) => {
        console.log(`      - ${key.substring(0, 50)}...`);
        console.log(`        Valor: "${value.substring(0, 50)}..."`);
      });
    }

    console.log('');
  }

  // Resumo final
  console.log('━'.repeat(70));
  console.log('📊 RESUMO DE VALIDAÇÃO\n');

  for (const locale of otherLocales) {
    if (!report[locale]) continue;
    const { ok, notTranslated, missing, total } = report[locale];
    const percentage = ((ok / total) * 100).toFixed(1);
    const status = missing === 0 && notTranslated === 0 ? '✅' : '⚠️';

    console.log(`   ${status} ${locale}: ${ok}/${total} traduzidas (${percentage}%)`);
    if (missing > 0) console.log(`      ❌ ${missing} faltantes`);
    if (notTranslated.length > 0)
      console.log(`      ⚠️  ${notTranslated.length} precisam tradução`);
  }

  console.log('\n✅ Validação concluída!\n');
}

main().catch(console.error);
