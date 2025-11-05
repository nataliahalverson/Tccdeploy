# 📋 FORMA+ Progress Checker — Documentação Completa

## 🎯 Objetivo

Script automatizado que mede **quanto já foi feito** do TCC Forma+ comparando o repositório com os **6 requisitos do documento final**:

1. **Frontend** (30%): Stack, 3 páginas, A11y, paleta azul+amarelo
2. **Backend** (30%): Node.js+TS, auth, cookies httpOnly, CORS, rotas
3. **Database** (25%): Prisma, unique constraints, indexes, migrations
4. **Deploy** (5%): Vercel intent
5. **Testes** (10%): E2E, Axe, screenshots

## 📊 Status Atual

```
🟠 Score: 69/100
Status: In Progress
Semáforo: Orange
```

**Faltam 16 pontos para atingir 🟢 Verde (≥85)**

## 📂 Arquivos Criados

| Arquivo | Descrição | Tamanho |
|---------|-----------|---------|
| `tools/formaStatus.ts` | Script principal (TypeScript) | 450+ linhas |
| `FORMA_STATUS.json` | Relatório JSON detalhado | Auto-gerado |
| `FORMA_STATUS_GUIDE.md` | Guia de uso completo | 300+ linhas |
| `FORMA_STATUS_REPORT.md` | Relatório executivo | 200+ linhas |
| `FORMA_QUICK_FIX.md` | 5 tarefas rápidas para 92+ | 150+ linhas |
| `package.json` | Script adicionado: `npm run status:forma` | Atualizado |

## 🚀 Como Usar

### Instalação Única

```bash
npm install
```

### Gerar Relatório

```bash
npm run status:forma
```

### Resultado

```
======================================================================
📊 FORMA+ Progress Checker
======================================================================

📱 FRONTEND (Stack + Pages + A11y + Palette)
  ✅ Stack: Next.js
  ✅ Pages: 3/3 (home, contato, pacotes)
  ❌ A11y: <main id="conteudo">, tabIndex, scroll-mt-24
  ✅ Palette: 🔵 (33) 🟡 (3)

🔧 BACKEND (Node.js + TS + Auth + Routes)
  ✅ Entry: src/server/index.ts
  ✅ TypeScript: tsconfig.json + .ts files
  ✅ httpOnly Cookies: res.cookie( with httpOnly: true
  ✅ CORS Credentials: cors({ credentials: true })
  ✅ Endpoints: 11/8+

🗄️  DATABASE (Prisma + Unique + Indexes + Migrations)
  ✅ Prisma: schema.prisma found
  ✅ Unique Constraint: [userId, type, metaHash]
  ✅ Indexes: userId index on PointEvent
  ⚠️ Migrations: 0 files
  ✅ .env: DATABASE_URL found

🚀 DEPLOY (Vercel)
  ⚠️ Vercel Intent: not configured

✅ TESTS (E2E + A11y + Screenshots)
  ✅ E2E: 8 tests in happy-path.spec.ts
  ⚠️ A11y: @axe-core/playwright not found
  ⚠️ Screenshots: 0

======================================================================
🟠  FORMA+ Score: 69/100 — In Progress
======================================================================
```

## 📈 Roadmap para 🟢 Verde

| Prioridade | Tarefa | +Pts | Tempo |
|-----------|--------|------|-------|
| 🔴 CRÍTICA | A11y: `<main id="conteudo">` | +10 | 2 min |
| 🔴 CRÍTICA | Vercel: criar `vercel.json` | +5 | 2 min |
| 🟡 ALTA | Migrations: SQL em `prisma/migrations/` | +5 | 3 min |
| 🟡 ALTA | Axe: `@axe-core/playwright` | +2 | 2 min |
| 🟡 MÉDIA | Screenshots: 3+ em `tests/e2e/__screenshots__/` | +1 | 2 min |

**Total**: ~11 minutos → Score: 92/100 🟢

## 📖 Documentação Recomendada

### Para Começar Agora
👉 **[FORMA_QUICK_FIX.md](./FORMA_QUICK_FIX.md)** — 5 tarefas rápidas (11 min)

### Para Entender Completo
👉 **[FORMA_STATUS_GUIDE.md](./FORMA_STATUS_GUIDE.md)** — Guia detalhado (300 linhas)

### Para Análise Detalhada
👉 **[FORMA_STATUS_REPORT.md](./FORMA_STATUS_REPORT.md)** — Recomendações por categoria

### Para Técnicos
👉 **[tools/formaStatus.ts](./tools/formaStatus.ts)** — Código-fonte (450+ linhas)

## 🔍 O que Cada Seção Verifica

### Frontend (30%)

```
✅ Stack: Vite + React ou Next.js
✅ Páginas: Home, Pacotes, Contato
✅ A11y: <main id="conteudo"> + tabIndex={-1} + scroll-mt-24
✅ Paleta: Cores azul + amarelo (CSS/Tailwind)
```

**Status**: 15/30 pts (A11y está faltando)

### Backend (30%)

