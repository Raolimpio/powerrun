import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/routing';
import {
  getCityBySlug,
  getBrazilianCitiesWithPopulation,
  getUSPriorityCities,
  getLatinAmericaPriorityCities,
  type InternationalCity,
} from '@/services/international-cities-full';
import { getKitKeywords } from '@/services/kit-seo-keywords';
import { generateSEOSlug } from '@/services/seo-keywords';
import { SEOKitCityPageClient } from '../../../kits/components/SEOKitCityPageClient';

type SupportedLocale = 'pt-BR' | 'en' | 'es';

const SUPPORTED_SEO_LOCALES: SupportedLocale[] = ['pt-BR', 'en', 'es'];

interface Props {
  params: Promise<{
    locale: string;
    keyword: string;
    citySlug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, keyword, citySlug } = await params;

  if (!SUPPORTED_SEO_LOCALES.includes(locale as SupportedLocale)) {
    return {
      title: 'Projetos de academia Power Run',
      description:
        'Projetos profissionais de academia para condomínios com equipamentos Power Run.',
    };
  }

  try {
    const city = await getCityBySlug(citySlug);
    if (!city) {
      return {
        title: 'Projetos de academia Power Run',
        description:
          'Projetos profissionais de academia para condomínios com equipamentos Power Run.',
      };
    }

    const decodedKeyword = keyword.replace(/-/g, ' ');
    const productName = 'Kits Blue Line premium para academias de condomínio';

    const title =
      locale === 'en'
        ? `Premium condo gym kits Blue Line in ${city.name}, ${city.countryCode} | Power Run`
        : locale === 'es'
          ? `Kits Blue Line premium para gimnasios en condominios en ${city.name}, ${city.countryCode} | Power Run`
          : `Kits Blue Line premium para academia de condomínio em ${city.name} ${city.countryCode} | Power Run`;

    const description =
      locale === 'en'
        ? `${decodedKeyword} in ${city.fullName}. ${productName} with premium treadmills, stair climbers, ellipticals and bikes for luxury condominiums.`
        : locale === 'es'
          ? `${decodedKeyword} en ${city.fullName}. ${productName} con caminadoras, escaleras, elípticos y bicicletas premium para condominios de alto estándar.`
          : `${decodedKeyword} em ${city.fullName}. ${productName} com esteiras, escadas, elípticos e bikes premium para condomínios de alto padrão.`;

    const canonicalUrl = `https://powerrun.com.br/${locale}/seo/kits-blue-line/${keyword}/${citySlug}`;

    const alternateUrls: Record<string, string> = {};
    locales.forEach((loc) => {
      alternateUrls[loc] =
        `https://powerrun.com.br/${loc}/seo/kits-blue-line/${keyword}/${citySlug}`;
    });

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
        url: canonicalUrl,
        siteName: 'Power Run',
        locale: locale === 'pt-BR' ? 'pt_BR' : locale === 'es' ? 'es_ES' : 'en_US',
        alternateLocale: locales.filter((l) => l !== locale),
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        creator: '@powerrunbrasil',
        site: '@powerrunbrasil',
      },
      alternates: {
        canonical: canonicalUrl,
        languages: alternateUrls,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch {
    return {
      title: 'Projetos de academia Power Run',
      description:
        'Projetos profissionais de academia para condomínios com equipamentos Power Run.',
    };
  }
}

export async function generateStaticParams() {
  const localesList: SupportedLocale[] = ['pt-BR', 'en', 'es'];

  const paths: Array<{
    locale: string;
    keyword: string;
    citySlug: string;
  }> = [];

  const MAX_CITIES_FOR_PRERENDER = 50;

  for (const locale of localesList) {
    let cities: InternationalCity[] = [];

    if (locale === 'pt-BR') {
      cities = await getBrazilianCitiesWithPopulation(100000, MAX_CITIES_FOR_PRERENDER);
    } else if (locale === 'en') {
      cities = await getUSPriorityCities(MAX_CITIES_FOR_PRERENDER);
    } else if (locale === 'es') {
      cities = await getLatinAmericaPriorityCities(MAX_CITIES_FOR_PRERENDER);
    }

    const keywords = getKitKeywords('blue', locale);
    const keywordSlugs = keywords.map((k) => generateSEOSlug(k));

    for (const city of cities) {
      for (const kw of keywordSlugs) {
        paths.push({
          locale,
          keyword: kw,
          citySlug: city.slug,
        });
      }
    }
  }

  return paths;
}

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 86400; // 24h

export default async function SEOBlueLineKitsCityPage({ params }: Props) {
  const { locale, keyword, citySlug } = await params;

  if (!SUPPORTED_SEO_LOCALES.includes(locale as SupportedLocale)) {
    notFound();
  }

  const city = await getCityBySlug(citySlug);

  if (!city) {
    notFound();
  }

  return <SEOKitCityPageClient line='blue' city={city} keyword={keyword} />;
}
