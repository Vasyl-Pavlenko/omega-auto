import { Tyre } from '../../types/tyre';
import { EmptyBoxAnimation, TyreCard } from '../../components';
import { Link } from 'react-router-dom';

interface Props {
  tyres: Tyre[];
  currentTab: 'active' | 'expired' | 'deleted' | 'favorites';
  onRemove?: () => void;
}

export function TyreGrid({ tyres, currentTab, onRemove }: Props) {
  if (!tyres.length) {
    return (
      <div className="text-center text-gray-500 py-16">
        <EmptyBoxAnimation />

        <h2 className="text-lg font-semibold">У цій категорії немає оголошень 😔</h2>

        {currentTab === 'active' && (
          <>
            <p className="my-3 text-sm">Саме час додати нове оголошення.</p>

            <Link to="/add" className="btn-blue btn-lg">
              ➕ Створити оголошення
            </Link>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {tyres.map((tyre, index) => (
        <TyreCard
          key={tyre._id}
          tyre={tyre}
          currentTab={currentTab}
          onRemove={onRemove}
          isFirstVisible={index === 0}
        />
      ))}
    </div>
  );
}
