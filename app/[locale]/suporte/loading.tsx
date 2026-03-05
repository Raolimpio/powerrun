import { SuportePageSkeleton } from '@/components/common';
import { MainLayout } from '@/components/layout';

export default function Loading() {
  return (
    <MainLayout title='Carregando Suporte... - Power Run'>
      <SuportePageSkeleton />
    </MainLayout>
  );
}
