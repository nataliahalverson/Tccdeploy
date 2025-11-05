import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Main from '@/components/Main'
import { getPacoteBySlug } from '@/data/pacotes'

interface Params {
  params: { slug: string }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const pacote = getPacoteBySlug(params.slug)
  const title = pacote ? `${pacote.titulo} — Roteiro & Reserva` : 'Pacote'
  const description = pacote
    ? `Roteiro de formatura em ${pacote.destino}. Inclusos: ${pacote.inclusos.join(', ')}.`
    : 'Detalhes do pacote.'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    alternates: {
      canonical: `/pacotes/${params.slug}`,
    },
  }
}

export default function PacotePage({ params }: Params) {
  const pacote = getPacoteBySlug(params.slug)

  if (!pacote) {
    notFound()
  }

  return (
    <Main>
      <section className="container mx-auto max-w-5xl px-4 py-10">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold text-slate-900">{pacote.titulo}</h1>
          <p className="text-slate-600">{pacote.destino}</p>
          {pacote.precoDesde ? (
            <p className="mt-2 text-sm text-slate-500">
              A partir de <strong className="font-semibold text-primary-600">{pacote.precoDesde}</strong> {pacote.parcelamento && `| ${pacote.parcelamento}`}
            </p>
          ) : null}
        </header>

        <h2 className="mt-8 mb-3 text-xl font-medium text-slate-900">Roteiro</h2>
        <ol className="space-y-3">
          {pacote.roteiro.map((d) => (
            <li key={d.dia} className="rounded-xl border border-slate-200 p-4 shadow-sm">
              <strong className="block text-slate-900">
                {d.dia} — {d.titulo}
              </strong>
              <ul className="ml-4 list-disc text-slate-700">
                {d.itens.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <div id="reserva" className="-mt-24 pt-24" />

        <h2 className="mt-10 mb-3 text-xl font-medium text-slate-900">Reserva</h2>
        <form className="grid max-w-md gap-3">
          <input className="focus-ring input-field" placeholder="Nome completo" />
          <input className="focus-ring input-field" placeholder="Turma" />
          <input className="focus-ring input-field" placeholder="Telefone" />
          <input className="focus-ring input-field" placeholder="Email" type="email" />
          <button type="submit" className="focus-ring inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-primary-600 to-accent-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-primary-500 hover:to-accent-500 hover:shadow-xl active:scale-95">
            Enviar interesse
          </button>
        </form>
      </section>
    </Main>
  )
}
