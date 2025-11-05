'use client'

import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumbs from '@/components/Breadcrumbs'
import Main from '@/components/Main'
import { rotaContato, rotaPacote, rotaReservaCompleta } from '@/lib/links'
import Card from '@/components/Card'
import Image from 'next/image'
import { Check } from 'lucide-react'
import { pacotes } from '@/lib/pacotes'
import Modal from '@/components/Modal'
import { useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import { roteiroDetalhes } from '@/lib/roteiroDetalhes'

export default function RoteiroPageClient() {
  const [slugSelecionado, setSlugSelecionado] = useState<string | null>(null)
  const [slugDestacado, setSlugDestacado] = useState<string | null>(null)
  const highlightTimeoutRef = useRef<number | null>(null)
  const detalhe = useMemo(() => roteiroDetalhes.find((d) => d.slug === slugSelecionado) || null, [slugSelecionado])
  const hospedagemInfo = useMemo(() => {
    if (!detalhe?.hospedagem) return null
    const [principal, alternativa] = detalhe.hospedagem.split(' — alt.: ').map((item) => item.trim())
    return { principal, alternativa }
  }, [detalhe])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const focusCardFromHash = () => {
      const { hash } = window.location
      if (!hash?.startsWith('#roteiro-')) return

      const slug = hash.replace('#roteiro-', '')
      if (!pacotes.some((p) => p.slug === slug)) return

      setSlugDestacado(slug)

      requestAnimationFrame(() => {
        const alvo = document.getElementById(`roteiro-${slug}`)
        alvo?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })

      if (highlightTimeoutRef.current !== null) {
        window.clearTimeout(highlightTimeoutRef.current)
      }
      highlightTimeoutRef.current = window.setTimeout(() => setSlugDestacado(null), 4000)
    }

    focusCardFromHash()
    window.addEventListener('hashchange', focusCardFromHash)

    return () => {
      window.removeEventListener('hashchange', focusCardFromHash)
      if (highlightTimeoutRef.current !== null) {
        window.clearTimeout(highlightTimeoutRef.current)
      }
    }
  }, [])

  const handleCloseModal = () => {
    setSlugSelecionado(null)
    setSlugDestacado(null)
    if (highlightTimeoutRef.current !== null) {
      window.clearTimeout(highlightTimeoutRef.current)
      highlightTimeoutRef.current = null
    }
    if (typeof window !== 'undefined' && window.location.hash) {
      const { pathname, search } = window.location
      window.history.replaceState(null, '', `${pathname}${search}`)
    }
  }

  return (
    <>
      <Header />
      <div className="border-b border-slate-200 bg-slate-50/80">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Pacotes', href: rotaPacote() },
              { label: 'Roteiro' },
            ]}
          />
        </div>
      </div>
      <Main>
        <section className="section" aria-labelledby="roteiro-title">
          <div className="container-wide">
            <div className="mb-8 text-center">
              <h1 id="roteiro-title" className="mb-3 text-4xl font-bold">Roteiro de Viagem</h1>
              <p className="text-slate-600">Veja os destinos e as atrações principais de cada pacote.</p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {pacotes.map((p) => (
                <Card
                  key={p.id}
                  id={`roteiro-${p.slug}`}
                  interactive
                  border
                  className={clsx('overflow-hidden scroll-mt-28', slugDestacado === p.slug && 'ring-2 ring-offset-2 ring-primary-500 ring-offset-white shadow-hard')}
                  onClick={() => setSlugSelecionado(p.slug)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      setSlugSelecionado(p.slug)
                    }
                  }}
                >
                  {p.imagemUrl && (
                    <div className="mb-4 relative h-44 w-full overflow-hidden rounded-xl">
                      <Image src={p.imagemUrl} alt={p.nome} fill className="object-cover" />
                    </div>
                  )}
                  <h3 className="mb-2 text-2xl font-bold text-slate-900">{p.nome}</h3>
                  <div className="border-t border-slate-200 pt-4">
                    <h4 className="mb-2 text-sm font-semibold text-slate-900">Atrações principais:</h4>
                    <ul className="space-y-1 text-sm text-slate-700">
                      {p.roteiro.slice(0, 3).map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <Check className="mt-0.5 text-success-500" size={16} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

  <Modal open={!!slugSelecionado} onClose={handleCloseModal} title={detalhe?.nome || 'Detalhes do Roteiro'}>
          {detalhe && (
            <div className="space-y-4 text-slate-700">
              {detalhe.diaADia && detalhe.diaADia.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900">Roteiro (dia a dia)</h3>
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    {detalhe.diaADia.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-slate-900">Atrações</h3>
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  {detalhe.atracoes.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">Hospedagem</h3>
                {hospedagemInfo ? (
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>
                      <strong>Principal:</strong> {hospedagemInfo.principal}
                    </li>
                    {hospedagemInfo.alternativa && (
                      <li>
                        <strong>Alternativa:</strong> {hospedagemInfo.alternativa}
                      </li>
                    )}
                  </ul>
                ) : (
                  <p className="mt-1">{detalhe.hospedagem}</p>
                )}
              </div>


              {detalhe.locomocao && (
                <div>
                  <h3 className="font-semibold text-slate-900">Locomoção</h3>
                  <p className="mt-1">{detalhe.locomocao}</p>
                </div>
              )}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Dias</h4>
                  <p>{detalhe.dias}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Saída</h4>
                  <p>{detalhe.saida}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Chegada</h4>
                  <p>{detalhe.chegada}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">Incluso</h3>
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  {detalhe.incluso.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Valor</h4>
                  <p className="font-semibold text-primary-700">{detalhe.valor}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Pagamento</h4>
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    {detalhe.pagamento.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">Contato</h3>
                <p>{detalhe.contato}</p>
              </div>

              <div className="pt-2">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={rotaContato}
                    className="focus-ring inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-primary-600 to-accent-600 px-5 py-2.5 font-semibold text-white shadow-lg transition-all duration-200 hover:from-primary-500 hover:to-accent-500"
                  >
                    Entrar em contato
                  </Link>
                  <Link
                    href={rotaReservaCompleta(detalhe.slug)}
                    className="focus-ring inline-flex items-center justify-center rounded-lg border border-primary-200 bg-white px-5 py-2.5 font-semibold text-primary-700 shadow-sm transition-all duration-200 hover:border-primary-300 hover:bg-primary-50"
                  >
                    Reservar agora
                  </Link>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </Main>
      <Footer />
    </>
  )
}
