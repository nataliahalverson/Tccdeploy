# 🚀 Go-Live Checklist (10 Itens Críticos)

**Projeto**: Natália (MVP — Roteiros + Posts + Pontos)  
**Data**: 22 de outubro de 2025  
**Status**: Pré-deploy (checklist executável)  

---

## ✅ 1. CORS + Cookies (Frontend ↔ Backend)

### Backend (`src/server/index.ts`)
```typescript
const origin = process.env.WEB_ORIGIN || 'http://localhost:3000';
app.use(cors({
  origin, // ⚠️ URL exata (NÃO '*')
  credentials: true, // ✅ Permite cookies cross-origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));
```

### Frontend (`src/lib/httpClient.ts`)
```typescript
const response = await fetch(url, {
  method,
  headers,
  credentials: 'include', // ✅ Envia cookies automaticamente
  body: method !== 'GET' ? JSON.stringify(data) : undefined,
});
```

### Produção (Express)
```typescript
// Em app.ts, antes das rotas
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); // ✅ Respeita X-Forwarded-* do proxy
}
```

### Cookie Seguro (Produção)
```typescript
const secure = process.env.NODE_ENV === 'production';
res.cookie(process.env.COOKIE_NAME || 'access_token', jwt, {
  httpOnly: true,           // ✅ Não acessível por JS
  secure,                   // ✅ true em HTTPS, false em dev
  sameSite: 'lax',          // ✅ CSRF protection
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
});
```

### Checklist
- [ ] `WEB_ORIGIN` em `.env` aponta para frontend exato (`http://localhost:3000` ou `https://seu-front.vercel.app`)
- [ ] `credentials: true` no `cors()` e no `fetch(..., { credentials: 'include' })`
- [ ] Em produção: `app.set('trust proxy', 1)` ativado
- [ ] Cookie `secure: true` apenas em produção (HTTPS)
- [ ] `secure: false` em desenvolvimento (HTTP local)

**Status**: ⏳ Pendente verificação em `.env`

---

## ✅ 2. .env Saneado

### Variáveis Obrigatórias

```env
# Banco de dados (AlwaysData)
DATABASE_URL="mysql://facerec:iqmi8j55PDpHQ@mysql-facerec.alwaysdata.net:3306/facerec_form"

# Frontend URL (para CORS)
WEB_ORIGIN="http://localhost:3000"  # dev
# WEB_ORIGIN="https://seu-frontend.vercel.app"  # prod

# JWT
JWT_SECRET="seu-secret-seguro-gerado-aqui"  # ⚠️ Mude em produção!
COOKIE_NAME="access_token"

# Servidor
PORT="4000"
NODE_ENV="development"  # ou "production"

# Próximos.js (frontend)
NEXT_PUBLIC_API_BASE_URL="http://localhost:4000"  # dev
# NEXT_PUBLIC_API_BASE_URL="https://seu-backend.railway.app"  # prod

# Timezone (para horários consistentes)
TZ="UTC"
```

### Checklist
- [ ] `DATABASE_URL` aponta para AlwaysData (testado com `mysql -h ... -u ...`)
- [ ] `WEB_ORIGIN` = URL exata do frontend (sem trailing slash)
- [ ] `JWT_SECRET` gerado com `openssl rand -base64 32` (ou similar)
- [ ] `COOKIE_NAME` não é default (ex.: "natalia_token")
- [ ] `PORT` = 4000 (ou porta disponível)
- [ ] `NODE_ENV` = "development" (dev) ou "production" (prod)
- [ ] `TZ` = "UTC" (consistência de timestamps)
- [ ] `.env` está em `.gitignore` (⚠️ Nunca commitar!)
- [ ] `.env.example` tem template sem valores sensíveis

**Status**: ⏳ Verificar `.env` local

---

## ✅ 3. Migração Aplicada (SQL + Prisma)

### Passo 1: Executar SQL no AlwaysData

**Windows (PowerShell)**:
```powershell
.\apply-migration.ps1
```

