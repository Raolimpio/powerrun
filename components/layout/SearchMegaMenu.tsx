'use client';

import Fuse from 'fuse.js';
import { Dumbbell, Building2, Home } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useEffect, useState, useCallback } from 'react';
import { useEquipmentTranslations } from '@/hooks/useEquipmentTranslations';
import { fetchEquipments, fetchEquipmentCategories } from '@/services/equipments';
import { Equipment } from '@/types';

interface SearchMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// Interface para equipamento enriquecido com dados de busca
interface EnrichedEquipment extends Equipment {
  categoryName: string;
  targetAudience: string;
}

export function SearchMegaMenu({ isOpen, onClose }: SearchMegaMenuProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [, setAllEquipments] = useState<Equipment[]>([]);
  const [searchResults, setSearchResults] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fuse, setFuse] = useState<Fuse<EnrichedEquipment> | null>(null);

  // const t = useTranslations('common');
  const locale = useLocale();
  const { translateEquipment } = useEquipmentTranslations();

  // Função para normalizar texto removendo acentos e caracteres especiais
  const normalizeText = (text: string): string => {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .toLowerCase()
      .trim();
  };

  // Função para formatar público-alvo baseado nas tags do equipamento
  const getTargetAudience = (equipment: Equipment): string => {
    if (!equipment.targets || equipment.targets.length === 0) {
      return 'geral uso doméstico residencial casa';
    }

    const targetDescriptions = {
      academia: 'academia ginásio ginasio fitness comercial profissional gym',
      condominio: 'condomínio condominio prédio predio edifício edificio coletivo sindico síndico',
      residencia:
        'residência residencia casa doméstico domestico pessoal uso individual particular',
    };

    return equipment.targets.map((target) => targetDescriptions[target] || target).join(' ');
  };

  // Configuração do Fuse.js para busca fuzzy expandida
  const fuseOptions = {
    keys: [
      { name: 'name', weight: 0.2 }, // Nome do produto
      { name: 'model', weight: 0.15 }, // Modelo específico
      { name: 'categoryName', weight: 0.15 }, // Categoria traduzida
      { name: 'targetAudience', weight: 0.2 }, // Público-alvo (aumentado)
      { name: 'description', weight: 0.15 }, // Descrição
      { name: 'brand', weight: 0.1 }, // Marca
      { name: 'features', weight: 0.05 }, // Características
    ],
    threshold: 0.4, // Mais tolerante: permite até 40% de diferença
    distance: 200, // Maior distância para melhor matching
    minMatchCharLength: 2,
    includeScore: true,
    includeMatches: true,
    ignoreLocation: true, // Ignora localização do match na string
  };

  // Carregar todos os equipamentos na inicialização
  useEffect(() => {
    let isMounted = true;

    async function loadAllEquipments() {
      try {
        setIsLoading(true);
        const [{ data: equipments }, { data: categories }] = await Promise.all([
          fetchEquipments({ locale }),
          fetchEquipmentCategories(locale),
        ]);

        if (isMounted && equipments && categories) {
          // Traduzir equipamentos e enriquecer com dados de busca
          const enrichedEquipments: EnrichedEquipment[] = equipments.map((equipment) => {
            const translatedEquipment = translateEquipment(equipment);
            const category = categories.find((cat) => cat.id === equipment.category);
            const targetAudience = getTargetAudience(equipment);

            return {
              ...translatedEquipment,
              // Normalizar campos textuais para melhor busca
              name: `${translatedEquipment.name} ${normalizeText(translatedEquipment.name)}`,
              description: `${translatedEquipment.description} ${normalizeText(translatedEquipment.description || '')}`,
              categoryName: category?.name || equipment.category,
              targetAudience: `${targetAudience} ${normalizeText(targetAudience)}`,
            };
          });

          setAllEquipments(equipments.map((equipment) => translateEquipment(equipment)));

          // Inicializar Fuse.js com os dados enriquecidos
          const fuseInstance = new Fuse(enrichedEquipments, fuseOptions);
          setFuse(fuseInstance);
        }
      } catch (error) {
        console.error('Erro ao carregar equipamentos:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (isOpen) {
      loadAllEquipments();
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen, locale]);

  // Busca em tempo real
  const performSearch = useCallback(
    (term: string) => {
      if (!fuse || !term.trim()) {
        setSearchResults([]);
        return;
      }

      // Normalizar termo de busca para melhor matching
      const normalizedTerm = normalizeText(term);

      // Buscar tanto o termo original quanto o normalizado
      const originalResults = fuse.search(term);
      const normalizedResults = fuse.search(normalizedTerm);

      // Combinar resultados únicos
      const combinedResults = [...originalResults];
      normalizedResults.forEach((result) => {
        if (!combinedResults.find((r) => r.item.id === result.item.id)) {
          combinedResults.push(result);
        }
      });

      // Ordenar por score e pegar os melhores
      const sortedResults = combinedResults
        .sort((a, b) => (a.score || 0) - (b.score || 0))
        .slice(0, 12);

      const equipments = sortedResults.map((result) => result.item);
      setSearchResults(equipments);

      // Debug temporário (remover depois)
      if (term.toLowerCase().includes('condo')) {
        console.log('🔍 Debug busca condomínio:', {
          termo: term,
          termoNormalizado: normalizedTerm,
          resultadosOriginais: originalResults.length,
          resultadosNormalizados: normalizedResults.length,
          resultadosFinais: equipments.length,
        });
      }
    },
    [fuse, normalizeText]
  );

  // Effect para busca com debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, performSearch]);

  // Reset quando fechar
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setSearchResults([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className='fixed top-[65px] left-0 w-full bg-white backdrop-blur-2xl shadow-2xl border-t border-gray-200 z-[60]'
        onMouseLeave={onClose}
      >
        {/* Container alinhado com o header */}
        <div className='container mx-auto px-4 pt-8 pb-6'>
          {/* Campo de busca */}
          <div className='mb-6'>
            <div className='relative max-w-2xl mx-auto'>
              <div className='relative'>
                <svg
                  className='absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                  />
                </svg>
                <input
                  type='text'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder='Busque por equipamentos, marcas, modelos, categorias ou público-alvo...'
                  className='w-full pl-12 pr-4 py-3 text-base text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all placeholder:text-gray-500'
                  autoFocus
                />
              </div>
              {isLoading && (
                <div className='absolute right-4 top-1/2 transform -translate-y-1/2'>
                  <div className='w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin'></div>
                </div>
              )}
            </div>
          </div>

          {/* Resultados da busca */}
          {searchTerm && (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2'>
              {searchResults.length > 0 ? (
                searchResults.map((equipment) => (
                  <Link
                    key={equipment.id}
                    href={`/equipamentos/${equipment.id}` as any}
                    onClick={onClose}
                    className='group flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300 hover:border-gray-900'
                  >
                    <div className='relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0'>
                      <Image
                        src={equipment.images[0]}
                        alt={equipment.name}
                        fill
                        className='object-contain p-1 group-hover:scale-105 transition-transform duration-300'
                      />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <h3 className='font-semibold text-gray-900 group-hover:text-black transition-colors text-sm mb-2 truncate'>
                        {equipment.name}
                      </h3>
                      <p className='text-xs text-gray-600 mb-2'>{equipment.brand}</p>
                      <p
                        className='text-xs text-gray-500 overflow-hidden mb-2'
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {equipment.shortDescription}
                      </p>

                      {/* Tags de público-alvo */}
                      {equipment.targets && equipment.targets.length > 0 && (
                        <div className='flex flex-wrap gap-1 mb-2'>
                          {equipment.targets.map((target) => (
                            <span
                              key={target}
                              className='flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md'
                            >
                              {target === 'academia' && <Dumbbell className='w-3 h-3' />}
                              {target === 'condominio' && <Building2 className='w-3 h-3' />}
                              {target === 'residencia' && <Home className='w-3 h-3' />}
                              {target === 'academia'
                                ? 'Academia'
                                : target === 'condominio'
                                  ? 'Condomínio'
                                  : target === 'residencia'
                                    ? 'Residência'
                                    : target}
                            </span>
                          ))}
                        </div>
                      )}

                      {equipment.price && (
                        <div className='mt-1'>
                          <span className='text-xs font-bold text-gray-900'>
                            R$ {equipment.price.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                ))
              ) : (
                <div className='col-span-full text-center py-8'>
                  <div className='text-gray-400 mb-4'>
                    <svg
                      className='w-12 h-12 mx-auto'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={1}
                        d='M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.44-1.006-5.93-2.621C5.6 11.675 5.228 11 4.8 11H3a1 1 0 01-1-1V7a1 1 0 011-1h1.8c.428 0 .8.675 1.27 1.379C6.56 8.006 8.66 9 11 9h.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                  </div>
                  <h3 className='text-base font-semibold text-gray-700 mb-3'>
                    Nenhum resultado encontrado
                  </h3>
                  <p className='text-sm text-gray-500 leading-relaxed'>
                    Tente termos diferentes ou verifique a ortografia.
                    <br />
                    Nossa busca é inteligente e tolera pequenos erros de digitação.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Dicas quando não há busca */}
          {!searchTerm && !isLoading && (
            <div className='text-center py-6'>
              <div className='text-gray-400 mb-4'>
                <svg
                  className='w-12 h-12 mx-auto'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1}
                    d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                  />
                </svg>
              </div>
              <h3 className='text-base font-semibold text-gray-700 mb-3'>
                Encontre o equipamento perfeito
              </h3>
              <p className='text-sm text-gray-500 mb-4 leading-relaxed'>
                Digite para buscar por nome, marca, modelo, categoria ou público-alvo
                <br />
                <span className='text-xs text-gray-400'>
                  Ex: &quot;academia&quot;, &quot;condomínio&quot;, &quot;residência&quot;,
                  &quot;cardio&quot;, &quot;PR200&quot;
                </span>
              </p>
              <div className='flex flex-wrap justify-center gap-3'>
                {[
                  'esteira',
                  'bicicleta',
                  'elíptico',
                  'PowerRun',
                  'academia',
                  'condomínio',
                  'residência',
                  'cardio',
                  'musculação',
                  'PR200',
                  'PR5000',
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setSearchTerm(suggestion)}
                    className='px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-900 hover:text-white transition-all'
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
