'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import type { StaticCity } from '@/data/cities-static-max';

interface RelatedCitiesLinksProps {
  currentCity: StaticCity;
  productId: string;
  keyword: string;
  locale: 'pt-BR' | 'en' | 'es';
  allCities: StaticCity[];
}

/**
 * 🔗 COMPONENTE DE LINKS INTERNOS PARA SEO
 * 
 * Estratégia profissional 2025:
 * - Mostra cidades relacionadas (mesma região/país)
 * - Links ajudam Google a descobrir outras URLs
 * - Fica colapsado por padrão (não polui UI)
 * - Google vê os links mesmo colapsados
 * - Melhora link equity e crawlability
 */
export default function RelatedCitiesLinks({
  currentCity,
  productId,
  keyword,
  locale,
  allCities,
}: RelatedCitiesLinksProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Filtrar cidades relacionadas (mesmo país e estado, exceto a atual)
  const relatedCities = allCities
    .filter(
      (city) =>
        city.locale === currentCity.locale &&
        city.countryCode === currentCity.countryCode &&
        city.stateCode === currentCity.stateCode &&
        city.slug !== currentCity.slug
    )
    .sort((a, b) => (b.population || 0) - (a.population || 0)) // Ordenar por população
    .slice(0, 100); // Top 100 cidades do estado

  // Se não houver cidades relacionadas no estado, buscar do país
  const countryCities =
    relatedCities.length < 5
      ? allCities
          .filter(
            (city) =>
              city.locale === currentCity.locale &&
              city.countryCode === currentCity.countryCode &&
              city.slug !== currentCity.slug
          )
          .sort((a, b) => (b.population || 0) - (a.population || 0))
          .slice(0, 100)
      : [];

  const citiesToShow = relatedCities.length >= 5 ? relatedCities : countryCities;

  if (citiesToShow.length === 0) return null;

  const regionName = currentCity.state;
  const countryName = currentCity.country;

  return (
    <section className="mt-12 border-t pt-8">
      {/* Header sempre visível */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-red-600" />
          Outras Cidades em {regionName}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Encontre nossos equipamentos profissionais em outras cidades de {regionName}, {countryName}
        </p>
      </div>

      {/* Botão para expandir/colapsar */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mb-4"
        aria-expanded={isExpanded}
        aria-controls="related-cities-content"
      >
        <span className="font-medium text-gray-900 dark:text-white">
          {isExpanded ? 'Ocultar' : 'Ver'} {citiesToShow.length} cidades em {regionName}
        </span>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* Grid de links - SEMPRE renderizado para SEO, mas visualmente oculto */}
      <div
        id="related-cities-content"
        className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 transition-all duration-300 ${
          isExpanded ? 'opacity-100 max-h-[3000px]' : 'opacity-0 max-h-0 overflow-hidden'
        }`}
        aria-hidden={!isExpanded}
      >
        {citiesToShow.map((city) => (
          <Link
            key={city.slug}
            href={`/${locale}/seo/${productId}/${keyword}/${city.slug}`}
            className="flex items-center gap-1.5 px-2 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded hover:border-red-500 hover:shadow-sm transition-all group"
            title={`${keyword.replace(/-/g, ' ')} em ${city.name}, ${city.stateCode}`}
          >
            <MapPin className="w-3 h-3 text-gray-400 group-hover:text-red-600 transition-colors flex-shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-gray-900 dark:text-white group-hover:text-red-600 transition-colors truncate">
                {city.name}
              </span>
              {city.population && city.population > 50000 && (
                <span className="text-[10px] text-gray-500 truncate">
                  {(city.population / 1000).toFixed(0)}k
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* SEO: Links adicionais em texto simples (sempre visível para crawlers) */}
      <div className="mt-6 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        <p>
          <strong>Cidades atendidas em {regionName}:</strong>{' '}
          {citiesToShow.map((city, index) => (
            <span key={city.slug}>
              <Link
                href={`/${locale}/seo/${productId}/${keyword}/${city.slug}`}
                className="text-red-600 hover:underline"
              >
                {city.name}
              </Link>
              {index < citiesToShow.length - 1 ? ', ' : '.'}
            </span>
          ))}
        </p>
      </div>

      {/* Schema.org para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: citiesToShow.map((city, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@type': 'Place',
                name: `${city.name}, ${city.stateCode}`,
                url: `https://powerrun.com.br/${locale}/seo/${productId}/${keyword}/${city.slug}`,
              },
            })),
          }),
        }}
      />
    </section>
  );
}

