import type { Metadata } from 'next'
import RegistroPageClient from './page.client'

export const metadata: Metadata = {
	title: 'Registro — Crie sua Conta na FORMA+',
	description: 'Cadastre-se para escolher pacotes, personalizar roteiros e reservar a viagem da turma.',
	openGraph: {
		title: 'Registro — Comece sua jornada com a FORMA+',
		description: 'Crie a conta, avance pelos pacotes e organize o roteiro de formatura.',
	},
}

export default function RegistroPage() {
	return <RegistroPageClient />
}
