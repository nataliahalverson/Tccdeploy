/**
 * MobileUserMenu - Menu do Usuário em Mobile
 */

'use client'

import Link from 'next/link'
import { LogOut, User } from 'lucide-react'
import Button from './Button'
import { useAuth } from '@/contexts/AuthContext'
import { rotaPerfil } from '@/lib/links'

export default function MobileUserMenu() {
  const { user, loading, logout } = useAuth()

  if (loading) {
    return (
      <div className="flex gap-2 pt-2">
        <div className="h-9 flex-1 bg-slate-200 rounded animate-pulse" />
      </div>
    )
  }

  // Usuário autenticado
  if (user) {
    return (
      <div className="px-2 pt-4 border-t border-slate-100">
        <div className="px-2 py-3 bg-slate-50 rounded-lg mb-2">
          <p className="text-sm font-medium text-slate-900">{user.name}</p>
          <p className="text-xs text-slate-500">{user.email}</p>
        </div>
        <Link
          href={rotaPerfil}
          className="focus-ring mb-3 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary-600 to-accent-600 px-4 py-2 font-semibold text-white shadow-lg hover:from-primary-500 hover:to-accent-500"
        >
          <User size={16} />
          <span>Ver meu perfil</span>
        </Link>
        <Button
          variant="link"
          size="md"
          fullWidth
          onClick={logout}
          className="justify-start text-red-600 hover:text-red-700"
        >
          <LogOut size={16} />
          <span>Fazer Logout</span>
        </Button>
      </div>
    )
  }

  // Não autenticado
  return (
    <div className="flex gap-2 pt-2">
      <Button variant="link" size="md" fullWidth>
        <Link href="/login" className="block w-full text-center">
          Login
        </Link>
      </Button>
      <Button variant="primary" size="md" fullWidth>
        <Link href="/registro" className="flex items-center justify-center gap-2">
          Registrar
        </Link>
      </Button>
    </div>
  )
}
