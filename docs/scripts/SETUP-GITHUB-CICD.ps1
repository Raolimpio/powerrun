# 🚀 Power Run - Setup CI/CD GitHub
# Execute este script para configurar tudo automaticamente
# Executar na raiz do projeto: .\docs\scripts\SETUP-GITHUB-CICD.ps1

Write-Host "🎯 Configurando CI/CD do GitHub Actions..." -ForegroundColor Cyan
Write-Host ""

# Função para verificar se um comando existe
function Test-Command($command) {
    $null = Get-Command $command -ErrorAction SilentlyContinue
    return $?
}

# 1. Verificar Node.js
Write-Host "📦 Verificando Node.js..." -ForegroundColor Yellow
if (Test-Command node) {
    $nodeVersion = node --version
    Write-Host "  ✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "  ❌ Node.js não encontrado! Instale em: https://nodejs.org" -ForegroundColor Red
    exit 1
}

# 2. Verificar Git
Write-Host "📦 Verificando Git..." -ForegroundColor Yellow
if (Test-Command git) {
    $gitVersion = git --version
    Write-Host "  ✅ Git encontrado: $gitVersion" -ForegroundColor Green
} else {
    Write-Host "  ❌ Git não encontrado! Instale em: https://git-scm.com" -ForegroundColor Red
    exit 1
}

# 3. Verificar npm
Write-Host "📦 Verificando npm..." -ForegroundColor Yellow
if (Test-Command npm) {
    $npmVersion = npm --version
    Write-Host "  ✅ npm encontrado: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "  ❌ npm não encontrado!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔍 Validando estrutura do projeto..." -ForegroundColor Cyan

# 4. Verificar arquivos necessários
$requiredFiles = @(
    ".github\workflows\ci.yml",
    ".github\workflows\deploy-preview.yml",
    ".github\workflows\database-check.yml",
    ".github\dependabot.yml",
    "package.json",
    "tsconfig.json",
    "prisma\schema.prisma"
)

$missing = @()
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file - FALTANDO" -ForegroundColor Red
        $missing += $file
    }
}

if ($missing.Count -gt 0) {
    Write-Host ""
    Write-Host "❌ Arquivos faltando! Execute a configuração novamente." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🧪 Executando validações..." -ForegroundColor Cyan

# 5. Instalar dependências se necessário
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
    npm install
}

# 6. Executar validações
Write-Host ""
Write-Host "🔍 Lint..." -ForegroundColor Yellow
$lintResult = npm run lint 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Lint passou" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Lint com warnings (ok para continuar)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔍 Type Check..." -ForegroundColor Yellow
$typeResult = npm run type-check 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Type check passou" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Type check com erros (corrija antes de push)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔍 Testes..." -ForegroundColor Yellow
$testResult = npm test -- --passWithNoTests 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Testes passaram" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Testes com falhas (corrija antes de push)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔍 Validando Schema Prisma..." -ForegroundColor Yellow
$prismaResult = npx prisma validate 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Schema Prisma válido" -ForegroundColor Green
} else {
    Write-Host "  ❌ Schema Prisma inválido" -ForegroundColor Red
}

# 7. Verificar Git
Write-Host ""
Write-Host "📋 Status do Git:" -ForegroundColor Cyan
$gitStatus = git status --porcelain

if ($gitStatus) {
    Write-Host "  📝 Arquivos modificados detectados" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Próximos passos:" -ForegroundColor Cyan
    Write-Host "  1. git add ." -ForegroundColor White
    Write-Host "  2. git commit -m 'feat: adiciona CI/CD completo'" -ForegroundColor White
    Write-Host "  3. git push origin main" -ForegroundColor White
} else {
    Write-Host "  ✅ Nenhuma mudança pendente" -ForegroundColor Green
}

# 8. Resumo e próximos passos
Write-Host ""
Write-Host "=" -repeat 60 -ForegroundColor Cyan
Write-Host "✨ CONFIGURAÇÃO CONCLUÍDA!" -ForegroundColor Green
Write-Host "=" -repeat 60 -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 PRÓXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Configure os Secrets no GitHub:" -ForegroundColor White
Write-Host "   • Vá em: Settings → Secrets and variables → Actions" -ForegroundColor Gray
Write-Host "   • Consulte: docs\GITHUB_SECRETS_EXAMPLE.env" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Faça o Push para o GitHub:" -ForegroundColor White
Write-Host "   git add ." -ForegroundColor Gray
Write-Host "   git commit -m 'feat: adiciona CI/CD completo'" -ForegroundColor Gray
Write-Host "   git push origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Verifique o Pipeline:" -ForegroundColor White
Write-Host "   • Vá em: Actions tab no GitHub" -ForegroundColor Gray
Write-Host "   • Aguarde todos os checks passarem ✅" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Configure Branch Protection:" -ForegroundColor White
Write-Host "   • Vá em: Settings → Branches → Add rule" -ForegroundColor Gray
Write-Host "   • Branch: main" -ForegroundColor Gray
Write-Host "   • Require status checks to pass" -ForegroundColor Gray
Write-Host ""
Write-Host "📖 DOCUMENTAÇÃO:" -ForegroundColor Yellow
Write-Host "   • Guia Rápido: docs\GITHUB_ACTIONS_QUICK.md" -ForegroundColor Gray
Write-Host "   • Guia Completo: docs\GITHUB_CICD_SETUP.md" -ForegroundColor Gray
Write-Host "   • Checklist: docs\CHECKLIST_GITHUB_CICD.md" -ForegroundColor Gray
Write-Host "   • Resumo: docs\RESUMO_CICD_GITHUB.md" -ForegroundColor Gray
Write-Host ""
Write-Host "🆘 PRECISA DE AJUDA?" -ForegroundColor Yellow
Write-Host "   Execute: npm run validate:ci" -ForegroundColor Gray
Write-Host ""
Write-Host "💡 DICA: Antes de cada push, execute:" -ForegroundColor Cyan
Write-Host "   npm run validate" -ForegroundColor White
Write-Host ""
Write-Host "Boa sorte! 🚀" -ForegroundColor Green
Write-Host ""

# Perguntar se quer abrir a documentação
Write-Host "Deseja abrir o guia rápido? (S/N): " -NoNewline -ForegroundColor Yellow
$response = Read-Host
if ($response -eq "S" -or $response -eq "s") {
    Start-Process "docs\GITHUB_ACTIONS_QUICK.md"
}
