'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/admin/Sidebar';
import { DashboardHeader } from '@/components/admin/DashboardHeader';
import { FilterBar } from '@/components/admin/FilterBar';
import { ChartCard } from '@/components/admin/ChartCard';
import { Zap, Clock, Activity, TrendingUp, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { useAdminStats } from '@/hooks/useAdminStats';
import type { AdminStatsData } from '@/types/admin';

interface PerformanceMetric {
  metric: string;
  rating: 'good' | 'needs-improvement' | 'poor';
  count: number;
  avgValue: number;
}

export function PerformanceAnalysis() {
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
    if (!stats || !stats.performance) return [];
    
    const metrics = stats.performance.map(p => p.metric) || [];
    const ratings = ['good', 'needs-improvement', 'poor'];

    return [
      {
        key: 'metric',
        label: 'Métrica',
        type: 'select' as const,
        options: [...new Set(metrics)],
      },
      {
        key: 'rating',
        label: 'Classificação',
        type: 'select' as const,
        options: ratings,
      },
    ];
  }, [stats]);

  if (loading || !stats) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar locale={locale} />
        <div className="flex-1 lg:ml-64 flex items-center justify-center p-4">
          <div className="text-gray-500" role="status" aria-live="polite">Carregando análise de performance...</div>
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

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good':
        return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: CheckCircle };
      case 'needs-improvement':
        return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', icon: AlertTriangle };
      default:
        return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: AlertTriangle };
    }
  };

  const getRatingLabel = (rating: string) => {
    switch (rating) {
      case 'good':
        return 'Bom';
      case 'needs-improvement':
        return 'Precisa Melhorar';
      default:
        return 'Ruim';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar locale={locale} />
      
      <div className="flex-1 lg:ml-64 w-full">
        <DashboardHeader
          title="Análise de Performance"
          subtitle="Core Web Vitals e métricas de velocidade"
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
          {/* Resumo de Performance */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
                <div>
                  <h2 className="text-lg font-bold text-[#374151]">Pontuação Geral de Performance</h2>
                  <p className="text-sm text-gray-600">Baseado nos Core Web Vitals</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Métricas Monitoradas</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-blue-600">
                      {stats.performance?.length || 0}
                    </span>
                    <span className="text-sm text-gray-500">métricas</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Métricas Boas</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-blue-600">
                      {stats.performance?.filter((p: PerformanceMetric) => p.rating === 'good').length || 0}
                    </span>
                    <span className="text-sm text-gray-500">de {stats.performance?.length || 5}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status Geral</p>
                  <span className="inline-block px-4 py-2 bg-green-100 text-green-700 font-bold rounded-lg">
                    APROVADO
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Core Web Vitals Detalhado */}
          {stats.performance && stats.performance.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-[#374151] mb-4">Core Web Vitals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.performance.map((perf: PerformanceMetric, idx: number) => {
                  const colors = getRatingColor(perf.rating);
                  const Icon = colors.icon;
                  
                  return (
                    <div
                      key={idx}
                      className={`${colors.bg} border-2 ${colors.border} rounded-xl p-6 hover:shadow-lg transition-all`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                            {perf.metric}
                          </h3>
                          <div className="flex items-baseline gap-2">
                            <span className={`text-4xl font-bold ${colors.text}`}>
                              {perf.metric === 'CLS' ? perf.avgValue.toFixed(3) : Math.round(perf.avgValue)}
                            </span>
                            <span className="text-sm text-gray-500">
                              {perf.metric === 'CLS' ? '' : 'ms'}
                            </span>
                          </div>
                        </div>
                        <Icon className={`w-8 h-8 ${colors.text}`} />
                      </div>
                      
                      <div className={`inline-block px-3 py-1 ${colors.bg} border ${colors.border} rounded-full`}>
                        <span className={`text-xs font-bold ${colors.text}`}>
                          {getRatingLabel(perf.rating)}
                        </span>
                      </div>
                      
                      <div className="mt-4 text-xs text-gray-600">
                        {perf.count.toLocaleString('pt-BR')} medições
                      </div>

                      {/* Limites de Referência */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-2">Limites de Referência:</p>
                        <div className="text-xs space-y-1">
                          {perf.metric === 'LCP' && (
                            <>
                              <div className="flex justify-between">
                                <span className="text-green-600">Bom:</span>
                                <span>&lt; 2500ms</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-red-600">Ruim:</span>
                                <span>&gt; 4000ms</span>
                              </div>
                            </>
                          )}
                          {perf.metric === 'FID' && (
                            <>
                              <div className="flex justify-between">
                                <span className="text-green-600">Bom:</span>
                                <span>&lt; 100ms</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-red-600">Ruim:</span>
                                <span>&gt; 300ms</span>
                              </div>
                            </>
                          )}
                          {perf.metric === 'CLS' && (
                            <>
                              <div className="flex justify-between">
                                <span className="text-green-600">Bom:</span>
                                <span>&lt; 0.1</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-red-600">Ruim:</span>
                                <span>&gt; 0.25</span>
                              </div>
                            </>
                          )}
                          {perf.metric === 'TTFB' && (
                            <>
                              <div className="flex justify-between">
                                <span className="text-green-600">Bom:</span>
                                <span>&lt; 800ms</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-red-600">Ruim:</span>
                                <span>&gt; 1800ms</span>
                              </div>
                            </>
                          )}
                          {perf.metric === 'FCP' && (
                            <>
                              <div className="flex justify-between">
                                <span className="text-green-600">Bom:</span>
                                <span>&lt; 1800ms</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-red-600">Ruim:</span>
                                <span>&gt; 3000ms</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Explicação dos Core Web Vitals */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-[#374151] mb-4">O que significa cada métrica?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ChartCard title="Métricas de Carregamento" icon={Clock}>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-[#374151] mb-1">LCP - Largest Contentful Paint</h4>
                    <p className="text-sm text-gray-600">
                      Tempo até o maior elemento visível ser carregado. Mede a velocidade de carregamento percebida.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#374151] mb-1">FCP - First Contentful Paint</h4>
                    <p className="text-sm text-gray-600">
                      Tempo até o primeiro conteúdo aparecer na tela. Primeira impressão visual.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#374151] mb-1">TTFB - Time to First Byte</h4>
                    <p className="text-sm text-gray-600">
                      Tempo até receber o primeiro byte do servidor. Mede a resposta do servidor.
                    </p>
                  </div>
                </div>
              </ChartCard>

              <ChartCard title="Métricas de Interatividade" icon={Activity}>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-[#374151] mb-1">FID - First Input Delay</h4>
                    <p className="text-sm text-gray-600">
                      Tempo até o site responder à primeira interação do usuário. Mede a responsividade.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#374151] mb-1">CLS - Cumulative Layout Shift</h4>
                    <p className="text-sm text-gray-600">
                      Medida de estabilidade visual. Quanto menor, menos elementos "pulam" na página durante o carregamento.
                    </p>
                  </div>
                </div>
              </ChartCard>
            </div>
          </div>

          {/* Recomendações */}
          <div>
            <h2 className="text-lg font-semibold text-[#374151] mb-4">Recomendações de Otimização</h2>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-[#374151]">Otimizar Imagens</h4>
                    <p className="text-sm text-gray-600">Use formatos modernos (WebP) e lazy loading para imagens.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-[#374151]">Minimizar JavaScript</h4>
                    <p className="text-sm text-gray-600">Reduzir e comprimir arquivos JS para melhorar FID e TBT.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-[#374151]">Cache Estratégico</h4>
                    <p className="text-sm text-gray-600">Implementar cache eficiente no servidor e browser.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-[#374151]">CDN Global</h4>
                    <p className="text-sm text-gray-600">Usar CDN para reduzir latência e melhorar TTFB.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

