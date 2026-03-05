import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/routing';

// Página raiz - redireciona para o locale padrão
export default function RootPage() {
  // Redirecionamento server-side para o locale padrão
  redirect(`/${defaultLocale}`);
}
