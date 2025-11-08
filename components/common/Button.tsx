import { cn } from '@/lib/utils/cn'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient'
  size?: 'sm' | 'md' | 'lg'
  withMotion?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', withMotion = true, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium',
          'transition-all duration-300 ease-smooth',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-purple focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          withMotion && 'hover:-translate-y-1 hover:shadow-card-hover active:translate-y-0',
          {
            // Primary - Solid dark
            'bg-background-dark text-text-light hover:bg-background-dark/90 rounded-none':
              variant === 'primary',

            // Secondary - White with shadow
            'bg-white text-text hover:shadow-card rounded-md':
              variant === 'secondary',

            // Outline - Border only (Ch0435 style)
            'border-2 border-border-orange bg-transparent text-text hover:bg-border-orange hover:text-white rounded-none uppercase tracking-wide':
              variant === 'outline',

            // Ghost - Minimal
            'text-text-muted hover:bg-background-cream hover:text-text rounded-md':
              variant === 'ghost',

            // Gradient - Purple to Pink
            'bg-gradient-purple-pink text-white hover:shadow-glow rounded-lg':
              variant === 'gradient',
          },
          {
            'h-9 px-4 text-xs': size === 'sm',
            'h-11 px-6 text-sm': size === 'md',
            'h-12 px-8 text-base': size === 'lg',
          },
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
