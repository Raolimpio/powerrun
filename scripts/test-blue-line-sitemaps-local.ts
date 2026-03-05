/**
 * 🧪 TESTE LOCAL - SITEMAPS BLUE LINE
 * 
 * Testa os sitemaps Blue Line localmente antes de fazer deploy
 * 
 * Uso: npx tsx scripts/test-blue-line-sitemaps-local.ts
 */

const BASE_URL = 'http://localhost:3000';

interface TestResult {
  url: string;
  status: number;
  contentType: string;
  urlCount?: number;
  error?: string;
}

async function testSitemap(url: string, allow404 = false): Promise<TestResult> {
  try {
    const response = await fetch(url);
    const contentType = response.headers.get('content-type') || '';
    const text = await response.text();

    let urlCount: number | undefined;
    if (contentType.includes('xml')) {
      // Contar URLs no XML
      const urlMatches = text.match(/<url>/g);
      urlCount = urlMatches ? urlMatches.length : 0;
    }

    // Se permitir 404 e o status for 404, não é erro (sitemap não existe porque não há URLs suficientes)
    if (allow404 && response.status === 404) {
      return {
        url,
        status: response.status,
        contentType,
        urlCount: 0,
      };
    }

    return {
      url,
      status: response.status,
      contentType,
      urlCount,
    };
  } catch (error: any) {
    return {
      url,
      status: 0,
      contentType: '',
      error: error.message,
    };
  }
}

async function testAllSitemaps() {
  console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║        🧪 TESTE LOCAL - SITEMAPS BLUE LINE                    ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

  console.log('⚠️  IMPORTANTE: Certifique-se de que o servidor está rodando!');
  console.log('   Execute: npm run dev\n');

  const tests: Array<{ name: string; urls: Array<string | { url: string; allow404?: boolean }> }> = [
    {
      name: 'Sitemap Index Principal',
      urls: [`${BASE_URL}/sitemap-index.xml`],
    },
    {
      name: 'Sitemap Index Blue Line',
      urls: [`${BASE_URL}/sitemap-blue-line-index.xml`],
    },
    {
      name: 'Sitemaps Blue Line - Brasil',
      urls: [
        { url: `${BASE_URL}/sitemap-blue-line-br-0.xml`, allow404: false },
        { url: `${BASE_URL}/sitemap-blue-line-br-1.xml`, allow404: false },
        { url: `${BASE_URL}/sitemap-blue-line-br-2.xml`, allow404: false },
      ],
    },
    {
      name: 'Sitemaps Blue Line - EUA',
      urls: [
        { url: `${BASE_URL}/sitemap-blue-line-us-0.xml`, allow404: false },
        { url: `${BASE_URL}/sitemap-blue-line-us-1.xml`, allow404: true },
      ],
    },
    {
      name: 'Sitemaps Blue Line - América Latina',
      urls: [
        { url: `${BASE_URL}/sitemap-blue-line-latam-0.xml`, allow404: false },
        { url: `${BASE_URL}/sitemap-blue-line-latam-1.xml`, allow404: true },
      ],
    },
  ];

  const results: TestResult[] = [];

  for (const test of tests) {
    console.log(`\n📋 Testando: ${test.name}`);
    console.log('─'.repeat(70));

    for (const urlEntry of test.urls) {
      const urlObj = typeof urlEntry === 'string' ? { url: urlEntry, allow404: false } : urlEntry;
      const result = await testSitemap(urlObj.url, urlObj.allow404);
      results.push(result);

      if (result.status === 200) {
        const statusIcon = result.contentType.includes('application/xml') ? '✅' : '⚠️';
        console.log(
          `${statusIcon} ${urlObj.url}`
        );
        console.log(`   Status: ${result.status}`);
        console.log(`   Content-Type: ${result.contentType}`);
        if (result.urlCount !== undefined) {
          console.log(`   URLs encontradas: ${result.urlCount.toLocaleString('pt-BR')}`);
        }
      } else if (result.status === 404) {
        if (urlObj.allow404) {
          console.log(`ℹ️  ${urlObj.url}`);
          console.log(`   Status: 404 (Esperado - sitemap não existe porque não há URLs suficientes)`);
        } else {
          console.log(`❌ ${urlObj.url}`);
          console.log(`   Status: 404 (Não encontrado)`);
        }
      } else if (result.error) {
        console.log(`❌ ${urlObj.url}`);
        console.log(`   Erro: ${result.error}`);
        console.log(`   ⚠️  Servidor não está rodando? Execute: npm run dev`);
      } else {
        console.log(`⚠️  ${urlObj.url}`);
        console.log(`   Status: ${result.status}`);
      }
    }
  }

  // Resumo
  console.log('\n' + '='.repeat(70));
  console.log('📊 RESUMO DOS TESTES');
  console.log('='.repeat(70));

  const success = results.filter((r) => r.status === 200 && r.contentType.includes('application/xml')).length;
  const expected404 = results.filter((r) => r.status === 404).length;
  const failed = results.filter((r) => r.status !== 200 && r.status !== 404 || (r.status === 200 && !r.contentType.includes('application/xml'))).length;

  console.log(`✅ Sucesso: ${success}`);
  if (expected404 > 0) {
    console.log(`ℹ️  404 Esperados: ${expected404} (sitemaps que não existem porque não há URLs suficientes)`);
  }
  console.log(`❌ Falhas: ${failed}`);
  console.log(`📊 Total testado: ${results.length}`);

  if (failed > 0) {
    console.log('\n⚠️  Alguns sitemaps falharam! Verifique:');
    console.log('   1. Servidor está rodando? (npm run dev)');
    console.log('   2. Rotas estão corretas?');
    console.log('   3. Content-Type está correto? (application/xml)');
  } else {
    console.log('\n✅ Todos os sitemaps estão funcionando corretamente!');
    console.log('   Pronto para fazer deploy 🚀');
  }

  console.log('\n');
}

// Executar testes
testAllSitemaps().catch(console.error);

