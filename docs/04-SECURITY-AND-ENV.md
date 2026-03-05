# Segurança e variáveis de ambiente

## Headers de segurança (middleware)

Aplicados em `middleware.ts` a todas as respostas de páginas (rotas não
ignoradas):

| Header                        | Valor / efeito                                                                                                                                                                                                                                                                                                                      |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Content-Security-Policy**   | default-src 'self'; script-src com self, analytics (Google, YouTube); style-src self + Google Fonts; img-src self, data, https, Cloudinary, Unsplash, ibb; font-src gstatic; connect-src analytics e Sentry; media/frame para YouTube; object-src none; base-uri/form-action self; frame-ancestors none; upgrade-insecure-requests. |
| **Strict-Transport-Security** | max-age=31536000; includeSubDomains; preload                                                                                                                                                                                                                                                                                        |
| **X-Frame-Options**           | DENY                                                                                                                                                                                                                                                                                                                                |
| **X-Content-Type-Options**    | nosniff                                                                                                                                                                                                                                                                                                                             |
| **X-XSS-Protection**          | 1; mode=block                                                                                                                                                                                                                                                                                                                       |
| **Referrer-Policy**           | strict-origin-when-cross-origin                                                                                                                                                                                                                                                                                                     |
| **Permissions-Policy**        | camera, microphone, geolocation, interest-cohort desativados                                                                                                                                                                                                                                                                        |
| **X-Powered-By** / **Server** | Removidos para não expor stack                                                                                                                                                                                                                                                                                                      |
| **X-DNS-Prefetch-Control**    | on                                                                                                                                                                                                                                                                                                                                  |

Rotas `/api/*` e sitemaps não passam pelo middleware de i18n; os headers acima
aplicam-se às rotas de página. Em Vercel, `vercel.json` pode sobrescrever CSP
para certos paths (ex.: media/img).

## Autenticação admin

- **Método:** password única (ou primeiro admin criado no BD). Hash com bcrypt
  em `lib/auth.ts` (verifyAdminPassword, createAdminUser).
- **Sessão:** cookie `admin_session` (httpOnly, secure em produção, sameSite:
  lax, 7 dias). Token é valor opaco gerado no login; validação é presença do
  cookie (em produção deve validar-se assinatura/secret). Secret:
  `ADMIN_SESSION_SECRET` (default em código apenas para dev).
- **Melhoria futura:** usar JWT ou sessão server-side com secret forte; nunca
  depender de default de ADMIN_SESSION_SECRET em produção.

## Variáveis de ambiente

Resumo; lista comentada em `docs/ENV_EXAMPLE.md`.

**Obrigatórias (core):**

- **DATABASE_URL** — URL PostgreSQL para Prisma.

**Admin:**

- **ADMIN_PASSWORD** — Senha do primeiro admin (usada por `admin:init` e
  fallback em auth quando não existe admin no BD).
- **ADMIN_SESSION_SECRET** — Secret para cookie de sessão admin (produção: gerar
  valor forte).

**Opcionais (funcionalidades):**

- **NEXT_PUBLIC_BASE_URL** — URL base do site (sitemaps, emails, links).
  Default: https://powerrun.com.br.
- **NEXT_PUBLIC_SEO_MAX_MODE** — "true" para ativar modo SEO máximo (ex.:
  sitemap-generator, cities-adapter).
- **SENTRY_DSN** / **NEXT_PUBLIC_SENTRY_DSN** — Ativa Sentry quando definido.
  **SENTRY_ORG**, **SENTRY_PROJECT**, **SENTRY_AUTH_TOKEN** para build/upload de
  source maps.
- **NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME** — Nome da cloud Cloudinary (imagens).
- **NEXT*PUBLIC_COMPANY*\*** — Nome, email, telefone, WhatsApp, endereço
  (contacto no site).
- **NEXT_PUBLIC_GOOGLE_MAPS_API_KEY** — Chave para mapas (se usado).
- **SMTP\_\*** (SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASSWORD,
  SMTP_FROM)\*\* — Envio de emails (notificações, relatórios de marketing).
- **NOTIFICATION_EMAILS** — Lista de emails (separados por vírgula) para
  notificações de conversão.
- **MARKETING_REPORT_RECIPIENTS** — Lista de emails (separados por vírgula) que
  recebem o relatório de marketing (cron e envio manual). Ver
  `docs/07-EMAIL-RELATORIO-MARKETING.md`.
- **CRON_SECRET** — Secret para validar chamadas ao cron de marketing
  (produção).
- **GOOGLE_CLIENT_ID**, **GOOGLE_CLIENT_SECRET**, **GOOGLE_REFRESH_TOKEN**,
  **GOOGLE_AUTH_CODE**, **GOOGLE_SEARCH_CONSOLE_SITE_URL** — Integração Google
  Search Console (submit de sitemaps).

## Sentry

- **Config:** Ativação condicional em `next.config.ts` quando existe SENTRY_DSN
  ou NEXT_PUBLIC_SENTRY_DSN. Configuração server em `sentry.server.config.ts`,
  edge em `sentry.edge.config.ts`.
- **Uso:** Erros (e opcionalmente performance) reportados para o projeto Sentry;
  tunnel em `/monitoring`; source maps com SENTRY_AUTH_TOKEN no build.
