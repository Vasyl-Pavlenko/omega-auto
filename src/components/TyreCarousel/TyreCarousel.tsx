import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard } from 'swiper/modules';

import { getImageUrlsSet, ImageInfo } from '../../utils/getImageUrl';
import logo from '../../assets/logo.webp';

type Props = {
  images: ImageInfo[][];
};

const TyreCarousel = ({ images }: Props) => {
  const [loadingImages, setLoadingImages] = useState(() => images.map(() => true));

  const handleImageLoad = (index: number) => {
    setLoadingImages((prev) => {
      const copy = [...prev];
      copy[index] = false;
      return copy;
    });
  };

  return (
    <Swiper
      modules={[Navigation, Pagination, Keyboard]}
      navigation
      pagination={{ clickable: true }}
      keyboard={{ enabled: true, onlyInViewport: true }}
      loop={true}
      className="rounded-xl overflow-hidden max-h-[400px] sm:max-h-[500px] mb-4 sm:mb-6"
    >
      {images.length > 0 ? (
        images.map((imageGroup, index) => {
          const { src, srcSet, sizes } = getImageUrlsSet(imageGroup);
          const isLoading = loadingImages[index];

          return (
            <SwiperSlide key={`${index}-${imageGroup[0].url}`} className="relative">
              {isLoading && (
                <div className="absolute inset-0 bg-gray-300 animate-pulse rounded-xl" />
              )}

              <img
                src={src}
                sizes={sizes}
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : 'auto'}
                srcSet={srcSet}
                alt={`tyre-${index}`}
                className={`w-full h-[300px] sm:h-[450px] object-cover bg-gray-100 rounded-xl transition-opacity duration-500 ${
                  isLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={() => handleImageLoad(index)}
                onError={() => handleImageLoad(index)}
              />
            </SwiperSlide>
          );
        })
      ) : (
        <SwiperSlide>
          <img
            src={logo}
            loading="lazy"
            alt="Типове фото шини"
            className="w-full h-[300px] sm:h-[450px] object-cover bg-gray-100 rounded-xl"
          />
        </SwiperSlide>
      )}
    </Swiper>
  );
};

export default TyreCarousel;
