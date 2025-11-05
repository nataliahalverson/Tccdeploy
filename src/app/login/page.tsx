import type { Metadata } from 'next'
import { Suspense } from 'react'
import LoginPageClient from './page.client'

export const metadata: Metadata = {
	title: 'Login — Área do Viajante FORMA+',
	description: 'Acesse sua conta para acompanhar reservas, pagamentos e novidades da sua viagem de formatura.',
	openGraph: {
		title: 'Login — Área do Viajante',
		description: 'Entre para gerenciar pacotes e organizar a formatura da sua turma.',
	},
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function LoginPage() {
	return (
		<Suspense fallback={null}>
			<LoginPageClient />
		</Suspense>
	)
}
