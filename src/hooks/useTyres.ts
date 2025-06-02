import { useEffect, useState, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import { fetchMyTyres, getFavorites, fetchTyresByIds } from '../api/api';
import { Tyre } from '../types/tyre';

export type Tab = 'active' | 'expired' | 'deleted' | 'favorites';

export function useTyres(userId: string | null, currentTab: Tab) {
  const [tyres, setTyres] = useState<Tyre[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const isExpired = (date: Date | string) => new Date(date) < new Date();

  useEffect(() => {
    setTyres([]);
    setPage(1);
    setHasMore(true);
  }, [userId, currentTab]);

  const loadTyres = useCallback(async () => {
    if (!userId || !hasMore || isFetchingMore) return;

    try {
      if (page === 1) {
        setIsInitialLoading(true);
      } else {
        setIsFetchingMore(true);
      }

      let data: Tyre[] = [];

      if (currentTab === 'favorites') {
        const ids = await getFavorites();
        const tyreIds = ids.filter((id): id is string => typeof id === 'string');

        if (tyreIds.length) {
          const res = await fetchTyresByIds(tyreIds);
          data = res.tyres || [];
        }
      } else {
        const res = await fetchMyTyres(page, 6);
        data = res.tyres || [];
      }

      const uniqueNew = data.filter((t) => !tyres.some((old) => old._id === t._id));

      setTyres((prev) => [...(page === 1 ? [] : prev), ...uniqueNew]);

      if (data.length < 6 || currentTab === 'favorites') {
        setHasMore(false);
      }
    } catch {
      toast.error('Помилка при завантаженні оголошень ❌');
    } finally {
      setIsInitialLoading(false);
      setIsFetchingMore(false);
    }
  }, [userId, currentTab, page, hasMore, isFetchingMore]);

  useEffect(() => {
    loadTyres();
  }, [loadTyres]);

  return {
    tyres,
    setTyres,
    isInitialLoading,
    isFetchingMore,
    observerRef,
    page,
    setPage,
    hasMore,
    isExpired,
  };
}
