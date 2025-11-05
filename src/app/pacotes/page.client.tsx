'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, Calendar, ShieldCheck, BadgeDollarSign, Headset, MapPin } from 'lucide-react'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import Card from '@/components/Card'
import Badge from '@/components/Badge'
import Breadcrumbs from '@/components/Breadcrumbs'
import Main from '@/components/Main'
import { reservaHref, rotaRoteiro } from '@/lib/links'
import { pacotes } from '@/lib/pacotes'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

export default function PacotesPageClient() {
  // Ordena colocando os favoritos (destaque=true) nas primeiras posições
  const pacotesOrdenados = [...pacotes].sort((a, b) => Number(b.destaque) - Number(a.destaque))

  // Step indicator removido conforme solicitação

  return (
    <>
      <Header />
      <div className="border-b border-slate-200 bg-slate-50/80">
        <div className="container-wide px-4 py-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Pacotes' },
            ]}
          />
        </div>
      </div>
      <Main>
        <section className="section bg-gradient-to-br from-slate-900 to-slate-800 py-20 text-white">
          <div className="container-wide">
            <motion.div initial="initial" animate="animate" variants={staggerContainer} className="text-center">
              <motion.h1 variants={fadeInUp} className="mb-4 text-5xl font-bold md:text-6xl">
                Pacotes Incríveis
              </motion.h1>
              <motion.p variants={fadeInUp} className="mx-auto text-xl text-slate-300">
                Escolha o pacote perfeito para sua viagem de formatura. Todas as opções incluem experiências memoráveis.
              </motion.p>
              {/* Step indicator removido */}
            </motion.div>
          </div>
        </section>

  <section className="section cv-auto">
          <div className="container-wide">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 wc-transform wc-opacity"
            >
              {pacotesOrdenados.map((pacote) => {
                const roteiroHref = rotaRoteiro(pacote.slug)

                return (
                  <motion.div key={pacote.id} variants={fadeInUp}>
                    <Card
                      interactive
                      border
                      className={`relative overflow-hidden ${
                        pacote.destaque ? 'lg:transform lg:scale-105 lg:shadow-hard' : ''
                      }`}
                    >
                      {pacote.destaque && (
                        <div className="absolute right-0 top-0 z-10">
                          <Badge variant="accent" className="rounded-bl-lg rounded-none">
                            ⭐ Favorito
                          </Badge>
                        </div>
                      )}

                      <div className="border-b border-slate-200 pb-6">
                        {pacote.imagemUrl ? (
                          <div className="mb-4 relative h-44 w-full overflow-hidden rounded-xl">
                            <Image src={pacote.imagemUrl} alt={pacote.nome} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="mb-4">
                            <div className="inline-flex rounded-xl bg-slate-100 p-4 text-primary-700">
                              <MapPin size={40} />
                            </div>
                          </div>
                        )}
                        <h2 className="mb-4 text-3xl font-bold text-slate-900">{pacote.nome}</h2>
                        <div className="flex items-center gap-4 text-slate-700">
                          <div className="flex items-center gap-2">
                            <Calendar size={20} />
                            <span className="font-semibold">{pacote.dias} dias</span>
                          </div>
                          <span aria-hidden className="text-slate-300">•</span>
                          <span className="font-semibold text-primary-700">{pacote.valor}</span>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="mb-4 font-semibold text-slate-900">Lugares visitados no roteiro</h3>
                        <ul className="space-y-3">
                          {pacote.roteiro.map((item) => (
                            <li key={item} className="flex items-start gap-3">
                              <Check className="mt-0.5 flex-shrink-0 text-success-500" size={20} />
                              <span className="text-slate-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex gap-3 border-t border-slate-200 pt-6">
                        <Link href={roteiroHref} className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary-600 to-accent-600 px-5 py-2.5 font-semibold text-white shadow-lg transition-all duration-200 hover:from-primary-500 hover:to-accent-500 hover:shadow-xl active:scale-95">
                          Ver roteiro completo
                        </Link>
                        <Link href="/roteiro" className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary-200 bg-white px-5 py-2.5 font-semibold text-primary-700 shadow-sm transition-all duration-200 hover:bg-primary-50 active:scale-95">
                          Reservar agora
                        </Link>
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>

  <section className="section bg-slate-50 cv-auto">
          <div className="container-wide">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="mb-12 text-center"
            >
              <motion.h2 variants={fadeInUp} className="text-4xl font-bold">
                Por Que Nos Escolher?
              </motion.h2>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 gap-8 md:grid-cols-3"
            >
              <motion.div variants={fadeInUp}>
                <Card border>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-lg bg-primary-100 p-3">
                      <ShieldCheck className="text-primary-600" size={24} />
                    </div>
                    <h3 className="text-xl font-semibold">Segurança Garantida</h3>
                  </div>
                  <p className="text-slate-600">Seguro viagem incluído em todos os pacotes para total tranquilidade.</p>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card border>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-lg bg-accent-100 p-3">
                      <BadgeDollarSign className="text-accent-600" size={24} />
                    </div>
                    <h3 className="text-xl font-semibold">Melhor Preço</h3>
                  </div>
                  <p className="text-slate-600">Garanta os melhores preços do mercado com nossas ofertas exclusivas.</p>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card border>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-lg bg-success-100 p-3">
                      <Headset className="text-success-600" size={24} />
                    </div>
                    <h3 className="text-xl font-semibold">Suporte 24/7</h3>
                  </div>
                  <p className="text-slate-600">Nossa equipe sempre disponível para ajudar durante sua viagem.</p>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </Main>
      <Footer />
    </>
  )
}
