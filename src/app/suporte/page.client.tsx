'use client'

import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Main from '@/components/Main'
import Card from '@/components/Card'
import { rotaContato } from '@/lib/links'
import { ArrowLeft, HelpCircle, ShieldCheck, ScrollText, Undo2 } from 'lucide-react'

const supportSections = [
  {
    id: 'faq',
    title: 'Perguntas Frequentes',
    description: 'Respostas imediatas para as dúvidas que mais recebemos dos representantes de turma.',
    icon: HelpCircle,
    topics: [
      {
        heading: 'Como funcionam as pré-reservas?',
        body: 'Escolha o roteiro, informe a quantidade estimada de participantes e nossa equipe retorna com as condições personalizadas antes da confirmação final.',
      },
      {
        heading: 'Posso alterar o pacote depois de confirmar?',
        body: 'Sim. Ajustes de hospedagem, passeios e formas de pagamento podem ser feitos até 60 dias antes da viagem, de acordo com disponibilidade.',
      },
      {
        heading: 'Quais são os canais oficiais de suporte?',
        body: 'Você pode falar com o time via telefone, WhatsApp, e-mail ou pelo formulário na página de contato. O atendimento responde em até um dia útil.',
      },
    ],
  },
  {
    id: 'privacidade',
    title: 'Políticas de Privacidade',
    description: 'Entenda como tratamos dados pessoais de representantes e estudantes durante todo o processo da formatura.',
    icon: ShieldCheck,
    topics: [
      {
        heading: 'Coleta e uso de dados',
        body: 'Os dados informados nos formulários são utilizados apenas para elaborar propostas, confirmar reservas e enviar comunicações sobre o roteiro escolhido.',
      },
      {
        heading: 'Armazenamento e segurança',
        body: 'Utilizamos provedores certificados e controles de acesso para proteger informações sensíveis. Seus dados são revisados e excluídos quando não são mais necessários.',
      },
      {
        heading: 'Seus direitos',
        body: 'Você pode solicitar a atualização ou exclusão dos dados a qualquer momento enviando um e-mail para suporte@viagemdeformatura.com.br.',
      },
    ],
  },
  {
    id: 'termos',
    title: 'Termos de Serviço',
    description: 'Regras claras para contratação, responsabilidades e compromissos da FORMA+ com a turma.',
    icon: ScrollText,
    topics: [
      {
        heading: 'Contratação dos serviços',
        body: 'O fechamento acontece após assinatura digital do contrato e pagamento da taxa de adesão. Todas as condições especiais ficam registradas no documento.',
      },
      {
        heading: 'Responsabilidades da equipe',
        body: 'Coordenamos fornecedores, monitoramos pagamentos e mantemos o time informado sobre cada etapa, garantindo transparência total.',
      },
      {
        heading: 'Participação da turma',
        body: 'Cada responsável deve cumprir prazos de confirmação, repasse de documentos e pagamentos para manter o roteiro ativo.',
      },
    ],
  },
  {
    id: 'cancelamentos',
    title: 'Cancelamentos',
    description: 'Procedimentos para desistências individuais ou cancelamento do grupo, com prazos e reembolsos.',
    icon: Undo2,
    topics: [
      {
        heading: 'Prazos para cancelamento parcial',
        body: 'Desistências individuais até 90 dias antes da viagem garantem reembolso integral menos taxas administrativas do operador.',
      },
      {
        heading: 'Cancelamento do grupo',
        body: 'Para cancelar o roteiro completo, entre em contato com nosso atendimento. Avaliamos multas contratadas com hotéis e serviços já confirmados.',
      },
      {
        heading: 'Transferência de vaga',
        body: 'Caso um estudante desista, é possível transferir a vaga para outro integrante aprovado pela turma até 30 dias antes do embarque.',
      },
    ],
  },
] as const

export default function SuportePageClient() {
  return (
    <>
      <Header />
      <Main className="bg-slate-950/5">
        <section className="section bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
          <div className="container-wide space-y-8">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white focus-ring">
              <ArrowLeft size={16} /> Voltar para a página inicial
            </Link>
            <div className="max-w-3xl space-y-4">
              <h1 className="text-4xl font-bold md:text-5xl">Central de Suporte</h1>
              <p className="text-white/80 text-lg">
                Reunimos as principais políticas, dúvidas frequentes e orientações sobre cancelamentos em um único lugar.
                Use o índice abaixo ou role a página para encontrar o tema que precisa.
              </p>
              <div className="flex flex-wrap gap-3">
                {supportSections.map((section) => (
                  <Link
                    key={section.id}
                    href={`#${section.id}`}
                    className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
                  >
                    <section.icon size={16} aria-hidden />
                    {section.title}
                  </Link>
                ))}
              </div>
            </div>
            <Card className="bg-white/10 p-6 text-white" border>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Precisa de atendimento humano?</h2>
                  <p className="text-white/80 text-sm md:text-base">
                    Nossa equipe responde em até um dia útil pelos canais oficiais. Tenha o número da turma em mãos para agilizar o suporte.
                  </p>
                </div>
                <Link
                  href={rotaContato}
                  className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg border border-white/40 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-white/90"
                >
                  Falar com o atendimento
                </Link>
              </div>
            </Card>
          </div>
        </section>

        <section className="section">
          <div className="container-wide space-y-12">
            {supportSections.map((section) => (
              <article key={section.id} id={section.id} className="scroll-mt-32 space-y-6">
                <header className="flex items-start gap-4">
                  <div className="rounded-xl bg-primary-100 p-3 text-primary-700">
                    <section.icon size={24} aria-hidden />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">{section.title}</h2>
                    <p className="text-slate-600 md:text-lg">{section.description}</p>
                  </div>
                </header>

                <div className="grid gap-4 md:grid-cols-2">
                  {section.topics.map((topic) => (
                    <Card key={topic.heading} className="h-full border border-slate-200" gradient>
                      <h3 className="text-lg font-semibold text-slate-900">{topic.heading}</h3>
                      <p className="mt-2 text-sm text-slate-600 md:text-base">{topic.body}</p>
                    </Card>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </Main>
      <Footer />
    </>
  )
}