**Linux/macOS (Bash)**:
```bash
./apply-migration.sh
```

**Manual (mysql client)**:
```bash
mysql -h mysql-facerec.alwaysdata.net -u facerec -piqmi8j55PDpHQ -D facerec_form < prisma/migrations/20251022_add_user_post_points.sql
```

**phpMyAdmin** (web):
1. Acesse AlwaysData → phpMyAdmin
2. Selecione banco `facerec_form`
3. Aba "SQL" → cole conteúdo `20251022_add_user_post_points.sql`
4. Clique "Executar"

### Passo 2: Sincronizar Prisma
```bash
npx prisma migrate deploy
npx prisma generate
```

### Passo 3: Validar Tabelas
```bash
mysql -h mysql-facerec.alwaysdata.net -u facerec -piqmi8j55PDpHQ -D facerec_form
> SHOW TABLES;
# Saída esperada:
# +-----------------------+
# | Tables_in_facerec_form |
# +-----------------------+
# | PointEvent            |
# | Post                  |
# | User                  |
# +-----------------------+

> SHOW INDEX FROM PointEvent;
# Verificar: UNIQUE (userId, type, metaHash)
```

### Checklist
- [ ] SQL importado com sucesso (3 tabelas criadas)
- [ ] `SHOW TABLES;` = User, Post, PointEvent
- [ ] `SHOW INDEX FROM PointEvent;` mostra UNIQUE(userId, type, metaHash)
- [ ] `npx prisma migrate deploy` rodou sem erros
- [ ] `npx prisma generate` atualizou types do cliente

**Status**: ⏳ Executar scripts

---

## ✅ 4. Prisma Singleton (Evita Excesso de Conexões)

### Arquivo: `src/lib/prisma.ts` (NOVO)

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // ⚠️ Em dev, logs podem ficar verbose
    // log: ['query', 'info', 'warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

### Uso em Rotas/Serviços

**Antes** (❌ NÃO fazer):
```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); // ⚠️ Nova instância cada vez!
```

**Depois** (✅ Fazer):
```typescript
import { prisma } from '@/lib/prisma';
// Reutiliza mesma instância
```

### Checklist
- [ ] `src/lib/prisma.ts` criado com singleton
- [ ] Todas as rotas importam de `@/lib/prisma` (não `new PrismaClient()`)
- [ ] Services importam de `@/lib/prisma`
- [ ] Nenhuma duplicação de `new PrismaClient()`

**Status**: ⏳ Criar arquivo + atualizar imports

---

## ✅ 5. Segurança Básica (Helmet + Compression + Rate Limit)

### Instalar Dependências
```bash
npm install helmet compression express-rate-limit
npm install -D @types/express-rate-limit
```

### Arquivo: `src/server/index.ts` (Atualizar)

```typescript
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

app.use(helmet()); // ✅ Headers de segurança
app.use(compression()); // ✅ Gzip responses

// Rate limit no auth (protege contra brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requisições por IP
  message: 'Muitas tentativas de login. Tente novamente mais tarde.',
});

app.post('/auth/login', authLimiter, async (req, res) => { /* ... */ });
app.post('/auth/register', authLimiter, async (req, res) => { /* ... */ });
```

### Checklist
- [ ] `helmet()` ativado (headers de segurança)
- [ ] `compression()` ativado (Gzip responses)
- [ ] Rate limit em `/auth/login` e `/auth/register`
- [ ] `app.use()` chamados ANTES das rotas

**Status**: ⏳ Instalar packages + atualizar server

---

## ✅ 6. Validação e Sanitização (Zod + Sanitize)

### Instalar Dependências
```bash
npm install zod sanitize-html
npm install -D @types/sanitize-html
```

### Exemplo: Validar POST de Post

**Arquivo: `src/server/routes/posts.ts` (Atualizar)**

