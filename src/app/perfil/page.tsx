import type { Metadata } from 'next'
import PerfilPageClient from './PerfilPageClient'

export const metadata: Metadata = {
  title: 'Meu Perfil — FORMA+',
  description: 'Veja seus dados cadastrais, informações de contato e gerencie a sua conta de viajante.',
  openGraph: {
    title: 'Meu Perfil — FORMA+',
    description: 'Acompanhe seus dados e gerencie preferências da sua viagem de formatura.',
  },
}

export default function PerfilPage() {
  return <PerfilPageClient />
}
