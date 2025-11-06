import { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Navigation, Pagination, Keyboard, EffectFade, Mousewheel } from 'swiper/modules';

import { getImageUrlsSet, ImageInfo } from '../../utils/getImageUrl';
import logo from '../../assets/logo.webp';

type Props = {
  images: ImageInfo[][];
  title?: string;
};

type Orientation = 'horizontal' | 'vertical';

const TyreCarousel = ({ images, title }: Props) => {
  const [loadingImages, setLoadingImages] = useState(() => images.map(() => true));
  const [imageOrientations, setImageOrientations] = useState<Orientation[]>([]);

  const [modalOpen, setModalOpen] = useState(false);

  const [activeIndex, setActiveIndex] = useState(0);

  const smallSwiperRef = useRef<SwiperType | null>(null);
  const modalSwiperRef = useRef<SwiperType | null>(null);

  const closeButtonRef = useRef<HTMLButtonElement>(null);

  let startY = 0;

  const handleImageLoad = (index: number, img: HTMLImageElement) => {
    setLoadingImages((prev) => {
      const copy = [...prev];
      copy[index] = false;
      return copy;
    });

    const orientation: 'horizontal' | 'vertical' =
      img.naturalWidth > img.naturalHeight ? 'horizontal' : 'vertical';

    setImageOrientations((prev) => {
      const copy = [...prev];
      copy[index] = orientation;
      return copy;
    });
  };

  const openModal = (index: number) => {
    setActiveIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    if (modalSwiperRef.current) {
      setActiveIndex(modalSwiperRef.current.realIndex);
    }
  };

  // Закриття модалки по Escape
  useEffect(() => {
    if (!modalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen]);

  // Блокування скролу бекграунда при відкритті модалки
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [modalOpen]);

  useEffect(() => {
    setLoadingImages(images.map(() => true));
  }, [images]);

  useEffect(() => {
    if (modalOpen && modalSwiperRef.current) {
      modalSwiperRef.current.keyboard?.enable?.();
    } else {
      modalSwiperRef.current?.keyboard?.disable?.();
    }
  }, [modalOpen]);

  useEffect(() => {
    if (modalOpen && modalSwiperRef.current) {
      const swiper = modalSwiperRef.current;

      modalSwiperRef.current.slideToLoop(activeIndex, 0);

      setTimeout(() => {
        swiper.update();
        swiper.navigation?.update?.();
        swiper.keyboard?.enable?.();
        swiper.mousewheel?.enable?.();
        swiper.slideToLoop(activeIndex, 0);
      }, 100);
    }
  }, [modalOpen, activeIndex]);

  useEffect(() => {
    if (modalOpen) {
      closeButtonRef.current?.focus();
    }
  }, [modalOpen]);

  // Спільні класи для слайдів та зображень
  const slideClass = 'flex justify-center items-center w-full h-full';
  const imgBaseClass =
    'object-contain rounded-xl transition-opacity duration-500 cursor-pointer bg-gray-100 focus:outline focus:outline-2 focus:outline-blue-500';

  return (
    <>
      {/* Small Swiper */}
      <div aria-hidden={modalOpen ? 'true' : 'false'}>
        <Swiper
          modules={[Navigation, Pagination, Keyboard, Mousewheel]}
          navigation
          pagination={{ clickable: true }}
          keyboard={{ enabled: !modalOpen, onlyInViewport: true }}
          mousewheel
          loop={images.length > 2}
          onSwiper={(swiper: SwiperType) => (smallSwiperRef.current = swiper)}
          className="rounded-xl overflow-hidden shadow-lg max-h-[400px] sm:max-h-[500px] mb-4 sm:mb-6 bg-gradient-to-br from-gray-100 via-white to-gray-100">
          {images.length > 0 ? (
            images.map((imageGroup, index) => {
              const valid = imageGroup[0];
              const { src, srcSet, sizes } = valid
                ? getImageUrlsSet(imageGroup)
                : { src: logo, srcSet: '', sizes: '' };
              const isLoading = loadingImages[index];

              return (
                <SwiperSlide key={`${index}-${valid?.url || 'placeholder'}`} className={slideClass}>
                  {isLoading && (
                    <div className="absolute inset-0 bg-gray-400 animate-pulse rounded-xl" />
                  )}

                  <figure className="w-full h-full m-0">
                    <img
                      src={src}
                      sizes={sizes}
                      srcSet={srcSet}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      fetchPriority={index === 0 ? 'high' : 'auto'}
                      alt={`tyre-${index}`}
                      className={`${imgBaseClass} ${
                        isLoading ? 'opacity-0' : 'opacity-100'
                      } w-full h-[300px] sm:h-[450px]`}
                      onLoad={(e) => handleImageLoad(index, e.currentTarget)}
                      onError={(e) => handleImageLoad(index, e.currentTarget)}
                      onClick={() => openModal(index)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          openModal(index);
                        }
                      }}
                      aria-label={`Відкрити фото ${index + 1}`}
                    />

                    <figcaption className="sr-only">Фото шини {title}</figcaption>
                  </figure>
                </SwiperSlide>
              );
            })
          ) : (
            <SwiperSlide className={slideClass}>
              <figure className="w-full h-full m-0">
                <img
                  src={logo}
                  loading="lazy"
                  alt="Типове фото шини"
                  className="w-full h-[300px] sm:h-[450px] object-cover bg-gray-100 rounded-xl"
                />
                <figcaption className="sr-only">Типове фото шини</figcaption>
              </figure>
            </SwiperSlide>
          )}
        </Swiper>
      </div>

      {/* Modal Swiper */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Галерея зображень"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-2 sm:px-6"
          onTouchStart={(e) => {
            if (e.touches.length === 1) {
              startY = e.touches[0].clientY;
            }
          }}
          onTouchMove={(e) => {
            const currentY = e.touches[0].clientY;
            const diff = currentY - startY;

            if (diff > 100) {
              closeModal();
            }
          }}>
          {/* Modal container */}
          <div
            className="relative w-full max-w-3xl max-h-[85vh] bg-white/95 dark:bg-gray-900/90 rounded-xl shadow-2xl overflow-hidden flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1} // Для можливості фокусу, якщо потрібно
          >
            {/* Close button */}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeModal}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full text-white text-xl bg-black bg-opacity-40 hover:bg-opacity-70 z-50 transition-colors focus:outline focus:outline-2 focus:outline-blue-500"
              aria-label="Закрити">
              ✕
            </button>

            {/* Swiper */}
            <Swiper
              modules={[Navigation, Pagination, Keyboard, EffectFade, Mousewheel]}
              navigation
              pagination={{ clickable: true }}
              keyboard={{ enabled: modalOpen, onlyInViewport: false }}
              mousewheel={{
                forceToAxis: true,
                sensitivity: 1,
                releaseOnEdges: true,
              }}
              loop={images.length > 2}
              fadeEffect={{ crossFade: true }}
              onSwiper={(swiper: SwiperType) => {
                modalSwiperRef.current = swiper;
              }}
              className="w-full h-full">
              {images.map((imageGroup, index) => {
                const valid = imageGroup[0];
                const { src, srcSet, sizes } = valid
                  ? getImageUrlsSet(imageGroup)
                  : { src: logo, srcSet: '', sizes: '' };

                return (
                  <SwiperSlide
                    key={`modal-${index}-${valid?.url || 'placeholder'}`}
                    className={slideClass}>
                    <div className="flex items-center justify-center w-full h-full min-h-[60vh]">
                      <figure className="w-full h-full flex items-center justify-center m-0">
                        <img
                          src={src}
                          sizes={sizes}
                          srcSet={srcSet}
                          alt={`tyre-large-${index}`}
                          className={`rounded-xl transition-all duration-500 focus:outline focus:outline-2 focus:outline-blue-500
                            ${
                              imageOrientations[index] === 'horizontal'
                                ? 'w-full h-auto max-h-[75vh]'
                                : 'h-[75vh] w-auto max-w-full'
                            }
                          `}
                          onClick={(e) => e.stopPropagation()}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              openModal(index);
                            }
                          }}
                          aria-label={`Відкрити фото ${index + 1}`}
                        />
                        <figcaption className="sr-only">Фото шини {title}</figcaption>
                      </figure>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      )}
    </>
  );
};

export default TyreCarousel;
