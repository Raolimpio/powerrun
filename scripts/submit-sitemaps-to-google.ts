/**
 * 📤 SUBMETER SITEMAPS AO GOOGLE SEARCH CONSOLE VIA API
 * 
 * Script para enviar sitemaps automaticamente ao Google Search Console
 * usando a API oficial do Google.
 * 
 * Uso: npx tsx scripts/submit-sitemaps-to-google.ts
 * 
 * Requisitos:
 * 1. Credenciais OAuth 2.0 do Google (client_id, client_secret)
 * 2. Token de acesso (gerado via OAuth flow)
 * 3. Site verificado no Google Search Console
 */

import { google } from 'googleapis';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://powerrun.com.br';
const SITE_URL = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL || 'sc-domain:powerrun.com.br';

// Sitemaps Blue Line para submeter
const BLUE_LINE_SITEMAPS = [
  // Brasil
  'sitemap-blue-line-br-0.xml',
  'sitemap-blue-line-br-1.xml',
  'sitemap-blue-line-br-2.xml',
  'sitemap-blue-line-br-3.xml',
  'sitemap-blue-line-br-4.xml',
  'sitemap-blue-line-br-5.xml',
  'sitemap-blue-line-br-6.xml',
  'sitemap-blue-line-br-7.xml',
  'sitemap-blue-line-br-8.xml',
  'sitemap-blue-line-br-9.xml',
  // EUA
  'sitemap-blue-line-us-0.xml',
  'sitemap-blue-line-us-1.xml',
  // América Latina
  'sitemap-blue-line-latam-0.xml',
];

// Sitemap index principal
const MAIN_SITEMAP_INDEX = 'sitemap-index.xml';

interface SubmitResult {
  sitemap: string;
  success: boolean;
  error?: string;
  message?: string;
}

/**
 * Autentica com Google Search Console API
 */
