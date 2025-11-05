'use client'

import React from 'react'
import clsx from 'clsx'

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'outline'
  | 'ghost'
  | 'link'
  | 'danger'
  | 'success'
  | 'icon'

type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg hover:shadow-xl hover:from-primary-500 hover:to-accent-500 focus-visible:ring-accent-300',
  secondary:
    'bg-white text-primary-700 border border-primary-200 shadow-sm hover:bg-primary-50 focus-visible:ring-primary-200',
  accent: 'bg-accent-500 text-white hover:bg-accent-600 shadow-md hover:shadow-lg focus-visible:ring-accent-300',
  outline: 'border border-primary-500 text-primary-600 hover:bg-primary-50 focus-visible:ring-primary-200',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-200',
  link:
    'px-3 py-2 bg-transparent text-primary-600 font-semibold hover:text-primary-500 underline-offset-4 hover:underline active:scale-100 focus-visible:ring-0 focus-visible:ring-offset-0',
  danger: 'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg focus-visible:ring-red-400',
  success:
    'bg-success-500 text-white hover:bg-success-600 shadow-md hover:shadow-lg focus-visible:ring-success-400',
  icon:
    'bg-transparent text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-200 focus-visible:ring-offset-0 rounded-full border border-transparent',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-6 py-3 text-lg',
  icon: 'p-2 text-base gap-0',
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', size = 'md', fullWidth = false, isLoading, disabled, children, ...rest },
    ref
  ) => {
    const { type = 'button', ...buttonProps } = rest

    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          sizeStyles[size],
          variantStyles[variant],
          fullWidth && 'w-full',
          className
        )}
        disabled={isLoading || disabled}
  type={type}
  {...buttonProps}
      >
        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : null}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
