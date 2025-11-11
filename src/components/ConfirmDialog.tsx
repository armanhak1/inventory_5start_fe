interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'danger'
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      icon: '⚠️',
      confirmButton: 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600'
    },
    warning: {
      icon: '⚡',
      confirmButton: 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600'
    },
    info: {
      icon: 'ℹ️',
      confirmButton: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    }
  };

  const styles = typeStyles[type];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in p-3 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full animate-slide-up">
        <div className="p-5 sm:p-6">
          {/* Icon */}
          <div className={`${styles.iconBg} w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mx-auto mb-4`}>
            <span className="text-2xl sm:text-3xl" aria-hidden="true">{styles.icon}</span>
          </div>

          {/* Title */}
          <h2 id="dialog-title" className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-2">
            {title}
          </h2>

          {/* Message */}
          <p className="text-sm sm:text-base text-gray-600 text-center mb-6">
            {message}
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all duration-200 border-2 border-gray-200 active:scale-95"
              autoFocus
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base text-white ${styles.confirmButton} rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

