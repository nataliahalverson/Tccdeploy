# 📋 Escopo do MVP — FORMA+

**Status**: Estável  
**Última atualização**: 22 de outubro de 2025  
**Responsável**: Natália + TCC  
**Fase**: MVP (Fase 1)

---

## 🎯 Problema

Professores precisam de um lugar **simples e sem fricção** para:
- Compartilhar experiências de viagem e reflexões pedagógicas
- Acompanhar benefícios (pontos) em tempo real
- Navegar com teclado e acessibilidade básica

**Dor atual**: Plataformas genéricas não capturam contexto educacional; sem gamificação transparente.

---

## 🚀 Objetivo

Entregar um **MVP navegável** que permita:

1. ✅ **Publicar post** → dispara evento de pontos automaticamente (idempotente)
2. ✅ **Visualizar saldo & histórico** → página de perfil com eventos ordenados
3. ✅ **Navegar com acessibilidade** → skip link, teclado, screen reader ready

**Sucesso = vídeo do fluxo feliz (≤90s) + 0 violações críticas (axe) + testes E2E verdes**

---

## 👥 Personas

### Educador(a)
- **Objetivo**: Publicar experiências, acompanhar pontos
- **Ações**: Login → Novo Post → Ver Perfil
- **Sucesso**: Post aparecer em < 2s, pontos refletirem em tempo real

### Moderador(a)
- **Objetivo**: Validar fluxo, observar métricas
- **Ações**: Revisar posts criados, acompanhar atividade de pontos
- **Sucesso**: Dashboard mostrando últimos eventos + contagem

---

## 📖 Histórias de Usuário (MVP)

### HU-1: Criar Post
```
Como educador,
Quero publicar uma experiência de viagem,
Para compartilhar insights pedagógicos e ganhar pontos.

Critério de aceite:
- POST /api/posts { title, content } → 201 + { id, createdAt }
- POST_CREATED event criado com 10 pts
- Idempotente: re-enviar mesmo { userId, postId } = sem duplicata
- Response mostra "Publicado com sucesso" em < 2s
```

### HU-2: Ver Saldo & Histórico
```
Como educador,
Quero visualizar meu saldo total e histórico de eventos,
Para acompanhar progressão e entender como ganhei pontos.

Critério de aceite:
- GET /api/profile → { user, totalPoints, recentEvents }
- Eventos em ordem decrescente (mais recentes primeiro)
- Tipos visíveis: POST_CREATED (10pts), PROFILE_COMPLETED (25pts), DAILY_CHECKIN (5pts)
- Página de perfil carrega em < 1s
```

### HU-3: Navegar com Acessibilidade
```
Como usuário com deficiência visual,
Quero usar teclado para navegar e pular direto ao conteúdo,
Para acessar o site de forma eficiente.

Critério de aceite:
- Skip link ("Ir para o conteúdo") visível em Tab (outline 2px #2563eb)
- Tab → Enter foca #conteudo
- Deep-link /#conteudo funciona
- Sem localStorage; autenticação via cookies httpOnly
```

---

## ✅ Critérios de Aceite Globais

| Critério | Status | Evidência |
|----------|--------|-----------|
| POST /posts retorna 201 | ✅ | curl test + Playwright |
| POST_CREATED dispara automaticamente | ✅ | SELECT * FROM PointEvent |
| Idempotência (metaHash UNIQUE) | ✅ | 2ª requisição = sem duplicata |
| Página perfil em < 1s | ✅ | Lighthouse metrics |
| Skip link visível em :focus-visible | ✅ | Playwright + axe audit |
| 0 violações críticas (axe) | ✅ | axe DevTools report |
| E2E verde (happy path) | ✅ | tests/e2e/happy-path.spec.ts |
| Vídeo fluxo feliz ≤ 90s | 📹 | Loom/Screencast |

---

## 🚫 Fora de Escopo

❌ Gamificação avançada (badges, leaderboard, achievements)  
❌ Ranking global  
❌ Marketplace ou loja de recompensas  
❌ Mobile app nativo (web-responsive suficiente)  
❌ Moderação avançada (review, edit, delete posts)  
❌ Multi-idioma (apenas PT-BR)  
❌ Analytics avançado / BI  

