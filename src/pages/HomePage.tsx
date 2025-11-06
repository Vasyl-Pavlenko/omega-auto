import { useEffect, useRef, useCallback, memo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  fetchTyresList,
  incrementPage,
  resetFilters,
  setFilters,
  setSortBy,
  resetTyresState,
} from '../store/slices/tyres/tyresSlice';
import { RootState } from '../store/store';
import debounce from 'lodash/debounce';
import { toast } from 'react-toastify';

import { TyreFilterField } from '../constants/tyreOptions';
import { FilterSidebar, TyreGrid, OverlayLoader, EmptyBoxAnimation } from '../components';
import { SortOption } from '../types/tyre';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { HomePageSeo } from '../seo/HomePageSeo';
import { Helmet } from 'react-helmet';

const MemoizedTyreGrid = memo(TyreGrid);

export default function HomePage() {
  const dispatch = useAppDispatch();
  const observerRef = useRef<HTMLDivElement | null>(null);
  const isFirstLoad = useRef(true);
  const isFetchingRef = useRef(false);

  const {
    tyres,
    total,
    page,
    hasMore,
    loading: isTyresLoading,
    error: tyresError,
    sortBy,
    filters,
  } = useAppSelector((state: RootState) => state.tyres);

  const [searchParams, setSearchParams] = useSearchParams();

  const debouncedSearchRef = useRef(
    debounce(() => {
      dispatch(fetchTyresList()).catch(() => toast.error('Помилка при завантаженні оголошень'));
    }, 500),
  );

  // 1. Ініціалізація фільтрів з URL + початковий запит
  useEffect(() => {
    let hasUpdates = false;

    for (const field of Object.values(TyreFilterField)) {
      const paramValue = searchParams.get(field);

      if (paramValue !== null && paramValue !== filters[field]) {
        dispatch(setFilters({ field, value: paramValue }));

        hasUpdates = true;
      }
    }

    if (!hasUpdates) {
      dispatch(resetFilters());
    }

    dispatch(resetTyresState());

    dispatch(fetchTyresList())
      .catch(() => toast.error('Помилка при завантаженні оголошень'))
      .finally(() => {
        isFirstLoad.current = false;
      });

    const debounced = debouncedSearchRef.current;

    return () => {
      debounced.cancel();
    };
  }, [dispatch]);

  // 2. Синхронізація URL з filters
  useEffect(() => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    const currentParams = searchParams.toString();

    const newParams = params.toString();

    if (currentParams !== newParams) {
      setSearchParams(params, { replace: true });
    }
  }, [filters, searchParams, setSearchParams]);

  // 3. debounce-пошук при зміні filters/sortBy
  useEffect(() => {
    if (!isFirstLoad.current) {
      debouncedSearchRef.current();
    }
  }, [filters, sortBy]);

  // 4. Пагінація
  useEffect(() => {
    if (page > 1) {
      dispatch(fetchTyresList()).finally(() => {
        isFetchingRef.current = false;
      });
    }
  }, [page, dispatch]);

  // 5. IntersectionObserver
  useEffect(() => {
    const target = observerRef.current;

    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isTyresLoading && hasMore && !isFetchingRef.current) {
          isFetchingRef.current = true;

          dispatch(incrementPage());
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [dispatch, isTyresLoading, hasMore]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = e.target.name as TyreFilterField;
    const value = e.target.value.trimStart();

    dispatch(setFilters({ field: name, value }));
  };

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(setSortBy(e.target.value as SortOption));
    },
    [dispatch],
  );

  const handleRemove = useCallback(() => {
    dispatch(fetchTyresList());
  }, [dispatch]);

  if (!isTyresLoading && tyresError && tyres.length === 0 && !isFirstLoad.current) {
    return (
      <div className="flex items-center justify-center h-96 text-center text-red-700">
        <div>
          <h2 className="text-xl font-semibold">Сервер недоступний</h2>

          <p className="mt-2 text-sm">Будь ласка, спробуйте пізніше або перевірте зʼєднання.</p>
        </div>
      </div>
    );
  }

  const now = new Date();
  const activeTyres = tyres.filter((tyre) => new Date(tyre.expiresAt) > now && !tyre.isDeleted);

  console.log(tyres)

  return (
    <>
      <HomePageSeo url={process.env.VITE_SITE_URL || ''} />

      <div className="px-12 py-6">
        <h1 className="text-2xl font-bold mb-4">Оголошення шин</h1>

        <FilterSidebar
          filters={filters}
          onChange={handleFilterChange}
          onReset={() => dispatch(resetFilters())}
          sortBy={sortBy}
          onSortChange={handleSortChange}
        />

        {!isTyresLoading && tyres.length > 0 && (
          <p className="text-sm text-muted-foreground mb-4">
            Показано {tyres.length} з {total} оголошень
          </p>
        )}

        {/* Основна секція */}
        <div>
          {isTyresLoading && tyres.length === 0 ? (
            <OverlayLoader />
          ) : tyres.length > 0 ? (
            <MemoizedTyreGrid tyres={activeTyres} currentTab="active" onRemove={handleRemove} />
          ) : isFirstLoad.current ? null : (
            <div className="col-span-full flex flex-col items-center justify-center text-center py-16 text-gray-500">
              <EmptyBoxAnimation />

              <h2 className="text-lg font-semibold">Нічого не знайдено 😔</h2>

              <p className="mt-2 text-sm">
                Спробуйте змінити фільтри або перевірити інші оголошення.
              </p>
            </div>
          )}
        </div>

        {/* Infinite scroll loader */}
        {isTyresLoading && tyres.length > 0 && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-400" />
          </div>
        )}

        <div ref={observerRef} className="h-10" />
      </div>
    </>
  );
}
