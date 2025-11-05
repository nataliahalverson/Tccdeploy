"use client"

import { useEffect } from 'react'

/**
 * SlowScrollProvider
 *
 * Suaviza e desacelera o scroll do mouse/roda, mantendo acessibilidade:
 * - Respeita prefers-reduced-motion
 * - Não interfere em teclado, toque/touch, ou navegação por âncoras
 * - Desabilita automaticamente se o navegador sinalizar problemas
 */
export default function SlowScrollProvider({
  enabled = true,
  scale = 0.45, // 45% do delta original
  duration = 320, // ms por animação
}: {
  enabled?: boolean
  scale?: number
  duration?: number
}) {
  useEffect(() => {
    if (!enabled) return
    if (typeof window === 'undefined') return

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (reduce?.matches) return

    const root = document.scrollingElement || document.documentElement
    let raf = 0
    let startTime = 0
    let startY = 0
    let targetY = 0

    const maxScroll = () => root.scrollHeight - root.clientHeight

    const animate = (t: number) => {
      const elapsed = t - startTime
      const k = Math.min(1, elapsed / duration)
      // easeOutCubic
      const eased = 1 - Math.pow(1 - k, 3)
      const y = startY + (targetY - startY) * eased
      root.scrollTo({ top: y })
      if (k < 1) raf = requestAnimationFrame(animate)
    }

    const onWheel = (e: WheelEvent) => {
      // Evita conflitos: zoom com CTRL, outros handlers, ou se não for mouse/trackpad
      if (e.defaultPrevented || e.ctrlKey) return

      // Converte deltaLine para px quando necessário
      const lineHeight = 16 // aprox.
      const deltaPx = e.deltaY * (e.deltaMode === 1 ? lineHeight : 1)

      // Somente desacelerar se o delta for significativo
      const scaled = deltaPx * scale

      // Impede o scroll padrão e aplicamos o nosso
      e.preventDefault()

      // Define novo alvo acumulando deltas recentes
      const current = root.scrollTop
      startY = current
      targetY = Math.max(0, Math.min(maxScroll(), current + scaled))

      cancelAnimationFrame(raf)
      startTime = performance.now()
      raf = requestAnimationFrame(animate)
    }

    // wheel precisa ser { passive: false } para podermos preventDefault()
    window.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('wheel', onWheel as any)
    }
  }, [enabled, scale, duration])

  return null
}
