# 🎓 Prova Final para Banca — Demonstração Rápida

**Tempo total**: ≤ 5 minutos  
**Requisitos**: Servidor rodando + Navegador + DevTools aberto

---

## 1️⃣ Setup Inicial (Se não estiver rodando)

```bash
# Terminal 1: Backend
npm run dev:server

# Terminal 2: Frontend (novo terminal)
npm run dev

# Esperar até ver:
# ▲ Next.js 14.2.5 - Local: http://localhost:3000
# Server running on http://localhost:4000
```

---

## 2️⃣ Fluxo de Demonstração (3 min)

### Passo 1: Abrir DevTools (F12)
- Aba **Application** → **Cookies**
- Aba **Network** (para ver requisições)

### Passo 2: Ir para Login
- Acesse: http://localhost:3000
- Clique em **Login**

### Passo 3: Registrar Novo Usuário
- Email: `demo@formaturapp.com.br`
- Senha: `Formatur@2025` (mínimo 8 caracteres)
- Nome: `Usuário Demo`
- Clique **Criar Conta**

**Esperado**:
- ✅ Redirecionado para Dashboard
- ✅ Cookies → `access_token` aparece (HttpOnly ✅)
- ✅ Network → POST `/auth/register` (201 Created)
- ✅ Network → POST `/auth/login` (200 OK)

### Passo 4: Criar Novo Post
- Clique em **Novo Post** (ou aba Posts)
- Título: `Ouro Preto - Roteiro Histórico`
- Conteúdo: `Visita à cidade histórica com igrejas barrocas do século XVIII...`
- Clique **Publicar**

**Esperado**:
- ✅ POST criado na lista
- ✅ Saldo de pontos aumenta para **10** (POST_CREATED)
- ✅ Network → POST `/posts` (201 Created)
- ✅ Network → background call to awardPoints (async)

### Passo 5: Verificar Pontos
- Clique em **Perfil**
- Verifique **Saldo: 10**
- Verifique histórico: `POST_CREATED (10 pontos)`

**Esperado**:
- ✅ GET `/users/me/points` (200 OK)
- ✅ Resposta: `{ balance: 10, activities: [...] }`

### Passo 6: Testar Idempotência (Bônus)
- Clique em **Novo Post** novamente
- Título: `Rio de Janeiro - Praias`
- Conteúdo: `Praia de Copacabana, Ipanema, Leblon...`
- **Submeta 2x rapidamente** (ou refaça o POST com curl)

**Esperado**:
- ❌ Post criado apenas 1x (chave primária)
- ❌ Pontos concedidos apenas 1x (metaHash UNIQUE)
- ✅ Saldo permanece em 20 (não 30)

---

## 3️⃣ Verificações Visuais (Screenshots para Banca)

### Screenshot 1: Login
Mostrar:
- ✅ Campos Email + Senha preenchidos
- ✅ Botão "Criar Conta" funcionando
- ✅ Redirecionamento após sucesso

### Screenshot 2: Perfil com Pontos
Mostrar:
- ✅ Nome + Email do usuário
- ✅ Saldo: **10 pontos**
- ✅ Histórico com timestamp: `POST_CREATED (10) — 2025-10-22 14:30:45`

### Screenshot 3: DevTools → Cookies
Mostrar:
- ✅ Cookie `access_token` com flag **HttpOnly** ✅
- ✅ Domain: `localhost`
- ✅ Path: `/`

### Screenshot 4: DevTools → Network (POST login)
Mostrar:
- ✅ Request: POST `/auth/login`
- ✅ Response Headers: `Set-Cookie: access_token=...`
- ✅ Status: **200 OK**

### Screenshot 5: Acessibilidade (Skip Link)
Mostrar:
- ✅ Tab para primeira interação
- ✅ Botão "Pular para Conteúdo" focado
- ✅ Cores com contraste (WCAG AA)

---

## 4️⃣ Teste Automatizado (E2E)

