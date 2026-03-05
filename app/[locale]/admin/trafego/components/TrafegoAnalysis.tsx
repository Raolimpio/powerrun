'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/admin/Sidebar';
import { DashboardHeader } from '@/components/admin/DashboardHeader';
import { FilterBar } from '@/components/admin/FilterBar';
import { MetricCard } from '@/components/admin/MetricCard';
import { DataTable } from '@/components/admin/DataTable';
import { ChartCard } from '@/components/admin/ChartCard';
import { Globe, TrendingUp, Users, Clock, MousePointer, ExternalLink, Share2, Smartphone, AlertCircle } from 'lucide-react';
import { useAdminStats } from '@/hooks/useAdminStats';
import type { AdminStatsData } from '@/types/admin';

interface SourceData {
  source: string;
  count: number;
}

interface MediumData {
  medium: string;
  count: number;
}

interface DeviceData {
  device: string;
  count: number;
}

interface LocaleData {
  locale: string;
  count: number;
}

interface PathData {
  path: string;
  count: number;
  rank?: number;
}

export function TrafegoAnalysis() {
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
    
    const sources = stats.traffic?.bySources.map(s => s.source) || [];
    const devices = stats.views.byDevice.map(d => d.device) || [];
    const locales = stats.views.byLocale.map(l => l.locale) || [];

    return [
      {
        key: 'source',
        label: 'Fonte de Tráfego',
        type: 'select' as const,
        options: [...new Set(sources)],
      },
      {
        key: 'device',
        label: 'Dispositivo',
        type: 'select' as const,
        options: [...new Set(devices)],
      },
      {
        key: 'locale',
        label: 'Idioma/Região',
        type: 'select' as const,
        options: [...new Set(locales)],
      },
    ];
  }, [stats]);

  if (loading || !stats) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar locale={locale} />
        <div className="flex-1 lg:ml-64 flex items-center justify-center p-4">
          <div className="text-gray-500" role="status" aria-live="polite">Carregando análise de tráfego...</div>
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

  const bounceRate = stats.sessions ? 
    ((stats.sessions.total - stats.sessions.withConversions) / stats.sessions.total * 100).toFixed(1) : 0;
  
  const avgPagesPerSession = stats.sessions?.avgPageViews || 0;
  const avgDuration = stats.sessions?.avgDuration || 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar locale={locale} />
      
      <div className="flex-1 lg:ml-64 w-full">
        <DashboardHeader
          title="Análise de Tráfego"
          subtitle="Origem, comportamento e qualidade do tráfego"
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
          {/* Métricas Principais de Tráfego */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total de Visitas"
              value={stats.views.total.toLocaleString('pt-BR')}
              icon={Users}
              description="Visualizações de páginas"
              color="blue"
            />
            <MetricCard
              title="Sessões Únicas"
              value={stats.sessions?.total.toLocaleString('pt-BR') || '0'}
              icon={Globe}
              description="Usuários únicos"
              color="green"
            />
            <MetricCard
              title="Taxa de Rejeição"
              value={`${bounceRate}%`}
              icon={TrendingUp}
              description="Saíram sem interagir"
              color="red"
            />
            <MetricCard
              title="Duração Média"
              value={`${Math.floor(avgDuration / 60)}m ${avgDuration % 60}s`}
              icon={Clock}
              description="Tempo médio no site"
              color="gray"
            />
          </div>

          {/* Origem do Tráfego */}
          {stats.traffic && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-[#374151] mb-4">Canais de Aquisição</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Por Fonte de Tráfego" icon={Share2}>
                  <DataTable
                    data={stats.traffic.bySources.map((s: SourceData) => ({
                      ...s,
                      percentage: ((s.count / stats.views.total) * 100).toFixed(1) + '%'
                    }))}
                    columns={[
                      { 
                        key: 'source', 
                        label: 'Fonte',
                        render: (value) => {
                          const icons: Record<string, string> = {
                            'organico': '🔍',
                            'direto': '🎯',
                            'social': '📱',
                            'referral': '🔗',
                            'email': '📧'
                          };
                          return (
                            <div className="flex items-center gap-2">
                              <span>{icons[value] || '🌐'}</span>
                              <span className="capitalize font-medium">{value}</span>
                            </div>
                          );
                        }
                      },
                      { key: 'count', label: 'Visitas', align: 'right' },
                      { key: 'percentage', label: '%', align: 'right', sortable: false },
                    ]}
                  />
                </ChartCard>

                <ChartCard title="Por Meio de Comunicação" icon={ExternalLink}>
                  <DataTable
                    data={stats.traffic.byMedium.map((m: MediumData) => ({
                      ...m,
                      percentage: ((m.count / stats.views.total) * 100).toFixed(1) + '%'
                    }))}
                    columns={[
                      { 
                        key: 'medium', 
                        label: 'Meio',
                        render: (value) => <span className="capitalize font-medium">{value}</span>
                      },
                      { key: 'count', label: 'Visitas', align: 'right' },
                      { key: 'percentage', label: '%', align: 'right', sortable: false },
                    ]}
                  />
                </ChartCard>
              </div>
            </div>
          )}

          {/* Dispositivos e Comportamento */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-[#374151] mb-4">Dispositivos e Navegadores</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Dispositivos" icon={Smartphone}>
                <DataTable
                  data={stats.views.byDevice.map((d: DeviceData) => ({
                    ...d,
                    percentage: ((d.count / stats.views.total) * 100).toFixed(1) + '%'
                  }))}
                  columns={[
                    { 
                      key: 'device', 
                      label: 'Dispositivo',
                      render: (value) => {
                        const icons: Record<string, string> = {
                          'desktop': '💻',
                          'mobile': '📱',
                          'tablet': '📲'
                        };
                        return (
                          <div className="flex items-center gap-2">
                            <span>{icons[value] || '🖥️'}</span>
                            <span className="capitalize font-medium">{value}</span>
                          </div>
                        );
                      }
                    },
                    { key: 'count', label: 'Acessos', align: 'right' },
                    { key: 'percentage', label: '%', align: 'right', sortable: false },
                  ]}
                />
              </ChartCard>

              <ChartCard title="Idiomas / Regiões" icon={Globe}>
                <DataTable
                  data={stats.views.byLocale}
                  columns={[
                    { 
                      key: 'locale', 
                      label: 'Idioma',
                      render: (value) => {
                        const flags: Record<string, string> = {
                          'pt-BR': '🇧🇷',
                          'en': '🇺🇸',
                          'es': '🇪🇸',
                          'zh-CN': '🇨🇳'
                        };
                        return (
                          <div className="flex items-center gap-2">
                            <span>{flags[value] || '🌍'}</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        );
                      }
                    },
                    { key: 'count', label: 'Acessos', align: 'right' },
                  ]}
                />
              </ChartCard>
            </div>
          </div>

          {/* Páginas Mais Visitadas */}
          <div className="mb-8">
            <ChartCard title="Top 20 Páginas Mais Visitadas" icon={MousePointer}>
              <DataTable
                data={stats.views.byPath.slice(0, 20).map((p: PathData, idx: number) => ({
                  ...p,
                  rank: idx + 1,
                  percentage: ((p.count / stats.views.total) * 100).toFixed(2) + '%'
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
                    key: 'path', 
                    label: 'Página',
                    render: (value) => (
                      <span className="text-sm font-mono text-gray-600 truncate block max-w-md">
                        {value}
                      </span>
                    )
                  },
                  { key: 'count', label: 'Visualizações', align: 'right' },
                  { key: 'percentage', label: '% Total', align: 'right', sortable: false },
                ]}
                maxRows={20}
              />
            </ChartCard>
          </div>

          {/* Qualidade do Tráfego */}
          <div>
            <h2 className="text-lg font-semibold text-[#374151] mb-4">Qualidade do Tráfego</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title="Páginas por Sessão"
                value={avgPagesPerSession.toFixed(2)}
                icon={MousePointer}
                description="Média de páginas visitadas"
                color="blue"
              />
              <MetricCard
                title="Engajamento"
                value={stats.engagement?.avgScrollDepth ? `${stats.engagement.avgScrollDepth}%` : 'N/A'}
                icon={TrendingUp}
                description="Profundidade média de scroll"
                color="green"
              />
              <MetricCard
                title="Tempo na Página"
                value={stats.engagement?.avgPageDuration ? 
                  `${Math.floor(stats.engagement.avgPageDuration / 60)}m` : 'N/A'}
                icon={Clock}
                description="Duração média por página"
                color="gray"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

