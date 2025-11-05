import type { Metadata } from 'next'
import HomePageClient from './page.client'

export const metadata: Metadata = {
	title: 'Roteiros de Formatura — Descomplicado',
	description: 'Pacotes, roteiros e reserva em poucos cliques.',
	openGraph: {
		title: 'Roteiros de Formatura — Descomplicado',
		description: 'Pacotes, roteiros e reserva em poucos cliques.',
	},
}

export default function HomePage() {
	return <HomePageClient />
}
