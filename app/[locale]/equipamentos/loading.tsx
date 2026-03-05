import { EquipamentosPageSkeleton } from '@/components/common';
import { MainLayout } from '@/components/layout';

export default function Loading() {
  return (
    <MainLayout title='Carregando Equipamentos... - Power Run'>
      <EquipamentosPageSkeleton />
    </MainLayout>
  );
}
