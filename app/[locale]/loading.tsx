import { HomePageSkeleton } from '@/components/common';
import { MainLayout } from '@/components/layout';

export default function Loading() {
  return (
    <MainLayout title='Carregando... - Power Run'>
      <HomePageSkeleton />
    </MainLayout>
  );
}
