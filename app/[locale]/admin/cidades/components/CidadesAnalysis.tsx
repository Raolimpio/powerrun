'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/admin/Sidebar';
import { DashboardHeader } from '@/components/admin/DashboardHeader';
import { FilterBar } from '@/components/admin/FilterBar';
import { MetricCard } from '@/components/admin/MetricCard';
import { DataTable } from '@/components/admin/DataTable';
import { ChartCard } from '@/components/admin/ChartCard';
import { MapPin, Globe, TrendingUp, Award, Map, AlertCircle } from 'lucide-react';
import { useAdminStats } from '@/hooks/useAdminStats';
import { SourceComparison } from '@/components/admin/SourceComparison';
import type { AdminStatsData } from '@/types/admin';

interface CityData {
  city: string;
  count: number;
  rank?: number;
  percentage?: string;
}

export function CidadesAnalysis() {
  const [searchQuery, setSearchQuery] = useState('');
  const [advancedFilters, setAdvancedFilters] = useState<Record<string, any>>({});
  const params = useParams();
  const router = useRouter();
  const locale = params?.locale as string || 'pt-BR';

  const handleLogout = useCallback(async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push(`/${locale}/admin`);
  }, [locale, router]);

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
    
    const cities = stats.quotes.byCity.map(c => c.city) || [];
    const states = stats.quotes.byState?.map(s => s.state) || [];

    return [
      {
        key: 'city',
        label: 'Cidade',
        type: 'select' as const,
        options: [...new Set(cities)].slice(0, 50), // Limitar a 50 para performance
      },
      ...(states.length > 0 ? [{
        key: 'state',
        label: 'Estado',
        type: 'select' as const,
        options: [...new Set(states)],
      }] : []),
      {
        key: 'conversions_min',
        label: 'Conversões Mínimas',
        type: 'range' as const,
      },
    ];
  }, [stats]);

  // Buscar dados por origem - MOVER ANTES DOS RETURNS CONDICIONAIS
  const [sourceStats, setSourceStats] = useState<any>(null);
  const [loadingSource, setLoadingSource] = useState(true);

  useEffect(() => {
    if (!stats) return; // Só busca se stats estiver disponível
    
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
  }, [stats, period, startDate, endDate]);

  // Aplicar filtros avançados - DEVE VIR ANTES DOS EARLY RETURNS
  const filteredCities = useMemo(() => {
    if (!stats || !stats.quotes?.byCity) return [];
    
    let filtered = stats.quotes.byCity;

    // Filtro de busca
    if (searchQuery) {
      filtered = filtered.filter((c: CityData) => 
        c.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtro por cidade
    if (advancedFilters.city) {
      filtered = filtered.filter((c: CityData) => 
        c.city === advancedFilters.city
      );
    }

    // Filtro por estado (se disponível)
    if (advancedFilters.state && stats.quotes.byState) {
      const stateCities = stats.quotes.byState
        .find(s => s.state === advancedFilters.state);
      if (stateCities) {
        // Filtrar cidades do estado (aproximação)
        filtered = filtered.filter((c: CityData) => {
          // Aqui você pode melhorar a lógica de mapeamento cidade->estado
          return true; // Por enquanto, mantém todas
        });
      }
    }

    // Filtro por conversões mínimas
    if (advancedFilters.conversions_min) {
      const min = parseInt(advancedFilters.conversions_min);
      if (!isNaN(min)) {
        filtered = filtered.filter((c: CityData) => c.count >= min);
      }
    }

    // Filtro por conversões máximas
    if (advancedFilters.conversions_max) {
      const max = parseInt(advancedFilters.conversions_max);
      if (!isNaN(max)) {
        filtered = filtered.filter((c: CityData) => c.count <= max);
      }
    }

    return filtered;
  }, [stats, searchQuery, advancedFilters]);

  if (loading || !stats) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar locale={locale} />
        <div className="flex-1 lg:ml-64 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="text-gray-500 mb-2" role="status" aria-live="polite">
              Carregando análise geográfica...
            </div>
            {error && (
              <div className="text-sm text-red-600 mt-2">
                {error}
              </div>
            )}
            {!error && (
              <div className="text-xs text-gray-400 mt-2">
                Isso pode levar alguns segundos
              </div>
            )}
          </div>
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

  const totalCities = filteredCities.length;
  const totalConversions = filteredCities.reduce((sum, c) => sum + c.count, 0);
  const topCity = filteredCities[0];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar locale={locale} />
      
      <div className="flex-1 lg:ml-64 w-full">
        <DashboardHeader
          title="Análise por Cidades"
          subtitle="Distribuição geográfica das conversões"
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
          searchPlaceholder="Buscar cidade..."
          onSearch={setSearchQuery}
          advancedFilters={advancedFilterOptions}
          onAdvancedFiltersChange={setAdvancedFilters}
        />

        <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6">
          {/* Métricas Principais Geográficas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Cidades Atendidas"
              value={totalCities.toString()}
              icon={MapPin}
              description="Cidades com conversões"
              color="blue"
            />
            <MetricCard
              title="Total de Conversões"
              value={totalConversions.toLocaleString('pt-BR')}
              icon={Globe}
              description="Todas as cidades"
              color="red"
            />
            <MetricCard
              title="Cidade Top"
              value={topCity?.city || 'N/A'}
              icon={Award}
              description={`${topCity?.count || 0} conversões`}
              color="green"
            />
            <MetricCard
              title="Média por Cidade"
              value={(totalConversions / totalCities).toFixed(1)}
              icon={TrendingUp}
              description="Conversões médias"
              color="gray"
            />
          </div>

          {/* Top 10 Cidades - Cards Destacados */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-[#374151] mb-4">Top 10 Cidades</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {filteredCities.slice(0, 10).map((city: CityData, idx: number) => (
                <div
                  key={city.city}
                  className={`
                    p-6 rounded-xl border-2 transition-all hover:shadow-lg cursor-pointer
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
                    <MapPin className={`w-6 h-6 ${
                      idx === 0 ? 'text-yellow-600' :
                      idx === 1 ? 'text-gray-600' :
                      idx === 2 ? 'text-orange-600' :
                      'text-blue-600'
                    }`} />
                  </div>
                  <h3 className="text-sm font-bold text-[#374151] mb-2 truncate">{city.city}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-[#9c1006]">{city.count}</span>
                    <span className="text-xs text-gray-500">conversões</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    {((city.count / totalConversions) * 100).toFixed(1)}% do total
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ranking Completo de Cidades */}
          <div className="mb-8">
            <ChartCard title={`Ranking Completo de Cidades (${filteredCities.length} encontradas)`} icon={MapPin}>
              <DataTable
                data={filteredCities.map((c: CityData, idx: number) => ({
                  ...c,
                  rank: idx + 1,
                  percentage: ((c.count / totalConversions) * 100).toFixed(2) + '%',
                  avgPerDay: (c.count / 30).toFixed(1)
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
                    key: 'city', 
                    label: 'Cidade',
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

          {/* Análise por Estado */}
          {stats.quotes.byState && stats.quotes.byState.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-[#374151] mb-4">Análise por Estado</h2>
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <p className="text-sm text-gray-500 mb-4">
                  Top 5 Estados com Mais Conversões (baseado nas cidades)
                </p>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {stats.quotes.byState.slice(0, 5).map((estadoData, idx) => (
                    <div key={estadoData.state} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Map className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-semibold text-[#374151]">{estadoData.state}</span>
                      </div>
                      <div className="text-2xl font-bold text-[#9c1006]">
                        {estadoData.cityCount}
                      </div>
                      <div className="text-xs text-gray-500">cidades</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {estadoData.totalConversions} conversões
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Cidades com Potencial */}
          <div>
            <h2 className="text-lg font-semibold text-[#374151] mb-4">Cidades com Potencial de Crescimento</h2>
            <ChartCard title="1-2 Conversões (Oportunidade)" icon={TrendingUp}>
              <DataTable
                data={filteredCities
                  .filter((c: CityData) => c.count >= 1 && c.count <= 2)
                  .map((c: CityData, idx: number) => ({
                    ...c,
                    rank: idx + 1,
                  }))}
                columns={[
                  { key: 'rank', label: '#', align: 'center' },
                  { 
                    key: 'city', 
                    label: 'Cidade',
                    render: (value) => <span className="font-medium text-gray-700">{value}</span>
                  },
                  { 
                    key: 'count', 
                    label: 'Conversões', 
                    align: 'right',
                    render: (value) => <span className="text-blue-600 font-semibold">{value}</span>
                  },
                ]}
                maxRows={20}
                emptyMessage="Nenhuma cidade nesta faixa"
              />
            </ChartCard>
          </div>
        </div>
      </div>
    </div>
  );
}

