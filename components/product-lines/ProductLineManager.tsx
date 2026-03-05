'use client';

import { ProductFeatureBlocks } from '@/components/product/ProductFeatureBlocks';
import { ProductInfo } from '@/components/product/ProductInfo';
import { ProductMasonry } from '@/components/product/ProductMasonry';
import { getFullProductConfig } from '@/constants/product-manager';
import { Equipment } from '@/types';

interface ProductLineManagerProps {
  equipment: Equipment;
  mode: 'product' | 'support';
  onShowSpecs?: () => void;
}

/**
 * 🎯 GERENCIADOR DE COMPONENTES POR LINHA DE PRODUTO
 *
 * Este componente decide qual layout usar baseado no produto,
 * mantendo EXATAMENTE o mesmo visual das páginas atuais.
 *
 * Não altera NADA no layout - apenas organiza o código!
 */
export function ProductLineManager({ equipment, mode, onShowSpecs }: ProductLineManagerProps) {
  const config = getFullProductConfig(equipment.id);

  // Se não tem configuração específica, usa o comportamento atual
  if (!config.hasConfig) {
    return (
      <>
        {mode === 'product' && (
          <>
            <ProductInfo
              equipment={equipment}
              productLine={config.line.line}
              colors={{
                text: config.line.colors.text,
                solid: config.line.colors.primary,
                hover: config.line.colors.bg,
              }}
              onShowSpecs={onShowSpecs || (() => {})}
            />

            {/* Renderizar Masonry e FeatureBlocks baseado nas regras atuais */}
            {shouldShowMasonry(equipment.id) && <ProductMasonry equipment={equipment} />}

            {shouldShowFeatureBlocks(equipment.id) && (
              <ProductFeatureBlocks equipment={equipment} />
            )}
          </>
        )}
      </>
    );
  }

  // Com configuração específica, ainda usa os componentes atuais
  // mas com dados centralizados
  return (
    <>
      {mode === 'product' && (
        <>
          <ProductInfo
            equipment={equipment}
            productLine={config.line.line}
            colors={{
              text: config.line.colors.text,
              solid: config.line.colors.primary,
              hover: config.line.colors.bg,
            }}
            onShowSpecs={onShowSpecs || (() => {})}
          />

          {shouldShowMasonry(equipment.id) && <ProductMasonry equipment={equipment} />}

          {shouldShowFeatureBlocks(equipment.id) && <ProductFeatureBlocks equipment={equipment} />}
        </>
      )}
    </>
  );
}

/**
 * Determina se deve mostrar ProductMasonry baseado nas regras atuais
 * Mantém EXATAMENTE o mesmo comportamento da página atual
 */
function shouldShowMasonry(equipmentId: string): boolean {
  // Equipamentos que NÃO mostram masonry (copiado exatamente da página atual)
  const excludedFromMasonry = [
    'esteira-pr4000-18',
    'esteira-pr4000-30',
    'bicicleta-spinning-pr200',
    'esteira-pr5000',
    'esteira-pr5000i',
    'esteira-pr6000',
    'esteira-pr6000i',
    'bike-vertical-pr300',
    'bike-horizontal-pr400',
    'eliptico-pr500',
    'escada-pr600',
    'multi-gym-pr012',
    'banco-bi-inclinavel-pr014',
    'pr001-peitoral-dorsal',
    'pr002-polia-superior-remada',
    'pr003-multi-press',
    'pr004-biceps-triceps',
    'pr005-leg-press-hack',
    'pr006-cadeira-adutora-abdutora',
    'pr008-leg-press-hack-squat',
    'pr009-cross-over-angular',
    'pr010-multi-station',
    'pr013-banco-uni-inclinavel',
    'pr015-cadeira-extensora-flexora',
    'power-rise-650',
    'power-round-550',
    'power-rush-250',
    'power-rush-350',
    'power-rush-450',
  ];

  // Equipamentos que mostram APENAS masonry (sem feature blocks)
  const masonryOnly = [
    'bicicleta-spinning-pr200',
    'esteira-pr5000',
    'esteira-pr5000i',
    'esteira-pr6000',
    'esteira-pr6000i',
    'bike-vertical-pr300',
    'bike-horizontal-pr400',
    'escada-pr600',
    'power-round-550',
    'power-rush-250',
  ];

  if (excludedFromMasonry.includes(equipmentId)) {
    return masonryOnly.includes(equipmentId);
  }

  return true; // Mostra masonry para todos os outros
}

/**
 * Determina se deve mostrar ProductFeatureBlocks baseado nas regras atuais
 * Mantém EXATAMENTE o mesmo comportamento da página atual
 */
function shouldShowFeatureBlocks(equipmentId: string): boolean {
  // Equipamentos que NÃO mostram feature blocks (copiado exatamente da página atual)
  const excludedFromFeatureBlocks = [
    'esteira-pr4000-18',
    'esteira-pr4000-30',
    'bicicleta-spinning-pr200',
    'esteira-pr5000',
    'esteira-pr5000i',
    'esteira-pr6000',
    'esteira-pr6000i',
    'bike-vertical-pr300',
    'bike-horizontal-pr400',
    'eliptico-pr500',
    'escada-pr600',
    'multi-gym-pr012',
    'banco-bi-inclinavel-pr014',
    'pr001-peitoral-dorsal',
    'pr002-polia-superior-remada',
    'pr003-multi-press',
    'pr004-biceps-triceps',
    'pr005-leg-press-hack',
    'pr006-cadeira-adutora-abdutora',
    'pr008-leg-press-hack-squat',
    'pr009-cross-over-angular',
    'pr010-multi-station',
    'pr013-banco-uni-inclinavel',
    'pr015-cadeira-extensora-flexora',
    'power-rise-650',
    'power-round-550',
    'power-rush-250',
    'power-rush-350',
    'power-rush-450',
  ];

  return !excludedFromFeatureBlocks.includes(equipmentId);
}
