'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { UserPlus, Mail, Lock, User } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Card from '@/components/Card'
import Main from '@/components/Main'
import { rotaPacote } from '@/lib/links'
import { httpClient } from '@/lib/httpClient'
import { useAuth } from '@/contexts/AuthContext'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

export default function RegistroPageClient() {
  const router = useRouter()
  const { refetch } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Step indicator removido conforme solicitação

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const password = formData.get('password') as string
      const confirmPassword = formData.get('confirmPassword') as string

      // Validar senhas
      if (password !== confirmPassword) {
        setError('As senhas não conferem')
        setLoading(false)
        return
      }

      if (password.length < 8) {
        setError('Senha deve ter pelo menos 8 caracteres')
        setLoading(false)
        return
      }

      const data = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        password: password,
      }

      const response = await httpClient('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || 'Erro ao cadastrar')
        return
      }

      const result = await response.json()
      console.log('✅ Registration successful:', result)
      
      // Atualizar contexto de autenticação
      await refetch()
      
  // Redirecionar para página de início conforme solicitado
  router.push('/inicio')
    } catch (err) {
      console.error('❌ Registration error:', err)
      setError('Erro ao conectar ao servidor. Verifique sua conexão.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
  <Main className="pt-8 md:pt-12">
        <div className="mx-auto max-w-md px-4">
          <motion.div initial="initial" animate="animate" variants={{ animate: { transition: { staggerChildren: 0.1 } } }}>
            {/* Step indicator removido */}
            <motion.div variants={fadeInUp} className="mb-8 text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-lg bg-accent-100 p-4">
                  <UserPlus className="text-accent-600" size={32} />
                </div>
              </div>
              <h1 className="mb-2 text-4xl font-bold text-slate-900">Crie sua Conta</h1>
              <p className="text-slate-600">Junte-se a FORMA+ e comece sua jornada</p>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card border>
                {error && (
                  <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
                      Nome Completo
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3.5 text-slate-400" size={20} />
                      <Input 
                        id="name" 
                        name="name" 
                        type="text" 
                        placeholder="Seu nome" 
                        required 
                        disabled={loading}
                        className="pl-10" 
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 text-slate-400" size={20} />
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        placeholder="seu@email.com" 
                        required 
                        disabled={loading}
                        className="pl-10" 
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                      Senha
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 text-slate-400" size={20} />
                      <Input 
                        id="password" 
                        name="password" 
                        type="password" 
                        placeholder="••••••••" 
                        required 
                        disabled={loading}
                        className="pl-10" 
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-slate-700">
                      Confirmar Senha
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 text-slate-400" size={20} />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        required
                        disabled={loading}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg" 
                    fullWidth 
                    disabled={loading}
                    className="mt-8"
                  >
                    {loading ? 'Criando conta...' : 'Criar Conta'}
                  </Button>
                </form>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-6 mb-10 md:mb-14 text-center">
              <p className="text-slate-600">
                Já tem uma conta?{' '}
                <Link href="/login" className="focus-ring font-semibold text-primary-600 hover:text-primary-700">
                  Faça login
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </Main>
      <Footer />
    </>
  )
}
