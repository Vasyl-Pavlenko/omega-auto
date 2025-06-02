import { useState, useEffect, memo, useCallback } from 'react';
import { OverlayLoader, TyreGrid } from '../components';
import { useAppSelector, useAppDispatch } from '../hooks/reduxHooks';
import { fetchMyTyres } from '../store/slices/tyres/myTyresSlice';
import { Tyre } from '../types/tyre';

const TABS = ['active', 'expired', 'deleted', 'favorites'] as const;
type Tab = (typeof TABS)[number];

const MemoizedTyreGrid = memo(TyreGrid);

export default function MyAdsPage() {
  const dispatch = useAppDispatch();

  const [currentTab, setCurrentTab] = useState<Tab>(() => {
    const saved = localStorage.getItem('myAdsCurrentTab') as Tab | null;
    return saved && TABS.includes(saved) ? saved : 'active';
  });

  const { user } = useAppSelector((state) => state.user);

  const {
    myTyres,
    loading: myTyresLoading,
    error: myTyresError,
  } = useAppSelector((state) => state.myTyres);

  const { favorites, loading: favoritesLoading } = useAppSelector((state) => state.tyre);

  useEffect(() => {
    localStorage.setItem('myAdsCurrentTab', currentTab);
  }, [currentTab]);

  useEffect(() => {
    if (user?.userId) {
      dispatch(fetchMyTyres());
    }

  }, [dispatch, user?.userId]);

  const now = new Date();

  // Фільтрація шин відповідно до табу
  const filtered: Tyre[] =
    currentTab === 'favorites'
      ? favorites
      : myTyres.filter((tyre) => {
          const willBeDeletedAtDate =
            tyre.willBeDeletedAt instanceof Date
              ? tyre.willBeDeletedAt
              : new Date(tyre.willBeDeletedAt);

          switch (currentTab) {
            case 'active':
              return !tyre.isDeleted && willBeDeletedAtDate >= now;
            case 'expired':
              return !tyre.isDeleted && willBeDeletedAtDate < now;
            case 'deleted':
              return tyre.isDeleted;
            default:
              return true;
          }
        });

  const tabNameMap: Record<Tab, string> = {
    active: 'Активні',
    expired: 'Неактивні',
    deleted: 'Видалені',
    favorites: 'Обрані',
  };

  const handleRemove = useCallback(() => {
    dispatch(fetchMyTyres());
  }, [dispatch]);
  

  // Обробка помилки із кнопкою перезавантаження
  if (myTyresError) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-center text-red-600">
        <p>Помилка завантаження оголошень: {myTyresError}</p>

        <button
          type="button"
          aria-label='Спробувати ще раз'
          onClick={() => dispatch(fetchMyTyres())}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Спробувати ще раз
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Мої оголошення</h1>

      {/* Таби */}
      <nav
        className="flex overflow-x-auto scrollbar-hide gap-4 border-b mb-8 justify-start sm:justify-center"
        aria-label="Вибір категорії"
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className=
            {`flex-shrink-0 py-2 px-4 sm:py-3 sm:px-6 border-b-4 transition font-semibold text-sm sm:text-base
              ${
                currentTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-400'
              } focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-t`
            }
            onClick={() => setCurrentTab(tab)}
            aria-current={currentTab === tab ? 'page' : undefined}
          >
            {tabNameMap[tab]}
          </button>
        ))}
      </nav>

      {/* Лоадер, якщо завантажується і немає даних */}
      <div className="relative min-h-[300px]">
        {(myTyresLoading || favoritesLoading) && filtered.length === 0 ? (
          <OverlayLoader />
        ) : (
          <MemoizedTyreGrid tyres={filtered} currentTab={currentTab} onRemove={handleRemove} />
        )}
      </div>
    </div>
  );
}
