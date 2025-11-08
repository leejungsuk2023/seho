'use client'

import { ToastContainer } from './Toast'
import { useToastStore } from '@/stores/useToastStore'

export function ToastProvider() {
  const { toasts, removeToast } = useToastStore()

  return (
    <ToastContainer
      toasts={toasts.map((toast) => ({
        ...toast,
        onClose: removeToast,
      }))}
    />
  )
}
