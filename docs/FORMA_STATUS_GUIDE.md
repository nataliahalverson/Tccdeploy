# 📊 FORMA+ Progress Checker — Guia de Uso

## Visão Geral

O **FORMA Status Checker** (`tools/formaStatus.ts`) analisa o repositório contra os **6 requisitos do documento final Forma+** e gera um relatório de progresso com pontuação 0-100.

### O que é medido

| Categoria | Peso | Métricas |
|-----------|------|----------|
| **Frontend** | 30% | Stack (Vite/Next), 3 páginas, A11y, paleta azul+amarelo |
| **Backend** | 30% | Node.js+TS, entry point, cookies httpOnly, CORS credentials, endpoints |
| **Database** | 25% | Prisma, unique constraint [userId, type, metaHash], indexes, migrations, .env |
| **Deploy** | 5% | Vercel (vercel.json, .vercel, script) |
| **Testes** | 10% | E2E (≥4 testes), @axe-core, screenshots |

## Instalação & Uso

### 1️⃣ Verificar dependências

```bash
npm install
```

As dependências já estão no `package.json`:
- `tsx@^4.7.0` — Executor TypeScript
- `fast-glob@^3.3.2` — Busca de arquivos rápida
- `picocolors@^1.0.0` — Cores no console

### 2️⃣ Rodar o verificador

```bash
npm run status:forma
```

### 3️⃣ Resultado

Dois arquivos/outputs são gerados:

#### **FORMA_STATUS.json** (na raiz do repo)
```json
{
  "generatedAt": "2025-10-23T14:30:00.000Z",
  "frontend": {
    "stack": { "vite": false, "next": true },
    "pages": { "expected": ["home", "pacotes", "contato"], "found": ["home", "pacotes", "contato"], "count": 3 },
    "a11yMain": true,
    "palette": { "blueHits": 15, "yellowHits": 8, "ok": true }
  },
  "backend": {
    "entry": "src/server/index.ts",
    "hasTsconfig": true,
    "httpOnlyCookie": true,
    "corsCredentials": true,
    "endpoints": { "files": ["src/server/routes/auth.ts", ...], "count": 12 }
  },
  "database": {
    "hasPrisma": true,
    "pointEventUniqueByMetaHash": true,
    "hasUserIdIndex": true,
    "migrationFiles": ["prisma/migrations/.../migration.sql"],
    "sanitizedDatabaseUrl": "user:***@host"
  },
  "deploy": { "vercelIntent": true, "hints": [] },
  "tests": { "happyPathExists": true, "testCount": 8, "hasAxe": true, "screenshots": 3 },
  "score": 92,
  "semaphore": "green",
  "weights": { ... }
}
```

#### **Console Output**
```
======================================================================
📊 FORMA+ Progress Checker
======================================================================

📱 FRONTEND (Stack + Pages + A11y + Palette)
  ✅ Stack: Next.js
  ✅ Pages: 3/3 (home, pacotes, contato)
  ✅ A11y: <main id="conteudo">, tabIndex, scroll-mt-24
  ✅ Palette: 🔵 (15) 🟡 (8)

🔧 BACKEND (Node.js + TS + Auth + Routes)
  ✅ Entry: src/server/index.ts
  ✅ TypeScript: tsconfig.json + .ts files
  ✅ httpOnly Cookies: res.cookie( with httpOnly: true
  ✅ CORS Credentials: cors({ credentials: true })
  ✅ Endpoints: 12/8+

🗄️  DATABASE (Prisma + Unique + Indexes + Migrations)
  ✅ Prisma: schema.prisma found
  ✅ Unique Constraint: [userId, type, metaHash]
  ✅ Indexes: userId index on PointEvent
  ✅ Migrations: 1 files
  ✅ .env: DATABASE_URL found

🚀 DEPLOY (Vercel)
  ✅ Vercel Intent: next.config.mjs

✅ TESTS (E2E + A11y + Screenshots)
  ✅ E2E: 8 tests in happy-path.spec.ts
  ✅ A11y: @axe-core/playwright found
  ✅ Screenshots: 3

======================================================================
🟢 FORMA+ Score: 92/100 — Ready for Delivery
======================================================================

✨ Report saved to: FORMA_STATUS.json
```

## Interpretação do Score

| Score | Semáforo | Status | Ação |
|-------|----------|--------|------|
| ≥ 85 | 🟢 Verde | **Ready for Delivery** | Pronto para apresentar à banca |
| 70–84 | 🟡 Amarelo | **Almost There** | Pequenos ajustes pendentes |
| 50–69 | 🟠 Laranja | **In Progress** | Completar itens faltando |
| < 50 | 🔴 Vermelho | **Needs Attention** | Revisar requisitos |

