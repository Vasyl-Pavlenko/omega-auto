import { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Eye, PhoneCall } from 'lucide-react';

import {
  ActivateButton,
  Badge,
  ConfirmModal,
  FavoriteButton,
  OwnerControls,
  OwnerInfo,
  TyreImageLink,
  TyreInfoGrid,
} from '../index';

import { Tyre } from '../../types/tyre';
import { useTyreActions } from '../../hooks/useTyreActions';
import { useConfirmModal } from '../../hooks/useConfirmModal';
import { useFavorites } from '../../hooks/useFavorites';
import { useTyreCardLogic } from '../../hooks/useTyreCardLogic';

interface TyreCardProps {
  tyre: Tyre;
  onRemove?: () => void;
  currentTab?: 'active' | 'expired' | 'deleted' | 'favorites';
  isFirstVisible?: boolean;
}

type ModalType = 'delete' | 'activate' | 'extend' | null;

export const TyreCard = ({ tyre, onRemove, currentTab, isFirstVisible }: TyreCardProps) => {
  const [modalType, setModalType] = useState<ModalType>(null);

  const { pathname } = useLocation();

  const { isLoading: isFavoritesLoading, updateFavorites } = useFavorites();

  const { isOwner, favorite, isViewed, isExpired, isExpiringSoon, createdDate, expiresDate } =
    useTyreCardLogic(tyre);

  const { onConfirm, isLoading } = useTyreActions({ tyre, onRemove });

  const isMyPage = useMemo(() => pathname.includes('/my'), [pathname]);

  const { isOpen, openModal, closeModal, handleConfirm } = useConfirmModal({
    onConfirm: () => {
      if (modalType) {
        onConfirm(tyre._id, modalType)
      };
    },
  });

  const openTypedModal = (type: ModalType) => {
    setModalType(type);
    openModal();
  };

  const firstImage = tyre.images?.[0]?.[0];

  return (
    <div className="relative rounded-2xl shadow-md border bg-white hover:shadow-lg transition p-4 group max-w-md mx-auto">
      <div className="relative">
        <TyreImageLink
          tyreId={tyre._id}
          image={firstImage}
          alt={tyre.title}
          slug={tyre.slug}
          isFirstVisible={isFirstVisible}
        />

        {!isOwner && (
          <FavoriteButton
            tyreId={tyre._id}
            isFavorite={favorite}
            isLoading={isFavoritesLoading}
            onToggle={updateFavorites}
            className="absolute bottom-2 right-2"
          />
        )}

        {isViewed && !isOwner && (
          <span className="absolute top-2 left-2 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full flex items-center gap-1 select-none">
            <Eye className="w-4 h-4" aria-hidden="true" /> Переглянуто
          </span>
        )}

        {isExpiringSoon && !isExpired && <Badge label="Закінчується скоро" icon="⚠️" />}
      </div>

      <Link to={`/tyre/${tyre._id}`}>
        <h2
          className="text-lg mb-4 font-semibold text-blue-700 mb-1 hover:text-blue-800 truncate"
          title={`${tyre.brand}`}>
          {tyre.title}
        </h2>
      </Link>

      <TyreInfoGrid tyre={tyre} isOwner={isOwner} />

      {/* Інформація власника (на моїй сторінці) */}
      {isMyPage && isOwner && (
        <OwnerInfo
          tyre={tyre}
          isExpired={isExpired}
          createdDate={createdDate}
          expiresDate={expiresDate}
          isExpiringSoon={isExpiringSoon}
          isActive={tyre.isActive}
          isDeleted={tyre.isDeleted}
        />
      )}

      {!isOwner && (
        <a
          href={`tel:${tyre.contact}`}
          className="btn-green w-full sm:w-auto flex justify-center items-center gap-2"
          aria-label="Зателефонувати власнику"
        >
          <PhoneCall className="w-6 h-6" />
          Зателефонувати
        </a>
      )}

      {/* Контроль власника */}
      {isOwner && (
        <OwnerControls
          tyre={tyre}
          onDeleteClick={() => openTypedModal('delete')}
          onExtend={() => openTypedModal('extend')}
          isDeleting={modalType === 'delete' && isOpen && isLoading}
          isExtending={modalType === 'extend' && isOpen && isLoading}
        />
      )}

      {/* Кнопка активації для прострочених */}
      {isOwner && (currentTab === 'expired' || currentTab === 'deleted') && (
        <ActivateButton onActivate={() => openTypedModal('activate')} disabled={isLoading} />
      )}

      <ConfirmModal
        isOpen={isOpen}
        confirmType={modalType || 'custom'}
        isLoading={isLoading}
        onConfirm={handleConfirm}
        onCancel={closeModal}
      />
    </div>
  );
};
