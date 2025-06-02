import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { fetchFavorites, toggleTyreFavorite } from '../store/slices/tyres/tyreSlice';
import { toast } from 'react-toastify';

export function useFavorites() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  const { favorites } = useAppSelector((state) => state.tyre);
  const isLoggedIn = Boolean(user && user.userId);

  const [isLoading, setIsLoading] = useState(false);

  const updateFavorites = async (tyreId: string, currentFavorite: boolean) => {
    if (!isLoggedIn) {
      toast.info('Щоб зберегти шини в обране, спершу увійдіть у систему');
      return;
    }

    setIsLoading(true);

    try {
      await dispatch(toggleTyreFavorite({ id: tyreId, currentFavorite })).unwrap();

      await dispatch(fetchFavorites());

      const newFavorite = !currentFavorite;
      
      toast.success(newFavorite ? 'Додано в обране ❤️' : 'Видалено з обраного ❌');
    } catch (error) {
      toast.error('Помилка при оновленні обраного');
    } finally {
      setIsLoading(false);
    }
  };

  return { favorites, isLoading, updateFavorites };
}
