import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

// Map toast types to styles and icons
const TOAST_STYLES = {
  success: {
    container: 'bg-white border border-success/20 shadow-lg',
    iconBg: 'bg-success-light',
    icon: <CheckCircle size={16} className="text-success" />,
    accent: 'bg-success',
  },
  error: {
    container: 'bg-white border border-danger/20 shadow-lg',
    iconBg: 'bg-danger-light',
    icon: <XCircle size={16} className="text-danger" />,
    accent: 'bg-danger',
  },
  warning: {
    container: 'bg-white border border-warning/20 shadow-lg',
    iconBg: 'bg-warning-light',
    icon: <AlertTriangle size={16} className="text-warning" />,
    accent: 'bg-warning',
  },
  info: {
    container: 'bg-white border border-primary/20 shadow-lg',
    iconBg: 'bg-indigo-50',
    icon: <Info size={16} className="text-primary" />,
    accent: 'bg-primary',
  },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-dismiss after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Toast Container — fixed at bottom-right */}
      <div
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((toast) => {
          const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info;
          return (
            <div
              key={toast.id}
              className={`${style.container} rounded-2xl px-4 py-3.5 flex items-start gap-3 pointer-events-auto animate-slide-up overflow-hidden relative`}
            >
              {/* Accent bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${style.accent} rounded-l-2xl`} />

              {/* Icon */}
              <div className={`${style.iconBg} w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5`}>
                {style.icon}
              </div>

              {/* Message */}
              <p className="text-sm text-main-text flex-1 leading-snug font-medium pt-0.5">
                {toast.message}
              </p>

              {/* Dismiss button */}
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 w-6 h-6 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center mt-0.5"
                aria-label="Dismiss notification"
              >
                <X size={13} className="text-secondary-text" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside ToastProvider');
  return context;
};
