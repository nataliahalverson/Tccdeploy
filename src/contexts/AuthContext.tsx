/**
 * AuthContext - Contexto Global de Autenticação
 * 
 * Fornece:
 * - User atual (ou null)
 * - Loading state
 * - Funções de login/logout
 * 
 * Uso:
 *   const { user, loading } = useAuth()
 */

'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { httpClient } from '@/lib/httpClient'

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  logout: () => Promise<void>
  refetch: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Buscar usuário autenticado ao montar
  useEffect(() => {
    fetchUser()
  }, [])

  async function fetchUser() {
    try {
      setLoading(true)
      const response = await httpClient('/auth/me', { method: 'GET' })
      if (!response.ok) {
        setUser(null)
        return
      }
      const data = await response.json()
      setUser(data.user)
    } catch (error) {
      console.error('❌ Erro ao buscar usuário:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  async function logout() {
    try {
      await httpClient('/auth/logout', { method: 'POST' })
      setUser(null)
      window.location.href = '/login'
    } catch (error) {
      console.error('❌ Erro ao fazer logout:', error)
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    logout,
    refetch: fetchUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}
