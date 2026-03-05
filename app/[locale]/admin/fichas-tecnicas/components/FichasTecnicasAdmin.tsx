'use client';

import { Download, FileText, Edit3, Eye, BarChart3, RefreshCw } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { AdvancedFilters } from '@/components/common/AdvancedFilters';
import { BulkEdit } from '@/components/common/BulkEdit';
import { ComparisonBulkEdit } from '@/components/common/ComparisonBulkEdit';
import { DataTable } from '@/components/common/DataTable';
import { EditModal } from '@/components/common/EditModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MOCK_EQUIPMENT } from '@/constants/equipment-data';
import { ALL_PRODUCTS, getLineConfig } from '@/constants/product-manager';

// ========================================
// 🎯 INTERFACE MODERNA DE ADMINISTRAÇÃO
// ========================================

interface ProductData {
  id: string;
  name: string;
  category: string;
  line: 'red' | 'blue' | 'musculacao';
  lineConfig: any;
  specifications: Record<string, string>;
  features: string[];
  equipmentData?: any;
}

interface ViewMode {
  id: 'table' | 'comparison' | 'detailed' | 'bulk-edit' | 'comparison-bulk';
  name: string;
  icon: React.ReactNode;
  description: string;
}

const CATEGORIES = [
  {
    id: 'esteiras',
    name: 'Esteiras',
    icon: '🏃‍♂️',
    products: Object.keys(ALL_PRODUCTS).filter(
      (id) => ALL_PRODUCTS[id as keyof typeof ALL_PRODUCTS]?.category === 'esteira'
    ),
  },
  {
    id: 'bicicletas',
    name: 'Bicicletas',
    icon: '🚴‍♂️',
    products: Object.keys(ALL_PRODUCTS).filter(
      (id) =>
        ALL_PRODUCTS[id as keyof typeof ALL_PRODUCTS]?.category === 'bike' ||
        ALL_PRODUCTS[id as keyof typeof ALL_PRODUCTS]?.category === 'spinning'
    ),
  },
  {
    id: 'elipticos',
    name: 'Elípticos',
    icon: '🔄',
    products: Object.keys(ALL_PRODUCTS).filter(
      (id) => ALL_PRODUCTS[id as keyof typeof ALL_PRODUCTS]?.category === 'eliptico'
    ),
  },
  {
    id: 'escadas',
    name: 'Escadas',
    icon: '🪜',
    products: Object.keys(ALL_PRODUCTS).filter(
      (id) => ALL_PRODUCTS[id as keyof typeof ALL_PRODUCTS]?.category === 'escada'
    ),
  },
  {
    id: 'musculacao',
    name: 'Musculação',
    icon: '💪',
    products: Object.keys(ALL_PRODUCTS).filter(
      (id) => ALL_PRODUCTS[id as keyof typeof ALL_PRODUCTS]?.category === 'musculacao'
    ),
  },
];

const VIEW_MODES: ViewMode[] = [
  {
    id: 'table',
    name: 'Tabela',
    icon: <BarChart3 className='h-4 w-4' />,
    description: 'Visualização em tabela estilo Excel',
  },
  {
    id: 'bulk-edit',
    name: 'Edição em Massa',
    icon: <Edit3 className='h-4 w-4' />,
    description: 'Edição avançada com seleção múltipla',
  },
  {
    id: 'comparison',
    name: 'Comparação',
    icon: <Eye className='h-4 w-4' />,
    description: 'Comparação horizontal de especificações',
  },
  {
    id: 'comparison-bulk',
    name: 'Comparação + Edição',
    icon: <Edit3 className='h-4 w-4' />,
    description: 'Comparação com edição inline em massa',
  },
  {
    id: 'detailed',
    name: 'Detalhado',
    icon: <FileText className='h-4 w-4' />,
    description: 'Visualização detalhada individual',
  },
];

