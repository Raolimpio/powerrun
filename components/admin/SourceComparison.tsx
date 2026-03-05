'use client';

import { Search, Globe, DollarSign } from 'lucide-react';
import { ChartCard } from './ChartCard';
import { DataTable } from './DataTable';

interface SourceComparisonProps {
  views: {
    seo: number;
    organic: number;
    paid: number;
  };
  conversions: {
    seo: number;
    organic: number;
    paid: number;
  };
  conversionRates: {
    seo: number;
    organic: number;
    paid: number;
  };
  products?: {
    seo: Array<{ productId: string; count: number }>;
    organic: Array<{ productId: string; count: number }>;
    paid: Array<{ productId: string; count: number }>;
  };
  cities?: {
    seo: Array<{ city: string; count: number }>;
    organic: Array<{ city: string; count: number }>;
    paid: Array<{ city: string; count: number }>;
  };
}

export function SourceComparison({ 
  views, 
  conversions, 
  conversionRates,
  products,
  cities 
}: SourceComparisonProps) {
  const totalViews = views.seo + views.organic + views.paid;
  const totalConversions = conversions.seo + conversions.organic + conversions.paid;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-[#374151] mb-4">Análise por Origem de Tráfego</h2>
      
      {/* Comparação Visual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* SEO */}
        <ChartCard title="SEO" icon={Search}>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Visualizações</span>
                <span className="text-sm font-bold text-blue-600">{views.seo.toLocaleString('pt-BR')}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${totalViews > 0 ? (views.seo / totalViews) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Conversões</span>
                <span className="text-sm font-bold text-[#9c1006]">{conversions.seo.toLocaleString('pt-BR')}</span>
              </div>
              <div className="text-xs text-gray-500">
                Taxa: {conversionRates.seo.toFixed(2)}%
              </div>
            </div>
          </div>
        </ChartCard>

        {/* Orgânico */}
        <ChartCard title="Orgânico" icon={Globe}>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Visualizações</span>
                <span className="text-sm font-bold text-green-600">{views.organic.toLocaleString('pt-BR')}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${totalViews > 0 ? (views.organic / totalViews) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Conversões</span>
                <span className="text-sm font-bold text-[#9c1006]">{conversions.organic.toLocaleString('pt-BR')}</span>
              </div>
              <div className="text-xs text-gray-500">
                Taxa: {conversionRates.organic.toFixed(2)}%
              </div>
            </div>
          </div>
        </ChartCard>

        {/* Pago */}
        <ChartCard title="Pago (Google Ads)" icon={DollarSign}>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Visualizações</span>
                <span className="text-sm font-bold text-red-600">{views.paid.toLocaleString('pt-BR')}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ width: `${totalViews > 0 ? (views.paid / totalViews) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Conversões</span>
                <span className="text-sm font-bold text-[#9c1006]">{conversions.paid.toLocaleString('pt-BR')}</span>
              </div>
              <div className="text-xs text-gray-500">
                Taxa: {conversionRates.paid.toFixed(2)}%
              </div>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Produtos por Origem */}
      {products && (
        <div className="mb-6">
          <h3 className="text-md font-semibold text-[#374151] mb-4">Top Produtos por Origem</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ChartCard title="SEO" icon={Search} >
              <DataTable
                data={products.seo.slice(0, 10).map((p, idx) => ({
                  ...p,
                  rank: idx + 1,
                }))}
                columns={[
                  { key: 'rank', label: '#', align: 'center' },
                  { 
                    key: 'productId', 
                    label: 'Produto',
                    render: (value) => <span className="text-sm font-medium">{value}</span>
                  },
                  { 
                    key: 'count', 
                    label: 'Conv.', 
                    align: 'right',
                    render: (value) => <span className="font-semibold text-[#9c1006]">{value}</span>
                  },
                ]}
                maxRows={10}
              />
            </ChartCard>

            <ChartCard title="Orgânico" icon={Globe} >
              <DataTable
                data={products.organic.slice(0, 10).map((p, idx) => ({
                  ...p,
                  rank: idx + 1,
                }))}
                columns={[
                  { key: 'rank', label: '#', align: 'center' },
                  { 
                    key: 'productId', 
                    label: 'Produto',
                    render: (value) => <span className="text-sm font-medium">{value}</span>
                  },
                  { 
                    key: 'count', 
                    label: 'Conv.', 
                    align: 'right',
                    render: (value) => <span className="font-semibold text-[#9c1006]">{value}</span>
                  },
                ]}
                maxRows={10}
              />
            </ChartCard>

            <ChartCard title="Pago" icon={DollarSign} >
              <DataTable
                data={products.paid.slice(0, 10).map((p, idx) => ({
                  ...p,
                  rank: idx + 1,
                }))}
                columns={[
                  { key: 'rank', label: '#', align: 'center' },
                  { 
                    key: 'productId', 
                    label: 'Produto',
                    render: (value) => <span className="text-sm font-medium">{value}</span>
                  },
                  { 
                    key: 'count', 
                    label: 'Conv.', 
                    align: 'right',
                    render: (value) => <span className="font-semibold text-[#9c1006]">{value}</span>
                  },
                ]}
                maxRows={10}
              />
            </ChartCard>
          </div>
        </div>
      )}

      {/* Cidades por Origem */}
      {cities && (
        <div>
          <h3 className="text-md font-semibold text-[#374151] mb-4">Top Cidades por Origem</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ChartCard title="SEO" icon={Search} >
              <DataTable
                data={cities.seo.slice(0, 10).map((c, idx) => ({
                  ...c,
                  rank: idx + 1,
                }))}
                columns={[
                  { key: 'rank', label: '#', align: 'center' },
                  { 
                    key: 'city', 
                    label: 'Cidade',
                    render: (value) => <span className="text-sm font-medium">{value}</span>
                  },
                  { 
                    key: 'count', 
                    label: 'Conv.', 
                    align: 'right',
                    render: (value) => <span className="font-semibold text-[#9c1006]">{value}</span>
                  },
                ]}
                maxRows={10}
              />
            </ChartCard>

            <ChartCard title="Orgânico" icon={Globe} >
              <DataTable
                data={cities.organic.slice(0, 10).map((c, idx) => ({
                  ...c,
                  rank: idx + 1,
                }))}
                columns={[
                  { key: 'rank', label: '#', align: 'center' },
                  { 
                    key: 'city', 
                    label: 'Cidade',
                    render: (value) => <span className="text-sm font-medium">{value}</span>
                  },
                  { 
                    key: 'count', 
                    label: 'Conv.', 
                    align: 'right',
                    render: (value) => <span className="font-semibold text-[#9c1006]">{value}</span>
                  },
                ]}
                maxRows={10}
              />
            </ChartCard>

            <ChartCard title="Pago" icon={DollarSign} >
              <DataTable
                data={cities.paid.slice(0, 10).map((c, idx) => ({
                  ...c,
                  rank: idx + 1,
                }))}
                columns={[
                  { key: 'rank', label: '#', align: 'center' },
                  { 
                    key: 'city', 
                    label: 'Cidade',
                    render: (value) => <span className="text-sm font-medium">{value}</span>
                  },
                  { 
                    key: 'count', 
                    label: 'Conv.', 
                    align: 'right',
                    render: (value) => <span className="font-semibold text-[#9c1006]">{value}</span>
                  },
                ]}
                maxRows={10}
              />
            </ChartCard>
          </div>
        </div>
      )}
    </div>
  );
}

