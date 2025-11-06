import { useMemo } from 'react';
import { useAppSelector } from '../hooks/reduxHooks';
import { useFavorites } from '../hooks/useFavorites';
import { isBefore, differenceInDays } from 'date-fns';
import { formatDate } from '../utils/formatDate';
import { Tyre } from '../types/tyre';

export function useTyreCardLogic(tyre: Tyre) {
  const { user } = useAppSelector((state) => state.user);
  const { favorites } = useFavorites();

  const isOwner = tyre && user ? user?.userId === tyre.userId : false;

  const favorite = useMemo(() => {
    if (!tyre) {
      return false;
    }
    
    const favSet = new Set(favorites.map((fav) => (typeof fav === 'string' ? fav : fav._id)));
    return favSet.has(tyre._id);
  }, [favorites, tyre?._id]);

  const isViewed = useMemo(() => {
    const viewed = JSON.parse(localStorage.getItem('viewedTyres') || '[]') as string[];
    return viewed.includes(tyre._id);
  }, [tyre._id]);

  const isExpired = isBefore(new Date(tyre.expiresAt), new Date());
  const isExpiringSoon = differenceInDays(new Date(tyre.expiresAt), new Date()) < 3;

  const createdDate = useMemo(() => formatDate(tyre.createdAt), [tyre.createdAt]);
  const expiresDate = useMemo(() => formatDate(tyre.expiresAt), [tyre.expiresAt]);

  return {
    isOwner,
    favorite,
    isViewed,
    isExpired,
    isExpiringSoon,
    createdDate,
    expiresDate,
  };
}
