'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Main from '@/components/Main'
import Card from '@/components/Card'
import Input from '@/components/Input'
import Button from '@/components/Button'
import { roteiroDetalhes, type RoteiroDetalhe } from '@/lib/roteiroDetalhes'
import { useAuth } from '@/contexts/AuthContext'
import { httpClient } from '@/lib/httpClient'
import { rotaPerfil } from '@/lib/links'

const defaultFormState = {
  responsibleName: '',
  responsibleEmail: '',
  responsiblePhone: '',
  responsibleDocument: '',
  responsibleRole: '',
  organizationName: '',
  organizationType: '',
  organizationCity: '',
  organizationState: '',
  className: '',
  classYear: '',
  studentsCount: '',
  chaperonesCount: '',
  ageRange: '',
  destinationPrimary: '',
  destinationAlternative: '',
  tripStart: '',
  tripEnd: '',
  tripDuration: '',
  budgetPerStudent: '',
  accommodationPreference: '',
  roomDistribution: '',
  mealPlan: '',
  transportPreference: '',
  departureCity: '',
  paymentPreference: '',
  additionalServices: '',
  accessibilityNeeds: '',
  healthRestrictions: '',
  comments: '',
}

type ReservationFormKeys = keyof typeof defaultFormState

type StatusState = null | { type: 'success' | 'error'; title: string; message: string }

const toISODate = (value: string) => {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!match) return ''
  const [, day, month, year] = match
  return `${year}-${month}-${day}`
}

const buildPrefillFromRoteiro = (detalhe: RoteiroDetalhe) => {
  const isoStart = detalhe.saida ? toISODate(detalhe.saida) : ''
  const isoEnd = detalhe.chegada ? toISODate(detalhe.chegada) : ''

  return {
    destinationPrimary: detalhe.nome,
    tripStart: isoStart,
    tripEnd: isoEnd,
    tripDuration: detalhe.dias ? `${detalhe.dias} ${detalhe.dias === 1 ? 'dia' : 'dias'}` : '',
    accommodationPreference: detalhe.hospedagem,
    transportPreference: detalhe.locomocao ?? 'Logística definida pela FORMA+',
    budgetPerStudent: detalhe.valor,
  } satisfies Partial<typeof defaultFormState>
}

const createFormState = (prefill?: Partial<typeof defaultFormState>) => ({
  ...defaultFormState,
  ...(prefill ?? {}),
})

const LOCKED_BY_ROTEIRO_FIELDS = [
  'destinationPrimary',
  'tripStart',
  'tripEnd',
  'tripDuration',
  'accommodationPreference',
  'transportPreference',
  'budgetPerStudent',
] as const

type LockedFieldKey = (typeof LOCKED_BY_ROTEIRO_FIELDS)[number]

