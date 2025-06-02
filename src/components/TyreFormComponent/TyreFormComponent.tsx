import React, { useEffect, useState } from 'react';
import { Formik, Form, useFormikContext } from 'formik';

import { TyreForm } from '../../types/tyre';
import { NumericFormat } from 'react-number-format';

import {
  VEHICLE_TYPE_OPTIONS,
  SEASON_OPTIONS,
  CONDITION_OPTIONS,
  TYRE_WIDTH_OPTIONS,
  TYRE_HEIGHT_OPTIONS,
  TYRE_RADIUS_OPTIONS,
} from '../../constants/tyreOptions';

import { ConfirmModal, ImageUploader, OverlayLoader, TyrePreviewModal } from '../index';
import { TYRE_ADD_SCHEMA } from '../../schemas/validationSchemas';
import { FormikSelect } from './FormikSelect';
import { FormikInput } from './FormikInput';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/reduxHooks';
import { usePrompt } from '../../hooks/usePrompt';
import { useBeforeUnload } from '../../hooks/useBeforeUnload';

type TyreFormProps = {
  title: string;
  error: string;
  form: TyreForm;
  isLoading: boolean;
  handleSubmit: (values: TyreForm) => void;
  showPreview: boolean;
  setShowPreview: React.Dispatch<React.SetStateAction<boolean>>;
};

