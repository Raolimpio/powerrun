'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/admin/Sidebar';
import { DashboardHeader } from '@/components/admin/DashboardHeader';
import { FilterBar } from '@/components/admin/FilterBar';
import { MetricCard } from '@/components/admin/MetricCard';
import { DataTable } from '@/components/admin/DataTable';
import { ChartCard } from '@/components/admin/ChartCard';
import { Target, TrendingUp, MousePointerClick, MapPin, Package, DollarSign, AlertCircle, Eye } from 'lucide-react';
import { useAdminStats } from '@/hooks/useAdminStats';
import { SourceComparison } from '@/components/admin/SourceComparison';
import type { AdminStatsData } from '@/types/admin';

interface ProductData {
  productId: string;
  count: number;
  rank?: number;
  percentage?: string;
}

interface CityData {
  city: string;
  count: number;
  rank?: number;
  percentage?: string;
}

interface TypeData {
  type: string;
  count: number;
  percentage?: string;
}

export function ConversoesAnalysis() {
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
  } = useAdminStats(locale, handleLogout);

  // Definir filtros avançados disponíveis
  const advancedFilterOptions = useMemo(() => {
    if (!stats) return [];
    
    const types = stats.quotes.byType.map(t => t.type) || [];
    const products = stats.quotes.byProduct.map(p => p.productId) || [];
    const cities = stats.quotes.byCity.map(c => c.city) || [];

    return [
      {
        key: 'type',
        label: 'Tipo de Página',
        type: 'select' as const,
        options: [...new Set(types)],
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

  // Buscar dados por origem - MOVER ANTES DOS EARLY RETURNS
  const [sourceStats, setSourceStats] = useState<any>(null);
  const [loadingSource, setLoadingSource] = useState(true);

  useEffect(() => {
    if (!period) return;
    
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

  if (loading || !stats) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar locale={locale} />
        <div className="flex-1 lg:ml-64 flex items-center justify-center p-4">
          <div className="text-gray-500" role="status" aria-live="polite">Carregando análise de conversões...</div>
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

  const conversionRate = stats.conversion.rate;
  const totalClicks = stats.quotes.total;
  const totalViews = stats.views.total;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar locale={locale} />
      
      <div className="flex-1 lg:ml-64 w-full">
        <DashboardHeader
          title="Análise de Conversões"
          subtitle="Funil de conversão e orçamentos solicitados"
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
          {/* Métricas Principais de Conversão */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Taxa de Conversão"
              value={`${conversionRate.toFixed(2)}%`}
              icon={Target}
              description="Cliques / Visualizações"
              color="green"
            />
            <MetricCard
              title="Total de Cliques"
              value={totalClicks.toLocaleString('pt-BR')}
              icon={MousePointerClick}
              description="Orçamentos solicitados"
              color="red"
            />
            <MetricCard
              title="Conversões/Dia"
              value={(totalClicks / (period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 1)).toFixed(1)}
              icon={DollarSign}
              description="Média diária de conversões"
              color="blue"
            />
            <MetricCard
              title="Visualizações Totais"
              value={totalViews.toLocaleString('pt-BR')}
              icon={Eye}
              description="Total de visitantes"
              color="gray"
            />
          </div>

          {/* Funil de Conversão */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-[#374151] mb-4">Funil de Conversão</h2>
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <div className="space-y-4">
                {/* Etapa 1 */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">1. Visitantes</span>
                    <span className="text-lg font-bold text-[#374151]">{totalViews.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-500 h-3 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <span className="text-xs text-gray-500 mt-1 block">100% do tráfego</span>
                </div>

                {/* Etapa 2 */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">2. Páginas de Produto</span>
                    <span className="text-lg font-bold text-[#374151]">
                      {Math.round(totalViews * 0.45).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <span className="text-xs text-gray-500 mt-1 block">45% visualizaram produtos</span>
                </div>

                {/* Etapa 3 */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">3. Cliques em Orçamento</span>
                    <span className="text-lg font-bold text-[#9c1006]">{totalClicks.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-[#9c1006] h-3 rounded-full" style={{ width: `${conversionRate}%` }}></div>
                  </div>
                  <span className="text-xs text-gray-500 mt-1 block">{conversionRate.toFixed(2)}% converteram</span>
                </div>
              </div>
            </div>
          </div>

          {/* Produtos que Mais Convertem */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-[#374151] mb-4">Produtos que Mais Convertem</h2>
            <ChartCard title="Top 15 Produtos" icon={Package}>
              <DataTable
                data={stats.quotes.byProduct.slice(0, 15).map((p: ProductData, idx: number) => ({
                  ...p,
                  rank: idx + 1,
                  percentage: ((p.count / totalClicks) * 100).toFixed(1) + '%'
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
                    key: 'productId', 
                    label: 'Produto',
                    render: (value) => <span className="font-semibold text-[#374151]">{value}</span>
                  },
                  { 
                    key: 'count', 
                    label: 'Conversões', 
                    align: 'right',
                    render: (value) => <span className="font-bold text-[#9c1006]">{value}</span>
                  },
                  { key: 'percentage', label: '% Total', align: 'right', sortable: false },
                ]}
                maxRows={15}
              />
            </ChartCard>
          </div>

          {/* Cidades que Mais Convertem */}
          {stats.quotes.byCity.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-[#374151] mb-4">Cidades que Mais Convertem</h2>
              <ChartCard title="Top 15 Cidades" icon={MapPin}>
                <DataTable
                  data={stats.quotes.byCity.slice(0, 15).map((c: CityData, idx: number) => ({
                    ...c,
                    rank: idx + 1,
                    percentage: ((c.count / totalClicks) * 100).toFixed(1) + '%'
                  }))}
                  columns={[
                    { 
                      key: 'rank', 
                      label: '#', 
                      align: 'center',
                      render: (value) => (
                        <span className={`font-bold ${value <= 3 ? 'text-[#9c1006]' : 'text-gray-500'}`}>
                          {value}
                        </span>
                      )
                    },
                    { 
                      key: 'city', 
                      label: 'Cidade',
                      render: (value) => <span className="font-medium text-[#374151]">{value}</span>
                    },
                    { 
                      key: 'count', 
                      label: 'Conversões', 
                      align: 'right',
                      render: (value) => <span className="font-semibold text-[#9c1006]">{value}</span>
                    },
                    { key: 'percentage', label: '% Total', align: 'right', sortable: false },
                  ]}
                  maxRows={15}
                />
              </ChartCard>
            </div>
          )}

          {/* Análise por Origem */}
          {sourceStats && !loadingSource && (
            <SourceComparison
              views={sourceStats.views}
              conversions={sourceStats.conversions}
              conversionRates={sourceStats.conversionRates}
              products={sourceStats.products}
              cities={sourceStats.cities}
            />
          )}

          {/* Tipos de Conversão */}
          <div>
            <h2 className="text-lg font-semibold text-[#374151] mb-4">Tipos de Conversão</h2>
            <ChartCard title="Por Tipo de Página" icon={MousePointerClick}>
              <DataTable
                data={stats.quotes.byType.map((t: TypeData) => ({
                  ...t,
                  percentage: ((t.count / totalClicks) * 100).toFixed(1) + '%'
                }))}
                columns={[
                  { 
                    key: 'type', 
                    label: 'Tipo',
                    render: (value) => {
                      const types: Record<string, string> = {
                        'normal': 'Página Normal',
                        'seo': 'Página SEO',
                        'landing': 'Landing Page'
                      };
                      return <span className="capitalize font-medium">{types[value as string] || value}</span>;
                    }
                  },
                  { key: 'count', label: 'Conversões', align: 'right' },
                  { key: 'percentage', label: '% Total', align: 'right', sortable: false },
                ]}
              />
            </ChartCard>
          </div>
        </div>
      </div>
    </div>
  );
}

