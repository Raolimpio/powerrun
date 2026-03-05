import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// Use request config path per next-intl v3 recommendation
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  // Configurações de Performance AAAA+++
  poweredByHeader: false,
  compress: true,

  // Otimizações de CSS crítico e JS
  typedRoutes: true,
  experimental: {
    // optimizeCss: true, // Requer critters package
    // optimizeServerReact: true, // Temporariamente desabilitado para debug
    // serverMinification: true, // Temporariamente desabilitado para debug
    // optimizePackageImports: [
    //   'lucide-react',
    //   '@radix-ui/react-slot',
    // ],
    webVitalsAttribution: ['CLS', 'LCP', 'FCP', 'FID', 'TTFB'],
    scrollRestoration: true,
  },

  // Otimizações de bundle (swcMinify é padrão no Next.js 15)
  // modularizeImports: {
  //   'lucide-react': {
  //     transform: 'lucide-react/dist/esm/icons/{{member}}',
  //   },
  // },

  // Otimizações de Imagem
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 ano
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Performance & PWA Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Service Worker
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
          // Performance
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      // Cache otimizado para assets estáticos
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache para fontes
      {
        source: '/_next/static/media/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache para imagens otimizadas
      {
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache para JavaScript e CSS estáticos
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache otimizado para API routes
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },

  // Redirects: landings antigas de kits (red-line / blue-line) → landing única
  async redirects() {
    const locales = 'pt-BR|en|es|zh-CN';
    return [
      {
        source: `/:locale(${locales})/projetos-academia/red-line`,
        destination: '/:locale/projetos-academia',
        permanent: true,
      },
      {
        source: `/:locale(${locales})/projetos-academia/blue-line`,
        destination: '/:locale/projetos-academia',
        permanent: true,
      },
    ];
  },

  // Rewrites para sitemaps Blue Line (compatibilidade com formato antigo)
  async rewrites() {
    return [
      {
        source: '/sitemap-blue-line-br-:index.xml',
        destination: '/sitemap-blue-line/br/:index',
      },
      {
        source: '/sitemap-blue-line-us-:index.xml',
        destination: '/sitemap-blue-line/us/:index',
      },
      {
        source: '/sitemap-blue-line-latam-:index.xml',
        destination: '/sitemap-blue-line/latam/:index',
      },
    ];
  },

  // Configurações de build para Windows
  generateBuildId: async () => {
    return `power-run-build-${Date.now().toString()}`;
  },

  // Webpack configuration para análise de bundle e otimizações
  webpack: (config, { dev, isServer }) => {
    // Bundle analyzer apenas quando solicitado
    if (!dev && !isServer && process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: './analyze/bundle-analysis.html',
        })
      );
    }

    // Configurações otimizadas para desenvolvimento no Windows
    config.resolve.symlinks = false;

    // Garantir que os módulos Node.js sejam ignorados no lado do cliente
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        https: false,
        // Módulos Node.js que não devem ser incluídos no bundle do cliente
        async_hooks: false,
        child_process: false,
        diagnostics_channel: false,
        worker_threads: false,
        crypto: false,
        events: false,
        // Módulos Node.js com prefixo node:
        'node:async_hooks': false,
        'node:child_process': false,
        'node:diagnostics_channel': false,
        'node:worker_threads': false,
        'node:crypto': false,
        'node:events': false,
        'node:fs': false,
        'node:https': false,
      };
    }

    // Otimizações para reduzir JavaScript legado (apenas client-side)
    if (!isServer && !dev) {
      // Configurar target moderno para reduzir polyfills
      config.target = ['web', 'es2020'];

      // Otimizar módulos para reduzir polyfills desnecessários
      config.resolve.conditionNames = ['import', 'require', 'node', 'default'];
    }

    // Desabilitar cache do webpack em desenvolvimento para evitar problemas no Windows
    if (dev) {
      config.cache = false;

      config.watchOptions = {
        ignored: '**/node_modules/**',
        poll: 2000, // Aumentar poll interval para reduzir CPU
        aggregateTimeout: 300, // Aguardar 300ms antes de recompilar
      };

      // Reduzir módulos que são watchados
      config.snapshot = {
        managedPaths: [/^(.+?[\\/]node_modules[\\/])/],
      };
    }

    return config;
  },

  // Configurações de output
  distDir: '.next',

  // Desabilitar ESLint durante build (temporário para desenvolvimento)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Desabilitar TypeScript type checking durante build
  typescript: {
    ignoreBuildErrors: true,
  },

  // Output otimizado
  output: 'standalone',

  // Compilação otimizada
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
};

// Configurar Next.js com next-intl
const nextConfigWithIntl = withNextIntl(nextConfig);

// Aplicar configuração do Sentry se DSN estiver configurado
const finalConfig =
  process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN
    ? withSentryConfig(nextConfigWithIntl, {
        // Configurações do Sentry + opções de build
        silent: true,
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        widenClientFileUpload: true,
        transpileClientSDK: true,
        tunnelRoute: '/monitoring',
        hideSourceMaps: true,
        disableLogger: true,
        automaticVercelMonitors: true,
      })
    : nextConfigWithIntl;

export default finalConfig;
