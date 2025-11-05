# 🚀 Como Usar o MVP Status Checker

**Data**: 23 de outubro de 2025  
**Versão**: 1.0  

---

## ⚡ Quick Start (3 passos)

### 1. Instalar dependências
```bash
npm install
```

### 2. Rodar o status check
```bash
npm run status:mvp
```

### 3. Ver resultado
- Console mostra 🟢/🟡/🟠/🔴 + score
- Arquivo `MVP_STATUS.json` é gerado na raiz

---

## 📊 Entender o Output

### Console (Exemplo)

```
📊 MVP Status Checker — Natália TCC

Rodando em: c:\Users\seu-usuario\Desktop\natalia

📋 Resumo do MVP Status

🟢 Score Total: 92/100

Seções:

  📚 Documentação   100%    (8/8)
  🎨 Frontend       85%     (6 páginas com skip link)
  ⚙️  Backend        95%     (12 endpoints)
  🗄️  Database       100%    (1 migrações)
  🧪 Testes         100%    (8 testes E2E)

✅ MVP_STATUS.json gerado com sucesso!

⚠️  Avisos Frontend:

   ⚠️ httpClient não tem credentials: include — necessário para CORS + cookies

🚀 Próximos passos:

   • Frontend: revisar acessibilidade e skip links
```

### MVP_STATUS.json (Estrutura)

```json
{
  "generatedAt": "2025-10-23T10:30:45.123Z",
  
  "docs": {
    "expected": ["INDEX.md", "SCOPE_ONE_PAGER.md", ...],
    "present": ["INDEX.md", "SCOPE_ONE_PAGER.md", ...],
    "missing": [],
    "score": 100
  },
  
  "frontend": {
    "pagesWithMain": 6,
    "focusRing": true,
    "scrollMt": true,
    "rotaReserva": true,
    "noLocalStorageToken": true,
    "httpClientCredentialsInclude": true,
    "score": 85
  },
  
  "backend": {
    "serverEntry": "src/server/index.ts",
    "routesFound": ["src/server/routes/auth.ts", ...],
    "endpointsCount": 12,
    "httpOnlyCookie": true,
    "corsCredentials": true,
    "hasHealth": true,
    "score": 95
  },
  
  "database": {
    "hasPointEventUniqueMetaHash": true,
    "hasUserIdIndex": true,
    "migrationFiles": ["prisma/migrations/20251022_add_user_post_points.sql"],
    "sanitizedDatabaseUrl": "mysql://facerec:***@mysql-facerec.alwaysdata.net:3306/facerec_form",
    "score": 100
  },
  
  "tests": {
    "happyPathExists": true,
    "testCount": 8,
    "hasAxe": false,
    "score": 100
  },
  
  "totalScore": 92,
  "semaphore": "green"
}
```

---

## 🎯 Interpretar Scores

### Score Global

```
Score >= 85   → 🟢 GREEN   (Pronto para produção)
70-84         → 🟡 YELLOW  (Revisar antes de deploy)
50-69         → 🟠 ORANGE  (Muitas correções necessárias)
< 50          → 🔴 RED     (MVP incompleto, voltar ao planning)
```

### Score por Seção

| Seção | % Peso | O Que Significa |
|-------|--------|-----------------|
| **Documentação** | 20% | Arquivos fundamentais (escopo, arquitetura, setup) |
| **Frontend** | 20% | Acessibilidade, autenticação, integração |
| **Backend** | 25% | Express, rotas, autenticação, segurança |
| **Database** | 20% | Prisma schema, constraints, migrações |
| **Testes** | 15% | E2E, smoke tests, a11y checks |

---

## ✅ Checklist: O Que Cada Seção Verifica

### 📚 Documentação (20%)

```
✓ INDEX.md                     → Navegação
✓ SCOPE_ONE_PAGER.md          → Escopo do MVP
✓ EXECUTIVE_SUMMARY.md        → Resumo executivo
✓ MIGRATION_GUIDE.md          → Setup do banco
✓ MVP_IMPLEMENTATION_STATUS.md → Status fase 1
✓ MVP_DELIVERY.md             → Delivery final
✓ DELIVERY_SUMMARY.md         → Summary visual
✓ .env.example                → Template de config
```

**Esperado**: 8/8 = 100%

### 🎨 Frontend (20%)

```
✓ Skip link          → <main id="conteudo"> em páginas
✓ Focus ring CSS     → .focus-ring definido em globals.css
✓ Scroll margin      → scroll-mt-24 em layout.tsx
✓ CTAs funcionar     → rotaReserva() utilizado nos cards
✓ Sem localStorage   → Nenhum localStorage.getItem('token')
✓ httpClient seguro  → credentials: 'include' configurado
```

**Esperado**: 6/6 = 100%

### ⚙️ Backend (25%)

