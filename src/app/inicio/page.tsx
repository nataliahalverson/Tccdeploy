import type { Metadata } from 'next'
import InícioPageClient from './page.client'

export const metadata: Metadata = {
	title: 'Início — Destinos Incríveis para Formatura',
	description: 'Conheça os destaques dos pacotes de formatura com carrossel de experiências e motivos para viajar com a turma.',
	openGraph: {
		title: 'Início — Destinos Incríveis para Formatura',
		description: 'Escolha o destino certo com carrossel de imagens, destaques e motivos para fechar sua viagem.',
	},
}

export default function InícioPage() {
	return <InícioPageClient />
}
