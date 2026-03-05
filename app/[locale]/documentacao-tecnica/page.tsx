import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { DocumentacaoTecnicaClient } from './components/DocumentacaoTecnicaClient';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: 'documentacao-tecnica',
  });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
    },
  };
}

export default function DocumentacaoTecnicaPage() {
  return <DocumentacaoTecnicaClient />;
}
