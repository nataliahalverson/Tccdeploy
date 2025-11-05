# 📦 Instalação + Testes (Passo a Passo)

## 1️⃣ Instalar Dependências Backend

```bash
# Dependências principais
npm install express cors cookie-parser jsonwebtoken bcryptjs @prisma/client sanitize-html zod helmet compression express-rate-limit

# Dependências de desenvolvimento
npm install -D @types/express @types/cookie-parser @types/jsonwebtoken @types/bcryptjs @types/sanitize-html ts-node concurrently prisma
```

**Tempo esperado**: 2-3 minutos

---

## 2️⃣ Aplicar Migração SQL (Escolha uma opção)

### Opção A: PowerShell (Windows) ✅ Recomendado
```powershell
# Na raiz do projeto
.\apply-migration.ps1
```

### Opção B: Bash (Linux/macOS)
```bash
./apply-migration.sh
```

### Opção C: MySQL Client (Manual)
```bash
mysql -h mysql-facerec.alwaysdata.net -u facerec -p -D facerec_form < prisma/migrations/20251022_add_user_post_points.sql
# Quando pedir senha: iqmi8j55PDpHQ
```

### Opção D: phpMyAdmin (Web)
1. Acesse: https://phpmyadmin.alwaysdata.com
2. Selecione banco `facerec_form`
3. Clique aba "SQL"
4. Cole conteúdo de `prisma/migrations/20251022_add_user_post_points.sql`
5. Clique "Executar"

**Verificar sucesso**:
```bash
mysql -h mysql-facerec.alwaysdata.net -u facerec -p -D facerec_form -e "SHOW TABLES;"
# Esperado: PointEvent, Post, User
```

**Tempo esperado**: 1 minuto

---

## 3️⃣ Sincronizar Prisma

```bash
npx prisma migrate deploy
npx prisma generate
```

**Verificar sucesso**:
```bash
# Cheque que generated o cliente
ls prisma/client  # Deve existir tipos gerados
```

**Tempo esperado**: 1 minuto

---

## 4️⃣ Rodar Servidor Express

**Terminal 1: Backend**
```bash
npm run dev:server

# Esperado:
# > ts-node src/server/index.ts
# Server running on http://localhost:4000
```

**Terminal 2: Frontend (novo terminal)**
```bash
npm run dev

# Esperado:
# ▲ Next.js 14.2.5
# - Local:        http://localhost:3000
```

---

## 5️⃣ Smoke Tests (Validar Endpoints)

### 5.1 Health Check
```bash
curl -i http://localhost:4000/health

# Esperado (200 OK):
# {
#   "ok": true,
#   "db": true,
#   "timestamp": "2025-10-22T14:30:45.123Z",
#   "env": "development"
# }
```

### 5.2 Register (Novo Usuário)
```bash
# Salvar cookies em arquivo
curl -c cookies.txt -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo_'$(date +%s)'@test.com",
    "password": "demo123456",
    "name": "Demo User"
  }'

# Esperado (201 Created):
# {"user":{"id":"...","email":"...","name":"Demo User"}}
```

### 5.3 Login (Reutilizar Cookies)
```bash
# Reusa arquivo de cookies do register
curl -b cookies.txt -c cookies.txt -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo_<seu-timestamp>@test.com",
    "password": "demo123456"
  }'

# Esperado (200 OK):
# {"user":{"id":"...","email":"...","name":"Demo User"}}
```

### 5.4 Criar Post
```bash
curl -b cookies.txt -X POST http://localhost:4000/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Ouro Preto",
    "content": "Roteiro: cidade histórica em Minas Gerais..."
  }'

# Esperado (201 Created):
# {"id":"...","title":"Ouro Preto","content":"...","userId":"...","createdAt":"..."}
```

### 5.5 Obter Pontos
```bash
curl -b cookies.txt http://localhost:4000/users/me/points

# Esperado (200 OK):
# {
#   "balance": 10,
#   "activities": [
#     {"id":"...","type":"POST_CREATED","points":10,"createdAt":"..."}
#   ]
# }
```

### 5.6 Listar Posts
```bash
curl -b cookies.txt http://localhost:4000/posts

# Esperado (200 OK):
# {"posts":[{"id":"...","title":"Ouro Preto",...}]}
```

### 5.7 Logout
```bash
curl -b cookies.txt -X POST http://localhost:4000/auth/logout

# Esperado (200 OK):
# {"ok":true}
```

---

## 6️⃣ E2E Tests (Playwright)

```bash
npx playwright test tests/e2e/happy-path.spec.ts

# Esperado:
# ✓ 1) happy-path.spec.ts:43 Health check (1.2s)
# ✓ 2) happy-path.spec.ts:89 Registrar novo usuário (2.1s)
# ... (8/8 testes)
# ─────────────────────────────────────
# 8 passed (12.3s)
```

**Com UI interativo**:
```bash
npx playwright test --ui
```

---

## 7️⃣ Validar em Browser

1. Abra `http://localhost:3000`
2. Clique **Login**
3. Preencha com credentials do Smoke Test 5.2
4. Veja cookies em DevTools (F12 → Storage → Cookies)
   - `access_token` deve aparecer com flag `HttpOnly` ✅
5. Clique **Criar Post**
6. Preencha e submeta
7. Vá a **Perfil** → ver saldo de pontos

---

## ✅ Checklist Final

- [ ] `npm install` completou sem erros
- [ ] Migração SQL aplicada (3 tabelas: User, Post, PointEvent)
- [ ] `npx prisma migrate deploy` rodou
- [ ] `npm run dev:server` inicia em porta 4000
- [ ] `curl http://localhost:4000/health` retorna `{ ok: true, db: true }`
- [ ] Smoke tests 5.2–5.7 passam com 200/201 status
- [ ] `npx playwright test` retorna 8/8 passing
- [ ] Cookies aparecem em DevTools (HttpOnly)
- [ ] Frontend consegue criar post + ver pontos

---

## 🐛 Troubleshooting

### Erro: "Cannot find module 'express'"
→ Faltou instalar dependências: `npm install`

### Erro: "ECONNREFUSED 127.0.0.1:4000"
→ Servidor não está rodando: `npm run dev:server`

### Erro: "mysql access denied"
→ Verifique credenciais em `.env` ou mysql command

### Erro: "no such file .env"
→ Copie `.env.example` para `.env` e preencha valores

### Cookies não aparecem em DevTools
→ Verifique em DevTools → Application → Cookies → localhost:3000

### "secure: true" quebra em http://localhost
→ Verifique `NODE_ENV=development` em `.env`

---

## 🚀 Próximos Passos

1. Todos os smoke tests passando? ✅
2. Rodar E2E contra backend real
3. Screenshots para banca (skip link, post, pontos)
4. Vídeo fluxo feliz (≤ 90s)
5. Deploy em Railway/Render

---

**Tempo total esperado**: 30-40 minutos  
**Blocker crítico**: Instalar packages + aplicar SQL  
**Risco**: Mismatch de origin CORS (✅ Verificado com .env template)
