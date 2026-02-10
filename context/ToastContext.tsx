import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              pointer-events-auto min-w-[300px] max-w-sm w-full p-4 rounded-xl shadow-2xl 
              border backdrop-blur-md transition-all duration-500 transform translate-x-0 animate-fadeIn
              flex items-center gap-3
              ${toast.type === 'success' ? 'bg-black/80 border-green-500/50 text-green-100' : ''}
              ${toast.type === 'error' ? 'bg-black/80 border-red-500/50 text-red-100' : ''}
              ${toast.type === 'info' ? 'bg-black/80 border-brand-accent/50 text-brand-accent/20 text-white' : ''}
            `}
          >
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center border
              ${toast.type === 'success' ? 'bg-green-500/20 border-green-500 text-green-400' : ''}
              ${toast.type === 'error' ? 'bg-red-500/20 border-red-500 text-red-400' : ''}
              ${toast.type === 'info' ? 'bg-brand-accent/20 border-brand-accent text-brand-accent' : ''}
            `}>
              {toast.type === 'success' && <i className="fa-solid fa-check"></i>}
              {toast.type === 'error' && <i className="fa-solid fa-xmark"></i>}
              {toast.type === 'info' && <i className="fa-solid fa-info"></i>}
            </div>
            
            <div className="flex-1">
              <h4 className="font-bold text-sm capitalize">{toast.type}</h4>
              <p className="text-xs opacity-90">{toast.message}</p>
            </div>

            <button onClick={() => removeToast(toast.id)} className="text-white/50 hover:text-white">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};