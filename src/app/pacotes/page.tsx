import type { Metadata } from 'next'
import PacotesPageClient from './page.client'

export const metadata: Metadata = {
	title: 'Pacotes — Roteiros e Reserva de Viagem de Formatura',
	description: 'Compare pacotes exclusivos, confira avaliações e siga direto para reservar o roteiro ideal para a sua turma.',
	openGraph: {
		title: 'Pacotes — Roteiros e Reserva de Formatura',
		description: 'Descubra o pacote certo e avance para o roteiro completo com reserva garantida.',
	},
}

export default function PacotesPage() {
	return <PacotesPageClient />
}
