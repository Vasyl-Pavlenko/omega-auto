import { Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  ConfirmModal,
  OverlayLoader,
  TyreInfoGrid,
  TyreHeader,
  TyreMetaInfo,
  TyreDescription,
  TyreActions,
  Spinner,
} from '../components';
import { useConfirmModal } from '../hooks/useConfirmModal';
import { useTyreActions } from '../hooks/useTyreActions';
import { useTyreDetailLogic } from '../hooks/useTyreDetailLogic';
import { TyreSeo } from '../seo/TyreSeo';
import React from 'react';

type ModalType = 'delete' | 'activate' | 'extend' | null;

const TyreDetailPage = () => {
  const [modalType, setModalType] = useState<ModalType>(null);

  const navigate = useNavigate();

  const {
    tyre,
    isOwner,
    loading,
    error,
    favoriteLoading,
    createdDate,
    expiresDate,
    onRemove,
    handleToggleFavorite,
  } = useTyreDetailLogic();

  const { onConfirm, isLoading } = useTyreActions({ tyre, onRemove });

  const { isOpen, openModal, closeModal, handleConfirm } = useConfirmModal({
    onConfirm: () => {
      if (modalType && tyre?._id) {
        onConfirm(tyre._id, modalType);
      }
    },
  });

  const openTypedModal = (type: ModalType) => {
    setModalType(type);
    openModal();
  };

  if (loading || favoriteLoading || isLoading) {
    return <OverlayLoader />;
  }

  if (!tyre || error) {
    return (
      <div className="mt-20 text-center text-red-500 font-semibold text-lg px-4">
        <p>😕 {error}</p>

        <p className="mt-2 text-sm text-gray-600">
          Спробуйте оновити сторінку або перевірте з’єднання з інтернетом.
        </p>
      </div>
    );
  }

  

  const TyreCarousel = React.lazy(() => import('../components/TyreCarousel/TyreCarousel'));

  return (
    <>
      <TyreSeo tyre={tyre} url={window.location.href} />
      <div className="p-4 sm:p-6 max-w-4xl mx-auto my-8 bg-white rounded-2xl shadow-xl">
        <TyreHeader
          title={tyre.title}
          isFavorite={!!tyre.isFavorite}
          loading={favoriteLoading}
          onToggle={handleToggleFavorite}
          isOwner={isOwner}
          tyreId={tyre._id}
        />

        {tyre.images?.length > 0 && (
          <Suspense fallback={<Spinner />}>
            <TyreCarousel images={tyre.images} title={tyre.title} />
          </Suspense>
        )}

        <TyreInfoGrid tyre={tyre} isOwner={isOwner} />

        <TyreMetaInfo
          createdDate={createdDate}
          expiresDate={expiresDate}
          views={tyre.views}
          isActive={tyre.isActive}
        />

        <TyreDescription description={tyre.description} />

        <TyreActions
          tyre={tyre}
          isOwner={isOwner}
          contact={tyre.contact}
          onBack={() => navigate(-1)}
          onDeleteClick={() => openTypedModal('delete')}
          onExtend={() => openTypedModal('extend')}
          isDeleting={modalType === 'delete' && isOpen && isLoading}
          isExtending={modalType === 'extend' && isOpen && isLoading}
        />

        <ConfirmModal
          isOpen={isOpen}
          confirmType={modalType || 'custom'}
          isLoading={isLoading}
          onConfirm={() => handleConfirm()}
          onCancel={closeModal}
        />
      </div>
    </>
  );
};

export default TyreDetailPage;