```typescript
import { z } from 'zod';
import sanitize from 'sanitize-html';

const PostSchema = z.object({
  title: z.string().min(3).max(120),
  content: z.string().min(3).max(10_000),
});

postsRouter.post('/', requireAuth, async (req, res) => {
  try {
    // 1. Validar schema
    const parsed = PostSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Invalid input',
        details: parsed.error.flatten(),
      });
    }

    const { title, content } = parsed.data;

    // 2. Sanitizar HTML (remove tags perigosas)
    const cleanContent = sanitize(content, {
      allowedTags: ['b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'p', 'br'],
      allowedAttributes: { a: ['href', 'title'] },
    });

    // 3. Criar no DB
    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        content: cleanContent,
        userId: req.userId,
      },
    });

    // 4. Award pontos (async, não bloqueia)
    awardPoints({
      userId: req.userId,
      type: 'POST_CREATED',
      points: 10,
      meta: { postId: post.id },
    }).catch(err => console.error('Points award error:', err));

    return res.status(201).json(post);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});
```

### Checklist
- [ ] `zod` instalado e importado
- [ ] Schemas definidos para POST, Login, Register, etc.
- [ ] `safeParse()` validando entrada
- [ ] `sanitize-html` removendo tags perigosas
- [ ] Todos os endpoints `/auth/*` e `/posts` validados

**Status**: ⏳ Implementar Zod schemas

---

## ✅ 7. Health Check Real (API + DB)

### Arquivo: `src/server/index.ts` (Atualizar)

```typescript
// Health check com teste de conexão ao DB
app.get('/health', async (_req, res) => {
  try {
    // Testa conexão Prisma
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
```

### Teste Local
```bash
curl -i http://localhost:4000/health

# Saída esperada (200 OK):
# {
#   "ok": true,
#   "db": true,
#   "timestamp": "2025-10-22T14:30:45.123Z",
#   "env": "development"
# }
```

### Checklist
- [ ] `/health` retorna `{ ok: true, db: true }`
- [ ] Tenta conectar ao DB (verifica `SELECT 1`)
- [ ] Retorna `timestamp` (prove que responde sempre)
- [ ] Monitorável em produção (Railway, Render, etc.)

**Status**: ⏳ Implementar teste de DB

---

## ✅ 8. Tratador de Erro Central (HTTP Limpo)

### Arquivo: `src/server/index.ts` (Adicionar no final)

```typescript
// Middleware de erro global (DEVE ser último)
app.use((err: any, _req: any, res: any, _next: any) => {
  const status = err?.status || err?.statusCode || 500;
  const message =
    status === 500
      ? 'internal_error'
      : err?.message || 'unknown_error';

  console.error(`[ERROR] ${status}: ${message}`, err);

  return res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { details: err.toString() }),
  });
});

// 404 catch-all
app.use((_req, res) => {
  res.status(404).json({ error: 'not_found' });
});
```

### Checklist
- [ ] Error handler registrado DEPOIS de todas as rotas
- [ ] Retorna status + mensagem consistentes
- [ ] Em prod, não expõe detalhes (stack trace)
- [ ] Em dev, mostra detalhes para debug

**Status**: ⏳ Adicionar handler

---

## ✅ 9. Scripts & Smoke Tests

### package.json (Verificar/Atualizar)

```json
{
  "scripts": {
    "dev": "next dev",
    "dev:server": "tsx watch src/server/index.ts",
    "dev:all": "concurrently \"npm run dev\" \"npm run dev:server\"",
    "build": "next build",
    "build:server": "tsc --project tsconfig.json",
    "start": "next start",
    "start:server": "NODE_ENV=production node dist/server/index.js",
    "test:e2e": "playwright test",
    "test:smoke": "npm run test:smoke:register && npm run test:smoke:post",
    "test:smoke:register": "curl -X POST http://localhost:4000/auth/register -H 'Content-Type: application/json' -d '{\"email\":\"test@exemplo.com\",\"password\":\"teste123\",\"name\":\"Teste\"}'",
    "test:smoke:post": "curl -X POST http://localhost:4000/posts -H 'Content-Type: application/json' -H 'Cookie: access_token=...' -d '{\"title\":\"Test\",\"content\":\"Conteúdo teste\"}'"
  }
}
```