export const TyreFormComponent: React.FC<TyreFormProps> = ({
  title,
  error,
  form,
  isLoading,
  handleSubmit,
  showPreview,
  setShowPreview,
}) => {
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [shouldBlockNavigation, setShouldBlockNavigation] = useState(false);

  const { profile } = useAppSelector((state) => state.profile);
  const navigate = useNavigate();

  const handleLeavePage = () => {
    setShowLeaveConfirm(false);
    navigate('/my');
  };

  useBeforeUnload(shouldBlockNavigation && !isLoading);

  usePrompt(
    'Ви маєте незбережені зміни. Покинути сторінку?',
    shouldBlockNavigation && !showLeaveConfirm && !isLoading,
  );

  const DirtyWatcher = ({
    setShouldBlockNavigation,
  }: {
    setShouldBlockNavigation: (val: boolean) => void;
  }) => {
    const { dirty } = useFormikContext();

    useEffect(() => {
      setShouldBlockNavigation(dirty);
    }, [dirty]);

    return null;
  };

  return (
    <div>
      {isLoading && <OverlayLoader />}

      <Formik
        enableReinitialize
        initialValues={form}
        validationSchema={TYRE_ADD_SCHEMA}
        onSubmit={(values: TyreForm) => {
          handleSubmit(values);
          setShowPreview(false);
        }}>
        {({ values, setFieldValue, errors, touched }) => (
          <>
            <DirtyWatcher setShouldBlockNavigation={setShouldBlockNavigation} />

            <Form className="space-y-4 max-w-xl mx-auto">
              <FormikInput label="Бренд" name="brand" type="text" placeholder="Бренд" />

              <FormikInput label="Модель" name="model" type="text" placeholder="Модель" />

              <FormikInput
                label="Рік виготовлення"
                name="year"
                type="number"
                min={1900}
                max={new Date().getFullYear()}
                placeholder="Рік виготовлення"
              />

              <FormikInput
                label="Залишок протектора"
                name="treadDepth"
                type="number"
                min={0}
                max={12}
                placeholder="Залишок протектора"
              />

              <div className="grid grid-cols-3 gap-2">
                <FormikSelect label="Ширина" name="width" options={TYRE_WIDTH_OPTIONS} />

                <FormikSelect label="Висота" name="height" options={TYRE_HEIGHT_OPTIONS} />

                <FormikSelect label="Радіус" name="radius" options={TYRE_RADIUS_OPTIONS} />
              </div>

              <FormikSelect label="Сезон" name="season" options={SEASON_OPTIONS} />

              <FormikSelect label="Тип транспорту" name="vehicle" options={VEHICLE_TYPE_OPTIONS} />

              <FormikSelect label="Стан" name="condition" options={CONDITION_OPTIONS} />

              <FormikInput
                label="Кількість"
                name="quantity"
                type="number"
                placeholder="Кількість"
              />

              <FormikInput label="Місто" name="city" type="text" placeholder="Місто" />

              {/* Ціна */}
              <div className="mb-4">
                <label htmlFor="price" className="block mb-1 font-medium">
                  Ціна (грн)
                </label>

                <NumericFormat
                  id="price"
                  name="price"
                  value={values.price}
                  thousandSeparator
                  decimalScale={2}
                  fixedDecimalScale
                  allowNegative={false}
                  placeholder="Ціна"
                  className={`border p-2 w-full rounded-lg ${
                    touched.price && errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  onValueChange={(val) => setFieldValue('price', val.value)}
                />

                {touched.price && errors.price && (
                  <div className="text-red-500 text-sm mt-1">{errors.price}</div>
                )}
              </div>

              {/* Зображення */}
              <div>
                <label htmlFor="imageUrl" className="block mb-1 font-medium">
                  Зображення
                </label>

                <ImageUploader
                  images={values.images}
                  onImagesChange={(updatedImagesOrFn) =>
                    setFieldValue(
                      'images',
                      typeof updatedImagesOrFn === 'function'
                        ? updatedImagesOrFn(values.images)
                        : updatedImagesOrFn,
                    )
                  }
                />
              </div>

              {/* Опис */}
              <div>
                <label htmlFor="description" className="block mb-1 font-medium">
                  Детальний опис
                </label>

                <textarea
                  id="description"
                  name="description"
                  placeholder="Детальний опис"
                  rows={6}
                  className={`border p-2 w-full rounded-lg ${
                    touched.description && errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={values.description}
                  onChange={(e) => setFieldValue('description', e.target.value)}
                />

                {touched.description && errors.description && (
                  <div className="text-red-500 text-sm mt-1">{errors.description}</div>
                )}
              </div>

              {/* Повідомлення про підтвердження телефону */}
              {!profile?.phoneVerified && title === 'Додати' && (
                <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 p-3 rounded-md text-sm">
                  Щоб опублікувати оголошення, потрібно підтвердити номер телефону.{' '}
                  <Link to="/profile" className="underline text-blue-600">
                    Перейти до профілю
                  </Link>
                </div>
              )}

              {/* Помилки */}
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}

              {/* Кнопки дій */}
              <div className="flex flex-col sm:flex-row justify-center sm:gap-3 gap-2 mt-4">
                {profile?.phoneVerified && (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-blue btn-lg w-full sm:w-auto"
                    aria-label={title !== 'Додати' ? 'Оновити' : 'Опублікувати'}
                  >
                    {title !== 'Додати' ? 'Оновити' : 'Опублікувати'}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className="btn-cyan btn-md w-full sm:w-auto"
                  aria-label="Переглянути оголошення"
                >
                  Переглянути оголошення
                </button>

                <button
                  type="button"
                  onClick={() => setShowLeaveConfirm(true)}
                  className="btn-red btn-lg w-full sm:w-auto"
                  aria-label="Скасувати"
                >
                  Скасувати
                </button>
              </div>

              {/* Модалка попереднього перегляду */}
              <TyrePreviewModal
                show={showPreview}
                onClose={() => setShowPreview(false)}
                form={values}
                isLoading={isLoading}
                title={title}
                onLeaveConfirm={() => {
                  if (shouldBlockNavigation) {
                    setShowLeaveConfirm(true);
                  } else {
                    setShowPreview(false);
                  }
                }}
              />

              <ConfirmModal
                isOpen={showLeaveConfirm}
                confirmType="custom"
                customTitle="Ви впевнені, що хочете покинути сторінку?"
                customMessage="Всі незбережені зміни буде втрачено."
                customConfirmText="Покинути"
                onConfirm={handleLeavePage}
                onCancel={() => setShowLeaveConfirm(false)}
              />
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
};
