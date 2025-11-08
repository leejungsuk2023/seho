import { create } from 'zustand'
import { ToastType } from '@/components/common/Toast'

interface Toast {
  id: string
  type: ToastType
  title?: string
  message: string
  duration?: number
}

interface ToastStore {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearAll: () => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9)
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }))
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }))
  },

  clearAll: () => {
    set({ toasts: [] })
  },
}))

// Helper functions for easier usage
export const toast = {
  success: (message: string, title?: string) => {
    useToastStore.getState().addToast({
      type: 'success',
      message,
      title,
    })
  },
  error: (message: string, title?: string) => {
    useToastStore.getState().addToast({
      type: 'error',
      message,
      title,
    })
  },
  warning: (message: string, title?: string) => {
    useToastStore.getState().addToast({
      type: 'warning',
      message,
      title,
    })
  },
  info: (message: string, title?: string) => {
    useToastStore.getState().addToast({
      type: 'info',
      message,
      title,
    })
  },
}
