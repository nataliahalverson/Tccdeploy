# ✅ Checklist de Acessibilidade — Skip Link & Foco (Completo)

## 1. Um `<main>` por rota ✓
- **Criado**: `src/components/Main.tsx` — componente compartilhado com `id="conteudo"`, `tabIndex={-1}`, `scroll-mt-24`
- **Substituído em 8 páginas**:
  - `src/app/page.client.tsx` (Home)
  - `src/app/inicio/page.client.tsx` (Início)
  - `src/app/contato/page.client.tsx` (Contato)
  - `src/app/login/page.client.tsx` (Login)
  - `src/app/pacotes/page.client.tsx` (Pacotes)
  - `src/app/registro/page.client.tsx` (Registro)
  - `src/app/roteiro/page.client.tsx` (Roteiro)
  - `src/app/pacotes/[slug]/page.tsx` (Detalhe de Pacote)
- **Benefício**: Elimina duplicação de código, padroniza o alvo de foco.

## 2. Skip link visível no foco (:focus-visible) ✓
- **Modificado**: `src/app/globals.css` — `.skip-link:focus-visible` com `outline: 2px solid #2563eb` e `outline-offset: 2px`
- **Removido**: `outline: none` que estava anulando o visual
- **Modificado**: `src/components/Header.tsx` — aplicada classe `.skip-link` para estilização correta
- **Benefício**: Usuários de teclado veem o skip link claramente ao tabular.

## 3. Deep-link & Auto-focus ✓
- **Criado**: `src/components/FocusOnRouteChange.tsx` — listener em `pathname` que foca `#conteudo` ao trocar de rota (respeitando hashes)
- **Incluído em**: `src/app/layout.tsx` dentro do `<body>`
- **Comportamento**:
  - Navegar para `/` → auto-foca `#conteudo`
  - Navegar para `/#conteudo` → auto-foca `#conteudo` (deep-link imediato)
  - Navegar para `/pacotes#reserva` → **não rouба foco** da âncora
- **Benefício**: Acessibilidade em SPA, fluxos de navegação de teclado mais intuitivos.

## 4. Fluxo de teclado puro ✓
- **Tab** → foca o skip link
- **Enter** → click no link (`onClick` executa e foca `#conteudo`)
- **Resultado**: `#conteudo` recebe foco sem passos extras
- **URL**: Actualiza para `/#conteudo` (comportamento esperado do `<a href="#conteudo">`)

## 5. Sticky header + scroll-mt-24 ✓
- **Classe**: `scroll-mt-24` adicionada ao `<Main>` (= 6rem offset para Safari/mobile)
- **Comportamento**: Ao focar `#conteudo`, o browser scrolls e deixa espaço acima da vista
- **Benefício**: Conteúdo não fica oculto sob o header sticky.

## 6. DX — Componente `Main` compartilhado ✓
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
- **Uso**: `<Main><section>...</section></Main>` em vez de repetir `<main id="conteudo" tabIndex={-1} className="scroll-mt-24">`
- **Benefício**: Menos repetição, manutenção centralizada, garantia de consistência.

## 7. Playwright — Testes "puro teclado" ✓
- **Criado**: `tests/e2e/accessibility.spec.ts` com 4 testes:
  1. **skip link leva o foco para a região principal** — Tab → Enter → #conteudo focado
  2. **skip link visível no foco** — verifica que não está escondido
  3. **deep-link com /#conteudo foca automaticamente** — URL + 100ms delay
  4. **fluxo de teclado puro em todas as rotas** — testa Tab/Enter em `/`, `/inicio`, `/pacotes`, `/roteiro`, `/contato`, `/login`, `/registro`

- **Comando para rodar**:
  ```bash
  npx playwright test tests/e2e/accessibility.spec.ts
  ```

## 8. Documentação CSS & HTML ✓
- `.skip-link` — posição off-screen até `:focus-visible`, move para `top: 16px` com outline azul
- `#conteudo` — `tabIndex={-1}` (focável por script, não por tab)
- `scroll-mt-24` — altura do header (~6rem) para evitar overlap

---

## 🎯 Resultado Final
✅ Skip link funcional e acessível  
✅ Auto-foco em mudanças de rota (SPA)  
✅ Deep-links (`/#conteudo`) funcionam  
✅ Fluxo puro de teclado: Tab → Enter → foco  
✅ Sem repetição de `<main>`  
✅ Testes Playwright cobrindo casos críticos  
✅ Mobile/Safari: scroll-mt-24 garante visibilidade  

**Status**: ✅ **PRONTO PARA MERGE**
