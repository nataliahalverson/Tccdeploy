'use client'

import Link from 'next/link'
import React from 'react'
import clsx from 'clsx'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  interactive?: boolean
  gradient?: boolean
  border?: boolean
  href?: string
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, interactive = false, gradient = false, border = false, href, tabIndex, ...props }, ref) => {
    const baseClass = clsx(
      'group relative block rounded-2xl border border-transparent bg-white/80 p-6 shadow-soft transition-all duration-300 focus-ring',
      interactive && 'hover:shadow-medium hover:-translate-y-1 cursor-pointer',
      gradient && 'bg-gradient-to-br from-white to-slate-50',
      border && 'border-slate-100 bg-white',
      className
    )

    if (href) {
      return (
        <Link href={href} className={baseClass} {...(props as Record<string, unknown>)}>
          {children}
        </Link>
      )
    }

    const resolvedTabIndex = tabIndex ?? (interactive ? 0 : undefined)

    return (
      <div ref={ref} className={baseClass} tabIndex={resolvedTabIndex} {...props}>
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card
