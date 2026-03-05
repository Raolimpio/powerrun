import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { fetchEquipmentById } from '@/services/equipments';
import EquipmentDetailClient from './EquipmentDetailClient';

// Função para gerar metadados SEO específicos para cada equipamento
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;

  try {
    const { data: equipment } = await fetchEquipmentById(id, locale);
    const t = await getTranslations({ locale, namespace: 'common' });

    if (!equipment) {
      return {
        title: `${t('notFoundEquipmentTitle')} - Power Run`,
        description: t('notFoundEquipmentDesc'),
      };
    }

    const title = `${equipment.name} - Power Run`;
    const description =
      equipment.shortDescription ||
      `${equipment.name} - Equipamento profissional Power Run com tecnologia avançada e qualidade superior.`;

    return {
      title,
      description,
      keywords: [
        equipment.name.toLowerCase(),
        equipment.category,
        'power run',
        'equipamento profissional',
        'academia',
        'fitness',
        equipment.brand?.toLowerCase() || 'power run',
      ],
      openGraph: {
        title,
        description,
        images: equipment.images?.[0] ? [equipment.images[0]] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: equipment.images?.[0] ? [equipment.images[0]] : [],
      },
    };
  } catch (error) {
    console.error('Erro ao gerar metadata:', error);
    return {
      title: 'Equipamento - Power Run',
      description: 'Equipamentos profissionais Power Run com tecnologia de ponta.',
    };
  }
}

export default function EquipmentDetailPage() {
  return <EquipmentDetailClient />;
}