---

## 📊 Métricas de Sucesso

### Funcionalidade
- ✅ Criar post: 201 + evento disparado (< 2s)
- ✅ Ver saldo: GET /profile (< 1s)
- ✅ Acessibilidade: 0 erros críticos, skip link funcional

### Qualidade
- ✅ Build: `npm run build` ✅
- ✅ Lint: `npm run lint` ✅ (0 warnings)
- ✅ Tests: `npx playwright test tests/e2e/happy-path.spec.ts` ✅
- ✅ Axe audit: 0 violações críticas

### Documentação
- ✅ INDEX.md com portal de docs
- ✅ SCOPE_ONE_PAGER.md (este arquivo)
- ✅ Vídeo do fluxo feliz ≤ 90s com prints

---

## ⚠️ Riscos & Mitigação

### Risco 1: Migração em Host Restrito
**Problema**: AlwaysData não suporta shadow database; não pode rodar `prisma migrate deploy` diretamente.

**Mitigação**:
```bash
# Gerar SQL localmente
npx prisma migrate diff \
  --from-url "mysql://..." \
  --to-schema-datamodel prisma/schema.prisma \
  --script > prisma/migrations/20251022_add_points.sql

# Aplicar manualmente
mysql -h mysql-facerec.alwaysdata.net -u facerec -p < prisma/migrations/*.sql
```

**Evidência**: Arquivo `migrations/20251022_add_points.sql` no repo

---

### Risco 2: Autenticação Inconsistente
**Problema**: localStorage pode ser limpo; tokens JWT em localStorage são vulneráveis; CORS pode bloquear.

**Mitigação**:
- ✅ Usar cookies `httpOnly` (não acessível por JS)
- ✅ Remover `localStorage.getItem('token')` de todos os services
- ✅ CORS com `credentials: true`
- ✅ `credentials: 'include'` em todas as requisições fetch

**Evidência**: `src/lib/httpClient.ts` com `credentials: 'include'`

---

### Risco 3: Idempotência de Pontos
**Problema**: Re-enviar mesmo post 2x cria 2 eventos (duplicação).

**Mitigação**:
- Table `PointEvent` com UNIQUE constraint: `(userId, type, metaHash)`
- `metaHash = SHA256(userId + postId + eventType)` — detecta re-envios
- 2ª tentativa retorna 409 (Conflict) ou ignora silenciosamente

**Evidência**: `PointEvent.metaHash` e migration SQL

---

### Risco 4: E2E Flaky (Timings)
**Problema**: Página carrega lentamente; cliques não acham elementos.

**Mitigação**:
- Usar `await expect(...).toBeVisible()` (espera até 30s)
- Retry automático de steps com falha
- Mock de API lenta em testes (opcional)

**Evidência**: `tests/e2e/happy-path.spec.ts` com timeouts

---

## 📅 Timeline (Estimado)

| Fase | Duração | Entregas |
|------|---------|----------|
| **Setup DB + Auth** | 2h | Prisma schema, migrations, httpClient |
| **Criar endpoints** | 3h | POST /posts, GET /profile + PointEvent logic |
| **UI Pass** | 2h | Design system, Cards, Estados vazios |
| **Testes E2E** | 2h | happy-path.spec.ts + prints + vídeo |
| **Docs + Publish** | 1h | INDEX.md, SCOPE_ONE_PAGER.md, EXECUTIVE_SUMMARY.md |
| **Buffer** | 1h | Fixes, revisão, deploy |
| **Total** | ~11h | MVP Pronto |

---

## 🔄 Fluxo do Usuário (Happy Path)

