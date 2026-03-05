/**
 * Tradução de equipamentos no servidor (Server-Side)
 * Usa getTranslations do next-intl para traduzir no servidor
 */

import { getTranslations } from 'next-intl/server';
import { Equipment } from '@/types';
import { BLUE_LINE_PRODUCTS } from '@/constants/product-lines/blue-line-config';
import { MUSCULACAO_PRODUCTS } from '@/constants/product-lines/musculacao-config';
import { RED_LINE_PRODUCTS } from '@/constants/product-lines/red-line-config';

/**
 * Busca descrição comercial dos arquivos de configuração
 */
function getCommercialDescription(
  equipmentId: string,
  locale: string
): string | null {
  const allProducts = {
    ...RED_LINE_PRODUCTS,
    ...BLUE_LINE_PRODUCTS,
    ...MUSCULACAO_PRODUCTS,
  };

  const productConfig = allProducts[equipmentId as keyof typeof allProducts];
  if (productConfig && 'commercialDescription' in productConfig) {
    const product = productConfig as any;

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

  return null;
}

/**
 * Traduz um equipamento no servidor
 */
export async function translateEquipmentOnServer(
  equipment: Equipment,
  locale: string
): Promise<Equipment> {
  try {
    const tEquipments = await getTranslations({ locale, namespace: 'equipmentData' });
    const equipmentKey = equipment.id;

    // Traduzir nome
    let translatedName = equipment.name;
    try {
      const nameTranslation = tEquipments(`${equipmentKey}.name`);
      if (!nameTranslation.includes('equipmentData.')) {
        translatedName = nameTranslation;
      }
    } catch {
      // Usar nome original se não encontrar tradução
    }

    // Traduzir descrição curta (priorizar descrição comercial)
    let translatedShortDesc = equipment.shortDescription;
    try {
      const commercialDesc = getCommercialDescription(equipmentKey, locale);
      if (commercialDesc) {
        translatedShortDesc = commercialDesc;
      } else {
        const shortDescTranslation = tEquipments(`${equipmentKey}.shortDescription`);
        if (!shortDescTranslation.includes('equipmentData.')) {
          translatedShortDesc = shortDescTranslation;
        }
      }
    } catch {
      const commercialDesc = getCommercialDescription(equipmentKey, locale);
      if (commercialDesc) {
        translatedShortDesc = commercialDesc;
      }
    }

    // Traduzir descrição longa
    let translatedDescription = equipment.description;
    try {
      const descTranslation = tEquipments(`${equipmentKey}.description`);
      if (!descTranslation.includes('equipmentData.')) {
        translatedDescription = descTranslation;
      }
    } catch {
      // Usar descrição original se não encontrar tradução
    }

    // Traduzir features (async)
    const tFeatures = await getTranslations({ locale, namespace: 'features' });
    const translatedFeatures = equipment.features.map((feature) => {
      try {
        const translated = tFeatures(feature);
        if (translated && !translated.startsWith('features.')) {
          return translated;
        }
      } catch {
        // Se falhar, retornar feature original
      }
      return feature;
    });

    return {
      ...equipment,
      name: translatedName,
      shortDescription: translatedShortDesc,
      description: translatedDescription,
      features: translatedFeatures,
    };
  } catch (error) {
    console.warn('[translateEquipmentOnServer] Erro ao traduzir equipamento:', error);
    return equipment;
  }
}