### Smoke Tests Manuais

```bash
# 1. Health check
curl -i http://localhost:4000/health

# 2. Register
curl -c cookies.txt -X POST http://localhost:4000/auth/register \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "demo@teste.com",
    "password": "demo123456",
    "name": "Demo User"
  }'

# 3. Login (reusa cookies)
curl -b cookies.txt -c cookies.txt -X POST http://localhost:4000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "demo@teste.com",
    "password": "demo123456"
  }'

# 4. Criar post (com cookie de auth)
curl -b cookies.txt -X POST http://localhost:4000/posts \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Ouro Preto",
    "content": "Roteiro: cidade histórica com..."
  }'

# 5. Ver pontos
curl -b cookies.txt http://localhost:4000/users/me/points

# 6. Logout
curl -b cookies.txt -X POST http://localhost:4000/auth/logout
```

### Checklist
- [ ] `npm run dev:server` inicia sem erros
- [ ] `npm run dev:all` roda frontend + backend
- [ ] Health check retorna `{ ok: true, db: true }`
- [ ] Smoke tests passam (register → login → post → pontos)
- [ ] Cookies são setados (check com `curl -c cookies.txt`)

**Status**: ⏳ Executar testes

---

## ✅ 10. E2E Tests (Playwright contra Backend Real)

### Arquivo: `tests/e2e/happy-path.spec.ts` (Verificar)

```typescript
import { test, expect } from '@playwright/test';

test.describe('Fluxo Feliz (com Backend)', () => {
  // Define URL do backend
  const API_URL = process.env.API_URL || 'http://localhost:4000';

  test('1. Health check', async ({ request }) => {
    const response = await request.get(`${API_URL}/health`);
    expect(response.status()).toBe(200);
    const json = await response.json();
    expect(json.ok).toBe(true);
  });

  test('2. Registrar novo usuário', async ({ request }) => {
    const response = await request.post(`${API_URL}/auth/register`, {
      data: {
        email: `user_${Date.now()}@test.com`,
        password: 'SecurePass123!',
        name: 'Test User',
      },
    });
    expect(response.status()).toBe(201);
    const json = await response.json();
    expect(json.id).toBeTruthy();
    expect(json.email).toBeTruthy();
  });

  // ... mais testes
});
```

### Executar E2E
```bash
npx playwright test tests/e2e/happy-path.spec.ts

# Opcionalmente, com UI para debug
npx playwright test --ui
```

### Checklist
- [ ] `playwright.config.ts` aponta para `http://localhost:3000`
- [ ] Para testes backend, usar `request` fixture (não `page`)
- [ ] Todos 8 testes passando
- [ ] Gerar report: `npx playwright show-report`

**Status**: ⏳ Executar testes

---

## ⚠️ Pontos de Atenção (Onde Costuma Dar "Zica")

### 1. Cookie "Secure" em HTTP Local
```typescript
// ❌ NÃO fazer (quebra em dev):
res.cookie('token', jwt, { secure: true }); // Não funciona em http://localhost

// ✅ Fazer:
const secure = process.env.NODE_ENV === 'production';
res.cookie('token', jwt, { secure });
```

### 2. Mismatch de Origin (CORS)
```typescript
// ❌ NÃO fazer:
app.use(cors({ origin: '*' })); // Credentials não funcionam

// ✅ Fazer:
const origin = process.env.WEB_ORIGIN || 'http://localhost:3000';
app.use(cors({ origin, credentials: true }));
```

### 3. Limite de Conexões (Prisma + AlwaysData)
```typescript
// ❌ NÃO fazer:
import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient(); // Em cada arquivo!

// ✅ Fazer (singleton):
import { prisma } from '@/lib/prisma'; // Reutiliza mesma instância
```

### 4. Horário Oscilante
```env
# ✅ Fazer:
TZ=UTC  # Todos timestamps em UTC, sem surpresas
```

