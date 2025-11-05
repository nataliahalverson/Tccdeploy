/**
 * UserMenu - Menu do Usuário Autenticado
 * 
 * Mostra:
 * - Nome do usuário
 * - Botão de Logout
 * 
 * Se não autenticado, mostra Login/Registrar
 */

'use client'

import Link from 'next/link'
import { User } from 'lucide-react'
import Button from './Button'
import { useAuth } from '@/contexts/AuthContext'
import { rotaPerfil } from '@/lib/links'

export default function UserMenu() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="hidden md:flex gap-2">
        <div className="h-9 w-24 bg-slate-200 rounded animate-pulse" />
      </div>
    )
  }

  // Usuário autenticado
  if (user) {
    return (
      <Link
        href={rotaPerfil}
        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary-600 to-accent-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-primary-500 hover:to-accent-500 hover:shadow-xl focus-ring"
        aria-label="Abrir a página de perfil"
      >
        <User size={18} />
        <span className="hidden sm:inline max-w-[160px] truncate">{user.name}</span>
      </Link>
    )
  }

  // Não autenticado
  return (
    <div className="hidden md:flex gap-2">
      <Button variant="link" size="md">
        <Link href="/login" className="flex items-center gap-2">
          Login
        </Link>
      </Button>
      <Button variant="primary" size="md">
        <Link href="/registro" className="flex items-center gap-2">
          Registrar
        </Link>
      </Button>
    </div>
  )
}
