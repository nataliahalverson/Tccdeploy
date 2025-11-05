# 📊 MVP Status Checker

Script TypeScript para verificar o progresso do MVP do projeto Natália TCC.

## Como Usar

### Instalação (primeira vez)
```bash
npm install
```

### Rodar verificação
```bash
npm run status:mvp
```

Isso gera:
- ✅ `MVP_STATUS.json` (na raiz) — Métricas detalhadas em JSON
- 📊 Resumo colorido no console — Semáforo 🟢/🟡/🟠/🔴

## O Que É Verificado

### (A) Documentação (20% do score)
- Presença de 8 arquivos: INDEX.md, SCOPE_ONE_PAGER.md, EXECUTIVE_SUMMARY.md, MIGRATION_GUIDE.md, MVP_IMPLEMENTATION_STATUS.md, MVP_DELIVERY.md, DELIVERY_SUMMARY.md, .env.example

### (B) Frontend (20% do score)
- Skip link (`<main id="conteudo"`)
- Focus ring CSS (`.focus-ring`)
- Scroll margin (`scroll-mt-24`)
- Uso de `rotaReserva()`
- **Sem** localStorage.getItem('token')
- httpClient com `credentials: 'include'`

### (C) Backend (25% do score)
- Servidor Express (src/server/index.ts ou src/server.ts)
- Rotas (auth.ts, posts.ts, profile.ts)
- Cookies com `httpOnly: true`
- CORS com `credentials: true`
- Rota `/health`

### (D) Banco/Prisma (20% do score)
- Prisma schema com `@@unique([userId, type, metaHash])`
- Índice em userId
- Arquivos de migração SQL

### (E) Testes (15% do score)
- Arquivo happy-path.spec.ts
- Contagem de testes (esperado: 8+)
- Presença de @axe-core/playwright (a11y)

## Score e Semáforo

```
Score >= 85   → 🟢 Green   (Pronto para deploy)
70-84         → 🟡 Yellow  (Revisar itens pendentes)
50-69         → 🟠 Orange  (Muitas correções necessárias)
< 50          → 🔴 Red     (MVP incompleto)
```

## Exemplo de Output

```
📊 MVP Status Checker — Natália TCC

Rodando em: /Users/seu-usuario/projetos/natalia

📋 Resumo do MVP Status

🟢 Score Total: 92/100

Seções:

  📚 Documentação   100%    (8/8)
  🎨 Frontend       85%     (6 páginas com skip link)
  ⚙️  Backend        95%     (12 endpoints)
  🗄️  Database       100%    (1 migrações)
  🧪 Testes         100%    (8 testes E2E)

✅ MVP_STATUS.json gerado com sucesso!

🚀 Próximos passos:

   • Frontend: revisar acessibilidade e skip links
```

## MVP_STATUS.json (Saída)

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

## Manutenção & Extensão

### Adicionar novo check

1. Criar função em `tools/mvpStatus.ts`:
```typescript
function checkMyFeature(): { result: CheckResult; score: number } {
  const checks = { /* ... */ };
  const score = (/* calc */ ) * 100;
  return { result: { ok: true, details: checks }, score };
}
```

2. Adicionar à `main()`:
```typescript
const myResult = checkMyFeature();
```

3. Adicionar ao peso total:
```typescript
const weights = { ..., myFeature: 0.1 };
const totalScore = ... + myResult.score * weights.myFeature;
```

### Modificar pesos
Edite `weights` em `main()`:
```typescript
const weights = {
  docs: 0.2,
  frontend: 0.2,
  backend: 0.25,
  database: 0.2,
  tests: 0.15,
};
```

## Troubleshooting

### "tsx: command not found"
→ Instale: `npm install -D tsx`

### "No such file: MVP_STATUS.json"
→ Script rodou mas sem permissão de escrita. Verifique permissões da pasta.

### Score está 0%
→ Verifique se paths relativos estão corretos (assumem raiz do repo).

## CI/CD Integration

Para rodar em CI sem quebrar:
```bash
npm run status:mvp || true
git add MVP_STATUS.json
```

Script **nunca** faz `process.exit(1)`. Apenas relata erros em `.errors[]`.

---

**Versão**: 1.0  
**Criado**: 23 de outubro de 2025  
**Responsável**: GitHub Copilot
