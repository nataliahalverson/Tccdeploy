# Fix CORS (Railway) e 403 de Imagens (Next.js no Netlify)

Este ajuste corrige:
- CORS da API (Express) para aceitar `https://formpluus.netlify.app` e `http://localhost:3000`, responder preflight `OPTIONS` antes de auth e suportar cookies.
- 403 em imagens no Netlify desativando a otimização de imagens do Next por enquanto.

## Testes rápidos

Preflight (substitua a URL da API se necessário):

curl -i -X OPTIONS "https://form-production-f3d7.up.railway.app/auth/me" \
  -H "Origin: https://formpluus.netlify.app" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type, Authorization"

Esperado: `Access-Control-Allow-Origin: https://formpluus.netlify.app`, `Access-Control-Allow-Credentials: true`, métodos e headers permitidos, `Vary: Origin`.

Chamada real (cookies):

```js
await fetch("https://form-production-f3d7.up.railway.app/auth/me", {
  credentials: "include",
});
```

Chamada real (token):

```js
await fetch("https://form-production-f3d7.up.railway.app/auth/me", {
  headers: { Authorization: "Bearer <token>" },
});
```

Nota sobre cookies: em produção os cookies saem com `SameSite=None; Secure` para permitir cross-site (Netlify → Railway). Em dev: `SameSite=Lax`.

## Deploy

- Backend (Railway): defina `CORS_ALLOWED_ORIGINS=https://formpluus.netlify.app,http://localhost:3000` e redeploy.
- Frontend (Netlify): `Base directory` vazio; `Build`: `npm ci && npm run build`; `Publish`: `.next`; Plugin `@netlify/plugin-nextjs`; Node 18.x. Faça `Clear cache and deploy` se trocou Node/dependências.
