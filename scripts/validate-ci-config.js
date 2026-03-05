/**
 * Script para validar configuração do CI/CD antes de fazer push
 * Execute: node scripts/validate-ci-config.js
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_FILES = [
  '.github/workflows/ci.yml',
  '.github/workflows/deploy-preview.yml',
  '.github/workflows/database-check.yml',
  '.github/dependabot.yml',
  'prisma/schema.prisma',
  'package.json',
  'tsconfig.json',
];

const REQUIRED_SCRIPTS = [
  'dev',
  'build',
  'start',
  'lint',
  'test',
];

console.log('🔍 Validando configuração do CI/CD...\n');

let hasErrors = false;

// 1. Verificar arquivos necessários
console.log('📁 Verificando arquivos necessários:');
REQUIRED_FILES.forEach(file => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  if (exists) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - FALTANDO`);
    hasErrors = true;
  }
});

// 2. Verificar scripts do package.json
console.log('\n📦 Verificando scripts do package.json:');
const packageJson = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8')
);

REQUIRED_SCRIPTS.forEach(script => {
  if (packageJson.scripts && packageJson.scripts[script]) {
    console.log(`  ✅ ${script}: ${packageJson.scripts[script]}`);
  } else {
    console.log(`  ❌ ${script} - FALTANDO`);
    hasErrors = true;
  }
});

// 3. Verificar .gitignore
console.log('\n🚫 Verificando .gitignore:');
const gitignoreContent = fs.readFileSync(
  path.join(process.cwd(), '.gitignore'),
  'utf-8'
);

const GITIGNORE_ENTRIES = [
  'node_modules',
  '.next',
  '.env',
  '.env.local',
  'dist',
  'build',
];

GITIGNORE_ENTRIES.forEach(entry => {
  if (gitignoreContent.includes(entry)) {
    console.log(`  ✅ ${entry}`);
  } else {
    console.log(`  ⚠️  ${entry} - NÃO ENCONTRADO (recomendado)`);
  }
});

// 4. Verificar variáveis de ambiente
console.log('\n🔐 Verificando variáveis de ambiente:');
const envExample = fs.existsSync(path.join(process.cwd(), '.env.example'));
const envLocal = fs.existsSync(path.join(process.cwd(), '.env.local'));
const envLocalInGitignore = gitignoreContent.includes('.env.local') || gitignoreContent.includes('.env*');

console.log(`  ${envExample ? '✅' : '⚠️ '} .env.example ${envExample ? 'existe' : 'não existe (recomendado)'}`);
console.log(`  ${envLocal ? '✅' : '⚠️ '} .env.local ${envLocal ? 'existe' : 'não existe'}`);
console.log(`  ${envLocalInGitignore ? '✅' : '❌'} .env.local ${envLocalInGitignore ? 'está no .gitignore' : 'NÃO está no .gitignore - PERIGO!'}`);

if (envLocal && !envLocalInGitignore) {
  console.log('\n  ⛔ ERRO CRÍTICO: .env.local existe mas não está no .gitignore!');
  console.log('     Isso pode expor segredos no repositório!');
  hasErrors = true;
}

// 5. Verificar TypeScript
console.log('\n📘 Verificando TypeScript:');
const tsconfigExists = fs.existsSync(path.join(process.cwd(), 'tsconfig.json'));
console.log(`  ${tsconfigExists ? '✅' : '❌'} tsconfig.json`);

if (tsconfigExists) {
  const { execSync } = require('child_process');
  try {
    console.log('  🔍 Executando verificação de tipos...');
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    console.log('  ✅ Sem erros de tipo');
  } catch (error) {
    console.log('  ❌ Erros de tipo encontrados');
    console.log('     Execute: npx tsc --noEmit para ver detalhes');
    hasErrors = true;
  }
}

// 6. Verificar lint
console.log('\n🧹 Verificando ESLint:');
try {
  const { execSync } = require('child_process');
  console.log('  🔍 Executando lint...');
  execSync('npm run lint', { stdio: 'pipe' });
  console.log('  ✅ Sem erros de lint');
} catch (error) {
  console.log('  ❌ Erros de lint encontrados');
  console.log('     Execute: npm run lint para ver detalhes');
  hasErrors = true;
}

// 7. Verificar testes
console.log('\n🧪 Verificando testes:');
if (fs.existsSync(path.join(process.cwd(), 'jest.config.js'))) {
  console.log('  ✅ jest.config.js encontrado');
  try {
    const { execSync } = require('child_process');
    console.log('  🔍 Executando testes...');
    execSync('npm test -- --passWithNoTests', { stdio: 'pipe' });
    console.log('  ✅ Testes passando');
  } catch (error) {
    console.log('  ❌ Testes falhando');
    console.log('     Execute: npm test para ver detalhes');
    hasErrors = true;
  }
} else {
  console.log('  ⚠️  jest.config.js não encontrado');
}

// 8. Resumo
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ VALIDAÇÃO FALHOU');
  console.log('   Corrija os erros acima antes de fazer push.');
  console.log('\n📚 Consulte: docs/GITHUB_CICD_SETUP.md');
  process.exit(1);
} else {
  console.log('✅ VALIDAÇÃO PASSOU');
  console.log('   Seu projeto está pronto para CI/CD!');
  console.log('\n📝 Próximos passos:');
  console.log('   1. Configure os secrets no GitHub');
  console.log('   2. Faça push para o repositório');
  console.log('   3. Verifique os workflows no GitHub Actions');
  console.log('\n📚 Guia completo: docs/GITHUB_CICD_SETUP.md');
}