```bash
# Rodar testes Playwright
npx playwright test tests/e2e/happy-path.spec.ts

# Esperado:
# ✓ 1) happy-path.spec.ts:43 Health check (1.2s)
# ✓ 2) happy-path.spec.ts:89 Registrar novo usuário (2.1s)
# ✓ 3) happy-path.spec.ts:142 Login com credenciais (1.8s)
# ✓ 4) happy-path.spec.ts:195 Criar post (1.5s)
# ✓ 5) happy-path.spec.ts:240 Obter pontos (1.2s)
# ✓ 6) happy-path.spec.ts:280 Idempotência de pontos (2.1s)
# ✓ 7) happy-path.spec.ts:330 Deletar post (1.1s)
# ✓ 8) happy-path.spec.ts:370 Logout + nova sessão (1.8s)
# ─────────────────────────────────────────────────
# 8 passed (12.3s)
```

**Print this output** para mostrar à banca.

---

## 5️⃣ Curl Smoke Tests (Terminal)

```bash
# Health check
curl -i http://localhost:4000/health

# Esperado:
# HTTP/1.1 200 OK
# {"ok":true,"db":true,"timestamp":"2025-10-22T...","env":"development"}
```

---

## 🎯 Checklist Visual para Banca

- [ ] Página inicial carregada
- [ ] Register → Login → Dashboard funciona
- [ ] Novo Post criado com sucesso
- [ ] Pontos aparecem no Perfil (10 pts)
- [ ] Cookies HttpOnly visíveis em DevTools
- [ ] Network requests aparecem em DevTools
- [ ] E2E tests passam (8/8)
- [ ] Curl health check retorna 200

---

## ❓ FAQ durante demonstração

**P: Como funciona a autenticação?**  
R: JWT em cookie HttpOnly. Não é acessível por JavaScript (seguro contra XSS). O browser envia automaticamente com cada request.

**P: Por que idempotência?**  
R: Se o usuário clica "Publicar" 2x e o servidor recebe 2x, o post e pontos são criados 1x apenas (via UNIQUE metaHash).

**P: Onde rodam as consultas do banco?**  
R: Backend Express (porta 4000) conecta a MySQL AlwaysData. Frontend consome via API REST.

**P: Como foi feito o deploy?**  
R: Backend em Railway/Render (CI/CD automático). Frontend em Vercel (GitHub integration). Banco em AlwaysData (painel web).

---

## 📞 Suporte Rápido (Problemas Comuns)

| Problema | Solução |
|----------|---------|
| "Conexão recusada porta 4000" | Rode `npm run dev:server` em novo terminal |
| "Cookies não aparecem" | Abra DevTools (F12) → Application → Cookies |
| "CORS error" | Verifique `.env` → `WEB_ORIGIN` = `http://localhost:3000` |
| "500 em POST /posts" | Verifique Prisma: `npx prisma generate` |
| "E2E falha" | Backend rodando? Verifique `npm run dev:server` |

---

## 📊 Documentação Adicional

Para banca que quer investigar mais:

| Documento | O quê |
|-----------|-------|
| **GO_LIVE_CHECKLIST.md** | 10 itens que costumam quebrar (CORS, .env, cookies, etc.) |
| **BACKEND_SETUP.md** | Como o backend foi configurado |
| **BACKEND_IMPLEMENTATION.md** | Arquitetura + endpoints |
| **MIGRATION_GUIDE.md** | Como o banco foi inicializado |
| **SCOPE_ONE_PAGER.md** | Escopo do MVP (personas, histórias de usuário) |

---

## 🎬 Vídeo Demo (Opcional)

Se possível, grave ≤ 90 segundos:
1. Clique Register (2s)
2. Preencha formulário (3s)
3. Login automático (2s)
4. Clique Novo Post (2s)
5. Escreva + Publicar (3s)
6. Veja pontos aparecer (2s)
7. DevTools mostrando cookies (3s)
8. Fim (≤ 90s total)

**Ferramentas**: OBS Studio (grátis) ou Loom

---

**Status**: ✅ Pronto para apresentação  
**Duração**: 5 min máximo  
**Risco**: Nenhum (tudo é local, sem internet necessária)
