import { Helmet } from 'react-helmet';

interface HomePageSEOProps {
  url: string;
}

export const HomePageSeo = ({ url }: HomePageSEOProps) => {
  const title = 'Купити шини – Нові та б/в шини з рук по всій Україні';
  const description =
    'Продаж шин за вигідними цінами. Понад 1000 оголошень – знайдіть потрібний розмір, бренд та стан. Легка навігація, фільтри, фото та контактні дані продавців.';

  const structuredOrganization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Omega Market',
    alternateName: 'Шини Україна',
    url: url,
    logo: 'https://omega-auto.vercel.app/assets/logo.webp',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  const structuredWebsite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Omega Market',
    alternateName: 'Шини Україна',
    url: url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${url}/search?query={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Головна',
        item: url,
      },
    ],
  };

  return (
    <Helmet htmlAttributes={{ lang: 'uk' }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="keywords"
        content="шини, купити шини, б/у шини, нові шини, шини Україна, шини з рук"
      />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content="https://omega-auto.vercel.app/omega.webp" />
      <meta property="og:image:alt" content="Шини з рук по всій Україні – Omega Auto" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="https://omega-auto.vercel.app/omega.webp" />
      <meta name="twitter:image:alt" content="Шини з рук по всій Україні – Omega Auto" />

      {/* Structured Data */}
      <script type="application/ld+json">{JSON.stringify(structuredOrganization)}</script>
      <script type="application/ld+json">{JSON.stringify(structuredWebsite)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
    </Helmet>
  );
};
