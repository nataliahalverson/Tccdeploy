'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Users, Heart, Calendar, Clock, Star, MapPin } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import Card from '@/components/Card'
import Input from '@/components/Input'
import Badge from '@/components/Badge'
import FaqSection from '@/components/FaqSection'
import NextStepsPanel from '@/components/NextStepsPanel'
import Main from '@/components/Main'
import { reservaHref, rotaPacote, rotaReserva } from '@/lib/links'
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

export default function HomePageClient() {
  const features = [
    {
      icon: MapPin,
      title: 'Destinos Incríveis',
      description: 'Porto Seguro e Florianópolis à sua espera',
    },
    {
      icon: Zap,
      title: 'Pacotes Completos',
      description: 'Transporte, hospedagem e passeios inclusos',
    },
    {
      icon: Users,
      title: 'Experiências Memoráveis',
      description: 'Viva momentos incríveis com sua turma',
    },
    {
      icon: Heart,
      title: 'Melhor Preço Garantido',
      description: 'Qualidade premium com o melhor custo-benefício',
    },
  ]

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

  const destinosDestaque = pacotes.filter((p) => p.destaque).slice(0, 2)

  const depoimentos = [
    {
      nome: 'Ana — 3º Ano',
      texto: 'A viagem foi impecável do começo ao fim. Organização e segurança nota 10!',
      estrelas: 5,
    },
    {
      nome: 'Lucas — Formado 2024',
      texto: 'Momentos que vou lembrar para sempre com a minha turma. Recomendo muito!',
      estrelas: 5,
    },
    {
      nome: 'Mariana — 9º Ano',
      texto: 'Atividades incríveis e equipe atenciosa. Superou minhas expectativas!',
      estrelas: 5,
    },
  ]

  const faqs = [
    {
      question: 'O que está incluso nos pacotes?',
      answer: 'Transporte, hospedagem, atividades e suporte da equipe. Itens variam por destino.',
      defaultOpen: true,
    },
    {
      question: 'É possível parcelar?',
      answer:
        'Sim, trabalhamos com condições de pagamento flexíveis. Consulte os detalhes na página de pacotes.',
    },
    {
      question: 'Como funciona a segurança?',
      answer: 'Equipe experiente, seguro viagem incluso e parceiros confiáveis em todos os destinos.',
    },
  ]

  const heroHighlights = [
    {
      title: 'Planejamento completo',
      description: 'Equipe dedicada cuidando da sua turma antes, durante e depois da viagem.',
    },
    {
      title: 'Pagamento flexível',
      description: 'Opções sob medida para caber no orçamento da turma sem abrir mão da experiência.',
    },
    {
      title: 'Experiências personalizadas',
      description: 'Atividades e festas ajustadas ao perfil e aos interesses de cada grupo.',
    },
  ]

  const proximasSaidas = [
    (() => {
      const p = pacotes.find((x) => x.slug === 'porto-seguro-ba')
      return {
        destino: p?.nome ?? 'Porto Seguro (BA)',
        periodo: 'Verão 2025',
        data: '15 • Jan • 2025',
        vagas: '12 vagas restantes',
        destaque: 'Beach club exclusivo, festa lua cheia e passeio histórico no centro.',
        status: { label: 'Últimas vagas', variant: 'danger' as const },
        tempoRestante: 'Faltam 11 semanas',
        slug: p?.slug ?? 'porto-seguro-ba',
        cta: 'Reservar agora',
      }
    })(),
    (() => {
      const p = pacotes.find((x) => x.slug === 'florianopolis-sc')
      return {
        destino: p?.nome ?? 'Florianópolis (SC)',
        periodo: 'Carnaval 2025',
        data: '02 • Fev • 2025',
        vagas: '20 vagas disponíveis',
        destaque: 'Trilhas, sandboard nas dunas e festa sunset de boas-vindas.',
        status: { label: 'Pré-reserva aberta', variant: 'success' as const },
        tempoRestante: 'Faltam 15 semanas',
        slug: p?.slug ?? 'florianopolis-sc',
        cta: 'Ver detalhes do pacote',
      }
    })(),
    (() => {
      const p = pacotes.find((x) => x.slug === 'fortaleza-beach-park-ce')
      return {
        destino: p?.nome ?? 'Fortaleza + Beach Park (CE)',
        periodo: 'Outono 2025',
        data: '22 • Mar • 2025',
        vagas: 'Garanta prioridade na abertura',
        destaque: 'Combo parque + praia com hospedagem próxima ao Aqua Park.',
        status: { label: 'Lista de interesse', variant: 'secondary' as const },
        tempoRestante: 'Aviso antecipado',
        slug: p?.slug ?? 'fortaleza-beach-park-ce',
        cta: 'Registrar interesse',
      }
    })(),
  ]

  const nextSteps = [
    {
      title: 'Escolha seu destino',
      description: 'Compare pacotes, roteiros e condições especiais para cada turma.',
      actionLabel: 'Ver detalhes do pacote',
      href: rotaPacote(),
      icon: 'calendar' as const,
    },
    {
      title: 'Monte o roteiro',
      description: 'Personalize festas, passeios e experiências guiadas com nossa equipe.',
      actionLabel: 'Ver opções de roteiro',
      href: '/roteiro',
      icon: 'map' as const,
    },
    {
      title: 'Fale com especialistas',
      description: 'Tire dúvidas sobre pagamentos, contratos e logística da turma.',
      actionLabel: 'Agendar conversa',
      href: '/contato',
      icon: 'phone' as const,
    },
    {
      title: 'Confirme o grupo',
      description: 'Finalize reservas e receba o kit completo de preparação da viagem.',
      actionLabel: 'Ir para reserva',
      href: reservaHref(),
      icon: 'message' as const,
    },
  ]

  const handleNewsletter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    console.log('newsletter:', data.get('email'))
  }

  const primaryCtaClass =
    'focus-ring inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary-600 to-accent-600 px-6 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:from-primary-500 hover:to-accent-500 hover:shadow-xl active:scale-95 sm:w-auto'

  const secondaryCtaClass =
    'focus-ring inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary-200 bg-white px-6 py-3 text-lg font-semibold text-primary-700 shadow-sm transition-all duration-200 hover:bg-primary-50 active:scale-95 sm:w-auto'

  return (
    <>
      <Header />
      <Main aria-labelledby="hero-title">
        <section
          id="hero"
          className="relative overflow-hidden bg-gradient-hero py-20 text-white md:py-32"
          aria-labelledby="hero-title"
          suppressHydrationWarning
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 h-96 w-96 -mr-32 -mt-32 rounded-full bg-accent-500 opacity-20 blur-3xl mix-blend-multiply" />
            <div className="absolute bottom-0 left-0 h-96 w-96 -ml-32 -mb-32 rounded-full bg-primary-500 opacity-20 blur-3xl mix-blend-multiply" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="initial"
              animate="animate"
              variants={localStagger}
              className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]"
            >
              <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
                <motion.h1
                  id="hero-title"
                  variants={localFadeInUp}
                  className="hero-title text-5xl font-bold leading-tight md:text-7xl"
                >
                  Sua Melhor Viagem de Formatura Começa Aqui
                </motion.h1>

                <motion.p
                  variants={localFadeInUp}
                  className="hero-subtitle max-w-2xl text-xl text-white/90 md:text-2xl"
                >
                  Crie memórias inesquecíveis com FORMA+. Pacotes completos para Porto Seguro e Florianópolis.
                </motion.p>

                <motion.div
                  variants={localFadeInUp}
                  className="hero-buttons flex w-full flex-col gap-3 justify-center sm:flex-row sm:gap-4 lg:justify-start"
                >
                  <Link href="/roteiro" className={primaryCtaClass}>
                    Reservar agora
                    <ArrowRight size={20} />
                  </Link>
                  <Link href={rotaPacote()} className={secondaryCtaClass}>
                    Ver detalhes do pacote
                    <ArrowRight size={20} />
                  </Link>
                </motion.div>

                <motion.div variants={localFadeInUp} className="w-full sm:hidden">
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur">
                    <h3 className="mb-3 text-lg font-semibold text-white">Tudo pronto para a turma</h3>
                    <ul className="space-y-3 text-left">
                      {heroHighlights.map((item) => (
                        <li key={item.title} className="flex items-start gap-3 text-sm text-white/80">
                          <span className="mt-1 h-2 w-2 rounded-full bg-accent-300" aria-hidden="true" />
                          <div>
                            <span className="block font-semibold text-white">{item.title}</span>
                            <span className="text-white/80">{item.description}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

                <motion.div
                  variants={localFadeInUp}
                  className="mt-12 grid w-full max-w-3xl grid-cols-2 gap-4 border-t border-white/20 pt-10 sm:mt-16 sm:grid-cols-3 sm:gap-6 sm:pt-12"
                  aria-label="Estatísticas"
                >
                  <div className="text-left sm:text-center lg:text-left">
                    <div className="text-4xl font-bold">2+</div>
                    <div className="text-white/80">Destinos</div>
                  </div>
                  <div className="text-left sm:text-center lg:text-left">
                    <div className="text-4xl font-bold">1000+</div>
                    <div className="text-white/80">Clientes Felizes</div>
                  </div>
                  <div className="text-left sm:text-center lg:text-left sm:col-span-1">
                    <div className="flex items-center gap-2 text-4xl font-bold">
                      5.0
                      <Star size={26} className="text-yellow-400 fill-yellow-400" />
                    </div>
                    <div className="text-white/80">Avaliação</div>
                  </div>
                </motion.div>
              </div>

              <motion.aside variants={localFadeInUp} className="hidden w-full lg:flex" aria-label="Destaques do atendimento">
                <div className="w-full rounded-3xl border border-white/15 bg-white/10 p-8 shadow-xl backdrop-blur-lg">
                  <h3 className="mb-6 text-2xl font-semibold text-white">Diferenciais que acompanham a viagem</h3>
                  <ul className="space-y-5 text-white/80">
                    {heroHighlights.map((item) => (
                      <li key={item.title} className="flex items-start gap-4">
                        <span className="mt-1 h-3 w-3 rounded-full bg-accent-300" aria-hidden="true" />
                        <div>
                          <p className="text-lg font-semibold text-white">{item.title}</p>
                          <p className="text-sm leading-relaxed text-white/80">{item.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.aside>
            </motion.div>
          </div>
        </section>

        <section id="proximas-saidas" className="section bg-white cv-auto" aria-labelledby="saidas-title">
          <div className="container-wide">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-80px' }}
              variants={localStagger}
              className="mb-12 text-center md:text-left"
            >
              <motion.p
                variants={localFadeInUp}
                className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary-500"
              >
                Agenda 2025
              </motion.p>
              <motion.h2 id="saidas-title" variants={localFadeInUp} className="mb-4 text-4xl font-bold">
                Próximas saídas confirmadas
              </motion.h2>
              <motion.p variants={localFadeInUp} className="max-w-2xl text-slate-600">
                Garanta sua vaga nas turmas mais disputadas do ano. Atualizamos a agenda constantemente para você planejar com tranquilidade.
              </motion.p>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-80px' }}
              variants={localStagger}
              className="grid grid-cols-1 gap-6 lg:grid-cols-3 wc-transform wc-opacity"
            >
              {proximasSaidas.map((saida) => {
                const primaryHref = '/roteiro'

                return (
                  <motion.div key={saida.destino} variants={localFadeInUp}>
                    <Card interactive border gradient href={primaryHref} aria-label={`Reservar ${saida.destino}`}>
                      <div className="flex h-full flex-col gap-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <Badge variant={saida.status.variant}>{saida.status.label}</Badge>
                          <span className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                            {saida.periodo}
                          </span>
                        </div>

                        <div className="space-y-3">
                          <h3 className="text-2xl font-semibold text-slate-900">{saida.destino}</h3>
                          <p className="leading-relaxed text-slate-600">{saida.destaque}</p>
                        </div>

                        <dl className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-600">
                          <div className="flex items-center gap-2 font-semibold text-slate-900">
                            <Calendar size={18} className="text-primary-500" aria-hidden="true" />
                            <span>{saida.data}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users size={18} className="text-accent-500" aria-hidden="true" />
                            <span>{saida.vagas}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={18} className="text-slate-500" aria-hidden="true" />
                            <span>{saida.tempoRestante}</span>
                          </div>
                        </dl>

                        <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary-600 underline underline-offset-4">
                          {saida.cta}
                          <ArrowRight size={18} />
                        </span>
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* Seção "Destinos em Destaque" removida da Home conforme solicitação para evitar repetição */}

        <section id="depoimentos" className="section bg-slate-50" aria-labelledby="depo-title">
          <div className="container-wide">
            <motion.div initial="initial" whileInView="animate" viewport={{ once: true }} variants={localStagger}>
              <motion.h2 id="depo-title" variants={localFadeInUp} className="mb-12 text-center text-4xl font-bold">
                O que dizem os viajantes
              </motion.h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {depoimentos.map((d) => (
                  <motion.div key={d.nome} variants={localFadeInUp}>
                    <Card border>
                      <div className="mb-3 flex items-center gap-1">
                        {Array.from({ length: d.estrelas }).map((_, idx) => (
                          <Star key={idx} size={16} className="text-yellow-500 fill-yellow-500" />
                        ))}
                      </div>
                      <p className="mb-3 text-slate-700">“{d.texto}”</p>
                      <p className="text-sm text-slate-500">{d.nome}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <FaqSection
          id="faq"
          title="Perguntas Frequentes"
          subtitle="Clique nas perguntas para ver os detalhes. Estamos prontos para ajudar a turma em cada etapa da viagem."
          items={faqs}
        />

        <section
          id="newsletter"
          className="section bg-gradient-to-br from-slate-900 to-slate-950 text-white cv-auto"
          aria-labelledby="news-title"
        >
          <div className="container-wide">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={localStagger}
              className="text-center"
            >
              <motion.h2 id="news-title" variants={localFadeInUp} className="mb-4 text-3xl font-bold md:text-4xl">
                Receba ofertas e novidades
              </motion.h2>
              <motion.p variants={localFadeInUp} className="mx-auto mb-6 max-w-2xl text-white/80">
                Cadastre seu email e receba descontos exclusivos e novidades sobre os melhores pacotes.
              </motion.p>
              <motion.div variants={localFadeInUp} className="mx-auto max-w-xl">
                <form onSubmit={handleNewsletter} className="flex flex-col gap-3 sm:flex-row">
                  <Input type="email" name="email" required placeholder="Seu melhor email" className="flex-1 bg-white" />
                  <Button type="submit" variant="primary" className="whitespace-nowrap">
                    Quero receber
                  </Button>
                </form>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section id="por-que" className="section bg-gradient-to-br from-slate-50 to-white cv-auto" aria-labelledby="porque-title">
          <div className="container-wide">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={localStagger}
              className="mb-16 text-center"
            >
              <motion.h2 id="porque-title" variants={localFadeInUp} className="mb-4 text-4xl font-bold md:text-5xl">
                Por Que Escolher FORMA+?
              </motion.h2>
              <motion.p variants={localFadeInUp} className="mx-auto max-w-2xl text-xl text-slate-600">
                Oferecemos as melhores experiências com qualidade, segurança e preços imbatíveis.
              </motion.p>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={localStagger}
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 wc-transform wc-opacity"
            >
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <motion.div key={feature.title} variants={fadeInUp}>
                    <Card interactive gradient border>
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 rounded-lg bg-primary-100 p-3">
                          <Icon className="text-primary-600" size={24} />
                        </div>
                        <div>
                          <h3 className="mb-2 text-lg font-semibold text-slate-900">{feature.title}</h3>
                          <p className="text-sm text-slate-600">{feature.description}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>

        <section
          id="cta"
          className="section bg-gradient-to-br from-primary-700 via-primary-800 to-slate-950 text-white cv-auto"
          aria-labelledby="cta-title"
        >
          <div className="container-wide">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center"
            >
              <motion.h2 id="cta-title" variants={localFadeInUp} className="mb-4 text-4xl font-bold md:text-5xl">
                Pronto para dar o próximo passo?
              </motion.h2>
              <motion.p variants={localFadeInUp} className="mx-auto mb-12 max-w-2xl text-white/80">
                Escolha a melhor forma de continuar a jornada da sua turma. Estamos prontos para ajudar em cada etapa.
              </motion.p>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={localStagger}
            >
              <motion.div variants={localFadeInUp}>
                <NextStepsPanel steps={nextSteps} />
              </motion.div>
            </motion.div>
          </div>
        </section>
      </Main>
      <Footer />
    </>
  )
}
