import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { prisma } from './lib/prisma';
import { setupAuthRoutes } from './routes/auth';
import { setupPostsRoutes } from './routes/posts';
import { setupProfileRoutes } from './routes/profile';
import { setupReservationRoutes } from './routes/reservations';

export function createApp() {
  const app = express();

  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
  }

  // CORS com lista de origens
  // Precedência: CORS_ALLOWED_ORIGINS > WEB_ORIGINS > WEB_ORIGIN > defaults
  const rawOrigins =
    process.env.CORS_ALLOWED_ORIGINS ||
    process.env.WEB_ORIGINS ||
    process.env.WEB_ORIGIN ||
    'https://formpluus.netlify.app,http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,http://127.0.0.1:3001';
  const allowedOrigins = rawOrigins
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  // Vary: Origin para respostas quando há múltiplas origens possíveis
  app.use((req, res, next) => {
    res.header('Vary', 'Origin');
    next();
  });

  app.use(
    cors({
      origin: (origin, callback) => {
        // Requisições sem header Origin (ex.: cURL, SSR) são permitidas
        if (!origin) return callback(null, true);

        const isExplicit = allowedOrigins.includes(origin);

        let isLocalHost = false;
        if (!isExplicit) {
          try {
            const url = new URL(origin);
            const isHttp = url.protocol === 'http:';
            const isLocal = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
            const allowedPorts = new Set(['3000', '3001']);
            isLocalHost = isHttp && isLocal && (!url.port || allowedPorts.has(url.port));
          } catch (err) {
            isLocalHost = false;
          }
        }

        if (isExplicit || isLocalHost) {
          return callback(null, true);
        }

        if (process.env.NODE_ENV !== 'production') {
          console.warn(`🔒 CORS bloqueado para origem não permitida: ${origin}`);
          console.warn(`   Origens permitidas (env): ${allowedOrigins.join(', ')}`);
        }
        return callback(new Error(`CORS: origin not allowed: ${origin}`));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // Responder preflight sem passar por auth
  app.options(
    '*',
    cors({
      origin: (origin, cb) => {
        if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
        return cb(new Error('Not allowed by CORS'));
      },
      credentials: true,
    })
  );

  // Segurança e performance (após CORS para evitar bloquear OPTIONS)
  app.use(helmet());
  app.use(compression());
  app.use(express.json());
  app.use(cookieParser());

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Muitas tentativas. Tente novamente mais tarde.',
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.get('/health', async (_req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`;

      return res.status(200).json({
        ok: true,
        db: true,
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV,
      });
    } catch (error: any) {
      return res.status(500).json({
        ok: false,
        db: false,
        error: error.message,
      });
    }
  });

  const router = express.Router();

  router.use('/auth/register', authLimiter);
  router.use('/auth/login', authLimiter);

  setupAuthRoutes(router);
  setupPostsRoutes(router);
  setupProfileRoutes(router);
  setupReservationRoutes(router);
  app.use(router);

  app.use((err: any, _req: any, res: any, _next: any) => {
    const status = err?.status || err?.statusCode || 500;
    const message = status === 500 ? 'internal_error' : err?.message || 'unknown_error';

    console.error(`[ERROR] ${status}: ${message}`, err);

    return res.status(status).json({
      error: message,
      ...(process.env.NODE_ENV !== 'production' && { details: err.toString() }),
    });
  });

  app.use((_req, res) => {
    res.status(404).json({ error: 'not_found' });
  });

  return app;
}
