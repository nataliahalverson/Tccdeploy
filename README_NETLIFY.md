# Deploy no Netlify (Next.js)

Modo: SSR/ISR com plugin oficial.
Publish: .next

Passos (UI): Base dir em branco; Build: `npm ci && npm run build`; Publish: `.next`; Plugin: `@netlify/plugin-nextjs`; Node: 18.x.

Env de build: defina `NEXT_PUBLIC_BACKEND_URL` em Site settings → Environment variables.

Opcional: verifique a pasta gerada localmente:

node scripts/ls-next.mjs
