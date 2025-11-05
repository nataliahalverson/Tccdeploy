import type { Metadata } from 'next'
import RoteiroPageClient from './page.client'

export const metadata: Metadata = {
	title: 'Roteiro — Etapas da Viagem de Formatura',
	description: 'Visualize o passo a passo dos roteiros e avance para o pacote ideal para seu grupo.',
	openGraph: {
		title: 'Roteiro — Planeje cada etapa da formatura',
		description: 'Consulte o cronograma de dias e volte ao pacote completo para reservar.',
	},
}

export default function RoteiroPage() {
	return <RoteiroPageClient />
}
