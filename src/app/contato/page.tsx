import type { Metadata } from 'next'
import ContatoPageClient from './page.client'

export const metadata: Metadata = {
	title: 'Contato — Fale com a FORMA+',
	description: 'Envie dúvidas sobre pacotes, condições comerciais e suporte direto com a equipe de formatura.',
	openGraph: {
		title: 'Contato — Atendimento FORMA+',
		description: 'Preencha o formulário e receba retorno rápido do time especializado em viagens de formatura.',
	},
}

export default function ContatoPage() {
	return <ContatoPageClient />
}
