'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/admin/Sidebar';
import { DashboardHeader } from '@/components/admin/DashboardHeader';
import { FilterBar } from '@/components/admin/FilterBar';
import { MetricCard } from '@/components/admin/MetricCard';
import { DataTable } from '@/components/admin/DataTable';
import { ChartCard } from '@/components/admin/ChartCard';
import { Search, TrendingUp, Globe, MapPin, Package, MousePointerClick, Eye, Target, AlertCircle } from 'lucide-react';
import { exportAdminDataToCSV } from '@/lib/admin-export';
import { useSEOStats } from '@/hooks/useSEOStats';
import type { SEOStatsData } from '@/types/admin';

export function SEOAnalysis() {
  const params = useParams();
  const router = useRouter();
  const locale = params?.locale as string || 'pt-BR';
  const [advancedFilters, setAdvancedFilters] = useState<Record<string, any>>({});

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push(`/${locale}/admin`);
  };

  const {
    stats,
    loading,
    refreshing,
    period,
    setPeriod,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    error,
    refresh,
  } = useSEOStats(locale, handleLogout);

  // Definir filtros avançados disponíveis
  const advancedFilterOptions = useMemo(() => {
    if (!stats) return [];
    
    const keywords = stats.topKeywords.map(k => k.keyword) || [];
    const products = stats.productsBySEO.map(p => p.productId) || [];
    const cities = stats.conversionsByCity.map(c => c.city) || [];

    return [
      {
        key: 'keyword',
        label: 'Keyword',
        type: 'text' as const,
      },
      {
        key: 'product',
        label: 'Produto',
        type: 'select' as const,
        options: [...new Set(products)].slice(0, 50),
      },
      {
        key: 'city',
        label: 'Cidade',
        type: 'select' as const,
        options: [...new Set(cities)].slice(0, 50),
      },
    ];
  }, [stats]);

  const handleExport = () => {
    if (!stats) return;

    const exportData = {
      views: {
        total: stats.summary.totalSEOViews,
        byPath: stats.topPages.map((page) => ({
          path: page.path,
          count: page.views,
        })),
        byLocale: [],
        byDevice: [],
      },
      quotes: {
        total: stats.summary.totalSEOConversions,
        byPage: [],
        byType: [],
        byProduct: stats.productsBySEO.map((p) => ({
          productId: p.productId,
          count: p.conversions,
        })),
        byCity: stats.conversionsByCity.map((c) => ({
          city: c.city,
          count: c.conversions,
        })),
      },
      conversion: {
        rate: stats.summary.seoConversionRate,
        views: stats.summary.totalSEOViews,
        clicks: stats.summary.totalSEOConversions,
      },
      period: stats.period,
      generatedAt: stats.generatedAt,
    };

    exportAdminDataToCSV(exportData, period);
  };

  if (loading || !stats) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar locale={locale} />
        <div className="flex-1 lg:ml-64 flex items-center justify-center p-4">
          <div className="text-gray-500">Carregando análise SEO...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar locale={locale} />
        <div className="flex-1 lg:ml-64 flex items-center justify-center p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-red-800">Erro ao carregar dados SEO</h3>
            </div>
            <p className="text-sm text-red-700 mb-4">{error}</p>
            <button
              onClick={refresh}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar locale={locale} />
      
      <div className="flex-1 lg:ml-64 w-full">
        <DashboardHeader
          title="Análise de SEO"
          subtitle="Performance de keywords, URLs SEO e conversões"
          lastUpdate={stats.generatedAt ? new Date(stats.generatedAt).toLocaleString('pt-BR') : undefined}
          onRefresh={refresh}
          onLogout={handleLogout}
          refreshing={refreshing}
        />

        <FilterBar
          period={period}
          onPeriodChange={(newPeriod) => {
            setPeriod(newPeriod);
            if (newPeriod !== 'custom') {
              setStartDate(null);
              setEndDate(null);
            }
          }}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onExport={handleExport}
          advancedFilters={advancedFilterOptions}
          onAdvancedFiltersChange={setAdvancedFilters}
        />

        <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6">
          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Visualizações SEO"
              value={stats.summary.totalSEOViews.toLocaleString('pt-BR')}
              icon={Eye}
              description="Páginas SEO visitadas"
              color="blue"
            />
            <MetricCard
              title="Conversões SEO"
              value={stats.summary.totalSEOConversions.toLocaleString('pt-BR')}
              icon={MousePointerClick}
              description="Orçamentos via SEO"
              color="red"
            />
            <MetricCard
              title="Taxa de Conversão SEO"
              value={`${stats.summary.seoConversionRate.toFixed(2)}%`}
              icon={Target}
              description={`vs ${stats.summary.normalConversionRate.toFixed(2)}% normal`}
              color="green"
            />
            <MetricCard
              title="Keywords Únicas"
              value={stats.topKeywords.length.toString()}
              icon={Search}
              description="Keywords rastreadas"
              color="gray"
            />
          </div>

          {/* Comparação SEO vs Normal */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-[#374151] mb-4">Comparação SEO vs Páginas Normais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ChartCard title="Visualizações" icon={Eye}>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Páginas SEO</span>
                      <span className="text-sm font-bold text-blue-600">
                        {stats.summary.totalSEOViews.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-500 h-3 rounded-full" 
                        style={{ 
                          width: `${stats.summary.totalSEOViews + stats.summary.totalNormalViews > 0 
                            ? (stats.summary.totalSEOViews / (stats.summary.totalSEOViews + stats.summary.totalNormalViews)) * 100 
                            : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Páginas Normais</span>
                      <span className="text-sm font-bold text-gray-600">
                        {stats.summary.totalNormalViews.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gray-500 h-3 rounded-full" 
                        style={{ 
                          width: `${stats.summary.totalSEOViews + stats.summary.totalNormalViews > 0 
                            ? (stats.summary.totalNormalViews / (stats.summary.totalSEOViews + stats.summary.totalNormalViews)) * 100 
                            : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </ChartCard>

              <ChartCard title="Taxa de Conversão" icon={TrendingUp}>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">SEO</span>
                      <span className="text-sm font-bold text-green-600">
                        {stats.summary.seoConversionRate.toFixed(2)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-green-500 h-3 rounded-full" 
                        style={{ width: `${Math.min(stats.summary.seoConversionRate, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Normal</span>
                      <span className="text-sm font-bold text-gray-600">
                        {stats.summary.normalConversionRate.toFixed(2)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gray-500 h-3 rounded-full" 
                        style={{ width: `${Math.min(stats.summary.normalConversionRate, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </ChartCard>
            </div>
          </div>

          {/* Top Keywords com Conversão */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-[#374151] mb-4">Top Keywords por Taxa de Conversão</h2>
            <ChartCard title="Keywords que Mais Convertem" icon={Search}>
              <DataTable
                data={stats.keywordConversions.slice(0, 15).map((kw, idx) => ({
                  ...kw,
                  rank: idx + 1,
                }))}
                columns={[
                  { 
                    key: 'rank', 
                    label: '#', 
                    align: 'center',
                    render: (value) => (
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                        value === 1 ? 'bg-yellow-100 text-yellow-700' :
                        value === 2 ? 'bg-gray-100 text-gray-700' :
                        value === 3 ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-50 text-gray-500'
                      }`}>
                        {value}
                      </div>
                    )
                  },
                  { 
                    key: 'keyword', 
                    label: 'Keyword',
                    render: (value) => <span className="font-semibold text-[#374151]">{value}</span>
                  },
                  { 
                    key: 'views', 
                    label: 'Visualizações', 
                    align: 'right'
                  },
                  { 
                    key: 'conversions', 
                    label: 'Conversões', 
                    align: 'right',
                    render: (value) => <span className="font-bold text-[#9c1006]">{value}</span>
                  },
                  { 
                    key: 'conversionRate', 
                    label: 'Taxa (%)', 
                    align: 'right',
                    render: (value) => (
                      <span className={`font-semibold ${
                        value >= 5 ? 'text-green-600' :
                        value >= 2 ? 'text-yellow-600' :
                        'text-gray-600'
                      }`}>
                        {value}%
                      </span>
                    )
                  },
                ]}
                maxRows={15}
              />
            </ChartCard>
          </div>

          {/* Top Keywords por Visualizações */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-[#374151] mb-4">Top Keywords por Visualizações</h2>
            <ChartCard title="Keywords Mais Buscadas" icon={Globe}>
              <DataTable
                data={stats.topKeywords.slice(0, 15).map((kw, idx) => ({
                  ...kw,
                  rank: idx + 1,
                }))}
                columns={[
                  { 
                    key: 'rank', 
                    label: '#', 
                    align: 'center'
                  },
                  { 
                    key: 'keyword', 
                    label: 'Keyword',
                    render: (value) => <span className="font-medium text-[#374151]">{value}</span>
                  },
                  { 
                    key: 'views', 
                    label: 'Visualizações', 
                    align: 'right',
                    render: (value) => <span className="font-semibold text-blue-600">{value}</span>
                  },
                ]}
                maxRows={15}
              />
            </ChartCard>
          </div>

          {/* Páginas SEO Mais Visitadas */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-[#374151] mb-4">Páginas SEO Mais Visitadas</h2>
            <ChartCard title="Top 20 URLs SEO" icon={Globe}>
              <DataTable
                data={stats.topPages.map((page, idx) => ({
                  ...page,
                  rank: idx + 1,
                }))}
                columns={[
                  { 
                    key: 'rank', 
                    label: '#', 
                    align: 'center'
                  },
                  { 
                    key: 'path', 
                    label: 'URL',
                    render: (value) => (
                      <span className="text-sm font-mono text-gray-700 break-all">{value}</span>
                    )
                  },
                  { 
                    key: 'views', 
                    label: 'Visualizações', 
                    align: 'right',
                    render: (value) => <span className="font-semibold">{value}</span>
                  },
                ]}
                maxRows={20}
              />
            </ChartCard>
          </div>

          {/* Produtos e Cidades */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Produtos Mais Convertidos via SEO" icon={Package}>
              <DataTable
                data={stats.productsBySEO.slice(0, 10).map((p, idx) => ({
                  ...p,
                  rank: idx + 1,
                }))}
                columns={[
                  { key: 'rank', label: '#', align: 'center' },
                  { 
                    key: 'productId', 
                    label: 'Produto',
                    render: (value) => <span className="font-medium">{value}</span>
                  },
                  { 
                    key: 'conversions', 
                    label: 'Conversões', 
                    align: 'right',
                    render: (value) => <span className="font-bold text-[#9c1006]">{value}</span>
                  },
                ]}
                maxRows={10}
              />
            </ChartCard>

            <ChartCard title="Cidades Mais Convertidas via SEO" icon={MapPin}>
              <DataTable
                data={stats.conversionsByCity.slice(0, 10).map((c, idx) => ({
                  ...c,
                  rank: idx + 1,
                }))}
                columns={[
                  { key: 'rank', label: '#', align: 'center' },
                  { 
                    key: 'city', 
                    label: 'Cidade',
                    render: (value) => <span className="font-medium">{value}</span>
                  },
                  { 
                    key: 'conversions', 
                    label: 'Conversões', 
                    align: 'right',
                    render: (value) => <span className="font-bold text-[#9c1006]">{value}</span>
                  },
                ]}
                maxRows={10}
              />
            </ChartCard>
          </div>
        </div>
      </div>
    </div>
  );
}

