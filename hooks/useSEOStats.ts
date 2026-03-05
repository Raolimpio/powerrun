'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { SEOStatsData, Period, UseSEOStatsReturn } from '@/types/admin';

/**
 * Hook centralizado para buscar estatísticas SEO
 */
export function useSEOStats(
  locale: string,
  onLogout?: () => void
): UseSEOStatsReturn {
  const [stats, setStats] = useState<SEOStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [period, setPeriod] = useState<Period>('30d');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Usar ref para onLogout para evitar re-criação do fetchStats
  const onLogoutRef = useRef(onLogout);
  useEffect(() => {
    onLogoutRef.current = onLogout;
  }, [onLogout]);

  // Flag para evitar múltiplas requisições simultâneas
  const fetchingRef = useRef(false);

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
      let url = `/api/admin/seo?period=${period}`;
      
      if (period === 'custom' && startDate && endDate) {
        const start = startDate.toISOString().split('T')[0];
        const end = endDate.toISOString().split('T')[0];
        url = `/api/admin/seo?period=custom&startDate=${start}&endDate=${end}`;
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
        if (onLogoutRef.current) {
          onLogoutRef.current();
        }
        fetchingRef.current = false;
        return;
      }
      
      if (!res.ok) {
        throw new Error(`Erro ao buscar dados SEO: ${res.status}`);
      }
      
      const data = await res.json();
      setStats(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao buscar estatísticas SEO';
      console.error('Error fetching SEO stats:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
      fetchingRef.current = false;
    }
  }, [period, startDate, endDate]);

  // Executar apenas uma vez ao montar e quando as dependências mudarem
  useEffect(() => {
    if (!fetchingRef.current) {
      fetchStats(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, startDate?.getTime(), endDate?.getTime()]);

  const refresh = useCallback(async () => {
    await fetchStats(true);
  }, [fetchStats]);

  return {
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
  };
}

