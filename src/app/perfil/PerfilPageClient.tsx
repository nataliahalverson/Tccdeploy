'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Main from '@/components/Main'
import Breadcrumbs from '@/components/Breadcrumbs'
import Card from '@/components/Card'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Badge from '@/components/Badge'
import Modal from '@/components/Modal'
import { useAuth } from '@/contexts/AuthContext'
import { httpClient } from '@/lib/httpClient'
import { rotaContato, rotaPacote, rotaReservaCompleta } from '@/lib/links'
import { Mail, Hash, UserCircle2, ShieldCheck, Compass, LogOut, ClipboardList, CreditCard, Receipt, QrCode } from 'lucide-react'

type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'PAID' | 'CANCELLED'
type PaymentMethod = 'PIX' | 'CREDIT_CARD' | 'BOLETO'

type PaymentSummary = {
  id: string
  method: PaymentMethod
  amount: number | null
  currency: string
  status: string
  paidAt: string
  receiptCode: string
  details: Record<string, unknown>
  createdAt: string
}

type ReservationSummary = {
  id: string
  slug: string | null
  status: ReservationStatus
  destination: string | null
  tripStart: string | null
  tripEnd: string | null
  tripDuration: string | null
  budget: string | null
  createdAt: string
  updatedAt: string
  payments: PaymentSummary[]
}

type ReceiptData = {
  reservationId: string
  receiptCode: string
  destination: string | null
  method: PaymentMethod
  amount: number | null
  currency: string
  paidAt: string
  details: Record<string, unknown>
  status: string
}

const paymentMethodLabels: Record<PaymentMethod, string> = {
  PIX: 'PIX',
  CREDIT_CARD: 'Cartão de crédito',
  BOLETO: 'Boleto bancário',
}

const formatDate = (iso: string | null) => {
  if (!iso) return 'Não informado'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'Não informado'
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(date)
}

const formatDateTime = (iso: string) => {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const formatCurrency = (value: number | null, currency = 'BRL') => {
  if (value === null || !Number.isFinite(value)) return '—'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value)
}

const parseAmountInput = (input: string) => {
  const normalized = input.replace(/[^0-9,.-]/g, '').replace(/\.(?=\d{3})/g, '').replace(',', '.')
  const amount = Number(normalized)
  return Number.isFinite(amount) ? Number(amount.toFixed(2)) : NaN
}

const extractAmountFromBudget = (budget?: string | null) => {
  if (!budget) return ''
  const normalized = budget.replace(/[^0-9,.-]/g, '').replace(/\.(?=\d{3})/g, '').replace(',', '.')
  const amount = Number(normalized)
  if (!Number.isFinite(amount)) return ''
  return amount.toFixed(2)
}

const mapPaymentFromApi = (payment: any): PaymentSummary => ({
  id: payment.id,
  method: payment.method as PaymentMethod,
  amount:
    typeof payment.amount === 'number'
      ? payment.amount
      : payment.amount !== null && payment.amount !== undefined
        ? Number(payment.amount)
        : null,
  currency: payment.currency ?? 'BRL',
  status: payment.status ?? 'CONFIRMED',
  paidAt: payment.paidAt,
  receiptCode: payment.receiptCode,
  details: payment.details ?? {},
  createdAt: payment.createdAt,
})

const mapReservationFromApi = (reservation: any): ReservationSummary => ({
  id: reservation.id,
  slug: reservation.slug ?? null,
  status: reservation.status as ReservationStatus,
  destination: reservation.destination ?? null,
  tripStart: reservation.tripStart ?? null,
  tripEnd: reservation.tripEnd ?? null,
  tripDuration: reservation.tripDuration ?? null,
  budget: reservation.budget ?? null,
  createdAt: reservation.createdAt,
  updatedAt: reservation.updatedAt,
  payments: Array.isArray(reservation.payments)
    ? reservation.payments.map(mapPaymentFromApi)
    : [],
})

const reservationStatusConfig: Record<ReservationStatus, { label: string; variant: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' }> = {
  PENDING: { label: 'Aguardando pagamento', variant: 'warning' },
  CONFIRMED: { label: 'Confirmado', variant: 'accent' },
  PAID: { label: 'Pago', variant: 'success' },
  CANCELLED: { label: 'Cancelado', variant: 'danger' },
}