async function authenticateGoogle() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret) {
    throw new Error(
      '❌ Credenciais Google não configuradas!\n' +
      'Configure no .env.local:\n' +
      '  GOOGLE_CLIENT_ID=seu_client_id\n' +
      '  GOOGLE_CLIENT_SECRET=seu_client_secret\n' +
      '  GOOGLE_REFRESH_TOKEN=seu_refresh_token (opcional)'
    );
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    'urn:ietf:wg:oauth:2.0:oob' // Redirect URI para aplicações desktop
  );

  // Se tiver refresh token, usar para obter novo access token
  if (refreshToken) {
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      oauth2Client.setCredentials(credentials);
    } catch (error) {
      console.warn('⚠️  Erro ao renovar token, tentando autenticação manual...');
    }
  } else {
    // Gerar URL de autorização
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/webmasters'],
      prompt: 'consent',
    });

    console.log('\n🔐 AUTENTICAÇÃO NECESSÁRIA');
    console.log('─'.repeat(70));
    console.log('1. Acesse esta URL no navegador:');
    console.log(`   ${authUrl}\n`);
    console.log('2. Autorize o acesso ao Google Search Console');
    console.log('3. Copie o código de autorização e cole abaixo:');

    // Em produção, você pode usar readline para input interativo
    // Por enquanto, vamos usar variável de ambiente
    const authCode = process.env.GOOGLE_AUTH_CODE;
    if (!authCode) {
      throw new Error(
        '❌ Código de autorização não fornecido!\n' +
        'Configure GOOGLE_AUTH_CODE no .env.local ou use GOOGLE_REFRESH_TOKEN'
      );
    }

    const { tokens } = await oauth2Client.getToken(authCode);
    oauth2Client.setCredentials(tokens);

    if (tokens.refresh_token) {
      console.log('\n✅ Salve este REFRESH_TOKEN no .env.local:');
      console.log(`   GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
    }
  }

  return oauth2Client;
}

/**
 * Submete um sitemap ao Google Search Console
 */
async function submitSitemap(
  auth: any,
  sitemapPath: string
): Promise<SubmitResult> {
  try {
    const searchconsole = google.searchconsole({
      version: 'v1',
      auth,
    });

    const fullSitemapUrl = `${BASE_URL}/${sitemapPath}`;

    await searchconsole.sitemaps.submit({
      siteUrl: SITE_URL,
      feedpath: fullSitemapUrl,
    });

    return {
      sitemap: sitemapPath,
      success: true,
      message: 'Sitemap submetido com sucesso',
    };
  } catch (error: any) {
    return {
      sitemap: sitemapPath,
      success: false,
      error: error.message || 'Erro desconhecido',
    };
  }
}

/**
 * Lista sitemaps já submetidos
 */
async function listSubmittedSitemaps(auth: any) {
  try {
    const searchconsole = google.searchconsole({
      version: 'v1',
      auth,
    });

    const response = await searchconsole.sitemaps.list({
      siteUrl: SITE_URL,
    });

    return response.data.sitemap || [];
  } catch (error: any) {
    console.error('❌ Erro ao listar sitemaps:', error.message);
    return [];
  }
}

/**
 * Função principal
 */
async function main() {
  console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║     📤 SUBMETER SITEMAPS AO GOOGLE SEARCH CONSOLE VIA API      ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

  try {
    // Autenticar
    console.log('🔐 Autenticando com Google Search Console API...');
    const auth = await authenticateGoogle();
    console.log('✅ Autenticação bem-sucedida!\n');

    // Listar sitemaps já submetidos
    console.log('📋 Verificando sitemaps já submetidos...');
    const existingSitemaps = await listSubmittedSitemaps(auth);
    const existingPaths = existingSitemaps.map((s: any) => {
      const path = s.path || '';
      return path.replace(BASE_URL + '/', '');
    });
    console.log(`   Encontrados: ${existingSitemaps.length} sitemaps\n`);

    // Submeter sitemap index principal primeiro
    console.log('📤 Submetendo sitemap index principal...');
    const mainResult = await submitSitemap(auth, MAIN_SITEMAP_INDEX);
    if (mainResult.success) {
      console.log(`   ✅ ${MAIN_SITEMAP_INDEX} - Submetido com sucesso`);
    } else {
      if (mainResult.error?.includes('already')) {
        console.log(`   ℹ️  ${MAIN_SITEMAP_INDEX} - Já estava submetido`);
      } else {
        console.log(`   ❌ ${MAIN_SITEMAP_INDEX} - Erro: ${mainResult.error}`);
      }
    }

    // Submeter sitemaps Blue Line
    console.log('\n📤 Submetendo sitemaps Blue Line...');
    const results: SubmitResult[] = [];

    for (const sitemap of BLUE_LINE_SITEMAPS) {
      // Verificar se já foi submetido
      if (existingPaths.includes(sitemap)) {
        console.log(`   ℹ️  ${sitemap} - Já submetido anteriormente`);
        results.push({
          sitemap,
          success: true,
          message: 'Já estava submetido',
        });
        continue;
      }

      const result = await submitSitemap(auth, sitemap);
      results.push(result);

      if (result.success) {
        console.log(`   ✅ ${sitemap} - Submetido com sucesso`);
      } else {
        if (result.error?.includes('already')) {
          console.log(`   ℹ️  ${sitemap} - Já estava submetido`);
        } else {
          console.log(`   ❌ ${sitemap} - Erro: ${result.error}`);
        }
      }

      // Pequeno delay para evitar rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Resumo
    console.log('\n' + '='.repeat(70));
    console.log('📊 RESUMO');
    console.log('='.repeat(70));

    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    console.log(`✅ Sucesso: ${successful + (mainResult.success ? 1 : 0)}`);
    console.log(`❌ Falhas: ${failed}`);
    console.log(`📊 Total: ${results.length + 1} sitemaps`);

    if (failed === 0) {
      console.log('\n✅ Todos os sitemaps foram submetidos com sucesso!');
      console.log('   O Google começará a processar em algumas horas.');
    } else {
      console.log('\n⚠️  Alguns sitemaps falharam. Verifique os erros acima.');
    }

    console.log('\n💡 Dica: Verifique o status no Google Search Console:');
    console.log(`   https://search.google.com/search-console?resource_id=${encodeURIComponent(SITE_URL)}\n`);
  } catch (error: any) {
    console.error('\n❌ Erro ao submeter sitemaps:', error.message);
    console.error('\n📖 Como configurar:');
    console.error('   1. Crie um projeto no Google Cloud Console');
    console.error('   2. Ative a API "Google Search Console API"');
    console.error('   3. Crie credenciais OAuth 2.0');
    console.error('   4. Configure no .env.local:\n');
    console.error('      GOOGLE_CLIENT_ID=seu_client_id');
    console.error('      GOOGLE_CLIENT_SECRET=seu_client_secret');
    console.error('      GOOGLE_REFRESH_TOKEN=seu_refresh_token\n');
    process.exit(1);
  }
}

// Executar
main().catch(console.error);