### 5. Renderizar HTML do Post (XSS)
```typescript
// ❌ NÃO fazer:
<div dangerouslySetInnerHTML={{ __html: post.content }} />

// ✅ Fazer (sanitizar no backend + DOMPurify no front):
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(post.content);
<div>{clean}</div>
```

---

## 🎯 Prova Final para a Banca (Rapidamente Checklistável)

### 1. Vídeo do Fluxo Feliz (≤ 90s)
```
[ ] Login
    ├─ Email + Senha preenchidos
    └─ Cookie httpOnly setado (DevTools)

[ ] Novo Post
    ├─ Título + Conteúdo preenchidos
    ├─ Request com Authorization header
    └─ Response 201 Created

[ ] Pontos no Perfil
    ├─ Saldo = 10 (POST_CREATED)
    ├─ Atividades mostram timestamp
    └─ Idempotência: reenviar POST = mesmo resultado
```

### 2. Screenshots (3–5 peças)
- [ ] Skip link (a11y) focado no topo
- [ ] Post criado no feed
- [ ] Perfil com `POST_CREATED (10 pts)`
- [ ] DevTools → Cookies → `access_token` (httpOnly)
- [ ] DevTools → Network → `/auth/login` (Set-Cookie header)

### 3. Saída do Playwright
```bash
npx playwright test

# Esperado:
# ✓ 1) happy-path.spec.ts:43 Health check (1.2s)
# ✓ 2) happy-path.spec.ts:89 Registrar novo usuário (2.1s)
# ✓ 3) happy-path.spec.ts:142 Login com credenciais (1.8s)
# ✓ ... (8/8 testes)
# ─────────────────────────────────────
# 8 passed (12.3s)
```

### 4. Documentação Visível
- [ ] `BACKEND_IMPLEMENTATION.md` — Prova que não é "mão invisível"
- [ ] `MIGRATION_GUIDE.md` — Setup de DB documentado
- [ ] Página "Sobre" com link a `INDEX.md`
- [ ] `GO_LIVE_CHECKLIST.md` — Este checklist

---

## 📋 Resumo Final

| Item | Status | Prioridade |
|------|--------|-----------|
| CORS + Cookies | ⏳ Implementar | 🔴 CRÍTICA |
| .env Saneado | ⏳ Verificar | 🔴 CRÍTICA |
| Migração SQL + Prisma | ⏳ Executar | 🔴 CRÍTICA |
| Prisma Singleton | ⏳ Criar | 🟠 Alta |
| Segurança (Helmet+COR) | ⏳ Instalar | 🟠 Alta |
| Validação (Zod) | ⏳ Implementar | 🟡 Média |
| Health Check | ⏳ Implementar | 🟡 Média |
| Error Handler | ⏳ Adicionar | 🟡 Média |
| Smoke Tests | ⏳ Executar | 🟢 Baixa |
| E2E Tests | ⏳ Executar | 🟢 Baixa |

---

## 🚀 Próximos Passos

1. **Hoje (30 min)**:
   - Criar `src/lib/prisma.ts` (singleton)
   - Instalar: `helmet`, `compression`, `express-rate-limit`, `zod`, `sanitize-html`
   - Atualizar `src/server/index.ts` com segurança + health check + error handler
   - Atualizar `src/server/routes/posts.ts` com validação Zod

2. **Hoje (10 min)**:
   - Executar SQL: `.\apply-migration.ps1` (Windows)
   - Rodar: `npx prisma migrate deploy && npx prisma generate`
   - Testar: `npm run dev:server` + `curl http://localhost:4000/health`

3. **Hoje (15 min)**:
   - Smoke tests: `curl` commands (register → login → post → pontos)
   - Verificar cookies em DevTools
   - Screenshots para banca

4. **Próximos dias**:
   - E2E tests: `npx playwright test`
   - Vídeo fluxo feliz (≤ 90s)
   - Deploy (Railway, Render ou AWS)

---

**Status Geral**: 🟡 Pronto para começar  
**Blocker**: Instalar packages + aplicar SQL  
**Risco**: Mismatch CORS origin (✅ Mitigado com checklist)
