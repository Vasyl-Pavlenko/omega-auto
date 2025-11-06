import { useFormikContext } from 'formik';
import { useEffect, useRef } from 'react';
import type { TyreForm } from '../../types/tyre';

export const FormikChangeWatcher = ({ clearError }: { clearError: () => void }) => {
  const { values } = useFormikContext<TyreForm>();
  const prevValuesRef = useRef(values);

  useEffect(() => {
    if (JSON.stringify(prevValuesRef.current) !== JSON.stringify(values)) {
      clearError();
      prevValuesRef.current = values;
    }
  }, [values, clearError]);

  return null;
};
