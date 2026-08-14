import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, X, Info } from 'lucide-react';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'error' | 'info';
}

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-2.5 z-55 w-full max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onRemove: (id: string) => void }> = ({
  toast,
  onRemove
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const styles = {
    success: {
      bg: 'bg-optum-white border-optum-gray-200',
      text: 'text-optum-warm-gray',
      icon: CheckCircle,
      iconColor: 'text-optum-orange'
    },
    error: {
      bg: 'bg-optum-white border-optum-blue-pale',
      text: 'text-optum-warm-gray',
      icon: AlertTriangle,
      iconColor: 'text-optum-blue-dark'
    },
    info: {
      bg: 'bg-optum-white border-optum-gray-200',
      text: 'text-optum-warm-gray',
      icon: Info,
      iconColor: 'text-optum-gray-500/80'
    }
  };

  const current = styles[toast.type];
  const Icon = current.icon;

  return (
    <div className={`p-4 rounded-2xl border shadow-xl flex items-center justify-between gap-3 bg-transition pointer-events-auto animate-slide-in ${current.bg}`}>
      <div className="flex items-center gap-2.5">
        <Icon className={`w-5 h-5 shrink-0 ${current.iconColor}`} />
        <span className={`text-xs font-semibold ${current.text}`}>{toast.text}</span>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="p-1 hover:bg-optum-gray-100 text-optum-gray-500/60 hover:text-optum-warm-gray rounded-lg transition-all"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
