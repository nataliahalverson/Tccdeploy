"use client"

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

export default function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    const previously = document.activeElement as HTMLElement | null
    const el = ref.current
    el?.focus()
    return () => previously?.focus()
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <button
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative max-h-[85vh] w-[min(92vw,800px)] overflow-auto rounded-2xl bg-white p-6 shadow-2xl focus:outline-none animate-slideDown"
      >
        <div className="mb-4 flex items-start justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
          <button className="focus-ring rounded-lg p-2 hover:bg-slate-100" onClick={onClose} aria-label="Fechar modal">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
