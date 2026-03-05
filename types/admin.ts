/**
 * Tipos TypeScript para Painel Admin
 * 
 * Tipos fortes para substituir 'any' em todo o código admin
 */

export type Period = '7d' | '30d' | '90d' | 'all' | 'custom';

export interface AdminStatsData {
  period: string;
  generatedAt?: string;
  views: {
    total: number;
    byPath: Array<{ path: string; count: number }>;
    byLocale: Array<{ locale: string; count: number }>;
    byDevice: Array<{ device: string; count: number }>;
    byHour: Array<{ hour: number; count: number }>;
  };
  quotes: {
    total: number;
    byPage: Array<{ path: string; count: number }>;
    byType: Array<{ type: string; count: number }>;
    byProduct: Array<{ productId: string; count: number }>;
    byCity: Array<{ city: string; count: number }>;
    byState?: Array<{ state: string; cityCount: number; totalConversions: number }>;
  };
  conversion: {
    rate: number;
    views: number;
    clicks: number;
  };
  sessions?: {
    total: number;
    avgDuration: number;
    avgPageViews: number;
    withConversions: number;
    conversionRate: number;
  };
  traffic?: {
    bySources: Array<{ source: string; count: number }>;
    byMedium: Array<{ medium: string; count: number }>;
  };
  engagement?: {
    avgPageDuration: number;
    avgScrollDepth: number;
    exitPages: Array<{ path: string; count: number }>;
  };
  performance?: Array<{
    metric: string;
    rating: 'good' | 'needs-improvement' | 'poor';
    count: number;
    avgValue: number;
  }>;
  timeline?: Array<{
    date: string;
    views: number;
    conversions: number;
  }>;
}

export interface SEOStatsData {
  period: string;
  generatedAt?: string;
  summary: {
    totalSEOViews: number;
    totalNormalViews: number;
    totalSEOConversions: number;
    totalNormalConversions: number;
    seoConversionRate: number;
    normalConversionRate: number;
  };
  topPages: Array<{ path: string; views: number }>;
  topKeywords: Array<{ keyword: string; views: number }>;
  keywordConversions: Array<{
    keyword: string;
    views: number;
    conversions: number;
    conversionRate: number;
  }>;
  conversionsByCity: Array<{ city: string; conversions: number }>;
  productsBySEO: Array<{ productId: string; conversions: number }>;
}

export interface UseAdminStatsReturn {
  stats: AdminStatsData | null;
  loading: boolean;
  refreshing: boolean;
  period: Period;
  setPeriod: (period: Period) => void;
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  endDate: Date | null;
  setEndDate: (date: Date | null) => void;
  error: string | null;
  refresh: () => Promise<void>;
}

export interface UseSEOStatsReturn {
  stats: SEOStatsData | null;
  loading: boolean;
  refreshing: boolean;
  period: Period;
  setPeriod: (period: Period) => void;
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  endDate: Date | null;
  setEndDate: (date: Date | null) => void;
  error: string | null;
  refresh: () => Promise<void>;
}

