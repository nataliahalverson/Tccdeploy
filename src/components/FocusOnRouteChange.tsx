'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function FocusOnRouteChange() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.location.hash) return // não roubar foco de âncoras

    document.getElementById('conteudo')?.focus()
  }, [pathname])

  return null
}
