# Referência de APIs

Todas as rotas são **App Router** em `app/api/`. Autenticação admin usa cookie
`admin_session` e `lib/auth.ts` (bcrypt).

## Tracking

| Método | Rota                            | Uso                                                             |
| ------ | ------------------------------- | --------------------------------------------------------------- |
| POST   | `/api/track/pageview`           | Registo de pageview (path, locale, device, sessionId, etc.).    |
| POST   | `/api/track/quote-click`        | Clique em "pedir orçamento" (página, produto, cidade, keyword). |
| POST   | `/api/track/session/start`      | Início de sessão.                                               |
| POST   | `/api/track/session/end`        | Fim de sessão.                                                  |
| POST   | `/api/track/session/heartbeat`  | Heartbeat para manter sessão ativa.                             |
| POST   | `/api/track/session/conversion` | Marcar conversão na sessão.                                     |
| POST   | `/api/track/scroll-depth`       | Profundidade de scroll.                                         |
| POST   | `/api/track/performance`        | Envio de Core Web Vitals.                                       |
| POST   | `/api/track/page-duration`      | Duração na página.                                              |

## Admin

| Método | Rota                         | Uso                                                                   |
| ------ | ---------------------------- | --------------------------------------------------------------------- |
| POST   | `/api/admin/auth`            | Login: body `{ password }`; em sucesso define cookie `admin_session`. |
| GET    | `/api/admin/auth`            | Verifica se há sessão admin (retorna authenticated: true/false).      |
| GET    | `/api/admin/stats`           | Estatísticas gerais para o dashboard (requer auth).                   |
| GET    | `/api/admin/stats-by-source` | Estatísticas por fonte de tráfego.                                    |
| GET    | `/api/admin/seo`             | Dados para análise SEO.                                               |
| GET    | `/api/admin/campaigns`       | Dados para análise de campanhas.                                      |

Proteção: rotas de admin devem validar o cookie `admin_session` (ex.: chamada
GET a `/api/admin/auth` ou leitura do cookie no servidor). Implementação em
`app/api/admin/auth/route.ts` e `lib/auth.ts`.

## Marketing

| Método | Rota                            | Uso                                                                                                               |
| ------ | ------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| POST   | `/api/marketing-report`         | Disparo manual de relatório de marketing (corpo conforme `lib/marketing-report.ts`).                              |
| GET    | `/api/marketing-report/history` | Histórico de envios (MarketingReportLog).                                                                         |
| GET    | `/api/cron/marketing-report`    | Cron Vercel: envio agendado (ex.: diário 9h em `vercel.json`). Deve validar cabeçalho/secret de cron em produção. |

## Outros

| Método   | Rota                         | Uso                                             |
| -------- | ---------------------------- | ----------------------------------------------- |
| GET/POST | `/api/notifications/preview` | Pré-visualização de notificações (ex.: email).  |
| GET      | `/api/test-sitemaps`         | Teste de geração de sitemaps (dev/diagnóstico). |
| POST     | `/api/test/email`            | Teste de envio de email.                        |

## Variáveis de ambiente críticas para APIs

- **DATABASE_URL** — obrigatório para Prisma (todas as rotas que usam BD).
- **ADMIN_PASSWORD** — senha default quando não existe admin no BD; também usada
  por `admin:init`.
- **ADMIN_SESSION_SECRET** — secret para assinatura do cookie de sessão admin
  (produção).
- Relatórios de marketing: config de SMTP/nodemailer e destinatários (ver
  `lib/marketing-report.ts` e `docs/ENV_EXAMPLE.md`).
- Sentry: **SENTRY_DSN** / **NEXT_PUBLIC_SENTRY_DSN** para erro reporting.

Detalhe completo das variáveis em `docs/ENV_EXAMPLE.md` e
`docs/05-DEPLOY-AND-OPS.md`.