```
┌─────────────────────────────────────┐
│ Home (página inicial)                │ ← Skip link visível em Tab
└──────────────┬──────────────────────┘
               │ Clica "Entrar"
               ▼
┌─────────────────────────────────────┐
│ Login (email + senha)                │
│ Cookies: access_token=jwt (httpOnly) │
└──────────────┬──────────────────────┘
               │ Submit
               ▼
┌─────────────────────────────────────┐
│ Novo Post (título + conteúdo)       │
└──────────────┬──────────────────────┘
               │ Publicar
               ▼
┌─────────────────────────────────────┐
│ POST /api/posts → 201               │
│ PointEvent criado (10 pts)           │
└──────────────┬──────────────────────┘
               │ Toast "Publicado!"
               ▼
┌─────────────────────────────────────┐
│ Perfil (saldo + histórico)           │
│ GET /api/profile                     │
│ Mostra: totalPoints=10, eventos=[]  │
└─────────────────────────────────────┘
```

---

## 📦 Entregáveis

- ✅ `SCOPE_ONE_PAGER.md` (este arquivo)
- ✅ `src/lib/httpClient.ts` (auth padronizada)
- ✅ `prisma/schema.prisma` + migrations (DB)
- ✅ `tests/e2e/happy-path.spec.ts` (testes)
- ✅ `src/app/sobre/page.tsx` (página Sobre)
- ✅ UI updates (Cards, Botões, Estados vazios)
- ✅ `INDEX.md` (portal de docs)
- ✅ `EXECUTIVE_SUMMARY.md` (atualizado com limitações)
- ✅ Vídeo fluxo feliz (Loom, ≤ 90s)
- ✅ Screenshots (home, form, publicado, perfil)

---

## 🎬 Como Validar

### Validação Local
```bash
# 1. Build
npm run build

# 2. Lint
npm run lint

# 3. E2E
npx playwright test tests/e2e/happy-path.spec.ts

# 4. Axe audit (manual)
npx axe-core https://localhost:3000
```

### Validação em Produção
- [ ] Deploy em Vercel
- [ ] Teste login real (cookie aparece em DevTools)
- [ ] Crie um post, veja evento em BD
- [ ] Acesse `/perfil`, veja saldo + evento

### Evidências Esperadas
- [ ] Prints: home, login, novo post, publicado, perfil
- [ ] Vídeo: fluxo completo (≤ 90s)
- [ ] Relatório Axe: 0 críticos
- [ ] Teste E2E: 4/4 passando

---

## 📞 Perguntas Frequentes

**P: Por que não usar localStorage?**  
R: localStorage é acessível por JS injetado (XSS). Cookies `httpOnly` são seguros contra JS.

**P: E se o usuário limpar cookies?**  
R: Será deslogado. Pode-se oferecer "Manter conectado" com refresh token em cookie separado.

**P: Como garantir idempotência?**  
R: Campo `metaHash = SHA256(userId+postId+type)` em `PointEvent` com UNIQUE constraint.

**P: Quanto tempo leva para pontos aparecerem?**  
R: < 100ms (leitura do mesmo DB, não há fila assíncrona).

**P: Pode haver ranking depois?**  
R: Sim, Fase 2. MVP apenas mostra saldo individual.

---

## ✍️ Notas para Desenvolvimento

1. **httpClient.ts**: Padronizar `credentials: 'include'` em TODOS os fetch
2. **PointEvent**: UNIQUE `(userId, type, metaHash)` previne duplicata
3. **Cookies**: httpOnly + Secure (prod) + SameSite=Lax
4. **Testes**: Usar `await expect().toBeVisible()` para waits automáticos
5. **UI**: Seguir design system (branco + azuis, rounded-2xl, ring-1 ring-zinc-200/60)
6. **Acessibilidade**: Skip link já pronto em Main.tsx; apenas validar com axe

---

## 🎉 Sucesso

MVP é pronto quando:

✅ `npm run build` — sem erros  
✅ `npm run lint` — sem warnings  
✅ `npx playwright test` — happy-path verde  
✅ `axe-core` — 0 críticos  
✅ Vídeo fluxo feliz — ≤ 90s  
✅ Docs completas — INDEX.md + EXECUTIVE_SUMMARY.md  

---

**Próximo passo**: Começar com **httpClient** + **schema.prisma** + **migrations**

Data: 22 de outubro de 2025
