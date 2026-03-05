# Dados e Prisma

## Prisma

- **Datasource:** PostgreSQL, URL em `env("DATABASE_URL")`.
- **Cliente:** singleton em `lib/prisma.ts` (reutilizado em dev para evitar
  excesso de conexões). Log: em desenvolvimento `error` e `warn`; em produção
  apenas `error`.

## Modelos (schema.prisma)

| Modelo                 | Propósito                                                                                          | Índices principais                                          |
| ---------------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| **AdminUser**          | Utilizadores do painel admin (username, password em hash).                                         | unique em username                                          |
| **PageView**           | Pageviews: path, locale, device, sessionId, duration, scrollDepth, exitPage.                       | path, timestamp, locale, sessionId                          |
| **QuoteClick**         | Cliques em "pedir orçamento": página, produto, cidade, keyword, sessionId, posição do clique.      | pagePath, timestamp, pageType, productId, locale, sessionId |
| **Session**            | Sessões de utilizador: sessionId, início/fim, pageViews, conversions, device, locale, país/cidade. | sessionId, startTime, locale                                |
| **TrafficSource**      | Origem de tráfego por sessão: source, medium, campaign, referrer, landingPage.                     | sessionId, source, timestamp                                |
| **CustomEvent**        | Eventos custom (video_play, pdf_download, form_submit, etc.). eventData em JSON string.            | eventName, timestamp, sessionId                             |
| **PerformanceMetric**  | Core Web Vitals (LCP, FID, CLS, TTFB, FCP) com value e rating.                                     | pagePath, metricName, timestamp                             |
| **MarketingReportLog** | Histórico de envio de relatórios de marketing: period, status, recipients, triggeredBy.            | period, status, sentAt                                      |

## Dados fora do BD (constants)

Catálogo e configuração estão em código; não há tabelas de produtos no
PostgreSQL.

| Ficheiro / pasta                                          | Uso                                                                            |
| --------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `constants/equipment-data.ts`                             | Lista de equipamentos (id, nome, linha, etc.); usado em páginas e sitemaps.    |
| `constants/product-lines/`                                | blue-line-config, red-line-config, musculacao-config — configuração por linha. |
| `constants/pdf-links.ts`                                  | Links centralizados de PDFs (manuais, fichas técnicas).                        |
| `constants/gym-kits.ts`, `project-kits.ts`                | Kits de equipamentos para páginas de projetos.                                 |
| `constants/redirect-mapping.ts`                           | Mapeamento de URLs antigas para novas (produto, categoria, catálogo).          |
| `constants/qr-redirects.ts`, `qr-equipment-mapping.ts`    | Redirecionamentos e mapeamento para páginas QR.                                |
| `constants/product-line-mapping.ts`, `product-manager.ts` | Mapeamento e gestão de linhas de produtos.                                     |
| `constants/pdfs-equipamentos-manual.ts`                   | Manuais por equipamento.                                                       |

Uso: Server Components e rotas de API/sitemap importam estes módulos; geração de
sitemaps depende de equipment-data e de listas de cidades (scripts + services).

## Configuração do banco do zero (todas as tabelas)

As **tabelas** são criadas pelas **migrações do Prisma**, não pelo ficheiro de
seed. O `prisma/seed-data.sql` só **insere** o primeiro utilizador admin; não
cria nenhuma tabela.

**Ordem correta para o cliente configurar o banco:**

1. **Definir `DATABASE_URL`** no `.env.local` (ou no ambiente de produção).
2. **Criar todas as tabelas:** aplicar as migrações.
   - Se já existir a pasta `prisma/migrations` no projeto:  
     `npx prisma migrate deploy` (produção) ou `npx prisma migrate dev`
     (desenvolvimento).
   - Se ainda **não** existir `prisma/migrations`: rodar **uma vez**
     `npx prisma migrate dev` (com o BD já criado e acessível). Isso gera a
     migração inicial a partir do `schema.prisma` e aplica-a; depois pode
     commitar a pasta `migrations` e, noutros ambientes, usar só
     `prisma migrate deploy`.
3. **Dados iniciais (opcional):** executar `prisma/seed-data.sql` para criar o
   utilizador `admin`, ou em alternativa usar `npm run admin:init` com
   `ADMIN_PASSWORD` no env.

Resumo: **Migrações = criam as tabelas.** **seed-data.sql = só insere dados** na
tabela `AdminUser` já existente.

## Migrações e seeds

- **Aplicar migrações:** `npx prisma migrate dev` (dev) ou
  `prisma migrate deploy` (produção). Usar `dotenv -e .env.local` se necessário:
  `npm run prisma:migrate`.
- **Studio:** `npm run prisma:studio` para inspeção visual do BD.
- **Push (protótipo):** `npm run prisma:push` — aplica schema sem ficheiros de
  migração.
- **Primeiro admin:** script `npm run admin:init` (ou
  `node scripts/init-admin.cjs`) cria/atualiza utilizador admin; senha pode vir
  de `ADMIN_PASSWORD` no env. Ver `lib/auth.ts` (createAdminUser,
  initAdminUser).

## Dados iniciais (seed SQL)

Para configurar o banco do zero com um utilizador admin já criado, use o
ficheiro de seed em SQL:

**Ficheiro:** `prisma/seed-data.sql`

**Conteúdo:** insere um registo na tabela `AdminUser` com utilizador `admin` e
senha em hash bcrypt. Credenciais padrão (documentadas no próprio ficheiro):
utilizador `admin`, senha `PowerRun2025!` — o cliente deve alterar no primeiro
acesso.

**Como executar (depois de aplicar as migrações):**

```bash
# Com psql (substituir pela connection string do cliente)
psql "$DATABASE_URL" -f prisma/seed-data.sql

# Ou via Prisma (usa DATABASE_URL do .env)
npx dotenv -e .env.local -- prisma db execute --file prisma/seed-data.sql
```

**Alternativa sem SQL:** em vez de executar o seed SQL, o cliente pode definir
`ADMIN_PASSWORD` no `.env.local` e correr `npm run admin:init`; o script cria o
admin com essa senha (recomendado se quiserem uma senha própria desde o início).
