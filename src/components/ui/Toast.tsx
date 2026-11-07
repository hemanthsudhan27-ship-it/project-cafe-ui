'use client';

import { useEffect, useState, createContext, useContext, useCallback, ReactNode } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

export const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `${Date.now()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const dismiss = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed top-4 left-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const icons = {
    success: <CheckCircle size={16} className="text-[#269B62] flex-shrink-0" />,
    error: <XCircle size={16} className="text-[#D94A43] flex-shrink-0" />,
    info: <Info size={16} className="text-[#F47721] flex-shrink-0" />,
  };

  const borders = {
    success: 'border-l-4 border-[#269B62]',
    error: 'border-l-4 border-[#D94A43]',
    info: 'border-l-4 border-[#F47721]',
  };

  return (
    <div
      className={`flex items-center gap-3 bg-white shadow-lg rounded-xl p-3 pointer-events-auto
        ${borders[toast.type]}`}
    >
      {icons[toast.type]}
      <span className="text-sm text-[#252525] flex-1">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-0.5 rounded hover:bg-[#EEEEEE]"
      >
        <X size={14} className="text-[#777777]" />
      </button>
    </div>
  );
}

