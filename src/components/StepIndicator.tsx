import Link from 'next/link'
import clsx from 'clsx'
import { Check } from 'lucide-react'

export type StepStatus = 'complete' | 'current' | 'upcoming'

export interface StepItem {
  label: string
  description?: string
  href?: string
  status: StepStatus
}

interface StepIndicatorProps {
  steps: StepItem[]
  className?: string
  colorScheme?: 'light' | 'dark'
}

export default function StepIndicator({ steps, className, colorScheme = 'light' }: StepIndicatorProps) {
  const completedSteps = steps.filter((step) => step.status === 'complete').length
  const progressPercent = steps.length > 1 ? Math.min(100, (completedSteps / (steps.length - 1)) * 100) : 0
  const isDark = colorScheme === 'dark'

  return (
    <nav aria-label="Etapas" className={clsx('relative', className)}>
      <div
        className={clsx(
          'hidden sm:block absolute top-5 left-0 right-0 h-px',
          isDark ? 'bg-white/25' : 'bg-slate-200'
        )}
        aria-hidden="true"
      />
      <div
        className={clsx(
          'hidden sm:block absolute top-5 left-0 h-px transition-all duration-300',
          isDark ? 'bg-white' : 'bg-gradient-to-r from-primary-500 via-primary-500 to-accent-500'
        )}
        style={{ width: `${progressPercent}%` }}
        aria-hidden="true"
      />

      <ol className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        {steps.map((step, index) => {
          const isCurrent = step.status === 'current'
          const isComplete = step.status === 'complete'
          const circleClasses = clsx(
            'flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors duration-200',
            {
              'bg-gradient-to-br from-white to-white/80 text-slate-900 border-transparent shadow-md': isDark && isComplete,
              'bg-gradient-to-br from-primary-500 to-accent-500 text-white border-transparent shadow-md': !isDark && isComplete,
              'border-white text-white bg-white/10 shadow-sm': isDark && isCurrent,
              'border-primary-500 text-primary-600 bg-white shadow-sm': !isDark && isCurrent,
              'border-white/40 text-white/70 bg-white/5': isDark && !isCurrent && !isComplete,
              'border-slate-200 text-slate-400 bg-white': !isDark && !isCurrent && !isComplete,
            }
          )

          const labelClasses = clsx(
            'text-sm font-semibold',
            isDark
              ? isCurrent
                ? 'text-white'
                : 'text-white/80'
              : isCurrent
                ? 'text-primary-600'
                : 'text-slate-600'
          )

          const linkClasses = clsx(
            'text-sm font-semibold',
            isDark ? 'text-white/80 hover:text-white' : 'text-slate-600 hover:text-primary-600'
          )

          const descriptionClasses = clsx(
            'text-xs mt-1 max-w-[12rem] leading-snug',
            isDark ? 'text-white/70' : 'text-slate-500'
          )

          return (
            <li key={step.label} className={clsx('relative sm:flex-1', isCurrent ? 'z-10' : undefined)}>
              <div className="flex items-center gap-3 sm:flex-col sm:items-center sm:text-center">
                <span className={circleClasses} aria-current={isCurrent ? 'step' : undefined}>
                  {isComplete ? <Check size={18} aria-hidden="true" /> : index + 1}
                </span>
                <div className="flex flex-col sm:items-center">
                  {step.href && !isCurrent ? (
                    <Link
                      href={step.href}
                      className={linkClasses}
                    >
                      {step.label}
                    </Link>
                  ) : (
                    <span className={labelClasses}>
                      {step.label}
                    </span>
                  )}
                  {step.description ? (
                    <span className={descriptionClasses}>
                      {step.description}
                    </span>
                  ) : null}
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
