# FORMA+ — Guia Rápido de Desenvolvimento

## 🎯 Visão Geral

Este projeto é uma aplicação moderna de viagem de formatura construída com **Next.js 14 + TypeScript + CSS Modules**. Todas as páginas HTML legadas foram transformadas em componentes React.

## 📦 Dependências Principais

- `next@14.2.5` — Framework React
- `react@18.2.0` — Biblioteca UI
- `typescript@5.4.5` — Type safety

## 🏗️ Arquitetura

### Layouts & Pages (Server Components)
- `src/app/layout.tsx` — Layout raiz
- `src/app/page.tsx` — Home
- `src/app/inicio/page.tsx` — Página inicial com carrossel
- `src/app/pacotes/page.tsx` — Pacotes disponíveis
- `src/app/roteiro/page.tsx` — Itinerários
- `src/app/login/page.tsx` — Login
- `src/app/registro/page.tsx` — Registro
- `src/app/contato/page.tsx` — Contato

### Componentes (Client Components)
- `Header.tsx` — Navegação principal
- `Footer.tsx` — Rodapé
- `Carousel.tsx` — Carrossel de imagens
- `Form.tsx` — Componente de formulário reutilizável

## 🎨 Estilos

Todos os estilos usam **CSS Modules** (`.module.css`). Cada página e componente tem seu próprio arquivo de estilos.

### Paleta de Cores
- Azul escuro: `#004b6b`
- Azul claro: `#003b58`
- Amarelo ouro: `#ffd700`
- Fundo: `#f5f7fa`

## 🚀 Fluxo de Desenvolvimento

1. **Criar uma nova página**
   ```bash
   # Criar diretório
   mkdir -p src/app/nova-pagina
   
   # Criar arquivo de página
   touch src/app/nova-pagina/page.tsx
   touch src/app/nova-pagina/page.module.css
   ```

2. **Importar componentes**
   ```tsx
   import Header from '@/components/Header'
   import Footer from '@/components/Footer'
   ```

3. **Adicionar estilos**
   ```tsx
   import styles from './page.module.css'
   
   // Usar no JSX
   <div className={styles.container}>...</div>
   ```

4. **Executar e testar**
   ```bash
   npm run dev
   # Acessar http://localhost:3000/nova-pagina
   ```

## 📝 Exemplos de Código

### Criar uma Página Simples
```tsx
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import styles from './page.module.css'

export default function ExemploPage() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <h1>Exemplo</h1>
      </main>
      <Footer />
    </>
  )
}
```

### Usar o Componente Form
```tsx
import { Form } from '@/components/Form'

export default function ContatoPage() {
  const handleSubmit = async (data) => {
    console.log('Form data:', data)
  }

  return (
    <Form
      fields={[
        {
          id: 'email',
          label: 'Email',
          type: 'email',
          required: true
        }
      ]}
      onSubmit={handleSubmit}
      submitLabel="Enviar"
    />
  )
}
```

### Usar o Carrossel
```tsx
import Carousel from '@/components/Carousel'

export default function InícioPage() {
  return (
    <Carousel
      images={[
        { src: '/img1.jpg', alt: 'Descrição 1' },
        { src: '/img2.jpg', alt: 'Descrição 2' }
      ]}
    />
  )
}
```

## 🔧 Configuração

- **TypeScript**: `tsconfig.json` — Configurado com path aliases (`@/*`)
- **ESLint**: `.eslintrc.json` — Regras Next.js
- **Next.js**: `next.config.mjs` — Configurações do framework

## 📱 Responsividade

Todos os componentes incluem breakpoints móveis:
```css
@media (max-width: 768px) {
  /* Estilos para dispositivos móveis */
}
```

## 🖼️ Imagens

As imagens placeholder estão em `public/placeholder-*.jpg`. Substitua-as por imagens reais quando disponível:
- `placeholder-1.jpg` — Imagem 1
- `placeholder-2.jpg` — Imagem 2
- `placeholder-3.jpg` — Imagem 3
- `placeholder-4.jpg` — Imagem 4

## 🐛 Debugging

```bash
# Ver output de build
npm run build

# Rodar linter
npm run lint

# Iniciar servidor de produção
npm start
```

## 📚 Recursos Úteis

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🎉 Pronto para Começar!

```bash
npm install
npm run dev
# Acesse http://localhost:3000
```

Happy coding! 🚀
