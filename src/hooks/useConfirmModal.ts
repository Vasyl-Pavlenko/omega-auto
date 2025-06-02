import { useState, useCallback } from 'react';

type UseConfirmModalProps = {
  onConfirm: () => void;
};

export function useConfirmModal({ onConfirm }: UseConfirmModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  const handleConfirm = useCallback(() => {
    onConfirm();
    closeModal();
  }, [onConfirm, closeModal]);

  return {
    isOpen,
    openModal,
    closeModal,
    handleConfirm,
  };
}