## Checklist: O que cada seção verifica

### 📱 Frontend

- **Stack**: Detecta Vite (`vite.config.*`, `index.html`) ou Next.js (`next.config.*`)
- **Páginas (3 esperadas)**:
  - Next.js App Router: `src/app/(home)/page.tsx`, `src/app/pacotes/page.tsx`, `src/app/contato/page.tsx`
  - Next.js Pages Router: `src/pages/index.*`, `src/pages/pacotes.*`, `src/pages/contato.*`
- **A11y**: Procura por `<main id="conteudo">` + `tabIndex={-1}` + classe `scroll-mt-24`
- **Paleta**: Conta menções de `blue|azul` e `yellow|amarelo` em CSS + classes Tailwind

### 🔧 Backend

- **Entry**: Detecta `src/server.ts`, `src/server/index.ts` ou `src/index.ts`
- **TypeScript**: `tsconfig.json` presente + arquivos `.ts` em `src/server/`
- **httpOnly Cookies**: Procura por `res.cookie(` com `httpOnly: true`
- **CORS Credentials**: Procura por `cors({ credentials: true })`
- **Endpoints**: Conta `router.get|post|put|patch|delete(` (esperado ≥8)

### 🗄️ Database

- **Prisma**: `prisma/schema.prisma` existe
- **Unique Constraint**: Procura por `@@unique([userId, type, metaHash])` em PointEvent
- **Indexes**: Procura por `@@index([userId])` ou similar
- **Migrations**: Detecta arquivos SQL em `prisma/migrations/` ou raiz
- **.env**: `DATABASE_URL` presente (mascarada em JSON: `user:***@host`)

### 🚀 Deploy

- **Vercel Intent**: Detecta `vercel.json`, `.vercel/` dir ou script "vercel" em package.json
- Retorna OK se **qualquer um** for encontrado

### ✅ Testes

- **E2E**: `tests/e2e/happy-path.spec.ts` com ≥4 `test()` calls
- **A11y**: Procura por `@axe-core/playwright` ou `injectAxe` em testes
- **Screenshots**: Conta arquivos em `tests/e2e/__screenshots__/` (esperado ≥3)

## Troubleshooting

### ❌ "tsx não é reconhecido"
```bash
npm install
```

### ❌ Score baixo em Frontend Pages
Verifique:
- Está usando Next.js App Router? Arquivos devem estar em `src/app/*/page.tsx`
- Está usando Next.js Pages Router? Arquivos devem estar em `src/pages/*`
- Nomes exatos: `home`, `pacotes`, `contato` no path

### ❌ Backend Endpoints contando menos
Verifique:
- Rotas estão em `src/server/routes/**/*.ts`?
- Formato: `router.get()`, `router.post()`, etc.?

### ❌ Database: Unique Constraint não detectado
Verifique:
- Modelo `PointEvent` tem `@@unique([userId, type, metaHash])`?
- Sintaxe exata (sem quebras de linha ou espaços extras)

### ❌ Migrations não encontradas
Verifique:
- Arquivo SQL está em `prisma/migrations/**/migration.sql` ou `prisma/migrations/**/add_user_post_points.sql`?
- Ou na raiz: `add_user_post_points.sql`?

## Automatizar: CI/CD

### GitHub Actions

```yaml
name: FORMA+ Status Check
on: [push, pull_request]
jobs:
  status:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run status:forma
      - uses: actions/upload-artifact@v3
        with:
          name: forma-status
          path: FORMA_STATUS.json
```

### Vercel

Adicione em `vercel.json`:
```json
{
  "buildCommand": "npm run status:forma && npm run build",
  "env": {
    "DATABASE_URL": "@forma_database_url"
  }
}
```

## Relatório Completo

O **FORMA_STATUS.json** pode ser processado por ferramentas de BI ou dashboards:

```bash
# Extrair score
cat FORMA_STATUS.json | jq '.score'

# Extrair semáforo
cat FORMA_STATUS.json | jq '.semaphore'

# Listar erros/dicas
cat FORMA_STATUS.json | jq '.errors, .deploy.hints'
```

## Notas Importantes

1. **Nunca quebra a CI**: O script **não** usa `process.exit(1)` — apenas relata.
2. **Mascaramento de Secrets**: DATABASE_URL é sanitizado (`user:***@host`) no JSON.
3. **Escopo**: Roda do diretório raiz do repo — não precisa de configuração.
4. **Extensível**: Você pode adicionar novos checks em `tools/formaStatus.ts`.

---

**Versão**: 1.0 | **Última atualização**: 23 de outubro de 2025