export default function PerfilPageClient() {
  const { user, loading, logout } = useAuth()

  const [reservations, setReservations] = useState<ReservationSummary[]>([])
  const [reservationsLoading, setReservationsLoading] = useState(false)
  const [reservationsError, setReservationsError] = useState<string | null>(null)

  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState<ReservationSummary | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('')
  const [paymentFields, setPaymentFields] = useState<Record<string, string>>({})
  const [paymentSubmitting, setPaymentSubmitting] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  const [receiptModalOpen, setReceiptModalOpen] = useState(false)
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null)
  const [receiptError, setReceiptError] = useState<string | null>(null)

  const closeReceiptModal = () => {
    setReceiptModalOpen(false)
    setReceiptData(null)
    setReceiptError(null)
  }

  const firstName = user?.name?.split(' ')[0] ?? 'viajante'

  useEffect(() => {
    if (!user) {
      setReservations([])
      return
    }

    const fetchReservations = async () => {
      setReservationsLoading(true)
      setReservationsError(null)
      try {
        const response = await httpClient('/reservations/me', { method: 'GET' })
        if (response.status === 401) {
          setReservations([])
          return
        }
        if (!response.ok) {
          throw new Error(`Failed to load reservations: ${response.status}`)
        }
        const data = await response.json()
        const mapped = Array.isArray(data.reservations)
          ? (data.reservations as any[]).map(mapReservationFromApi)
          : []
        setReservations(mapped)
      } catch (error) {
        console.error('Erro ao carregar histórico de solicitações', error)
        setReservationsError('Não foi possível carregar seu histórico. Tente novamente mais tarde.')
      } finally {
        setReservationsLoading(false)
      }
    }

    fetchReservations()
  }, [user])

  const resetPaymentState = () => {
    setPaymentMethod('')
    setPaymentFields({})
    setPaymentError(null)
    setPaymentSubmitting(false)
  }

  const openPaymentModal = (reservation: ReservationSummary) => {
    setSelectedReservation(reservation)
    resetPaymentState()
    setPaymentModalOpen(true)
  }

  const closePaymentModal = () => {
    setPaymentModalOpen(false)
    resetPaymentState()
    setSelectedReservation(null)
  }

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method)
    setPaymentError(null)
    const defaultAmount = extractAmountFromBudget(selectedReservation?.budget)

    switch (method) {
      case 'PIX':
        setPaymentFields({
          amount: defaultAmount,
          payerName: user?.name ?? '',
          payerDocument: '',
          pixKey: '',
          notes: '',
        })
        break
      case 'CREDIT_CARD':
        setPaymentFields({
          amount: defaultAmount,
          cardHolder: user?.name ?? '',
          cardNumber: '',
          expiry: '',
          cvv: '',
          installments: '1',
        })
        break
      case 'BOLETO':
        setPaymentFields({
          amount: defaultAmount,
          payerName: user?.name ?? '',
          payerDocument: '',
          boletoNumber: '',
          bank: '',
        })
        break
      default:
        setPaymentFields({})
    }
  }

  const handlePaymentFieldChange = (field: string, value: string) => {
    setPaymentFields((prev) => ({ ...prev, [field]: value }))
  }

  const upsertReservation = (next: ReservationSummary) => {
    setReservations((prev) => {
      const index = prev.findIndex((reservation) => reservation.id === next.id)
      if (index === -1) {
        return [next, ...prev]
      }
      const clone = [...prev]
      clone[index] = next
      return clone
    })
  }

  const handlePaymentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedReservation || !paymentMethod) {
      setPaymentError('Selecione um método de pagamento.')
      return
    }

    const amountNumber = parseAmountInput(paymentFields.amount ?? '')
    if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
      setPaymentError('Informe um valor válido para o pagamento.')
      return
    }

    const body: Record<string, unknown> = {
      method: paymentMethod,
      amount: amountNumber,
    }

    try {
      setPaymentSubmitting(true)
      setPaymentError(null)

      if (paymentMethod === 'PIX') {
        body.payerName = paymentFields.payerName ?? ''
        body.payerDocument = paymentFields.payerDocument ?? ''
        body.pixKey = paymentFields.pixKey ?? ''
        if (paymentFields.notes) {
          body.notes = paymentFields.notes
        }
      } else if (paymentMethod === 'CREDIT_CARD') {
        body.cardHolder = paymentFields.cardHolder ?? ''
        body.cardNumber = paymentFields.cardNumber ?? ''
        body.expiry = paymentFields.expiry ?? ''
        body.cvv = paymentFields.cvv ?? ''
        body.installments = paymentFields.installments ? Number(paymentFields.installments) : 1
      } else if (paymentMethod === 'BOLETO') {
        body.payerName = paymentFields.payerName ?? ''
        body.payerDocument = paymentFields.payerDocument ?? ''
        body.boletoNumber = paymentFields.boletoNumber ?? ''
        if (paymentFields.bank) {
          body.bank = paymentFields.bank
        }
      }

      const response = await httpClient(`/reservations/${selectedReservation.id}/payments`, {
        method: 'POST',
        body: JSON.stringify(body),
      })

      if (response.status === 401) {
        setPaymentError('Sua sessão expirou. Faça login novamente e tente concluir o pagamento.')
        return
      }

      const payload = await response.json().catch(() => null)

      if (!response.ok || !payload) {
        const message = payload?.error ?? 'Não foi possível registrar o pagamento. Tente novamente.'
        setPaymentError(message)
        return
      }

      const updatedReservation = mapReservationFromApi(payload.reservation)
      upsertReservation(updatedReservation)

      if (payload.receipt) {
        setReceiptData(payload.receipt as ReceiptData)
        setReceiptModalOpen(true)
      }

      closePaymentModal()
    } catch (error) {
      console.error('Erro ao registrar pagamento', error)
      setPaymentError('Não foi possível processar o pagamento agora. Tente novamente mais tarde.')
    } finally {
      setPaymentSubmitting(false)
    }
  }

  const handleOpenReceipt = async (reservationId: string) => {
    try {
      setReceiptError(null)
      const response = await httpClient(`/reservations/${reservationId}/receipt`, { method: 'GET' })
      if (response.status === 401) {
        setReceiptData(null)
        setReceiptModalOpen(false)
        return
      }
      if (!response.ok) {
        throw new Error(`Receipt request failed: ${response.status}`)
      }

      const data = await response.json()
      if (data?.receipt) {
        setReceiptData(data.receipt as ReceiptData)
        setReceiptModalOpen(true)
      }
    } catch (error) {
      console.error('Erro ao carregar comprovante', error)
      setReceiptData(null)
      setReceiptError('Não foi possível carregar o comprovante agora. Tente novamente mais tarde.')
      setReceiptModalOpen(true)
    }
  }

  return (
    <>
      <Header />
      <Main>
        <section className="section" aria-labelledby="perfil-title">
          <div className="container-wide space-y-8">
            <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Perfil' }]} />

            {loading ? (
              <div className="space-y-6" aria-live="polite" aria-busy>
                <div className="h-44 rounded-3xl bg-slate-200/70 animate-pulse" />
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  <div className="h-64 rounded-2xl bg-slate-200/70 animate-pulse lg:col-span-2" />
                  <div className="h-64 rounded-2xl bg-slate-200/70 animate-pulse" />
                </div>
              </div>
            ) : !user ? (
              <Card border className="max-w-xl">
                <h1 id="perfil-title" className="mb-3 text-3xl font-bold text-slate-900">
                  Faça login para acessar o perfil
                </h1>
                <p className="mb-6 text-slate-600">
                  Você precisa estar autenticado para visualizar seus dados. Clique no botão abaixo para acessar sua
                  conta e continuar navegando.
                </p>
                <Link
                  href="/login"
                  className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary-600 to-accent-600 px-5 py-2.5 font-semibold text-white shadow-lg transition-all duration-200 hover:from-primary-500 hover:to-accent-500"
                >
                  Acessar área de login
                </Link>
              </Card>
            ) : (
              <>
                <div className="rounded-3xl bg-gradient-to-br from-primary-600 via-primary-500 to-accent-600 p-8 text-white shadow-hard">
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.4em] text-white/70">Área do viajante</p>
                      <h1 id="perfil-title" className="mt-3 text-4xl font-bold text-white">
                        Olá, {firstName}!
                      </h1>
                      <p className="mt-3 max-w-2xl text-base text-white/85">
                        Aqui você encontra suas informações cadastradas e os próximos passos para planejar uma viagem de
                        formatura inesquecível.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={rotaPacote()}
                        className="focus-ring inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-md backdrop-blur hover:bg-white/20"
                      >
                        <Compass size={16} />
                        Explorar pacotes
                      </Link>
                      <Link
                        href={rotaContato}
                        className="focus-ring inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-md backdrop-blur hover:bg-white/20"
                      >
                        <Mail size={16} />
                        Falar com suporte
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  <Card border className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                        <UserCircle2 size={26} />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-slate-900">Dados pessoais</h2>
                        <p className="text-sm text-slate-500">Informações principais vinculadas à sua conta.</p>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                          <UserCircle2 size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Nome completo</p>
                          <p className="mt-1 text-base font-semibold text-slate-900">{user.name}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                          <Mail size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Email cadastrado</p>
                          <p className="mt-1 text-base font-semibold text-slate-900">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:col-span-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                          <Hash size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">ID da conta</p>
                          <p className="mt-1 text-base font-semibold text-slate-900 break-all">{user.id}</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card border className="space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                        <ShieldCheck size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-slate-900">Sessão e segurança</h2>
                        <p className="text-sm text-slate-500">Gerencie o acesso e finalize sua sessão quando quiser.</p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-sm text-slate-600">
                      Mantenha seus dados atualizados para receber ofertas personalizadas e garantir uma experiência
                      tranquila durante toda a viagem de formatura.
                    </div>

                    <Button
                      variant="danger"
                      size="md"
                      className="w-full"
                      onClick={logout}
                    >
                      <LogOut size={18} />
                      Sair da conta
                    </Button>
                  </Card>

                  <Card border className="lg:col-span-3 space-y-6">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                          <ClipboardList size={24} />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-slate-900">Histórico de solicitações</h2>
                          <p className="text-sm text-slate-500">
                            Acompanhe suas reservas enviadas e finalize o pagamento quando estiver pronto.
                          </p>
                        </div>
                      </div>
                      <Link
                        href={rotaReservaCompleta()}
                        className="focus-ring inline-flex items-center gap-2 rounded-lg border border-primary-200 bg-white px-4 py-2 text-sm font-semibold text-primary-700 shadow-sm transition-all duration-200 hover:bg-primary-50"
                      >
                        <Compass size={16} />
                        Nova solicitação
                      </Link>
                    </div>

                    {reservationsLoading && (
                      <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 text-sm text-slate-600">
                        Carregando seu histórico...
                      </div>
                    )}

                    {reservationsError && !reservationsLoading && (
                      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
                        {reservationsError}
                      </div>
                    )}

                    {!reservationsLoading && !reservationsError && reservations.length === 0 && (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-sm text-slate-600">
                        Nenhuma solicitação registrada ainda. Envie os dados da sua turma para iniciar o processo de reserva.
                      </div>
                    )}

                    <div className="space-y-4">
                      {reservations.map((reservation) => {
                        const statusInfo = reservationStatusConfig[reservation.status] ?? reservationStatusConfig.PENDING
                        const hasPayment = reservation.payments.length > 0
                        const lastPayment = reservation.payments[0]

                        return (
                          <div
                            key={reservation.id}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-primary-200"
                          >
                            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                              <div>
                                <div className="flex flex-wrap items-center gap-3">
                                  <h3 className="text-lg font-semibold text-slate-900">
                                    {reservation.destination ?? 'Destino em definição'}
                                  </h3>
                                  <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                                </div>
                                <p className="mt-1 text-sm text-slate-500">
                                  Enviado em {formatDateTime(reservation.createdAt)}
                                </p>
                                {reservation.tripStart && reservation.tripEnd && (
                                  <p className="mt-1 text-sm text-slate-500">
                                    {formatDate(reservation.tripStart)} → {formatDate(reservation.tripEnd)} · {reservation.tripDuration ?? 'Duração a confirmar'}
                                  </p>
                                )}
                                {reservation.budget && (
                                  <p className="mt-1 text-sm text-slate-500">
                                    Orçamento indicado: {reservation.budget}
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {reservation.status !== 'PAID' && (
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => openPaymentModal(reservation)}
                                  >
                                    <CreditCard size={16} />
                                    Realizar pagamento
                                  </Button>
                                )}
                                {reservation.status === 'PAID' && (
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => handleOpenReceipt(reservation.id)}
                                  >
                                    <Receipt size={16} />
                                    Ver comprovante
                                  </Button>
                                )}
                              </div>
                            </div>

                            {hasPayment && lastPayment && (
                              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-sm">
                                <p className="font-semibold text-slate-800">Pagamento contabilizado</p>
                                <p className="mt-1 text-slate-600">
                                  Método: {paymentMethodLabels[lastPayment.method]} · Valor:{' '}
                                  {formatCurrency(lastPayment.amount, lastPayment.currency)}
                                </p>
                                <p className="mt-1 text-slate-600">
                                  Quitado em {formatDateTime(lastPayment.paidAt)} · Recibo {lastPayment.receiptCode}
                                </p>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </Card>
                </div>
              </>
            )}
          </div>
        </section>
      </Main>
      <Footer />

      <Modal open={paymentModalOpen} title="Finalizar pagamento" onClose={closePaymentModal}>
        {!selectedReservation ? (
          <p className="text-sm text-slate-600">Selecione uma solicitação para continuar.</p>
        ) : (
          <form onSubmit={handlePaymentSubmit} className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">{selectedReservation.destination ?? 'Destino em definição'}</p>
              <p className="mt-1">
                Criada em {formatDateTime(selectedReservation.createdAt)}
              </p>
              {selectedReservation.tripStart && selectedReservation.tripEnd && (
                <p className="mt-1">
                  {formatDate(selectedReservation.tripStart)} → {formatDate(selectedReservation.tripEnd)}
                </p>
              )}
              {selectedReservation.budget && (
                <p className="mt-1">Orçamento indicado: {selectedReservation.budget}</p>
              )}
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">Escolha o método de pagamento</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => handlePaymentMethodChange('PIX')}
                  className={`rounded-xl border p-4 text-left text-sm transition-all ${
                    paymentMethod === 'PIX'
                      ? 'border-primary-400 bg-primary-50/70 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-primary-200'
                  }`}
                >
                  <div className="flex items-center gap-2 text-slate-800">
                    <QrCode size={18} />
                    <span className="font-semibold">PIX</span>
                  </div>
                  <p className="mt-2 text-slate-600">Transferência instantânea com chave ou QR Code.</p>
                </button>
                <button
                  type="button"
                  onClick={() => handlePaymentMethodChange('CREDIT_CARD')}
                  className={`rounded-xl border p-4 text-left text-sm transition-all ${
                    paymentMethod === 'CREDIT_CARD'
                      ? 'border-primary-400 bg-primary-50/70 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-primary-200'
                  }`}
                >
                  <div className="flex items-center gap-2 text-slate-800">
                    <CreditCard size={18} />
                    <span className="font-semibold">Cartão de crédito</span>
                  </div>
                  <p className="mt-2 text-slate-600">Informe os dados do cartão para registrar o pagamento.</p>
                </button>
                <button
                  type="button"
                  onClick={() => handlePaymentMethodChange('BOLETO')}
                  className={`rounded-xl border p-4 text-left text-sm transition-all ${
                    paymentMethod === 'BOLETO'
                      ? 'border-primary-400 bg-primary-50/70 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-primary-200'
                  }`}
                >
                  <div className="flex items-center gap-2 text-slate-800">
                    <Receipt size={18} />
                    <span className="font-semibold">Boleto bancário</span>
                  </div>
                  <p className="mt-2 text-slate-600">Use o código de barras ou linha digitável do boleto.</p>
                </button>
              </div>
            </div>

            {paymentMethod === 'PIX' && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Valor"
                  type="number"
                  min="0"
                  step="0.01"
                  value={paymentFields.amount ?? ''}
                  onChange={(event) => handlePaymentFieldChange('amount', event.target.value)}
                  required
                />
                <Input
                  label="Nome do pagador"
                  value={paymentFields.payerName ?? ''}
                  onChange={(event) => handlePaymentFieldChange('payerName', event.target.value)}
                  required
                />
                <Input
                  label="Documento do pagador"
                  value={paymentFields.payerDocument ?? ''}
                  onChange={(event) => handlePaymentFieldChange('payerDocument', event.target.value)}
                  required
                />
                <Input
                  label="Chave PIX utilizada"
                  value={paymentFields.pixKey ?? ''}
                  onChange={(event) => handlePaymentFieldChange('pixKey', event.target.value)}
                  required
                />
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="pix-notes">
                    Observações (opcional)
                  </label>
                  <textarea
                    id="pix-notes"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={3}
                    value={paymentFields.notes ?? ''}
                    onChange={(event) => handlePaymentFieldChange('notes', event.target.value)}
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'CREDIT_CARD' && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Valor"
                  type="number"
                  min="0"
                  step="0.01"
                  value={paymentFields.amount ?? ''}
                  onChange={(event) => handlePaymentFieldChange('amount', event.target.value)}
                  required
                />
                <Input
                  label="Nome impresso no cartão"
                  value={paymentFields.cardHolder ?? ''}
                  onChange={(event) => handlePaymentFieldChange('cardHolder', event.target.value)}
                  required
                />
                <Input
                  label="Número do cartão"
                  value={paymentFields.cardNumber ?? ''}
                  onChange={(event) => handlePaymentFieldChange('cardNumber', event.target.value)}
                  inputMode="numeric"
                  required
                />
                <Input
                  label="Validade (MM/AA)"
                  placeholder="08/27"
                  value={paymentFields.expiry ?? ''}
                  onChange={(event) => handlePaymentFieldChange('expiry', event.target.value)}
                  required
                />
                <Input
                  label="CVV"
                  value={paymentFields.cvv ?? ''}
                  onChange={(event) => handlePaymentFieldChange('cvv', event.target.value)}
                  inputMode="numeric"
                  required
                />
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="installments">
                    Parcelas
                  </label>
                  <select
                    id="installments"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={paymentFields.installments ?? '1'}
                    onChange={(event) => handlePaymentFieldChange('installments', event.target.value)}
                  >
                    {Array.from({ length: 12 }).map((_, index) => {
                      const value = (index + 1).toString()
                      return (
                        <option key={value} value={value}>
                          {value}x
                        </option>
                      )
                    })}
                  </select>
                </div>
              </div>
            )}

            {paymentMethod === 'BOLETO' && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Valor"
                  type="number"
                  min="0"
                  step="0.01"
                  value={paymentFields.amount ?? ''}
                  onChange={(event) => handlePaymentFieldChange('amount', event.target.value)}
                  required
                />
                <Input
                  label="Nome do pagador"
                  value={paymentFields.payerName ?? ''}
                  onChange={(event) => handlePaymentFieldChange('payerName', event.target.value)}
                  required
                />
                <Input
                  label="Documento do pagador"
                  value={paymentFields.payerDocument ?? ''}
                  onChange={(event) => handlePaymentFieldChange('payerDocument', event.target.value)}
                  required
                />
                <Input
                  label="Número do boleto"
                  value={paymentFields.boletoNumber ?? ''}
                  onChange={(event) => handlePaymentFieldChange('boletoNumber', event.target.value)}
                  required
                />
                <Input
                  label="Banco emissor (opcional)"
                  value={paymentFields.bank ?? ''}
                  onChange={(event) => handlePaymentFieldChange('bank', event.target.value)}
                />
              </div>
            )}

            {paymentError && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {paymentError}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={closePaymentModal}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" isLoading={paymentSubmitting} disabled={!paymentMethod}>
                Confirmar pagamento
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <Modal open={receiptModalOpen} title="Comprovante de pagamento" onClose={closeReceiptModal}>
        {receiptError ? (
          <div className="space-y-4 text-sm text-rose-700">
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
              {receiptError}
            </div>
            <div className="flex justify-end">
              <Button variant="primary" onClick={closeReceiptModal}>
                Fechar
              </Button>
            </div>
          </div>
        ) : receiptData ? (
          <div className="space-y-4 text-sm text-slate-700">
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-base font-semibold text-slate-900">{receiptData.destination ?? 'Destino em definição'}</p>
              <p className="mt-1">Recibo: {receiptData.receiptCode}</p>
              <p className="mt-1">Pagamento confirmado em {formatDateTime(receiptData.paidAt)}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Método</p>
                <p className="mt-1 font-semibold text-slate-900">{paymentMethodLabels[receiptData.method]}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Valor</p>
                <p className="mt-1 font-semibold text-slate-900">{formatCurrency(receiptData.amount, receiptData.currency)}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-3 sm:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Detalhes</p>
                <pre className="mt-1 whitespace-pre-wrap break-words rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
{JSON.stringify(receiptData.details, null, 2)}
                </pre>
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="primary" onClick={closeReceiptModal}>
                Fechar
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-600">Carregando comprovante...</p>
        )}
      </Modal>
    </>
  )
}
