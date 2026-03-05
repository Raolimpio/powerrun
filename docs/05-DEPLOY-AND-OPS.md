# Deploy e operação

## Build

- **Comando:** `npm run build` — executa `prisma generate` e `next build`.
- **Output:** `standalone` (pasta `.next/standalone` para deploy self-hosted).
- **Atenção:** Em `next.config.ts` estão `eslint.ignoreDuringBuilds: true` e
  `typescript.ignoreBuildErrors: true`. O CI deve continuar a correr
  `npm run lint` e `npx tsc --noEmit` para não acumular dívida técnica;
  recomenda-se remover estes flags e corrigir erros.

## Deploy (Vercel)

- **Plataforma:** Vercel. Build command: `npm run build`; output compatível com
  Next.js.
- **Ficheiro:** `vercel.json` — headers (ex.: CSP para media/img) e **crons**:
  `/api/cron/marketing-report` com schedule `0 9 * * *` (diário às 9h UTC).
- **Variáveis:** Configurar no dashboard Vercel: DATABASE_URL, ADMIN_PASSWORD,
  ADMIN_SESSION_SECRET, NEXT_PUBLIC_BASE_URL, Sentry, SMTP, CRON_SECRET, etc.
  Ver `docs/ENV_EXAMPLE.md`.

## CI/CD (GitHub Actions)

- **Ficheiro:** `.github/workflows/ci.yml`.
- **Triggers:** push e pull_request nas branches `main` e `develop`.
- **Jobs:** lint (ESLint), type-check (tsc --noEmit), test (jest), build (prisma
  generate + next build), security (npm audit), analyze (bundle analysis em PR
  com ANALYZE=true). Build usa secrets para DATABASE*URL e variáveis
  NEXT_PUBLIC*\* com fallbacks para o job passar sem secrets em forks.
- **Secrets recomendados:** DATABASE*URL, NEXTAUTH_SECRET, NEXTAUTH_URL,
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, NEXT_PUBLIC_COMPANY*_, SENTRY\__ conforme
  necessário.

## Scripts operacionais

| Script                            | Uso                                                                 |
| --------------------------------- | ------------------------------------------------------------------- |
| `npm run generate:cities`         | Gera listas estáticas de cidades (node script).                     |
| `npm run export:cities:json`      | Exporta cidades para JSON (tsx).                                    |
| `npm run add:gps`                 | Adiciona coordenadas GPS (tsx).                                     |
| `npm run merge:gps`               | Merge de GPS nas cidades (tsx).                                     |
| `npm run gps:full`                | Sequência: export:cities:json + add:gps + merge:gps.                |
| `npm run admin:init`              | Cria/atualiza primeiro utilizador admin (usa ADMIN_PASSWORD).       |
| `npm run send-report`             | Envio manual de relatório de marketing (tsx).                       |
| `npm run test:sitemaps:blue-line` | Teste local dos sitemaps Blue Line.                                 |
| `npm run submit:sitemaps:google`  | Submissão de sitemaps ao Google Search Console (requer env Google). |
| `npm run prisma:generate`         | Gera Prisma Client (dotenv .env.local).                             |
| `npm run prisma:migrate`          | Migrações em dev.                                                   |
| `npm run prisma:studio`           | Abre Prisma Studio.                                                 |
| `npm run prisma:push`             | Push do schema (protótipo, sem migrações).                          |

## Monitorização

- **Sentry:** Erros (e opcionalmente performance) em tempo real; configurar
  alertas no projeto Sentry.
- **Relatórios de marketing:** Envio agendado via cron Vercel; histórico em
  `MarketingReportLog` e na área admin (relatórios-marketing).
