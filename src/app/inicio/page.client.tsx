'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, BadgeDollarSign, Headset, Calendar, Check, MapPin, Waves, Umbrella } from 'lucide-react'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Carousel from '@/components/Carousel'
import Button from '@/components/Button'
import Card from '@/components/Card'
import Breadcrumbs from '@/components/Breadcrumbs'
import Main from '@/components/Main'
import { pacotes } from '@/lib/pacotes'
import { rotaReserva, rotaRoteiro } from '@/lib/links'

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

export default function InícioPageClient() {
  const shouldReduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const localFadeInUp = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: shouldReduceMotion ? 0 : 0.6 },
  }

  const localStagger = {
    animate: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
        delayChildren: shouldReduceMotion ? 0 : 0.2,
      },
    },
  }
  const carouselImages = [
    {
      // Fortaleza + Beach Park (CE) — Praia de Iracema (vista aérea)
      src: 'https://unsplash.com/photos/zFrbKlnss24/download?force=true&w=1600',
      alt: 'Fortaleza (CE) — Praia de Iracema vista aérea.',
      credit: {
        name: 'Unsplash',
        url: 'https://unsplash.com/photos/aerial-photo-of-seashore-during-daytime-zFrbKlnss24',
      },
    },
    {
      // Rio de Janeiro (RJ) — panorama da cidade e montanhas
      src: 'https://unsplash.com/photos/LNcu4-_lpFw/download?force=true&w=1600',
      alt: 'Rio de Janeiro (RJ) — panorama da cidade e montanhas.',
      credit: {
        name: 'Unsplash',
        url: 'https://unsplash.com/photos/aerial-view-of-rio-de-janeiro-cityscape-and-mountains-LNcu4-_lpFw',
      },
    },
    {
      // Gramado & Canela (RS) — Cascata do Caracol (vista ampla)
      src: 'https://unsplash.com/photos/1LAySzqfm3E/download?force=true&w=1600',
      alt: 'Gramado & Canela (RS) — Cascata do Caracol (vista ampla).',
      credit: {
        name: 'Unsplash',
        url: 'https://unsplash.com/photos/aerial-photography-of-waterfalls-surrounded-with-forest-1LAySzqfm3E',
      },
    },
    {
      // Porto Seguro (BA) — Trancoso (vista da praia)
      src: 'https://unsplash.com/photos/zGF0mKZRsFo/download?force=true&w=1600',
      alt: 'Porto Seguro (BA) — Trancoso, vista da praia.',
      credit: {
        name: 'Unsplash',
        url: 'https://unsplash.com/photos/a-view-of-a-beach-and-ocean-from-a-hill-zGF0mKZRsFo',
      },
    },
  ]

  const destinos = [
    {
      nome: 'Porto Seguro',
      Icon: Umbrella,
      descricao: 'Conheça as praias paradisíacas de Porto Seguro e faça uma viagem inesquecível com sua turma!',
      destaques: ['Praias paradisíacas', 'Vida noturna vibrante', 'Atividades aquáticas'],
      dias: '10 dias',
    },
    {
      nome: 'Florianópolis',
      Icon: Waves,
      descricao: 'Descubra as belezas de Florianópolis, com suas praias, festas e muito mais!',
      destaques: ['42 praias incríveis', 'Trilhas e aventura', 'Gastronomia local'],
      dias: '7 dias',
    },
  ]

  return (
    <>
      <Header />
      <div className="bg-slate-50/80 border-b border-slate-200">
        <div className="container-wide px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Início' },
            ]}
          />
        </div>
      </div>
      <Main aria-labelledby="intro-title">
        {/* Hero com carrossel ao fundo e conteúdo sobreposto */}
        <section id="hero" className="section py-8" aria-labelledby="intro-title">
          <div className="container-wide">
            <motion.div initial="initial" animate="animate" variants={localStagger}>
              <div className="relative overflow-hidden rounded-2xl shadow-hard">
                <Carousel images={carouselImages} />
                {/* Gradiente para melhor leitura do texto */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-slate-900/70 via-slate-900/30 to-transparent" />
                {/* Conteúdo sobreposto */}
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <motion.div variants={localFadeInUp} className="max-w-3xl text-center text-white">
                    <h1 id="intro-title" className="mb-4 text-4xl font-bold md:text-6xl">
                      Bem-vindo à Viagem de Formatura
                    </h1>
                    <p className="mx-auto mb-8 max-w-2xl text-lg md:text-xl text-slate-100/90">
                      Escolha o destino perfeito para sua turma. Pacotes incríveis com experiências inesquecíveis.
                    </p>
                    <Button variant="primary" size="lg">
                      <Link href="/pacotes" aria-label="Ver pacotes disponíveis" className="focus-ring flex items-center gap-2">
                        Veja os Pacotes <ArrowRight size={20} />
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Pacotes favoritos */}
  <section id="favoritos" className="section cv-auto" aria-labelledby="favoritos-title">
          <div className="container-wide">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={localStagger}
              className="mb-8 text-center"
            >
              <motion.h2 id="favoritos-title" variants={localFadeInUp} className="text-4xl font-bold">
                Pacotes Favoritos
              </motion.h2>
              <motion.p variants={localFadeInUp} className="text-slate-600">
                Nossas escolhas de destaque para você começar agora.
              </motion.p>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={localStagger}
              className="grid grid-cols-1 gap-8 md:grid-cols-2 wc-transform wc-opacity"
            >
              {pacotes
                .filter((p) => p.destaque)
                .slice(0, 2)
                .map((p) => (
                  <motion.div key={p.id} variants={localFadeInUp}>
                    <Card interactive border className="h-full">
                      {p.imagemUrl ? (
                        <div className="mb-4 relative h-44 w-full overflow-hidden rounded-xl">
                          <Image src={p.imagemUrl} alt={p.nome} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="mb-4 flex items-start justify-between">
                          <div className="rounded-xl bg-slate-100 p-4 text-primary-700">
                            <MapPin size={40} />
                          </div>
                          <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700">
                            {p.dias} dias
                          </span>
                        </div>
                      )}
                      {!p.imagemUrl && (
                        <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700">
                          {p.dias} dias
                        </span>
                      )}
                      <h3 className="mb-2 text-3xl font-bold text-slate-900">{p.nome}</h3>
                      <p className="mb-4 font-semibold text-primary-700">{p.valor}</p>
                      <div className="mb-6 border-t border-slate-200 pt-6">
                        <h4 className="mb-3 font-semibold text-slate-900">No roteiro:</h4>
                        <ul className="space-y-2">
                          {p.roteiro.slice(0, 3).map((item) => (
                            <li key={item} className="flex items-start gap-2 text-slate-700">
                              <Check className="mt-0.5 flex-shrink-0 text-success-500" size={18} />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex gap-3">
                        <Link href={rotaRoteiro(p.slug)} className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary-600 to-accent-600 px-5 py-2.5 font-semibold text-white shadow-lg transition-all duration-200 hover:from-primary-500 hover:to-accent-500 hover:shadow-xl active:scale-95">
                          Ver roteiro completo
                        </Link>
                        <Link href="/roteiro" className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary-200 bg-white px-5 py-2.5 font-semibold text-primary-700 shadow-sm transition-all duration-200 hover:bg-primary-50 active:scale-95">
                          Reservar agora
                        </Link>
                      </div>
                    </Card>
                  </motion.div>
                ))}
            </motion.div>
          </div>
        </section>

  <section id="destinos" className="section cv-auto" aria-labelledby="destinos-title">
          <div className="container-wide">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={localStagger}
              className="mb-12"
            >
              <motion.h2 id="destinos-title" variants={localFadeInUp} className="mb-4 text-center text-4xl font-bold">
                Destinos Incríveis
              </motion.h2>
              <motion.p variants={localFadeInUp} className="mx-auto text-center text-slate-600">
                Cada destino oferece uma experiência única e memorável. Confira os destaques de cada um!
              </motion.p>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={localStagger}
              className="grid grid-cols-1 gap-8 lg:grid-cols-2 wc-transform wc-opacity"
            >
              {destinos.map((destino) => (
                <motion.div key={destino.nome} variants={localFadeInUp}>
                  <Card interactive gradient border className="h-full overflow-hidden">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="rounded-xl bg-primary-100 p-3 text-primary-700">
                        <destino.Icon size={32} />
                      </div>
                      <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700">
                        {destino.dias}
                      </span>
                    </div>

                    <h3 className="mb-2 text-3xl font-bold text-slate-900">{destino.nome}</h3>
                    <p className="mb-6 text-slate-600">{destino.descricao}</p>

                    <div className="mb-6 border-t border-slate-200 pt-6">
                      <h4 className="mb-4 font-semibold text-slate-900">Destaques:</h4>
                      <ul className="space-y-2">
                        {destino.destaques.map((destaque) => (
                          <li key={destaque} className="flex items-center gap-2 text-slate-700">
                            <span className="h-2 w-2 rounded-full bg-primary-500" />
                            {destaque}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button variant="primary" size="md" fullWidth>
                      <Link href="/pacotes" aria-label={`Saiba mais sobre ${destino.nome}`} className="focus-ring block w-full">
                        Saiba Mais
                      </Link>
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

  <section id="porque" className="section bg-slate-50 cv-auto" aria-labelledby="porque-title-inicio">
          <div className="container-wide">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={localStagger}
              className="mb-12 text-center"
            >
              <motion.h2 id="porque-title-inicio" variants={localFadeInUp} className="mb-4 text-4xl font-bold">
                Por Que Escolher Nossos Destinos?
              </motion.h2>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={localStagger}
              className="grid grid-cols-1 gap-8 md:grid-cols-3"
            >
              <motion.div variants={localFadeInUp}>
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

              <motion.div variants={localFadeInUp}>
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

              <motion.div variants={localFadeInUp}>
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
