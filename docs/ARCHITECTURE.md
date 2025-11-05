# 🏗️ ARQUITETURA DO PROJETO — FORMA+

## 1. Arquitetura de Alto Nível

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Browser (Chrome, Firefox, Safari, Edge)                   │
│  ├─ React 18.2.0 (Rendering)                              │
│  ├─ Framer Motion (Animations)                            │
│  ├─ Tailwind CSS (Styling)                                │
│  └─ Event handlers (onClick, onChange, etc)               │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                   NETWORK LAYER (HTTP/S)                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Next.js 14.2.5                                            │
│  ├─ App Router (/pages → routes)                          │
│  ├─ Server Components (Metadata, Layouts)                 │
│  ├─ Client Components (Interactivity)                     │
│  ├─ API Routes (Future: /api/*)                          │
│  ├─ Static Export (SSG)                                   │
│  ├─ Image Optimization                                     │
│  └─ Middleware (Future: auth redirects)                   │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                      DATA LAYER                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Data Sources:                                              │
│  ├─ Static: src/data/pacotes.ts (hardcoded)              │
│  ├─ Dynamic: /api/packages (Future)                       │
│  ├─ Database: PostgreSQL (Future)                         │
│  └─ Cache: CDN / Edge (Future)                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 2. Data Flow Architecture

```
         USER ACTION (Click, Type, Navigate)
                      │
                      ▼
         ┌─────────────────────────┐
         │   Event Handler         │
         │   (onClick, onChange)   │
         └────────────┬────────────┘
                      │
                      ▼
         ┌─────────────────────────┐
         │  State Update (useState)│
         │  Re-render Component    │
         └────────────┬────────────┘
                      │
                      ▼
         ┌─────────────────────────┐
         │  Render (JSX)           │
         │  Compute DOM            │
         └────────────┬────────────┘
                      │
                      ▼
         ┌─────────────────────────┐
         │  Virtual DOM Diff       │
         │  (React reconciliation) │
         └────────────┬────────────┘
                      │
                      ▼
         ┌─────────────────────────┐
         │  DOM Update             │
         │  Browser Repaint        │
         └────────────┬────────────┘
                      │
                      ▼
         ┌─────────────────────────┐
         │  CSS Animation          │
         │  (Framer Motion)        │
         └────────────┬────────────┘
                      │
                      ▼
              VISUAL FEEDBACK
```

## 3. File Structure & Dependencies

```
src/
├─ app/
│  ├─ layout.tsx ◄─────────┐
│  │  └─ FocusOnRouteChange│   Root wrapper
│  │  └─ Header            │   Global components
│  │  └─ {children}        │
│  │  └─ Footer            │
│  │                       │
│  ├─ page.tsx            │
│  ├─ page.client.tsx ◄───┤─── Home page
│  ├─ page.module.css     │
│  │                       │
│  ├─ pacotes/            │
│  │  ├─ page.tsx         │
│  │  ├─ page.client.tsx  │   Packages listing
│  │  ├─ page.module.css  │
│  │  └─ [slug]/          │
│  │     └─ page.tsx ◄────┼─── Dynamic detail
│  │                       │   (uses Main.tsx)
│  ├─ contato/            │
│  ├─ login/              │
│  ├─ registro/           │
│  ├─ roteiro/            │
│  ├─ inicio/             │
│  └─ globals.css ◄───────┼─── Global styles
│                          │   (.skip-link, .focus-ring)
├─ components/
│  ├─ Header.tsx ◄────────┼─── Skip link, nav
│  ├─ Main.tsx ◄──────────┼─── <main id="conteudo">
│  ├─ FocusOnRouteChange.tsx   Auto-focus hook
│  ├─ Button.tsx          │
│  ├─ Card.tsx            │   UI primitives
│  ├─ Input.tsx           │
│  ├─ Form.tsx            │
│  ├─ Badge.tsx           │
│  ├─ Carousel.tsx        │
│  ├─ FaqSection.tsx      │
│  ├─ Footer.tsx          │
│  ├─ StepIndicator.tsx   │
│  └─ Breadcrumbs.tsx     │
│
├─ data/
│  └─ pacotes.ts ◄────────── Package definitions
│     └─ getPacoteBySlug()
│
└─ lib/
   └─ links.ts ◄──────────── Route helpers
      ├─ rotaPacote(slug)
      ├─ reservaHref(slug)
      └─ rotaReserva(slug)
```

## 4. Page Rendering Flow

```
User: Clica em link
           │
           ▼
┌──────────────────────┐
│ Next.js Router       │   (useRouter.push)
│ Atualiza pathname    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ FocusOnRouteChange   │   useEffect([pathname])
│ Executa useEffect    │
└──────────┬───────────┘
           │
           ├─ Check: window.location.hash vazio?
           │          SIM: document.getElementById('conteudo')?.focus()
           │          NÃO: return (não interfere)
           │
           ▼
┌──────────────────────┐
│ Server Fetch         │   (page.tsx renderizado)
│ generateMetadata()   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Client Component     │   (page.client.tsx renderizado)
│ Renderiza JSX        │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Hydration            │   (React takeover)
│ Attaches listeners   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Browser Paint        │   (Renderiza pixels)
│ Display change       │
└──────────────────────┘
```

## 5. Component Hierarchy

```
<html>
  <head>
    <title>{metadata.title}</title>
    <meta name="description" content={metadata.description} />
  </head>
  <body>
    <FocusOnRouteChange /> ◄─── Global auto-focus
    
    <Layout>
      <Header>
        <a className="skip-link" href="#conteudo">
          Ir para o conteúdo ◄─── Tab: visível, Enter: foca
        </a>
        <nav>
          <Link href="/" aria-current={pathname === '/'}>
            Home
          </Link>
          ...
        </nav>
      </Header>
      
      <Main> ◄─────────────────── id="conteudo", tabIndex={-1}
        {page.client.tsx}
        
        ├─ <section id="hero">
        │  ├─ <h1>Headline</h1>
        │  ├─ <p>Description</p>
        │  ├─ <Button>CTA</Button>
        │  └─ <motion.div>Animation</motion.div>
        │
        ├─ <section id="features">
        │  └─ {features.map(f => <Card>{f}</Card>)}
        │
        └─ <section id="cta">
           └─ <Form onSubmit={handleSubmit} />
      </Main>
      
      <Footer>
        <p>&copy; 2025 FORMA+</p>
      </Footer>
    </Layout>
  </body>
</html>
```

## 6. State Management

```
┌─────────────────────────────────────────────┐
│  Global State (Future: Zustand / Context)  │
├─────────────────────────────────────────────┤
│                                              │
│  Context:                                   │
│  ├─ User (auth, profile)                   │
│  ├─ Cart (selected packages)               │
│  ├─ Theme (light/dark mode)                │
│  └─ Notification (toasts)                  │
│                                              │
└─────────────────────────────────────────────┘
         │                    │
         ▼                    ▼
┌──────────────┐        ┌──────────────┐
│ Page-level   │        │ Component    │
│ State        │        │ Local State  │
│              │        │              │
│ ├─ Loading   │        │ ├─ isOpen   │
│ ├─ Error     │        │ ├─ formData │
│ └─ Data      │        │ └─ errors   │
└──────────────┘        └──────────────┘
```

## 7. Routing & Navigation

```
App Router (Next.js 14)
│
├─ / (Home)
│  └─ page.tsx → page.client.tsx
│
├─ /inicio (Início)
│  └─ page.tsx → page.client.tsx
│
├─ /pacotes (Packages listing)
│  ├─ page.tsx → page.client.tsx
│  │
│  └─ /[slug] (Dynamic detail)
│     └─ page.tsx (Dynamic render)
│        ├─ generateMetadata({params})
│        ├─ getPacoteBySlug(params.slug)
│        └─ notFound() if not found
│
├─ /roteiro (Roteiros)
│  └─ page.tsx → page.client.tsx
│
├─ /contato (Contato)
│  └─ page.tsx → page.client.tsx
│
├─ /login (Login)
│  └─ page.tsx → page.client.tsx
│
├─ /registro (Registro)
│  └─ page.tsx → page.client.tsx
│
└─ /* (404)
   └─ not-found.tsx
```

## 8. CSS Architecture

```
Global Styles (globals.css)
│
├─ @layer base
│  ├─ html { scroll-smooth }
│  ├─ body { gradient-bg }
│  ├─ h1, h2, h3 { font styles }
│  ├─ .skip-link:focus-visible { outline }
│  └─ ::selection { highlight-color }
│
├─ @layer components
│  ├─ .focus-ring { outline-visible }
│  ├─ .card { shadow + border }
│  ├─ .section { padding }
│  ├─ .container-wide { max-width }
│  └─ .input-field { focus styles }
│
├─ @layer utilities (Tailwind)
│  └─ scroll-mt-24 (offset para header)
│
└─ Module CSS (page.module.css)
   └─ Scoped styles por página
```

## 9. Accessibility Architecture

```
Skip Link Flow:
│
├─ Normal state: off-screen (top: -40px)
│
├─ User: Tab (focus)
│  └─ .skip-link:focus-visible
│     ├─ top: 16px (visible)
│     └─ outline: 2px solid #2563eb (blue)
│
├─ User: Enter
│  └─ onClick Handler
│     └─ document.getElementById('conteudo')?.focus()
│        └─ main#conteudo recebe foco
│
└─ Result: URL hash + focus + scroll


Auto-Focus Flow (SPA):
│
├─ User navega para rota (useRouter.push)
│  └─ pathname muda
│
├─ useEffect([pathname]) executa
│  ├─ window.location.hash vazio?
│  │  └─ SIM: document.getElementById('conteudo')?.focus()
│  └─ window.location.hash NÃO vazio?
│     └─ return (não interfere, deixa hash legítimo)
│
└─ Result: Auto-focus sem roubar âncoras
```

## 10. Performance Optimization

```
Compilation Time:
Next.js 14 → TypeScript → Webpack
         │
         ├─ Code Splitting (automatic)
         ├─ Tree Shaking (unused code)
         ├─ CSS Minification (Tailwind purge)
         ├─ JS Minification (Terser)
         └─ Image Optimization (next/image)

Build Output:
.next/
├─ static/ (immutable cache)
│  ├─ *.css (minified)
│  └─ chunks/*.js (split bundles)
├─ server/ (server runtime)
└─ standalone/ (self-contained)

Runtime Optimization:
├─ SSG (static pre-render)
├─ ISR (incremental static regeneration)
├─ Image lazy-loading
├─ Font optimization
└─ Script optimization
```

## 11. Testing Architecture

```
Test Stack: Playwright
│
├─ E2E Tests
│  ├─ tests/e2e/journey.spec.ts
│  │  └─ User flow: Home → Pacote → Reserva
│  │
│  └─ tests/e2e/accessibility.spec.ts
│     ├─ Skip link functionality
│     ├─ Focus management
│     ├─ Keyboard navigation
│     └─ Rotas (7 páginas)
│
└─ Visual Tests
   └─ tests/visual/home.spec.ts
      ├─ Desktop screenshot
      ├─ Mobile screenshot
      └─ Baseline comparison

Execution:
npx playwright test
├─ Chromium (default)
├─ Firefox (optional)
└─ WebKit (optional)
```

---

**Arquitetura moderna, escalável e acessível** 🚀
