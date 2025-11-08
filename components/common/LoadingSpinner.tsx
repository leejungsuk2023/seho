import { cn } from '@/lib/utils/cn'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  fullScreen?: boolean
}

export function LoadingSpinner({
  size = 'md',
  className,
  fullScreen = false
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }

  const spinner = (
    <div
      className={cn(
        'animate-spin rounded-full border-gray-300 border-t-primary-purple',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="로딩 중"
    >
      <span className="sr-only">로딩 중...</span>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm animate-fade-in">
        {spinner}
      </div>
    )
  }

  return spinner
}

export function LoadingPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  )
}

export function LoadingButton() {
  return <LoadingSpinner size="sm" className="border-white border-t-white/40" />
}
