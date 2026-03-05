# Variáveis de ambiente — exemplo

Copiar para `.env.local` e preencher. Nunca commitar ficheiros com valores
reais.

```bash
# --- Obrigatório ---
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"

# --- Admin ---
ADMIN_PASSWORD="senha-forte-aqui"
ADMIN_SESSION_SECRET="gerar-valor-aleatorio-longo-producao"

# --- Site ---
NEXT_PUBLIC_BASE_URL="https://powerrun.com.br"

# --- SEO (opcional) ---
NEXT_PUBLIC_SEO_MAX_MODE="false"

# --- Sentry ---
SENTRY_DSN=""
NEXT_PUBLIC_SENTRY_DSN=""
SENTRY_ORG=""
SENTRY_PROJECT=""
SENTRY_AUTH_TOKEN=""

# --- Cloudinary ---
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""

# --- Contacto (público) ---
NEXT_PUBLIC_COMPANY_NAME="Power Run"
NEXT_PUBLIC_COMPANY_EMAIL=""
NEXT_PUBLIC_COMPANY_PHONE=""
NEXT_PUBLIC_COMPANY_WHATSAPP=""
NEXT_PUBLIC_COMPANY_ADDRESS=""

# --- Google Maps (se usar) ---
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=""

# --- Email (SMTP) ---
SMTP_HOST=""
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER=""
SMTP_PASSWORD=""
SMTP_FROM=""
NOTIFICATION_EMAILS=""
# Destinatários do relatório de marketing (vírgula separada)
MARKETING_REPORT_RECIPIENTS=""

# --- Cron (Vercel) ---
CRON_SECRET=""

# --- Google Search Console (submit sitemaps) ---
GOOGLE_SEARCH_CONSOLE_SITE_URL="sc-domain:powerrun.com.br"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GOOGLE_REFRESH_TOKEN=""
GOOGLE_AUTH_CODE=""
```

Referência completa em `04-SECURITY-AND-ENV.md` e `05-DEPLOY-AND-OPS.md`.
