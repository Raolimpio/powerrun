'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, MousePointerClick, Eye, BarChart3, Globe, Monitor, Clock, Activity, Users, Target, AlertCircle } from 'lucide-react';
import { Sidebar } from '@/components/admin/Sidebar';
import { DashboardHeader } from '@/components/admin/DashboardHeader';
import { FilterBar } from '@/components/admin/FilterBar';
import { MetricCard } from '@/components/admin/MetricCard';
import { DataTable } from '@/components/admin/DataTable';
import { ChartCard } from '@/components/admin/ChartCard';
import { Chart } from './Chart';
import { exportAdminDataToCSV } from '@/lib/admin-export';
import { useAdminStats } from '@/hooks/useAdminStats';
import { SourceComparison } from '@/components/admin/SourceComparison';
import type { AdminStatsData } from '@/types/admin';

interface AdminStatsProps {
  onLogout: () => void;
  locale?: string;
}

export function AdminStats({ onLogout, locale = 'pt-BR' }: AdminStatsProps) {
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
  } = useAdminStats(locale, onLogout);
  
  const [searchQuery, setSearchQuery] = useState('');
  
  // Buscar dados por origem
  const [sourceStats, setSourceStats] = useState<any>(null);
  const [loadingSource, setLoadingSource] = useState(true);

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

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    onLogout();
  };

  const handleRefresh = async () => {
    await refresh();
  };

  if (loading || !stats) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar locale={locale} />
        <div className="flex-1 lg:ml-64 flex items-center justify-center p-4">
          <div className="text-gray-500">Carregando estatísticas...</div>
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
              <h3 className="font-semibold text-red-800">Erro ao carregar dados</h3>
            </div>
            <p className="text-sm text-red-700 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtrar dados baseado na busca
  const filteredPages = searchQuery
    ? stats.views.byPath.filter(p => p.path.toLowerCase().includes(searchQuery.toLowerCase()))
    : stats.views.byPath;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar locale={locale} />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 w-full">
        {/* Header */}
        <DashboardHeader
          title="Dashboard Principal"
          subtitle="Monitoramento de acesso e conversões"
          lastUpdate={stats.generatedAt ? new Date(stats.generatedAt).toLocaleString('pt-BR') : undefined}
          onRefresh={handleRefresh}
          onLogout={handleLogout}
          refreshing={refreshing}
        />

        {/* Filter Bar */}
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
          searchPlaceholder="Buscar páginas..."
          onSearch={setSearchQuery}
          onExport={() => {
            if (stats) {
              exportAdminDataToCSV(stats, period);
            }
          }}
        />

        {/* Content Area */}
        <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6">
          {/* Main Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Visualizações Totais"
              value={stats.views.total.toLocaleString('pt-BR')}
              icon={Eye}
              description={`${period === '7d' ? 'Últimos 7 dias' : period === '30d' ? 'Últimos 30 dias' : period === '90d' ? 'Últimos 90 dias' : 'Todo o período'}`}
              color="blue"
            />
            <MetricCard
              title="Cliques em Orçamentos"
              value={stats.quotes.total.toLocaleString('pt-BR')}
              icon={MousePointerClick}
              description="Total de conversões"
              color="red"
            />
            <MetricCard
              title="Taxa de Conversão"
              value={`${stats.conversion.rate.toFixed(2)}%`}
              icon={TrendingUp}
              description={`${stats.quotes.total} de ${stats.views.total} visualizações`}
              color="green"
            />
            <MetricCard
              title="Páginas Únicas"
              value={stats.views.byPath.length.toString()}
              icon={BarChart3}
              description="Páginas mais acessadas"
              color="gray"
            />
          </div>

          {/* Análise de Sessões */}
          {stats.sessions && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-[#374151] mb-4">Análise de Sessões</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <MetricCard
                  title="Total de Sessões"
                  value={stats.sessions.total.toLocaleString('pt-BR')}
                  icon={Users}
                  color="blue"
                />
                <MetricCard
                  title="Duração Média"
                  value={`${Math.floor(stats.sessions.avgDuration / 60)}m ${stats.sessions.avgDuration % 60}s`}
                  icon={Clock}
                  color="gray"
                />
                <MetricCard
                  title="Páginas/Sessão"
                  value={stats.sessions.avgPageViews.toString()}
                  icon={BarChart3}
                  color="gray"
                />
                <MetricCard
                  title="Com Conversão"
                  value={stats.sessions.withConversions.toLocaleString('pt-BR')}
                  icon={Target}
                  color="green"
                />
                <MetricCard
                  title="Taxa Conversão"
                  value={`${stats.sessions.conversionRate}%`}
                  icon={TrendingUp}
                  color="green"
                />
              </div>
            </div>
          )}

          {/* Métricas de Engajamento */}
          {stats.engagement && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-[#374151] mb-4">Métricas de Engajamento</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MetricCard
                  title="Tempo Médio na Página"
                  value={`${Math.floor(stats.engagement.avgPageDuration / 60)}m ${stats.engagement.avgPageDuration % 60}s`}
                  icon={Clock}
                  color="blue"
                />
                <MetricCard
                  title="Profundidade de Scroll"
                  value={`${stats.engagement.avgScrollDepth}%`}
                  icon={Activity}
                  color="red"
                />
              </div>
            </div>
          )}

          {/* Origem de Tráfego */}
          {stats.traffic && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-[#374151] mb-4">Origem de Tráfego</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChartCard title="Por Fonte" icon={Globe}>
                  <DataTable
                    data={stats.traffic.bySources}
                    columns={[
                      { 
                        key: 'source', 
                        label: 'Fonte',
                        render: (value) => <span className="capitalize">{value}</span>
                      },
                      { 
                        key: 'count', 
                        label: 'Visitas', 
                        align: 'right'
                      },
                    ]}
                    maxRows={5}
                  />
                </ChartCard>
                <ChartCard title="Por Meio" icon={Activity}>
                  <DataTable
                    data={stats.traffic.byMedium}
                    columns={[
                      { 
                        key: 'medium', 
                        label: 'Meio',
                        render: (value) => <span className="capitalize">{value}</span>
                      },
                      { 
                        key: 'count', 
                        label: 'Visitas', 
                        align: 'right'
                      },
                    ]}
                    maxRows={5}
                  />
                </ChartCard>
              </div>
            </div>
          )}

          {/* Performance (Core Web Vitals) */}
          {stats.performance && stats.performance.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-[#374151] mb-4">Performance (Core Web Vitals)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.performance.map((perf, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{perf.metric}</div>
                    <div className="text-3xl font-bold text-[#374151] mb-2">
                      {perf.avgValue.toFixed(0)}{perf.metric === 'CLS' ? '' : 'ms'}
                    </div>
                    <div className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                      perf.rating === 'good' 
                        ? 'bg-green-100 text-green-700' 
                        : perf.rating === 'needs-improvement' 
                        ? 'bg-yellow-100 text-yellow-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {perf.rating === 'good' ? 'Bom' : 
                       perf.rating === 'needs-improvement' ? 'Precisa melhorar' : 
                       'Ruim'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Análise por Origem */}
          {sourceStats && !loadingSource && (
            <SourceComparison
              views={sourceStats.views}
              conversions={sourceStats.conversions}
              conversionRates={sourceStats.conversionRates}
            />
          )}

          {/* Gráfico de Visualizações por Hora */}
          {stats.views.byHour.length > 0 && (
            <div className="mb-8">
              <ChartCard title="Visualizações por Hora do Dia" icon={Activity}>
                <Chart data={stats.views.byHour} />
              </ChartCard>
            </div>
          )}

          {/* Tabelas de Análise */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Páginas Mais Acessadas */}
            <ChartCard title="Páginas Mais Acessadas" icon={BarChart3}>
              <DataTable
                data={filteredPages}
                columns={[
                  { key: 'path', label: 'Página' },
                  { key: 'count', label: 'Visualizações', align: 'right' },
                ]}
                maxRows={10}
              />
            </ChartCard>

            {/* Cliques por Tipo de Página */}
            <ChartCard title="Cliques por Tipo" icon={MousePointerClick}>
              <DataTable
                data={stats.quotes.byType}
                columns={[
                  { 
                    key: 'type', 
                    label: 'Tipo',
                    render: (value) => <span className="capitalize">{value}</span>
                  },
                  { key: 'count', label: 'Cliques', align: 'right' },
                ]}
                maxRows={10}
              />
            </ChartCard>
          </div>

          {/* Dispositivos e Locales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartCard title="Dispositivos" icon={Monitor}>
              <DataTable
                data={stats.views.byDevice}
                columns={[
                  { 
                    key: 'device', 
                    label: 'Dispositivo',
                    render: (value) => <span className="capitalize">{value}</span>
                  },
                  { key: 'count', label: 'Visualizações', align: 'right' },
                ]}
                maxRows={10}
              />
            </ChartCard>

            <ChartCard title="Idiomas" icon={Globe}>
              <DataTable
                data={stats.views.byLocale}
                columns={[
                  { key: 'locale', label: 'Idioma' },
                  { key: 'count', label: 'Visualizações', align: 'right' },
                ]}
                maxRows={10}
              />
            </ChartCard>
          </div>

          {/* Produtos e Cidades Mais Convertidos */}
          {stats.quotes.byProduct.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Produtos Mais Convertidos" icon={TrendingUp}>
                <DataTable
                  data={stats.quotes.byProduct}
                  columns={[
                    { key: 'productId', label: 'Produto' },
                    { key: 'count', label: 'Cliques', align: 'right' },
                  ]}
                  maxRows={10}
                />
              </ChartCard>

              {stats.quotes.byCity.length > 0 && (
                <ChartCard title="Cidades Mais Convertidas" icon={Globe}>
                  <DataTable
                    data={stats.quotes.byCity}
                    columns={[
                      { key: 'city', label: 'Cidade' },
                      { key: 'count', label: 'Cliques', align: 'right' },
                    ]}
                    maxRows={10}
                  />
                </ChartCard>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

