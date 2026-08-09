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
      bg: 'bg-white dark:bg-slate-900 border-emerald-100 dark:border-emerald-950/60',
      text: 'text-emerald-800 dark:text-emerald-300',
      icon: CheckCircle,
      iconColor: 'text-emerald-500'
    },
    error: {
      bg: 'bg-white dark:bg-slate-900 border-rose-100 dark:border-rose-950/60',
      text: 'text-rose-800 dark:text-rose-300',
      icon: AlertTriangle,
      iconColor: 'text-rose-500'
    },
    info: {
      bg: 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800',
      text: 'text-slate-800 dark:text-slate-200',
      icon: Info,
      iconColor: 'text-sky-500'
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
        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 rounded-lg transition-all"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
