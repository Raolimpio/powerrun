# 📁 .github - Configuração do GitHub

Esta pasta contém todas as configurações e automações do GitHub para o projeto
Power Run.

## 📂 Estrutura

```
.github/
├── workflows/              # GitHub Actions workflows
│   ├── ci.yml             # Pipeline principal CI/CD
│   ├── deploy-preview.yml # Deploy preview para PRs
│   └── database-check.yml # Validação do banco de dados
├── ISSUE_TEMPLATE/        # Templates para issues
│   ├── bug_report.md      # Template de bug report
│   └── feature_request.md # Template de feature request
├── dependabot.yml         # Configuração do Dependabot
└── pull_request_template.md # Template para PRs
```

## 🔄 Workflows

### 1. CI/CD Pipeline (`ci.yml`)

**Executa em:** Push e Pull Request para `main` e `develop`

**Jobs:**

- **Lint e Type Check** - Valida código com ESLint e TypeScript
- **Testes** - Executa todos os testes Jest
- **Build** - Build completo da aplicação
- **Segurança** - Verifica vulnerabilidades
- **Análise** - Analisa bundle size (apenas PRs)

### 2. Deploy Preview (`deploy-preview.yml`)

**Executa em:** Pull Requests

**Funcionalidade:**

- Deploy automático no Vercel
- Comentário com URL no PR

### 3. Database Check (`database-check.yml`)

**Executa em:** PRs que modificam `prisma/`

**Funcionalidade:**

- Valida schema Prisma
- Testa migrações
- Executa seeds de teste

## 📝 Templates

### Issue Templates

- **Bug Report** - Para reportar bugs
- **Feature Request** - Para sugerir novas funcionalidades

### Pull Request Template

Checklist completo incluindo:

- Tipo de mudança
- Validações obrigatórias
- Testes necessários
- Impactos (bundle, performance, SEO)

## 🤖 Dependabot

Atualiza automaticamente:

- Dependências npm (semanalmente)
- GitHub Actions (mensalmente)

## 🔧 Configuração

### Secrets Necessários

Configurar em: **Settings → Secrets and variables → Actions**

```bash
DATABASE_URL
NEXTAUTH_SECRET
NEXTAUTH_URL
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
NEXT_PUBLIC_COMPANY_WHATSAPP
NEXT_PUBLIC_COMPANY_EMAIL
NEXT_PUBLIC_COMPANY_PHONE
NEXT_PUBLIC_COMPANY_NAME
NEXT_PUBLIC_COMPANY_ADDRESS
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
```

### Branch Protection (Recomendado)

Configurar em: **Settings → Branches**

- Require pull request before merging
- Require status checks to pass
- Require conversation resolution

## 📚 Documentação

- [Guia Completo](../docs/GITHUB_CICD_SETUP.md)
- [Guia Rápido](../docs/GITHUB_ACTIONS_QUICK.md)
- [Checklist](../docs/CHECKLIST_GITHUB_CICD.md)
- [Resumo](../docs/RESUMO_CICD_GITHUB.md)

## 🎯 Status

Para ver o status dos workflows:

- Vá em: **Actions** tab
- Ou adicione badges ao README:

```markdown
![CI](https://github.com/seu-usuario/powerrun/workflows/CI%2FCD%20Pipeline/badge.svg)
```

## 🆘 Troubleshooting

### Workflow Falha

1. Verifique logs em Actions tab
2. Confirme que todos os secrets estão configurados
3. Teste localmente: `npm run validate`

### Secrets Não Funcionam

1. Verifique nomes (são case-sensitive)
2. Re-adicione se necessário
3. Aguarde alguns segundos após adicionar

## 💡 Dicas

- Execute `npm run validate` antes de push
- Use `npm run validate:ci` para validar config
- Revise templates antes de criar issues/PRs
- Mantenha workflows sempre atualizados

---

Criado com ❤️ para garantir qualidade e segurança do código
