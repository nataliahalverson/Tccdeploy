'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { LogIn, Mail, Lock } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Card from '@/components/Card'
import Main from '@/components/Main'
import { httpClient } from '@/lib/httpClient'
import { useAuth } from '@/contexts/AuthContext'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

export default function LoginPageClient() {
  const router = useRouter()
  const params = useSearchParams()
  const { refetch } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const nextPath = params.get('next') ?? '/inicio'

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      }

      const response = await httpClient('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || 'Erro ao fazer login')
        return
      }

      const result = await response.json()
      console.log('✅ Login successful:', result)
      
      // Refetch usuário no contexto
      await refetch()
      
  // Redirecionar para página de destino (ou início)
  router.push(nextPath)
    } catch (err) {
      console.error('❌ Login error:', err)
      setError('Erro ao conectar ao servidor. Verifique sua conexão.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <Main className="pt-10 md:pt-16 pb-16">
        <div className="mx-auto max-w-md px-4">
          <motion.div initial="initial" animate="animate" variants={{ animate: { transition: { staggerChildren: 0.1 } } }}>
            <motion.div variants={fadeInUp} className="mb-10 md:mb-14 text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-lg bg-primary-100 p-4">
                  <LogIn className="text-primary-600" size={32} />
                </div>
              </div>
              <h1 className="mb-2 text-4xl font-bold text-slate-900">Bem-vindo de Volta!</h1>
              <p className="text-slate-600">Acesse sua conta para gerenciar sua viagem</p>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card border>
                {error && (
                  <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
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
                    <div className="mb-2 flex items-center justify-between">
                      <label htmlFor="password" className="text-sm font-medium text-slate-700">
                        Senha
                      </label>
                      <Link href="#" className="focus-ring text-sm font-medium text-primary-600 hover:text-primary-700">
                        Esqueceu?
                      </Link>
                    </div>
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

                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg" 
                    fullWidth 
                    disabled={loading}
                    className="mt-8"
                  >
                    {loading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-10 md:mt-12 text-center">
              <p className="text-slate-600">
                Não tem uma conta?{' '}
                <Link href="/registro" className="focus-ring font-semibold text-primary-600 hover:text-primary-700">
                  Cadastre-se
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
