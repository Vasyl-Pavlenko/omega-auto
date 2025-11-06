import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { getImageUrls, ImageInfo } from '../../utils/getImageUrl';

interface TyreImageLinkProps {
  tyreId: string;
  image?: ImageInfo;
  alt: string;
  slug?: string;
  isFirstVisible?: boolean;
}

export const TyreImageLink = ({
  tyreId,
  image,
  alt,
  slug,  
  isFirstVisible = false,
}: TyreImageLinkProps) => {
  const [loading, setLoading] = useState(true);
  const { src, srcSet, sizes } = getImageUrls(image);

  useEffect(() => {
    if (isFirstVisible && src && src !== '') {
      const link = document.createElement('link');

      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    }
  }, [src, isFirstVisible]);

  return (
    <>
      {isFirstVisible && (
        <Helmet>
          <link rel="preload" as="image" href={src} />
        </Helmet>
      )}

      <Link to={`/tyre/${tyreId}/${slug || ''}`} className="group block relative">
        {loading && <div className="absolute inset-0 bg-gray-300 animate-pulse rounded-xl" />}

        <img
          src={src}
          srcSet={srcSet || undefined}
          sizes={sizes || undefined}
          alt={alt || 'Типове фото шини'}
          loading={isFirstVisible ? 'eager' : 'lazy'}
          fetchPriority={isFirstVisible ? 'high' : 'low'}
          decoding="async"
          className={
            `w-full aspect-[4/3] object-contain rounded-xl mb-3 transition-opacity duration-500 opacity-50 group-hover:opacity-100 
              ${loading ? 'invisible' : ''} 
            `
          }
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
        />
      </Link>
    </>
  );
};