```
✅ Entry: src/server.ts ou src/server/index.ts
✅ TypeScript: tsconfig.json + .ts files
✅ Cookies: res.cookie({ httpOnly: true })
✅ CORS: cors({ credentials: true })
✅ Rotas: /auth, /posts, /users/me/points (11 endpoints)
```

**Status**: 30/30 pts ✅

### Database (25%)

```
✅ Prisma: schema.prisma presente
✅ Unique: [userId, type, metaHash] constraint
✅ Indexes: userId indexado
⚠️ Migrations: SQL files
✅ .env: DATABASE_URL
```

**Status**: 20/25 pts (Falta migração)

### Deploy (5%)

```
❌ Vercel: vercel.json, .vercel/, ou script
```

**Status**: 0/5 pts

### Testes (10%)

```
✅ E2E: 8 testes em happy-path.spec.ts
❌ Axe: @axe-core/playwright
❌ Screenshots: 3+ em __screenshots__/
```

**Status**: 7/10 pts

## 💡 Exemplos de Código

### A11y: adicionar em `src/app/layout.tsx`

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body>
        <Header />
        <main id="conteudo" tabIndex={-1} className="scroll-mt-24">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
```

### Vercel: criar `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "env": {
    "DATABASE_URL": "@database_url",
    "JWT_SECRET": "@jwt_secret",
    "NEXT_PUBLIC_API_BASE_URL": "@api_url"
  }
}
```

### Migration: criar `prisma/migrations/20251023.../migration.sql`

```sql
CREATE TABLE `PointEvent` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `userId` VARCHAR(191) NOT NULL,
  `type` VARCHAR(191) NOT NULL,
  `points` INT NOT NULL,
  `metaHash` VARCHAR(191) NOT NULL,
  UNIQUE KEY `PointEvent_userId_type_metaHash_unique` (`userId`, `type`, `metaHash`),
  INDEX `PointEvent_userId_idx` (`userId`)
);
```

### Axe: adicionar em `tests/e2e/happy-path.spec.ts`

```typescript
import { injectAxe, checkA11y } from 'axe-playwright'

test('main page a11y', async ({ page }) => {
  await page.goto('http://localhost:3000')
  await injectAxe(page)
  await checkA11y(page)
})
```

## 🎯 Próximas Etapas

1. **Agora** (11 min):
   ```bash
   # Siga FORMA_QUICK_FIX.md para atingir 92+
   npm run status:forma
   ```

2. **Depois** (30 min):
   - Rodar testes E2E
   - Validar no Vercel
   - Fazer commit

3. **Submeter**:
   - FORMA_STATUS.json no repositório
   - Screenshot do console
   - Link do deploy

## 📊 JSON Output Example

```json
{
  "generatedAt": "2025-10-23T18:38:56.793Z",
  "frontend": {
    "stack": { "vite": false, "next": true },
    "pages": { "expected": ["home", "pacotes", "contato"], "found": ["home", "contato", "pacotes"], "count": 3 },
    "a11yMain": false,
    "palette": { "blueHits": 33, "yellowHits": 3 }
  },
  "backend": {
    "entry": "src/server/index.ts",
    "hasTsconfig": true,
    "httpOnlyCookie": true,
    "corsCredentials": true,
    "endpoints": { "files": [...], "count": 11 }
  },
  "database": {
    "hasPrisma": true,
    "pointEventUniqueByMetaHash": true,
    "hasUserIdIndex": true,
    "migrationFiles": [],
    "sanitizedDatabaseUrl": "..."
  },
  "deploy": { "vercelIntent": false, "hints": [...] },
  "tests": { "happyPathExists": true, "testCount": 8, "hasAxe": false, "screenshots": 0 },
  "score": 69,
  "semaphore": "orange"
}
```

## ⚙️ Configuração Avançada

### Estender o Script

Abra `tools/formaStatus.ts` e adicione novos checks:

```typescript
function checkCustom(): CheckResult {
  const result = /* seu check */
  return {
    ok: result,
    details: ['Seu check aqui']
  }
}
```

### Usar em CI/CD

```yaml
# GitHub Actions
- run: npm run status:forma
- uses: actions/upload-artifact@v3
  with:
    name: forma-status
    path: FORMA_STATUS.json
```

## ❓ FAQ

**P: O script pode quebrar CI?**  
R: Não! Nunca usa `process.exit(1)` — apenas relata.

**P: DATABASE_URL é exposto?**  
R: Não! É mascarado como `user:***@host` no JSON.

**P: Posso rodar sem instalar?**  
R: Não — precisa de `npm install` primeiro para tsx, fast-glob, picocolors.

**P: Quanto tempo demora?**  
R: ~2-3 segundos. Rápido!

**P: Posso rodar em repositório vazio?**  
R: Sim! Marca tudo como falso, sem erro.

## 📞 Suporte

- Erros? Veja `FORMA_STATUS_GUIDE.md#troubleshooting`
- Dúvidas? Leia `FORMA_STATUS.md` (este arquivo)
- Código? Veja `tools/formaStatus.ts` (450+ linhas comentadas)

---

**Versão**: 1.0  
**Última atualização**: 23 de outubro de 2025  
**Status**: 🟠 In Progress (69/100)  
**Meta**: 🟢 Ready for Delivery (92/100 em 11 minutos)
