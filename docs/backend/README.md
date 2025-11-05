# Backend

Backend Node/Express extraído do código que vivia em `src/server`. Este diretório passa a ser a base principal da API.

## Scripts

- `npm run dev:server` – inicia o backend em modo desenvolvimento com `tsx`.
- `npm run build:server` – gera a saída compilada em `backend/dist`.

## Prisma

O projeto principal já contém `prisma` e `@prisma/client` nas dependências. Continue executando migrações a partir da raiz:

```cmd
npx prisma migrate dev
```

Garanta que a variável `DATABASE_URL` esteja presente tanto localmente (`.env.local`) quanto nas plataformas de deploy.
