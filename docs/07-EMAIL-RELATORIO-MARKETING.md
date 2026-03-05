# E-mail para envio do relatório de marketing

O relatório de marketing (semanal, quinzenal ou mensal) é enviado por e-mail via
SMTP. Configure as variáveis abaixo para o envio funcionar (cron automático e
disparo manual no painel admin).

## 1. SMTP (obrigatório)

O envio usa **nodemailer** com SMTP. Defina no `.env.local` (ou nas variáveis do
Vercel):

| Variável          | Descrição                       | Exemplo                                                    |
| ----------------- | ------------------------------- | ---------------------------------------------------------- |
| **SMTP_HOST**     | Servidor SMTP                   | `smtppro.zoho.com`, `smtp.gmail.com`, `smtp.office365.com` |
| **SMTP_PORT**     | Porta (geralmente 587 ou 465)   | `587`                                                      |
| **SMTP_SECURE**   | `true` para porta 465 (TLS)     | `false` para 587                                           |
| **SMTP_USER**     | Utilizador / e-mail de login    | `relatorios@seudominio.com`                                |
| **SMTP_PASSWORD** | Senha ou app password do e-mail | (valor secreto)                                            |
| **SMTP_FROM**     | Remetente exibido no e-mail     | `Power Run <relatorios@powerrun.com.br>`                   |

Sem `SMTP_USER` e `SMTP_PASSWORD` o serviço de e-mail não inicializa e o
relatório falha ao ser enviado.

**Exemplos por provedor:**

- **Zoho:** `SMTP_HOST=smtppro.zoho.com`, `SMTP_PORT=587`, `SMTP_SECURE=false`
- **Gmail:** usar
  [Senha de app](https://support.google.com/accounts/answer/185833);
  `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, `SMTP_SECURE=false`
- **Outlook/Office 365:** `SMTP_HOST=smtp.office365.com`, `SMTP_PORT=587`,
  `SMTP_SECURE=false`

## 2. Destinatários do relatório

Os e-mails que recebem o relatório (cron e envio manual) vêm da variável:

| Variável                        | Descrição                              | Exemplo                                                                     |
| ------------------------------- | -------------------------------------- | --------------------------------------------------------------------------- |
| **MARKETING_REPORT_RECIPIENTS** | Lista de e-mails separados por vírgula | `comercial@powerrun.com.br,vendas@powerrun.com.br,gerencia@powerrun.com.br` |

- Se **não** definir `MARKETING_REPORT_RECIPIENTS`, é usada uma lista padrão
  (hardcoded) do projeto.
- Se definir, **só** esses endereços recebem o relatório. Não use espaços à
  volta das vírgulas ou serão ignorados (o código faz trim).

## 3. Testar o e-mail

- **Teste rápido de SMTP:** rota de desenvolvimento `POST /api/test/email`
  (verifica se SMTP está configurado e opcionalmente envia um e-mail de teste
  para `NOTIFICATION_EMAILS`).
- **Teste do relatório:** no painel admin, em Relatórios de Marketing, use o
  botão de envio manual (requer login admin). Ou chamar em desenvolvimento
  `POST /api/marketing-report` com body `{ "period": "weekly" }` e cookie
  `admin_session`.

## 4. Cron automático (Vercel)

O relatório é enviado automaticamente pelo cron do Vercel (`vercel.json`):

- **Semanal:** segunda-feira
- **Quinzenal:** dias 1 e 16 do mês
- **Mensal:** dia 1 do mês

O endpoint chamado é `GET /api/cron/marketing-report`. Em produção o Vercel
envia o header `x-vercel-cron`; caso contrário, pode usar
`Authorization: Bearer <CRON_SECRET>` (defina `CRON_SECRET` no ambiente).

## 5. Resumo de variáveis

```bash
# SMTP (obrigatório para relatório)
SMTP_HOST=smtppro.zoho.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=relatorios@seudominio.com
SMTP_PASSWORD=senha-ou-app-password
SMTP_FROM="Power Run <relatorios@powerrun.com.br>"

# Quem recebe o relatório (opcional; se vazio usa lista padrão)
MARKETING_REPORT_RECIPIENTS=comercial@powerrun.com.br,vendas@powerrun.com.br

# Proteção do cron (recomendado em produção)
CRON_SECRET=um-valor-secreto-aleatorio
```

Referência de todas as variáveis: `docs/ENV_EXAMPLE.md`.
