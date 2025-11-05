import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import clsx from 'clsx'

export interface FaqItem {
  question: string
  answer: string
  defaultOpen?: boolean
}

interface FaqSectionProps {
  id?: string
  title: string
  subtitle?: string
  items: FaqItem[]
  allowMultiple?: boolean
  className?: string
}

export default function FaqSection({
  id,
  title,
  subtitle,
  items,
  allowMultiple = false,
  className,
}: FaqSectionProps) {
  const shouldReduceMotion = useReducedMotion()

  const defaultOpenMap = useMemo(() => {
    const openItems = new Set<number>()
    items.forEach((item, index) => {
      if (item.defaultOpen) {
        openItems.add(index)
      }
    })
    return openItems
  }, [items])

  const [openItems, setOpenItems] = useState<Set<number>>(defaultOpenMap)

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev)
      const isOpen = next.has(index)

      if (allowMultiple) {
        if (isOpen) {
          next.delete(index)
        } else {
          next.add(index)
        }
        return next
      }

      if (isOpen) {
        next.clear()
      } else {
        next.clear()
        next.add(index)
      }

      return next
    })
  }

  return (
    <section id={id} className={clsx('section', className)} aria-labelledby={id ? `${id}-title` : undefined}>
      <div className="container-wide">
        <div className="text-center mb-8">
          <h2
            id={id ? `${id}-title` : undefined}
            className="text-4xl font-bold text-slate-900 mb-3"
          >
            {title}
          </h2>
          {subtitle ? <p className="text-slate-600 max-w-2xl mx-auto">{subtitle}</p> : null}
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {items.map((item, index) => {
            const isOpen = openItems.has(index)

            return (
              <div key={item.question} className="border border-slate-200 rounded-xl bg-white shadow-sm">
                <button
                  type="button"
                  className="w-full flex items-center justify-between gap-4 text-left px-5 py-4"
                  aria-expanded={isOpen}
                  onClick={() => toggleItem(index)}
                >
                  <span className="font-semibold text-slate-900">{item.question}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                    aria-hidden="true"
                    className="text-slate-400"
                  >
                    ⌄
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      key="content"
                      initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
                      animate={shouldReduceMotion ? { height: 'auto', opacity: 1 } : { height: 'auto', opacity: 1 }}
                      exit={shouldReduceMotion ? { height: 0, opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: 'easeOut' }}
                      className="px-5 pb-5 text-slate-600"
                    >
                      <div className="pt-1 leading-relaxed">
                        {item.answer}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
