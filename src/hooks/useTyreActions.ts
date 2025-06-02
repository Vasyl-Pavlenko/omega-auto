import { useCallback, useState } from 'react';
import { useAppDispatch } from '../hooks/reduxHooks';
import {
  removeTyre,
  removeTyreFromActive,
  renewTyreThunk,
  activateTyre,
} from '../store/slices/tyres/tyresSlice';
import { toast } from 'react-toastify';
import { fetchMyTyres } from '../store/slices/tyres/myTyresSlice';

type ModalType = 'delete' | 'activate' | 'extend' | null;

interface Tyre {
  _id: string;
  expiresAt: string;
  isDeleted: boolean;
}

interface UseTyreActionsProps {
  tyre: Tyre;
  onRemove?: () => void;
}

export const useTyreActions = ({ tyre, onRemove }: UseTyreActionsProps) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const onConfirm = useCallback(
    async (id: string, modalType: ModalType) => {
      if (!modalType) {
        return;
      }

      setIsLoading(true);

      try {
        if (modalType === 'delete') {
          const action = tyre.isDeleted ? removeTyre : removeTyreFromActive;

          await dispatch(action(id)).unwrap();

          toast.success(
            tyre.isDeleted ? 'Оголошення повністю видалено ✅' : 'Переміщено до видалених 🗑️',
          );

          onRemove?.();
        } else if (modalType === 'activate') {
          if (new Date(tyre.expiresAt) < new Date()) {
            toast.error('Оголошення завершилось. Спочатку поновіть його ❌');
            setIsLoading(false);

            return;
          }
          
          await dispatch(activateTyre(tyre._id)).unwrap();

          toast.success('Оголошення активовано ✅');
        } else if (modalType === 'extend') {
          await dispatch(renewTyreThunk(tyre._id)).unwrap();

          toast.success('Оголошення поновлено на 30 днів ✅');
        }

        await dispatch(fetchMyTyres());
      } catch {
        toast.error('Не вдалося виконати дію ❌');
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, tyre, onRemove],
  );

  return {
    onConfirm,
    isLoading,
  };
};
