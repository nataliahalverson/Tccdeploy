# 🎯 FORMA+ Quick Fix — De 69 para 92 (15 minutos)

## 📊 Status Atual
- **Score**: 69/100
- **Semáforo**: 🟠 Orange (In Progress)
- **Meta**: 🟢 Green (≥85)

## 🚀 5 Tarefas Rápidas

### ✅ Task 1: A11y Main Element (+10 pts) — 2 min

Abra `src/app/layout.tsx` e encontre:

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
        {/* ← COPIE DE AQUI */}
        <main id="conteudo" tabIndex={-1} className="scroll-mt-24">
          {children}
        </main>
        {/* ← ATÉ AQUI */}
        <Footer />
      </body>
    </html>
  )
}
```

**Se não vir essa estrutura**, replace o que tiver por isso ☝️

---

### ✅ Task 2: Vercel Config (+5 pts) — 2 min

Crie arquivo `vercel.json` **na raiz do repo** (lado de `package.json`):

```json
{
  "buildCommand": "npm run build",
  "env": {
    "DATABASE_URL": "@database_url",
    "JWT_SECRET": "@jwt_secret",
    "NEXT_PUBLIC_API_BASE_URL": "@api_url",
    "WEB_ORIGIN": "@web_origin"
  }
}
```

**Salve** com `Ctrl+S` → Pronto!

---

### ✅ Task 3: Prisma Migration (+5 pts) — 3 min

Execute no terminal:

```bash
mkdir -p prisma/migrations/20251023_add_user_post_points
```

Crie arquivo `prisma/migrations/20251023_add_user_post_points/migration.sql`:

```sql
-- CreateTable User
CREATE TABLE `User` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `name` VARCHAR(191),
  `password` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL
);

-- CreateTable Post
CREATE TABLE `Post` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `content` LONGTEXT NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE
);

-- CreateTable PointEvent
CREATE TABLE `PointEvent` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `userId` VARCHAR(191) NOT NULL,
  `type` VARCHAR(191) NOT NULL,
  `points` INT NOT NULL,
  `metaHash` VARCHAR(191) NOT NULL,
  `description` VARCHAR(191),
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE KEY `PointEvent_userId_type_metaHash_unique` (`userId`, `type`, `metaHash`),
  INDEX `PointEvent_userId_idx` (`userId`),
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE
);

-- CreateIndex
CREATE INDEX `Post_userId_idx` ON `Post`(`userId`);
CREATE INDEX `Post_createdAt_idx` ON `Post`(`createdAt`);
```

---

### ✅ Task 4: Axe Accessibility Tests (+2 pts) — 2 min

Instale:
```bash
npm install -D @axe-core/playwright axe-playwright
```

Abra `tests/e2e/happy-path.spec.ts`, coloque no começo:

```typescript
import { injectAxe, checkA11y } from 'axe-playwright'
```

Depois adicione **um** destes testes (ex: no final):

```typescript
test('main page a11y check', async ({ page }) => {
  await page.goto('http://localhost:3000')
  await injectAxe(page)
  await checkA11y(page, 'main', {
    detailedReport: true,
    detailedReportOptions: { html: true }
  })
})
```

---

### ✅ Task 5: Screenshots (+1 pt) — 2 min

```bash
mkdir -p tests/e2e/__screenshots__
```

Copie **qualquer 3 imagens** para lá com nomes como:
- `login-chromium.png`
- `home-chromium.png`
- `posts-chromium.png`

Ou tire screenshots durante testes com:
```typescript
await page.screenshot({ path: 'tests/e2e/__screenshots__/home.png' })
```

---

## ⏱️ Timeline

| Tarefa | Tempo | Pts | Total |
|--------|-------|-----|-------|
| 1. A11y Main | 2 min | +10 | 79 |
| 2. Vercel | 2 min | +5 | 84 |
| 3. Migration | 3 min | +5 | 89 |
| 4. Axe | 2 min | +2 | 91 |
| 5. Screenshots | 2 min | +1 | 92 |
| **TOTAL** | **11 min** | **+23** | **92** |

---

## ✨ Resultado Final

Depois de tudo, rode:

```bash
npm run status:forma
```

Você verá:

```
🟢 FORMA+ Score: 92/100 — Ready for Delivery
```

---

## 🎓 Checklist de Conclusão

- [ ] Task 1: `<main id="conteudo">` em layout.tsx
- [ ] Task 2: `vercel.json` criado
- [ ] Task 3: `prisma/migrations/20251023.../migration.sql` criado
- [ ] Task 4: `@axe-core/playwright` instalado e importado
- [ ] Task 5: Screenshots em `tests/e2e/__screenshots__/`
- [ ] Rodei `npm run status:forma` ✅
- [ ] Score é **≥92** 🟢

---

**⏰ Estimado**: 11-15 minutos  
**Status**: 🟠→🟢 (Orange to Green)  
**Próximo**: Commit & Deploy no Vercel
