import { Metadata } from 'next';
import { FichasTecnicasAdmin } from './components/FichasTecnicasAdmin';

export const metadata: Metadata = {
  title: 'Fichas Técnicas - Admin | Power Run',
  description: 'Painel administrativo para gerenciamento de fichas técnicas dos produtos',
  robots: {
    index: false,
    follow: false,
  },
};

// 🚫 Configuração para evitar cache - sempre usar versão mais atualizada
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function FichasTecnicasPage() {
  return <FichasTecnicasAdmin />;
}
