/**
 * Hook: useMotionSafe
 * 
 * Retorna animações seguras para SSR (Server-Side Rendering)
 * Evita hydration mismatch ao usar Framer Motion com Next.js
 * 
 * Uso:
 *   const { fadeInUp, staggerContainer } = useMotionSafe()
 *   <motion.div initial="initial" animate="animate" variants={fadeInUp}>
 */

'use client'

import { useEffect, useState } from 'react'

export function useMotionSafe() {
  const [isMounted, setIsMounted] = useState(false)
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    // Detectar preferência de movimento reduzido
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShouldReduceMotion(true)
    }
  }, [])

  // Retornar variantes vazias até montar (evita hydration mismatch)
  if (!isMounted) {
    return {
      fadeInUp: {
        initial: { opacity: 1, y: 0 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0 },
      },
      staggerContainer: {
        animate: {
          transition: {
            staggerChildren: 0,
            delayChildren: 0,
          },
        },
      },
      slideIn: {
        initial: { opacity: 1, x: 0 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0 },
      },
      scaleIn: {
        initial: { opacity: 1, scale: 1 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0 },
      },
    }
  }

  // Após montar, retornar variantes com animação (se permitido)
  return {
    fadeInUp: {
      initial: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: shouldReduceMotion ? 0 : 0.6 },
    },
    staggerContainer: {
      animate: {
        transition: {
          staggerChildren: shouldReduceMotion ? 0 : 0.1,
          delayChildren: shouldReduceMotion ? 0 : 0.2,
        },
      },
    },
    slideIn: {
      initial: { opacity: 0, x: shouldReduceMotion ? 0 : -20 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: shouldReduceMotion ? 0 : 0.6 },
    },
    scaleIn: {
      initial: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: shouldReduceMotion ? 0 : 0.6 },
    },
  }
}
