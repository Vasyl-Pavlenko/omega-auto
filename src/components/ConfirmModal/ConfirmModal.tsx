import { Loader2, Trash2, CheckCircle2, Repeat2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ConfirmActionType = 'delete' | 'activate' | 'extend' | 'custom';

type ConfirmModalProps = {
  isOpen: boolean;
  confirmType: ConfirmActionType;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  customTitle?: string;
  customMessage?: string;
  customConfirmText?: string;
};

const getButtonStyle = (type: ConfirmActionType) => {
  switch (type) {
    case 'delete':
      return 'bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white';
    case 'activate':
      return 'bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white';
    case 'extend':
      return 'bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white';
    default:
      return 'bg-gray-800 hover:bg-gray-900 text-white';
  }
};

const getButtonIcon = (type: ConfirmActionType) => {
  switch (type) {
    case 'delete':
      return <Trash2 size={16} className="mr-2" />;
    case 'activate':
      return <CheckCircle2 size={16} className="mr-2" />;
    case 'extend':
      return <Repeat2 size={16} className="mr-2" />;
    default:
      return null;
  }
};

const getTitle = (type: ConfirmActionType) => {
  switch (type) {
    case 'delete':
      return 'Підтвердження видалення';
    case 'activate':
      return 'Підтвердження активації';
    case 'extend':
      return 'Підтвердження подовження';
    default:
      return 'Підтвердження дії';
  }
};

const getMessage = (type?: ConfirmActionType) => {
  switch (type) {
    case 'delete':
      return 'Ви впевнені, що хочете видалити це оголошення?';
    case 'activate':
      return 'Ви впевнені, що хочете активувати це оголошення?';
    case 'extend':
      return 'Поновити оголошення ще на 30 днів?';
    default:
      return 'Ви впевнені, що хочете продовжити цю дію?';
  }
};

const getConfirmText = (type: ConfirmActionType) => {
  switch (type) {
    case 'delete':
      return 'Видалити';
    case 'activate':
      return 'Активувати';
    case 'extend':
      return 'Поновити';
    default:
      return 'Підтвердити';
  }
};

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  confirmType,
  isLoading = false,
  onConfirm,
  onCancel,
  customTitle,
  customMessage,
  customConfirmText,
}) => {
  const title = customTitle || getTitle(confirmType);
  const message = customMessage || getMessage(confirmType);
  const confirmText = customConfirmText || getConfirmText(confirmType);
  const buttonClass = getButtonStyle(confirmType);
  const buttonIcon = getButtonIcon(confirmType);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
          aria-labelledby="confirm-modal-title"
          aria-describedby="confirm-modal-description"
        >
          <motion.div
            key="modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            tabIndex={-1}
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl border border-gray-200"
          >
            <h2 id="confirm-modal-title" className="text-xl font-semibold text-gray-800 mb-3">
              {title}
            </h2>

            <p id="confirm-modal-description" className="text-gray-600 mb-5">
              {message}
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                aria-label="Скасувати"
                onClick={onCancel}
                disabled={isLoading}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                Скасувати
              </button>

              <button
                type="button"
                aria-label={confirmText}
                onClick={onConfirm}
                disabled={isLoading}
                className={`flex items-center px-5 py-2.5 text-sm font-medium rounded-lg shadow-md transition-all disabled:opacity-50 ${buttonClass}`}
              >
                {isLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : buttonIcon}

                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
