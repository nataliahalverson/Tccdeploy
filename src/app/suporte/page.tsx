import type { Metadata } from 'next'
import SuportePageClient from './page.client'

export const metadata: Metadata = {
  title: 'Suporte — Informações e Políticas',
  description: 'Centralize dúvidas frequentes, políticas de privacidade, termos de serviço e regras de cancelamento.',
  openGraph: {
    title: 'Suporte — Informações e Políticas',
    description: 'Acesse respostas rápidas, conheça nossas políticas e saiba como proceder com cancelamentos.',
  },
}

export default function SuportePage() {
  return <SuportePageClient />
}