```
✓ Servidor Express   → src/server/index.ts ou src/server.ts
✓ Routes criadas     → src/server/routes/auth.ts, posts.ts, profile.ts
✓ Endpoints          → Contar via regex router.(get|post|delete|put)
✓ Cookies httpOnly   → httpOnly: true em res.cookie()
✓ CORS credentials   → credentials: true em cors()
✓ Health check       → GET /health endpoint
```

**Esperado**: 6/6 = 100%

### 🗄️ Database (20%)

```
✓ Unique metaHash    → @@unique([userId, type, metaHash]) em schema
✓ Índice userId      → @@index([userId]) em schema
✓ Migrações SQL      → Arquivos em prisma/migrations/
✓ .env DATABASE_URL  → Variável de conexão ao banco
```

**Esperado**: 4/4 = 100%

### 🧪 Testes (15%)

```
✓ happy-path.spec.ts → Arquivo existe em tests/e2e/
✓ Test count         → Pelo menos 8 test(...) cases
✓ Axe a11y check     → @axe-core/playwright importado
```

**Esperado**: 3/3 = 100%

---

## 🔧 Rodar Periodicamente

### Desenvolvimento

```bash
# Toda vez que fizer mudanças críticas
npm run status:mvp
git add MVP_STATUS.json
git commit -m "chore: update MVP status"
```

### CI/CD (GitHub Actions)

```yaml
- name: Check MVP Status
  run: npm run status:mvp || true
  
- name: Commit status
  run: |
    git add MVP_STATUS.json
    git diff --quiet && git diff --staged --quiet || \
    (git commit -m "chore: update MVP status" && git push)
```

### Pre-Deploy

Rodar antes de fazer deploy:
```bash
npm run status:mvp
# Se score < 85, revisar antes de prosseguir
```

---

## 🚨 Troubleshooting

### Problema: "Score baixo em Frontend"

**Causa comum**: httpClient sem `credentials: 'include'`

**Solução**:
1. Abra `src/lib/httpClient.ts`
2. Procure por `fetch(...)`
3. Adicione: `credentials: 'include'` nas opções

```typescript
const response = await fetch(url, {
  method,
  headers,
  credentials: 'include',  // ← Adicionar
  body: method !== 'GET' ? JSON.stringify(data) : undefined,
});
```

### Problema: "Score baixo em Backend"

**Causa comum**: Cookies sem `httpOnly: true`

**Solução**:
1. Abra `src/server/routes/auth.ts`
2. Procure por `res.cookie(`
3. Adicione: `httpOnly: true`

```typescript
res.cookie(cookieName, token, {
  httpOnly: true,  // ← Adicionar
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
});
```

### Problema: "Score baixo em Database"

**Causa comum**: Schema Prisma sem constraints

**Solução**:
1. Abra `prisma/schema.prisma`
2. Procure por `model PointEvent`
3. Adicione abaixo do modelo:

```prisma
model PointEvent {
  id        String   @id @default(cuid())
  userId    String
  type      String
  points    Int
  meta      Json
  metaHash  String

  @@unique([userId, type, metaHash])
  @@index([userId])
}
```

### Problema: "Arquivo MVP_STATUS.json não aparece"

**Causa comum**: Sem permissão de escrita

**Solução**:
```bash
# Verificar permissões
ls -la MVP_STATUS.json

# Se não existe, criar manualmente
touch MVP_STATUS.json

# Rerun
npm run status:mvp
```

### Problema: "tsx: command not found"

**Solução**:
```bash
npm install -D tsx
npm run status:mvp
```

---

## 📈 Tracking Progress Over Time

### Guardar snapshots históricos

```bash
# Cada dia/semana, rodar:
npm run status:mvp
cp MVP_STATUS.json MVP_STATUS_$(date +%Y%m%d_%H%M%S).json

# Para comparar progresso:
ls MVP_STATUS_*.json | tail -5
```

### Análise simples (bash)

```bash
# Ver score total
jq '.totalScore' MVP_STATUS.json

# Ver semáforo
jq '.semaphore' MVP_STATUS.json

# Ver score por seção
jq '.docs.score, .frontend.score, .backend.score, .database.score, .tests.score' MVP_STATUS.json
```

---

## 🎓 Para Banca/Apresentação

### Gerar relatório bonito

```bash
npm run status:mvp
cat MVP_STATUS.json | jq .
```

### Interpretar para apresentação

```
"Score: 92/100 — 🟢 GREEN"
→ Projeto está pronto para produção

"Score: 76/100 — 🟡 YELLOW"
→ Projeto está quase pronto, verificar alertas

"Score: 58/100 — 🟠 ORANGE"
→ Projeto precisa de revisões antes de deploy
```

---

## 📞 Suporte

Se o script não rodar:

1. ✅ Instalar: `npm install`
2. ✅ Verificar: `npm run status:mvp`
3. ✅ Se erro, copiar: `MVP_STATUS.json` gerado
4. ✅ Revisar: Logs no console

**Script nunca quebra a build** — apenas relata status.

---

**Próximo passo**: `npm run status:mvp` 🚀
