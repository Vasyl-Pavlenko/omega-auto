import { Helmet } from 'react-helmet';
import { Tyre } from '../types/tyre';

interface TyreDetailSEOProps {
  tyre: Tyre;
  url: string;
}

export const TyreSeo = ({ tyre, url }: TyreDetailSEOProps) => {
  const title = `Шина ${tyre.brand} ${tyre.model} ${tyre.width}/${tyre.height}R${tyre.radius} | Omega Tyres Market`;
  const rawDescription = tyre.description?.slice(0, 160) || 'Деталі оголошення про шини';
  const description = rawDescription.replace(/\s+/g, ' ').trim();

  const image =
    tyre.images?.[0]?.find((img) => img.width === 800)?.url ||
    tyre.images?.[0]?.[0]?.url ||
    undefined;

  const allImages =
    tyre.images?.flatMap((imgArray) =>
      imgArray.map((img) => (typeof img.url === 'string' ? img.url : null)).filter(Boolean),
    ) || [];

  const canonicalUrl = url;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    image: allImages,
    description,
    sku: tyre._id,
    brand: {
      '@type': 'Brand',
      name: tyre.brand,
    },
    offers: {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: 'UAH',
      price: tyre.price,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: tyre.isActive ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/UsedCondition',
    },
  };

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Оголошення',
        item: 'https://omega-auto.vercel.app',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: `${tyre.brand} ${tyre.model}`,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <Helmet htmlAttributes={{ lang: 'uk' }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="keywords"
        content={`шина ${tyre.brand} ${tyre.model}, ${tyre.width}/${tyre.height} R${tyre.radius}, купити шини, б/в шини`}
      />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="product" />
      <meta property="og:url" content={canonicalUrl} />

      {image && [
        <meta key="og-image" property="og:image" content={image} />,
        <meta
          key="og-image-alt"
          property="og:image:alt"
          content={`Шина ${tyre.brand} ${tyre.model}`}
        />,
        <meta key="og-image-width" property="og:image:width" content="1200" />,
        <meta key="og-image-height" property="og:image:height" content="630" />,
      ]}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {image && <meta name="twitter:image" content={image} />}
      {image && <meta name="twitter:image:alt" content={`Шина ${tyre.brand} ${tyre.model}`} />}

      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
    </Helmet>
  );
};
