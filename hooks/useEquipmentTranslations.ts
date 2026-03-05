import { useTranslations, useLocale, useMessages } from 'next-intl';
import { useCallback } from 'react';
import { BLUE_LINE_PRODUCTS } from '@/constants/product-lines/blue-line-config';
import { MUSCULACAO_PRODUCTS } from '@/constants/product-lines/musculacao-config';
import { RED_LINE_PRODUCTS } from '@/constants/product-lines/red-line-config';
import { Equipment, EquipmentCategory } from '@/types';

export function useEquipmentTranslations() {
  const locale = useLocale();
  const messages = useMessages() as any;
  const tCategories = useTranslations('categories');
  const tCategoryDescriptions = useTranslations('categoryDescriptions');
  const tEquipments = useTranslations('equipmentData');
  const tSpecifications = useTranslations('specifications');
  const tFeatures = useTranslations('features');

  // Função helper para buscar descrição comercial dos arquivos de configuração
  const getCommercialDescription = useCallback(
    (equipmentId: string): string | null => {
      // Combinar todos os produtos dos arquivos de configuração
      const allProducts = {
        ...RED_LINE_PRODUCTS,
        ...BLUE_LINE_PRODUCTS,
        ...MUSCULACAO_PRODUCTS,
      };

      // Buscar pelo ID exato ou tentar variações
      const productConfig = allProducts[equipmentId as keyof typeof allProducts];
      if (productConfig && 'commercialDescription' in productConfig) {
        const product = productConfig as any;

        // Retornar tradução baseada no locale atual
        switch (locale) {
          case 'en':
            return product.commercialDescriptionEN || product.commercialDescription;
          case 'es':
            return product.commercialDescriptionES || product.commercialDescription;
          case 'zh-CN':
            return product.commercialDescriptionZH || product.commercialDescription;
          default:
            return product.commercialDescription;
        }
      }

      // Tentar mapeamentos para IDs que podem ter nomes diferentes
      const idMappings: Record<string, string> = {
        pr001: 'pr001-peitoral-dorsal',
        pr002: 'pr002-polia-superior-remada',
        pr003: 'pr003-multi-press',
        pr004: 'pr004-biceps-triceps',
        'pr005-leg-press-hack': 'pr005-leg-press-hack',
        pr006: 'pr006-cadeira-adutora-abdutora',
        pr008: 'pr008-leg-press-hack-squat',
        pr009: 'pr009-cross-over-angular',
        pr010: 'pr010-multi-station',
        pr012: 'multi-gym-pr012',
        pr013: 'pr013-banco-uni-inclinavel',
        pr014: 'banco-bi-inclinavel-pr014',
        pr015: 'pr015-cadeira-extensora-flexora',
      };

      const mappedId = idMappings[equipmentId];
      if (mappedId) {
        const mappedProduct = allProducts[mappedId as keyof typeof allProducts];
        if (mappedProduct && 'commercialDescription' in mappedProduct) {
          const product = mappedProduct as any;

          // Retornar tradução baseada no locale atual
          switch (locale) {
            case 'en':
              return product.commercialDescriptionEN || product.commercialDescription;
            case 'es':
              return product.commercialDescriptionES || product.commercialDescription;
            case 'zh-CN':
              return product.commercialDescriptionZH || product.commercialDescription;
            default:
              return product.commercialDescription;
          }
        }
      }

      return null;
    },
    [locale]
  );

  const translateCategory = useCallback(
    (categoryId: string): string => {
      try {
        return tCategories(categoryId);
      } catch {
        return categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
      }
    },
    [tCategories]
  );

  const translateCategoryDescription = useCallback(
    (categoryId: string): string => {
      try {
        return tCategoryDescriptions(categoryId);
      } catch {
        return '';
      }
    },
    [tCategoryDescriptions]
  );

  const translateSpecification = useCallback(
    (specKey: string): string => {
      try {
        // 🔧 CORREÇÃO: Normalizar chaves para funcionar com next-intl
        // next-intl não permite "." e parênteses nas chaves (usa para nesting)
        // Normalização: pontos -> underscore, parênteses removidos e substituídos por underscore
        // Exemplo: "FC (display)" -> "FC_display", "Distância (quilometragem)" -> "Distância_quilometragem"
        const normalizedKey = specKey
          .replace(/\./g, '_') // Substituir pontos por underscore
          .replace(/\s*\(\s*/g, '_') // Substituir " (" por underscore (sem espaço)
          .replace(/\s*\)\s*/g, '') // Remover ")"
          .trim(); // Remover espaços extras

        // Tentar traduzir com a chave normalizada primeiro
        try {
          const translated = tSpecifications(normalizedKey);

          // Se a tradução começar com 'specifications.', não foi encontrada
          if (!translated.startsWith('specifications.')) {
            return translated;
          }
        } catch {
          // Se falhar, tentar com a chave original
        }

        // Tentar com a chave original (caso exista sem normalização)
        try {
          const translated = tSpecifications(specKey);
          if (!translated.startsWith('specifications.')) {
            return translated;
          }
        } catch {
          // Se falhar, retornar a chave original
        }

        return specKey; // Retorna o texto original se não encontrar tradução
      } catch {
        return specKey; // Retorna o texto original em caso de erro
      }
    },
    [tSpecifications]
  );

  const translateFeature = useCallback(
    (feature: string): string => {
      // 🔧 CORREÇÃO CRÍTICA: Se o texto começa com "features.", significa que é uma chave malformada
      if (feature.startsWith('features.')) {
        return feature.replace('features.', '');
      }

      // Para pt-BR, sempre retornar o texto original (não precisa traduzir)
      if (locale === 'pt-BR') {
        return feature;
      }

      // Normalizar chave (substituir pontos por underscores)
      const normalizedKey = feature.replace(/\./g, '_');

      // Função auxiliar para verificar se a chave existe e traduzir sem lançar erro
      const tryTranslate = (key: string): string | null => {
        // Acessar diretamente o objeto de mensagens para verificar se a chave existe
        // Isso evita que o next-intl lance erro quando a chave não existe
        const featuresObj = messages?.features;
        if (!featuresObj) return null;

        // Verificar se a chave existe no objeto
        if (featuresObj[key] !== undefined) {
          const translated = featuresObj[key];
          // Se retornou a própria chave ou começa com 'features.', não encontrou
          if (translated && translated !== key && !translated.startsWith('features.')) {
            return translated;
          }
        }

        return null;
      };

      // Tentar com chave normalizada primeiro (se tinha pontos)
      if (feature !== normalizedKey) {
        const translated = tryTranslate(normalizedKey);
        if (translated) return translated;
      }

      // Tentar com chave exata
      const translated = tryTranslate(feature);
      if (translated) return translated;

      // Tentar com chave normalizada como fallback (caso tenha sido normalizada no JSON)
      if (normalizedKey !== feature) {
        const translatedNormalized = tryTranslate(normalizedKey);
        if (translatedNormalized) return translatedNormalized;
      }

      // Fallback final: retornar o texto original
      // Se chegou aqui, significa que:
      // 1. A tradução não existe no JSON, OU
      // 2. O texto já está traduzido (foi passado já traduzido)
      // Em ambos os casos, retornar o texto original é seguro
      return feature;
    },
    [tFeatures, locale]
  );

  const translateEquipment = useCallback(
    (equipment: Equipment): Equipment => {
      try {
        const equipmentKey = equipment.id;

        // Traduzir apenas nome, descrição curta e longa com fallback
        let translatedName,
          translatedCardName,
          translatedShortDesc,
          translatedCardDescription,
          translatedDescription;

        try {
          translatedName = tEquipments(`${equipmentKey}.name`);
        } catch {
          translatedName = equipment.name;
        }

        try {
          const cardNameTranslation = tEquipments(`${equipmentKey}.cardName`);
          // Se a tradução retornou a própria chave, significa que não existe
          translatedCardName = cardNameTranslation.includes('equipmentData.')
            ? undefined
            : cardNameTranslation;
        } catch {
          translatedCardName = undefined; // Se não existir cardName, usa o name normal
        }

        try {
          const cardDescTranslation = tEquipments(`${equipmentKey}.cardDescription`);
          // Se a tradução retornou a própria chave, significa que não existe
          translatedCardDescription = cardDescTranslation.includes('equipmentData.')
            ? undefined
            : cardDescTranslation;
        } catch {
          translatedCardDescription = undefined; // Se não existir cardDescription, usa shortDescription
        }

        try {
          // ✅ PRIORIZAR DESCRIÇÃO COMERCIAL dos arquivos de configuração
          const commercialDesc = getCommercialDescription(equipmentKey);
          if (commercialDesc) {
            translatedShortDesc = commercialDesc;
          } else {
            translatedShortDesc = tEquipments(`${equipmentKey}.shortDescription`);
          }
        } catch {
          // Fallback final para shortDescription original
          const commercialDesc = getCommercialDescription(equipmentKey);
          translatedShortDesc = commercialDesc || equipment.shortDescription;
        }

        try {
          translatedDescription = tEquipments(`${equipmentKey}.description`);
        } catch {
          translatedDescription = equipment.description;
        }

        // ✅ Traduzir features usando a função centralizada e inteligente
        const translatedFeatures = equipment.features.map((feature) => translateFeature(feature));

        return {
          ...equipment,
          name: translatedName,
          cardName: translatedCardName, // Adiciona cardName ao retorno
          shortDescription: translatedShortDesc,
          cardDescription: translatedCardDescription, // Adiciona cardDescription ao retorno
          description: translatedDescription,
          // Mantém especificações originais por enquanto
          specifications: equipment.specifications,
          features: translatedFeatures,
        };
      } catch (error) {
        // Se houver qualquer erro, retorna o equipamento original
        console.warn('Erro ao traduzir equipamento:', error);
        return equipment;
      }
    },
    [tEquipments]
  );

  const translateEquipmentCategory = useCallback(
    (category: EquipmentCategory): EquipmentCategory => {
      return {
        ...category,
        name: translateCategory(category.id),
        description: translateCategoryDescription(category.id),
      };
    },
    [translateCategory, translateCategoryDescription]
  );

  return {
    translateCategory,
    translateCategoryDescription,
    translateSpecification,
    translateFeature,
    translateEquipment,
    translateEquipmentCategory,
  };
}
