import React, { useEffect, useState } from 'react';
import { Formik, Form, useFormikContext } from 'formik';
import { NumericFormat } from 'react-number-format';
import { Link, useNavigate } from 'react-router-dom';

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
import { useAppSelector } from '../../hooks/reduxHooks';
import { usePrompt } from '../../hooks/usePrompt';
import { useBeforeUnload } from '../../hooks/useBeforeUnload';

import type { TyreForm } from '../../types/tyre';
import { FormikChangeWatcher } from './FormikChangeWatcher';

type TyreFormProps = {
  title: string;
  error: string;
  form: TyreForm;
  isLoading: boolean;
  handleSubmit: (values: TyreForm) => void;
  showPreview: boolean;
  setShowPreview: React.Dispatch<React.SetStateAction<boolean>>;
  clearError: () => void;
};

export const TyreFormComponent: React.FC<TyreFormProps> = ({
  title,
  error,
  form,
  isLoading,
  handleSubmit,
  showPreview,
  setShowPreview,
  clearError,
}) => {
  const [usePercent, setUsePercent] = useState<boolean>(!!form.treadPercent);
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

  const convertTreadValues = (values: TyreForm) => {
    const depth = values.treadDepth;
    const percent = values.treadPercent;

    if (depth && !percent) {
      values.treadPercent = Math.round((+depth / 8) * 100).toString();
    } else if (percent && !depth) {
      values.treadDepth = (+percent * 0.08).toFixed(1);
    }

    return values;
  };

  return (
    <div>
      {isLoading && <OverlayLoader />}

      <Formik
        initialValues={form}
        validationSchema={TYRE_ADD_SCHEMA}
        onSubmit={(values: TyreForm) => {
          handleSubmit(convertTreadValues(values));
          setShowPreview(false);
        }}>
        {({ values, setFieldValue, errors, touched }) => (
          <>
            <DirtyWatcher setShouldBlockNavigation={setShouldBlockNavigation} />

            <FormikChangeWatcher clearError={clearError} />

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

              {/* Протектор */}
              <div className="mb-4">
                <label className="block mb-1 font-medium">Залишок протектора</label>
                <div className="flex gap-4 items-center">
                  <button
                    type="button"
                    onClick={() => setUsePercent(false)}
                    className={`px-3 py-1 rounded border ${
                      !usePercent ? 'bg-blue-100 border-blue-500' : 'border-gray-300'
                    }`}>
                    мм
                  </button>

                  <button
                    type="button"
                    onClick={() => setUsePercent(true)}
                    className={`px-3 py-1 rounded border ${
                      usePercent ? 'bg-blue-100 border-blue-500' : 'border-gray-300'
                    }`}>
                    %
                  </button>
                </div>

                {!usePercent ? (
                  <FormikInput
                    label=""
                    name="treadDepth"
                    type="number"
                    placeholder="Залишок у мм"
                    min={0}
                    max={12}
                  />
                ) : (
                  <FormikInput
                    label=""
                    name="treadPercent"
                    type="number"
                    placeholder="Залишок у %"
                    min={0}
                    max={100}
                  />
                )}
              </div>

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
                <label className="block mb-1 font-medium">Зображення</label>

                <ImageUploader
                  images={values.images}
                  onImagesChange={(updated) =>
                    setFieldValue(
                      'images',
                      typeof updated === 'function' ? updated(values.images) : updated,
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

              {!profile?.phoneVerified && title === 'Додати' && (
                <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 p-3 rounded-md text-sm">
                  Щоб опублікувати оголошення, потрібно підтвердити номер телефону.{' '}
                  <Link to="/profile" className="underline text-blue-600">
                    Перейти до профілю
                  </Link>
                </div>
              )}

              {error && <div className="text-red-500 text-sm text-center">{error}</div>}

              <div className="flex flex-col sm:flex-row justify-center sm:gap-3 gap-2 mt-4">
                {profile?.phoneVerified && (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-blue btn-lg w-full sm:w-auto">
                    {title !== 'Додати' ? 'Оновити' : 'Опублікувати'}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className="btn-cyan btn-md w-full sm:w-auto">
                  Переглянути оголошення
                </button>

                <button
                  type="button"
                  onClick={() => setShowLeaveConfirm(true)}
                  className="btn-red btn-lg w-full sm:w-auto">
                  Скасувати
                </button>
              </div>

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
