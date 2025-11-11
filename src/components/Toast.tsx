import { useEffect } from 'react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type = 'info', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: {
      bg: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      icon: '✓',
    },
    error: {
      bg: 'bg-gradient-to-r from-rose-500 to-rose-600',
      icon: '✕',
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-500 to-indigo-600',
      icon: 'ℹ',
    },
  };

  const style = styles[type];

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`${style.bg} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-slide-up max-w-md backdrop-blur-sm`}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white bg-opacity-20 flex-shrink-0">
        <span className="text-xl font-bold" aria-hidden="true">{style.icon}</span>
      </div>
      <span className="flex-1 font-medium">{message}</span>
      <button
        onClick={onClose}
        className="text-white hover:bg-white hover:bg-opacity-20 transition-colors tap-target rounded-full p-1"
        aria-label="Close notification"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type?: 'success' | 'error' | 'info' }>;
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed bottom-24 right-4 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => onRemove(toast.id)}
          />
        </div>
      ))}
    </div>
  );
}
