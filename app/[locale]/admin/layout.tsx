import type { Metadata } from 'next';

/**
 * Layout do Painel Admin - Bloqueia indexação do Google
 * 
 * CRÍTICO: Painel admin NÃO deve ser indexado pelo Google
 * - Expõe dados sensíveis
 * - Não é conteúdo público
 * - Pode vazar informações internas
 */
export const metadata: Metadata = {
  title: 'Painel Administrativo - Power Run',
  description: 'Área administrativa restrita',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      noarchive: true,
      nosnippet: true,
    },
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

