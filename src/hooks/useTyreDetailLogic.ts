import { useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import {
  loadTyreById,
  toggleTyreFavorite,
  clearTyre,
  fetchFavorites,
} from '../store/slices/tyres/tyreSlice';
import { formatDate } from '../utils/formatDate';
import { toast } from 'react-toastify';

export const useTyreDetailLogic = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.user);
  const { tyresById, favoritesIds, loading, favoriteLoading, error } = useAppSelector(
    (state) => state.tyre,
  );

  const tyre = tyresById[id!];
  const userId = user?.userId ?? null;
  const isOwner = tyre?.userId === userId;

  const createdDate = useMemo(() => formatDate(tyre?.createdAt), [tyre?.createdAt]);
  const expiresDate = useMemo(() => formatDate(tyre?.willBeDeletedAt), [tyre?.willBeDeletedAt]);

  const onRemove = () => navigate('/my');

  useEffect(() => {
    if (favoritesIds.length === 0) {
      dispatch(fetchFavorites());
    }
  }, [dispatch, favoritesIds.length]);

  useEffect(() => {
    if (id) {
      dispatch(loadTyreById(id));
    }

    return () => {
      dispatch(clearTyre());
    };
  }, [dispatch, id]);

  const handleToggleFavorite = async () => {
    if (!userId || !tyre) {
      toast.info('Щоб зберегти шини в обране, спершу увійдіть у систему');
      return;
    }

    try {
      const result = await dispatch(
        toggleTyreFavorite({ id: tyre._id, currentFavorite: !!tyre.isFavorite }),
      ).unwrap();

      toast.success(result.isFavorite ? 'Додано до обраного' : 'Видалено з обраного');
    } catch (error: any) {
      toast.error(error?.message || 'Не вдалося оновити обране');
    }
  };

  const markTyreAsViewed = useCallback((id: string) => {
    let viewed: string[] = [];

    try {
      viewed = JSON.parse(localStorage.getItem('viewedTyres') || '[]');
    } catch {
      // Якщо localStorage зіпсований, просто перезаписуємо
    }

    if (!viewed.includes(id)) {
      viewed.push(id);
      localStorage.setItem('viewedTyres', JSON.stringify(viewed));
    }
  }, []);

  useEffect(() => {
    if (tyre && tyre._id) {
      markTyreAsViewed(tyre._id);
    }
  }, [tyre?._id]);
  
  return {
    tyre,
    isOwner,
    userId,
    loading,
    error,
    favoriteLoading,
    createdDate,
    expiresDate,
    onRemove,
    handleToggleFavorite,
  };
};
