import { MainLayout } from '@/components/layout';
import { Hero, CarouselSection, EquipamentosDestaque } from '@/components/ui';

export default function Home() {
  return (
    <MainLayout title='Power Run'>
      <Hero />
      <CarouselSection />
      <EquipamentosDestaque />
    </MainLayout>
  );
}