export default function ReservaPageClient() {
  const searchParams = useSearchParams()
  const roteiroSlugParam = searchParams.get('roteiro') ?? searchParams.get('slug')
  const { isAuthenticated } = useAuth()

  const selectedRoteiro = useMemo(() => {
    if (!roteiroSlugParam) return null
    return roteiroDetalhes.find((detalhe) => detalhe.slug === roteiroSlugParam) ?? null
  }, [roteiroSlugParam])

  const roteiroPrefill = useMemo(() => {
    if (!selectedRoteiro) return null
    return buildPrefillFromRoteiro(selectedRoteiro)
  }, [selectedRoteiro])

  const lockedFields = useMemo(() => {
    if (!roteiroPrefill) return new Set<ReservationFormKeys>()

    const fields = LOCKED_BY_ROTEIRO_FIELDS.filter((field) => {
      const candidate = roteiroPrefill[field]
      if (typeof candidate === 'string') {
        return candidate.trim().length > 0
      }
      return candidate !== undefined && candidate !== null
    })

    return new Set<ReservationFormKeys>(fields)
  }, [roteiroPrefill])

  const [formData, setFormData] = useState(() => createFormState(roteiroPrefill ?? undefined))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<StatusState>(null)

  useEffect(() => {
    if (roteiroPrefill) {
      setFormData((prev) => ({
        ...prev,
        ...roteiroPrefill,
      }))
      return
    }

    setFormData((prev) => ({
      ...prev,
      destinationPrimary: '',
      tripStart: '',
      tripEnd: '',
      tripDuration: '',
      accommodationPreference: '',
      transportPreference: '',
      budgetPerStudent: '',
    }))
  }, [roteiroPrefill])

  const handleChange = (field: ReservationFormKeys, value: string) => {
    if (lockedFields.has(field)) return
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isAuthenticated) {
      setStatus({
        type: 'error',
        title: 'Faça login para continuar',
        message: 'Entre com sua conta FORMA+ para enviar a solicitação e acompanhar o histórico no seu perfil.',
      })
      return
    }

    setIsSubmitting(true)
    setStatus(null)

    try {
      const payload: { form: typeof formData; slug?: string } = {
        form: formData,
      }

      if (selectedRoteiro?.slug) {
        payload.slug = selectedRoteiro.slug
      }

      const response = await httpClient('/reservations', {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      if (response.status === 401) {
        setStatus({
          type: 'error',
          title: 'Sessão expirada',
          message: 'Faça login novamente para finalizar a solicitação de reserva.',
        })
        return
      }

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null)
        setStatus({
          type: 'error',
          title: 'Não foi possível enviar agora',
          message:
            errorBody?.error === 'Invalid reservation payload'
              ? 'Revise os campos obrigatórios e tente novamente.'
              : 'Tente novamente em instantes ou fale conosco pelo canal de atendimento.',
        })
        return
      }

      await response.json()
      setStatus({
        type: 'success',
        title: 'Solicitação enviada!',
        message: 'Recebemos os dados da sua turma. Consulte o histórico no seu perfil para iniciar o pagamento quando estiver pronto.',
      })
      setFormData(createFormState(roteiroPrefill ?? undefined))
    } catch (error) {
      console.error('Erro ao enviar solicitação de reserva', error)
      setStatus({
        type: 'error',
        title: 'Não foi possível enviar agora',
        message: 'Tente novamente em instantes ou fale conosco pelo canal de atendimento.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFieldLocked = (field: ReservationFormKeys) => lockedFields.has(field)

  const lockedHelper = (field: ReservationFormKeys) => {
    if (!isFieldLocked(field)) return undefined
    if (!selectedRoteiro) return 'Definido pelo roteiro selecionado.'

    switch (field) {
      case 'destinationPrimary':
        return `Roteiro selecionado: ${selectedRoteiro.nome}`
      case 'tripStart':
        return `Saída prevista: ${selectedRoteiro.saida}`
      case 'tripEnd':
        return `Retorno previsto: ${selectedRoteiro.chegada}`
      case 'tripDuration':
        return `${selectedRoteiro.dias} ${selectedRoteiro.dias === 1 ? 'dia' : 'dias'} programados`
      case 'accommodationPreference':
        return 'Hospedagem sugerida pelo roteiro. Solicite ajustes nas observações, se necessário.'
      case 'transportPreference':
        return selectedRoteiro.locomocao
          ? 'Logística prevista no roteiro. Informe-nos se precisar alterar o modal de transporte.'
          : 'Logística definida em conjunto com nossa equipe.'
      case 'budgetPerStudent':
        return `Valor de referência por aluno: ${selectedRoteiro.valor}`
      default:
        return 'Definido pelo roteiro selecionado.'
    }
  }

  const lockedInputProps = (field: ReservationFormKeys) => {
    const helper = lockedHelper(field)
    if (!isFieldLocked(field)) {
      return helper ? { helperText: helper } : {}
    }

    return {
      disabled: true,
      tabIndex: -1,
      helperText: helper,
      className: 'bg-slate-100 text-slate-600 cursor-not-allowed focus:ring-0 focus:border-slate-200',
    }
  }

  return (
    <>
      <Header />
      <Main className="bg-slate-50 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <span className="mb-3 inline-flex items-center rounded-full border border-primary-200 bg-white px-3 py-1 text-sm font-semibold text-primary-700 shadow-sm">
              Formulário de Reserva Completa
            </span>
            <h1 className="text-4xl font-bold text-slate-900">Envie os dados da sua turma</h1>
            <p className="mt-4 text-base text-slate-600">
              Preencha o formulário com as informações essenciais para elaborarmos o orçamento personalizado da sua viagem de formatura.
            </p>
          </div>

          {selectedRoteiro && (
            <Card border className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-primary-700">Roteiro selecionado</p>
                <h2 className="text-2xl font-bold text-slate-900">{selectedRoteiro.nome}</h2>
                <p className="text-sm text-slate-600">
                  Saída {selectedRoteiro.saida} · {selectedRoteiro.dias}{' '}
                  {selectedRoteiro.dias === 1 ? 'dia programado' : 'dias programados'} · Retorno {selectedRoteiro.chegada}
                </p>
              </div>
              <div className="text-sm text-slate-600">
                <p className="font-semibold text-slate-900">Principais inclusões</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {selectedRoteiro.incluso.slice(0, 3).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {selectedRoteiro.incluso.length > 3 && (
                  <p className="mt-1 text-xs text-slate-500">
                    + {selectedRoteiro.incluso.length - 3} itens complementares
                  </p>
                )}
              </div>
            </Card>
          )}

          <div className="mb-8 grid gap-6 md:grid-cols-2">
            <Card border className="h-full space-y-3">
              <h2 className="text-lg font-semibold text-slate-900">O que coletamos?</h2>
              <p className="text-sm text-slate-600">
                Solicitamos dados administrativos, logísticos e financeiros para desenhar a proposta completa e adiantar aprovações com fornecedores.
              </p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
                <li>Responsável pelo contato e instituição</li>
                <li>Perfil da turma e quantidade de participantes</li>
                <li>Preferências de destino, hospedagem e transporte</li>
                <li>Necessidades especiais, adicionais e orçamento alvo</li>
              </ul>
            </Card>
            <Card border className="h-full space-y-3">
              <h2 className="text-lg font-semibold text-slate-900">Por que pedir tudo agora?</h2>
              <p className="text-sm text-slate-600">
                Com todas as informações em mãos conseguimos reservar bloqueios de vagas, negociar condições especiais e garantir que nenhuma exigência da sua turma fique de fora.
              </p>
              <p className="text-sm text-slate-600">
                Caso não tenha alguma informação ainda, deixe um comentário na seção final para alinharmos juntos.
              </p>
            </Card>
          </div>

          {status && (
            <div
              className={`mb-8 flex items-start gap-3 rounded-xl border px-5 py-4 shadow-sm sm:items-center ${
                status.type === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-rose-200 bg-rose-50 text-rose-700'
              }`}
            >
              {status.type === 'success' ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
              )}
              <div>
                <p className="font-semibold">{status.title}</p>
                <p className="text-sm">{status.message}</p>
                {status.type === 'success' && (
                  <p className="mt-2 text-sm">
                    <Link href={rotaPerfil} className="font-semibold text-primary-700 underline-offset-4 hover:underline">
                      Ir para o perfil e acompanhar o histórico
                    </Link>
                  </p>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <Card border className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Responsável pelo contato</h2>
                <p className="text-sm text-slate-600">Quem será o ponto focal para tratativas e assinatura de contrato.</p>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Nome completo"
                  id="responsibleName"
                  name="responsibleName"
                  value={formData.responsibleName}
                  onChange={(event) => handleChange('responsibleName', event.target.value)}
                  required
                />
                <Input
                  label="Cargo / vínculo"
                  id="responsibleRole"
                  name="responsibleRole"
                  value={formData.responsibleRole}
                  onChange={(event) => handleChange('responsibleRole', event.target.value)}
                  placeholder="Coordenador, representante da turma, responsável financeiro..."
                  required
                />
                <Input
                  label="Email corporativo"
                  id="responsibleEmail"
                  name="responsibleEmail"
                  type="email"
                  value={formData.responsibleEmail}
                  onChange={(event) => handleChange('responsibleEmail', event.target.value)}
                  required
                />
                <Input
                  label="Telefone / WhatsApp"
                  id="responsiblePhone"
                  name="responsiblePhone"
                  value={formData.responsiblePhone}
                  onChange={(event) => handleChange('responsiblePhone', event.target.value)}
                  placeholder="(00) 00000-0000"
                  required
                />
                <Input
                  label="Documento do responsável"
                  id="responsibleDocument"
                  name="responsibleDocument"
                  value={formData.responsibleDocument}
                  onChange={(event) => handleChange('responsibleDocument', event.target.value)}
                  placeholder="CPF ou RG"
                />
              </div>
            </Card>

            <Card border className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Informações da instituição</h2>
                <p className="text-sm text-slate-600">Detalhes para cadastro comercial e faturamento.</p>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Nome da escola / instituição"
                  id="organizationName"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={(event) => handleChange('organizationName', event.target.value)}
                  required
                />
                <div>
                  <label htmlFor="organizationType" className="mb-2 block text-sm font-medium text-slate-700">
                    Tipo de instituição
                  </label>
                  <select
                    id="organizationType"
                    name="organizationType"
                    value={formData.organizationType}
                    onChange={(event) => handleChange('organizationType', event.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Selecione</option>
                    <option value="Escola Pública">Escola Pública</option>
                    <option value="Escola Particular">Escola Particular</option>
                    <option value="Curso Técnico">Curso Técnico</option>
                    <option value="Universidade">Universidade</option>
                    <option value="Curso Preparatório">Curso Preparatório</option>
                    <option value="Outra">Outra</option>
                  </select>
                </div>
                <Input
                  label="Cidade"
                  id="organizationCity"
                  name="organizationCity"
                  value={formData.organizationCity}
                  onChange={(event) => handleChange('organizationCity', event.target.value)}
                  required
                />
                <Input
                  label="Estado"
                  id="organizationState"
                  name="organizationState"
                  value={formData.organizationState}
                  onChange={(event) => handleChange('organizationState', event.target.value)}
                  placeholder="UF"
                  required
                />
              </div>
            </Card>

            <Card border className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Perfil da turma</h2>
                <p className="text-sm text-slate-600">Esses dados definem acomodação, roteiros e seguros obrigatórios.</p>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Nome da turma / curso"
                  id="className"
                  name="className"
                  value={formData.className}
                  onChange={(event) => handleChange('className', event.target.value)}
                  placeholder="3º ano A, Engenharia de Produção..."
                  required
                />
                <Input
                  label="Ano de formatura"
                  id="classYear"
                  name="classYear"
                  value={formData.classYear}
                  onChange={(event) => handleChange('classYear', event.target.value)}
                  placeholder="2025"
                  required
                />
                <Input
                  label="Quantidade estimada de alunos"
                  id="studentsCount"
                  name="studentsCount"
                  type="number"
                  min={0}
                  value={formData.studentsCount}
                  onChange={(event) => handleChange('studentsCount', event.target.value)}
                  required
                />
                <Input
                  label="Quantidade estimada de acompanhantes"
                  id="chaperonesCount"
                  name="chaperonesCount"
                  type="number"
                  min={0}
                  value={formData.chaperonesCount}
                  onChange={(event) => handleChange('chaperonesCount', event.target.value)}
                  placeholder="Professores, pais, coordenação"
                />
                <Input
                  label="Faixa etária predominante"
                  id="ageRange"
                  name="ageRange"
                  value={formData.ageRange}
                  onChange={(event) => handleChange('ageRange', event.target.value)}
                  placeholder="17-18 anos"
                />
              </div>
            </Card>

            <Card border className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Detalhes da viagem</h2>
                <p className="text-sm text-slate-600">
                  Preferências que impactam bloqueio de vagas, reserva de transporte e orçamento. Os campos destacados em cinza já vêm definidos pelo roteiro escolhido, mas podem ser ajustados posteriormente com nossa equipe.
                </p>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Destino principal desejado"
                  id="destinationPrimary"
                  name="destinationPrimary"
                  value={formData.destinationPrimary}
                  onChange={(event) => handleChange('destinationPrimary', event.target.value)}
                  placeholder="Ex.: Porto Seguro"
                  required
                  {...lockedInputProps('destinationPrimary')}
                />
                <Input
                  label="Destinos alternativos (opcional)"
                  id="destinationAlternative"
                  name="destinationAlternative"
                  value={formData.destinationAlternative}
                  onChange={(event) => handleChange('destinationAlternative', event.target.value)}
                  placeholder="Ex.: Florianópolis, Cancún"
                />
                <Input
                  label="Data prevista de saída"
                  id="tripStart"
                  name="tripStart"
                  type="date"
                  value={formData.tripStart}
                  onChange={(event) => handleChange('tripStart', event.target.value)}
                  {...lockedInputProps('tripStart')}
                />
                <Input
                  label="Data prevista de retorno"
                  id="tripEnd"
                  name="tripEnd"
                  type="date"
                  value={formData.tripEnd}
                  onChange={(event) => handleChange('tripEnd', event.target.value)}
                  {...lockedInputProps('tripEnd')}
                />
                <Input
                  label="Duração desejada"
                  id="tripDuration"
                  name="tripDuration"
                  value={formData.tripDuration}
                  onChange={(event) => handleChange('tripDuration', event.target.value)}
                  placeholder="Ex.: 5 dias e 4 noites"
                  {...lockedInputProps('tripDuration')}
                />
                <Input
                  label="Orçamento estimado por aluno"
                  id="budgetPerStudent"
                  name="budgetPerStudent"
                  value={formData.budgetPerStudent}
                  onChange={(event) => handleChange('budgetPerStudent', event.target.value)}
                  placeholder="R$ 2.500"
                  {...lockedInputProps('budgetPerStudent')}
                />
                <Input
                  label="Tipo de hospedagem preferida"
                  id="accommodationPreference"
                  name="accommodationPreference"
                  value={formData.accommodationPreference}
                  onChange={(event) => handleChange('accommodationPreference', event.target.value)}
                  placeholder="Resort all inclusive, hotel 4 estrelas..."
                  {...lockedInputProps('accommodationPreference')}
                />
                <Input
                  label="Distribuição de quartos"
                  id="roomDistribution"
                  name="roomDistribution"
                  value={formData.roomDistribution}
                  onChange={(event) => handleChange('roomDistribution', event.target.value)}
                  placeholder="Quartos quádruplos, triplos, duplos"
                />
                <Input
                  label="Regime de alimentação"
                  id="mealPlan"
                  name="mealPlan"
                  value={formData.mealPlan}
                  onChange={(event) => handleChange('mealPlan', event.target.value)}
                  placeholder="Café da manhã, meia pensão, all inclusive"
                />
                <Input
                  label="Tipo de transporte desejado"
                  id="transportPreference"
                  name="transportPreference"
                  value={formData.transportPreference}
                  onChange={(event) => handleChange('transportPreference', event.target.value)}
                  placeholder="Aéreo, rodoviário, misto"
                  {...lockedInputProps('transportPreference')}
                />
                <Input
                  label="Cidade / estado de embarque"
                  id="departureCity"
                  name="departureCity"
                  value={formData.departureCity}
                  onChange={(event) => handleChange('departureCity', event.target.value)}
                  placeholder="São Paulo - SP"
                />
                <Input
                  label="Preferência de pagamento"
                  id="paymentPreference"
                  name="paymentPreference"
                  value={formData.paymentPreference}
                  onChange={(event) => handleChange('paymentPreference', event.target.value)}
                  placeholder="À vista, parcelado em 10x, boleto, PIX"
                />
              </div>
            </Card>

            <Card border className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Serviços adicionais e observações</h2>
                <p className="text-sm text-slate-600">Conte o que não pode faltar para a viagem ser perfeita.</p>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label htmlFor="additionalServices" className="mb-2 block text-sm font-medium text-slate-700">
                    Atividades e serviços adicionais desejados
                  </label>
                  <textarea
                    id="additionalServices"
                    name="additionalServices"
                    value={formData.additionalServices}
                    onChange={(event) => handleChange('additionalServices', event.target.value)}
                    placeholder="Festas exclusivas, passeios opcionais, fotógrafo, open bar, seguros..."
                    rows={4}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="accessibilityNeeds" className="mb-2 block text-sm font-medium text-slate-700">
                    Necessidades de acessibilidade
                  </label>
                  <textarea
                    id="accessibilityNeeds"
                    name="accessibilityNeeds"
                    value={formData.accessibilityNeeds}
                    onChange={(event) => handleChange('accessibilityNeeds', event.target.value)}
                    placeholder="Rampas, quartos adaptados, suporte para mobilidade..."
                    rows={4}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="healthRestrictions" className="mb-2 block text-sm font-medium text-slate-700">
                    Restrições de saúde ou alimentação
                  </label>
                  <textarea
                    id="healthRestrictions"
                    name="healthRestrictions"
                    value={formData.healthRestrictions}
                    onChange={(event) => handleChange('healthRestrictions', event.target.value)}
                    placeholder="Alergias, restrições alimentares, medicamentos controlados..."
                    rows={4}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="comments" className="mb-2 block text-sm font-medium text-slate-700">
                    Observações gerais
                  </label>
                  <textarea
                    id="comments"
                    name="comments"
                    value={formData.comments}
                    onChange={(event) => handleChange('comments', event.target.value)}
                    placeholder="Compartilhe expectativas, prazos internos, aprovações necessárias ou qualquer detalhe relevante."
                    rows={4}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </Card>

            <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-primary-100 bg-white px-6 py-5 text-center shadow-sm sm:flex-row sm:text-left">
              <div>
                <p className="text-base font-semibold text-slate-900">Revise os dados antes de enviar</p>
                <p className="text-sm text-slate-600">Você receberá uma cópia por email assim que a solicitação for processada pela equipe.</p>
              </div>
              <Button type="submit" size="lg" variant="primary" isLoading={isSubmitting}>
                Enviar solicitação completa
              </Button>
            </div>
          </form>
        </div>
      </Main>
      <Footer />
    </>
  )
}
