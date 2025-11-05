import type { Request, Response, Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';

const ReservationPayloadSchema = z.object({
  slug: z.string().min(1).max(191).optional(),
  form: z.record(z.string()).transform((value) => value as Record<string, string>),
});

const currencySanitizer = (value?: string | null) => {
  if (!value) return undefined;
  const digits = value
    .replace(/[^0-9,.-]/g, '')
    .replace(/\.(?=\d{3})/g, '') // remove separadores de milhar
    .replace(',', '.');
  const parsed = Number(digits);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const toDateOrNull = (value?: string | null) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const PaymentPixSchema = z.object({
  method: z.literal('PIX'),
  amount: z.number().positive(),
  payerName: z.string().min(2),
  payerDocument: z.string().min(5),
  pixKey: z.string().min(3),
  notes: z.string().max(280).optional(),
});

const PaymentCardSchema = z.object({
  method: z.literal('CREDIT_CARD'),
  amount: z.number().positive(),
  cardHolder: z.string().min(2),
  cardNumber: z.string().min(12).max(19),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/(\d{2})$/, 'Formato esperado MM/AA'),
  cvv: z.string().min(3).max(4),
  installments: z.number().min(1).max(12).optional().default(1),
});

const PaymentBoletoSchema = z.object({
  method: z.literal('BOLETO'),
  amount: z.number().positive(),
  payerName: z.string().min(2),
  payerDocument: z.string().min(5),
  boletoNumber: z.string().min(5),
  bank: z.string().min(2).max(60).optional(),
});

const PaymentSchema = z.discriminatedUnion('method', [PaymentPixSchema, PaymentCardSchema, PaymentBoletoSchema]);

const reservationDelegate = () => (prisma as any).reservationRequest;
const paymentDelegate = () => (prisma as any).reservationPayment;

const mapReservation = async (reservationId: string): Promise<{
  id: string;
  slug: string | null;
  status: string;
  destination: string | null;
  tripStart: string | null;
  tripEnd: string | null;
  tripDuration: string | null;
  budget: string | null;
  createdAt: string;
  updatedAt: string;
  formData: Record<string, unknown>;
  payments: PaymentResponse[];
}> => {
  const reservation = await reservationDelegate().findUnique({
    where: { id: reservationId },
    include: {
      payments: {
        orderBy: { paidAt: 'desc' },
      },
    },
  });

  if (!reservation) {
    throw new Error('Reservation not found');
  }

  return {
    id: reservation.id,
    slug: reservation.slug,
    status: reservation.status,
    destination: reservation.destination,
    tripStart: reservation.tripStart ? reservation.tripStart.toISOString() : null,
    tripEnd: reservation.tripEnd ? reservation.tripEnd.toISOString() : null,
    tripDuration: reservation.tripDuration,
    budget: reservation.budget,
    createdAt: reservation.createdAt.toISOString(),
    updatedAt: reservation.updatedAt.toISOString(),
    formData: reservation.formData as Record<string, unknown>,
    payments: reservation.payments.map((payment: any) => ({
      id: payment.id,
      method: payment.method,
      amount: payment.amount ? Number(payment.amount) : null,
      currency: payment.currency,
      status: payment.status,
      paidAt: payment.paidAt.toISOString(),
      receiptCode: payment.receiptCode,
      details: payment.details ?? {},
      createdAt: payment.createdAt.toISOString(),
    })),
  };
};

const mapPayment = async (paymentId: string): Promise<{
  id: string;
  method: string;
  amount: number | null;
  currency: string;
  status: string;
  paidAt: string;
  receiptCode: string;
  details: Record<string, unknown>;
  createdAt: string;
}> => {
  const payment = await paymentDelegate().findUnique({
    where: { id: paymentId },
  });

  if (!payment) {
    throw new Error('Payment not found');
  }

  return {
    id: payment.id,
    method: payment.method,
    amount: payment.amount ? Number(payment.amount) : null,
    currency: payment.currency,
    status: payment.status,
    paidAt: payment.paidAt.toISOString(),
    receiptCode: payment.receiptCode,
    details: payment.details ?? {},
    createdAt: payment.createdAt.toISOString(),
  };
};

type ReservationMapped = Awaited<ReturnType<typeof mapReservation>>;
type PaymentMapped = Awaited<ReturnType<typeof mapPayment>>;

const buildReceipt = (reservation: ReservationMapped, payment: PaymentMapped) => ({
  reservationId: reservation.id,
  receiptCode: payment.receiptCode,
  destination: reservation.destination,
  method: payment.method,
  amount: payment.amount,
  currency: payment.currency,
  paidAt: payment.paidAt,
  details: payment.details,
  status: payment.status,
});

function sanitizeCardNumber(cardNumber: string) {
  const digits = cardNumber.replace(/[^0-9]/g, '');
  const last4 = digits.slice(-4);
  return {
    masked: `**** **** **** ${last4}`.trim(),
    last4,
  };
}

export function setupReservationRoutes(router: Router) {
  router.post('/reservations', requireAuth, async (req: Request, res: Response) => {
    try {
      const parsed = ReservationPayloadSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error: 'Invalid reservation payload',
          details: parsed.error.flatten(),
        });
      }

      const { slug, form } = parsed.data;
      const userId = req.userId!;

      const destination = form.destinationPrimary || form.destination || null;
      const tripStart = toDateOrNull(form.tripStart ?? null);
      const tripEnd = toDateOrNull(form.tripEnd ?? null);
      const tripDuration = form.tripDuration || null;
      const budget = form.budgetPerStudent || form.budget || null;

      const reservation = await reservationDelegate().create({
        data: {
          userId,
          slug: slug ?? null,
          destination,
          tripStart,
          tripEnd,
          tripDuration,
          budget,
          formData: form,
        },
      });

      const payload = await mapReservation(reservation.id);

      return res.status(201).json({ reservation: payload });
    } catch (error) {
      console.error('Create reservation error:', error);
      return res.status(500).json({ error: 'internal server error' });
    }
  });

  router.get('/reservations/me', requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.userId!;

      const reservations = await reservationDelegate().findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
          payments: {
            orderBy: { paidAt: 'desc' },
          },
        },
      });

      const payload = reservations.map((reservation: any) => ({
        id: reservation.id,
        slug: reservation.slug,
        status: reservation.status,
        destination: reservation.destination,
        tripStart: reservation.tripStart ? reservation.tripStart.toISOString() : null,
        tripEnd: reservation.tripEnd ? reservation.tripEnd.toISOString() : null,
        tripDuration: reservation.tripDuration,
        budget: reservation.budget,
        createdAt: reservation.createdAt.toISOString(),
        updatedAt: reservation.updatedAt.toISOString(),
        payments: reservation.payments.map((payment: any) => ({
          id: payment.id,
          method: payment.method,
          amount: payment.amount ? Number(payment.amount) : null,
          currency: payment.currency,
          status: payment.status,
          paidAt: payment.paidAt.toISOString(),
          receiptCode: payment.receiptCode,
          details: payment.details ?? {},
          createdAt: payment.createdAt.toISOString(),
        })),
      }));

      return res.json({ reservations: payload });
    } catch (error) {
      console.error('List reservations error:', error);
      return res.status(500).json({ error: 'internal server error' });
    }
  });

  router.post('/reservations/:id/payments', requireAuth, async (req: Request, res: Response) => {
    try {
      const reservationId = req.params.id;
      const userId = req.userId!;

      const reservation = await reservationDelegate().findUnique({
        where: { id: reservationId },
        include: { payments: true },
      });

      if (!reservation || reservation.userId !== userId) {
        return res.status(404).json({ error: 'reservation not found' });
      }

      if (reservation.status === 'PAID') {
        return res.status(400).json({ error: 'reservation already paid' });
      }

      const parsedPayment = PaymentSchema.safeParse(req.body);
      if (!parsedPayment.success) {
        return res.status(400).json({
          error: 'invalid payment payload',
          details: parsedPayment.error.flatten(),
        });
      }

      const paymentPayload = parsedPayment.data;

      const amount = paymentPayload.amount ?? currencySanitizer(reservation.budget);

      if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'invalid amount' });
      }

      let details: Record<string, unknown> = {};

      switch (paymentPayload.method) {
        case 'PIX':
          details = {
            payerName: paymentPayload.payerName,
            payerDocument: paymentPayload.payerDocument,
            pixKey: paymentPayload.pixKey,
            notes: paymentPayload.notes,
          };
          break;
        case 'CREDIT_CARD': {
          const { masked, last4 } = sanitizeCardNumber(paymentPayload.cardNumber);
          details = {
            cardHolder: paymentPayload.cardHolder,
            cardLast4: last4,
            cardMasked: masked,
            expiry: paymentPayload.expiry,
            installments: paymentPayload.installments ?? 1,
          };
          break;
        }
        case 'BOLETO':
          details = {
            payerName: paymentPayload.payerName,
            payerDocument: paymentPayload.payerDocument,
            boletoNumber: paymentPayload.boletoNumber,
            bank: paymentPayload.bank,
          };
          break;
        default:
          details = {};
      }

      const receiptCode = `RES-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

      const payment = await paymentDelegate().create({
        data: {
          reservationId,
          method: paymentPayload.method,
          amount,
          details,
          status: 'CONFIRMED',
          paidAt: new Date(),
          receiptCode,
        },
      });

      await reservationDelegate().update({
        where: { id: reservationId },
        data: {
          status: 'PAID',
          budget: reservation.budget ?? (paymentPayload.amount ? paymentPayload.amount.toString() : reservation.budget),
        },
      });

      const mappedReservation = await mapReservation(reservationId);
      const mappedPayment = await mapPayment(payment.id);
      const receipt = buildReceipt(mappedReservation, mappedPayment);

      return res.status(201).json({ reservation: mappedReservation, receipt });
    } catch (error) {
      console.error('Create payment error:', error);
      return res.status(500).json({ error: 'internal server error' });
    }
  });

  router.get('/reservations/:id/receipt', requireAuth, async (req: Request, res: Response) => {
    try {
      const reservationId = req.params.id;
      const userId = req.userId!;

      const reservation = await reservationDelegate().findUnique({
        where: { id: reservationId },
        include: {
          payments: {
            orderBy: { paidAt: 'desc' },
          },
        },
      });

      if (!reservation || reservation.userId !== userId) {
        return res.status(404).json({ error: 'receipt not found' });
      }

      const payment = reservation.payments[0];
      if (!payment) {
        return res.status(404).json({ error: 'no payment recorded' });
      }

      const mappedReservation = await mapReservation(reservationId);
      const mappedPayment = await mapPayment(payment.id);
      const receipt = buildReceipt(mappedReservation, mappedPayment);

      return res.json({ receipt });
    } catch (error) {
      console.error('Get receipt error:', error);
      return res.status(500).json({ error: 'internal server error' });
    }
  });
}
