import type { Metadata } from 'next'
import { Suspense } from 'react'
import ReservaPageClient from './page.client'

export const metadata: Metadata = {
  title: 'Reserva Completa — FORMA+',
  description:
    'Preencha o formulário completo de reserva da FORMA+ com dados da turma, preferências de viagem, hospedagem e transporte para receber uma proposta personalizada.',
  openGraph: {
    title: 'Reserva Completa — FORMA+',
    description:
      'Envie todos os dados da sua turma para agilizar a reserva da viagem de formatura com a equipe FORMA+. '
      + 'Inclui informações de contato, perfil dos alunos, orçamento e necessidades especiais.',
  },
}

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export default function ReservaPage() {
  return (
    <Suspense fallback="Carregando…">
      <ReservaPageClient />
    </Suspense>
  )
}
