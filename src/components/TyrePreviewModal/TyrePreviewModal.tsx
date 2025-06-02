import React from 'react';
import { PhoneCall } from 'lucide-react';
import { useFormikContext } from 'formik';
import { motion, AnimatePresence } from 'framer-motion';

import { useAppSelector } from '../../hooks/reduxHooks';
import { getImageUrls } from '../../utils/getImageUrl';
import { OverlayLoader } from '../OverlayLoader';
import { TyreForm } from '../../types/tyre';

type TyrePreviewModalProps = {
  show: boolean;
  onClose: () => void;
  onLeaveConfirm: () => void;
  form: TyreForm;
  isLoading: boolean;
  title: string;
};

export const TyrePreviewModal: React.FC<TyrePreviewModalProps> = ({
  show,
  onClose,
  onLeaveConfirm,
  form,
  isLoading,
  title,
}) => {
  const { profile } = useAppSelector((state) => state.profile);
  const { submitForm } = useFormikContext();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            tabIndex={-1}
            className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-lg relative p-4 sm:p-6"
          >
            {isLoading && <OverlayLoader />}

            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl"
              aria-label="Закрити модалку">
              &times;
            </button>

            {/* Основне зображення */}
            {form.images.length > 0 && form.images[0]?.[0] && (
              <img
                {...getImageUrls(form.images[0][0])}
                alt="Прев’ю"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}

            {/* Заголовок і ціна */}
            <h2 className="text-xl font-bold text-blue-600 mb-2">
              {form.brand} {form.model}
            </h2>

            <div className="text-lg font-semibold text-gray-800 mb-4">{form.price} грн</div>

            {/* Деталі */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700 mb-6">
              <div>
                <strong>Ширина:</strong> {form.width}
              </div>

              <div>
                <strong>Висота:</strong> {form.height}
              </div>

              <div>
                <strong>Радіус:</strong> {form.radius}
              </div>
              <div>
                <strong>Рік:</strong> {form.year}
              </div>
              <div>
                <strong>Сезон:</strong> {form.season}
              </div>
              <div>
                <strong>Стан:</strong> {form.condition}
              </div>

              <div>
                <strong>Тип авто:</strong> {form.vehicle}
              </div>

              <div>
                <strong>Глибина протектора:</strong> {form.treadDepth} мм
              </div>

              <div>
                <strong>Кількість:</strong> {form.quantity} шт
              </div>

              <div>
                <strong>Місто:</strong> {form.city}
              </div>
            </div>

            {/* Опис */}
            {form.description && (
              <div className="mb-6">
                <div className="font-semibold mb-1">Опис:</div>

                <p className="text-sm text-gray-800 whitespace-pre-wrap">{form.description}</p>
              </div>
            )}

            {/* Інші фото */}
            {form.images.length > 1 && (
              <div className="mb-6">
                <div className="font-semibold mb-2">Інші фото:</div>

                <div className="flex gap-2 flex-wrap">
                  {form.images.slice(1).map((imgGroup, idx) => {
                    const previewImage = imgGroup.find((img) => img.width === 400) || imgGroup[0];

                    const { src, srcSet, sizes } = getImageUrls(previewImage);
                    return (
                      <img
                        key={idx}
                        src={src}
                        srcSet={srcSet}
                        sizes={sizes}
                        alt={`img-${idx}`}
                        className="w-20 h-20 object-cover rounded border"
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Контакти */}
            <div className="flex items-center gap-2 text-sm text-gray-700 mb-6">
              <PhoneCall className="w-5 h-5 text-green-600" />

              <span>{form.contact}</span>
            </div>

            {/* Кнопки дій */}
            <div className="flex justify-end gap-3">
              {profile?.phoneVerified && (
                <button
                  type="button"
                  aria-label={title !== 'Додати' ? 'Оновити' : 'Опублікувати'}
                  onClick={() => {
                    submitForm();
                  }}
                  disabled={isLoading}
                  className="btn-blue btn-lg">
                  {title !== 'Додати' ? 'Оновити' : 'Опублікувати'}
                </button>
              )}

              <button
                type="button"
                onClick={onLeaveConfirm}
                className="btn-red btn-lg"
                aria-label="Скасувати">
                Скасувати
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
