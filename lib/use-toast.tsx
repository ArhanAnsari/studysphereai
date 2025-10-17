'use client';

import { useState, useCallback } from 'react';
import * as Toast from '@radix-ui/react-toast';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback((type: ToastType, title: string, description?: string) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, type, title, description }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const success = useCallback((title: string, description?: string) => {
    showToast('success', title, description);
  }, [showToast]);

  const error = useCallback((title: string, description?: string) => {
    showToast('error', title, description);
  }, [showToast]);

  const warning = useCallback((title: string, description?: string) => {
    showToast('warning', title, description);
  }, [showToast]);

  const info = useCallback((title: string, description?: string) => {
    showToast('info', title, description);
  }, [showToast]);

  return { toasts, setToasts, success, error, warning, info };
}

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colorMap = {
  success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
  error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
  warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
  info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
};

export function ToastContainer() {
  const { toasts, setToasts } = useToast();

  return (
    <>
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type];
        return (
          <Toast.Root
            key={toast.id}
            className={`${colorMap[toast.type]} rounded-lg shadow-lg p-4 border flex items-start gap-3 min-w-[300px] data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=end]:animate-swipeOut`}
            onOpenChange={(open) => {
              if (!open) {
                setToasts((prev) => prev.filter((t) => t.id !== toast.id));
              }
            }}
          >
            <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <Toast.Title className="font-semibold text-sm">{toast.title}</Toast.Title>
              {toast.description && (
                <Toast.Description className="text-sm mt-1 opacity-90">
                  {toast.description}
                </Toast.Description>
              )}
            </div>
            <Toast.Close className="ml-auto">
              <X className="h-4 w-4 opacity-50 hover:opacity-100" />
            </Toast.Close>
          </Toast.Root>
        );
      })}
    </>
  );
}
