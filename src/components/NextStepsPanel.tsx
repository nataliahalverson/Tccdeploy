import Link from 'next/link'
import clsx from 'clsx'
import { ArrowRight, Calendar, Phone, MapPin, Send } from 'lucide-react'

interface NextStep {
  title: string
  description: string
  actionLabel: string
  href: string
  icon: 'calendar' | 'phone' | 'map' | 'message'
  variant?: 'primary' | 'secondary' | 'ghost'
}

interface NextStepsPanelProps {
  steps: NextStep[]
  className?: string
}

const iconMap = {
  calendar: Calendar,
  phone: Phone,
  map: MapPin,
  message: Send,
}

export default function NextStepsPanel({ steps, className }: NextStepsPanelProps) {
  return (
    <div
      className={clsx(
        'grid gap-4 sm:grid-cols-2 lg:grid-cols-4',
        className
      )}
    >
      {steps.map((step) => {
        const Icon = iconMap[step.icon]
        return (
          <div
            key={step.title}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition-transform duration-300 hover:-translate-y-1 hover:shadow-medium"
          >
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-primary-50 p-2 text-primary-600">
                <Icon size={20} />
              </span>
              <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
            </div>
            <p className="mt-4 text-sm text-slate-600 leading-relaxed">{step.description}</p>
            <Link
              href={step.href}
              className="focus-ring mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-500"
            >
              {step.actionLabel}
              <ArrowRight size={16} />
            </Link>
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10">
              <div className="absolute -right-10 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-primary-500 blur-3xl" />
            </div>
          </div>
        )
      })}
    </div>
  )
}
