'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/admin/Sidebar';
import { DashboardHeader } from '@/components/admin/DashboardHeader';
import { FilterBar } from '@/components/admin/FilterBar';
import { MetricCard } from '@/components/admin/MetricCard';
import { DataTable } from '@/components/admin/DataTable';
import { ChartCard } from '@/components/admin/ChartCard';
import { TrendingUp, DollarSign, MousePointerClick, Eye, Target, AlertCircle, BarChart3 } from 'lucide-react';
import { exportAdminDataToCSV } from '@/lib/admin-export';
import type { Period } from '@/types/admin';

interface CampaignData {
  period: string;
  generatedAt?: string;
  summary: {
    paidTraffic: number;
    organicTraffic: number;
    googleAdsTraffic: number;
    googleOrganic: number;
    totalTraffic: number;
  };
  campaigns: Array<{
    campaign: string;
    visits: number;
    conversions: number;
    conversionRate: number;
  }>;
  paidSources: Array<{
    source: string;
    visits: number;
  }>;
  comparison: {
    googleAds: {
      visits: number;
      conversions: number;
    };
    googleOrganic: {
      visits: number;
      conversions: number;
    };
  };
}

export function CampanhasAnalysis() {
  const params = useParams();
  const router = useRouter();
  const locale = params?.locale as string || 'pt-BR';

  // Todos os hooks devem ser chamados antes de qualquer early return
  const [stats, setStats] = useState<CampaignData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [period, setPeriod] = useState<Period>('30d');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [advancedFilters, setAdvancedFilters] = useState<Record<string, any>>({});

  // Refs devem vir antes dos useCallback e useEffect
  const handleLogoutRef = useRef<(() => void) | null>(null);
  const fetchingRef = useRef(false);

  // Definir filtros avançados disponíveis - DEVE VIR ANTES DOS useCallback
  const advancedFilterOptions = useMemo(() => {
    if (!stats) return [];
    
    const campaigns = stats.campaigns.map(c => c.campaign) || [];
    const sources = stats.paidSources.map(s => s.source) || [];

    return [
      {
        key: 'campaign',
        label: 'Campanha',
        type: 'select' as const,
        options: [...new Set(campaigns)].slice(0, 50),
      },
      {
        key: 'source',
        label: 'Fonte Paga',
        type: 'select' as const,
        options: [...new Set(sources)],
      },
      {
        key: 'conversionRate_min',
        label: 'Taxa de Conversão Mínima (%)',
        type: 'range' as const,
      },
    ];
  }, [stats]);

  const handleLogout = useCallback(async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push(`/${locale}/admin`);
  }, [router, locale]);

  // Atualizar ref quando handleLogout mudar
  useEffect(() => {
    handleLogoutRef.current = handleLogout;
  }, [handleLogout]);

  const fetchStats = useCallback(async (isRefresh = false) => {
    // Evitar múltiplas requisições simultâneas
    if (fetchingRef.current && !isRefresh) {
      return;
    }
    
    fetchingRef.current = true;
    
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      let url = `/api/admin/campaigns?period=${period}`;
      
      if (period === 'custom' && startDate && endDate) {
        const start = startDate.toISOString().split('T')[0];
        const end = endDate.toISOString().split('T')[0];
        url = `/api/admin/campaigns?period=custom&startDate=${start}&endDate=${end}`;
      }
      
      url += `&_t=${Date.now()}`;
      
      const res = await fetch(url, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      if (res.status === 401) {
        setLoading(false);
        setRefreshing(false);
        setError('Sessão expirada. Por favor, faça login novamente.');
        if (handleLogoutRef.current) {
          handleLogoutRef.current();
        }
        fetchingRef.current = false;
        return;
      }
      
      if (!res.ok) {
        throw new Error(`Erro ao buscar dados: ${res.status}`);
      }
      
      const data = await res.json();
      setStats(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao buscar estatísticas de campanhas';
      console.error('Error fetching campaign stats:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
      fetchingRef.current = false;
    }
  }, [period, startDate, endDate]);

  const refresh = useCallback(async () => {
    await fetchStats(true);
  }, [fetchStats]);

  // Executar apenas uma vez ao montar e quando as dependências mudarem
  useEffect(() => {
    if (!fetchingRef.current) {
      fetchStats(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, startDate?.getTime(), endDate?.getTime()]);

  if (loading || !stats) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar locale={locale} />
        <div className="flex-1 lg:ml-64 flex items-center justify-center p-4">
          <div className="text-gray-500" role="status" aria-live="polite">Carregando análise de campanhas...</div>
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

  const handleExport = () => {
    if (!stats) return;

    const exportData = {
      views: {
        total: stats.summary.totalTraffic,
        byPath: [],
        byLocale: [],
        byDevice: [],
      },
      quotes: {
        total: stats.comparison.googleAds.conversions,
        byPage: [],
        byType: [],
        byProduct: [],
        byCity: [],
      },
      conversion: {
        rate:
          stats.summary.paidTraffic > 0
            ? (stats.comparison.googleAds.conversions / stats.summary.paidTraffic) * 100
            : 0,
        views: stats.summary.paidTraffic,
        clicks: stats.comparison.googleAds.conversions,
      },
      period: stats.period,
      generatedAt: stats.generatedAt,
    };

    exportAdminDataToCSV(exportData, period);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar locale={locale} />
      
      <div className="flex-1 lg:ml-64 w-full">
        <DashboardHeader
          title="Análise de Campanhas"
          subtitle="Google Ads, campanhas pagas e tráfego pago vs orgânico"
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
              title="Tráfego Pago"
              value={stats.summary.paidTraffic.toLocaleString('pt-BR')}
              icon={DollarSign}
              description="Google Ads e outras campanhas"
              color="red"
            />
            <MetricCard
              title="Tráfego Orgânico"
              value={stats.summary.organicTraffic.toLocaleString('pt-BR')}
              icon={Eye}
              description="Busca orgânica"
              color="blue"
            />
            <MetricCard
              title="Google Ads"
              value={stats.summary.googleAdsTraffic.toLocaleString('pt-BR')}
              icon={TrendingUp}
              description="Tráfego do Google Ads"
              color="green"
            />
            <MetricCard
              title="Conversões (Ads)"
              value={stats.comparison.googleAds.conversions.toLocaleString('pt-BR')}
              icon={Target}
              description="Conversões via Google Ads"
              color="gray"
            />
          </div>

          {/* Comparação Google Ads vs Orgânico */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-[#374151] mb-4">Google Ads vs Google Orgânico</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ChartCard title="Google Ads (Pago)" icon={DollarSign}>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Visitas</span>
                      <span className="text-lg font-bold text-red-600">
                        {stats.comparison.googleAds.visits.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-red-500 h-3 rounded-full" 
                        style={{ 
                          width: `${stats.summary.totalTraffic > 0 
                            ? (stats.comparison.googleAds.visits / stats.summary.totalTraffic) * 100 
                            : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Conversões</span>
                      <span className="text-lg font-bold text-green-600">
                        {stats.comparison.googleAds.conversions.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Taxa: {stats.comparison.googleAds.visits > 0 
                        ? ((stats.comparison.googleAds.conversions / stats.comparison.googleAds.visits) * 100).toFixed(2)
                        : '0.00'}%
                    </div>
                  </div>
                </div>
              </ChartCard>

              <ChartCard title="Google Orgânico" icon={Eye}>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Visitas</span>
                      <span className="text-lg font-bold text-blue-600">
                        {stats.comparison.googleOrganic.visits.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-500 h-3 rounded-full" 
                        style={{ 
                          width: `${stats.summary.totalTraffic > 0 
                            ? (stats.comparison.googleOrganic.visits / stats.summary.totalTraffic) * 100 
                            : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Análise de conversões em desenvolvimento
                  </div>
                </div>
              </ChartCard>
            </div>
          </div>

          {/* Campanhas do Google Ads */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-[#374151] mb-4">Campanhas do Google Ads</h2>
            <ChartCard title="Top Campanhas por Conversões" icon={BarChart3}>
              <DataTable
                data={stats.campaigns.slice(0, 15).map((camp, idx) => ({
                  ...camp,
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
                    key: 'campaign', 
                    label: 'Campanha',
                    render: (value) => <span className="font-semibold text-[#374151]">{value}</span>
                  },
                  { 
                    key: 'visits', 
                    label: 'Visitas', 
                    align: 'right',
                    render: (value) => <span className="font-medium text-blue-600">{value}</span>
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

          {/* Fontes de Tráfego Pago */}
          <div>
            <h2 className="text-lg font-semibold text-[#374151] mb-4">Fontes de Tráfego Pago</h2>
            <ChartCard title="Distribuição por Fonte" icon={TrendingUp}>
              <DataTable
                data={stats.paidSources.map((source, idx) => ({
                  ...source,
                  rank: idx + 1,
                  percentage: ((source.visits / stats.summary.paidTraffic) * 100).toFixed(1) + '%',
                }))}
                columns={[
                  { key: 'rank', label: '#', align: 'center' },
                  { 
                    key: 'source', 
                    label: 'Fonte',
                    render: (value) => <span className="font-medium capitalize">{value}</span>
                  },
                  { 
                    key: 'visits', 
                    label: 'Visitas', 
                    align: 'right',
                    render: (value) => <span className="font-semibold">{value}</span>
                  },
                  { 
                    key: 'percentage', 
                    label: '% Total Pago', 
                    align: 'right',
                    sortable: false
                  },
                ]}
              />
            </ChartCard>
          </div>
        </div>
      </div>
    </div>
  );
}

