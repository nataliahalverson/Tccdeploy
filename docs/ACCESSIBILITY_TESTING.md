# 🚀 Guia de Testes — Skip Link & Acessibilidade

## Quick Start

### 1. Build & Dev
```bash
npm run build     # ✓ Deve passar sem erros
npm run lint      # ✓ Sem ESLint warnings
npm run dev       # Inicia servidor em localhost:3000
```

### 2. Teste Manual (Teclado Puro)

#### No navegador:
1. Abra [http://localhost:3000](http://localhost:3000)
2. Pressione **Tab** uma vez → Skip link fica visível com outline azul
3. Pressione **Enter** → Foco pula para a região principal (`<main id="conteudo">`)
4. A página scrolls suavemente (scroll-mt-24 em ação)

#### Teste em outras rotas:
- `/inicio` → Tab → Skip link visível
- `/pacotes` → Tab → Skip link visível
- `/roteiro` → Tab → Skip link visível
- `/contato` → Tab → Skip link visível
- `/login` → Tab → Skip link visível
- `/registro` → Tab → Skip link visível
- `/pacotes/porto-seguro-3d2n` → Tab → Skip link visível

#### Deep-link:
1. Abra [http://localhost:3000/#conteudo](http://localhost:3000/#conteudo)
2. Observe que a página foca automaticamente `#conteudo` após ~100ms
3. Teste em múltiplas rotas: `http://localhost:3000/inicio#conteudo`

#### Âncoras não roubadas:
1. Abra [http://localhost:3000/pacotes/porto-seguro-3d2n#reserva](http://localhost:3000/pacotes/porto-seguro-3d2n#reserva)
2. A página **não foca automaticamente** em `#conteudo`, mantém o foco normal
3. O hash permanece em `#reserva` como esperado

---

### 3. Teste Automatizado (Playwright)

```bash
# Rodar todos os testes de acessibilidade
npx playwright test tests/e2e/accessibility.spec.ts

# Rodar um teste específico
npx playwright test tests/e2e/accessibility.spec.ts -g "skip link leva"

# Modo watch
npx playwright test tests/e2e/accessibility.spec.ts --watch

# Com UI
npx playwright test tests/e2e/accessibility.spec.ts --ui
```

**Testes inclusos**:
- ✅ `skip link leva o foco para a região principal`
- ✅ `skip link visível no foco`
- ✅ `deep-link com /#conteudo foca automaticamente`
- ✅ `fluxo de teclado puro em todas as rotas`

---

### 4. Inspeção no DevTools

#### Chrome/Edge:
1. Abra DevTools (F12)
2. Acesse **Elements** → Busque por `#conteudo`
3. No console, execute:
   ```javascript
   document.getElementById('conteudo').focus();
   console.log(document.activeElement); // Deve ser: <main id="conteudo">
   ```

#### Accessibility Tree:
1. DevTools → **Accessibility** panel
2. Procure por `#conteudo` na árvore
3. Verifique que `tabIndex="-1"` está presente

---

### 5. Checklist de Validação

- [ ] Build passa: `npm run build` ✓
- [ ] Lint passa: `npm run lint` ✓
- [ ] Skip link visível ao tabular (outline azul)
- [ ] Tab → Enter → foco em `#conteudo`
- [ ] Deep-link `/#conteudo` foca automaticamente
- [ ] Deep-link `#reserva` **não é roubado**
- [ ] Todas as 7 rotas têm skip link funcional
- [ ] Scroll-mt-24 mantém conteúdo visível sob header sticky
- [ ] Playwright tests passam: `npx playwright test tests/e2e/accessibility.spec.ts`
- [ ] Nenhum erro TypeScript

---

## 🎯 Componentes Principais

### `src/components/Main.tsx`
```typescript
export default function Main(
  props: React.PropsWithChildren<{ className?: string }>
) {
  return (
    <main id="conteudo" tabIndex={-1} className={`scroll-mt-24 ${props.className ?? ''}`}>
      {props.children}
    </main>
  )
}
```

### `src/components/FocusOnRouteChange.tsx`
Auto-foca `#conteudo` quando a rota muda (SPA), mas respeita hashes existentes.

### `src/components/Header.tsx`
Skip link com classe `.skip-link` (estilos em `globals.css`).

### `src/app/globals.css`
```css
.skip-link:focus-visible {
  top: 16px;
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}
```

---

## 📊 Métricas de Sucesso

| Métrica | Status | Nota |
|---------|--------|------|
| Build | ✅ | Sem erros TypeScript |
| Lint | ✅ | Sem ESLint warnings |
| Skip link visível | ✅ | `:focus-visible` com outline |
| Foco automático | ✅ | `FocusOnRouteChange` ativo |
| Deep-links | ✅ | `/#conteudo` foca imediatamente |
| Rotas cobertas | ✅ | 7 páginas + detalhe |
| Testes Playwright | ✅ | 4 casos críticos |
| Mobile/Safari | ✅ | `scroll-mt-24` garante visibilidade |

---

## 🆘 Troubleshooting

### Skip link não aparece ao tabular
- Verifique que `src/components/Header.tsx` existe e exporta componente correto
- Verifique que `.skip-link` em `globals.css` não tem `display: none`
- Verifique que `z-index: 1000` permite que seja visível acima do header

### Foco não se move ao pressionar Enter no skip link
- Verifique que `onClick` em `Header.tsx` chama `document.getElementById('conteudo')?.focus()`
- Verifique que `#conteudo` tem `tabIndex={-1}` (não `0`)
- Verifique que não há JavaScript conflitante focando outro elemento

### Deep-link `/#conteudo` não foca
- Verifique que `src/components/FocusOnRouteChange.tsx` está incluído em `layout.tsx`
- Verifique que há `useEffect` com `[pathname]` dependency
- Verifique que `window.location.hash` é verificado (para não roubar hashes legítimos)

### Scroll-mt-24 não funciona em Safari mobile
- Verifique que `main` tem `scroll-mt-24` (não `div`)
- Verifique que header tem `position: sticky; top: 0; z-index: 50`
- Se persistir, teste com `scroll-behavior: smooth` em `html`

---

## 📝 Próximos Passos (Opcional)

1. **Axe-core**: Integrar varredura de a11y com `@axe-core/playwright`
2. **ARIA**: Expandir labels de seções com `aria-labelledby`
3. **Focus ring customizado**: Usar utility do Tailwind em vez de CSS puro
4. **Keyboard shortcuts**: Documentar atalhos globais (ex: `/` para busca)

---

**Versão**: 1.0  
**Último update**: 22 de outubro de 2025  
**Status**: ✅ Pronto para Produção
