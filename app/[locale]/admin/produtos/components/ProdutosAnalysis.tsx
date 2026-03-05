'use client';

import { useParams, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/admin/Sidebar';
import { DashboardHeader } from '@/components/admin/DashboardHeader';
import { FilterBar } from '@/components/admin/FilterBar';
import { MetricCard } from '@/components/admin/MetricCard';
import { DataTable } from '@/components/admin/DataTable';
import { ChartCard } from '@/components/admin/ChartCard';
import { useState, useEffect, useMemo } from 'react';
import { Package, Eye, MousePointerClick, TrendingUp, Award, Target, AlertCircle } from 'lucide-react';
import { useAdminStats } from '@/hooks/useAdminStats';
import { SourceComparison } from '@/components/admin/SourceComparison';
import type { AdminStatsData } from '@/types/admin';

interface ProductData {
  productId: string;
  count: number;
  rank?: number;
  percentage?: string;
  avgPerDay?: string;
}

export function ProdutosAnalysis() {
  const params = useParams();
  const router = useRouter();
  const locale = params?.locale as string || 'pt-BR';
  
  // Todos os hooks devem ser chamados antes de qualquer early return
  const [advancedFilters, setAdvancedFilters] = useState<Record<string, any>>({});
  const [sourceStats, setSourceStats] = useState<any>(null);
  const [loadingSource, setLoadingSource] = useState(true);

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
  } = useAdminStats(locale, handleLogout);

  // Buscar dados por origem
  useEffect(() => {
    const fetchSourceStats = async () => {
      try {
        let url = `/api/admin/stats-by-source?period=${period}`;
        if (period === 'custom' && startDate && endDate) {
          const start = startDate.toISOString().split('T')[0];
          const end = endDate.toISOString().split('T')[0];
          url = `/api/admin/stats-by-source?period=custom&startDate=${start}&endDate=${end}`;
        }
        url += `&_t=${Date.now()}`;
        
        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setSourceStats(data);
        }
      } catch (error) {
        console.error('Error fetching source stats:', error);
      } finally {
        setLoadingSource(false);
      }
    };
    
    fetchSourceStats();
  }, [period, startDate, endDate]);

  // Definir filtros avançados disponíveis
  const advancedFilterOptions = useMemo(() => {
    if (!stats) return [];
    
    const products = stats.quotes.byProduct.map(p => p.productId) || [];

    return [
      {
        key: 'product',
        label: 'Produto',
        type: 'select' as const,
        options: [...new Set(products)].slice(0, 50), // Limitar a 50 para performance
      },
      {
        key: 'conversions_min',
        label: 'Conversões Mínimas',
        type: 'range' as const,
      },
    ];
  }, [stats]);

  if (loading || !stats) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar locale={locale} />
        <div className="flex-1 lg:ml-64 flex items-center justify-center p-4">
          <div className="text-gray-500" role="status" aria-live="polite">Carregando análise de produtos...</div>
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
              <AlertCircle className="w-5 h-5 text-red-600" aria-hidden="true" />
              <h3 className="font-semibold text-red-800">Erro ao carregar dados</h3>
            </div>
            <p className="text-sm text-red-700 mb-4">{error}</p>
            <button
              onClick={refresh}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              aria-label="Tentar carregar dados novamente"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalProducts = stats.quotes.byProduct.length;
  const totalConversions = stats.quotes.total;
  const topProduct = stats.quotes.byProduct[0];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar locale={locale} />
      
      <div className="flex-1 lg:ml-64 w-full">
        <DashboardHeader
          title="Análise de Produtos"
          subtitle="Ranking e performance dos produtos"
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
          advancedFilters={advancedFilterOptions}
          onAdvancedFiltersChange={setAdvancedFilters}
        />

        <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6">
          {/* Métricas Principais de Produtos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Produtos com Interesse"
              value={totalProducts.toString()}
              icon={Package}
              description="Produtos que receberam cliques"
              color="blue"
            />
            <MetricCard
              title="Total de Conversões"
              value={totalConversions.toLocaleString('pt-BR')}
              icon={MousePointerClick}
              description="Cliques em orçamentos"
              color="red"
            />
            <MetricCard
              title="Produto Mais Popular"
              value={topProduct?.productId || 'N/A'}
              icon={Award}
              description={`${topProduct?.count || 0} conversões`}
              color="green"
            />
            <MetricCard
              title="Conversão Média"
              value={(totalConversions / totalProducts).toFixed(1)}
              icon={Target}
              description="Por produto"
              color="gray"
            />
          </div>

          {/* Top 10 Produtos - Destaque */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-[#374151] mb-4">Top 10 Produtos Mais Convertidos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {stats.quotes.byProduct.slice(0, 10).map((product: ProductData, idx: number) => (
                <div
                  key={product.productId}
                  className={`
                    p-6 rounded-xl border-2 transition-all hover:shadow-lg
                    ${idx === 0 ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-400' :
                      idx === 1 ? 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-400' :
                      idx === 2 ? 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-400' :
                      'bg-white border-gray-200'}
                  `}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-3xl font-bold ${
                      idx === 0 ? 'text-yellow-700' :
                      idx === 1 ? 'text-gray-700' :
                      idx === 2 ? 'text-orange-700' :
                      'text-[#374151]'
                    }`}>
                      #{idx + 1}
                    </span>
                    {idx < 3 && (
                      <Award className={`w-6 h-6 ${
                        idx === 0 ? 'text-yellow-600' :
                        idx === 1 ? 'text-gray-600' :
                        'text-orange-600'
                      }`} />
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-[#374151] mb-2">{product.productId}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-[#9c1006]">{product.count}</span>
                    <span className="text-xs text-gray-500">conversões</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    {((product.count / totalConversions) * 100).toFixed(1)}% do total
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ranking Completo de Produtos */}
          <div className="mb-8">
            <ChartCard title="Ranking Completo de Produtos" icon={Package}>
              <DataTable
                data={stats.quotes.byProduct.map((p: ProductData, idx: number) => ({
                  ...p,
                  rank: idx + 1,
                  percentage: ((p.count / totalConversions) * 100).toFixed(2) + '%',
                  avgPerDay: (p.count / 30).toFixed(1)
                }))}
                columns={[
                  { 
                    key: 'rank', 
                    label: '#', 
                    align: 'center',
                    render: (value) => (
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                        value === 1 ? 'bg-yellow-100 text-yellow-700' :
                        value === 2 ? 'bg-gray-100 text-gray-700' :
                        value === 3 ? 'bg-orange-100 text-orange-700' :
                        value <= 10 ? 'bg-blue-50 text-blue-700' :
                        'bg-gray-50 text-gray-500'
                      }`}>
                        {value}
                      </div>
                    )
                  },
                  { 
                    key: 'productId', 
                    label: 'Produto',
                    render: (value, row) => (
                      <div>
                        <div className="font-bold text-[#374151]">{value}</div>
                        <div className="text-xs text-gray-500">Média: {row.avgPerDay} conversões/dia</div>
                      </div>
                    )
                  },
                  { 
                    key: 'count', 
                    label: 'Conversões', 
                    align: 'right',
                    render: (value) => <span className="font-bold text-[#9c1006] text-lg">{value}</span>
                  },
                  { 
                    key: 'percentage', 
                    label: '% Total', 
                    align: 'right', 
                    sortable: false,
                    render: (value) => <span className="font-semibold text-gray-700">{value}</span>
                  },
                ]}
                maxRows={50}
              />
            </ChartCard>
          </div>

          {/* Análise por Categoria */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-[#374151] mb-4">Análise por Linha de Produto</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Red Line */}
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#9c1006] rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#9c1006]">Red Line</h3>
                    <p className="text-xs text-gray-600">Linha Básica</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {stats.quotes.byProduct
                    .filter((p: ProductData) => p.productId.startsWith('PR'))
                    .slice(0, 5)
                    .map((p: ProductData) => (
                      <div key={p.productId} className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">{p.productId}</span>
                        <span className="font-bold text-[#9c1006]">{p.count}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Blue Line */}
              <div className="bg-cyan-50 border-2 border-cyan-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#61fbfe] rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#61fbfe]">Blue Line</h3>
                    <p className="text-xs text-gray-600">Linha Premium</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {stats.quotes.byProduct
                    .filter((p: ProductData) => p.productId.startsWith('Power'))
                    .slice(0, 5)
                    .map((p: ProductData) => (
                      <div key={p.productId} className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">{p.productId}</span>
                        <span className="font-bold text-[#61fbfe]">{p.count}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Performance Geral */}
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-green-700">Performance</h3>
                    <p className="text-xs text-gray-600">Estatísticas Gerais</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-600">Média de Conversões</p>
                    <p className="text-2xl font-bold text-green-700">
                      {(totalConversions / totalProducts).toFixed(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Produto Top</p>
                    <p className="text-sm font-bold text-[#374151]">{topProduct?.productId}</p>
                    <p className="text-xs text-gray-500">{topProduct?.count} conversões</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Análise por Origem */}
          {sourceStats && !loadingSource && (
            <SourceComparison
              views={sourceStats.views}
              conversions={sourceStats.conversions}
              conversionRates={sourceStats.conversionRates}
              products={sourceStats.products}
            />
          )}

          {/* Produtos com Baixa Performance */}
          <div>
            <h2 className="text-lg font-semibold text-[#374151] mb-4">Produtos com Oportunidade de Melhoria</h2>
            <ChartCard title="Produtos com Menos de 5 Conversões" icon={Target}>
              <DataTable
                data={stats.quotes.byProduct
                  .filter((p: ProductData) => p.count < 5)
                  .map((p: ProductData, idx: number) => ({
                    ...p,
                    rank: idx + 1,
                  }))}
                columns={[
                  { key: 'rank', label: '#', align: 'center' },
                  { 
                    key: 'productId', 
                    label: 'Produto',
                    render: (value) => <span className="font-medium text-gray-700">{value}</span>
                  },
                  { 
                    key: 'count', 
                    label: 'Conversões', 
                    align: 'right',
                    render: (value) => <span className="text-orange-600 font-semibold">{value}</span>
                  },
                ]}
                maxRows={20}
                emptyMessage="Todos os produtos têm boa performance!"
              />
            </ChartCard>
          </div>
        </div>
      </div>
    </div>
  );
}