export function FichasTecnicasAdmin() {
  const [selectedCategory, setSelectedCategory] = useState('esteiras');
  const [viewMode, setViewMode] = useState<
    'table' | 'comparison' | 'detailed' | 'bulk-edit' | 'comparison-bulk'
  >('table');
  const [isClient, setIsClient] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductData | null>(null);
  const [, setFilters] = useState<Record<string, any>>({});
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const currentCategory = CATEGORIES.find((cat) => cat.id === selectedCategory);

  const categoryProducts: ProductData[] = useMemo(() => {
    if (!currentCategory) return [];

    const products = currentCategory.products
      .map((productId) => {
        const equipmentData = MOCK_EQUIPMENT.find((eq) => eq.id === productId);
        const productConfig = ALL_PRODUCTS[productId as keyof typeof ALL_PRODUCTS];
        const lineConfig = getLineConfig(productId);

        if (!productConfig) return null;

        return {
          id: productId,
          name: productConfig.name as string,
          category: productConfig.category as string,
          line: lineConfig.line,
          lineConfig,
          specifications: equipmentData?.specifications || productConfig.specifications || {},
          features: equipmentData?.features || [],
          equipmentData,
        };
      })
      .filter(
        (item): item is NonNullable<typeof item> =>
          item !== null && Object.keys(item.specifications).length > 0
      );

    console.log(`Categoria ${currentCategory.name}:`, {
      totalProducts: currentCategory.products.length,
      filteredProducts: products.length,
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        specsCount: Object.keys(p.specifications).length,
      })),
    });

    return products;
  }, [currentCategory]);

  // Preparar dados para a tabela
  const tableData = useMemo(() => {
    return categoryProducts.map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      line: product.lineConfig.name,
      ...product.specifications,
    }));
  }, [categoryProducts]);

  // Obter todas as especificações únicas
  const allSpecifications = useMemo(() => {
    return Array.from(
      new Set(categoryProducts.flatMap((p) => Object.keys(p.specifications)))
    ).sort();
  }, [categoryProducts]);

  // Configuração das colunas da tabela
  const tableColumns = useMemo(() => {
    const baseColumns = [
      { key: 'name', label: 'Nome do Produto', editable: true },
      { key: 'category', label: 'Categoria', editable: false },
      { key: 'line', label: 'Linha', editable: false },
    ];

    const specColumns = allSpecifications.map((spec) => ({
      key: spec,
      label: spec,
      editable: true,
    }));

    return [...baseColumns, ...specColumns];
  }, [allSpecifications]);

  // Opções de filtros
  const filterOptions = useMemo(
    () => [
      { key: 'name', label: 'Nome', type: 'text' as const },
      {
        key: 'category',
        label: 'Categoria',
        type: 'select' as const,
        options: Array.from(new Set(categoryProducts.map((p) => p.category))),
      },
      {
        key: 'line',
        label: 'Linha',
        type: 'select' as const,
        options: Array.from(new Set(categoryProducts.map((p) => p.lineConfig.name))),
      },
    ],
    [categoryProducts]
  );

  useEffect(() => {
    setIsClient(true);
    setLastUpdate(new Date().toLocaleString('pt-BR'));
  }, []);

  const handleDataChange = async (newData: Array<Record<string, any>>) => {
    // Aqui você implementaria a lógica para salvar no banco de dados
    console.log('Dados alterados:', newData);
  };

  const handleEditProduct = async (updatedData: Record<string, any>) => {
    // Implementar lógica de salvamento
    console.log('Produto editado:', updatedData);
    setEditingProduct(null);
  };

  const handleApplyFilters = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const getLineColor = (line: string) => {
    switch (line) {
      case 'blue':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'red':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'musculacao':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header Moderno */}
      <div className='bg-white border-b border-gray-200 shadow-sm'>
        <div className='px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='flex items-center space-x-3'>
                <div className='w-10 h-10 bg-gradient-to-r from-blue-600 to-red-600 rounded-lg flex items-center justify-center'>
                  <span className='text-white font-bold text-lg'>PR</span>
                </div>
                <div>
                  <h1 className='text-2xl font-bold text-gray-900'>
                    Administração de Fichas Técnicas
                  </h1>
                  <p className='text-sm text-gray-600'>
                    Gerenciamento profissional - PowerRun Equipment
                  </p>
                </div>
              </div>
            </div>

            <div className='flex items-center space-x-4'>
              {/* View Mode Toggle */}
              <div className='flex bg-gray-100 rounded-lg p-1'>
                {VIEW_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setViewMode(mode.id)}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors flex items-center space-x-2 ${
                      viewMode === mode.id
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title={mode.description}
                  >
                    {mode.icon}
                    <span>{mode.name}</span>
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className='flex items-center space-x-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => window.location.reload()}
                  className='flex items-center space-x-2'
                >
                  <RefreshCw className='h-4 w-4' />
                  <span>Atualizar</span>
                </Button>

                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    /* Implementar exportação */
                  }}
                  className='flex items-center space-x-2'
                >
                  <Download className='h-4 w-4' />
                  <span>Exportar</span>
                </Button>
              </div>

              <div className='flex items-center space-x-3'>
                {lastUpdate && (
                  <Badge variant='secondary' className='text-xs'>
                    🕒 {lastUpdate}
                  </Badge>
                )}
                <Badge variant='destructive' className='text-xs'>
                  🔒 ADMINISTRATIVO
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='flex h-[calc(100vh-100px)]'>
        {/* Sidebar Moderna */}
        <div className='w-72 bg-white border-r border-gray-200 shadow-sm'>
          <div className='p-6'>
            <div className='mb-6'>
              <h2 className='text-lg font-semibold text-gray-900 mb-2'>Categorias de Produtos</h2>
              <p className='text-sm text-gray-600'>Selecione uma categoria para gerenciar</p>
            </div>

            <nav className='space-y-2'>
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-blue-50 to-red-50 text-gray-900 border border-blue-200 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                  }`}
                >
                  <div className='flex items-center space-x-3'>
                    <span className='text-lg'>{category.icon}</span>
                    <span>{category.name}</span>
                  </div>
                  <Badge
                    variant={selectedCategory === category.id ? 'default' : 'secondary'}
                    className='text-xs'
                  >
                    {category.products.length}
                  </Badge>
                </button>
              ))}
            </nav>

            {/* Stats */}
            <div className='mt-8 p-4 bg-gray-50 rounded-lg'>
              <h3 className='text-sm font-semibold text-gray-900 mb-3'>Estatísticas</h3>
              <div className='space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Total de produtos:</span>
                  <span className='font-medium'>{categoryProducts.length}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Linhas:</span>
                  <span className='font-medium'>
                    {Array.from(new Set(categoryProducts.map((p) => p.line))).length}
                  </span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Especificações:</span>
                  <span className='font-medium'>{allSpecifications.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className='flex-1 bg-gray-50 overflow-hidden'>
          {!isClient ? (
            <div className='flex items-center justify-center h-full'>
              <div className='text-center'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
                <p className='text-gray-600'>Carregando dados...</p>
              </div>
            </div>
          ) : (
            <div className='h-full flex flex-col'>
              {/* Content Header */}
              <div className='bg-white border-b border-gray-200 px-6 py-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='text-xl font-bold text-gray-900'>
                      {currentCategory?.icon} {currentCategory?.name}
                    </h3>
                    <p className='text-sm text-gray-600 mt-1'>
                      {VIEW_MODES.find((m) => m.id === viewMode)?.description}
                    </p>
                  </div>

                  <div className='flex items-center space-x-4'>
                    <div className='flex space-x-2'>
                      {Array.from(new Set(categoryProducts.map((p) => p.line))).map((line) => (
                        <Badge
                          key={line}
                          variant='outline'
                          className={`text-xs ${getLineColor(line)}`}
                        >
                          {line === 'blue'
                            ? 'Blue Line'
                            : line === 'red'
                              ? 'Red Line'
                              : 'Musculação'}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className='flex-1 overflow-auto p-6'>
                {categoryProducts.length === 0 ? (
                  <div className='flex items-center justify-center h-full'>
                    <div className='text-center'>
                      <div className='text-gray-400 text-6xl mb-4'>📦</div>
                      <h3 className='text-lg font-medium text-gray-900 mb-2'>
                        Nenhum produto encontrado
                      </h3>
                      <p className='text-gray-600'>
                        Esta categoria não possui produtos cadastrados
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Filtros */}
                    <div className='mb-6'>
                      <AdvancedFilters
                        filters={filterOptions}
                        onApplyFilters={handleApplyFilters}
                        onClearFilters={handleClearFilters}
                      />
                    </div>

                    {/* Conteúdo baseado no modo de visualização */}
                    {viewMode === 'table' && (
                      <DataTable
                        data={tableData}
                        columns={tableColumns}
                        onDataChange={handleDataChange}
                        title={`${categoryProducts.length} Produtos - ${currentCategory?.name}`}
                        searchable={true}
                        filterable={true}
                        exportable={true}
                        editable={true}
                      />
                    )}

                    {viewMode === 'bulk-edit' && (
                      <BulkEdit
                        data={tableData}
                        columns={tableColumns}
                        onSave={handleDataChange}
                        onCancel={() => setViewMode('table')}
                      />
                    )}

                    {viewMode === 'comparison' && (
                      <ComparisonView
                        products={categoryProducts}
                        specifications={allSpecifications}
                      />
                    )}

                    {viewMode === 'comparison-bulk' && (
                      <ComparisonBulkEdit
                        products={categoryProducts}
                        specifications={allSpecifications}
                        onSave={(updatedProducts) => {
                          console.log('Produtos atualizados:', updatedProducts);
                          // Aqui você implementaria a lógica para salvar no banco de dados
                        }}
                        onCancel={() => setViewMode('comparison')}
                      />
                    )}

                    {viewMode === 'detailed' && <DetailedView products={categoryProducts} />}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Edição */}
      {editingProduct && (
        <EditModal
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          data={editingProduct}
          columns={tableColumns}
          onSave={handleEditProduct}
          title={`Editar ${editingProduct.name}`}
        />
      )}
    </div>
  );
}

// ========================================
// 📊 COMPONENTE DE COMPARAÇÃO MODERNO
// ========================================

interface ComparisonViewProps {
  products: ProductData[];
  specifications: string[];
}

function ComparisonView({ products, specifications }: ComparisonViewProps) {
  const getLineColor = (line: string) => {
    switch (line) {
      case 'blue':
        return 'bg-blue-50 border-blue-200';
      case 'red':
        return 'bg-red-50 border-red-200';
      case 'musculacao':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
      {/* Header */}
      <div className='bg-gray-50 border-b border-gray-200 p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>Comparação de Especificações</h3>
        <p className='text-sm text-gray-600'>Comparação horizontal de {products.length} produtos</p>
      </div>

      {/* Table */}
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Especificação
              </th>
              {products.map((product) => (
                <th
                  key={product.id}
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  <div className={`p-3 rounded-lg border ${getLineColor(product.line)}`}>
                    <h5 className='text-sm font-bold text-gray-900 truncate' title={product.name}>
                      {product.name}
                    </h5>
                    <p className='text-xs text-gray-600 mt-1'>{product.lineConfig.name}</p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {specifications.map((spec) => (
              <tr key={spec} className='hover:bg-gray-50 transition-colors'>
                <td className='px-6 py-4 text-sm font-medium text-gray-900'>{spec}</td>
                {products.map((product) => (
                  <td key={product.id} className='px-6 py-4 text-sm text-gray-700'>
                    {product.specifications[spec] || '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Features Section */}
      {products.some((p) => p.features.length > 0) && (
        <div className='border-t border-gray-200 bg-gray-50 p-6'>
          <h4 className='text-sm font-semibold text-gray-900 mb-4'>Recursos Principais</h4>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {products.map((product) => (
              <div
                key={product.id}
                className={`p-4 rounded-lg border ${getLineColor(product.line)}`}
              >
                <h5 className='text-sm font-bold text-gray-900 mb-2'>{product.name}</h5>
                <div className='space-y-1'>
                  {product.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className='text-xs text-gray-700'>
                      <span className='text-blue-600 mr-1'>•</span>
                      {feature.length > 60 ? `${feature.substring(0, 60)}...` : feature}
                    </div>
                  ))}
                  {product.features.length > 3 && (
                    <div className='text-xs text-gray-500'>
                      +{product.features.length - 3} mais recursos
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ========================================
// 📋 COMPONENTE DE VISUALIZAÇÃO DETALHADA MODERNO
// ========================================

interface DetailedViewProps {
  products: ProductData[];
}

function DetailedView({ products }: DetailedViewProps) {
  const getLineColor = (line: string) => {
    switch (line) {
      case 'blue':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'red':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'musculacao':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className='space-y-6'>
      {products.map((product) => (
        <div
          key={product.id}
          className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'
        >
          {/* Product Header */}
          <div className='bg-gray-50 border-b border-gray-200 p-6'>
            <div className='flex items-start justify-between'>
              <div className='flex-1'>
                <h4 className='text-xl font-bold text-gray-900 mb-2'>{product.name}</h4>
                <p className='text-gray-600 mb-3'>
                  {product.equipmentData?.description || 'Descrição não disponível'}
                </p>
                <div className='flex flex-wrap gap-2'>
                  <Badge variant='outline' className='text-xs'>
                    {product.category}
                  </Badge>
                  <Badge variant='outline' className={`text-xs ${getLineColor(product.line)}`}>
                    {product.lineConfig.name}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className='p-6'>
            {/* Features */}
            {product.features.length > 0 && (
              <div className='mb-6'>
                <h5 className='text-lg font-semibold text-gray-900 mb-3'>
                  Recursos Principais ({product.features.length})
                </h5>
                <div className='bg-blue-50 rounded-lg p-4'>
                  <ul className='space-y-2'>
                    {product.features.map((feature, index) => (
                      <li key={index} className='flex items-start'>
                        <span className='text-blue-600 mr-2 mt-0.5 font-bold'>•</span>
                        <span className='text-sm text-gray-700 leading-relaxed'>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Specifications */}
            {Object.keys(product.specifications).length > 0 && (
              <div>
                <h5 className='text-lg font-semibold text-gray-900 mb-3'>
                  Especificações Técnicas ({Object.keys(product.specifications).length})
                </h5>
                <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
                  <div className='overflow-x-auto'>
                    <table className='w-full'>
                      <thead className='bg-gray-50'>
                        <tr>
                          <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Especificação
                          </th>
                          <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            Valor
                          </th>
                        </tr>
                      </thead>
                      <tbody className='bg-white divide-y divide-gray-200'>
                        {Object.entries(product.specifications).map(([key, value], index) => (
                          <tr key={key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className='px-4 py-3 text-sm font-medium text-gray-900'>{key}</td>
                            <td className='px-4 py-3 text-sm text-gray-700'>{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
